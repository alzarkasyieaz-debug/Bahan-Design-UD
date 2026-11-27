#!/usr/bin/env python3
"""Jana fail SRT dan jadual timeline/senarai bahan (Markdown) terus daripada timelines.py,
supaya dokumen sentiasa sepadan dengan video yang dirender."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import timelines
from shots import Still, Clip, Card, Black
from mapshot import MapShot
from overlays import Sub, Title, Chapter, Words, Location, Lower, Credits
from engine import ROOT

OUT = os.path.join(ROOT, "out")
DOCS = os.path.join(ROOT, "docs")


def ts(t, srt=True):
    h, r = divmod(max(0, t), 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}" if srt else f"{int(m)}:{s:04.1f}"


def srt(name, fn):
    tl = timelines.ALL[name]()
    subs = sorted([o for o in tl["ovs"] if isinstance(o, Sub)], key=lambda o: o.a)
    lines = []
    for i, o in enumerate(subs, 1):
        lines += [str(i), f"{ts(o.a)} --> {ts(o.b)}", o.kw["text"], ""]
    open(os.path.join(OUT, fn), "w", encoding="utf-8").write("\n".join(lines))
    print("✓", fn, len(subs), "baris")


def describe(s):
    if isinstance(s, MapShot):
        return "Peta animasi", "Kuala Terengganu » Bota (pulang)" if s.kw.get("reverse") else "Bota, Perak » Kuala Terengganu", ""
    if isinstance(s, Black):
        return "Hitam", "—", ""
    if isinstance(s, Card):
        return "Kad grafik", s.kw.get("src", "latar teal"), "latar kabur" if s.kw.get("src") else ""
    if isinstance(s, Clip):
        sp = s.kw.get("speed", 0.8)
        note = f"src {s.kw.get('src_t', 0):.1f}s, {'masa nyata + audio ucapan' if sp == 1 else f'gerak perlahan {sp:.0%}'}, {s.kw.get('mode')}"
        return "Video", s.kw["src"], note
    if isinstance(s, Still):
        return "Foto", s.kw["src"], f"{s.kw.get('mode', 'auto')}, {s.kw.get('move', 'in')}"
    return "?", "", ""


def ovdesc(o):
    k = type(o).__name__
    if isinstance(o, Sub):
        return f"Subtitle: {o.kw['text']}"
    if isinstance(o, Title):
        return "Tajuk: " + " / ".join(o.kw.get("lines", []))
    if isinstance(o, Chapter):
        return f"Bab {o.kw.get('num')}: {o.kw['title']}"
    if isinstance(o, Words):
        return f"Teks tema: {o.kw['word']}"
    if isinstance(o, Location):
        return f"Lokasi: {o.kw['name']} — {o.kw.get('sub', '')}"
    if isinstance(o, Lower):
        return f"Lower third: {o.kw['l1']}" + (f" / {o.kw['l2']}" if o.kw.get("l2") else "")
    if isinstance(o, Credits):
        return "Kredit penutup + logo"
    return k


def table(name, title):
    tl = timelines.ALL[name]()
    r = [f"# Timeline penyuntingan — {title}", "",
         f"Kanvas {tl['W']}×{tl['H']}, 24 fps, tempoh {tl['fx']['end']:.1f} s. Dijana automatik daripada `scripts/timelines.py`.", "",
         "## Shot (visual)", "", "| # | Masuk | Keluar | Jenis | Sumber | Nota / peralihan |", "|---|---|---|---|---|---|"]
    for i, s in enumerate(tl["shots"], 1):
        k, src, note = describe(s)
        tr = f"{s.tr[0]} {s.tr[1]}s" if s.tr else "cut"
        r.append(f"| {i} | {ts(s.t, False)} | {ts(s.t + s.d, False)} | {k} | `{src}` | {note}; masuk: {tr} |")
    r += ["", "## Grafik & teks", "", "| Masuk | Keluar | Lapisan |", "|---|---|---|"]
    for o in sorted(tl["ovs"], key=lambda o: o.a):
        r.append(f"| {ts(o.a, False)} | {ts(o.b, False)} | {ovdesc(o)} |")
    r += ["", "## Audio", "", "| Masa | Jenis | Butiran |", "|---|---|---|"]
    for k, at in tl["audio"]["vo"]:
        r.append(f"| {ts(at, False)} | Voice-over | `{k}` (build/vo/{k}.wav) |")
    for (src, st, d, at, g) in tl["audio"]["bites"]:
        r.append(f"| {ts(at, False)} | Ucapan sebenar | `{src}` {st:.1f}–{st + d:.1f}s |")
    r.append(f"| 0:00 | Muzik | skor asli, cue intensiti: " + ", ".join(f"{ts(a, False)}→{v}" for a, v in tl["music"]["cues"]) + " |")
    r.append("| — | Efek | film burn pada " + ", ".join(ts(b, False) for b in tl["fx"]["burns"]) + "; light leak; grain; vignette |")
    open(os.path.join(DOCS, f"timeline_{name}.md"), "w", encoding="utf-8").write("\n".join(r) + "\n")
    print("✓ timeline", name)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    srt("main", "dari-parit-ke-terengganu_dokumentari_16x9.srt")
    srt("teaser", "dari-parit-ke-terengganu_teaser30s.srt")
    srt("reel", "dari-parit-ke-terengganu_highlight60s_9x16.srt")
    table("main", "Dokumentari penuh 16:9")
    table("teaser", "Teaser 30 saat 16:9")
    table("reel", "Highlight 60 saat 9:16")
