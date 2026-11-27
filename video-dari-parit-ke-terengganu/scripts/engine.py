"""
Enjin komposit video (numpy + Pillow + FFmpeg).

Setiap bingkai dihasilkan secara prosedur daripada senarai shot (timeline)
dan senarai lapisan grafik (overlay). Tiada perisian suntingan luaran.
"""
import math, os, subprocess, functools, json
import numpy as np
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageFilter

Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
RAW = os.path.join(ROOT, "build", "raw")
CACHE = os.path.join(ROOT, "build", "cache")
FONTS = os.path.join(ROOT, "assets", "fonts")
FPS = 24

# ----------------------------------------------------------------- palet
TEAL = (14, 52, 58)
EMERALD = (32, 150, 118)
GOLD = (232, 182, 92)
CREAM = (246, 238, 222)
INK = (6, 14, 16)


def ease(x):  # easeInOutCubic
    x = min(1.0, max(0.0, x))
    return 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2


def eout(x):  # easeOutCubic
    x = min(1.0, max(0.0, x))
    return 1 - (1 - x) ** 3


def eexp(x):  # easeOutExpo
    x = min(1.0, max(0.0, x))
    return 1.0 if x >= 1 else 1 - 2 ** (-10 * x)


def clamp01(x):
    return min(1.0, max(0.0, x))


def window(t, a, b, fi=0.5, fo=0.5):
    """Lengkung 0..1 untuk lapisan aktif [a,b] dengan fade masuk/keluar."""
    if t < a or t > b:
        return 0.0
    return min(clamp01((t - a) / fi) if fi > 0 else 1.0, clamp01((b - t) / fo) if fo > 0 else 1.0)


# ----------------------------------------------------------------- warna (grade)
def grade(arr):
    """Gred sinematik: teal pada bayang, emas hangat pada highlight,
    hijau ke arah emerald, kulit kekal semula jadi. arr uint8 HxWx3."""
    x = arr.astype(np.float32) / 255.0
    lum = x[..., 0] * 0.2126 + x[..., 1] * 0.7152 + x[..., 2] * 0.0722
    # kontras lembut (S-curve)
    x = x + 0.22 * (x - 0.5) * (1 - np.abs(2 * x - 1)) * 0.9
    sh = ((1 - lum) ** 2.2)[..., None]
    hi = (lum ** 2.0)[..., None]
    x = x + sh * np.array([-0.030, 0.012, 0.034], np.float32) + hi * np.array([0.040, 0.016, -0.030], np.float32)
    # emerald: piksel kehijauan -> kurang merah, sedikit biru
    r, g, b = x[..., 0], x[..., 1], x[..., 2]
    gm = np.clip((g - np.maximum(r, b)) * 4, 0, 1)
    x[..., 0] -= gm * 0.035
    x[..., 2] += gm * 0.03
    # ketepuan +6% (lindungi kulit: r>g>b)
    skin = np.clip((r - g) * 6, 0, 1) * np.clip((g - b) * 6, 0, 1)
    l2 = (x[..., 0] * 0.2126 + x[..., 1] * 0.7152 + x[..., 2] * 0.0722)[..., None]
    sat = (1.07 - 0.05 * skin)[..., None]
    x = l2 + (x - l2) * sat
    # hitam filem (lift) & highlight lembut
    x = 0.018 + x * 0.965
    return (np.clip(x, 0, 1) * 255 + 0.5).astype(np.uint8)


# ----------------------------------------------------------------- font
@functools.lru_cache(maxsize=64)
def font(name, size):
    files = {"bebas": "BebasNeue.woff2", "inter": "inter-latin-400-normal.woff2",
             "inter6": "inter-latin-600-normal.woff2", "inter7": "inter-latin-700-normal.woff2",
             "play": "PlayfairDisplay-Italic.woff2"}
    return ImageFont.truetype(os.path.join(FONTS, files[name]), int(size))


def text_w(txt, f, tracking=0):
    return f.getlength(txt) + tracking * max(0, len(txt) - 1)


def draw_text(d, xy, txt, f, fill, tracking=0, anchor="l"):
    """Teks dengan jarak huruf (tracking). anchor: l / m / r (mendatar)."""
    x, y = xy
    w = text_w(txt, f, tracking)
    if anchor == "m":
        x -= w / 2
    elif anchor == "r":
        x -= w
    if tracking == 0:
        d.text((x, y), txt, font=f, fill=fill)
        return w
    for ch in txt:
        d.text((x, y), ch, font=f, fill=fill)
        x += f.getlength(ch) + tracking
    return w


# ----------------------------------------------------------------- imej pegun
def _orient_load(path, max_side):
    im = Image.open(path)
    im.draft("RGB", (max_side * 2, max_side * 2))
    im = ImageOps.exif_transpose(im).convert("RGB")
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    return im


@functools.lru_cache(maxsize=48)
def still(name, max_side=2880):
    """Imej digred & dicache (sisi panjang max_side)."""
    os.makedirs(CACHE, exist_ok=True)
    cp = os.path.join(CACHE, f"g{max_side}_{name}")
    if not os.path.exists(cp):
        im = _orient_load(os.path.join(RAW, name), max_side)
        Image.fromarray(grade(np.asarray(im))).save(cp, quality=95)
    return Image.open(cp).convert("RGB")


