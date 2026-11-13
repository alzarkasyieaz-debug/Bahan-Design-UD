#!/usr/bin/env python3
"""
Reka bunyi & mixdown akhir — NakSeeHeart "Jaga Komunikasi Bila Jumpa Kawan Lama".

100% muzik/SFX disintesis secara prosedur (tiada sampel berhak cipta).
Input : public/audio/voice_clean.wav   (dari scripts/prepare_media.sh)
        src/data/timeline.json
Output: public/audio/music.wav          (muzik sahaja, belum di-duck — untuk rujukan)
        public/audio/sfx.wav            (SFX sahaja)
        public/audio/mix.wav            (mix akhir: suara + muzik ber-ducking + SFX, -14 LUFS)

Keperluan: numpy, scipy, ffmpeg (untuk normalisasi kenyaringan)
"""
import json, os, subprocess
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve, resample_poly

ROOT = os.path.join(os.path.dirname(__file__), "..")
AUD = os.path.join(ROOT, "public", "audio")
TL = json.load(open(os.path.join(ROOT, "src/data/timeline.json")))
B = TL["beats"]
SR = 48000
DUR = B["end"]
N = int(SR * DUR)
rng = np.random.default_rng(7)


def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def lp(x, f, o=2): return sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, "high", fs=SR, output="sos"), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], "band", fs=SR, output="sos"), x)
def db(x): return 10 ** (x / 20)


def add(buf, sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= buf.shape[1] or i + len(sig) <= 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    s = sig[: buf.shape[1] - i]
    buf[0, i:i + len(s)] += s * np.cos((pan + 1) * np.pi / 4) * gain
    buf[1, i:i + len(s)] += s * np.sin((pan + 1) * np.pi / 4) * gain


def curve(points, n=N):
    t = np.arange(n) / SR
    xs, ys = zip(*points)
    return np.interp(t, xs, ys)


def reverb(st, seconds=3.6, wet=0.4, seed=1):
    r = np.random.default_rng(seed)
    n = int(seconds * SR); t = np.arange(n) / SR
    out = np.zeros_like(st)
    for ch in range(2):
        ir = lp(r.standard_normal(n) * np.exp(-t * 6.9 / seconds), 4800)
        ir[: int(0.015 * SR)] *= np.linspace(0, 1, int(0.015 * SR))
        ir /= np.sqrt(np.sum(ir ** 2))
        out[ch] = fftconvolve(st[ch], ir)[: st.shape[1]]
    return st * (1 - wet) + out * wet


# ------------------------------------------------------------------ instrumen
def piano(note, dur, vel=0.5):
    f = midi(note); L = dur + 2.8
    t = np.arange(int(L * SR)) / SR
    sig = np.zeros_like(t)
    for k in range(1, 11):
        fk = f * k * np.sqrt(1 + 0.0003 * k * k)
        if fk > SR / 2.3: break
        sig += (1 / k ** 1.3) * np.exp(-t * (0.5 + 0.33 * k + f / 1000)) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28))
    rel = np.ones_like(t); off = int(dur * SR)
    if off < len(t): rel[off:] = np.exp(-(t[off:] - dur) * 3.5)
    s = sig * rel * np.minimum(1, t / 0.005) + lp(rng.standard_normal(len(t)), 2200) * np.exp(-t * 70) * 0.04
    return lp(s * vel, 1500 + 4200 * vel)


def pad(note, dur, bright=1800):
    f = midi(note); t = np.arange(int((dur + 2.5) * SR)) / SR
    sig = np.zeros_like(t)
    for det in (-0.07, 0.0, 0.06):
        vib = 1 + 0.0025 * np.sin(2 * np.pi * (4.3 + det * 5) * t + rng.uniform(0, 6))
        ph = 2 * np.pi * np.cumsum(f * 2 ** (det / 12) * vib) / SR
        for k in range(1, 12):
            if f * k > 8000: break
            sig += np.sin(k * ph) / k
    att = 1 - np.exp(-t / 1.1)
    rel = np.where(t > dur, np.exp(-(t - dur) / 1.0), 1.0)
    return lp(sig * att * rel, bright) * 0.05


