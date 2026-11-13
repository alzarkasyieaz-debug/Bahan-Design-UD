#!/usr/bin/env python3
"""
Subtitle Bahasa Malaysia — NakSeeHeart "Jaga Komunikasi Bila Jumpa Kawan Lama".

Input : src/data/transcript.raw.json (Whisper large-v3, cap masa perkataan)
        src/data/timeline.json       (EDL: klip sumber -> garis masa output)
Output: src/data/subtitles.json, out/<NAME>.srt, out/transkrip.txt

Teks setiap chunk telah disemak (dua model + transkripsi semula setiap klip).
Ucapan tidak diubah; hanya ejaan/tanda baca dirapikan dan kata pengisi ("dalam", "ke") dibuang.
Pemasaan: perkataan Whisper dalam julat jika bilangannya sama; jika tidak, diagihkan
secara berkadar dengan panjang perkataan merentas julat suara.
"""
import json, os, re

ROOT = os.path.join(os.path.dirname(__file__), "..")
NAME = "nakseeheart-jaga-komunikasi"
raw = json.load(open(os.path.join(ROOT, "src/data/transcript.raw.json")))
tl = json.load(open(os.path.join(ROOT, "src/data/timeline.json")))

words = []
for seg in raw:
    for w in seg["words"]:
        t = w["w"].strip()
        if t[:1] in "-'" and words:
            words[-1]["w"] += t; words[-1]["e"] = w["e"]; continue
        words.append({"w": t, "s": w["s"], "e": w["e"]})

GOLD = {"tiga", "keadaan", "kawan", "lama", "mood", "pertama", "kedua", "ketiga", "sapaan", "panggilan", "assalamualaikum",
        "pekik", "bergurau", "suasana", "tempat", "niat", "situasi", "diaibkan", "dimalukan", "sindiran", "elakkan",
        "komunikasi", "ukhuwah", "kawan-kawan", "media", "sosial", "baik", "lancar"}
UPPER = {"pertama", "kedua", "ketiga", "sindiran", "diaibkan", "dimalukan", "elakkan", "komunikasi", "ukhuwah"}

# (klip, mula_sumber, tamat_sumber, teks)
CHUNKS = [
    ("hook", 100.30, 102.60, "Elakkan tiga perkara ini…"),
    ("hook", 102.60, 105.05, "bila kita jumpa kawan-kawan yang lama kita tak jumpa."),
    ("s1", 1.80, 6.14, "Tiga keadaan ketika mana kita nak memulakan percakapan,"),
    ("s1", 6.14, 12.08, "ataupun nak memulakan bersembang dengan kawan yang kita dah lama tak jumpa."),
    ("s1", 12.08, 16.44, "Tapi keadaan tersebut mengganggu ataupun menyebabkan…"),
    ("s1", 16.44, 21.98, "mood jadi tak cantik untuk kita bersembang dalam kadar tempoh yang lama."),
    ("s1", 22.70, 25.34, "Yang pertama adalah bila mana kita nak mulakan bercakap,"),
    ("s1", 25.34, 29.42, "kita mulakan dengan panggilan ataupun sapaan yang tak cantik."),
    ("s2", 34.58, 36.14, "“Assalamualaikum, lama tak jumpa.”"),
    ("s2", 36.14, 39.55, "Itu lebih baik berbanding dengan kita pekik panggil dia pula."),
    ("s2", 39.95, 42.95, "Tambahkan lagi kita panggil pula dengan nama panggilan yang tak sesuai dengan dia."),
    ("s3", 45.20, 50.62, "Yang kedua pula, kita nak bergurau tapi tidak kena dengan suasana,"),
    ("s3", 50.95, 54.00, "tidak kena dengan tempat ataupun tidak kena dengan keadaan."),
    ("s3", 54.88, 57.08, "Contoh, dah lama tak jumpa, kan?"),
    ("s3", 57.08, 60.74, "Bila jumpa pula: “Oi, besar je badan hang! Hang makan ke, hang melantak?”"),
    ("s4", 62.62, 68.60, "Walaupun mungkin niat adalah untuk bergurau sebab lama tak jumpa,"),
    ("s4", 68.60, 74.56, "tapi alangkah cantiknya, bergurau itu kita tengok pada keadaan, situasi setempat."),
    ("s4", 74.56, 77.96, "Mungkin tengah-tengah ramai orang ke, dalam majlis ke, apakah."),
    ("s4", 78.44, 81.60, "Jadi dia boleh menyebabkan orang itu akan rasa…"),
    ("s4", 81.60, 84.61, "seperti diaibkan, dimalukan di khalayak ramai."),
    ("s4", 85.00, 86.74, "Dan yang ketiga adalah sindiran."),
    ("s5", 89.68, 91.26, "Kadang-kadang kita perlu tengok keadaan."),
    ("s6", 100.30, 102.60, "Elakkan tiga perkara ini…"),
    ("s6", 102.60, 105.05, "bila kita jumpa kawan-kawan yang lama kita tak jumpa,"),
    ("s7", 108.10, 112.80, "ataupun kita hanya banyak berbicara melalui media sosial sahaja."),
    ("s7", 112.80, 116.02, "Jadi bila jumpa kawan-kawan lama ni, apa salahnya?"),
    ("s7", 116.70, 118.50, "Jaga komunikasi kita…"),
    ("s7", 118.50, 124.70, "supaya kawan-kawan kita tadi itu tidak rasa seperti diaibkan, tidak rasa seperti dimalukan."),
    ("s7", 125.20, 131.35, "Sebaliknya, jaga komunikasi supaya ukhuwah tadi itu berjalan dengan lebih baik dan lebih lancar lagi."),
]


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
    if len(txt) <= 48:
        split.append(c); continue
    parts = [c["words"]]
    while any(len(" ".join(w["text"] for w in p)) > 48 for p in parts):
        new = []
        for p in parts:
            s = " ".join(w["text"] for w in p)
            if len(s) <= 48 or len(p) < 2:
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
    f.write("TRANSKRIP PENUH — IMG_4022.MOV (masa sumber)\n")
    f.write("Bahagian [TIDAK PASTI] tidak digunakan dalam video kerana loghat tidak dapat ditranskripsi dengan yakin.\n\n")
    full = [(a, t) for sid, a, b, t in CHUNKS if sid != "hook"]
    unsure = [(29.42, "[TIDAK PASTI ~29.4–34.6 s — contoh sapaan dalam loghat utara]"),
              (42.95, "[~43.0–45.2 s — “…contoh. Itu yang pertama.” (tidak digunakan)]"),
              (60.74, "[TIDAK PASTI ~60.7–62.6 s]"),
              (86.74, "[~88.0–89.6 s — “Sindiran juga.” (ulangan, tidak digunakan)]"),
              (91.26, "[TIDAK PASTI ~91.3–100.3 s — contoh sindiran dalam loghat utara]"),
              (105.05, "[~105.1–108.1 s — “Lama, mungkin setahun, mungkin dua tahun. Lama tak jumpa.” (tidak digunakan)]")]
    for a, t in sorted(full + unsure):
        f.write(f"[{a:06.2f}] {t}\n")
print(f"{len(subs)} chunk subtitle ditulis")
