#!/usr/bin/env python3
"""
Bina subtitle (Bahasa Malaysia) daripada transkrip Whisper bertanda masa perkataan.

Input : src/data/transcript.raw.json   (faster-whisper large-v3, word_timestamps)
        src/data/timeline.json         (segmen suntingan: masa output <-> masa sumber)
Output: src/data/subtitles.json        (dibaca oleh komposisi Remotion)
        out/nakseeheart-kebahagiaan-sebenar.srt
        out/transkrip.txt

Ucapan TIDAK diubah — hanya ejaan/tanda baca dirapikan (cth. "setenang -tenangnya").
"""
import json, os, re

ROOT = os.path.join(os.path.dirname(__file__), "..")
raw = json.load(open(os.path.join(ROOT, "src/data/transcript.raw.json")))
tl = json.load(open(os.path.join(ROOT, "src/data/timeline.json")))

# ---- senarai perkataan sumber
words = []
for seg in raw:
    for w in seg["words"]:
        t = w["w"].strip()
        if t.startswith("-") and words:          # "setenang" + "-tenangnya"
            words[-1]["w"] += t
            words[-1]["e"] = w["e"]
            continue
        words.append({"w": t, "s": w["s"], "e": w["e"]})

# Kata kunci -> warna emas. UPPER -> huruf besar + emas (penekanan utama).
GOLD = {"bahagia", "kebahagiaan", "membahagiakan", "duit", "pangkat", "harta", "kereta", "mewah",
        "allah", "ibadah", "setenang-tenangnya", "akhirat", "cari", "cipta", "mentaati", "sebenar"}
UPPER = {"duit", "pangkat", "harta", "kereta", "mewah", "mentaati", "allah", "ibadah",
         "akhirat", "cari", "cipta", "sebenar"}

# ---- chunk (masa SUMBER). Setiap chunk = maks 2 baris di skrin.
CHUNKS = {
    "hook": [(18.74, 20.56), (20.56, 23.19)],
    "body": [(1.40, 4.58), (4.58, 7.40), (7.80, 10.70), (10.70, 13.28), (13.28, 16.30),
             (16.30, 18.24), (18.24, 20.56), (20.56, 23.20), (23.20, 25.92), (25.92, 28.72),
             (28.72, 31.34), (31.34, 34.24), (34.24, 36.30), (36.30, 39.10)],
}
FIX = {"swt": "SWT", "allah": "Allah"}


def norm(t):
    k = re.sub(r"[^\w-]", "", t.lower())
    return k


def fmt(t, k):
    clean = t.rstrip(",.")
    if k in FIX:
        clean = FIX[k]
    if k in UPPER:
        clean = clean.upper()
    return clean


segs = {s["id"]: s for s in tl["segments"]}
subs = []
for sid, ranges in CHUNKS.items():
    seg = segs[sid]
    off = seg["out"][0] - seg["src"]
    for ci, (a, b) in enumerate(ranges):
        ws = [w for w in words if w["s"] >= a - 0.01 and w["s"] < b - 0.01]
        items = []
        for i, w in enumerate(ws):
            k = norm(w["w"])
            items.append({
                "text": fmt(w["w"], k),
                "start": round(w["s"] + off, 3),
                "end": round(w["e"] + off, 3),
                "gold": k in GOLD,
            })
        # tanda baca ringkas
        last = len(items) - 1
        is_cont = sid == "hook" and ci == 0 or (sid == "body" and (a, b) in [(18.24, 20.56), (28.72, 31.34), (13.28, 16.30), (34.24, 36.30)])
        if items:
            items[last]["text"] += "…" if is_cont else "."
            if items[0]["text"][0].islower():
                items[0]["text"] = items[0]["text"][0].upper() + items[0]["text"][1:]
        if sid == "body" and (a, b) == (16.30, 18.24):
            for it in items:
                if it["text"] == "banyak":
                    it["text"] = "banyak,"
        start = max(seg["out"][0], items[0]["start"] - 0.12)
        end = min(seg["out"][1], items[-1]["end"] + 0.25)
        subs.append({"segment": sid, "start": round(start, 3), "end": round(end, 3), "words": items})

# Pecah chunk panjang (> 40 aksara) supaya sentiasa maksimum 2 baris di skrin
MAXC = 40
split = []
for c in subs:
    txt = " ".join(w["text"] for w in c["words"])
    if len(txt) <= MAXC:
        split.append(c); continue
    best, bi = 1e9, 1
    for i in range(1, len(c["words"])):
        a = len(" ".join(w["text"] for w in c["words"][:i])); b = len(txt) - a
        if abs(a - b) < best: best, bi = abs(a - b), i
    w1, w2 = c["words"][:bi], c["words"][bi:]
    w1[-1] = dict(w1[-1]); 
    if not w1[-1]["text"].endswith((",", ".", "…")): w1[-1]["text"] += "…"
    split.append({**c, "words": w1, "end": round(w2[0]["start"] - 0.05, 3)})
    split.append({**c, "words": w2, "start": round(w2[0]["start"] - 0.1, 3)})
subs = split

# elak bertindih
for i in range(len(subs) - 1):
    if subs[i]["end"] > subs[i + 1]["start"]:
        subs[i]["end"] = subs[i + 1]["start"]

json.dump(subs, open(os.path.join(ROOT, "src/data/subtitles.json"), "w"), ensure_ascii=False, indent=1)


def ts(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)):03d}"


os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)
with open(os.path.join(ROOT, "out/nakseeheart-kebahagiaan-sebenar.srt"), "w") as f:
    for i, s in enumerate(subs, 1):
        f.write(f"{i}\n{ts(s['start'])} --> {ts(s['end'])}\n{' '.join(w['text'] for w in s['words'])}\n\n")

# Transkrip penuh (masa sumber)
with open(os.path.join(ROOT, "out/transkrip.txt"), "w") as f:
    f.write("TRANSKRIP PENUH — IMG_9879.mov (masa sumber)\n\n")
    for seg in raw:
        f.write(f"[{seg['start']:05.2f}–{seg['end']:05.2f}] {seg['text'].strip()}\n")
print(f"{len(subs)} chunk subtitle ditulis")
