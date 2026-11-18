#!/usr/bin/env python3
"""
Muzik latar asli untuk "Umrah Moment" (100% disintesis — bebas hak cipta).
Pad hangat + petikan ala oud (Karplus-Strong) dalam maqam Hijaz (D), tempo perlahan.

Keperluan: pip install numpy scipy
Jalankan:  python3 scripts/generate_audio.py [saat]
"""
import os
import sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 44100
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 79.0
N = int(SR * DUR)
rng = np.random.default_rng(1447)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
os.makedirs(OUT, exist_ok=True)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, f):
    return sosfilt(butter(2, f, "low", fs=SR, output="sos"), x)


def add(buf, sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    s = sig[: N - i]
    buf[0, i : i + len(s)] += s * gain * np.cos((pan + 1) * np.pi / 4)
    buf[1, i : i + len(s)] += s * gain * np.sin((pan + 1) * np.pi / 4)


def pluck(note, length=2.6, bright=0.5):
    """Karplus-Strong — bunyi petikan tali ala oud"""
    f = midi(note)
    p = int(SR / f)
    n = int(length * SR)
    buf = rng.uniform(-1, 1, p)
    buf = lp(buf, 1200 + bright * 3000)
    out = np.zeros(n)
    decay = 0.996
    for i in range(n):
        v = buf[i % p]
        out[i] = v
        buf[i % p] = decay * 0.5 * (v + buf[(i + 1) % p])
    out *= np.exp(-np.arange(n) / SR * 1.1)
    return out / (np.max(np.abs(out)) + 1e-9)


def pad(notes, length):
    t = np.arange(int(length * SR)) / SR
    sig = np.zeros_like(t)
    for n in notes:
        for det in (-0.08, 0.0, 0.07):
            f = midi(n + det)
            ph = rng.uniform(0, 2 * np.pi)
            sig += np.sin(2 * np.pi * f * t + ph) + 0.3 * np.sin(4 * np.pi * f * t + ph)
    sig = lp(sig, 1400)
    a = min(3.0, length / 3)
    env = np.minimum(1, np.minimum(t / a, (length - t) / a))
    return sig * env / (len(notes) * 3)


def reverb(st, seconds=3.5, wet=0.4):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(st)
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-t * 6.9 / seconds)
        ir = lp(ir, 4500)
        ir /= np.sqrt(np.sum(ir ** 2))
        out[ch] = fftconvolve(st[ch], ir)[: st.shape[1]]
    return st * (1 - wet) + out * wet


# Maqam Hijaz pada D: D Eb F# G A Bb C D
D = 50
HIJAZ = [0, 1, 4, 5, 7, 8, 10, 12, 13, 16]
mix = np.zeros((2, N))

# Pad: progresi perlahan, setiap 8 saat
chords = [[D, D + 7, D + 12], [D - 2, D + 5, D + 10], [D + 1, D + 5, D + 13], [D, D + 4, D + 7]]
t = 0.0
k = 0
while t < DUR:
    add(mix, pad(chords[k % 4], 9.0), t, 0.55, 0)
    t += 8.0
    k += 1

# Drone dasar D
tt = np.arange(N) / SR
drone = lp(np.sin(2 * np.pi * midi(D - 12) * tt) + 0.4 * np.sin(2 * np.pi * midi(D - 5) * tt), 300)
mix += drone * 0.12

# Melodi petikan: frasa berulang dengan variasi
phrase_a = [7, 8, 7, 5, 4, 5, 4, 1, 0]
phrase_b = [0, 1, 4, 5, 7, 8, 10, 8, 7]
rhythm = [0.0, 0.5, 1.0, 2.0, 2.5, 3.0, 4.0, 4.5, 5.5]
t = 4.0
r = 0
while t < DUR - 6:
    ph = phrase_a if r % 2 == 0 else phrase_b
    for deg, off in zip(ph, rhythm):
        if t + off < DUR - 6:
            add(mix, pluck(D + 12 + deg, 2.8, 0.4 + 0.2 * rng.random()), t + off, 0.22, rng.uniform(-0.3, 0.3))
    # nota bass pada mula frasa
    add(mix, pluck(D, 3.5, 0.2), t, 0.18, -0.2)
    t += 8.0
    r += 1

# Bunyi loceng lembut (chime) setiap ~6.5 s — menandakan pertukaran babak
for i, ct in enumerate(np.arange(6.5, DUR - 4, 6.5)):
    n = int(3 * SR)
    tc = np.arange(n) / SR
    f = midi(D + 24 + [0, 7, 12][i % 3])
    ch = (np.sin(2 * np.pi * f * tc) + 0.4 * np.sin(2 * np.pi * f * 2.76 * tc)) * np.exp(-tc * 1.6)
    add(mix, ch, ct, 0.05, 0.4 if i % 2 else -0.4)

mix = reverb(mix)
env = np.minimum(1, np.minimum(tt / 3.0, (DUR - tt) / 5.0))
mix *= env
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.8
wavfile.write(os.path.join(OUT, "muzik.wav"), SR, (mix.T * 32767).astype(np.int16))
print("muzik.wav", DUR, "s")
