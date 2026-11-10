#!/usr/bin/env python3
"""
Penjana audio asli (100% disintesis secara prosedur — tiada sampel berhak cipta).

Menghasilkan:
  public/audio/muzik.wav    – piano sinematik + ambient strings, 120 s
  public/audio/ambien.wav   – jam, degupan jantung, hujan, burung, angin, denting cawan, buku ditutup

Keperluan: python3, numpy, scipy  (pip install numpy scipy)
Jalankan:  python3 scripts/generate_audio.py
"""
import os
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 44100
DUR = 120.0
N = int(SR * DUR)
SCENE = 10.0
rng = np.random.default_rng(40)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
os.makedirs(OUT, exist_ok=True)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def add(buf, sig, t, gain=1.0, pan=0.0):
    """Tambah isyarat mono ke buffer stereo pada masa t (saat)."""
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0:
        return
    s = sig[: max(0, N - i)]
    l = np.cos((pan + 1) * np.pi / 4) * gain
    r = np.sin((pan + 1) * np.pi / 4) * gain
    buf[0, i : i + len(s)] += s * l
    buf[1, i : i + len(s)] += s * r


def env_curve(points):
    """Lengkung automasi linear daripada [(masa, nilai), ...]."""
    t = np.arange(N) / SR
    xs, ys = zip(*points)
    return np.interp(t, xs, ys)


def reverb(stereo, seconds=3.2, wet=0.35, seed=1):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(stereo)
    for ch in range(2):
        ir = r.standard_normal(n) * np.exp(-t * 6.9 / seconds)
        ir = lp(ir, 5200)
        ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
        ir /= np.sqrt(np.sum(ir ** 2))
        out[ch] = fftconvolve(stereo[ch], ir)[: stereo.shape[1]]
    return stereo * (1 - wet) + out * wet


# ---------------------------------------------------------------- PIANO
def piano(note, dur, vel=0.6):
    f = midi(note)
    length = dur + 2.5
    t = np.arange(int(length * SR)) / SR
    sig = np.zeros_like(t)
    for k in range(1, 11):
        fk = f * k * np.sqrt(1 + 0.00035 * k * k)  # sedikit inharmonik
        if fk > SR / 2.2:
            break
        decay = 0.55 + 0.35 * k + f / 900
        sig += (1 / k ** 1.25) * np.exp(-t * decay) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28))
    # lepas kekunci (release)
    rel = np.ones_like(t)
    off = int(dur * SR)
    if off < len(t):
        rel[off:] = np.exp(-(t[off:] - dur) * 4.0)
    att = np.minimum(1, t / 0.004)
    hammer = lp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 60) * 0.06
    s = (sig * rel * att + hammer) * vel
    # velocity lembut -> nada lebih gelap
    return lp(s, 1800 + 4500 * vel)


# ---------------------------------------------------------------- STRINGS
def strings_note(note, dur):
    f = midi(note)
    t = np.arange(int((dur + 2.0) * SR)) / SR
    sig = np.zeros_like(t)
    for det in (-0.09, 0.0, 0.08):
        vib = 1 + 0.0028 * np.sin(2 * np.pi * (4.6 + det * 4) * t + rng.uniform(0, 6))
        ph = 2 * np.pi * np.cumsum(f * (2 ** (det / 12)) * vib) / SR
        for k in range(1, 14):
            if f * k > 9000:
                break
            sig += np.sin(k * ph) / k
    att = 1 - np.exp(-t / 0.9)
    rel = np.where(t > dur, np.exp(-(t - dur) / 0.8), 1.0)
    return lp(sig * att * rel, 2400) * 0.06


# Progresi kord (2 kord setiap babak, 5 s setiap kord) — D major / B minor
CH = {
    "Bm": [47, 54, 59, 62, 66], "G": [43, 50, 55, 59, 62], "D": [38, 50, 54, 57, 62],
    "A": [45, 52, 57, 61, 64], "Em": [40, 52, 55, 59, 64], "A/C#": [49, 52, 57, 61, 64],
    "Gmaj7": [43, 50, 54, 59, 62], "Dsus": [38, 50, 55, 57, 62],
}
PROG = [
    "Bm", "G",  "D", "A",  "Bm", "G",  "D", "A",  "Bm", "G",  "Em", "A",
    "Bm", "G",  "D", "A/C#", "Bm", "G",  "Em", "A",  "Gmaj7", "A",  "Dsus", "D",
]
MELODY = {  # (masa, nota, tempoh) – baris melodi ringkas di register tinggi
    40: [(40.0, 78, 1.6), (41.7, 76, 0.8), (42.5, 74, 2.4), (45.0, 74, 1.6), (46.7, 71, 0.8), (47.5, 74, 2.4)],
    50: [(50.0, 76, 1.6), (51.7, 74, 0.8), (52.5, 73, 2.4), (55.0, 73, 1.6), (56.7, 76, 0.8), (57.5, 81, 2.4)],
}


