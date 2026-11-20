#!/usr/bin/env python3
"""
Penjana muzik latar ASLI (disintesis secara prosedur - tiada sampel berhak cipta,
selamat untuk TikTok / Facebook / Instagram) + audio mixing akhir.

  public/audio/muzik.wav   - Emotional Cinematic Piano + Soft Strings, 120 s
  public/audio/mix.wav     - Mix akhir: ucapan sebenar YB + muzik (auto-ducking) + ambien PPS + sound design

Struktur emosi:
  00-06.5  piano jarang, sayu (A minor)           | hook
  06.5-97  piano arpeggio lembut + strings empati  | ucapan YB (muzik direndahkan)
  97-107   strings berkembang, progresi harapan    | montaj kemanusiaan + doa
  107-120  uplifting tetapi masih emosional (C)    | penutup "Parit Sejahtera Makmur Bersama"

Keperluan: numpy scipy ; jalankan selepas scripts/prep_clips.py
"""
import json, os, subprocess, sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 48000
rng = np.random.default_rng(2026)
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
AUD = os.path.join(ROOT, "public", "audio")
EDL = json.load(open(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "src", "data", "edl.json")))
G = EDL["graphics"]
HOOK = EDL.get("hookAudio")
DUR = float(EDL.get("duration", 120))
N = int(SR * DUR)
SH = DUR - 120.0  # anjakan bagi bahagian penutup (diikat pada hujung video)
# Segmen ucapan: (masa dalam Video Master in/out, kedudukan output 'at')
SEGS = EDL.get("segments") or [{"in": EDL["speechIn"], "out": EDL["speechOut"], "at": EDL["speechIn"] + EDL["speechOffset"]}]


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, f, o=2):
    return sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)


def hp(x, f, o=2):
    return sosfilt(butter(o, f, "high", fs=SR, output="sos"), x)


def add(buf, sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i < 0:
        sig, i = sig[-i:], 0
    if i >= N:
        return
    s = sig[: N - i]
    buf[0, i:i + len(s)] += s * np.cos((pan + 1) * np.pi / 4) * gain
    buf[1, i:i + len(s)] += s * np.sin((pan + 1) * np.pi / 4) * gain


def env_curve(pts):
    t = np.arange(N) / SR
    xs, ys = zip(*pts)
    return np.interp(t, xs, ys)


def reverb(st, seconds=3.6, wet=0.4, seed=1):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(st)
    for ch in range(2):
        ir = lp(r.standard_normal(n), 5000) * np.exp(-t * 6.9 / seconds)
        ir[: int(0.015 * SR)] *= np.linspace(0, 1, int(0.015 * SR))
        ir /= np.sqrt(np.sum(ir ** 2))
        out[ch] = fftconvolve(st[ch], ir)[: st.shape[1]]
    return st * (1 - wet) + out * wet


def piano(note, dur, vel=0.5):
    f = midi(note)
    t = np.arange(int((dur + 2.8) * SR)) / SR
    sig = np.zeros_like(t)
    for k in range(1, 11):
        fk = f * k * np.sqrt(1 + 0.0004 * k * k)
        if fk > SR / 2.4:
            break
        sig += (1 / k ** 1.3) * np.exp(-t * (0.5 + 0.33 * k + f / 1000)) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28))
    off = int(dur * SR)
    rel = np.ones_like(t)
    if off < len(t):
        rel[off:] = np.exp(-(t[off:] - dur) * 3.5)
    hammer = lp(rng.standard_normal(len(t)), 2200) * np.exp(-t * 70) * 0.04
    s = (sig * rel * np.minimum(1, t / 0.004) + hammer) * vel
    return lp(s, 1500 + 4200 * vel)


def strings_note(note, dur, bright=2200):
    f = midi(note)
    t = np.arange(int((dur + 2.2) * SR)) / SR
    sig = np.zeros_like(t)
    for det in (-0.08, 0.0, 0.07):
        vib = 1 + 0.0025 * np.sin(2 * np.pi * (4.8 + det * 5) * t + rng.uniform(0, 6))
        ph = 2 * np.pi * np.cumsum(f * 2 ** (det / 12) * vib) / SR
        for k in range(1, 14):
            if f * k > 8500:
                break
            sig += np.sin(k * ph) / k
    att = 1 - np.exp(-t / 1.1)
    rel = np.where(t > dur, np.exp(-(t - dur) / 0.9), 1.0)
    return lp(sig * att * rel, bright) * 0.05


