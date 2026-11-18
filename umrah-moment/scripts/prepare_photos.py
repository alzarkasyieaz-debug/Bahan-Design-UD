#!/usr/bin/env python3
"""
Sediakan gambar jemaah untuk video (tiada suntingan wajah/kandungan — hanya saiz semula,
orientasi EXIF dan versi latar kabur untuk gambar potret).

Guna:  python3 scripts/prepare_photos.py [folder-gambar-asal]   (lalai: album/ hasil fetch_album.py)
Folder asal mengandungi fail bernombor 000.jpg … 299.jpg (susunan album Google Photos
"USJ 30 Sept-9 Okt"). Output: public/img/pNNN.jpg, public/img/pNNN_bg.jpg, src/data/photos.json
"""
import json, os, re, sys
from PIL import Image, ImageOps, ImageFilter, ImageEnhance
import numpy as np

ROOT0 = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
# Gambar dipilih secara automatik daripada src/project.tsx (semua rujukan pNNN)
_src = open(os.path.join(ROOT0, "src", "project.tsx"), encoding="utf8").read()
SELECTED = sorted({int(n) for n in re.findall(r"['\"]p(\d{3})['\"]", _src)})

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "album")
OUT = os.path.join(ROOT, "public", "img")
FX = os.path.join(ROOT, "public", "fx")
os.makedirs(OUT, exist_ok=True)
os.makedirs(FX, exist_ok=True)
meta = {}
for f in os.listdir(OUT):
    if f.startswith("p") and f.endswith(".jpg"):
        os.remove(os.path.join(OUT, f))
for i in SELECTED:
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, f"{i:03d}.jpg"))).convert("RGB")
    im.thumbnail((2200, 2200), Image.LANCZOS)
    name = f"p{i:03d}"
    im.save(os.path.join(OUT, name + ".jpg"), quality=86, optimize=True, progressive=True)
    bg = im.copy()
    bg.thumbnail((640, 640))
    bg = bg.filter(ImageFilter.GaussianBlur(18))
    bg = ImageEnhance.Brightness(bg).enhance(0.55)
    bg.save(os.path.join(OUT, name + "_bg.jpg"), quality=80)
    meta[name] = [im.width, im.height]
    print(name, im.size)

# Tekstur film grain (4 bingkai, diulang)
rng = np.random.default_rng(7)
for k in range(4):
    n = rng.normal(128, 38, (512, 512)).clip(0, 255).astype(np.uint8)
    Image.fromarray(n, "L").save(os.path.join(FX, f"grain{k}.png"))

json.dump(meta, open(os.path.join(ROOT, "src", "data", "photos.json"), "w"), indent=1)
