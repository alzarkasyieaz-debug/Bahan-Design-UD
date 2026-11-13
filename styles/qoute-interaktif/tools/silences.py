#!/usr/bin/env python3
"""Kesan jeda sebenar (senyap) dalam audio — untuk titik potong EDL yang bersih.
Guna: python3 -I silences.py audio16k.wav [ambang_dB=42] [min_saat=0.12]"""
import sys, wave
import numpy as np
w = wave.open(sys.argv[1]); sr = w.getframerate()
a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float)
thr = float(sys.argv[2]) if len(sys.argv) > 2 else 42.0
mn = float(sys.argv[3]) if len(sys.argv) > 3 else 0.12
hop = sr // 100; n = len(a) // hop
e = np.array([20 * np.log10(np.sqrt(np.mean(a[i * hop:i * hop + 2 * hop] ** 2)) + 1) for i in range(n)])
out, i = [], 0
while i < n:
    if e[i] < thr:
        j = i
        while j < n and e[j] < thr: j += 1
        if (j - i) / 100 >= mn: out.append((i / 100, j / 100))
        i = j
    else:
        i += 1
print(" ".join(f"[{s:.2f}-{t:.2f}]" for s, t in out))
