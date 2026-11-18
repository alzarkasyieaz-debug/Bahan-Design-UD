#!/usr/bin/env python3
"""
Muzik latar asli + mixing akhir untuk "Sebuah Rindu… Kenangan Indah di Tanah Suci".
100% disintesis secara prosedur (bebas royalti, tiada sampel luar).

  public/audio/muzik.wav  – piano emosi + orchestral strings + pad + seruling (ney) + perkusi lembut
  public/audio/mix.wav    – muzik + suara latar (public/audio/vo/babak-NN.wav) dengan ducking automatik

Struktur emosi (mengikut brief):
  00:00–00:30 lembut, nostalgia | 00:30–01:00 hangat | 01:00–01:20 sedikit ceria
  01:20–01:50 emosional & mendalam | 01:50–02:00 kemuncak + piano fade-out
Keperluan: numpy, scipy
"""
import json, os
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 44100
DUR = 120.0
N = int(SR * DUR)
rng = np.random.default_rng(1447)
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "audio")
# Masa mula suara latar bagi setiap babak (saat dalam babak). Mesti sama dengan src/data/timeline.ts
VO_OFFSET = {1: 3.0, 2: 1.0, 3: 1.4, 4: 1.2, 5: 1.4, 6: 1.6, 7: 1.2, 8: 1.4, 9: 1.2, 10: 1.0, 11: 1.4}


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def add(buf, sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= buf.shape[1] or i + len(sig) <= 0:
        return
    s = sig[: max(0, buf.shape[1] - i)]
    l = np.cos((pan + 1) * np.pi / 4) * gain
    r = np.sin((pan + 1) * np.pi / 4) * gain
    buf[0, i:i + len(s)] += s * l
    buf[1, i:i + len(s)] += s * r


def env_curve(points, n=N):
    t = np.arange(n) / SR
    xs, ys = zip(*points)
    return np.interp(t, xs, ys)


def reverb(stereo, seconds=3.2, wet=0.35, seed=1):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(stereo)
    for ch in range(2):
        ir = r.standard_normal(n) * np.exp(-t * 6.9 / seconds)
        ir = lp(ir, 5000)
        ir[: int(0.015 * SR)] *= np.linspace(0, 1, int(0.015 * SR))
        ir /= np.sqrt(np.sum(ir ** 2))
        out[ch] = fftconvolve(stereo[ch], ir)[: stereo.shape[1]]
    return stereo * (1 - wet) + out * wet


# ------------------------------------------------------------------ instrumen
def piano(note, dur, vel=0.5):
    f = midi(note)
    t = np.arange(int((dur + 2.8) * SR)) / SR
    sig = np.zeros_like(t)
    for k in range(1, 11):
        fk = f * k * np.sqrt(1 + 0.0003 * k * k)
        if fk > SR / 2.2:
            break
        decay = 0.5 + 0.33 * k + f / 1000
        sig += (1 / k ** 1.3) * np.exp(-t * decay) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28))
    rel = np.ones_like(t)
    off = int(dur * SR)
    if off < len(t):
        rel[off:] = np.exp(-(t[off:] - dur) * 3.0)
    att = np.minimum(1, t / 0.005)
    hammer = lp(rng.standard_normal(len(t)), 2200) * np.exp(-t * 70) * 0.04
    return lp((sig * rel * att + hammer) * vel, 1500 + 4200 * vel)


def strings_note(note, dur, bright=2200):
    f = midi(note)
    t = np.arange(int((dur + 2.2) * SR)) / SR
    sig = np.zeros_like(t)
    for det in (-0.1, -0.03, 0.04, 0.11):
        vib = 1 + 0.0025 * np.sin(2 * np.pi * (4.8 + det * 5) * t + rng.uniform(0, 6))
        ph = 2 * np.pi * np.cumsum(f * (2 ** (det / 12)) * vib) / SR
        for k in range(1, 14):
            if f * k > 9000:
                break
            sig += np.sin(k * ph) / k
    att = 1 - np.exp(-t / 1.1)
    rel = np.where(t > dur, np.exp(-(t - dur) / 0.9), 1.0)
    return lp(sig * att * rel, bright) * 0.045


