#!/usr/bin/env python3
"""
Subtitle Bahasa Malaysia — STYLE QOUTE INTERAKTIF (NakSeeHeart).

Input : src/data/transcript.raw.json (Whisper large-v3, cap masa perkataan)
        src/data/timeline.json       (EDL: klip sumber -> garis masa output)
        src/data/script.json         (chunk teks disemak + kata kunci + nota bahagian tidak pasti)
Output: src/data/subtitles.json, out/<output>.srt, out/transkrip.txt

Ucapan TIDAK diubah: hanya ejaan/tanda baca dirapikan. Bahagian yang tidak dapat ditranskripsi
dengan yakin TIDAK dimasukkan (catat dalam script.json -> "unsure").
Pemasaan: perkataan Whisper dalam julat jika bilangannya sama; jika tidak, diagihkan
secara berkadar dengan panjang perkataan merentas julat suara.
"""
import json, os, re

ROOT = os.path.join(os.path.dirname(__file__), "..")
raw = json.load(open(os.path.join(ROOT, "src/data/transcript.raw.json")))
tl = json.load(open(os.path.join(ROOT, "src/data/timeline.json")))
sc = json.load(open(os.path.join(ROOT, "src/data/script.json")))
NAME = json.load(open(os.path.join(ROOT, "src/data/storyboard.json")))["meta"]["output"]
MAXC = sc.get("maxChars", 48)

words = []
for seg in raw:
    for w in seg["words"]:
        t = w["w"].strip()
        if t[:1] in "-'" and words:
            words[-1]["w"] += t; words[-1]["e"] = w["e"]; continue
        words.append({"w": t, "s": w["s"], "e": w["e"]})

GOLD = set(sc["gold"])
UPPER = set(sc["upper"])
# [klip, mula_sumber, tamat_sumber, teks]
CHUNKS = [tuple(c) for c in sc["chunks"]]


def key(t):
    return re.sub(r"[^\w'-]", "", t.lower()).strip("'-")


segs = {s["id"]: s for s in tl["segments"]}
subs = []
for sid, a, b, text in CHUNKS:
    seg = segs[sid]
    off = seg["out"][0] - seg["src"]
    toks = text.split(" ")
    ws = [w for w in words if a - 0.01 <= w["s"] < b - 0.01]
    if len(ws) == len(toks):
        times = [(max(w["s"], a), min(w["e"], b)) for w in ws]
    else:
        lo = max(a, ws[0]["s"]) if ws else a
        hi = min(b, ws[-1]["e"]) if ws else b
        L = [len(re.sub(r"\W", "", t)) + 2 for t in toks]
        tot = sum(L); acc = 0; times = []
        for l in L:
            s0 = lo + (hi - lo) * acc / tot; acc += l
            times.append((s0, lo + (hi - lo) * acc / tot))
    items = []
    for tok, (s0, e0) in zip(toks, times):
        k = key(tok)
        disp = re.sub(r"[\w'-]+", lambda m: m.group(0).upper(), tok, count=1) if k in UPPER else tok
        items.append({"text": disp, "start": round(s0 + off, 3), "end": round(e0 + off, 3), "gold": k in GOLD})
    start = max(seg["out"][0], items[0]["start"] - 0.12)
    end = min(seg["out"][1], items[-1]["end"] + 0.3)
    subs.append({"segment": sid, "start": round(start, 3), "end": round(end, 3), "words": items})

# Pecah chunk > 48 aksara supaya maksimum 2 baris
split = []
for c in subs:
    txt = " ".join(w["text"] for w in c["words"])
    if len(txt) <= MAXC:
        split.append(c); continue
    parts = [c["words"]]
    while any(len(" ".join(w["text"] for w in p)) > MAXC for p in parts):
        new = []
        for p in parts:
            s = " ".join(w["text"] for w in p)
            if len(s) <= MAXC or len(p) < 2:
                new.append(p); continue
            best, bi = 1e9, 1
            for i in range(1, len(p)):
                l1 = len(" ".join(w["text"] for w in p[:i]))
                if abs(l1 - (len(s) - l1)) < best: best, bi = abs(l1 - (len(s) - l1)), i
            new += [p[:bi], p[bi:]]
        parts = new
    for i, p in enumerate(parts):
        p = [dict(w) for w in p]
        if i < len(parts) - 1 and not p[-1]["text"].endswith((",", ".", "…", ":", "?", "!", "”")):
            p[-1]["text"] += "…"
        st = c["start"] if i == 0 else p[0]["start"] - 0.1
        en = c["end"] if i == len(parts) - 1 else parts[i + 1][0]["start"] - 0.05
        split.append({**c, "words": p, "start": round(st, 3), "end": round(en, 3)})
subs = split
for i in range(len(subs) - 1):
    if subs[i]["end"] > subs[i + 1]["start"]:
        subs[i]["end"] = subs[i + 1]["start"]

json.dump(subs, open(os.path.join(ROOT, "src/data/subtitles.json"), "w"), ensure_ascii=False, indent=1)


def ts(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}"


os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)
with open(os.path.join(ROOT, f"out/{NAME}.srt"), "w") as f:
    for i, s in enumerate(subs, 1):
        f.write(f"{i}\n{ts(s['start'])} --> {ts(s['end'])}\n{' '.join(w['text'] for w in s['words'])}\n\n")
with open(os.path.join(ROOT, "out/transkrip.txt"), "w") as f:
    f.write(f"TRANSKRIP PENUH — {sc.get('source', '')} (masa sumber)\n")
    f.write("Bahagian [TIDAK PASTI]/[TIDAK DIGUNAKAN] tidak dimasukkan dalam video.\n\n")
    full = [(a, t) for sid, a, b, t in CHUNKS if sid != "hook"]
    unsure = [(u[0], u[1]) for u in sc.get("unsure", [])]
    for a, t in sorted(full + unsure):
        f.write(f"[{a:06.2f}] {t}\n")
print(f"{len(subs)} chunk subtitle ditulis")