@functools.lru_cache(maxsize=48)
def blurred_bg(name, W, H, dark=0.55):
    im = still(name, 1200)
    im = ImageOps.fit(im, (W // 6, H // 6), Image.BILINEAR)
    im = im.filter(ImageFilter.GaussianBlur(radius=max(W, H) / 6 / 40))
    im = im.resize((int(W * 1.15), int(H * 1.15)), Image.BICUBIC)
    a = np.asarray(im).astype(np.float32) * dark
    return Image.fromarray(a.astype(np.uint8))


# ----------------------------------------------------------------- video
class VideoReader:
    """Membaca bingkai berurutan (rgb24) melalui ffmpeg pipe, sudah diputar
    mengikut metadata & disesuaikan kelajuan (speed<1 = gerak perlahan)."""

    def __init__(self, name, src_t, speed, size, crop=None):
        self.w, self.h = size
        vf = []
        if crop:  # crop = (cx, cy, cw, ch) pecahan
            cx, cy, cw, ch = crop
            vf.append(f"crop=iw*{cw}:ih*{ch}:iw*{cx - cw / 2}:ih*{cy - ch / 2}")
        vf += [f"setpts=(PTS-STARTPTS)/{speed}", f"fps={FPS}", f"scale={self.w}:{self.h}:flags=bicubic"]
        cmd = ["ffmpeg", "-v", "error", "-ss", f"{src_t:.3f}", "-i", os.path.join(RAW, name),
               "-an", "-vf", ",".join(vf), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
        self.p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        self.n = self.w * self.h * 3
        self.last = None

    def read(self):
        b = self.p.stdout.read(self.n)
        if len(b) == self.n:
            self.last = grade(np.frombuffer(b, np.uint8).reshape(self.h, self.w, 3))
        if self.last is None:
            self.last = np.zeros((self.h, self.w, 3), np.uint8)
        return self.last

    def close(self):
        try:
            self.p.stdout.close(); self.p.kill()
        except Exception:
            pass


@functools.lru_cache(maxsize=32)
def video_dims(name):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=width,height:stream_side_data=rotation", "-of", "json",
                          os.path.join(RAW, name)], capture_output=True, text=True).stdout
    s = json.loads(out)["streams"][0]
    w, h = s["width"], s["height"]
    rot = 0
    for sd in s.get("side_data_list", []):
        rot = sd.get("rotation", rot)
    return (h, w) if abs(rot) == 90 else (w, h)


# ----------------------------------------------------------------- kesan
class FX:
    def __init__(self, W, H, seed=5):
        self.W, self.H = W, H
        r = np.random.default_rng(seed)
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        nx, ny = (xx / W - 0.5) * 2, (yy / H - 0.5) * 2
        d = np.sqrt(nx ** 2 * 0.85 + ny ** 2 * 1.0)
        self.vig = (1 - 0.38 * np.clip(d - 0.35, 0, 2) ** 1.6)[..., None].astype(np.float32)
        gh, gw = H // 2, W // 2
        self.grain = []
        for i in range(8):
            g = r.standard_normal((gh, gw)).astype(np.float32)
            g = np.asarray(Image.fromarray(((g * 40) + 128).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)).astype(np.float32)
            self.grain.append(((g - 128) / 40.0)[..., None])
        # tekstur light leak (resolusi rendah, dibesarkan setiap bingkai)
        lw, lh = 320, 180
        yy, xx = np.mgrid[0:lh, 0:lw].astype(np.float32)
        self.leaks = []
        for k in range(4):
            acc = np.zeros((lh, lw, 3), np.float32)
            for j in range(5):
                cx, cy = r.uniform(-0.1, 1.1) * lw, r.uniform(-0.2, 1.2) * lh
                rad = r.uniform(0.25, 0.6) * lw
                col = np.array([[1.0, 0.55, 0.18], [1.0, 0.78, 0.40], [1.0, 0.36, 0.12], [0.95, 0.85, 0.6]][r.integers(0, 4)], np.float32)
                g = np.exp(-(((xx - cx) ** 2 + (yy - cy) ** 2) / (rad ** 2)))
                acc += g[..., None] * col * r.uniform(0.5, 1.0)
            self.leaks.append(acc / acc.max())

    def leak(self, t, k=0):
        """Light leak bergerak perlahan (float 0..1, saiz penuh)."""
        a = self.leaks[k % 4]
        sh = int((t * 18) % 320)
        a = np.roll(a, sh, axis=1)
        im = Image.fromarray((a * 255).astype(np.uint8)).resize((self.W, self.H), Image.BILINEAR)
        return np.asarray(im).astype(np.float32) / 255.0

    def finish(self, f, t, grain=0.022):
        """f float 0..1 -> vignette + grain."""
        f = f * self.vig
        g = self.grain[int(t * FPS) % 8]
        lum = f.mean(axis=2, keepdims=True)
        f = f + g * grain * (0.6 + 0.8 * lum * (1 - lum) * 4) * 0.5
        return f


def screen(a, b):
    return 1 - (1 - a) * (1 - b)


def to_f(img):
    return np.asarray(img, dtype=np.float32) / 255.0


def alpha_over(base, layer):
    """base float HxWx3; layer PIL RGBA (saiz sama)."""
    la = np.asarray(layer, dtype=np.float32) / 255.0
    a = la[..., 3:4]
    return base * (1 - a) + la[..., :3] * a