def pad_note(note, dur):
    f = midi(note)
    t = np.arange(int((dur + 3.0) * SR)) / SR
    sig = np.zeros_like(t)
    for det in (-0.07, 0.0, 0.07):
        sig += np.sin(2 * np.pi * f * 2 ** (det / 12) * t) + 0.3 * np.sin(4 * np.pi * f * 2 ** (det / 12) * t)
    att = 1 - np.exp(-t / 2.0)
    rel = np.where(t > dur, np.exp(-(t - dur) / 1.6), 1.0)
    shimmer = 0.85 + 0.15 * np.sin(2 * np.pi * 0.17 * t)
    return sig * att * rel * shimmer * 0.05


def ney(note, dur, slide_from=None):
    """Seruling ney: sinus bernafas + vibrato lambat + hembusan; slide pilihan dari nota lain."""
    f1 = midi(note)
    t = np.arange(int((dur + 0.6) * SR)) / SR
    if slide_from is not None:
        f0 = midi(slide_from)
        f = f1 + (f0 - f1) * np.exp(-t / 0.09)
    else:
        f = np.full_like(t, f1)
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / 0.6)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    tone = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
    breath = bp(rng.standard_normal(len(t)), f1 * 0.8, f1 * 3.5) * 0.35
    e = np.minimum(1, t / 0.18) * np.where(t > dur, np.exp(-(t - dur) / 0.2), 1.0)
    return (tone + breath) * e * 0.09


def frame_drum(low=True):
    t = np.arange(int(0.6 * SR)) / SR
    if low:
        s = np.sin(2 * np.pi * (70 - 18 * t) * t) * np.exp(-t * 9) + lp(rng.standard_normal(len(t)), 300) * np.exp(-t * 30) * 0.3
    else:
        s = bp(rng.standard_normal(len(t)), 700, 4000) * np.exp(-t * 40) * 0.5 + np.sin(2 * np.pi * 330 * t) * np.exp(-t * 25) * 0.3
    return s


def chime(note):
    f = midi(note)
    t = np.arange(int(3.5 * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * d) for m, a, d in
            [(1, 1, 1.4), (2.76, 0.4, 2.5), (5.4, 0.2, 4), (8.9, 0.1, 6)])
    return s * np.minimum(1, t / 0.002) * 0.12


def swell(dur=2.2, seed=0):
    r = np.random.default_rng(seed)
    t = np.arange(int(dur * SR)) / SR
    s = bp(r.standard_normal(len(t)), 400, 3200) * np.sin(np.pi * t / dur) ** 3
    return s * 0.05


# ------------------------------------------------------------------ gubahan
CH = {  # B minor / D major
    "Bm": [47, 54, 59, 62, 66], "G": [43, 50, 55, 59, 62], "D": [38, 50, 54, 57, 62],
    "A": [45, 52, 57, 61, 64], "Em": [40, 52, 55, 59, 64], "F#m": [42, 49, 54, 57, 61],
    "Gmaj7": [43, 50, 54, 59, 62], "Asus": [45, 52, 57, 62, 64], "D/F#": [42, 50, 54, 57, 62],
}
PROG = [  # satu kord = 5 s
    "Bm", "G", "D", "A",          # 0–20
    "Bm", "G",                    # 20–30
    "Em", "G", "D", "A",          # 30–50
    "Bm", "Asus",                 # 50–60
    "D", "A", "Bm", "G",          # 60–80 (ceria)
    "Em", "D/F#", "G", "A",       # 80–100
    "Bm", "Gmaj7",                # 100–110
    "G", "D",                     # 110–120 kemuncak + penutup
]
MELODY_A = [(0.0, 74, 1.6), (1.7, 73, 0.8), (2.5, 71, 2.3), (5.0, 71, 1.6), (6.7, 69, 0.8), (7.5, 67, 2.3)]
MELODY_B = [(0.0, 69, 1.6), (1.7, 71, 0.8), (2.5, 74, 2.3), (5.0, 73, 1.6), (6.7, 71, 0.8), (7.5, 69, 2.3)]


