#!/usr/bin/env python3
"""
Audio: skor muzik asli (piano lembut, strings inspirasi, cello, perkusi lembut —
100% disintesis prosedur, bebas royalti), bunyi suasana, audio sebenar
daripada rakaman (ucapan + suasana bilik), voice-over, dan ducking automatik.

Guna: python3 scripts/audio.py main|teaser|reel
Output: build/audio/<nama>.wav (48 kHz stereo) + build/audio/<nama>_music.wav
"""
import os, sys, subprocess
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from engine import ROOT, RAW
import timelines
from shots import Clip

SR = 48000
OUTD = os.path.join(ROOT, "build", "audio")


def bq(x, kind, f, order=2):
    return sosfilt(butter(order, f, kind, fs=SR, output="sos"), x)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


class Buf:
    def __init__(self, dur):
        self.N = int(dur * SR)
        self.b = np.zeros((2, self.N), np.float64)

    def add(self, sig, t, gain=1.0, pan=0.0):
        i = int(t * SR)
        if i >= self.N or sig.ndim == 1 and i + len(sig) <= 0:
            return
        if i < 0:
            sig = sig[..., -i:]; i = 0
        if sig.ndim == 1:
            s = sig[: self.N - i]
            self.b[0, i:i + len(s)] += s * np.cos((pan + 1) * np.pi / 4) * gain
            self.b[1, i:i + len(s)] += s * np.sin((pan + 1) * np.pi / 4) * gain
        else:
            s = sig[:, : self.N - i]
            self.b[:, i:i + s.shape[1]] += s * gain


def reverb(st, sec=3.0, wet=0.32, seed=1):
    r = np.random.default_rng(seed)
    n = int(sec * SR); t = np.arange(n) / SR
    out = np.zeros_like(st)
    for ch in range(2):
        ir = bq(r.standard_normal(n), "low", 5500) * np.exp(-t * 6.9 / sec)
        ir[: int(0.015 * SR)] *= np.linspace(0, 1, int(0.015 * SR))
        ir /= np.sqrt((ir ** 2).sum())
        out[ch] = fftconvolve(st[ch], ir)[: st.shape[1]]
    return st * (1 - wet) + out * wet


rng = np.random.default_rng(26)


def piano(note, dur, vel=0.5):
    f = midi(note); L = dur + 2.4
    t = np.arange(int(L * SR)) / SR
    s = np.zeros_like(t)
    for k in range(1, 10):
        fk = f * k * np.sqrt(1 + 0.0003 * k * k)
        if fk > SR / 2.3:
            break
        s += (1 / k ** 1.3) * np.exp(-t * (0.5 + 0.38 * k + f / 1000)) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.3))
    rel = np.where(t > dur, np.exp(-(t - dur) * 3.5), 1.0)
    s = s * rel * np.minimum(1, t / 0.005)
    s += bq(rng.standard_normal(len(t)), "low", 2400) * np.exp(-t * 70) * 0.04
    return bq(s * vel, "low", 1500 + 5000 * vel)


def bowed(note, dur, bright=2400, att=0.8):
    f = midi(note)
    t = np.arange(int((dur + 1.8) * SR)) / SR
    s = np.zeros_like(t)
    for det in (-0.08, 0.0, 0.07):
        vib = 1 + 0.003 * np.sin(2 * np.pi * (4.8 + det * 5) * t + rng.uniform(0, 6))
        ph = 2 * np.pi * np.cumsum(f * 2 ** (det / 12) * vib) / SR
        for k in range(1, 12):
            if f * k > 8000:
                break
            s += np.sin(k * ph) / k
    e = (1 - np.exp(-t / att)) * np.where(t > dur, np.exp(-(t - dur) / 0.7), 1.0)
    return bq(s * e, "low", bright) * 0.05


def kick():
    t = np.arange(int(0.6 * SR)) / SR
    return np.sin(2 * np.pi * (48 + 50 * np.exp(-t * 30)) * t) * np.exp(-t * 7)


def shaker():
    t = np.arange(int(0.12 * SR)) / SR
    return bq(rng.standard_normal(len(t)), "band", [5000, 11000]) * np.exp(-((t - 0.03) ** 2) / 0.0004)


def boom():
    t = np.arange(int(4.0 * SR)) / SR
    s = np.sin(2 * np.pi * (38 + 30 * np.exp(-t * 4)) * t) * np.exp(-t * 1.2)
    s += bq(rng.standard_normal(len(t)), "low", 300) * np.exp(-t * 3) * 0.4
    return s


def riser(d=1.8):
    t = np.arange(int(d * SR)) / SR
    n = rng.standard_normal(len(t))
    out = np.zeros_like(t)
    for j, (lo, hi) in enumerate([(300, 900), (900, 2500), (2500, 7000)]):
        out += bq(n, "band", [lo, hi]) * (t / d) ** (1.5 + j)
    return out * (t / d) ** 2


