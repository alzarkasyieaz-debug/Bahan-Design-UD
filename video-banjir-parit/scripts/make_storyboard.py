#!/usr/bin/env python3
"""Jana STORYBOARD-CAPCUT.md daripada src/data/timeline.json (sumber tunggal pemasaan)."""
import json
import os

ROOT = os.path.join(os.path.dirname(__file__), "..")
TL = json.load(open(os.path.join(ROOT, "src", "data", "timeline.json")))

VO = {
    1: "Bayangkan… saat kita masih lena di rumah sendiri, ada saudara kita yang terpaksa meninggalkan kediaman demi keselamatan.",
    2: "Banjir bukan sekadar air yang melimpah. Di sebaliknya, ada keluarga yang diuji… ada rutin kehidupan yang terhenti… dan ada hati yang sedang mencari kekuatan untuk meneruskan hari.",
    3: "Di Parlimen Parit, YB Ustaz Muhammad Ismi Mat Taib turun meninjau Pusat Pemindahan Sementara, bertemu penduduk yang terjejas, dan mendengar sendiri keadaan yang sedang mereka hadapi.",
    4: "Di sebalik setiap pertemuan… ada kisah yang perlu didengari. Ada keperluan yang harus dibantu.",
    5: "Mungkin kita tidak mampu menghentikan hujan… [JEDA] Tetapi kita mampu meringankan beban mereka.",
    6: "Hari ini, mereka tidak meminta kemewahan. Mereka memerlukan bantuan, keprihatinan… dan keyakinan bahawa mereka tidak bersendirian.",
    7: "Kecil pada nilai kita… mungkin besar maknanya buat mereka.",
    8: "Marilah kita bersama-sama membantu saudara kita yang sedang diuji.",
    9: "Kerana apabila kita berkongsi rezeki… kita turut berkongsi harapan.",
}
SRC = {
    "8273": "IMG_8273.MOV", "8275": "IMG_8275.MOV", "8250": "IMG_8250.MOV", "8249": "IMG_8249.MOV", "8251": "IMG_8251.MOV",
    "8340": "IMG_8340.MOV", "8343": "IMG_8343.MOV", "8230": "IMG_8230.MOV", "8231": "IMG_8231.MOV", "1760": "copy_1760A675….mov",
}
SCENES90 = [
    (0, 8.2, "BABAK 1 — HOOK YANG MENYENTUH", "Piano melankolik jarang + hujan + nota rendah panjang"),
    (8.2, 25, "BABAK 2 — REALITI MANGSA BANJIR", "Piano jarang, hujan berkurang"),
    (25, 43.6, "BABAK 3 — YB USTAZ ISMI BERSAMA RAKYAT", "Strings hangat masuk, arpeggio piano"),
    (43.6, 58, "BABAK 4 — SENTUH HATI MEREKA (KEMUNCAK)", "Kebangkitan emosi + perkusi lembut, impak pada setiap baris"),
    (58, 77.4, "BABAK 5 — SERUAN KEMANUSIAAN", "Progresi orkestra penuh harapan (F–C–Dm–Bb)"),
    (77.4, 90, "BABAK 6 — CTA SUMBANGAN & PENUTUP", "Resolusi hangat Fadd9, riser → impak pada kad, shimmer pada QR"),
]


def tc(s):
    m, x = divmod(s, 60)
    return f"{int(m):02d}:{x:05.2f}"


def fx(s):
    out = []
    if s.get("rate", 1) != 1:
        out.append(f"Kelajuan {s['rate']}× (slow motion)")
    z = s["zoom"]
    out.append(("Push-in" if z[1] > z[0] else "Pull-out") + f" {int(z[0]*100)}%→{int(z[1]*100)}%")
    if s.get("blur"):
        out.append(f"Blur {s['blur']}")
    if s.get("dim"):
        out.append(f"Gelap {int(s['dim']*100)}%")
    w = s["warm"]
    out.append("Gred: biru-kelabu" if w < 0.2 else "Gred: semula jadi" if w < 0.6 else "Gred: keemasan")
    out.append(f"Audio asal {int(s['nat']*100)}%" if s["nat"] else "Audio asal: senyap")
    return "; ".join(out)


