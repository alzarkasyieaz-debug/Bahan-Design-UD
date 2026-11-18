#!/usr/bin/env python3
"""
Muat turun gambar daripada pautan album kongsi Google Photos ke folder album/ (000.jpg, 001.jpg, …)
dan jana lembaran kenalan (album/sheets/sNN.jpg) berlabel untuk memilih gambar.

Guna:  python3 scripts/fetch_album.py [pautan-album] [folder-output]   (lalai: "album" dalam projects/<slug>/project.config.json, album/<slug>/)
Nota:  halaman album kongsi hanya memuat ~300 item pertama. Untuk album lebih besar, muat turun
       dari Google Photos secara manual dan letak sebagai album/NNN.jpg mengikut susunan masa.
Perlu: rangkaian ke photos.app.goo.gl, photos.google.com, lh3.googleusercontent.com ; Pillow
"""
import json, os, re, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw, ImageFont, ImageOps

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from project_paths import CONFIG, ALBUM_DIR  # noqa: E402
url = sys.argv[1] if len(sys.argv) > 1 else CONFIG["album"]
OUT = sys.argv[2] if len(sys.argv) > 2 else ALBUM_DIR
os.makedirs(os.path.join(OUT, "sheets"), exist_ok=True)

req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req).read().decode("utf8")
items, seen = [], set()
for pid, u, w, h in re.findall(r'\["(AF1Qip[A-Za-z0-9_-]+)",\["(https://lh3\.googleusercontent\.com/pw/[A-Za-z0-9_-]+)",(\d+),(\d+)', html):
    if pid not in seen:
        seen.add(pid)
        items.append(u)
title = re.search(r"<title>(.*?)</title>", html)
print("Album:", title.group(1) if title else "?", "|", len(items), "item")


def get(a):
    i, u = a
    p = os.path.join(OUT, f"{i:03d}.jpg")
    if not os.path.exists(p):
        urllib.request.urlretrieve(u + "=w2400-h2400", p)


with ThreadPoolExecutor(12) as ex:
    list(ex.map(get, enumerate(items)))

font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
T, C, R = 320, 6, 5
files = sorted(f for f in os.listdir(OUT) if f.endswith(".jpg"))
for s in range(0, len(files), C * R):
    sh = Image.new("RGB", (C * T, R * T), "black")
    d = ImageDraw.Draw(sh)
    for k, fn in enumerate(files[s:s + C * R]):
        im = ImageOps.exif_transpose(Image.open(os.path.join(OUT, fn)))
        im.thumbnail((T - 6, T - 6))
        x, y = (k % C) * T, (k // C) * T
        sh.paste(im, (x + (T - im.width) // 2, y + (T - im.height) // 2))
        d.rectangle([x, y, x + 60, y + 34], fill="black")
        d.text((x + 4, y + 2), fn[:3], font=font, fill="yellow")
    sh.save(os.path.join(OUT, "sheets", f"s{s // 30:02d}.jpg"), quality=80)
print("Siap:", OUT)