CH = {"Bm": [47, 54, 59, 62, 66], "G": [43, 50, 55, 59, 62], "D": [38, 50, 54, 57, 62],
      "A": [45, 52, 57, 61, 64], "Em": [40, 52, 55, 59, 64], "Gmaj7": [43, 50, 54, 59, 62],
      "A/C#": [49, 52, 57, 61, 64], "Dsus": [38, 50, 55, 57, 62]}
PROG = ["D", "A/C#", "Bm", "G", "D", "A", "Em", "A", "Bm", "G", "D", "A", "Gmaj7", "A", "Dsus", "D"]
MEL = [(0, 74, 1.5), (1.67, 76, 0.8), (2.5, 78, 2.2), (5.0, 81, 1.3), (6.67, 78, 0.8), (7.5, 76, 2.4),
       (10.0, 74, 1.5), (11.67, 73, 0.8), (12.5, 71, 2.2), (15.0, 73, 1.3), (16.67, 76, 0.8), (17.5, 74, 3.0)]


def music(total, cues, hits):
    B = Buf(total + 3)
    beat = 60 / 72; bar = beat * 4
    ct = np.array([c[0] for c in cues]); cv = np.array([c[1] for c in cues])
    I = lambda t: float(np.interp(t, ct, cv))
    strings = Buf(total + 3)
    nb = int(total / bar) + 1
    for bi in range(nb):
        t0 = bi * bar
        ch = CH[PROG[bi % len(PROG)]]
        it = I(t0 + bar / 2)
        if it <= 0.02:
            continue
        # strings pad (sentiasa) + cello akar
        for j, n in enumerate(ch[1:]):
            strings.add(bowed(n + (12 if j >= 2 else 0), bar + 0.1, 1800 + 1800 * it), t0 - 0.05, 0.5 + 0.6 * it, -0.6 + j * 0.4)
        if it > 0.38:
            strings.add(bowed(ch[0] - 12 if ch[0] > 40 else ch[0], bar, 900, 0.4), t0, 0.9 * it, 0.0)
        # piano
        if it < 0.35:
            for j, n in enumerate([ch[2] + 12, ch[4] + 12]):
                B.add(piano(n, 2.0, 0.22), t0 + j * beat * 2 + 0.05, 0.8, 0.3 * (2 * j - 1))
        else:
            steps = 8 if it < 0.72 else 12
            pat = [1, 2, 3, 4, 3, 2, 4, 3, 2, 3, 4, 2]
            for j in range(steps):
                n = ch[pat[j % len(pat)]] + 12
                v = 0.2 + 0.14 * it + (0.06 if j == 0 else 0)
                B.add(piano(n, 0.9, v), t0 + j * bar / steps, 0.7, 0.4 * np.sin(j * 1.3))
            B.add(piano(ch[0], bar, 0.3), t0, 0.7, -0.15)
        # melodi
        if it > 0.55:
            ph = (bi % 6) * bar
            for (tm, n, d) in MEL:
                if ph <= tm < ph + bar:
                    B.add(piano(n, d, 0.24 + 0.12 * it), t0 + tm - ph, 0.65, 0.15)
                    strings.add(bowed(n, d, 3000), t0 + tm - ph, 0.35 * it, 0.2)
        # perkusi lembut
        if it > 0.6:
            g = (it - 0.6) / 0.4
            for k in (0, 2):
                B.add(kick(), t0 + k * beat, 0.35 * g)
            for k in range(8):
                B.add(shaker(), t0 + k * beat / 2, (0.05 + 0.03 * (k % 2)) * g, 0.4)
    B.b += strings.b
    for h in hits:
        B.add(riser(1.8), h - 1.8, 0.10, 0.0)
        B.add(boom(), h, 0.45)
        for j, n in enumerate([62, 66, 69, 74]):
            B.add(piano(n + 12, 3.0, 0.32), h + j * 0.05, 0.5, -0.3 + j * 0.2)
    B.b = reverb(B.b, 3.2, 0.36, 3)
    B.b = bq(B.b, "high", 30)
    env = np.interp(np.arange(B.N) / SR, [0, 0.5, total - 3, total], [0, 1, 1, 0])
    B.b *= env
    B.b /= np.abs(B.b).max() + 1e-9
    return B.b[:, : int(total * SR)]


def noise_bed(d, lo, hi, seed, mod=0.1):
    r = np.random.default_rng(seed); n = int(d * SR); t = np.arange(n) / SR
    s = bq(r.standard_normal(n), "band", [lo, hi]) * (0.75 + 0.25 * np.sin(2 * np.pi * mod * t + seed))
    f = np.minimum(1, np.minimum(t / 1.5, (t[-1] - t) / 1.5))
    return s * f