def build_music():
    buf = np.zeros((2, N))
    beat = 60 / 72
    for ci, name in enumerate(PROG):
        t0 = ci * 5.0
        notes = CH[name]
        if t0 < 30:  # nota panjang, jarang
            add(buf, piano(notes[0] - 12 if notes[0] > 40 else notes[0], 4.8, 0.26), t0, 0.8, -0.2)
            for j, n in enumerate(notes[2:]):
                add(buf, piano(n + 12, 2.2, 0.24), t0 + 0.5 + j * beat * 1.6, 0.75, 0.3 * (j - 1))
        elif t0 < 110:
            add(buf, piano(notes[0] - 12 if notes[0] > 40 else notes[0], 4.8, 0.3), t0, 0.85, -0.2)
            cheerful = 60 <= t0 < 80
            pat = [1, 2, 3, 4, 3, 2, 3, 4] if not cheerful else [1, 3, 4, 3, 2, 3, 4, 3, 1, 3, 4, 3]
            n_steps = len(pat)
            base_vel = 0.2 + 0.08 * (t0 - 30) / 80
            for j, p in enumerate(pat):
                add(buf, piano(notes[p] + 12, 0.9, base_vel + (0.05 if j == 0 else 0)),
                    t0 + j * 5.0 / n_steps, 0.7, 0.35 * np.sin(j * 1.3))
        elif name == "G":  # 110–115: kemuncak
            for j, n in enumerate(notes):
                add(buf, piano(n + (12 if j else 0), 4.6, 0.42), t0 + j * 0.06, 0.85, -0.3 + j * 0.15)
            for j, n in enumerate([74, 79, 83, 86]):
                add(buf, piano(n, 1.2, 0.3), t0 + 1.2 + j * beat / 2, 0.6, 0.2)
        else:  # 115–120: penutup piano lembut berakhir pada D
            add(buf, piano(38, 6.0, 0.3), t0, 0.85)
            for j, n in enumerate([62, 66, 69, 74, 78]):
                add(buf, piano(n, 5.0 - j * 0.6, 0.26 - j * 0.03), t0 + j * 0.5, 0.7, -0.3 + j * 0.15)
    # melodi
    for (t, n, d) in MELODY_A:
        add(buf, piano(n + 12, d, 0.28), 40 + t, 0.55, 0.15)
    for (t, n, d) in MELODY_B:
        add(buf, piano(n + 12, d, 0.3), 50 + t, 0.55, 0.15)
    for (t, n, d) in MELODY_A:
        add(buf, piano(n + 12, d, 0.32), 90 + t, 0.6, -0.1)
    for (t, n, d) in MELODY_B:
        add(buf, piano(n + 12, d, 0.34), 100 + t, 0.6, -0.1)

    # strings: masuk 30 s, membina, kemuncak 110–114
    strings = np.zeros((2, N))
    for ci, name in enumerate(PROG):
        t0 = ci * 5.0
        if t0 < 25 or t0 >= 115:
            continue
        for j, n in enumerate(CH[name][1:]):
            add(strings, strings_note(n + (12 if j >= 2 else 0), 5.3, 2000 + 12 * max(0, t0 - 30)),
                t0 - 0.15, 1.0, -0.6 + j * 0.4)
    strings *= env_curve([(0, 0), (25, 0), (32, 0.4), (60, 0.55), (80, 0.6), (95, 0.8), (108, 1.0),
                          (111, 1.25), (114, 1.1), (116.5, 0.2), (119, 0)])
    buf += strings

    # pad atmosfera (sepanjang video, rendah)
    pads = np.zeros((2, N))
    for ci, name in enumerate(PROG):
        for j, n in enumerate(CH[name][1:4]):
            add(pads, pad_note(n, 5.2), ci * 5.0, 1.0, -0.5 + j * 0.5)
    pads *= env_curve([(0, 0), (3, 0.9), (30, 0.7), (60, 0.5), (100, 0.6), (116, 0.7), (120, 0)])
    buf += pads

    # dron B rendah + seruling ney (suasana Timur Tengah halus)
    t = np.arange(N) / SR
    drone = (np.sin(2 * np.pi * midi(35) * t) + 0.4 * np.sin(2 * np.pi * midi(42) * t)) * 0.04
    drone *= env_curve([(0, 0), (4, 1), (28, 1), (34, 0), (68, 0), (72, 0.9), (80, 0.9), (84, 0), (120, 0)])
    buf += np.vstack([drone, drone])
    ney_phrases = [
        (21.0, [(71, 1.2, 73), (69, 0.5, None), (67, 0.5, None), (66, 2.2, 67)]),
        (25.5, [(66, 0.6, None), (67, 0.6, None), (69, 1.0, 71), (66, 1.8, None)]),
        (71.2, [(74, 1.2, 76), (73, 0.5, None), (71, 0.5, None), (69, 2.0, 71)]),
        (75.6, [(71, 0.6, None), (69, 0.6, None), (67, 0.8, None), (66, 2.2, 67)]),
    ]
    for start, notes in ney_phrases:
        tt = start
        for (n, d, sl) in notes:
            add(buf, ney(n, d, sl), tt, 0.9, 0.25)
            tt += d

    # perkusi frame drum lembut di bahagian emosi & kemuncak
    beat = 60 / 72
    tt = 80.0
    while tt < 114.5:
        k = int(round((tt - 80) / (beat / 2)))
        g = 0.05 if tt < 100 else 0.08 if tt < 110 else 0.12
        if k % 4 == 0:
            add(buf, frame_drum(True), tt, g * 1.4, 0.0)
        elif k % 4 == 3:
            add(buf, frame_drum(False), tt, g * 0.5, 0.3)
        tt += beat / 2
    add(buf, frame_drum(True), 110.0, 0.28)

    # chime pada pendedahan tajuk
    for when, n in ((2.6, 86), (2.9, 90), (113.8, 86), (114.1, 90), (114.4, 93)):
        add(buf, chime(n), when, 0.8, 0.2)
    # swell udara pada peralihan babak
    for k in range(1, 12):
        add(buf, swell(2.2, k), k * 10.0 - 1.4, 1.0, 0.0)

    buf *= env_curve([(0, 0), (1.0, 1), (114, 1), (119.7, 0), (120, 0)])
    buf = reverb(buf, 3.6, 0.4, seed=5)
    buf = hp(buf, 35)
    buf /= np.max(np.abs(buf)) + 1e-9
    return buf * 0.8


