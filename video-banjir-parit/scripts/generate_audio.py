#!/usr/bin/env python3
"""
Penjana muzik & reka bunyi asli (100% disintesis — tiada sampel berhak cipta).
Membaca src/data/timeline.json supaya setiap bunyi selari dengan visual.

Output (public/audio/):
  muzik-90.wav, muzik-30.wav    piano sinematik + strings hangat + perkusi lembut
  ambien-90.wav, ambien-30.wav  hujan, whoosh teks, impak, ding kaunter RM, shimmer QR, riser CTA

Keperluan: python3, numpy, scipy.   Jalankan: python3 scripts/generate_audio.py
"""
import json
import os
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 44100
ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "audio")
TL = json.load(open(os.path.join(ROOT, "src", "data", "timeline.json")))
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def add(buf, sig, t, gain=1.0, pan=0.0):
    n = buf.shape[1]
    i = int(t * SR)
    if i >= n or i + len(sig) <= 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    s = sig[: n - i]
    buf[0, i:i + len(s)] += s * np.cos((pan + 1) * np.pi / 4) * gain
    buf[1, i:i + len(s)] += s * np.sin((pan + 1) * np.pi / 4) * gain


def curve(n, pts):
    t = np.arange(n) / SR
    xs, ys = zip(*pts)
    return np.interp(t, xs, ys)


def reverb(st, seconds=3.0, wet=0.35, seed=1):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(st)
    for ch in range(2):
        ir = lp(r.standard_normal(n) * np.exp(-t * 6.9 / seconds), 5000)
        ir[: int(0.015 * SR)] *= np.linspace(0, 1, int(0.015 * SR))
        ir /= np.sqrt(np.sum(ir ** 2))
        out[ch] = fftconvolve(st[ch], ir)[: st.shape[1]]
    return st * (1 - wet) + out * wet


# ------------------------------------------------------------------ INSTRUMEN
def piano(note, dur, vel=0.5):
    f = midi(note)
    t = np.arange(int((dur + 2.8) * SR)) / SR
    sig = np.zeros_like(t)
    for k in range(1, 11):
        fk = f * k * np.sqrt(1 + 0.0004 * k * k)
        if fk > SR / 2.3:
            break
        sig += (1 / k ** 1.3) * np.exp(-t * (0.5 + 0.32 * k + f / 1000)) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28))
    rel = np.where(t > dur, np.exp(-(t - dur) * 3.2), 1.0)
    hammer = lp(rng.standard_normal(len(t)), 2400) * np.exp(-t * 70) * 0.05
    return lp((sig * rel * np.minimum(1, t / 0.004) + hammer) * vel, 1600 + 5000 * vel)


def strings(note, dur):
    f = midi(note)
    t = np.arange(int((dur + 2.2) * SR)) / SR
    sig = np.zeros_like(t)
    for det in (-0.08, 0.0, 0.07):
        vib = 1 + 0.003 * np.sin(2 * np.pi * (4.8 + det * 5) * t + rng.uniform(0, 6))
        ph = 2 * np.pi * np.cumsum(f * 2 ** (det / 12) * vib) / SR
        for k in range(1, 12):
            if f * k > 8000:
                break
            sig += np.sin(k * ph) / k
    att = 1 - np.exp(-t / 1.0)
    rel = np.where(t > dur, np.exp(-(t - dur) / 0.9), 1.0)
    return lp(sig * att * rel, 2200) * 0.05


def drum(kind="tom"):
    t = np.arange(int(1.2 * SR)) / SR
    if kind == "tom":
        f = 70 * np.exp(-t * 3) + 48
        body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5)
        return lp(body + lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 40) * 0.25, 1200)
    f = 55 * np.exp(-t * 8) + 40
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)


CH = {
    "Dm": [38, 50, 53, 57, 62], "Bb": [34, 46, 50, 53, 58], "F": [41, 48, 53, 57, 60],
    "C": [36, 48, 52, 55, 60], "Gm": [43, 50, 55, 58, 62], "Fadd9": [41, 48, 53, 55, 60],
}