def build_music():
    buf = np.zeros((2, N))
    beat = 60 / 72  # 72 bpm -> 12 ketukan = 10 s
    eighth = beat / 2
    for ci, name in enumerate(PROG):
        t0 = ci * 5.0
        notes = CH[name]
        scene = int(t0 // 10) + 1
        # Bass (not akar) – lembut
        if scene >= 2:
            add(buf, piano(notes[0] - 12 if notes[0] > 40 else notes[0], 4.8, 0.32), t0, 0.9, -0.2)
        if scene <= 2:
            # Pembukaan minimal: nota panjang jarang
            for j, n in enumerate([notes[2], notes[3], notes[4]]):
                add(buf, piano(n + 12, 2.0, 0.28), t0 + 0.4 + j * beat * 2, 0.8, 0.25 * (j - 1))
        elif scene <= 11:
            # Arpeggio not ke-8, makin padat mengikut emosi
            pattern = [1, 2, 3, 4, 3, 2] if scene < 7 else [1, 2, 3, 4, 3, 4, 2, 3, 4, 3, 2, 1]
            step = eighth if scene < 7 else eighth / 1.0
            n_steps = 12 if scene >= 7 else 6
            for j in range(n_steps):
                n = notes[pattern[j % len(pattern)]]
                vel = 0.22 + 0.04 * min(scene, 11) / 2 + (0.05 if j == 0 else 0)
                add(buf, piano(n + 12, step * 1.8, vel), t0 + j * (5.0 / n_steps), 0.75, 0.35 * np.sin(j))
        else:
            # Babak 12: kemuncak lembut kemudian penutup piano
            if ci == 22:
                for j, n in enumerate(notes[1:]):
                    add(buf, piano(n + 12, 4.0, 0.36), t0 + j * 0.18, 0.8, -0.3 + j * 0.2)
            if ci == 23:
                for j, n in enumerate([62, 66, 69, 74, 78]):
                    add(buf, piano(n + 12 if n < 70 else n, 6.0, 0.30 - j * 0.03), t0 + j * 0.42, 0.75, -0.3 + j * 0.15)
                add(buf, piano(38, 6.0, 0.35), t0, 0.9)
    for k, mel in MELODY.items():
        for (t, n, d) in mel:
            add(buf, piano(n, d, 0.33), t, 0.6, 0.15)
    # Melodi ulang di babak 9–11 satu oktaf lebih rendah untuk rasa muhasabah
    for (t, n, d) in MELODY[40]:
        add(buf, piano(n, d, 0.28), t + 50, 0.6, -0.15)
    for (t, n, d) in MELODY[50]:
        add(buf, piano(n, d, 0.3), t + 50, 0.6, -0.15)

    # Ambient strings: bermula babak 3, membina hingga babak 11, kemuncak lembut babak 12
    strings = np.zeros((2, N))
    for ci, name in enumerate(PROG):
        t0 = ci * 5.0
        if t0 < 20:
            continue
        for j, n in enumerate(CH[name][1:]):
            s = strings_note(n + (12 if j >= 2 else 0), 5.2)
            add(strings, s, t0 - 0.1, 1.0, -0.6 + j * 0.4)
    s_env = env_curve([(0, 0), (20, 0), (30, 0.35), (50, 0.5), (70, 0.65), (90, 0.75),
                       (100, 0.8), (108, 1.15), (112, 1.0), (115, 0.5), (119.5, 0)])
    strings *= s_env
    buf += strings

    master = env_curve([(0, 0), (1.2, 1), (113, 1), (119.6, 0), (120, 0)])
    buf *= master
    buf = reverb(buf, 3.4, 0.38, seed=3)
    buf = hp(buf, 35)
    buf /= np.max(np.abs(buf)) + 1e-9
    return buf * 0.85


# ---------------------------------------------------------------- AMBIEN / SFX
def tick():
    t = np.arange(int(0.05 * SR)) / SR
    s = np.sin(2 * np.pi * 2900 * t) * np.exp(-t * 180) + 0.5 * np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 120)
    return s + bp(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t * 300) * 0.4


def heartbeat():
    t = np.arange(int(0.25 * SR)) / SR
    th = np.sin(2 * np.pi * (55 - 15 * t) * t) * np.exp(-t * 22)
    return lp(th, 160)


