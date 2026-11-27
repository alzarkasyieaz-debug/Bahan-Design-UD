#!/usr/bin/env python3
"""
Pemapar video.  Guna:
    python3 scripts/render.py main   [--workers 4] [--from 0 --to 30] [--preview]
    python3 scripts/render.py teaser
    python3 scripts/render.py reel
    python3 scripts/render.py still main 123.4    # satu bingkai PNG untuk semakan

Bingkai dihasilkan selari (beberapa proses), kemudian disambung & dimux
dengan audio dari build/audio/<nama>.wav (scripts/audio.py).
"""
import os, sys, subprocess, argparse, math
from multiprocessing import Process
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from engine import FX, FPS, ROOT, ease, clamp01, window, screen, alpha_over
import timelines

BUILD = os.path.join(ROOT, "build")
OUT = os.path.join(ROOT, "out")


def ends(shots):
    e = []
    for i, s in enumerate(shots):
        nxt = shots[i + 1] if i + 1 < len(shots) else None
        e.append(s.t + s.d + (nxt.tr[1] if nxt is not None and nxt.tr else 0.0))
    return e


def _scale(f, z):
    H, W = f.shape[:2]
    im = Image.fromarray((f.clip(0, 1) * 255).astype(np.uint8))
    bw, bh = W / z, H / z
    im = im.transform((W, H), Image.EXTENT, ((W - bw) / 2, (H - bh) / 2, (W + bw) / 2, (H + bh) / 2), Image.BILINEAR)
    return np.asarray(im, np.float32) / 255.0


class Renderer:
    def __init__(self, tl):
        self.tl = tl
        self.W, self.H = tl["W"], tl["H"]
        self.shots = tl["shots"]
        self.ends = ends(self.shots)
        self.fx = FX(self.W, self.H)
        self.wipe_x = np.linspace(0, 1, self.W, dtype=np.float32)[None, :, None]
        self.wipe_y = np.linspace(0, 1, self.H, dtype=np.float32)[:, None, None]

    def frame(self, t):
        W, H = self.W, self.H
        act = [i for i, s in enumerate(self.shots) if s.t <= t < self.ends[i]]
        for i, s in enumerate(self.shots):  # tutup pembaca video lama
            if self.ends[i] + 0.1 < t:
                s.close()
        if not act:
            f = np.zeros((H, W, 3), np.float32)
        else:
            cur = self.shots[act[-1]]
            f = cur.render(t - cur.t, W, H)
            if len(act) > 1 and cur.tr:
                prev = self.shots[act[-2]]
                fa = prev.render(t - prev.t, W, H)
                kind, L = cur.tr
                q = ease(clamp01((t - cur.t) / L))
                if kind == "zoom":
                    fa = _scale(fa, 1 + 0.18 * q)
                    f = _scale(f, 1.12 - 0.12 * q)
                    f = fa * (1 - q) + f * q
                elif kind == "wipe":
                    edge = (self.wipe_x * 0.85 + self.wipe_y * 0.15)
                    m = np.clip((q * 1.3 - edge) / 0.3 + 0.0, 0, 1)
                    f = fa * (1 - m) + f * m
                else:
                    f = fa * (1 - q) + f * q
        # light leak berterusan
        for (a, b, k, inten) in self.tl["fx"]["leaks"]:
            w = window(t, a, b, 1.5, 1.5)
            if w > 0:
                lk = self.fx.leak(t, k)
                f = screen(f, lk * inten * w * (0.75 + 0.25 * math.sin(t * 0.9 + k)))
        # film burn pada titik peralihan
        for tb in self.tl["fx"]["burns"]:
            c = 1 - abs(t - tb) / 0.5
            if c > 0:
                c = c ** 1.5
                lk = self.fx.leak(t * 3, int(tb) % 4)
                f = screen(f, np.clip(lk * 1.6 * c, 0, 1))
                f = f + (1 - f) * (c ** 2) * 0.55
        # grafik
        ovs = [o for o in self.tl["ovs"] if o.active(t)]
        if ovs:
            L = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            for o in ovs:
                o.draw(L, t)
            f = alpha_over(f, L)
        fo = self.tl["fx"].get("fade_out")
        if fo and t > fo[0]:
            f = f * (1 - ease(clamp01((t - fo[0]) / (fo[1] - fo[0]))))
        f = self.fx.finish(f, t)
        return (np.clip(f, 0, 1) * 255 + 0.5).astype(np.uint8)


