"""Siluet hitam penceramah untuk babak 'silhouette' (Nasihat V4).
   python3 -I make_silhouette.py public/media/cover-cutout.png public/media/silhouette.png
   Ambil alfa cut-out rembg, kekalkan komponen terbesar sahaja (buang serpihan kereta/latar)."""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage
src, dst = sys.argv[1], sys.argv[2]
a = np.array(Image.open(src).convert('RGBA'))[:, :, 3] > 128
lab, n = ndimage.label(a)
if n:
    sizes = ndimage.sum(a, lab, range(1, n + 1))
    a = lab == (1 + int(np.argmax(sizes)))
a = ndimage.binary_fill_holes(ndimage.binary_closing(a, iterations=3))
out = np.zeros(a.shape + (4,), np.uint8); out[:, :, 3] = (a * 255).astype(np.uint8)
Image.fromarray(out, 'RGBA').save(dst)
print('✔', dst)