def build_music(dur, chords, sections, lifts, melody_from):
    """chords: [(t, nama, tempoh)], sections: [(t_mula, t_akhir, gaya)], lifts: masa kemuncak."""
    n = int(dur * SR)
    buf = np.zeros((2, n))
    pad = np.zeros((2, n))
    perc = np.zeros((2, n))

    def style_at(t):
        for a, b, s in sections:
            if a <= t < b:
                return s
        return "sparse"

    beat = 1.0  # 60 bpm
    for (t0, name, d) in chords:
        notes = CH[name]
        st = style_at(t0)
        # bass lembut
        add(buf, piano(notes[0] + 12 if notes[0] < 36 else notes[0], d * 0.95, 0.26), t0, 0.9, -0.15)
        if st == "sparse":
            for j, nn in enumerate([notes[2], notes[3], notes[4]]):
                add(buf, piano(nn + 12, 1.8, 0.24), t0 + 0.3 + j * 1.2, 0.75, 0.3 * (j - 1))
        else:
            steps = int(d / (beat / 2))
            pattern = [1, 2, 3, 4, 3, 2, 3, 4]
            v0 = {"warm": 0.2, "rise": 0.24, "hope": 0.26, "resolve": 0.22}[st]
            for j in range(steps):
                nn = notes[pattern[j % len(pattern)]] + 12
                add(buf, piano(nn, 0.9, v0 + (0.05 if j % 4 == 0 else 0)), t0 + j * beat / 2, 0.7, 0.35 * np.sin(j * 1.3))
        # melodi ringkas (nada atas kord) dari titik tertentu
        if t0 >= melody_from and st != "sparse":
            top = notes[4] + 12
            add(buf, piano(top, 1.8, 0.3), t0, 0.55, 0.12)
            add(buf, piano(top - (2 if name in ("Dm", "Gm", "C") else 1), 1.6, 0.26), t0 + 2.0, 0.5, 0.12)
        # strings (bermula selepas pembukaan)
        if st != "sparse":
            for j, nn in enumerate(notes[1:]):
                add(pad, strings(nn + (12 if j >= 2 else 0), d + 0.2), t0 - 0.1, 1.0, -0.6 + j * 0.4)
        # perkusi lembut
        if st in ("rise", "hope"):
            for b in range(int(d)):
                if b % 2 == 0:
                    add(perc, drum("tom"), t0 + b, 0.55 if b == 0 else 0.35)
                else:
                    add(perc, drum("kick"), t0 + b, 0.25)
    # Pembukaan: nota rendah panjang (atmosfera sinematik)
    add(pad, strings(38, 9.0) * 1.4, 0.0, 1.0, 0.0)
    add(pad, strings(45, 9.0) * 1.0, 0.0, 1.0, 0.3)

    lvl = [(0, 0.5), (10, 0.5)]
    for a, b, s in sections:
        lvl += [(a + 0.01, {"sparse": 0.5, "warm": 0.7, "rise": 0.9, "hope": 1.05, "resolve": 0.85}[s])]
    lvl = sorted(lvl)
    pad *= curve(n, lvl)
    for L in lifts:  # swell sebelum kemuncak
        sw = curve(n, [(0, 1), (max(0, L - 2.5), 1), (L, 1.5), (L + 2, 1)])
        pad *= sw
    buf += pad + perc * 0.6
    buf *= curve(n, [(0, 0), (0.25, 1), (dur - 2.5, 1), (dur, 0)])
    buf = hp(reverb(buf, 3.2, 0.36, 3), 35)
    return buf / (np.max(np.abs(buf)) + 1e-9) * 0.85


# ------------------------------------------------------------------ SFX
def noise(d, lo, hi, seed):
    r = np.random.default_rng(seed)
    return bp(r.standard_normal(int(d * SR)), lo, hi)


def whoosh(d=0.9):
    t = np.arange(int(d * SR)) / SR
    env = np.sin(np.pi * t / d) ** 2
    return bp(rng.standard_normal(len(t)), 400, 3800) * env


def impact():
    t = np.arange(int(2.5 * SR)) / SR
    boom = np.sin(2 * np.pi * np.cumsum(60 * np.exp(-t * 2) + 32) / SR) * np.exp(-t * 2.2)
    return lp(boom + lp(rng.standard_normal(len(t)), 300) * np.exp(-t * 6) * 0.4, 400)


def chime(note=84):
    t = np.arange(int(1.6 * SR)) / SR
    f = midi(note)
    s = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * dd) for k, a, dd in [(1, 1, 3), (2.76, 0.4, 6), (5.4, 0.2, 10)])
    return s * np.minimum(1, t / 0.002)


def shimmer(d=1.6):
    out = np.zeros(int(d * SR))
    for i in range(16):
        c = chime(90 + rng.integers(-5, 8))[: int(0.9 * SR)]
        st = int(rng.uniform(0, d - 0.9) * SR)
        out[st:st + len(c)] += c * 0.25
    return out


def riser(d=2.0):
    t = np.arange(int(d * SR)) / SR
    return bp(rng.standard_normal(len(t)), 600, 6000) * (t / d) ** 2.5


