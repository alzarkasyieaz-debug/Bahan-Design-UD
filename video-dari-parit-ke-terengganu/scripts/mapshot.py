"""Peta perjalanan animasi: Bota, Perak -> Kuala Terengganu.

Data sempadan: Natural Earth (domain awam) — assets/geo/*.geojson.
Garisan laluan adalah ILUSTRASI arah perjalanan (bukan jejak GPS sebenar).
"""
import json, os, functools, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from engine import ROOT, CACHE, font, draw_text, ease, eout, clamp01, to_f, GOLD, CREAM
from shots import Shot

LON0, LON1, LAT0, LAT1 = 97.5, 106.5, -0.5, 8.5
PPD = 400                      # piksel per darjah (peta asas)
KX = PPD * math.cos(math.radians(4.5))
BW, BH = int((LON1 - LON0) * KX), int((LAT1 - LAT0) * PPD)

BOTA = (100.88, 4.34)
KT = (103.14, 5.33)
# titik laluan ilustrasi (lengkung lembut merentas Banjaran Titiwangsa)
WAY = [BOTA, (101.20, 4.62), (101.78, 4.93), (102.42, 5.10), (102.92, 5.24), KT]


def px(lon, lat):
    return ((lon - LON0) * KX, (LAT1 - lat) * PPD)


def _rings(geom):
    if geom["type"] == "Polygon":
        return [geom["coordinates"][0]]
    return [p[0] for p in geom["coordinates"]]


@functools.lru_cache(maxsize=1)
def base_map():
    os.makedirs(CACHE, exist_ok=True)
    cp = os.path.join(CACHE, "basemap_v2.png")
    hp = os.path.join(CACHE, "basemap_hl_v2.png")
    if os.path.exists(cp):
        return Image.open(cp).convert("RGB"), Image.open(hp).convert("L")
    geo = os.path.join(ROOT, "assets", "geo")
    cn = json.load(open(os.path.join(geo, "countries.geojson")))
    st = json.load(open(os.path.join(geo, "states.geojson")))
    # laut: gradien teal dalam
    yy = np.linspace(0, 1, BH, dtype=np.float32)[:, None]
    xx = np.linspace(0, 1, BW, dtype=np.float32)[None, :]
    sea = np.zeros((BH, BW, 3), np.float32)
    g = np.exp(-(((xx - 0.45) ** 2) / 0.2 + ((yy - 0.45) ** 2) / 0.2))
    for i, (a, b) in enumerate([(5, 14), (20, 40), (26, 44)]):
        sea[..., i] = a + (b - a) * g
    # garis grid halus (latitud/longitud)
    for lon in range(98, 107):
        x = int(px(lon, 0)[0]); sea[:, max(0, x - 1):x + 1] += 7
    for lat in range(0, 9):
        y = int(px(0, lat)[1]); sea[max(0, y - 1):y + 1, :] += 7
    im = Image.fromarray(sea.clip(0, 255).astype(np.uint8))
    land = Image.new("L", (BW, BH), 0)
    dl = ImageDraw.Draw(land)
    for f in cn["features"]:
        for r in _rings(f["geometry"]):
            dl.polygon([px(*c) for c in r], fill=255)
    # cahaya pantai
    glow = land.filter(ImageFilter.GaussianBlur(14))
    gl = np.asarray(glow, np.float32)[..., None] / 255
    lm = np.asarray(land, np.float32)[..., None] / 255
    arr = np.asarray(im, np.float32)
    arr = arr + (gl - lm).clip(0, 1) * np.array([30, 90, 88], np.float32) * 0.8
    other = np.array([24, 40, 42], np.float32)
    arr = arr * (1 - lm) + other * lm
    im = Image.fromarray(arr.clip(0, 255).astype(np.uint8))
    d = ImageDraw.Draw(im)
    hl = Image.new("L", (BW, BH), 0)
    dh = ImageDraw.Draw(hl)
    for f in st["features"]:
        if f["properties"]["admin"] != "Malaysia":
            continue
        for r in _rings(f["geometry"]):
            pts = [px(*c) for c in r]
            d.polygon(pts, fill=(22, 70, 64))
            if f["properties"]["name"] in ("Perak", "Terengganu"):
                dh.polygon(pts, fill=255)
    for f in st["features"]:
        if f["properties"]["admin"] != "Malaysia":
            continue
        for r in _rings(f["geometry"]):
            d.line([px(*c) for c in r] + [px(*r[0])], fill=(70, 130, 118), width=2)
    for f in cn["features"]:
        for r in _rings(f["geometry"]):
            d.line([px(*c) for c in r] + [px(*r[0])], fill=(110, 170, 160), width=3)
    im.save(cp); hl.save(hp)
    return im, hl