def version_tables(v, scenes=None):
    L = []
    L.append("| # | Masa | Footaj sumber (in → out) | Visual | Kesan & gred |")
    L.append("|---|---|---|---|---|")
    for i, s in enumerate(v["shots"], 1):
        src_out = s["from"] + s["dur"] * s.get("rate", 1)
        if scenes:
            for a, b, name, music in scenes:
                if abs(s["at"] - a) < 0.01:
                    L.append(f"| | **{tc(a)}** | **{name}** | 🎵 {music} | |")
        L.append(f"| {i} | {tc(s['at'])}–{tc(s['at']+s['dur'])} | `{SRC[s['src']]}` {s['from']:.1f}s → {src_out:.1f}s | {s.get('note','')} | {fx(s)} |")
    L.append("")
    L.append("**Grafik gerak & teks**\n")
    L.append("| Masa | Jenis | Teks | Animasi |")
    L.append("|---|---|---|---|")
    anim = {
        "hero": "Perkataan demi perkataan: blur→tajam, naik dari bawah, kedalaman 3D, sapuan cahaya + impak",
        "keyword": "Garis emas mengembang atas & bawah, huruf jarak lebar, whoosh lembut",
        "climax": "Baris demi baris diselaraskan dengan narasi, baris emas = 3D emas, impak muzik",
        "support": "Naik + blur→tajam; baris emas bergradien",
    }
    rows = [(t["at"], t["end"], t["kind"].upper(), " / ".join(t["lines"]), anim[t["kind"]]) for t in v["texts"]]
    m = v["money"]
    rows.append((m["at"], m["end"], "KAUNTER", " · ".join(f"RM{a}" for a in m["amounts"]), f"Pop spring + angka berdetik naik, 3D emas, ding setiap {m['gap']}s"))
    lt = v["lowerThird"]
    rows.append((lt["at"], lt["end"], "LOWER-THIRD", "YB USTAZ MUHAMMAD ISMI MAT TAIB / Ahli Parlimen Parit", "Bar emas tumbuh, panel kaca sapu dari kiri"))
    st = v["sourceTag"]
    rows.append((st["at"], st["end"], "LABEL", "● Rakaman sebenar · Parlimen Parit", "Pudar masuk/keluar, titik merah berdenyut"))
    c = v["cta"]
    rows.append((c["at"], c["end"], "KAD CTA", "BANTUAN BANJIR / PARLIMEN PARIT / AYUH KITA BANTU MEREKA! + QR + akaun + pautan + hubungan", "Kad spring masuk, butiran berperingkat, QR pop + shimmer, butang berdenyut"))
    if v.get("endCard"):
        e = v["endCard"]
        rows.append((e["at"], e["end"], "PENUTUP", "BERSAMA MERINGANKAN BEBAN / PUSAT KHIDMAT MASYARAKAT AHLI PARLIMEN PARIT", "Cinzel emas, jarak huruf merapat perlahan, pudar ke hitam"))
    for a, b, k, t, an in sorted(rows):
        L.append(f"| {tc(a)}–{tc(b)} | {k} | {t} | {an} |")
    L.append("")
    L.append("**Suara latar (klip rakaman)**\n")
    L.append("| Klip | Mula | Slot maks | Teks | Subtitle |")
    L.append("|---|---|---|---|---|")
    for s in v["vo"]:
        L.append(f"| VO-{s['id']:02d} | {tc(s['at'])} | {s['max']:.1f}s | {VO[s['id']]} | {'Tiada — diganti teks kinetik' if s.get('noSubs') else 'Ya'} |")
    return "\n".join(L)


HEADER = open(os.path.join(ROOT, "scripts", "storyboard_header.md")).read()
doc = HEADER + "\n## A. VERSI PENUH — 90 SAAT\n\n" + version_tables(TL["v90"], SCENES90) + "\n\n## B. VERSI IKLAN — 30 SAAT\n\n" + version_tables(TL["v30"]) + "\n"
open(os.path.join(ROOT, "STORYBOARD-CAPCUT.md"), "w").write(doc)
print("✓ STORYBOARD-CAPCUT.md")
