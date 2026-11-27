"""Grafik gerak: tajuk, bab, lower third, subtitle, perkataan bertema, kredit."""
import os
from PIL import Image, ImageDraw, ImageFilter
from engine import font, draw_text, text_w, ease, eout, eexp, clamp01, window, ROOT, GOLD, CREAM


class Ov:
    def __init__(self, a, b, **kw):
        self.a, self.b, self.kw = a, b, kw

    def active(self, t):
        return self.a - 0.01 <= t <= self.b + 0.01


def _u(W, H):
    return min(W, H) / 1080


def _shadow_text(layer, xy, txt, f, fill, tracking=0, anchor="l", blur=6, sa=150):
    """Teks dengan bayang lembut supaya jelas di atas foto."""
    W, H = layer.size
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_text(ImageDraw.Draw(sh), (xy[0] + 2, xy[1] + 3), txt, f, (0, 0, 0, sa), tracking, anchor)
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    layer.alpha_composite(sh)
    draw_text(ImageDraw.Draw(layer), xy, txt, f, fill, tracking, anchor)


EMER = (24, 128, 100)
DARK = (8, 30, 32)


def kinetic(L, x, y, txt, f, col, tracking, lt, delay=0.035, rise=46, anchor="m", shadow=170, dur=0.55):
    """Teks kinetik: setiap huruf naik & muncul berperingkat; satu bayang untuk seluruh lapisan."""
    W, H = L.size
    tw = text_w(txt, f, tracking)
    x0 = x - tw / 2 if anchor == "m" else (x - tw if anchor == "r" else x)
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    cx = x0
    for i, ch in enumerate(txt):
        q = eout(clamp01((lt - i * delay) / dur))
        if q > 0 and ch != " ":
            d.text((cx, y + (1 - q) * rise), ch, font=f, fill=(*col[:3], int(col[3] * q)))
        cx += f.getlength(ch) + tracking
    if shadow:
        sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sh.putalpha(lay.getchannel("A").point(lambda v: int(v * shadow / 255)))
        sh = sh.filter(ImageFilter.GaussianBlur(9))
        L.alpha_composite(sh, (3, 5))
    L.alpha_composite(lay)
    return tw


class Title(Ov):
    """Tajuk utama: huruf kinetik + blok emas di belakang baris sorotan."""

    def draw(self, L, t):
        W, H = L.size; u = _u(W, H)
        lt = t - self.a
        a = window(t, self.a, self.b, 0.01, 0.9)
        lines = self.kw.get("lines", ["DARI PARIT", "KE TERENGGANU"])
        hl = self.kw.get("hl", 1)
        size = self.kw.get("size", 190)
        big = font("bebas", size * u)
        while max(text_w(l, big, 10 * u) for l in lines) > W * (0.86 if W > H else 0.76):
            size -= 6; big = font("bebas", size * u)
        lh = big.size * 1.02
        cy = H * self.kw.get("y", 0.40)
        d = ImageDraw.Draw(L)
        for i, ln in enumerate(lines):
            t0 = 0.2 + i * 0.4
            y = cy + (i - len(lines) / 2) * lh
            tw = text_w(ln, big, 10 * u)
            if i == hl:
                bp = ease(clamp01((lt - t0 + 0.15) / 0.6))
                pad = 26 * u
                x0 = W / 2 - tw / 2 - pad
                d.rectangle([x0, y + big.size * 0.08, x0 + (tw + 2 * pad) * bp, y + big.size * 0.98], fill=(*GOLD, int(245 * a)))
                kinetic(L, W / 2, y, ln, big, (*DARK, int(255 * a)), 10 * u, lt - t0 - 0.25, shadow=0)
            else:
                kinetic(L, W / 2, y, ln, big, (*CREAM, int(255 * a)), 10 * u, lt - t0)
        ly = cy + len(lines) / 2 * lh + 30 * u
        sub = self.kw.get("sub")
        if sub:
            sa = clamp01((lt - 1.4) / 0.8) * a
            _shadow_text(L, (W / 2, ly), sub, font("play", 58 * u), (*CREAM, int(255 * sa)), anchor="m")
            ly += 84 * u
        tag = self.kw.get("tag")
        if tag:
            tp = eout(clamp01((lt - 2.0) / 0.9))
            f = font("inter7", 24 * u)
            tw = text_w(tag, f, 6 * u)
            lw = (tw / 2 + 40 * u) * tp
            d.line([(W / 2 - lw, ly + 44 * u), (W / 2 + lw, ly + 44 * u)], fill=(*EMER, int(255 * a)), width=max(2, int(4 * u)))
            _shadow_text(L, (W / 2, ly), tag, f, (*GOLD, int(255 * tp * a)), tracking=6 * u, anchor="m")