CH = {  # nota kord (bass, kemudian nada kord)
    "Am": [45, 57, 60, 64, 69], "F": [41, 57, 60, 65, 69], "C": [48, 55, 60, 64, 67],
    "G": [43, 55, 59, 62, 67], "Em": [40, 55, 59, 64, 67], "Fmaj7": [41, 57, 60, 64, 69],
    "Csus": [48, 55, 60, 65, 67],
}
# satu kord setiap 4 s -> 30 kord
SEG = 4.0
_TAIL = ["Am", "Fmaj7", "F", "G", "C", "F", "G", "Csus"]  # progresi harapan -> penutup
_N = int(np.ceil(DUR / SEG))
PROG = ["Am", "F"] + (["Am", "F", "C", "G"] * 20)[: _N - 2 - len(_TAIL)] + _TAIL


def build_music():
    buf = np.zeros((2, N))
    for ci, name in enumerate(PROG):
        t0 = ci * SEG
        nt = CH[name]
        if t0 < 6.5:  # hook: nota panjang jarang, sayu
            add(buf, piano(nt[0] - 12, 3.8, 0.30), t0, 0.9, -0.2)
            for j, n in enumerate(nt[2:]):
                add(buf, piano(n + 12, 2.6, 0.24), t0 + 0.5 + j * 1.0, 0.7, 0.3 * (j - 1))
            continue
        add(buf, piano(nt[0] - 12 if nt[0] > 42 else nt[0], 3.9, 0.30), t0, 0.9, -0.2)
        # arpeggio not ke-8 (66 bpm) - lembut, tidak bersaing dengan ucapan
        n_steps = 8 if t0 < 96 + SH else 10
        pat = [1, 2, 3, 4, 3, 2, 3, 4, 2, 3]
        for j in range(n_steps):
            n = nt[pat[j % len(pat)]]
            vel = 0.19 + (0.06 if j == 0 else 0) + (0.05 if t0 >= 96 + SH else 0)
            add(buf, piano(n + 12, 0.8, vel), t0 + j * SEG / n_steps, 0.7, 0.35 * np.sin(j * 1.3))
    # melodi pembuka (sayu) dan penutup (harapan)
    for (t, n, d) in [(0.6, 76, 1.4), (2.2, 74, 0.7), (3.0, 72, 2.2), (4.6, 71, 0.8), (5.4, 69, 2.6)]:
        add(buf, piano(n, d, 0.30), t, 0.65, 0.15)
    for (t, n, d) in [(104.2, 76, 1.2), (105.5, 79, 0.6), (106.2, 81, 1.6), (108.0, 79, 1.4), (109.6, 76, 0.6),
                      (110.3, 77, 1.6), (112.0, 79, 1.2), (113.4, 81, 0.6), (114.1, 83, 1.4), (116.0, 84, 4.0)]:
        add(buf, piano(n, d, 0.32), t + SH, 0.65, 0.12)
    # nada penutup piano
    for j, n in enumerate([48, 60, 64, 67, 72, 76]):
        add(buf, piano(n, 4.5, 0.30 - j * 0.02), 116.0 + SH + j * 0.16, 0.75, -0.3 + j * 0.12)

    st = np.zeros((2, N))
    for ci, name in enumerate(PROG):
        t0 = ci * SEG
        for j, n in enumerate(CH[name][1:]):
            add(st, strings_note(n + (12 if j >= 2 else 0), SEG + 0.2, 2000 if t0 < 96 + SH else 2800), t0 - 0.1, 1.0, -0.6 + j * 0.4)
        add(st, strings_note(CH[name][0], SEG + 0.2, 900), t0 - 0.1, 0.8, 0.0)  # cello
    st *= env_curve([(0, 0.25), (6, 0.45), (10, 0.55)] + [(x + SH, y) for x, y in
                     [(90, 0.7), (97, 0.9), (104, 1.25), (110, 1.4), (116, 1.2), (119.8, 0.0), (120, 0)]])
    buf += st
    buf *= env_curve([(0, 0), (1.0, 1), (DUR - 3, 1), (DUR - 0.1, 0), (DUR, 0)])
    buf = hp(reverb(buf, 3.8, 0.42, seed=7), 35)
    return buf / (np.max(np.abs(buf)) + 1e-9) * 0.9


