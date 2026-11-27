"""Jenis shot: Still (Ken Burns / bingkai parallax), Clip (video), Map, Card."""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from engine import (still, blurred_bg, VideoReader, video_dims, ease, eout, to_f,
                    TEAL, INK, GOLD, CREAM, EMERALD)


class Shot:
    def __init__(self, t, d, tr=("dissolve", 0.6), **kw):
        self.t, self.d, self.tr = t, d, tr
        self.kw = kw

    def close(self):
        pass


def _fit_mode(src_aspect, W, H, mode):
    if mode != "auto":
        return mode
    return "fill" if abs(math.log(src_aspect / (W / H))) < 0.42 else "frame"


def _card_shadow(W, H, box, radius=0, blur=28, strength=0.55):
    """Bayang lembut di bawah kad (float HxWx1)."""
    sm = Image.new("L", (W // 4, H // 4), 0)
    d = ImageDraw.Draw(sm)
    x0, y0, x1, y1 = [v / 4 for v in box]
    d.rectangle([x0 + 3, y0 + 6, x1 + 3, y1 + 9], fill=int(255 * strength))
    sm = sm.filter(ImageFilter.GaussianBlur(blur / 4)).resize((W, H), Image.BILINEAR)
    return np.asarray(sm, np.float32)[..., None] / 255.0


class Still(Shot):
    """kw: src, move ('in'|'out'|'left'|'right'|'up'), focus (fx,fy), zoom (z0,z1),
    mode ('auto'|'fill'|'frame'), pos (pecahan x untuk kad), dark"""

    def render(self, lt, W, H):
        kw = self.kw
        im = still(kw["src"])
        iw, ih = im.size
        p = ease(lt / self.d) * 0.85 + (lt / self.d) * 0.15
        mode = _fit_mode(iw / ih, W, H, kw.get("mode", "auto"))
        move = kw.get("move", "in")
        z0, z1 = kw.get("zoom", {"in": (1.0, 1.13), "out": (1.14, 1.0)}.get(move, (1.08, 1.08)))
        fx, fy = kw.get("focus", (0.5, 0.5))
        if mode == "fill":
            z = z0 + (z1 - z0) * p
            # kawasan sumber berasaskan nisbah kanvas
            if iw / ih > W / H:
                bh = ih / z; bw = bh * W / H
            else:
                bw = iw / z; bh = bw * H / W
            pan = {"left": (0.62, 0.38), "right": (0.38, 0.62)}.get(move)
            cx = (pan[0] + (pan[1] - pan[0]) * p) * iw if pan else fx * iw
            cy = fy * ih
            if move == "up":
                cy = (fy + 0.06 - 0.12 * p) * ih
            cx = min(max(cx, bw / 2), iw - bw / 2)
            cy = min(max(cy, bh / 2), ih - bh / 2)
            box = (cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2)
            out = im.transform((W, H), Image.EXTENT, box, Image.BICUBIC)
            f = to_f(out)
        else:
            # Kad 'parallax': latar kabur bergerak bertentangan dengan foto
            bg = blurred_bg(kw["src"], W, H, kw.get("dark", 0.72))
            bw_, bh_ = bg.size
            off = (bw_ - W) * (0.5 + 0.4 * (p - 0.5))
            bgc = bg.crop((int(off), (bh_ - H) // 2, int(off) + W, (bh_ - H) // 2 + H))
            f = to_f(bgc)
            maxh = H * kw.get("fh", 0.84)
            maxw = W * kw.get("fw", 0.86)
            s = min(maxh / ih, maxw / iw) * (1.0 + 0.045 * p)
            cw, ch = int(iw * s), int(ih * s)
            px = kw.get("pos", 0.5) * W
            px += (-1 if kw.get("pos", 0.5) < 0.5 else 1) * 0.0
            x0 = int(px - cw / 2 + (p - 0.5) * W * 0.012)
            y0 = int(H / 2 - ch / 2 - H * 0.004 * (p - 0.5) * 2)
            sh = _card_shadow(W, H, (x0, y0, x0 + cw, y0 + ch))
            f = f * (1 - sh)
            card = im.resize((cw, ch), Image.BICUBIC)
            cf = to_f(card)
            xa, ya = max(0, x0), max(0, y0)
            xb, yb = min(W, x0 + cw), min(H, y0 + ch)
            f[ya:yb, xa:xb] = cf[ya - y0:yb - y0, xa - x0:xb - x0]
            # garis tepi halus
            e = 2
            f[ya:ya + e, xa:xb] = f[ya:ya + e, xa:xb] * 0.4 + 0.6
            f[yb - e:yb, xa:xb] = f[yb - e:yb, xa:xb] * 0.4 + 0.6
            f[ya:yb, xa:xa + e] = f[ya:yb, xa:xa + e] * 0.4 + 0.6
            f[ya:yb, xb - e:xb] = f[ya:yb, xb - e:xb] * 0.4 + 0.6
        dark = kw.get("dim", 0.0)
        if dark:
            f = f * (1 - dark)
        return f


class Clip(Shot):
    """kw: src, src_t, speed, mode ('fill'|'frame'), focus_y (untuk fill), pos"""

    def __init__(self, *a, **kw):
        super().__init__(*a, **kw)
        self.reader = None
        self.idx = -1

    def render(self, lt, W, H):
        kw = self.kw
        sw, sh = video_dims(kw["src"])
        mode = _fit_mode(sw / sh, W, H, kw.get("mode", "auto"))
        i = int(round(lt * 24))
        if self.reader is None:
            speed = kw.get("speed", 0.8)
            st = kw.get("src_t", 0.0) + lt * speed
            if mode == "fill":
                # potong kawasan nisbah kanvas daripada sumber
                tgt = W / H
                if sw / sh < tgt:  # sumber lebih tinggi -> potong tinggi
                    cw, ch = 1.0, (sw / tgt) / sh
                else:
                    cw, ch = (sh * tgt) / sw, 1.0
                z = kw.get("zoom", 1.0)
                cw, ch = cw / z, ch / z
                fy = min(max(kw.get("focus_y", 0.5), ch / 2), 1 - ch / 2)
                fx = min(max(kw.get("focus_x", 0.5), cw / 2), 1 - cw / 2)
                self.reader = VideoReader(kw["src"], st, speed, (W, H), crop=(fx, fy, cw, ch))
            else:
                fh = kw.get("fh", 0.84)
                s = min(H * fh / sh, W * 0.86 / sw)
                self.fs = (int(sw * s) // 2 * 2, int(sh * s) // 2 * 2)
                self.reader = VideoReader(kw["src"], st, speed, self.fs)
            self.idx = i - 1
        while self.idx < i:
            fr = self.reader.read(); self.idx += 1
        if mode == "fill":
            f = fr.astype(np.float32) / 255.0
            # tolakan zum perlahan (sinematik)
            p = lt / self.d
            z = 1.0 + 0.04 * p
            if z > 1.001:
                im = Image.fromarray(fr)
                bw, bh = W / z, H / z
                im = im.transform((W, H), Image.EXTENT, ((W - bw) / 2, (H - bh) / 2, (W + bw) / 2, (H + bh) / 2), Image.BILINEAR)
                f = np.asarray(im, np.float32) / 255.0
            return f
        # mod bingkai: latar kabur daripada bingkai video itu sendiri
        cw, ch = self.fs
        small = Image.fromarray(fr).resize((max(8, W // 12), max(8, H // 12)), Image.BILINEAR) \
            if False else Image.fromarray(fr).resize((max(8, cw // 10), max(8, ch // 10)), Image.BILINEAR)
        bgw, bgh = W // 8, H // 8
        sc = max(bgw / small.width, bgh / small.height) * 1.1
        bg = small.resize((int(small.width * sc) + 1, int(small.height * sc) + 1), Image.BILINEAR)
        bg = bg.crop(((bg.width - bgw) // 2, (bg.height - bgh) // 2, (bg.width - bgw) // 2 + bgw, (bg.height - bgh) // 2 + bgh))
        bg = bg.filter(ImageFilter.GaussianBlur(3)).resize((W, H), Image.BICUBIC)
        f = to_f(bg) * 0.68
        x0 = int(kw.get("pos", 0.5) * W - cw / 2)
        y0 = (H - ch) // 2
        shm = _card_shadow(W, H, (x0, y0, x0 + cw, y0 + ch))
        f = f * (1 - shm)
        f[y0:y0 + ch, x0:x0 + cw] = fr.astype(np.float32) / 255.0
        e = 2
        for sl in [(slice(y0, y0 + e), slice(x0, x0 + cw)), (slice(y0 + ch - e, y0 + ch), slice(x0, x0 + cw)),
                   (slice(y0, y0 + ch), slice(x0, x0 + e)), (slice(y0, y0 + ch), slice(x0 + cw - e, x0 + cw))]:
            f[sl] = f[sl] * 0.4 + 0.6
        return f

    def close(self):
        if self.reader:
            self.reader.close()
        self.reader = None


class Card(Shot):
    """Latar grafik: gradien teal gelap (tajuk / kredit). kw: src (opsyenal, latar kabur)"""

    def render(self, lt, W, H):
        if self.kw.get("src"):
            bg = blurred_bg(self.kw["src"], W, H, self.kw.get("dark", 0.32))
            bw, bh = bg.size
            p = lt / self.d
            off = (bw - W) * (0.3 + 0.4 * p)
            f = to_f(bg.crop((int(off), (bh - H) // 2, int(off) + W, (bh - H) // 2 + H)))
            return f
        yy = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
        xx = np.linspace(0, 1, W, dtype=np.float32)[None, :, None]
        c0 = np.array([6, 34, 34], np.float32) / 255
        c1 = np.array([18, 92, 78], np.float32) / 255
        g = np.exp(-(((xx - 0.5) ** 2) / 0.18 + ((yy - 0.45) ** 2) / 0.25))
        return c0 + (c1 - c0) * g + np.zeros((H, W, 3), np.float32)


class Black(Shot):
    def render(self, lt, W, H):
        return np.zeros((H, W, 3), np.float32)


# ----------------------------------------------------------------- SHOWCASE
from engine import eexp, clamp01
from PIL import ImageOps
import functools


@functools.lru_cache(maxsize=64)
def _polaroid(src, h):
    im = still(src, 1400)
    s = h / im.height
    im = im.resize((int(im.width * s), int(h)), Image.LANCZOS)
    b = int(h * 0.045)
    card = Image.new("RGBA", (im.width + 2 * b, im.height + b + int(b * 3.2)), (248, 244, 234, 255))
    card.paste(im, (b, b))
    return card


class Showcase(Shot):
    """Kolaj pameran momen. kw: layout ('tri'|'grid'|'polaroid'), srcs [..]"""

    def render(self, lt, W, H):
        lay = self.kw["layout"]
        srcs = self.kw["srcs"]
        p = lt / self.d
        bgc = np.array([226, 178, 92], np.float32) / 255  # garis emas antara jubin
        if lay == "polaroid":
            bg = blurred_bg(srcs[0], W, H, 0.6)
            bw, bh = bg.size
            off = (bw - W) * (0.3 + 0.4 * p)
            img = bg.crop((int(off), (bh - H) // 2, int(off) + W, (bh - H) // 2 + H)).convert("RGBA")
            n = len(srcs)
            vert = H > W
            ch = H * (0.46 if not vert else 0.30)
            rng = np.random.default_rng(len(srcs[0]) + n)
            for i, s in enumerate(srcs):
                t0 = 0.15 + i * min(0.9, self.d * 0.55 / n)
                q = eout(clamp01((lt - t0) / 0.7))
                if q <= 0:
                    continue
                card = _polaroid(s, int(ch))
                ang = float(rng.uniform(-9, 9))
                if not vert:
                    cx = W * (0.5 + (i - (n - 1) / 2) * (0.60 / max(1, n - 1)) if n > 1 else 0.5)
                    cy = H * (0.5 + (0.05 if i % 2 else -0.05))
                else:
                    cx = W * (0.5 + (0.17 if i % 2 else -0.17))
                    cy = H * (0.22 + i * (0.56 / max(1, n - 1)))
                sc = 1.0 + 0.25 * (1 - q) + 0.02 * p
                c2 = card.resize((int(card.width * sc), int(card.height * sc)), Image.BILINEAR).rotate(ang * (0.4 + 0.6 * q) + (1 - q) * 12, Image.BICUBIC, expand=True)
                al = c2.getchannel("A").point(lambda v: int(v * min(1.0, q * 1.4)))
                c2.putalpha(al)
                sh = Image.new("RGBA", c2.size, (0, 0, 0, 0))
                sh.putalpha(al.point(lambda v: int(v * 0.5)))
                sh = sh.filter(ImageFilter.GaussianBlur(14))
                x, y = int(cx - c2.width / 2), int(cy - c2.height / 2 - (1 - q) * 60)
                img.alpha_composite(sh, (x + 10, y + 16)) if x + 10 >= 0 and y + 16 >= 0 else None
                img.paste(c2, (x, y), c2)
            return to_f(img.convert("RGB"))
        f = np.zeros((H, W, 3), np.float32) + bgc
        g = max(6, int(min(W, H) * 0.008))
        if lay == "tri":
            n = len(srcs)
            vert = H > W
            cells = []
            for i in range(n):
                if not vert:
                    x0 = int(g + i * (W - g) / n); x1 = int((i + 1) * (W - g) / n)
                    cells.append((x0, g, x1, H - g))
                else:
                    y0 = int(g + i * (H - g) / n); y1 = int((i + 1) * (H - g) / n)
                    cells.append((g, y0, W - g, y1))
        else:  # grid
            cols, rows = (3, 2) if W > H else (2, 3)
            cells = []
            for r in range(rows):
                for c in range(cols):
                    cells.append((int(g + c * (W - g) / cols), int(g + r * (H - g) / rows),
                                  int((c + 1) * (W - g) / cols), int((r + 1) * (H - g) / rows)))
        for i, (s, (x0, y0, x1, y1)) in enumerate(zip(srcs, cells)):
            t0 = i * (0.22 if lay == "tri" else 0.16)
            q = eexp(clamp01((lt - t0) / 0.9))
            if q <= 0:
                continue
            cw, chh = x1 - x0, y1 - y0
            im = still(s, 1600)
            iw, ih = im.size
            z = 1.0 + 0.08 * p + (0 if i % 2 else 0.04)
            tgt = cw / chh
            if iw / ih > tgt:
                bh_ = ih / z; bw_ = bh_ * tgt
            else:
                bw_ = iw / z; bh_ = bw_ / tgt
            fx, fy = (0.5, 0.45)
            pan = (p - 0.5) * 0.06 * (1 if i % 2 else -1)
            cx = min(max(iw * (fx + pan), bw_ / 2), iw - bw_ / 2)
            cy = min(max(ih * fy, bh_ / 2), ih - bh_ / 2)
            tile = to_f(im.transform((cw, chh), Image.EXTENT, (cx - bw_ / 2, cy - bh_ / 2, cx + bw_ / 2, cy + bh_ / 2), Image.BILINEAR))
            if lay == "tri":
                # sapuan masuk dari bawah/kanan
                if W > H:
                    k = int(chh * q)
                    f[y1 - k:y1, x0:x1] = tile[chh - k:] if k > 0 else f[y1:y1, x0:x1]
                else:
                    k = int(cw * q)
                    if k > 0:
                        f[y0:y1, x0:x0 + k] = tile[:, :k]
            else:
                f[y0:y1, x0:x1] = f[y0:y1, x0:x1] * (1 - q) + tile * q
        return f
