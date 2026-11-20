#!/usr/bin/env python3
"""
Sediakan klip video daripada bahan asal (raw/) mengikut src/data/edl.json.

Bagi setiap klip B-roll:
  potong -> skala 1080x1920 -> (pilihan) stabilisasi vidstab -> slow motion
  (interpolasi gerakan minterpolate) -> gred warna sinematik -> public/clips/<id>.mp4
Video Master: skala 720p -> 1080x1920 (lanczos + sharpen), gred warna -> public/clips/master.mp4
Audio ucapan: dibersihkan (high-pass, denoise, EQ, compressor) -> public/audio/ucapan.wav
Ambien PPS (bunyi sebenar dari B-roll) -> public/audio/ambien.wav

Jalankan:  python3 scripts/prep_clips.py   (perlu ffmpeg dengan libvidstab)
"""
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW = os.path.join(ROOT, "raw")
CLIPS = os.path.join(ROOT, "public", "clips")
AUD = os.path.join(ROOT, "public", "audio")
TMP = os.path.join(ROOT, "out", "tmp")
for d in (CLIPS, AUD, TMP):
    os.makedirs(d, exist_ok=True)

EDL = json.load(open(os.path.join(ROOT, "src", "data", "edl.json")))
HANDLE = 0.5

# Gred warna: sedikit muted, kontras lembut, tona kulit hangat, hitam sedikit diangkat (filmic)
BASE = ("eq=contrast=1.05:saturation={sat}:gamma=0.97:brightness=-0.01,"
        "colorbalance=rs={wr}:gs=0.0:bs={wb}:rm=0.025:bm=-0.03:rh=0.02:bh=-0.025,"
        "curves=all='0/0.035 0.25/0.23 0.5/0.49 0.75/0.77 1/0.96'")
GRADES = {
    None:   BASE.format(sat=0.80, wr=0.02, wb=-0.02),
    "hook": BASE.format(sat=0.66, wr=-0.01, wb=0.02) + ",eq=brightness=-0.03",
    "soft": BASE.format(sat=0.78, wr=0.04, wb=-0.04) + ",gblur=sigma=0.4",
}
ENC = ["-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", "-an"]


def run(cmd):
    r = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if r.returncode != 0:
        sys.stderr.write(r.stderr[-3000:])
        raise SystemExit(f"Gagal: {' '.join(cmd[:8])}...")


def prep_broll(c):
    out = os.path.join(CLIPS, f"{c['id']}.mp4")
    if os.path.exists(out):
        return f"{c['id']} (sedia ada)"
    dur_out = c["end"] - c["start"] + (0 if c.get("last") else HANDLE)
    sp = c.get("speed", 1.0)
    src_dur = dur_out * sp + 0.15
    src = os.path.join(RAW, c["src"])
    stage = os.path.join(TMP, f"{c['id']}_s.mp4")
    # 1) potong + skala (ffmpeg memutar video potret secara automatik)
    run(["ffmpeg", "-v", "error", "-y", "-ss", str(c["srcIn"]), "-i", src, "-t", f"{src_dur:.3f}",
         "-vf", "scale=1080:1920:flags=lanczos,fps=30", "-c:v", "libx264", "-preset", "fast",
         "-crf", "10", "-pix_fmt", "yuv420p", "-an", stage])
    chain = []
    if c.get("stab"):
        trf = os.path.join(TMP, f"{c['id']}.trf")
        run(["ffmpeg", "-v", "error", "-y", "-i", stage, "-vf",
             f"vidstabdetect=shakiness=6:accuracy=12:result={trf}", "-f", "null", "-"])
        chain.append(f"vidstabtransform=input={trf}:smoothing=24:optzoom=1:zoomspeed=0.2:interpol=bicubic,unsharp=5:5:0.5")
    if sp < 1.0:
        chain.append(f"setpts=PTS/{sp}")
        chain.append("minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1")
    chain.append(GRADES[c.get("fx")])
    chain.append("fps=30")
    run(["ffmpeg", "-v", "error", "-y", "-i", stage, "-vf", ",".join(chain), "-t", f"{dur_out:.3f}"] + ENC + [out])
    return c["id"]


def prep_master():
    out = os.path.join(CLIPS, "master.mp4")
    if not os.path.exists(out):
        vf = ("scale=1080:1920:flags=lanczos,hqdn3d=1.5:1.5:3:3,unsharp=5:5:0.7:5:5:0.0,"
              + BASE.format(sat=0.84, wr=0.03, wb=-0.03) + ",fps=30")
        run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(RAW, "master.mp4"), "-vf", vf] + ENC + [out])
    return "master"


def prep_audio():
    sp_in, sp_out = EDL["speechIn"], EDL["speechOut"]
    af = ("highpass=f=85,lowpass=f=12500,afftdn=nf=-28:tn=1,"
          "equalizer=f=200:t=q:w=1.2:g=-2,equalizer=f=3200:t=q:w=1.5:g=2.5,"
          "acompressor=threshold=-22dB:ratio=3:attack=8:release=120:makeup=3,"
          f"afade=t=in:st=0:d=0.08,afade=t=out:st={sp_out - sp_in - 0.25:.2f}:d=0.25")
    run(["ffmpeg", "-v", "error", "-y", "-ss", str(sp_in), "-to", str(sp_out), "-i", os.path.join(RAW, "master.mp4"),
         "-af", af, "-ar", "48000", "-ac", "2", os.path.join(AUD, "ucapan.wav")])
    # Bunyi suasana sebenar PPS (dewan/kantin) untuk babak pembukaan & montaj
    run(["ffmpeg", "-v", "error", "-y", "-ss", "8", "-t", "9", "-i", os.path.join(RAW, "IMG_3358.MOV"),
         "-af", "highpass=f=120,lowpass=f=6000,afftdn=nf=-30,volume=0.9", "-ar", "48000", "-ac", "2",
         os.path.join(AUD, "ambien.wav")])
    return "audio"


if __name__ == "__main__":
    print(prep_audio())
    print(prep_master())
    broll = [c for c in EDL["clips"] if c["src"] != "master"]
    with ThreadPoolExecutor(max_workers=3) as ex:
        for r in ex.map(prep_broll, broll):
            print("siap:", r, flush=True)
