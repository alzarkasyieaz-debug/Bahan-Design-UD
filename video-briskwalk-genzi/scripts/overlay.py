"""Jana lapisan grafik (teks, lower third, isi penting, kad penutup) sebagai jujukan PNG RGBA 1080x1920 @30fps.

Semua masa (saat) adalah pada garis masa akhir video. Kawasan selamat telefon:
x 90-960 (elak butang kanan Reels/TikTok), y 260-1480 (elak kapsyen/UI bawah).
"""
import json, math, os, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS = 1080, 1920, 30
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
cfg = json.load(open(os.path.join(ROOT, "edit.json")))
DUR = cfg["duration"]
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "build", "ov")
os.makedirs(OUT, exist_ok=True)

FD = "/usr/share/fonts/opentype/inter/"
def F(name, size):
    return ImageFont.truetype(FD + name, size)

GOLD = (240, 196, 64)
GREEN = (22, 110, 60)
WHITE = (255, 255, 255)
INK = (12, 22, 16)


def ease(x):  # easeOutCubic
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3


def ease_io(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def window(t, t0, t1, fin=0.45, fout=0.35):
    """Pulangkan (kemajuan masuk 0..1, alfa keseluruhan)."""
    if t < t0 or t > t1:
        return None
    pin = ease((t - t0) / fin)
    pout = 1 - ease_io((t - (t1 - fout)) / fout) if t > t1 - fout else 1.0
    return pin, pin * pout


def text_layer(size, draw_fn):
    im = Image.new("RGBA", size, (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(im), im)
    return im


def shadowed(im, radius=14, alpha=150, off=(0, 6)):
    a = im.split()[3]
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    blk = Image.new("RGBA", im.size, (0, 0, 0, alpha))
    sh.paste(blk, (0, 0), a)
    sh = sh.filter(ImageFilter.GaussianBlur(radius))
    out = Image.new("RGBA", (im.width, im.height), (0, 0, 0, 0))
    out.alpha_composite(sh, off)
    out.alpha_composite(im)
    return out


def paste(canvas, layer, x, y, alpha):
    if alpha <= 0.003:
        return
    if alpha < 1:
        a = layer.split()[3].point(lambda v: int(v * alpha))
        layer = layer.copy(); layer.putalpha(a)
    canvas.alpha_composite(layer, (int(x), int(y)))


def tw(font, s):
    b = font.getbbox(s)
    return b[2] - b[0]


# ---------- komponen pra-render ----------
PAD = 40  # ruang bayang

def make_line(s, font, fill=WHITE, stroke=0):
    w = tw(font, s) + 2 * PAD; h = font.size + 2 * PAD + 10
    im = text_layer((w, h), lambda d, _: d.text((PAD, PAD), s, font=font, fill=fill, stroke_width=stroke, stroke_fill=INK))
    return shadowed(im)


def make_pill(s, font, bg=GOLD, fg=INK, px=26, py=14):
    w = tw(font, s) + 2 * px; h = font.size + 2 * py + 6
    im = Image.new("RGBA", (w + 2 * PAD, h + 2 * PAD), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((PAD, PAD, PAD + w, PAD + h), radius=h // 2, fill=bg + (255,))
    d.text((PAD + px, PAD + py - font.getbbox(s)[1] + 4), s, font=font, fill=fg)
    return shadowed(im, 12, 110)


def make_chip(icon, s, font):
    """Cip maklumat (tarikh/lokasi): ikon bulat hijau + teks putih atas panel gelap lut sinar."""
    ih = font.size + 34
    w = ih + 18 + tw(font, s) + 34
    im = Image.new("RGBA", (w + 2 * PAD, ih + 2 * PAD), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((PAD, PAD, PAD + w, PAD + ih), radius=18, fill=(10, 20, 14, 185))
    d.ellipse((PAD + 8, PAD + 8, PAD + ih - 8, PAD + ih - 8), fill=GREEN + (255,))
    ic = F("Inter-Bold.otf", int(font.size * 0.8))
    d.text((PAD + ih / 2, PAD + ih / 2), icon, font=ic, fill=GOLD, anchor="mm")
    d.text((PAD + ih + 14, PAD + ih / 2), s, font=font, fill=WHITE, anchor="lm")
    return shadowed(im, 12, 90)


def make_point(num, s1, s2):
    """Isi penting bernombor (maks. 3)."""
    f1 = F("InterDisplay-ExtraBold.otf", 58); f2 = F("Inter-SemiBold.otf", 40)
    bw = 110
    w = bw + 30 + max(tw(f1, s1), tw(f2, s2)) + 50
    h = 170
    im = Image.new("RGBA", (w + 2 * PAD, h + 2 * PAD), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((PAD, PAD, PAD + w, PAD + h), radius=26, fill=(10, 22, 14, 200))
    d.rounded_rectangle((PAD, PAD, PAD + bw, PAD + h), radius=26, fill=GOLD + (255,))
    d.rectangle((PAD + bw - 26, PAD, PAD + bw, PAD + h), fill=GOLD + (255,))
    d.text((PAD + bw / 2, PAD + h / 2), str(num), font=F("InterDisplay-Black.otf", 86), fill=INK, anchor="mm")
    d.text((PAD + bw + 30, PAD + 34), s1, font=f1, fill=WHITE)
    d.text((PAD + bw + 32, PAD + 104), s2, font=f2, fill=GOLD)
    return shadowed(im, 16, 120)


def make_lower_third(name, role):
    f1 = F("InterDisplay-ExtraBold.otf", 50); f2 = F("Inter-SemiBold.otf", 36)
    w = max(tw(f1, name), tw(f2, role)) + 70; h = 150
    im = Image.new("RGBA", (w + 2 * PAD, h + 2 * PAD), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle((PAD, PAD, PAD + 12, PAD + h), fill=GOLD + (255,))
    d.rectangle((PAD + 12, PAD, PAD + w, PAD + 86), fill=(255, 255, 255, 245))
    d.rectangle((PAD + 12, PAD + 86, PAD + w, PAD + h), fill=GREEN + (245,))
    d.text((PAD + 36, PAD + 43), name, font=f1, fill=INK, anchor="lm")
    d.text((PAD + 36, PAD + 118), role, font=f2, fill=WHITE, anchor="lm")
    return shadowed(im, 14, 120), w


def make_sub(s):
    f = F("Inter-Bold.otf", 50)
    w = tw(f, s) + 56; h = 84
    im = Image.new("RGBA", (w + 2 * PAD, h + 2 * PAD), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((PAD, PAD, PAD + w, PAD + h), radius=14, fill=(0, 0, 0, 165))
    d.text((PAD + w / 2, PAD + h / 2), s, font=f, fill=WHITE, anchor="mm")
    return im


# ---------- jadual lapisan ----------
T = cfg["text"]
hook_a = make_line(T["hook"][0], F("InterDisplay-Bold.otf", 58), GOLD)
hook_b = [make_line(s, F("InterDisplay-Black.otf", 96)) for s in T["hook"][1:]]

title_a = make_line("BRISKWALK", F("InterDisplay-Black.otf", 150))
title_b = make_pill("GenZI", F("InterDisplay-Black.otf", 82))
chip_date = make_chip("◷", T["date"], F("Inter-SemiBold.otf", 42))
chip_loc = make_chip("⌖", T["location"], F("Inter-SemiBold.otf", 42))
lt, lt_w = make_lower_third(T["name"], T["role"])
points = [(p["t0"], p["t1"], make_point(i + 1, p["a"], p["b"])) for i, p in enumerate(T["points"])]
subs = [(s["t0"], s["t1"], make_sub(s["text"])) for s in T["subs"]]
msg = [make_line(s, F("InterDisplay-ExtraBold.otf", 84)) for s in T["message"]]

end_name1 = make_line("YB Ustaz", F("InterDisplay-Bold.otf", 62), GOLD)
end_name2 = make_line("Muhammad Ismi Mat Taib", F("InterDisplay-Black.otf", 80))
end_role = make_line("Ahli Parlimen Parit", F("Inter-SemiBold.otf", 52))
end_tag = make_pill("Parit Sejahtera Makmur Bersama", F("InterDisplay-ExtraBold.otf", 52), GREEN, WHITE, 34, 18)


def cx(layer):
    return (W - layer.width) / 2 - 20  # sedikit ke kiri, jauh dari butang kanan


def scrim(c, y0, y1, al):
    """Jalur gelap lembut di belakang teks supaya mudah dibaca."""
    h = y1 - y0
    import numpy as _np
    yy = _np.linspace(0, 1, h)
    prof = _np.minimum(1, _np.minimum(yy / 0.3, (1 - yy) / 0.3)) * 150 * al
    a = Image.fromarray(_np.repeat(prof[:, None], W, 1).astype("uint8"), "L")
    blk = Image.new("RGBA", (W, h), (0, 0, 0, 0)); blk.putalpha(a)
    c.alpha_composite(blk, (0, y0))


def frame(t):
    c = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    # 1. HOOK
    a0, a1 = T["hook_t"]
    r = window(t, a0, a1)
    if r:
        p, al = r
        y = 980
        scrim(c, 880, 1500, al)
        paste(c, hook_a, cx(hook_a), y - 30 * (1 - p), al)
        for i, L in enumerate(hook_b):
            ri = window(t, a0 + 0.18 * (i + 1), a1)
            if ri:
                pi, ali = ri
                paste(c, L, cx(L), y + 62 + i * 106 + 50 * (1 - pi), ali)
    # 2. TAJUK PROGRAM + tarikh/lokasi
    b0, b1 = T["title_t"]
    r = window(t, b0, b1)
    if r:
        p, al = r
        y = 560
        paste(c, title_a, cx(title_a) - 60 * (1 - p), y, al)
        r2 = window(t, b0 + 0.3, b1)
        if r2:
            sc = 0.6 + 0.4 * ease(min(1, (t - b0 - 0.3) / 0.35) * 1.0)
            pl = title_b.resize((int(title_b.width * sc), int(title_b.height * sc)), Image.LANCZOS)
            paste(c, pl, cx(pl), y + 205 + (title_b.height - pl.height) / 2, r2[1])
        for k, chip in enumerate((chip_date, chip_loc)):
            rk = window(t, b0 + 1.1 + 0.35 * k, b1)
            if rk:
                pk, ak = rk
                paste(c, chip, 90 - PAD + 0 - 80 * (1 - pk), 1180 + k * 128, ak)
    # 3. LOWER THIRD
    l0, l1 = T["lt_t"]
    r = window(t, l0, l1, 0.5, 0.4)
    if r:
        p, al = r
        # wipe dari kiri
        vis = int(lt.width * ease((t - l0) / 0.55))
        part = lt.crop((0, 0, max(1, vis), lt.height))
        paste(c, part, 90 - PAD, 1230, al)
    # 4. ISI PENTING
    for t0, t1, L in points:
        r = window(t, t0, t1, 0.45, 0.35)
        if r:
            p, al = r
            paste(c, L, 90 - PAD - 120 * (1 - p), 330, al)
    # 5. SARI KATA (dialog)
    for t0, t1, L in subs:
        r = window(t, t0, t1, 0.12, 0.12)
        if r:
            paste(c, L, cx(L) + 20, 1390, r[1])
    # 6. MESEJ PENUTUP
    m0, m1 = T["message_t"]
    r = window(t, m0, m1, 0.6, 0.45)
    if r:
        scrim(c, 720, 1260, r[1])
    for i, L in enumerate(msg):
        r = window(t, m0 + 0.35 * i, m1, 0.6, 0.45)
        if r:
            p, al = r
            paste(c, L, cx(L), 820 + i * 110 + 40 * (1 - p), al)
    # 7. KAD AKHIR
    e0 = T["end_t"]
    if t >= e0:
        seq = [(end_name1, 730, 0.0), (end_name2, 800, 0.25), (end_role, 920, 0.6), (end_tag, 1080, 1.1)]
        for L, y, dl in seq:
            r = window(t, e0 + dl, DUR + 1, 0.55, 0.3)
            if r:
                p, al = r
                fade_end = 1 - ease_io((t - (DUR - 0.9)) / 0.9) if t > DUR - 0.9 else 1
                paste(c, L, cx(L), y + 36 * (1 - p), al * fade_end)
        # garis emas
        r = window(t, e0 + 0.4, DUR + 1, 0.8, 0.3)
        if r:
            lw = int(360 * r[0])
            d = ImageDraw.Draw(c)
            fade_end = 1 - ease_io((t - (DUR - 0.9)) / 0.9) if t > DUR - 0.9 else 1
            d.rectangle(((W - lw) / 2 - 20, 1052, (W + lw) / 2 - 20, 1057), fill=GOLD + (int(255 * fade_end),))
    return c


if __name__ == "__main__":
    n = int(round(DUR * FPS))
    only = sys.argv[2:] if len(sys.argv) > 2 else None
    empty = None
    for i in range(n):
        t = i / FPS
        if only and str(i) not in only:
            continue
        fr = frame(t)
        path = os.path.join(OUT, f"{i:05d}.png")
        if fr.getbbox() is None:
            if empty is None:
                fr.save(path, compress_level=1); empty = path
            else:
                if os.path.exists(path): os.remove(path)
                os.link(empty, path)
            continue
        fr.save(path, compress_level=1)
    print("overlay frames:", n)