def chime():
    t = np.arange(int(3.5 * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in
            [(1046.5, 1, 1.6), (1568, 0.5, 2.2), (2093, 0.35, 3.0), (3136, 0.15, 4.5)])
    return s * np.minimum(1, t / 0.002) * 0.25


def swell(d=2.5):
    t = np.arange(int(d * SR)) / SR
    s = lp(rng.standard_normal(len(t)), 1800) * (t / d) ** 2.2 * np.exp(-np.maximum(0, t - d + 0.15) * 30)
    return s * 0.35


def load(p):
    sr, a = wavfile.read(p)
    a = a.astype(np.float32) / (32768 if a.dtype == np.int16 else 1)
    if a.ndim == 1:
        a = np.stack([a, a], 1)
    assert sr == SR, (p, sr)
    return a.T


def mix():
    music = build_music()
    mname = "muzik.wav" if DUR == 120 else f"muzik-{EDL['output']}.wav"
    wavfile.write(os.path.join(AUD, mname), SR, (music.T * 32767).astype(np.int16))
    sp_start = SEGS[0]["at"]
    sp_end = SEGS[-1]["at"] + SEGS[-1]["out"] - SEGS[-1]["in"]
    # Auto-ducking: muzik direndahkan ketika YB bercakap, naik semula di hook, ruang emosi B-roll & penutup
    pre = [(0, 0.30), (3.4, 0.30), (4.6, 0.62)] if HOOK else [(0, 0.62)]
    if len(SEGS) == 1:
        pts = pre + [(sp_start - 0.6, 0.62), (sp_start + 0.2, 0.14), (97.0, 0.14),
                     (98.5, 0.19), (sp_end - 0.4, 0.2), (sp_end + 0.8, 0.70), (DUR, 0.70)]
    else:
        pts = list(pre)
        for k, sg in enumerate(SEGS):
            a, b = sg["at"], sg["at"] + sg["out"] - sg["in"]
            nxt = SEGS[k + 1]["at"] if k + 1 < len(SEGS) else None
            pts += [(a - 0.6, pts[-1][1]), (a + 0.2, 0.15), (b - 0.2, 0.15)]
            if nxt is not None and nxt - b < 2.5:
                continue  # jeda pendek: kekal rendah
            lvl = 0.70 if nxt is None else 0.55  # ruang emosi B-roll
            pts += [(b + 0.9, lvl)]
        pts += [(DUR, 0.70)]
        pts = sorted(pts)
    duck = env_curve(pts)
    out = music * duck
    speech = load(os.path.join(AUD, "ucapan.wav"))  # bermula pada EDL speechIn dalam Video Master
    def add_st(sig, t, g):
        i = int(t * SR)
        s = sig[:, : N - i]
        out[:, i:i + s.shape[1]] += s * g

    for sg in SEGS:
        a = int((sg["in"] - EDL["speechIn"]) * SR)
        b = int((sg["out"] - EDL["speechIn"]) * SR)
        piece = speech[:, a:b].copy()
        f = int(0.04 * SR)
        piece[:, :f] *= np.linspace(0, 1, f)
        piece[:, -f:] *= np.linspace(1, 0, f)
        add_st(piece, sg["at"], 1.0)
    amb = load(os.path.join(AUD, "ambien.wav"))
    amb_at = 4.6 if HOOK else 0.0
    amb_len = sp_start - amb_at + 2.0
    amb = amb[:, : int(min(amb.shape[1] / SR, amb_len) * SR)]
    tl = amb.shape[1] / SR
    amb = amb * np.interp(np.arange(amb.shape[1]) / SR, [0, 1.2, tl - 2.5, tl], [0, 1, 1, 0])
    add_st(amb, amb_at, 0.22)
    if HOOK:
        # Suara asal YB: "Baik-baik, jumpa lagi. Sabar ya." + gema lembut pada "Sabar ya"
        hk = load(os.path.join(AUD, f"hook-{EDL['output']}.wav"))
        tail = np.zeros((2, hk.shape[1] + int(3.5 * SR)))
        tail[:, : hk.shape[1]] = hk
        cut = int(2.8 * SR)
        wet = np.zeros_like(tail)
        wet[:, cut:] = tail[:, cut:]
        tail = tail + (reverb(wet, 3.0, 1.0, seed=11) - wet) * 0.35
        add_st(tail, 0.0, 1.0)
    sfx = np.zeros((2, N))
    for i, t in enumerate(G["swells"]):
        add(sfx, swell(2.0 + 0.2 * i), t, 0.5 + 0.1 * i)
    for i, t in enumerate(G["chimes"]):          # teks hook & tagline
        add(sfx, chime() * (0.8 if i % 2 else 1.0), t, 0.35 if t < 20 else 0.45, 0.2 if i % 2 else -0.2)
    out += reverb(sfx, 2.5, 0.5, seed=9)
    out /= max(1.0, np.max(np.abs(out)) / 0.97)
    tmp = os.path.join(AUD, "mix_pre.wav")
    wavfile.write(tmp, SR, (out.T * 32767).astype(np.int16))
    # Loudness media sosial: -14 LUFS, true peak -1.5 dB
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af",
                    "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", os.path.join(AUD, f"mix-{EDL['output']}.wav")], check=True)
    os.remove(tmp)
    print(f"siap: public/audio/muzik.wav, public/audio/mix-{EDL['output']}.wav")


if __name__ == "__main__":
    mix()
