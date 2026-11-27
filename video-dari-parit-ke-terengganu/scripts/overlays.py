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


class Title(Ov):
    """Tajuk utama dua baris + garis emas + subtajuk."""

    def draw(self, L, t):
        W, H = L.size; u = _u(W, H)
        lt = t - self.a
        a = window(t, self.a, self.b, 0.01, 0.9)
        lines = self.kw.get("lines", ["DARI PARIT", "KE TERENGGANU"])
        big = font("bebas", self.kw.get("size", 168) * u)
        cy = H * self.kw.get("y", 0.40)
        for i, ln in enumerate(lines):
            p = eexp(clamp01((lt - 0.25 - i * 0.45) / 1.6))
            tr = (60 - 46 * p) * u
            al = int(255 * clamp01((lt - 0.25 - i * 0.45) / 0.7) * a)
            y = cy + (i - len(lines) / 2) * big.size * 0.92 + (1 - p) * 18 * u
            col = (*CREAM, al) if i == 0 else (*GOLD, al)
            _shadow_text(L, (W / 2, y), ln, big, col, tracking=tr, anchor="m", blur=10, sa=int(120 * a))
        d = ImageDraw.Draw(L)
        lp = eout(clamp01((lt - 1.3) / 1.0))
        ly = cy + len(lines) / 2 * big.size * 0.92 + 26 * u
        lw = 360 * u * lp
        d.line([(W / 2 - lw, ly), (W / 2 + lw, ly)], fill=(*GOLD, int(220 * a)), width=max(2, int(2 * u)))
        sub = self.kw.get("sub")
        if sub:
            sa = clamp01((lt - 1.8) / 0.8) * a
            _shadow_text(L, (W / 2, ly + 22 * u), sub, font("play", 46 * u), (*CREAM, int(255 * sa)), anchor="m")
        tag = self.kw.get("tag")
        if tag:
            sa = clamp01((lt - 2.6) / 0.8) * a
            _shadow_text(L, (W / 2, ly + 92 * u), tag, font("inter6", 22 * u), (210, 230, 220, int(230 * sa)), tracking=7 * u, anchor="m")


class Chapter(Ov):
    """Tajuk bab animasi: nombor kecil + tajuk + garis sapuan."""

    def draw(self, L, t):
        W, H = L.size; u = _u(W, H)
        lt = t - self.a
        a = window(t, self.a, self.b, 0.01, 0.6)
        x = W * 0.07 if W > H else W * 0.08
        y = H * (0.12 if W > H else 0.14)
        d = ImageDraw.Draw(L)
        lp = eout(clamp01(lt / 0.8))
        d.line([(x, y), (x + 70 * u * lp, y)], fill=(*GOLD, int(255 * a)), width=max(2, int(3 * u)))
        num = self.kw.get("num", "")
        na = clamp01((lt - 0.2) / 0.5) * a
        draw_text(d, (x + 86 * u, y - 13 * u), num, font("inter7", 22 * u), (*GOLD, int(255 * na)), tracking=6 * u)
        ta = clamp01((lt - 0.45) / 0.6) * a
        off = (1 - eout(clamp01((lt - 0.45) / 0.8))) * 30 * u
        sz = self.kw.get("size", 64)
        f = font("bebas", sz * u)
        maxw = W * 0.86
        while text_w(self.kw["title"], f, 4 * u) > maxw and sz > 30:
            sz -= 4; f = font("bebas", sz * u)
        _shadow_text(L, (x - off * 0 + 0, y + 20 * u + off), self.kw["title"], f, (*CREAM, int(255 * ta)), tracking=4 * u)


class Words(Ov):
    """Perkataan tema besar di tengah (PERTEMUAN / PERKONGSIAN ...)."""

    def draw(self, L, t):
        W, H = L.size; u = _u(W, H)
        lt = t - self.a
        a = window(t, self.a, self.b, 0.5, 0.5)
        p = eexp(clamp01(lt / 2.2))
        f = font("bebas", self.kw.get("size", 150) * u)
        tr = (10 + 26 * p) * u
        y = H * self.kw.get("y", 0.42) - f.size / 2
        _shadow_text(L, (W / 2, y), self.kw["word"], f, (*CREAM, int(240 * a)), tracking=tr, anchor="m", blur=12, sa=int(170 * a))
        d = ImageDraw.Draw(L)
        lw = 90 * u * eout(clamp01((lt - 0.3) / 0.8))
        yy = y + f.size * 1.05
        d.line([(W / 2 - lw, yy), (W / 2 + lw, yy)], fill=(*GOLD, int(230 * a)), width=max(2, int(2 * u)))


