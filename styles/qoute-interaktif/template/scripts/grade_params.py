#!/usr/bin/env python3
"""
Normalisasi warna VIDEO penceramah — supaya semua video NakSeeHeart selaras.

Menganalisis N bingkai merentas video (sama seperti grade_frame.py langkah 1, 2 & 3c):
  - imbangan putih daripada piksel neutral terang (kopiah/dinding/siling) + sedikit hangat
  - pendedahan: luminans median wajah -> 0.50
  - ketepuan wajah -> 0.30
Nilai median dipakai untuk keseluruhan video (tiada kelipan antara bingkai).
Look emas/teal TIDAK ditambah di sini — komposisi video sudah ada lapisan Grade yang sama.

Guna: python3 -I grade_params.py <video.mp4> <faceX> <faceY> [n_bingkai=12]
Output (stdout, baris terakhir): rantaian penapis ffmpeg (RGB, selamat untuk saluran alfa).
"""
import subprocess, sys, json
import numpy as np

TARGET_FACE_LUMA, TARGET_SAT = 0.50, 0.30
WARMTH = np.array([1.035, 1.0, 0.95])

video, fx, fy = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
n = int(sys.argv[4]) if len(sys.argv) > 4 else 12
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video],
                           capture_output=True, text=True, check=True).stdout)
W, H = 540, 960  # analisis pada separuh resolusi


def luma(x): return 0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2]
def sat(x):
    mx, mn = x.max(-1), x.min(-1)
    return np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0)


gains, gammas, sats = [], [], []
for i in range(n):
    t = dur * (i + 0.5) / n
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", video, "-frames:v", "1", "-vf", f"scale={W}:{H}",
                          "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
    im = np.frombuffer(raw, np.uint8).reshape(H, W, 3).astype(np.float64) / 255
    L, S = luma(im), sat(im)
    cand = (S < 0.18) & (L < 0.97) & (L > np.percentile(L, 70))
    if cand.sum() < 200:
        cand = L > np.percentile(L, 90)
    ref = im[cand].mean(0)
    g = np.clip(ref.mean() / np.maximum(ref, 1e-3), 0.75, 1.35)
    im2 = np.clip(im * g * WARMTH, 0, 1)
    r = int(min(W, H) * 0.14)
    cx, cy = fx / 2, fy / 2
    face = im2[int(max(0, cy - r)):int(cy + r), int(max(0, cx - r)):int(cx + r)]
    m = np.median(luma(face))
    gm = float(np.clip(np.log(TARGET_FACE_LUMA) / np.log(max(m, 1e-3)), 0.6, 1.6))
    face2 = np.clip(face, 1e-6, 1) ** gm
    sf = float(np.clip(TARGET_SAT / max(sat(face2).mean(), 1e-3), 0.8, 1.25))
    gains.append(g * WARMTH); gammas.append(gm); sats.append(sf)

G = np.median(np.array(gains), 0)
gm = float(np.median(gammas))
sf = float(np.median(sats))
print(json.dumps({"gain": [round(x, 4) for x in G], "gamma": round(gm, 3), "saturation": round(sf, 3)}), file=sys.stderr)
# rantaian ffmpeg: RGB (alfa dikekalkan) -> gandaan saluran -> gamma -> ketepuan
chain = (f"format=rgba,colorchannelmixer=rr={G[0]:.4f}:gg={G[1]:.4f}:bb={G[2]:.4f},"
         f"lutrgb=r='clip(pow(val/255\\,{gm:.4f})*255\\,0\\,255)':g='clip(pow(val/255\\,{gm:.4f})*255\\,0\\,255)':b='clip(pow(val/255\\,{gm:.4f})*255\\,0\\,255)',"
         f"hue=s={sf:.3f}")
print(chain)