# D major / B minor — tenang, spiritual. Satu kord = 4 s.
CH = {"Bm": [47, 54, 59, 62, 66], "G": [43, 50, 55, 59, 62], "D": [38, 50, 54, 57, 62],
      "A": [45, 52, 57, 61, 64], "Em": [40, 52, 55, 59, 64], "Gmaj7": [43, 50, 54, 59, 66],
      "Asus": [45, 52, 57, 62, 64], "Dadd9": [38, 50, 54, 57, 64]}
def _prog():
    """Progresi kord mengikut bahagian video (1 kord ~4 s)."""
    cyc_a = ["G", "D", "A", "Bm"]
    cyc_b = ["Bm", "G", "D", "A", "Em", "G", "Asus", "A"]
    prog = [(0.0, "Bm")]
    t, i = B["flashToBody"], 0
    while t < B["climax"][0] - 0.1:
        prog.append((round(t, 2), cyc_a[i % 4])); t += 4.0; i += 1
    t, i = B["climax"][0], 0
    while t < B["cta"] - 0.1:
        prog.append((round(t, 2), cyc_b[i % 8])); t += 3.5; i += 1
    prog += [(B["cta"], "Gmaj7"), (B["cta"] + 2.5, "Dadd9")]
    return prog


PROG = _prog()
CLIMAX0, CTA, FIN0 = B["climax"][0], B["cta"], B["finale"][0]


def build_music():
    buf = np.zeros((2, N))
    for i, (t0, name) in enumerate(PROG):
        t1 = PROG[i + 1][0] if i + 1 < len(PROG) else DUR
        d = t1 - t0
        nt = CH[name]
        # Hook: hanya nota jarang + pad gelap
        if t0 < B["flashToBody"]:
            for j, n in enumerate([nt[2] + 12, nt[4] + 12, nt[3] + 12]):
                add(buf, piano(n, 1.6, 0.26), t0 + 0.6 + j * 1.2, 0.7, -0.3 + 0.3 * j)
            add(buf, piano(nt[0] - 12, 4.0, 0.3), t0, 0.8)
            continue
        add(buf, piano(nt[0] - 12 if nt[0] > 40 else nt[0], d, 0.3), t0, 0.85, -0.15)
        # arpeggio: makin padat ketika mesej utama & klimaks
        dense = 8 if B["recap"] <= t0 < CTA else 6
        if t0 >= CTA: dense = 4
        pat = [1, 2, 3, 4, 3, 2, 3, 4]
        for j in range(dense):
            tj = t0 + j * d / dense
            vel = 0.2 + (0.06 if j == 0 else 0) + (0.06 if CLIMAX0 <= t0 < CTA else 0)
            add(buf, piano(nt[pat[j % 8]] + 12, d / dense * 1.8, vel), tj, 0.7, 0.35 * np.sin(j * 1.3))
    # Melodi ringkas (motif menaik = harapan) pada klimaks & finale
    # Melodi ringkas (motif menaik = harapan) pada klimaks, finale & CTA
    motif = [(0.0, 78, 1.2), (1.25, 76, 0.6), (1.85, 74, 1.8), (3.6, 74, 0.9), (4.5, 76, 0.9), (5.4, 78, 1.8)]
    MEL = [(CLIMAX0 + o + k * 7.0, n, d) for k in range(2) for (o, n, d) in motif]
    MEL += [(FIN0 + 0.05, 78, 1.8), (FIN0 + 2.1, 81, 1.0), (FIN0 + 3.2, 78, 1.6), (FIN0 + 5.0, 76, 1.6),
            (CTA + 0.05, 76, 2.4), (CTA + 2.55, 74, 3.4)]
    for t, n, d in MEL:
        add(buf, piano(n, d, 0.3), t, 0.55, 0.1)

    # Pad/strings: masuk perlahan, crescendo berperingkat ke klimaks
    st = np.zeros((2, N))
    for i, (t0, name) in enumerate(PROG):
        t1 = PROG[i + 1][0] if i + 1 < len(PROG) else DUR
        for j, n in enumerate(CH[name][1:]):
            add(st, pad(n + (12 if j >= 2 else 0), t1 - t0 + 0.2, 1500 if t0 < B["recap"] else 2400), t0 - 0.1, 1.0, -0.6 + 0.4 * j)
    E = DUR
    st *= curve([(0, 0.35), (3.5, 0.45), (3.7, 0.15), (15, 0.25), (B["p1"], 0.35), (40, 0.3),
                 (B["p3"], 0.3), (B["recap"], 0.5), (CLIMAX0, 0.65), (FIN0, 0.95),
                 (CTA, 0.9), (E - 2.5, 0.5), (E, 0)])
    buf += st
    buf *= curve([(0, 0), (0.25, 1), (E - 2.3, 1), (E - 0.1, 0), (E, 0)])
    buf = hp(reverb(buf, 3.8, 0.42, seed=3), 40)
    return buf / (np.max(np.abs(buf)) + 1e-9) * 0.8