def load_vo():
    vo = np.zeros(N)
    vd = os.path.join(OUT, "vo")
    for scene, off in VO_OFFSET.items():
        p = os.path.join(vd, f"babak-{scene:02d}.wav")
        if not os.path.exists(p):
            continue
        sr, x = wavfile.read(p)
        assert sr == SR, p
        x = x.astype(np.float64) / 32768.0
        if x.ndim > 1:
            x = x.mean(axis=1)
        i = int(((scene - 1) * 10.0 + off) * SR)
        vo[i:i + len(x)] += x[: N - i]
    return vo


def smooth_env(x, attack=0.06, release=0.5):
    a = np.exp(-1 / (attack * SR))
    r = np.exp(-1 / (release * SR))
    # dikira pada kadar rendah supaya pantas
    step = 64
    xs = np.abs(x[::step])
    out = np.zeros_like(xs)
    a = a ** step
    r = r ** step
    v = 0.0
    for i, s in enumerate(xs):
        v = a * v + (1 - a) * s if s > v else r * v + (1 - r) * s
        out[i] = v
    return np.repeat(out, step)[: len(x)]


def mix(music, vo):
    env = smooth_env(vo)
    env = np.clip(env / (np.percentile(env[env > 1e-4], 90) + 1e-9), 0, 1) if np.any(env > 1e-4) else env
    duck = 1 - 0.5 * env  # muzik turun ~6 dB semasa suara
    out = music * duck * 0.8
    reverb_vo = reverb(np.vstack([vo, vo]), 1.2, 0.12, seed=11)
    out += reverb_vo * 0.95
    peak = np.max(np.abs(out))
    return out / peak * 0.93


def write(name, buf):
    path = os.path.join(OUT, name)
    wavfile.write(path, SR, (np.clip(buf.T, -1, 1) * 32767).astype(np.int16))
    print("✓", os.path.normpath(path))


if __name__ == "__main__":
    m = build_music()
    write("muzik.wav", m)
    write("mix.wav", mix(m, load_vo()))