def chirp():
    d = rng.uniform(0.06, 0.16); t = np.arange(int(d * SR)) / SR
    f = rng.uniform(2600, 4200) + rng.uniform(-1500, 1800) * t / d + 300 * np.sin(2 * np.pi * rng.uniform(18, 40) * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 2


def birds(B, a, b, g=0.035, dens=1.2):
    B.add(noise_bed(b - a, 180, 1400, int(a), 0.15), a, g * 1.4, -0.2)
    for _ in range(int((b - a) * dens)):
        B.add(chirp(), rng.uniform(a, b - 0.3), g, rng.uniform(-0.8, 0.8))


def road(B, a, b, g=0.06):
    d = b - a; t = np.arange(int(d * SR)) / SR
    hum = np.sin(2 * np.pi * (46 + 3 * np.sin(t * 0.4)) * t) + 0.5 * np.sin(2 * np.pi * 92 * t)
    s = bq(hum, "low", 200) * 0.5 + noise_bed(d, 60, 700, 9, 0.05) * 1.5
    f = np.minimum(1, np.minimum(t / 2.5, (t[-1] - t) / 2.5))
    B.add(s * f, a, g)


def src_audio(name, t0, d, clean=False):
    af = "highpass=f=90,lowpass=f=9000" + (",dynaudnorm=f=150:g=15" if clean else "")
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t0:.3f}", "-t", f"{d:.3f}", "-i", os.path.join(RAW, name),
                          "-vn", "-af", af, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    s = np.frombuffer(raw, np.float32).astype(np.float64)
    if len(s) == 0:
        return s
    fl = min(len(s) // 2, int(0.25 * SR))
    s[:fl] *= np.linspace(0, 1, fl); s[-fl:] *= np.linspace(1, 0, fl)
    return s


def smooth_env(x, att, rel):
    y = np.empty_like(x); v = x[0]
    a, r = np.exp(-1 / (att * 100)), np.exp(-1 / (rel * 100))
    for i, xi in enumerate(x):
        c = a if xi < v else r
        v = c * v + (1 - c) * xi
        y[i] = v
    return y


def build(name):
    tl = timelines.ALL[name]()
    total = tl["fx"]["end"]
    os.makedirs(OUTD, exist_ok=True)
    m = music(total, tl["music"]["cues"], tl["music"]["hits"])
    sf.write(os.path.join(OUTD, f"{name}_music.wav"), m.T.astype(np.float32), SR)
    amb = Buf(total)
    voice = Buf(total)
    duck = np.ones(int(total * 100))  # 100 Hz
    # ---- suasana mengikut jenis shot
    if name == "main":
        birds(amb, 0.0, 11.5, 0.03)
        road(amb, 18.0, 37.0, 0.07)
        road(amb, 189.0, 197.5, 0.05)
        birds(amb, 36.0, 81.0, 0.03, 0.8)
        amb.add(noise_bed(130, 120, 900, 4, 0.05), 81.0, 0.025)
    elif name == "teaser":
        birds(amb, 0, 5, 0.03); road(amb, 5.0, 10.5, 0.06)
    else:
        birds(amb, 0, 3.5, 0.03); road(amb, 3.2, 11.2, 0.06); birds(amb, 11.2, 21.4, 0.025, 0.8)
    # ---- bunyi asal klip (suasana bilik sebenar) untuk klip gerak perlahan
    bite_at = {round(b[3], 2) for b in tl["audio"]["bites"]}
    for s in tl["shots"]:
        if isinstance(s, Clip) and round(s.t, 2) not in bite_at:
            a = src_audio(s.kw["src"], s.kw.get("src_t", 0), s.d)
            amb.add(a, s.t, 0.35)
    # ---- ucapan sebenar
    for (src, st, d, at, g) in tl["audio"]["bites"]:
        a = src_audio(src, st, d, clean=True)
        voice.add(a / (np.abs(a).max() + 1e-9) * 0.8, at, g)
        duck[int(at * 100): int((at + d) * 100)] = np.minimum(duck[int(at * 100): int((at + d) * 100)], 0.16)
    # ---- voice-over
    for key, at in tl["audio"]["vo"]:
        v, sr = sf.read(os.path.join(ROOT, "build", "vo", f"{key}.wav"))
        voice.add(v, at, 0.95)
        duck[int(at * 100): int((at + len(v) / sr) * 100)] = np.minimum(duck[int(at * 100): int((at + len(v) / sr) * 100)], 0.30)
    de = smooth_env(np.r_[duck[30:], np.ones(30)], 0.25, 0.7)  # mula duck 0.3 s lebih awal
    de = np.interp(np.arange(int(total * SR)) / SR, np.arange(len(de)) / 100, de)
    mix = m * 0.42 * de + amb.b[:, : m.shape[1]] * 1.0 + voice.b[:, : m.shape[1]]
    # kurangkan suasana juga semasa suara
    fo = tl["fx"].get("fade_out")
    if fo:
        tt = np.arange(mix.shape[1]) / SR
        mix *= np.interp(tt, [0, fo[0], fo[1] + 0.3, total], [1, 1, 0, 0])
    mix = np.tanh(mix * 1.2) / np.tanh(1.2)
    rms = np.sqrt((mix ** 2).mean())
    mix *= min(0.13 / rms, 0.97 / np.abs(mix).max())
    sf.write(os.path.join(OUTD, f"{name}.wav"), mix.T.astype(np.float32), SR)
    print("✓ audio", name, f"{total:.1f}s")


if __name__ == "__main__":
    for n in sys.argv[1:] or ["main", "teaser", "reel"]:
        build(n)