# ------------------------------------------------------------------ SFX
def whoosh(d=0.7, rise=True):
    n = int(d * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    sweep = np.linspace(400, 3500, n) if rise else np.linspace(3500, 400, n)
    out = np.zeros(n)
    for k in range(0, n, 2400):  # sapuan penapis berperingkat
        seg = noise[k:k + 2400]
        out[k:k + len(seg)] = bp(seg, max(120, sweep[k] * 0.5), min(SR / 2.2, sweep[k] * 1.6))
    return lp(out * env, 6000) * 0.5


def impact(d=1.6, f=48):
    t = np.arange(int(d * SR)) / SR
    boom = np.sin(2 * np.pi * f * t * (1 + 0.6 * np.exp(-t * 8))) * np.exp(-t * 3.2)
    thud = lp(rng.standard_normal(len(t)), 600) * np.exp(-t * 18) * 0.5
    return (boom + thud) * 0.6


def shimmer(d=2.2):
    t = np.arange(int(d * SR)) / SR
    s = np.zeros_like(t)
    for k, n in enumerate([86, 90, 93, 98, 102]):
        tt = np.clip(t - k * 0.07, 0, None)
        s += np.sin(2 * np.pi * midi(n) * tt) * np.exp(-tt * 2.2) * (t >= k * 0.07) * 0.18
    return s


def pop():
    t = np.arange(int(0.25 * SR)) / SR
    return (np.sin(2 * np.pi * 220 * t * (1 + 2 * np.exp(-t * 40))) * np.exp(-t * 22)) * 0.35


def build_sfx():
    fx = np.zeros((2, N))
    add(fx, impact(2.0, 44), 0.02, 0.5)
    add(fx, shimmer(), 0.1, 0.25, 0.3)
    add(fx, whoosh(0.6), B["flashToBody"] - 0.45, 0.55, -0.3)
    add(fx, impact(1.4, 52), B["flashToBody"], 0.35)
    for k in ("tigaKeadaan", "kawanLama"):
        add(fx, pop(), B[k], 0.28)
    add(fx, whoosh(0.5, False), B["mood"][0] + 0.8, 0.22)
    for k in ("p1", "p2", "p3"):
        add(fx, whoosh(0.5), B[k] - 0.35, 0.28)
        add(fx, impact(1.2, 56), B[k] - 0.02, 0.25)
    add(fx, shimmer(1.6), B["salam"], 0.22, -0.2)
    for k, p in (("pekik", 0.3), ("namaPanggilan", 0.3)):
        add(fx, pop(), B[k], 0.3, p)
    for k, p in (("suasana", -0.3), ("tempat", 0.0), ("keadaan", 0.3)):
        add(fx, pop(), B[k], 0.3, p)
    add(fx, pop(), B["contohGurau"], 0.25)
    add(fx, pop(), B["niat"], 0.25, -0.3)
    add(fx, impact(1.4, 44), B["diaibkan"] - 0.02, 0.28)
    add(fx, pop(), B["dimalukan"], 0.25, 0.3)
    for j in range(3):
        add(fx, pop(), B["recap"] + 0.35 + j * 0.55, 0.25, -0.3 + 0.3 * j)
    add(fx, whoosh(0.9), B["brollSosial"][0] - 0.5, 0.35, 0.3)
    add(fx, whoosh(0.8), B["brollKawan"][0] - 0.4, 0.3, -0.3)
    add(fx, whoosh(0.9, False), B["climax"][0] - 0.3, 0.3, -0.3)
    add(fx, shimmer(2.2), B["jagaKomunikasi"] - 0.05, 0.3, -0.2)
    add(fx, whoosh(0.7), B["finale"][0] - 0.35, 0.3, 0.2)
    add(fx, impact(1.4, 52), B["ukhuwah"] - 0.02, 0.25)
    add(fx, shimmer(2.6), B["ukhuwah"] + 0.05, 0.3, 0.2)
    add(fx, whoosh(0.8), B["cta"] - 0.5, 0.45)
    add(fx, shimmer(3.0), B["cta"] + 0.1, 0.32, -0.1)
    add(fx, pop(), B["cta"] + 1.25, 0.3)
    add(fx, pop(), B["cta"] + 2.6, 0.25)
    return reverb(fx, 2.2, 0.3, seed=9)


# ------------------------------------------------------------------ suara mengikut garis masa
def build_voice():
    sr, v = wavfile.read(os.path.join(AUD, "voice_clean.wav"))
    v = v.astype(np.float64) / 32768.0
    if v.ndim > 1: v = v.mean(axis=1)
    if sr != SR: v = resample_poly(v, SR, sr)
    out = np.zeros(N)
    # Setiap klip EDL disambung dengan crossfade 30 ms (potongan jatuh pada jeda sebenar)
    f = int(0.03 * SR)
    for seg in TL["segments"]:
        if seg["id"] == "cta":
            continue
        a, b = seg["src"], seg["srcEnd"]
        piece = v[int(a * SR): int(b * SR)].copy()
        piece[:f] *= np.linspace(0, 1, f); piece[-f:] *= np.linspace(1, 0, f)
        i = int(seg["out"][0] * SR)
        out[i:i + len(piece)] += piece[: N - i]
    return out


def envelope(x, att=0.04, rel=0.45):
    e = np.abs(x); out = np.zeros_like(e)
    a, r = np.exp(-1 / (att * SR)), np.exp(-1 / (rel * SR))
    # pengesan puncak ringkas pada kadar dikurangkan (laju)
    step = 48
    ed = e[: len(e) // step * step].reshape(-1, step).max(axis=1)
    a, r = np.exp(-1 / (att * SR / step)), np.exp(-1 / (rel * SR / step))
    o = np.zeros_like(ed); y = 0.0
    for i, s in enumerate(ed):
        y = a * y + (1 - a) * s if s > y else r * y + (1 - r) * s
        o[i] = y
    out[: len(o) * step] = np.repeat(o, step)
    return out


def main():
    music = build_music(); sfx = build_sfx(); voice = build_voice()
    wavfile.write(os.path.join(AUD, "music.wav"), SR, (music.T * 32767).astype(np.int16))
    wavfile.write(os.path.join(AUD, "sfx.wav"), SR, (np.clip(sfx.T, -1, 1) * 32767).astype(np.int16))

    # Ducking automatik: muzik turun ~-16 dB ketika penceramah bercakap
    env = envelope(voice)
    thr = 0.02
    duck_db = -16.0 * np.clip((env - thr * 0.5) / thr, 0, 1)
    gain = db(duck_db)
    music_level = db(-8)
    mix = np.zeros((2, N))
    mix += music * gain * music_level
    mix += sfx * db(-7)
    mix += np.vstack([voice, voice]) * db(2)
    peak = np.max(np.abs(mix))
    mix = mix / peak * 0.89
    tmp = os.path.join(AUD, "_mix_raw.wav")
    wavfile.write(tmp, SR, (mix.T * 32767).astype(np.int16))
    # Normalisasi kenyaringan untuk media sosial: -14 LUFS, true-peak -1.5 dBTP
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af",
                    "loudnorm=I=-14:TP=-1.5:LRA=9", "-ar", str(SR), os.path.join(AUD, "mix.wav")], check=True)
    os.remove(tmp)
    print("✔ public/audio/mix.wav", f"({DUR:.1f} s)")


if __name__ == "__main__":
    main()