class Location(Ov):
    """Pendedahan lokasi: nama besar disingkap oleh topeng + subtajuk."""

    def draw(self, L, t):
        W, H = L.size; u = _u(W, H)
        lt = t - self.a
        a = window(t, self.a, self.b, 0.01, 0.7)
        f = font("bebas", self.kw.get("size", 210) * u)
        name = self.kw["name"]
        tw = text_w(name, f, 18 * u)
        y = H * self.kw.get("y", 0.36)
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        _shadow_text(lay, (W / 2, y), name, f, (*CREAM, int(250 * a)), tracking=18 * u, anchor="m", blur=12, sa=140)
        rp = eexp(clamp01(lt / 1.6))
        mask = Image.new("L", (W, H), 0)
        top = y + f.size * 1.15 * (1 - rp)
        ImageDraw.Draw(mask).rectangle([0, top, W, y + f.size * 1.2], fill=255)
        L.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, 0)), lay), (0, 0), mask)
        d = ImageDraw.Draw(L)
        sa = clamp01((lt - 0.9) / 0.7) * a
        yy = y + f.size * 1.08
        lw = (tw / 2) * eout(clamp01((lt - 0.5) / 1.0))
        d.line([(W / 2 - lw, yy), (W / 2 + lw, yy)], fill=(*GOLD, int(230 * a)), width=max(2, int(3 * u)))
        _shadow_text(L, (W / 2, yy + 18 * u), self.kw.get("sub", ""), font("play", 54 * u), (*GOLD, int(255 * sa)), anchor="m")


class Lower(Ov):
    """Lower third animasi: bar emas + baris utama + baris kedua."""

    def draw(self, L, t):
        W, H = L.size; u = _u(W, H)
        lt = t - self.a
        a = window(t, self.a, self.b, 0.01, 0.5)
        x = W * (0.07 if W > H else 0.08)
        y = H * self.kw.get("y", 0.76 if W > H else 0.66)
        d = ImageDraw.Draw(L)
        p = eexp(clamp01(lt / 0.9))
        f1 = font("inter7", self.kw.get("s1", 44) * u)
        f2 = font("inter", 26 * u)
        l1, l2 = self.kw["l1"], self.kw.get("l2", "")
        w = max(text_w(l1, f1, 1 * u), text_w(l2, f2, 2 * u)) + 60 * u
        bh = (f1.size + (f2.size + 18 * u if l2 else 0) + 34 * u)
        d.rectangle([x, y, x + w * p, y + bh], fill=(6, 22, 24, int(185 * a)))
        d.rectangle([x, y, x + 7 * u, y + bh * eout(clamp01(lt / 0.6))], fill=(*GOLD, int(255 * a)))
        ta = clamp01((lt - 0.35) / 0.5) * a
        mask = Image.new("L", (W, H), 0)
        ImageDraw.Draw(mask).rectangle([x, y, x + w * p, y + bh], fill=255)
        tl = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        td = ImageDraw.Draw(tl)
        draw_text(td, (x + 30 * u, y + 14 * u), l1, f1, (*CREAM, int(255 * ta)), tracking=1 * u)
        if l2:
            draw_text(td, (x + 30 * u, y + 24 * u + f1.size), l2, f2, (*GOLD, int(255 * ta)), tracking=2 * u)
        L.paste(Image.alpha_composite(L.crop((0, 0, W, H)), tl), (0, 0), mask)


class Sub(Ov):
    """Subtitle Bahasa Malaysia (voice-over / ucapan)."""

    def draw(self, L, t):
        W, H = L.size; u = _u(W, H)
        a = window(t, self.a, self.b, 0.18, 0.18)
        txt = self.kw["text"]
        f = font("inter6", (36 if W > H else 40) * u)
        maxw = W * (0.72 if W > H else 0.84)
        words, lines, cur = txt.split(), [], ""
        for w_ in words:
            tst = (cur + " " + w_).strip()
            if text_w(tst, f) > maxw and cur:
                lines.append(cur); cur = w_
            else:
                cur = tst
        lines.append(cur)
        y0 = H * self.kw.get("y", 0.86 if W > H else 0.78) - (len(lines) - 1) * f.size * 1.3
        col = (255, 250, 238, int(255 * a)) if not self.kw.get("quote") else (*GOLD, int(255 * a))
        if self.kw.get("quote"):
            f = font("play", (40 if W > H else 44) * u)
        for i, ln in enumerate(lines):
            _shadow_text(L, (W / 2, y0 + i * f.size * 1.3), ln, f, col, anchor="m", blur=5, sa=int(230 * a))


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
        rows = [("inter6", 24, "DOKUMENTASI PROGRAM LAWATAN DAN PERTEMUAN", GOLD, 8, 0.2),
                ("bebas", 78 if not vert else 64, "PERSATUAN HALAQAT MUQARRABIN", CREAM, 4, 0.7),
                ("play", 50, "&", GOLD, 0, 1.0),
                ("bebas", 78 if not vert else 64, "JABATAN PILIHANRAYA PAS PARIT", CREAM, 4, 1.2),
                ("inter", 26, self.kw.get("foot", "Terengganu  ·  26 November 2026"), (200, 222, 214), 4, 1.8)]
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
