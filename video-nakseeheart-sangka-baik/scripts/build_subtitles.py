#!/usr/bin/env python3
"""
Bina subtitle (Bahasa Malaysia) daripada transkrip Whisper bertanda masa perkataan.

Input : src/data/transcript.raw.json, src/data/timeline.json
Output: src/data/subtitles.json, out/<nama>.srt, out/transkrip.txt

Teks paparan ditulis secara eksplisit (tanda baca & ejaan dirapikan) dan dipadankan
perkataan demi perkataan dengan cap masa Whisper — ucapan TIDAK diubah.
Pembetulan ejaan sahaja: "uhuah" -> ukhuwah, "hadis kursi" -> hadis qudsi (sebutan lisan).
"""
import json, os, re

ROOT = os.path.join(os.path.dirname(__file__), "..")
NAME = "nakseeheart-sangka-baik"
raw = json.load(open(os.path.join(ROOT, "src/data/transcript.raw.json")))
tl = json.load(open(os.path.join(ROOT, "src/data/timeline.json")))

words = []
for seg in raw:
    for w in seg["words"]:
        t = w["w"].strip()
        if t.lower() == "ku" and words and words[-1]["w"].endswith("hamba"):
            t = "-" + t
        if t[:1] in "-'" and words:              # "maklumat" + "-maklumat", "Ta" + "'ala"
            words[-1]["w"] += t
            words[-1]["e"] = w["e"]
            continue
        words.append({"w": t, "s": w["s"], "e": w["e"]})

GOLD = {"sangka", "bersangka", "buruk", "baik", "ukhuwah", "persahabatan", "persaudaraan", "mengharmonikan",
        "kebaikan", "selidik", "tanya", "sah", "fitnah", "allah", "hati", "sangkaan", "pertama", "kedua",
        "pastikan", "lazimkan", "betul", "pasti", "hamba-hamba-ku", "insyaallah", "dapat"}
UPPER = {"buruk", "baik", "ukhuwah", "selidik", "sah", "fitnah", "allah", "pertama", "kedua"}

# (mula_sumber, tamat_sumber, teks paparan) — bilangan perkataan mesti sama dengan Whisper
CHUNKS = {
    "hook": [(85.98, 89.50, "Apa yang kita sangka, itulah yang kita akan dapat.")],
    "body": [
        (1.60, 5.32, "Jangan kita biasakan untuk sentiasa bersangka buruk."),
        (5.32, 7.92, "Kerana dengan sangka buruk ini…"),
        (7.92, 10.42, "boleh merosakkan nilai ukhuwah,"),
        (10.42, 11.94, "nilai persahabatan,"),
        (11.94, 13.98, "ataupun nilai persaudaraan sesama kita."),
        (13.98, 17.22, "Sebaliknya lazimkan nilai sentiasa bersangka baik."),
        (17.22, 20.58, "Kerana sangka baik ini boleh mengharmonikan hubungan,"),
        (20.58, 24.26, "bahkan boleh menyegarkan ukhuwah antara sesama lain."),
        (24.26, 26.60, "Bersangka baik ini tidak akan rugi."),
        (26.60, 29.66, "Bahkan dia memberikan satu kebaikan kepada kita…"),
        (29.66, 32.46, "dan juga kebaikan kepada orang yang berada di sekeliling kita."),
        (32.46, 35.90, "Bila ada satu perkara, cara yang pertama:"),
        (35.90, 37.74, "Selidik dahulu."),
        (37.74, 40.96, "Tanya dahulu, dapatkan maklumat yang betul…"),
        (40.96, 43.42, "sebelum kita membuat keputusan,"),
        (43.42, 46.32, "sebelum kita memberikan pandangan seumpama dengannya."),
        (46.32, 49.54, "Yang kedua, bila kita dah dapat maklumat yang betul…"),
        (49.54, 52.34, "kita pastikan maklumat tersebut maklumat yang sah."),
        (52.34, 56.26, "Baru kita maklumkan ataupun kita sebarkan perkara tersebut."),
        (56.26, 58.86, "Jangan membiasakan diri…"),
        (58.86, 61.96, "menyebarkan maklumat-maklumat yang tidak betul,"),
        (61.96, 64.08, "ataupun menyebarkan maklumat yang tidak pasti,"),
        (64.08, 67.48, "sehingga mendatangkan fitnah kepada diri sendiri, juga kepada orang lain."),
        (67.48, 69.56, "Dan seterusnya, paling penting:"),
        (69.56, 71.74, "bila kita bersangka baik dengan orang ini,"),
        (71.74, 74.30, "Allah Ta'ala akan jaga hati kita…"),
        (74.30, 77.70, "daripada perkara-perkara yang tidak diingini berlaku."),
        (77.70, 82.46, "“Aku bersama dengan sangkaan hamba-hamba-Ku.”"),
        (82.46, 86.02, "Daripada hadis qudsi menyebut, Allah nak bagitahu:"),
        (86.02, 89.54, "Apa yang kita sangka, itulah yang kita akan dapat."),
        (89.54, 92.96, "Maka lazimkan diri untuk sentiasa bersangka baik."),
        (92.96, 96.40, "Dan insyaAllah, baiklah kita akan dapat."),
    ],
}
# Chunk hadis: ada lafaz yang tidak dapat ditranskripsi dengan pasti (78.4–80.0 s);
# paparkan keseluruhan terjemahan penceramah sekali gus mulai 78.4 s.
STATIC = {77.70: 78.40}