def worker(name, f0, f1, path):
    tl = timelines.ALL[name]()
    r = Renderer(tl)
    W, H = r.W, r.H
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                            "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "13",
                            "-pix_fmt", "yuv420p", path], stdin=subprocess.PIPE)
    for fi in range(f0, f1):
        enc.stdin.write(r.frame(fi / FPS).tobytes())
        if (fi - f0) % 120 == 0:
            print(f"[{name}] {path[-10:]} {fi - f0}/{f1 - f0}", flush=True)
    enc.stdin.close(); enc.wait()
    for s in tl["shots"]:
        s.close()


def render(name, workers=4, t0=0.0, t1=None):
    tl = timelines.ALL[name]()
    total = tl["fx"]["end"] if t1 is None else t1
    F0, F1 = int(round(t0 * FPS)), int(round(total * FPS))
    os.makedirs(BUILD, exist_ok=True); os.makedirs(OUT, exist_ok=True)
    n = F1 - F0
    chunk = math.ceil(n / workers)
    segs, ps = [], []
    for k in range(workers):
        a, b = F0 + k * chunk, min(F1, F0 + (k + 1) * chunk)
        if a >= b:
            continue
        p = os.path.join(BUILD, f"seg_{name}_{k}.mp4")
        segs.append(p)
        pr = Process(target=worker, args=(name, a, b, p)); pr.start(); ps.append(pr)
    for pr in ps:
        pr.join()
        if pr.exitcode != 0:
            raise SystemExit(f"worker gagal ({pr.exitcode})")
    lst = os.path.join(BUILD, f"seg_{name}.txt")
    open(lst, "w").write("".join(f"file '{s}'\n" for s in segs))
    video = os.path.join(BUILD, f"video_{name}.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", video], check=True)
    return video


def mux(name, video, crf=None):
    wav = os.path.join(BUILD, "audio", f"{name}.wav")
    fn = {"main": "dari-parit-ke-terengganu_dokumentari_16x9_1080p.mp4",
          "teaser": "dari-parit-ke-terengganu_teaser30s_16x9.mp4",
          "reel": "dari-parit-ke-terengganu_highlight60s_9x16.mp4"}[name]
    out = os.path.join(OUT, fn)
    crf = crf or {"main": "21", "teaser": "19", "reel": "20"}[name]
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", video]
    if os.path.exists(wav):
        cmd += ["-i", wav, "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "192k", "-shortest"]
    cmd += ["-c:v", "libx264", "-preset", "slow", "-crf", crf, "-pix_fmt", "yuv420p", "-profile:v", "high",
            "-movflags", "+faststart", "-r", str(FPS), out]
    subprocess.run(cmd, check=True)
    print("✓", out)
    return out


if __name__ == "__main__":
    if sys.argv[1] == "still":
        tl = timelines.ALL[sys.argv[2]]()
        r = Renderer(tl)
        for ts in sys.argv[3:]:
            t = float(ts)
            # 'panaskan' klip video supaya bingkai betul
            Image.fromarray(r.frame(t)).save(os.path.join(BUILD, f"still_{sys.argv[2]}_{t:.1f}.jpg"), quality=90)
            for s in tl["shots"]:
                s.close()
                if hasattr(s, "reader"):
                    s.reader = None
        sys.exit()
    ap = argparse.ArgumentParser()
    ap.add_argument("name")
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("--from", dest="t0", type=float, default=0.0)
    ap.add_argument("--to", dest="t1", type=float, default=None)
    ap.add_argument("--no-mux", action="store_true")
    a = ap.parse_args()
    v = render(a.name, a.workers, a.t0, a.t1)
    if not a.no_mux:
        mux(a.name, v)
