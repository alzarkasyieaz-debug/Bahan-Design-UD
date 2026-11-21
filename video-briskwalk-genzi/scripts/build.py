"""Bina video liputan Briskwalk GenZI (1080x1920, 30 fps, H.264/AAC) daripada edit.json.

Penggunaan:
  python3 scripts/build.py <folder_bahan>            # folder berisi fail asal dari Google Drive
Langkah: syot -> base (xfade) -> audio (ambien + muzik dgn ducking) -> overlay grafik -> MP4 akhir.
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1]
cfg = json.load(open(os.path.join(ROOT, "edit.json")))
FPS = cfg["fps"]; W, H = 1080, 1920
B = os.path.join(ROOT, "build"); os.makedirs(os.path.join(B, "shots"), exist_ok=True)
OUTDIR = os.path.join(ROOT, "out"); os.makedirs(OUTDIR, exist_ok=True)
CUT = 1 / FPS

shots = cfg["shots"]
starts, t = [], 0.0
for s in shots:
    starts.append(t); t += s["dur"]
TOTAL = t
assert abs(TOTAL - cfg["duration"]) < 1e-6, TOTAL
for i, s in enumerate(shots):
    nxt = shots[i + 1].get("xfade_in", 0) if i + 1 < len(shots) else 0
    s["_out"] = nxt if nxt > 0 else (CUT if i + 1 < len(shots) else 0)
    s["_len"] = s["dur"] + s["_out"]

GRADE = "eq=contrast=1.06:saturation=1.10:gamma=1.02,colorbalance=rs=0.02:gs=0.0:bs=-0.02:rm=0.015:bm=-0.01"


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(" ".join(cmd)); print(r.stderr[-3000:]); sys.exit(1)


def render_video(s, out):
    sp = s.get("speed", 1.0); L = s["_len"]
    n = int(round(L * FPS))
    push = s.get("push", 1.05)
    # upscale 2x dahulu supaya zoompan licin, kemudian push-in perlahan
    vf = (f"setpts=(PTS-STARTPTS)/{sp},fps={FPS},"
          f"scale=2160:3840:flags=lanczos,"
          f"zoompan=z='1+({push}-1)*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps={FPS},"
          f"unsharp=5:5:0.6:5:5:0.0,{GRADE},format=yuv420p")
    amb = s.get("amb", 0.0)
    af = f"asetpts=PTS-STARTPTS,"
    if sp != 1.0:
        af += f"atempo={sp},"
    af += f"aresample=48000,volume={amb},afade=t=in:d=0.06,afade=t=out:st={max(0, L - 0.08)}:d=0.08,apad,atrim=0:{L}"
    run(["ffmpeg", "-y", "-v", "error", "-ss", str(s["in"]), "-t", str(L * sp + 0.2), "-i", os.path.join(SRC, s["src"]),
         "-vf", vf, "-af", af, "-frames:v", str(n), "-t", str(L), "-ac", "2",
         "-c:v", "libx264", "-preset", "medium", "-crf", "12", "-c:a", "pcm_s16le", out])


def render_photo(s, out):
    L = s["_len"]; n = int(round(L * FPS))
    im = Image.open(os.path.join(SRC, s["photo"])).convert("RGB")
    im = ImageEnhance.Contrast(im).enhance(1.04)
    im = ImageEnhance.Color(im).enhance(1.06)
    z0, z1 = s.get("zoom", [1.0, 1.1]); fx0, fx1 = s.get("fx", [0.5, 0.5]); fy0, fy1 = s.get("fy", [0.5, 0.5])
    dim = s.get("dim", 1.0)
    portrait = im.height > im.width
    if not portrait:  # latar kabur + foto penuh di tengah
        bgsrc = im.crop(((im.width - im.height * 9 / 16) / 2, 0, (im.width + im.height * 9 / 16) / 2, im.height)).resize((W, H))
        bg = ImageEnhance.Brightness(bgsrc.filter(ImageFilter.GaussianBlur(40))).enhance(0.55)
    p = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-f", "lavfi", "-t", str(L), "-i", "anullsrc=r=48000:cl=stereo",
                          "-c:v", "libx264", "-preset", "medium", "-crf", "12", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", "-shortest", out],
                         stdin=subprocess.PIPE)
    for k in range(n):
        u = k / max(1, n - 1); e = u * u * (3 - 2 * u) * 0.35 + u * 0.65
        z = z0 + (z1 - z0) * e; fx = fx0 + (fx1 - fx0) * e; fy = fy0 + (fy1 - fy0) * e
        if portrait:
            cw = im.height * 9 / 16 / z; ch = im.height / z
            cw = min(cw, im.width / z * 1.0)
            ch = cw * 16 / 9
            x0 = fx * im.width - cw / 2; y0 = fy * im.height - ch / 2
            x0 = min(max(0, x0), im.width - cw); y0 = min(max(0, y0), im.height - ch)
            fr = im.transform((W, H), Image.AFFINE, (cw / W, 0, x0, 0, ch / H, y0), resample=Image.BICUBIC)
        else:
            fw = W * 1.0 * z; fh = fw * im.height / im.width
            fr = bg.copy()
            fg = im.resize((int(fw), int(fh)), Image.LANCZOS)
            sx = (fg.width - W) * fx if fg.width > W else 0
            fg = fg.crop((int(sx), 0, int(sx) + W, fg.height)) if fg.width > W else fg
            fr.paste(fg, ((W - fg.width) // 2, int((H - fg.height) / 2 + (0.5 - fy) * 80)))
        if dim != 1.0:
            fr = ImageEnhance.Brightness(fr.filter(ImageFilter.GaussianBlur(6))).enhance(dim)
        p.stdin.write(fr.tobytes())
    p.stdin.close(); p.wait()


# 1) SYOT
for s in shots:
    out = os.path.join(B, "shots", s["id"] + ".mkv")
    if os.environ.get("REUSE_SHOTS") and os.path.exists(out):
        continue
    print("syot", s["id"], f"{s['_len']:.2f}s", flush=True)
    (render_photo if "photo" in s else render_video)(s, out)

# 2) BASE + AUDIO AMBIEN
inputs, fc = [], []
for s in shots:
    inputs += ["-i", os.path.join(B, "shots", s["id"] + ".mkv")]
prev = "0:v"
for i in range(1, len(shots)):
    d = shots[i].get("xfade_in", 0) or CUT
    trans = "fade" if shots[i].get("xfade_in", 0) else "fade"
    lab = f"v{i}"
    fc.append(f"[{prev}][{i}:v]xfade=transition={trans}:duration={d:.4f}:offset={starts[i]:.4f}[{lab}]")
    prev = lab
alabs = []
for i, s in enumerate(shots):
    fc.append(f"[{i}:a]adelay={int(starts[i] * 1000)}|{int(starts[i] * 1000)}[a{i}]"); alabs.append(f"[a{i}]")
fc.append("".join(alabs) + f"amix=inputs={len(shots)}:normalize=0:duration=longest,atrim=0:{TOTAL}[amb]")
base = os.path.join(B, "base.mkv")
run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(fc), "-map", f"[{prev}]", "-map", "[amb]",
     "-t", str(TOTAL), "-c:v", "libx264", "-preset", "medium", "-crf", "12", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", base])
print("base siap", flush=True)

# 3) MUZIK: ducking ketika bunyi asal penting (kiraan senaman, sorakan flag off)
duck = cfg.get("duck", [])
def vol_expr():
    e = "1"
    for a, b, lv in duck:  # ramp 0.4s
        r = 0.4
        seg = f"if(between(t,{a - r},{b + r}),{lv}+(1-{lv})*max(0,max(({a}-t)/{r},(t-{b})/{r})),1)"
        e = f"min({e},{seg})"
    return e
music = os.path.join(ROOT, "public", "audio", "muzik.wav")
mix = os.path.join(B, "mix.wav")
run(["ffmpeg", "-y", "-v", "error", "-i", base, "-i", music, "-filter_complex",
     f"[1:a]atrim=0:{TOTAL},volume=0.62,volume='{vol_expr()}':eval=frame[m];"
     f"[0:a]highpass=f=90,volume=1.0[a];[m][a]amix=inputs=2:normalize=0,"
     f"afade=t=out:st={TOTAL - 1.5}:d=1.5,loudnorm=I=-14:TP=-1.5:LRA=9[o]",
     "-map", "[o]", "-ar", "48000", mix])

# 4) OVERLAY GRAFIK
ov = os.path.join(B, "ov")
run([sys.executable, os.path.join(ROOT, "scripts", "overlay.py"), ov])

# 5) MP4 AKHIR
final = os.path.join(OUTDIR, cfg.get("output", "briskwalk-genzi.mp4"))
run(["ffmpeg", "-y", "-v", "error", "-i", base, "-framerate", str(FPS), "-i", os.path.join(ov, "%05d.png"), "-i", mix,
     "-filter_complex", "[0:v][1:v]overlay=0:0:format=auto,format=yuv420p[v]", "-map", "[v]", "-map", "2:a",
     "-t", str(TOTAL), "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-profile:v", "high", "-pix_fmt", "yuv420p",
     "-r", str(FPS), "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", final])
print("SIAP:", final)