def chirp():
    d = rng.uniform(0.06, 0.14)
    t = np.arange(int(d * SR)) / SR
    f0 = rng.uniform(2800, 4200)
    f = f0 + rng.uniform(-1500, 1800) * (t / d) + 300 * np.sin(2 * np.pi * rng.uniform(20, 45) * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.sin(np.pi * t / d) ** 2


def clink():
    t = np.arange(int(1.2 * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in
            [(2120, 1, 6), (3390, 0.6, 8), (5730, 0.35, 12), (7810, 0.2, 18)])
    return s * np.minimum(1, t / 0.001)


def book_close():
    t = np.arange(int(0.5 * SR)) / SR
    thump = lp(rng.standard_normal(len(t)), 400) * np.exp(-t * 25) * 3
    flap = bp(rng.standard_normal(len(t)), 800, 5000) * np.exp(-((t - 0.02) ** 2) / 0.0004) * 0.6
    return thump + flap


def noise_bed(start, end, lo, hi, fade=2.0, mod_rate=0.1, seed=0):
    r = np.random.default_rng(seed)
    n = int((end - start) * SR)
    t = np.arange(n) / SR
    s = bp(r.standard_normal(n), lo, hi)
    s *= 0.75 + 0.25 * np.sin(2 * np.pi * mod_rate * t + r.uniform(0, 6))
    e = np.minimum(1, np.minimum(t / fade, (t[-1] - t) / fade))
    return s * e


def build_ambience():
    buf = np.zeros((2, N))
    # Babak 1: jam berdetik
    for i in range(10):
        add(buf, tick(), 0.3 + i * 1.0, 0.10 if i % 2 == 0 else 0.07, 0.35)
    # Babak 2: angin pagi + burung + degupan jantung lembut
    add(buf, noise_bed(9.5, 20.5, 200, 1200, 1.5, 0.15, 1), 9.5, 0.06, -0.2)
    for i in range(14):
        add(buf, chirp(), 10.4 + rng.uniform(0, 9), 0.05, rng.uniform(-0.8, 0.8))
    for i in range(5):
        tb = 13.0 + i * 1.05
        add(buf, heartbeat(), tb, 0.35)
        add(buf, heartbeat() * 0.7, tb + 0.28, 0.35)
    # Babak 3: hujan renyai
    rain = noise_bed(19.0, 31.0, 400, 7000, 2.0, 0.07, 2)
    add(buf, rain, 19.0, 0.10, -0.3)
    add(buf, noise_bed(19.0, 31.0, 500, 6000, 2.0, 0.09, 3), 19.0, 0.10, 0.3)
    for i in range(140):
        t = 20.0 + rng.uniform(0, 10)
        d = np.arange(int(0.02 * SR)) / SR
        drop = np.sin(2 * np.pi * rng.uniform(1800, 4200) * d) * np.exp(-d * 260)
        add(buf, drop, t, 0.03, rng.uniform(-0.9, 0.9))
    # Babak 4: denting cawan / pinggan
    add(buf, clink(), 33.2, 0.05, -0.3)
    add(buf, clink() * 0.7, 36.4, 0.035, 0.4)
    # Babak 5: suasana bilik hangat
    add(buf, noise_bed(40, 50, 120, 600, 2, 0.05, 4), 40, 0.03)
    # Babak 6: halaman – burung + angin
    add(buf, noise_bed(49.5, 60.5, 200, 1500, 1.5, 0.2, 5), 49.5, 0.07)
    for i in range(18):
        add(buf, chirp(), 50.3 + rng.uniform(0, 9.2), 0.05, rng.uniform(-0.9, 0.9))
    # Babak 7: kedai kopi – denting cawan
    add(buf, clink() * 0.8, 64.6, 0.045, 0.3)
    add(buf, noise_bed(60, 70, 150, 900, 2, 0.1, 6), 60, 0.025)
    # Babak 8: buku kewangan ditutup + hembusan lega (angin lembut)
    add(buf, book_close(), 73.4, 0.18, -0.1)
    add(buf, noise_bed(74.5, 78.5, 250, 1400, 1.5, 0.2, 7), 74.5, 0.05)
    # Babak 9: subuh – burung jauh sangat halus
    for i in range(6):
        add(buf, chirp(), 81 + rng.uniform(0, 8), 0.02, rng.uniform(-1, 1))
    # Babak 11–12: angin senja
    add(buf, noise_bed(104, 120, 180, 1100, 3, 0.08, 8), 104, 0.06)
    # Peralihan sinematik halus (swell udara, bukan whoosh flashy)
    for k in range(1, 12):
        sw = noise_bed(0, 1.6, 300, 2500, 0.8, 0.0, 10 + k)
        add(buf, sw, k * SCENE - 1.0, 0.025)
    master = env_curve([(0, 0), (0.3, 1), (116, 1), (119.5, 0), (120, 0)])
    buf *= master
    buf = reverb(buf, 1.8, 0.2, seed=9)
    peak = np.max(np.abs(buf))
    return buf / peak * 0.7 if peak > 0.7 else buf


def write(name, buf):
    path = os.path.join(OUT, name)
    wavfile.write(path, SR, (np.clip(buf.T, -1, 1) * 32767).astype(np.int16))
    print("✓", os.path.normpath(path))


if __name__ == "__main__":
    write("muzik.wav", build_music())
    write("ambien.wav", build_ambience())