def catmull(pts, n=400):
    P = [pts[0]] + pts + [pts[-1]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = map(np.array, (P[i - 1], P[i], P[i + 1], P[i + 2]))
        for t in np.linspace(0, 1, n // (len(pts) - 1), endpoint=False):
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    out.append(np.array(pts[-1]))
    return np.array(out)


ROUTE = catmull(WAY)


def _lerp(a, b, t):
    return a + (b - a) * t


def bus_sprite(u, t):
    """Ikon bas (pandangan sisi) dengan roda berputar & lampu."""
    W_, H_ = int(130 * u), int(64 * u)
    im = Image.new("RGBA", (W_, H_), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    k = u
    body = [4 * k, 6 * k, 124 * k, 48 * k]
    d.rounded_rectangle([body[0] + 3 * k, body[1] + 4 * k, body[2] + 3 * k, body[3] + 4 * k], radius=10 * k, fill=(0, 0, 0, 90))
    d.rounded_rectangle(body, radius=10 * k, fill=(246, 238, 222, 255), outline=(30, 60, 58, 255), width=max(1, int(2 * k)))
    d.rectangle([6 * k, 34 * k, 122 * k, 40 * k], fill=(32, 150, 118, 255))       # jalur emerald
    d.rectangle([6 * k, 40 * k, 122 * k, 43 * k], fill=(232, 182, 92, 255))       # jalur emas
    for i in range(5):                                                         # tingkap
        x0 = 12 * k + i * 19 * k
        d.rounded_rectangle([x0, 12 * k, x0 + 15 * k, 27 * k], radius=3 * k, fill=(16, 48, 54, 255))
    d.rounded_rectangle([108 * k, 12 * k, 121 * k, 30 * k], radius=4 * k, fill=(16, 48, 54, 255))  # cermin depan
    d.ellipse([117 * k, 36 * k, 123 * k, 42 * k], fill=(255, 236, 170, 255))  # lampu depan
    for cx in (30 * k, 100 * k):                                               # roda
        r = 9 * k
        d.ellipse([cx - r, 48 * k - r, cx + r, 48 * k + r], fill=(14, 20, 22, 255))
        d.ellipse([cx - r * 0.45, 48 * k - r * 0.45, cx + r * 0.45, 48 * k + r * 0.45], fill=(180, 186, 180, 255))
        a = t * 14
        d.line([cx + math.cos(a) * r * 0.45, 48 * k + math.sin(a) * r * 0.45,
                cx - math.cos(a) * r * 0.45, 48 * k - math.sin(a) * r * 0.45], fill=(40, 40, 40, 255), width=max(1, int(2 * k)))
    return im


def draw_bus(lay, x, y, ang_deg, facing_left, u, t, alpha=1.0):
    sp = bus_sprite(u, t)
    if facing_left:
        sp = sp.transpose(Image.FLIP_LEFT_RIGHT)
        ang_deg = ang_deg + 180
    ang = max(-22, min(22, ((ang_deg + 180) % 360) - 180))
    sp = sp.rotate(-ang, Image.BICUBIC, expand=True)
    if alpha < 1:
        sp.putalpha(sp.getchannel("A").point(lambda v: int(v * alpha)))
    bob = math.sin(t * 9) * 1.2 * u
    lay.alpha_composite(sp, (int(x - sp.width / 2), int(y - sp.height / 2 - 26 * u + bob)))


class MapShot(Shot):
    """kw: reverse (bool) – untuk perjalanan pulang; title (teks bawah)."""

    def render(self, lt, W, H):
        base, hl = base_map()
        rev = self.kw.get("reverse", False)
        d = self.d
        p = lt / d
        # kamera: (lon, lat, rentang latitud kelihatan)
        if not rev:
            keys = [(0.00, 100.95, 4.40, 1.9), (0.18, 101.0, 4.45, 2.2), (0.55, 101.95, 4.85, 4.4),
                    (0.85, 102.70, 5.10, 3.4), (1.00, 102.95, 5.20, 2.8)]
        else:
            keys = [(0.0, 102.4, 5.0, 3.8), (1.0, 101.9, 4.85, 4.6)]
        for i in range(len(keys) - 1):
            if keys[i][0] <= p <= keys[i + 1][0]:
                q = ease((p - keys[i][0]) / (keys[i + 1][0] - keys[i][0]))
                lon, lat, span = [_lerp(keys[i][j], keys[i + 1][j], q) for j in (1, 2, 3)]
                break
        else:
            lon, lat, span = keys[-1][1:]
        # nisbah kanvas menegak memerlukan rentang lebih
        vh = span * PPD
        vw = vh * W / H
        if W < H:
            vw = span * 1.05 * PPD; vh = vw * H / W
        cx, cy = px(lon, lat)
        box = (cx - vw / 2, cy - vh / 2, cx + vw / 2, cy + vh / 2)
        sc = W / vw
        frame = base.transform((W, H), Image.EXTENT, box, Image.BICUBIC)
        hlf = hl.transform((W, H), Image.EXTENT, box, Image.BILINEAR)
        f = to_f(frame)
        # sorotan negeri Perak & Terengganu (masuk perlahan)
        ha = clamp01((lt - 0.6) / 1.5) * 0.55
        h = np.asarray(hlf, np.float32)[..., None] / 255.0
        f = f + h * ha * (np.array([0.16, 0.34, 0.24], np.float32))
        img = Image.fromarray((f.clip(0, 1) * 255).astype(np.uint8))
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        dr = ImageDraw.Draw(lay)

        def S(lo, la):
            x, y = px(lo, la)
            return ((x - box[0]) * sc, (y - box[1]) * sc)

        u = min(W, H) / 1080
        # label negeri / laut
        lab = [("PERAK", 101.05, 4.75), ("TERENGGANU", 102.9, 4.85), ("KELANTAN", 102.05, 5.45),
               ("PAHANG", 102.6, 3.75), ("SELANGOR", 101.35, 3.35), ("KEDAH", 100.6, 6.05)]
        fa = int(150 * clamp01((lt - 0.4) / 1.2))
        for name, lo, la in lab:
            x, y = S(lo, la)
            draw_text(dr, (x, y), name, font("inter6", 20 * u), (190, 230, 215, fa), tracking=6 * u, anchor="m")
        for name, lo, la in [("SELAT MELAKA", 100.2, 3.4), ("LAUT CHINA SELATAN", 104.1, 5.7)]:
            x, y = S(lo, la)
            draw_text(dr, (x, y), name, font("play", 26 * u), (150, 200, 200, int(fa * 0.8)), anchor="m")
        # laluan
        if not rev:
            prog = eout(clamp01((lt - 2.0) / (d * 0.72)))
            pts = ROUTE
        else:
            prog = ease(clamp01((lt - 0.6) / (d * 0.75)))
            pts = ROUTE[::-1]
        n = max(2, int(len(pts) * prog))
        sp = [S(*q) for q in pts[:n]]
        if len(sp) >= 2:
            # glow + teras emas + putus-putus terang
            gl = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            ImageDraw.Draw(gl).line(sp, fill=(232, 182, 92, 150), width=int(18 * u), joint="curve")
            gl = gl.filter(ImageFilter.GaussianBlur(9 * u))
            lay = Image.alpha_composite(lay, gl)
            dr = ImageDraw.Draw(lay)
            dr.line(sp, fill=(246, 214, 140, 255), width=int(5 * u), joint="curve")
            hx, hy = sp[-1]
            if prog < 0.999:
                r = 10 * u
                dr.ellipse([hx - r, hy - r, hx + r, hy + r], fill=(255, 245, 220, 255))
        # pin
        A, B = (BOTA, KT) if not rev else (KT, BOTA)
        la, lb = ("BOTA, PERAK", "KUALA TERENGGANU") if not rev else ("KUALA TERENGGANU", "BOTA, PERAK")
        for (pt, name, t_on) in [(A, la, 0.3), (B, lb, 2.0 + d * 0.72)]:
            a = clamp01((lt - t_on) / 0.6)
            if a <= 0:
                continue
            x, y = S(*pt)
            pulse = (lt - t_on) % 1.6 / 1.6
            rr = (14 + 46 * pulse) * u
            dr.ellipse([x - rr, y - rr, x + rr, y + rr], outline=(246, 214, 140, int(200 * (1 - pulse) * a)), width=int(3 * u))
            bounce = (1 - eout(clamp01((lt - t_on) / 0.5))) * 40 * u
            r = 13 * u
            yb = y - bounce
            dr.polygon([(x - r * 0.95, yb - r * 1.2), (x + r * 0.95, yb - r * 1.2), (x, yb + r * 0.9)], fill=(232, 182, 92, int(255 * a)))
            dr.ellipse([x - r, yb - r * 2.3, x + r, yb - r * 0.3], fill=(232, 182, 92, int(255 * a)))
            dr.ellipse([x - r * 0.4, yb - r * 1.7, x + r * 0.4, yb - r * 0.9], fill=(20, 40, 40, int(255 * a)))
            fnt = font("bebas", 44 * u)
            tw = fnt.getlength(name) + 6 * u * (len(name) - 1)
            right = x + 26 * u + tw < W * 0.95
            lx = x + 26 * u if right else x - 26 * u
            pad = 10 * u
            bx0 = lx - pad if right else lx - tw - pad
            dr.rectangle([bx0, yb - 52 * u, bx0 + tw + 2 * pad, yb - 6 * u], fill=(6, 20, 22, int(170 * a)))
            draw_text(dr, (lx, yb - 50 * u), name, fnt, (250, 240, 220, int(255 * a)), tracking=6 * u, anchor="l" if right else "r")
        # bas bergerak di kepala laluan
        arrive = (2.0 if not rev else 0.6) + d * (0.72 if not rev else 0.75)
        ba = 1.0 - clamp01((lt - arrive - 0.4) / 0.8)
        if ba > 0 and len(sp) >= 2:
            j = max(1, len(sp) - 1)
            x1_, y1_ = sp[j]; x0_, y0_ = sp[max(0, j - 6)]
            ang = math.degrees(math.atan2(y1_ - y0_, x1_ - x0_)) if (x1_, y1_) != (x0_, y0_) else 0.0
            draw_bus(lay, x1_, y1_, ang, x1_ < x0_, u * 1.2, lt if prog < 0.999 else 0.0, ba)
        elif ba > 0:
            x_, y_ = S(*pts[0])
            draw_bus(lay, x_ + (70 if rev else -90) * u, y_ + 10 * u, 0.0, rev, u * 1.2, 0.0, ba * clamp01(lt / 0.5))
        img = Image.alpha_composite(img.convert("RGBA"), lay).convert("RGB")
        return to_f(img)
