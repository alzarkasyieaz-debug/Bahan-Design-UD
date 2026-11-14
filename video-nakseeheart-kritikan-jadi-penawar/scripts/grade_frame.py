#!/usr/bin/env python3
"""
Gred warna standard NakSeeHeart untuk bingkai cover — supaya SEMUA cover selaras
walaupun rakaman asal berbeza pencahayaan (dinding putih, kereta hangat, kereta kebiruan).

Langkah:
 1. Imbangan putih: purata piksel neutral paling terang (kopiah / dinding / siling, tepu rendah,
    tidak terlebih dedah) dijadikan neutral, kemudian sedikit hangat.
 2. Pendedahan: luminans median kawasan wajah (tengah bingkai) dibawa ke sasaran yang sama.
 3. Look NakSeeHeart: kontras S-curve lembut, highlight emas hangat, bayang teal-charcoal,
    ketepuan dinormalkan.

Guna: python3 -I grade_frame.py <masuk.jpg> <keluar.jpg> [faceX faceY]
      (faceX/faceY = pusat wajah dalam piksel; lalai tengah bingkai)
"""
import sys
import numpy as np
from PIL import Image

TARGET_FACE_LUMA = 0.50   # luminans median wajah selepas gred
TARGET_SAT = 0.30         # ketepuan purata kawasan wajah
WARMTH = (1.035, 1.0, 0.95)  # selepas neutral: sedikit hangat

src, dst = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float64) / 255.0
H, W, _ = im.shape
fx = float(sys.argv[3]) if len(sys.argv) > 3 else W / 2
fy = float(sys.argv[4]) if len(sys.argv) > 4 else H / 2

def luma(x):
    return 0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2]

def sat(x):
    mx, mn = x.max(-1), x.min(-1)
    return np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0)

# 1) imbangan putih daripada piksel neutral terang
L, S = luma(im), sat(im)
cand = (S < 0.18) & (L < 0.97) & (L > np.percentile(L, 70))
if cand.sum() < 500:
    cand = L > np.percentile(L, 90)
ref = im[cand].mean(0)
gain = ref.mean() / np.maximum(ref, 1e-3)
gain = np.clip(gain, 0.75, 1.35)
im = np.clip(im * gain * np.array(WARMTH), 0, 1)

# 2) pendedahan: median luminans kawasan wajah -> sasaran (gamma)
r = int(min(W, H) * 0.14)
y0, y1 = int(max(0, fy - r)), int(min(H, fy + r))
x0, x1 = int(max(0, fx - r)), int(min(W, fx + r))
face = im[y0:y1, x0:x1]
m = np.median(luma(face))
g = np.clip(np.log(TARGET_FACE_LUMA) / np.log(max(m, 1e-3)), 0.55, 1.8)
im = np.clip(im, 1e-6, 1) ** g

# 3a) kontras S-curve lembut (berpusat 0.5)
k = 0.35
im = np.clip(im + k * im * (1 - im) * (2 * im - 1), 0, 1)

# 3b) split-toning (kekalkan luminans): bayang ke teal-charcoal, highlight ke emas hangat
Lg = luma(im)[..., None]
shadow_tone = np.array([0.25, 0.43, 0.45])   # muted teal #406E73
high_tone = np.array([0.85, 0.71, 0.42])     # warm gold #D8B46A
ws = np.clip(1 - Lg * 2.2, 0, 1) * 0.12
wh = np.clip((Lg - 0.55) * 2.2, 0, 1) * 0.10
im = im + ws * (shadow_tone / luma(shadow_tone) * Lg - im) + wh * (high_tone / luma(high_tone) * Lg - im)
im = np.clip(im, 0, 1)

# 3c) normalisasi ketepuan (kawasan wajah)
face = im[y0:y1, x0:x1]
cur = sat(face).mean()
f = float(np.clip(TARGET_SAT / max(cur, 1e-3), 0.8, 1.3))
Lg = luma(im)[..., None]
im = np.clip(Lg + (im - Lg) * f, 0, 1)

Image.fromarray((im * 255 + 0.5).astype(np.uint8)).save(dst, quality=95)
print(f"gred: gain={np.round(gain,3)} gamma={g:.2f} sat×{f:.2f} -> {dst}")