class Chapter(Ov):
    """Tajuk bab: nombor besar bergaris emas + tajuk kinetik + garis sapuan."""

    def draw(self, L, t):
        W, H = L.size; u = _u(W, H)
        lt = t - self.a
        a = window(t, self.a, self.b, 0.01, 0.6)
        x = W * (0.06 if W > H else 0.08)
        y = H * (0.20 if W > H else 0.14)
        d = ImageDraw.Draw(L)
        num = self.kw.get("num", "")
        nf = font("bebas", 150 * u)
        na = eout(clamp01(lt / 0.7)) * a
        d.text((x - 4 * u, y - 52 * u + (1 - na) * 30 * u), num, font=nf, fill=(0, 0, 0, 0),
               stroke_width=max(2, int(3 * u)), stroke_fill=(*GOLD, int(200 * na)))
        sz = self.kw.get("size", 96)
        f = font("bebas", sz * u)
        while text_w(self.kw["title"], f, 5 * u) > W * 0.86 and sz > 40:
            sz -= 4; f = font("bebas", sz * u)
        ty = y + 112 * u
        kinetic(L, x, ty, self.kw["title"], f, (*CREAM, int(255 * a)), 5 * u, lt - 0.35, delay=0.025, anchor="l")
        lp = eout(clamp01((lt - 0.6) / 0.9))
        tw = text_w(self.kw["title"], f, 5 * u)
        d.rectangle([x, ty + f.size * 1.02, x + tw * lp, ty + f.size * 1.02 + 6 * u], fill=(*GOLD, int(255 * a)))
        d.rectangle([x, ty + f.size * 1.02 + 6 * u, x + tw * 0.35 * lp, ty + f.size * 1.02 + 12 * u], fill=(*EMER, int(255 * a)))


class Words(Ov):
    """Perkataan tema besar: huruf jatuh berperingkat + garis emas tebal."""

    def draw(self, L, t):
        W, H = L.size; u = _u(W, H)
        lt = t - self.a
        a = window(t, self.a, self.b, 0.01, 0.45)
        size = self.kw.get("size", 230)
        f = font("bebas", size * u)
        while text_w(self.kw["word"], f, 16 * u) > W * 0.9:
            size -= 8; f = font("bebas", size * u)
        y = H * self.kw.get("y", 0.42) - f.size / 2
        kinetic(L, W / 2, y, self.kw["word"], f, (*CREAM, int(255 * a)), 16 * u, lt, delay=0.05, rise=-70 * u, shadow=200)
        d = ImageDraw.Draw(L)
        lp = eout(clamp01((lt - 0.35) / 0.7))
        tw = text_w(self.kw["word"], f, 16 * u)
        yy = y + f.size * 1.0
        d.rectangle([W / 2 - tw / 2 * lp, yy, W / 2 + tw / 2 * lp, yy + 8 * u], fill=(*GOLD, int(255 * a)))
        r = 9 * u * lp
        for sx in (-1, 1):
            cx = W / 2 + sx * (tw / 2 * lp + 22 * u)
            d.polygon([(cx, yy + 4 * u - r), (cx + r, yy + 4 * u), (cx, yy + 4 * u + r), (cx - r, yy + 4 * u)], fill=(*EMER, int(255 * a)))


class Location(Ov):
    """Pendedahan lokasi: nama besar kinetik + garis emas + subtajuk."""

    def draw(self, L, t):
        W, H = L.size; u = _u(W, H)
        lt = t - self.a
        a = window(t, self.a, self.b, 0.01, 0.7)
        size = self.kw.get("size", 250)
        f = font("bebas", size * u)
        name = self.kw["name"]
        while text_w(name, f, 20 * u) > W * 0.9:
            size -= 8; f = font("bebas", size * u)
        y = H * self.kw.get("y", 0.33)
        kinetic(L, W / 2, y, name, f, (*CREAM, int(255 * a)), 20 * u, lt, delay=0.06, rise=80 * u, dur=0.8, shadow=210)
        d = ImageDraw.Draw(L)
        tw = text_w(name, f, 20 * u)
        yy = y + f.size * 1.02
        lw = (tw / 2) * eout(clamp01((lt - 0.5) / 1.0))
        d.rectangle([W / 2 - lw, yy, W / 2 + lw, yy + 7 * u], fill=(*GOLD, int(240 * a)))
        sa = clamp01((lt - 0.9) / 0.7) * a
        sub = self.kw.get("sub", "")
        sf = font("play", 62 * u)
        sw = text_w(sub, sf)
        bx = W / 2 - sw / 2 - 24 * u
        d.rectangle([bx, yy + 26 * u, bx + (sw + 48 * u) * eout(clamp01((lt - 0.8) / 0.6)), yy + 26 * u + sf.size * 1.35], fill=(*EMER, int(225 * a)))
        draw_text(d, (W / 2, yy + 30 * u), sub, sf, (*CREAM, int(255 * sa)), anchor="m")