def key(t):
    return re.sub(r"[^\w'-]", "", t.lower()).strip("'-")


segs = {s["id"]: s for s in tl["segments"]}
subs = []
for sid, ranges in CHUNKS.items():
    seg = segs[sid]
    off = seg["out"][0] - seg["src"]
    for a, b, text in ranges:
        ws = [w for w in words if a - 0.01 <= w["s"] < b - 0.01]
        toks = text.split(" ")
        assert len(ws) == len(toks), f"{a}-{b}: whisper {[w['w'] for w in ws]} != {toks}"
        items = []
        for w, tok in zip(ws, toks):
            k = key(tok)
            disp = tok
            if k in UPPER:
                disp = re.sub(r"[\w'-]+", lambda m: m.group(0).upper(), tok, count=1)
            s0 = STATIC.get(a, None)
            st = s0 if s0 is not None else w["s"]
            items.append({"text": disp, "start": round(st + off, 3), "end": round(max(w["e"], st + 0.2) + off, 3), "gold": k in GOLD})
        start = max(seg["out"][0], items[0]["start"] - 0.12)
        end = min(seg["out"][1], items[-1]["end"] + 0.25)
        subs.append({"segment": sid, "start": round(start, 3), "end": round(end, 3), "words": items})

# Pecah chunk panjang (> 40 aksara) supaya sentiasa maksimum 2 baris
MAXC = 40
split = []
for c in subs:
    txt = " ".join(w["text"] for w in c["words"])
    if len(txt) <= MAXC or c["start"] >= STATIC.get(77.70, 0) + 2 - 0.2 and c["start"] <= 80.6:
        split.append(c); continue
    best, bi = 1e9, 1
    for i in range(1, len(c["words"])):
        a = len(" ".join(w["text"] for w in c["words"][:i])); b = len(txt) - a
        if abs(a - b) < best: best, bi = abs(a - b), i
    w1, w2 = [dict(w) for w in c["words"][:bi]], c["words"][bi:]
    if not w1[-1]["text"].endswith((",", ".", "…", ":")): w1[-1]["text"] += "…"
    split.append({**c, "words": w1, "end": round(w2[0]["start"] - 0.05, 3)})
    split.append({**c, "words": w2, "start": round(w2[0]["start"] - 0.1, 3)})
subs = split
for i in range(len(subs) - 1):
    if subs[i]["end"] > subs[i + 1]["start"]:
        subs[i]["end"] = subs[i + 1]["start"]

json.dump(subs, open(os.path.join(ROOT, "src/data/subtitles.json"), "w"), ensure_ascii=False, indent=1)


def ts(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)):03d}"


os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)
with open(os.path.join(ROOT, f"out/{NAME}.srt"), "w") as f:
    for i, s in enumerate(subs, 1):
        f.write(f"{i}\n{ts(s['start'])} --> {ts(s['end'])}\n{' '.join(w['text'] for w in s['words'])}\n\n")
with open(os.path.join(ROOT, "out/transkrip.txt"), "w") as f:
    f.write("TRANSKRIP PENUH — IMG_2582.mov (masa sumber, ejaan dirapikan)\n\n")
    for a, b, text in CHUNKS["body"]:
        f.write(f"[{a:05.2f}] {text}\n")
print(f"{len(subs)} chunk subtitle ditulis")
