"""Jana muzik instrumental ceria & bertenaga (program belia/sukan) — disintesis, bebas hak cipta.

Output: public/audio/muzik.wav (stereo, 48 kHz, 62 s, 120 BPM, D major)
Struktur: intro (0-5s) -> ringan (5-12s) -> groove penuh (12-45s) -> klimaks (45-58s) -> kord akhir.
"""
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt
import os, sys

SR = 48000
BPM = 120
BEAT = 60 / BPM
DUR = 62.0
N = int(SR * DUR)
rng = np.random.default_rng(7)

L = np.zeros(N); R = np.zeros(N)


def add(sig, t0, pan=0.0, gain=1.0):
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def env(n, a=0.005, d=0.2, s=0.0, r=0.05, hold=None):
    t = np.arange(n) / SR
    e = np.where(t < a, t / a, s + (1 - s) * np.exp(-(t - a) / d))
    if hold is not None:
        rel = t > hold
        e[rel] *= np.exp(-(t[rel] - hold) / r)
    return e


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def pluck(m, dur=0.5, bright=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m)
    s = sum((0.6 ** k) * np.sin(2 * np.pi * f * (k + 1) * t) * np.exp(-t * (3 + 4 * k / bright)) for k in range(6))
    return s * env(n, 0.002, 0.35)


def pad(ms, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for m in ms:
        for det in (-0.08, 0.0, 0.08):
            f = hz(m + det)
            s += np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)
    a = np.minimum(1, t / 0.25) * np.minimum(1, (dur - t) / 0.3)
    return s * a / (len(ms) * 3)


def bass(m, dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sign(np.sin(2 * np.pi * f * t))
    return s * env(n, 0.004, 0.25, 0.55, 0.03, hold=dur - 0.03)


def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 50 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def noise_hit(dur, lo, hi, dec):
    n = int(dur * SR); t = np.arange(n) / SR
    sos = butter(2, [lo, hi], btype="band", fs=SR, output="sos")
    return sosfilt(sos, rng.standard_normal(n)) * np.exp(-t * dec)


def clap():
    s = np.zeros(int(0.25 * SR))
    for k, o in enumerate((0, 0.011, 0.022)):
        h = noise_hit(0.2, 900, 5000, 30 if k < 2 else 14)
        i = int(o * SR); s[i:i + len(h)] += h[: len(s) - i]
    return s * 1.4


def hat(open_=False):
    return noise_hit(0.2 if open_ else 0.06, 6000, 15000, 18 if open_ else 70) * 0.9


def shaker():
    return noise_hit(0.08, 4000, 11000, 45) * 0.45


# Progression (D major): D  A  Bm  G  — satu kord setiap bar (4 ketukan = 2 s)
PROG = [(50, [62, 66, 69]), (45, [61, 64, 69]), (47, [62, 66, 71]), (43, [62, 67, 71])]
BAR = 4 * BEAT
MEL = [  # corak arpeggio/melodi 8 not per bar (offset dari kord)
    [74, 69, 66, 69, 74, 76, 74, 69],
    [73, 69, 64, 69, 73, 76, 73, 69],
    [74, 71, 66, 71, 74, 78, 76, 71],
    [74, 71, 67, 71, 74, 79, 78, 76],
]

nbars = int(DUR / BAR)
for b in range(nbars):
    t0 = b * BAR
    root, chord = PROG[b % 4]
    sec = "intro" if t0 < 5 else "light" if t0 < 12 else "full" if t0 < 45 else "lift" if t0 < 58 else "end"
    if sec == "end":
        break
    # pad
    add(pad(chord, BAR + 0.2), t0, 0, 0.16 if sec != "intro" else 0.12)
    # arpeggio pluck (gitar)
    for k, m in enumerate(MEL[b % 4]):
        if sec == "intro" and k % 2:
            continue
        add(pluck(m, 0.45, 1.5 if sec == "lift" else 1.0), t0 + k * BEAT / 2, -0.35 if k % 2 else 0.35, 0.16)
    if sec in ("full", "lift"):  # lapisan melodi oktaf atas pada klimaks
        if sec == "lift":
            for k, m in enumerate(MEL[b % 4][::2]):
                add(pluck(m + 12, 0.6, 2.0), t0 + k * BEAT + BEAT / 4, 0.1, 0.09)
    # bass
    if sec != "intro":
        for k in range(4):
            m = root if k != 3 else root + 7
            add(bass(m, BEAT * 0.9), t0 + k * BEAT, 0, 0.30)
    # drums
    for k in range(4):
        tb = t0 + k * BEAT
        if sec in ("full", "lift") or (sec == "light" and k % 2 == 0):
            add(kick(), tb, 0, 0.75)
        if sec in ("full", "lift") and k in (1, 3):
            add(clap(), tb, 0.05, 0.30)
        if sec != "intro":
            add(hat(), tb + BEAT / 2, 0.3, 0.22)
            for q in range(4):
                add(shaker(), tb + q * BEAT / 4, -0.4, 0.5 if q % 2 else 0.25)
        if sec == "lift" and k == 3 and b % 2 == 1:
            add(hat(True), tb + BEAT / 2, 0.3, 0.25)

# Riser sebelum 12 s dan 45 s
for tr in (12.0, 45.0):
    d = 2.0; n = int(d * SR); t = np.arange(n) / SR
    s = rng.standard_normal(n)
    sos = butter(2, 3000, btype="high", fs=SR, output="sos")
    add(sosfilt(sos, s) * (t / d) ** 2 * 0.18, tr - d, 0)
    add(kick(), tr, 0, 0.8)  # impak
    add(noise_hit(1.2, 2000, 12000, 3), tr, 0, 0.2)

# Kord akhir 58 s (sustain)
tE = 58.0
add(pad([62, 66, 69, 74], 4.0), tE, 0, 0.28)
for k, m in enumerate([50, 62, 66, 69, 74, 78]):
    add(pluck(m, 3.5, 0.8), tE + k * 0.03, (k - 2.5) / 4, 0.18)
add(bass(38, 3.0), tE, 0, 0.3)
add(kick(), tE, 0, 0.8)

mix = np.stack([L, R], 1)
# fade in/out
fi = int(0.4 * SR); mix[:fi] *= np.linspace(0, 1, fi)[:, None]
fo = int(2.5 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
# soft clip + normalise
mix = np.tanh(mix * 1.3)
mix /= np.max(np.abs(mix)) / 0.89
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "public", "audio", "muzik.wav")
os.makedirs(os.path.dirname(out), exist_ok=True)
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print("ditulis", out)