class Lower(Ov):
    """Lower third berani: blok emerald + bar emas tebal + teks kinetik."""

    def draw(self, L, t):
        W, H = L.size; u = _u(W, H)
        lt = t - self.a
        a = window(t, self.a, self.b, 0.01, 0.45)
        x = W * (0.06 if W > H else 0.07)
        y = H * self.kw.get("y", 0.70 if W > H else 0.64)
        d = ImageDraw.Draw(L)
        p = eexp(clamp01((lt - 0.1) / 0.8))
        f1 = font("inter7", self.kw.get("s1", 52) * u)
        f2 = font("inter7", 26 * u)
        l1, l2 = self.kw["l1"], self.kw.get("l2", "").upper()
        w = max(text_w(l1, f1, 1 * u), text_w(l2, f2, 4 * u)) + 70 * u
        h1 = f1.size + 30 * u
        d.rectangle([x, y, x + 12 * u, y + h1 * eout(clamp01(lt / 0.4))], fill=(*GOLD, int(255 * a)))
        d.rectangle([x + 12 * u, y, x + 12 * u + w * p, y + h1], fill=(*EMER, int(232 * a)))
        if l2:
            p2 = eexp(clamp01((lt - 0.35) / 0.8))
            w2 = text_w(l2, f2, 4 * u) + 50 * u
            d.rectangle([x + 12 * u, y + h1, x + 12 * u + w2 * p2, y + h1 + f2.size + 22 * u], fill=(*GOLD, int(240 * a)))
        ta = clamp01((lt - 0.35) / 0.4) * a
        kinetic(L, x + 40 * u, y + 12 * u, l1, f1, (*CREAM, int(255 * ta)), 1 * u, lt - 0.35, delay=0.015, rise=14 * u, anchor="l", shadow=0)
        if l2:
            kinetic(L, x + 36 * u, y + h1 + 9 * u, l2, f2, (*DARK, int(255 * a)), 4 * u, lt - 0.6, delay=0.012, rise=10 * u, anchor="l", shadow=0)


class Sub(Ov):
    """Subtitle Bahasa Malaysia; pada 16:9 diletak dalam jalur letterbox bawah."""

    def draw(self, L, t):
        W, H = L.size; u = _u(W, H)
        a = window(t, self.a, self.b, 0.15, 0.15)
        txt = self.kw["text"]
        q = self.kw.get("quote")
        f = font("play", (42 if W > H else 46) * u) if q else font("inter6", (36 if W > H else 42) * u)
        maxw = W * (0.80 if W > H else 0.86)
        words, lines, cur = txt.split(), [], ""
        for w_ in words:
            tst = (cur + " " + w_).strip()
            if text_w(tst, f) > maxw and cur:
                lines.append(cur); cur = w_
            else:
                cur = tst
        lines.append(cur)
        lh = f.size * 1.25
        yc = H * self.kw.get("y", 0.938 if W > H else 0.80)
        y0 = yc - len(lines) * lh / 2
        col = (*GOLD, int(255 * a)) if q else (255, 250, 238, int(255 * a))
        for i, ln in enumerate(lines):
            _shadow_text(L, (W / 2, y0 + i * lh), ln, f, col, anchor="m", blur=4, sa=int(220 * a))


class Credits(Ov):
    """Kad penutup: dokumentasi + nama penganjur + logo (jika ada)."""

    def draw(self, L, t):
        W, H = L.size; u = _u(W, H)
        lt = t - self.a
        a = window(t, self.a, self.b, 0.01, 1.2)
        vert = H > W
        d = ImageDraw.Draw(L)
        logos = self.kw.get("logos", [])
        y = H * (0.20 if logos else 0.28) if not vert else H * 0.30
        if logos:
            la = clamp01(lt / 1.0) * a
            hh = 150 * u
            ims = []
            for lp in logos:
                im = Image.open(lp).convert("RGBA")
                s = hh / im.height
                ims.append(im.resize((int(im.width * s), int(hh)), Image.LANCZOS))
            tot = sum(i.width for i in ims) + 80 * u * (len(ims) - 1)
            x = W / 2 - tot / 2
            for im in ims:
                if la < 1:
                    al = im.getchannel("A").point(lambda v: int(v * la)); im = im.copy(); im.putalpha(al)
                L.alpha_composite(im, (int(x), int(y - hh - 40 * u)))
                x += im.width + 80 * u
        rows = [("inter7", 28, "DOKUMENTASI PROGRAM LAWATAN DAN PERTEMUAN", GOLD, 8, 0.2),
                ("bebas", 104 if not vert else 72, "PERSATUAN HALAQAT MUQARRABIN", CREAM, 4, 0.7),
                ("play", 64, "&", GOLD, 0, 1.0),
                ("bebas", 104 if not vert else 72, "JABATAN PILIHANRAYA PAS PARIT", CREAM, 4, 1.2),
                ("inter6", 30, self.kw.get("foot", "Terengganu  ·  26 November 2026"), (200, 222, 214), 4, 1.8)]
        yy = y
        for fn, sz, txt, col, tr, t0 in rows:
            if vert and fn.startswith("inter"):
                sz = sz * 1.35
            f = font(fn, sz * u)
            al = clamp01((lt - t0) / 0.8) * a
            off = (1 - eout(clamp01((lt - t0) / 1.0))) * 16 * u
            sz_ = sz
            while text_w(txt, f, tr * u) > W * 0.9 and sz_ > 20:
                sz_ -= 2; f = font(fn, sz_ * u)
            _shadow_text(L, (W / 2, yy + off), txt, f, (*col, int(255 * al)), tracking=tr * u, anchor="m")
            yy += f.size * (1.35 if fn != "play" else 1.05) + 6 * u