def build_ambience(v):
    dur = v["duration"]
    n = int(dur * SR)
    buf = np.zeros((2, n))
    shots = v["shots"]
    rain_end = min(dur, shots[2]["at"] + 15) if len(shots) > 2 else 8
    for ch, seed in ((-0.4, 1), (0.4, 2)):
        r = noise(dur, 500, 7500, seed) * 0.11
        r *= curve(n, [(0, 1), (rain_end - 3, 1), (rain_end, 0.12), (dur, 0.12)])
        add(buf, r, 0, 1.0, ch)
    for i in range(int(rain_end * 25)):  # titisan
        d = np.arange(int(0.02 * SR)) / SR
        add(buf, np.sin(2 * np.pi * rng.uniform(1800, 4500) * d) * np.exp(-d * 280), rng.uniform(0, rain_end), 0.025, rng.uniform(-1, 1))
    climaxes = [t for t in v["texts"] if t["kind"] == "climax"]
    if climaxes:
        c = climaxes[0]
        r = noise(c["end"] - c["at"] + 2, 500, 7000, 9) * 0.09
        r *= curve(len(r), [(0, 0), (1, 1), (len(r) / SR - 1, 1), (len(r) / SR, 0)])
        add(buf, r, c["at"] - 1, 1.0)
    for t in v["texts"]:
        add(buf, whoosh(), t["at"] - 0.45, 0.05 if t["kind"] != "keyword" else 0.04)
        if t["kind"] in ("climax", "hero") or (t["kind"] == "support" and t.get("gold")):
            add(buf, impact(), t["at"], 0.3 if t["kind"] == "climax" else 0.2)
    m = v["money"]
    for i, _ in enumerate(m["amounts"]):
        add(buf, chime(81 + i * 4), m["at"] + i * m["gap"], 0.09, -0.3 + i * 0.3)
        add(buf, chime(88 + i * 4), m["at"] + i * m["gap"] + 0.08, 0.04, 0.3)
    lt = v["lowerThird"]
    add(buf, whoosh(0.7), lt["at"] - 0.2, 0.04, -0.6)
    for s in shots[1:]:
        add(buf, whoosh(1.1) * 0.5, s["at"] - 0.55, 0.018)
    cta = v["cta"]
    add(buf, riser(2.0), cta["at"] - 2.0, 0.06)
    add(buf, impact(), cta["at"], 0.28)
    add(buf, shimmer(), cta["at"] + 1.2, 0.18)
    add(buf, chime(86), cta["at"] + 0.55, 0.06)
    if v.get("endCard"):
        add(buf, impact(), v["endCard"]["at"], 0.18)
        add(buf, shimmer(2.2), v["endCard"]["at"] + 0.2, 0.1)
    buf *= curve(n, [(0, 0), (0.15, 1), (dur - 1.5, 1), (dur, 0)])
    buf = reverb(buf, 1.6, 0.22, 9)
    pk = np.max(np.abs(buf))
    return buf / pk * 0.7 if pk > 0.7 else buf


def write(name, buf):
    wavfile.write(os.path.join(OUT, name), SR, (np.clip(buf.T, -1, 1) * 32767).astype(np.int16))
    print("✓ public/audio/" + name)


if __name__ == "__main__":
    # ---- 90 s: melankolik → belas kasihan → kebangkitan emosi → harapan → resolusi hangat
    P = ["Dm", "Bb", "F", "C"]
    c90 = []
    t = 0.0
    seq = P * 2 + ["Dm", "Bb", "Gm", "C"] * 2 + ["Bb", "C", "Dm", "Bb"] + ["F", "C", "Dm", "Bb"] * 1 + ["F", "C", "Bb", "C", "Fadd9"]
    for nm in seq:
        d = 4.0 if t < 86 else 90 - t
        c90.append((t, nm, d if nm != "Fadd9" else 90 - t))
        t += 4.0
        if t >= 90:
            break
    secs90 = [(0, 25, "sparse"), (25, 44, "warm"), (44, 58, "rise"), (58, 77, "hope"), (77, 90, "resolve")]
    write("muzik-90.wav", build_music(90, c90, secs90, [44.2, 51.0, 77.4], 25))
    # ---- 30 s: ringkas
    c30, t = [], 0.0
    for nm in ["Dm", "Bb", "F", "C", "Bb", "C", "F", "C", "Fadd9"]:
        c30.append((t, nm, 3.6 if nm != "Fadd9" else 30 - t))
        t += 3.6
    secs30 = [(0, 7.2, "sparse"), (7.2, 14.4, "rise"), (14.4, 21.6, "hope"), (21.6, 30, "resolve")]
    write("muzik-30.wav", build_music(30, c30, secs30, [11.0, 14.9, 21.2], 7.2))
    write("ambien-90.wav", build_ambience(TL["v90"]))
    write("ambien-30.wav", build_ambience(TL["v30"]))
