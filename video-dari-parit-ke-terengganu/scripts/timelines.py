"""
Timeline penyuntingan (saat) untuk tiga versi:
  main   – dokumentari penuh 16:9 (1920x1080)
  teaser – teaser 30 s 16:9
  reel   – highlight 60 s 9:16 (1080x1920)

Semua bahan ialah rakaman/gambar sebenar daripada folder Drive program.
Nota masa: fail IMG/VID_20260922_* datang daripada telefon kedua yang jamnya
tidak tepat; kandungannya (bilik & orang yang sama) menunjukkan ia sesi
pagi 26.11.2026 sebelum penyerahan cenderamata 13:02.
"""
import os, json
from shots import Still, Clip, Card, Black, Showcase
from mapshot import MapShot
from overlays import Title, Chapter, Words, Location, Lower, Sub, Credits
from engine import ROOT

VO_META = json.load(open(os.path.join(ROOT, "build", "vo", "vo.json"))) if os.path.exists(
    os.path.join(ROOT, "build", "vo", "vo.json")) else {}

I = lambda s: f"IMG_2026{s}.jpg"
V = lambda s: f"VID_2026{s}.mp4"
MV = lambda s: f"MVIMG_2026{s}.jpg"
DATE = "Terengganu  ·  26 November 2026"


def logos():
    d = os.path.join(ROOT, "assets", "logo")
    return sorted(os.path.join(d, f) for f in os.listdir(d) if f.lower().endswith((".png", ".webp"))) if os.path.isdir(d) else []


def vo_subs(key, at, y=None):
    out = []
    for s0, s1, txt in VO_META.get(key, {}).get("sent", []):
        kw = {"text": txt}
        if y:
            kw["y"] = y
        out.append(Sub(at + s0 - 0.05, at + s1 + 0.25, **kw))
    return out


# ---------------------------------------------------------------- MAIN 16:9
def main():
    S = []
    O = []
    A = {"vo": [], "bites": [], "nat": []}
    FXL = {"leaks": [], "burns": [], "end": 220.5, "fade_out": (218.4, 220.4)}

    # ===== SCENE 1 — CINEMATIC OPENING (0:00–0:17)
    S += [Black(0, 1.2, tr=None),
          Clip(1.2, 2.6, tr=("dissolve", 0.5), src=V("1126_180420"), src_t=4.0, speed=0.8, mode="fill", focus_y=0.42, zoom=1.15),
          Still(3.8, 2.3, src=I("0922_031457"), mode="fill", focus=(0.75, 0.3), move="in"),
          Still(6.1, 2.4, src=I("1126_182216"), mode="fill", focus=(0.5, 0.4), move="in"),
          Still(8.5, 2.5, src=I("1126_130635"), mode="fill", move="out"),
          Card(11.0, 6.0, tr=("burn", 0.9), src=I("1126_130635"), dark=0.30)]
    A["vo"].append(("s1", 1.3)); O += vo_subs("s1", 1.3)
    O.append(Title(11.3, 16.7, lines=["DARI PARIT", "KE TERENGGANU"], sub="Sebuah Dokumentasi Perjalanan",
                   tag="MERENTAS JARAK  ·  MENJALIN UKHUWAH  ·  BERKONGSI PENGALAMAN"))
    FXL["leaks"] += [(0.8, 11.5, 0, 0.30), (10.6, 17.2, 1, 0.45)]
    FXL["burns"] += [11.0]

    # ===== SCENE 2 — THE JOURNEY BEGINS (0:17–0:41)
    S += [MapShot(17.0, 19.0, tr=("burn", 0.9)),
          Still(36.0, 5.5, tr=("zoom", 0.7), src=I("0922_031457"), mode="fill", focus=(0.8, 0.32), zoom=(1.25, 1.45))]
    O.append(Chapter(17.5, 21.8, num="01", title="PERJALANAN BERMULA"))
    A["vo"].append(("s2", 19.2)); O += vo_subs("s2", 19.2)
    O.append(Lower(37.0, 41.0, l1="Bota, Perak  »  Kuala Terengganu", l2=DATE))
    FXL["burns"] += [17.0]

    # ===== SCENE 3 — MOMENTS ALONG THE WAY (0:41–1:03)
    S += [Still(41.5, 3.4, src=I("0922_031502"), mode="frame", pos=0.33),
          Still(44.9, 3.0, tr=("wipe", 0.6), src=I("0922_031512"), mode="frame", pos=0.67),
          Still(47.9, 3.4, tr=("zoom", 0.6), src=I("0922_031526"), mode="frame", pos=0.5),
          Still(51.3, 3.0, tr=("wipe", 0.6), src=I("0922_031522"), mode="frame", pos=0.33),
          Still(54.3, 3.4, src=I("0922_031543"), mode="fill", focus=(0.6, 0.45), move="in"),
          Showcase(57.7, 5.8, tr=("wipe", 0.6), layout="tri",
                   srcs=[I("0922_031535"), I("0922_031518"), I("0922_031514")])]
    O.append(Chapter(41.9, 46.4, num="02", title="BUKAN SEKADAR SEBUAH PERJALANAN"))
    A["vo"].append(("s3", 44.6)); O += vo_subs("s3", 44.6)

    # ===== SCENE 4 — ARRIVAL IN TERENGGANU (1:03–1:22)
    S += [Still(63.5, 6.5, tr=("burn", 0.9), src=I("0922_031540"), mode="fill", move="left", dim=0.35),
          Still(70.0, 4.5, src=I("0922_031654"), mode="fill", focus=(0.5, 0.5), move="in"),
          Still(74.5, 3.8, src=I("0922_031452"), mode="fill", focus=(0.4, 0.5), move="in"),
          Still(78.3, 3.4, tr=("zoom", 0.6), src=I("0922_031828"), mode="fill", move="out")]
    O.append(Location(64.0, 69.8, name="TERENGGANU", sub="Destinasi Pertemuan"))
    O.append(Lower(70.5, 74.4, l1="Ketibaan Delegasi", l2=DATE))
    FXL["burns"] += [63.5]
    FXL["leaks"] += [(63.0, 70.0, 2, 0.30)]

    # ===== SCENE 5 — THE MEETING (1:22–2:31)
    S += [Clip(81.7, 4.6, src=V("0922_032143"), src_t=1.0, speed=0.8, mode="fill", focus_y=0.45),
          Clip(86.3, 6.4, src=V("0922_032159"), src_t=0.8, speed=1.0, mode="frame", pos=0.68),
          Still(92.7, 3.2, src=I("0922_032016"), mode="fill", focus=(0.3, 0.5), move="right"),
          Still(95.9, 3.0, src=I("0922_031946"), mode="fill", move="in"),
          Still(98.9, 4.2, src=I("1126_130222"), mode="fill", focus=(0.55, 0.55), move="in"),
          Still(103.1, 3.6, src=I("1126_130243"), mode="fill", focus=(0.5, 0.6), move="out"),
          Still(106.7, 5.2, src=I("1126_130503"), mode="fill", focus=(0.5, 0.55), move="in"),
          Still(111.9, 3.6, tr=("wipe", 0.7), src=I("1126_175725"), mode="fill", move="right"),
          Clip(115.5, 4.0, src=V("1126_175757"), src_t=4.0, speed=0.8, mode="fill", focus_y=0.55),
          Still(119.5, 3.0, src=MV("1126_180434"), mode="frame", pos=0.36),
          Clip(122.5, 12.0, src=V("1126_180420"), src_t=2.7, speed=1.0, mode="frame", pos=0.68),
          Still(134.5, 3.4, src=I("1126_180509"), mode="fill", focus=(0.32, 0.45), move="in"),
          Still(137.9, 3.0, src=I("1126_181708"), mode="frame", pos=0.4),
          Still(140.9, 3.0, src=I("1126_181825"), mode="fill", move="right"),
          Still(143.9, 3.0, src=I("1126_181254"), mode="fill", focus=(0.4, 0.5), move="in"),
          Still(146.9, 4.6, src=I("1126_182205"), mode="fill", focus=(0.6, 0.45), move="in")]
    O.append(Chapter(82.1, 86.0, num="03", title="PERTEMUAN"))
    O.append(Lower(86.8, 91.6, l1="Sesi Pertemuan", l2=DATE))
    O.append(Sub(86.8, 92.3, text="“Pada tengah hari ini, kita dapat berjumpa…”", quote=True, y=0.88))
    A["bites"].append((V("0922_032159"), 0.8, 6.4, 86.3, 1.0))
    A["vo"].append(("s5", 99.2)); O += vo_subs("s5", 99.2)
    O.append(Chapter(112.9, 116.8, num="04", title="SESI PERKONGSIAN PENGALAMAN"))
    O.append(Lower(123.0, 129.6, l1="YB Ustaz Ismi", s1=50))
    O.append(Sub(122.8, 124.9, text="“Terima kasih kepada…”", quote=True, y=0.88))
    O.append(Sub(129.0, 134.1, text="“…atas pembentangan yang, bagi saya, jelas…”", quote=True, y=0.88))
    A["bites"].append((V("1126_180420"), 2.7, 12.0, 122.5, 1.0))
    O.append(Lower(147.4, 151.0, l1="Penyerahan Cenderamata", l2="YB Ustaz Ismi"))

    # ===== SCENE 6 — UKHUWAH & MEMORIES + SHOWCASE (2:31–3:23)
    S += [Still(151.5, 3.8, tr=("burn", 0.9), src=I("1126_181034"), mode="fill", focus=(0.6, 0.45), move="in"),
          Still(155.3, 4.4, src=I("1126_130650"), mode="frame", pos=0.5, fh=0.78),
          Still(159.7, 3.6, src=I("0922_031523"), mode="frame", pos=0.5),
          Still(163.3, 3.8, src=I("1126_182217"), mode="fill", focus=(0.55, 0.45), move="in"),
          # --- showcase momen menarik
          Showcase(167.1, 6.0, tr=("zoom", 0.6), layout="polaroid",
                   srcs=[I("1126_175331"), I("1126_180350"), I("1126_181036"), I("1126_181702")]),
          Showcase(173.1, 5.0, tr=("wipe", 0.6), layout="tri",
                   srcs=[I("0922_031526"), I("0922_031543"), I("0922_031512")]),
          Showcase(178.1, 6.0, tr=("dissolve", 0.6), layout="grid",
                   srcs=[I("1126_130502"), I("1126_175042"), I("1126_181002"), I("1126_181750"), I("1126_182130"), I("1126_180403")]),
          Showcase(184.1, 5.0, tr=("wipe", 0.6), layout="tri",
                   srcs=[I("1126_181027"), I("1126_180510"), I("1126_182218")]),
          Still(189.1, 4.0, tr=("zoom", 0.6), src=I("1126_130632"), mode="fill", move="out"),
          Showcase(193.1, 5.5, tr=("dissolve", 0.6), layout="grid",
                   srcs=[I("1126_181832"), I("1126_181004"), I("1126_175058"), I("0922_031535"), I("1126_182340"), I("1126_130300")]),
          Clip(198.6, 4.2, src=V("1126_181932"), src_t=2.0, speed=0.8, mode="fill", focus_y=0.5)]
    for w, a, b in [("PERTEMUAN", 151.9, 155.0), ("PERKONGSIAN", 155.6, 158.9),
                    ("PENGALAMAN", 160.0, 163.0), ("UKHUWAH", 163.6, 167.6)]:
        O.append(Words(a, b, word=w))
    O.append(Chapter(167.5, 172.4, num="05", title="DETIK-DETIK BERMAKNA"))
    A["vo"].append(("s6", 156.2)); O += vo_subs("s6", 156.2)
    FXL["burns"] += [151.5]
    FXL["leaks"] += [(151.0, 203.0, 3, 0.20)]

    # ===== SCENE 7 — CINEMATIC ENDING (3:23–3:58)
    D = 18.1
    S += [Clip(184.7 + D, 4.8, src=V("1126_180642"), src_t=0.0, speed=0.8, mode="fill", focus_y=0.42),
          MapShot(189.5 + D, 8.0, tr=("dissolve", 0.9), reverse=True),
          Still(197.5 + D, 10.5, tr=("burn", 0.9), src=I("1126_130635"), mode="fill", move="in", dim=0.45),
          Card(208.0 + D, 12.5, tr=("dissolve", 1.2))]
    A["vo"].append(("s7", 187.5 + D)); O += vo_subs("s7", 187.5 + D)
    O.append(Lower(190.3 + D, 196.0 + D, l1="Perjalanan Pulang", l2="Kuala Terengganu  »  Bota, Perak"))
    O.append(Title(202.4 + D, 207.6 + D, lines=["MERENTAS JARAK", "MENJALIN UKHUWAH", "BERKONGSI PENGALAMAN"], size=118, y=0.47))
    O.append(Credits(208.5 + D, 219.5 + D, logos=logos()))
    FXL["burns"] += [197.5 + D]
    FXL["leaks"] += [(197.0 + D, 208.5 + D, 1, 0.35), (208.0 + D, 219.0 + D, 2, 0.18)]
    T = 220.5 + D
    FXL["end"], FXL["fade_out"] = T, (T - 2.1, T - 0.1)
    return dict(name="main", W=1920, H=1080, shots=S, ovs=O, audio=A, fx=FXL,
                music=dict(total=T, cues=[(0, 0.25), (11.0, 0.6), (17.0, 0.5), (41.5, 0.6), (63.5, 0.7),
                                          (81.7, 0.42), (151.5, 0.85), (167.1, 0.95), (198.6, 0.8), (184.7 + D, 0.7),
                                          (197.5 + D, 1.0), (208.0 + D, 0.45), (219.5 + D, 0.0)],
                           hits=[11.0, 63.5, 151.5, 167.1, 197.5 + D, 202.4 + D]))


# ---------------------------------------------------------------- TEASER 30 s
def teaser():
    S = [Black(0, 0.5, tr=None),
         Still(0.5, 2.4, src=I("0922_031457"), mode="fill", focus=(0.75, 0.3), move="in"),
         Still(2.9, 2.2, src=I("0922_031526"), mode="frame", pos=0.5),
         MapShot(5.1, 5.0, tr=("burn", 0.8)),
         Clip(10.1, 2.4, src=V("1126_180420"), src_t=3.0, speed=0.8, mode="fill", focus_y=0.42, zoom=1.1),
         Still(12.5, 2.0, src=I("1126_182205"), mode="fill", focus=(0.6, 0.45), move="in"),
         Showcase(14.5, 2.2, layout="tri", srcs=[I("0922_031526"), I("1126_181034"), I("1126_182217")]),
         Still(16.7, 2.0, src=I("1126_181034"), mode="fill", focus=(0.6, 0.45), move="in"),
         Card(18.7, 11.3, tr=("burn", 0.9), src=I("1126_130635"), dark=0.3)]
    O = vo_subs("s1", 0.8)
    O += [Words(10.3, 12.3, word="PERTEMUAN"), Words(12.6, 14.4, word="PERKONGSIAN"),
          Words(14.7, 18.6, word="UKHUWAH"),
          Title(19.0, 29.0, lines=["DARI PARIT", "KE TERENGGANU"], sub="Sebuah Dokumentasi Perjalanan",
                tag="MERENTAS JARAK  ·  MENJALIN UKHUWAH  ·  BERKONGSI PENGALAMAN")]
    A = {"vo": [("s1", 0.8)], "bites": [], "nat": []}
    FXL = {"leaks": [(0, 30, 0, 0.25)], "burns": [5.1, 18.7], "end": 30.0, "fade_out": (28.6, 30.0)}
    return dict(name="teaser", W=1920, H=1080, shots=S, ovs=O, audio=A, fx=FXL,
                music=dict(total=30.0, cues=[(0, 0.4), (5.1, 0.7), (10.1, 0.85), (18.7, 1.0), (29.5, 0)],
                           hits=[5.1, 18.7]))


# ---------------------------------------------------------------- REEL 60 s 9:16
def reel():
    S = [Black(0, 0.4, tr=None),
         Still(0.4, 2.8, src=I("0922_031457"), mode="fill", focus=(0.8, 0.4), move="in"),
         MapShot(3.2, 8.0, tr=("burn", 0.8)),
         Still(11.2, 2.4, src=I("0922_031502"), mode="fill", move="in"),
         Still(13.6, 2.4, src=I("0922_031526"), mode="fill", move="in"),
         Still(16.0, 2.4, src=I("0922_031543"), mode="frame", pos=0.5),
         Still(18.4, 3.0, tr=("burn", 0.8), src=I("0922_031540"), mode="fill", move="in", dim=0.35),
         Clip(21.4, 6.4, src=V("0922_032159"), src_t=0.8, speed=1.0, mode="fill"),
         Still(27.8, 3.0, src=I("1126_130503"), mode="frame", pos=0.5),
         Clip(30.8, 8.0, src=V("1126_180420"), src_t=2.7, speed=1.0, mode="fill"),
         Still(38.8, 3.0, src=I("1126_182205"), mode="frame", pos=0.5),
         Still(41.8, 2.6, tr=("burn", 0.8), src=I("1126_181034"), mode="frame", pos=0.5),
         Showcase(44.4, 5.2, layout="grid",
                  srcs=[I("1126_130650"), I("1126_182217"), I("1126_175331"), I("0922_031526"), I("1126_181036"), I("1126_181002")]),
         Clip(49.6, 3.6, src=V("1126_181932"), src_t=2.0, speed=0.8, mode="fill"),
         Card(53.2, 6.8, tr=("dissolve", 0.9))]
    y = 0.80
    O = [Title(0.6, 3.4, lines=["DARI PARIT", "KE TERENGGANU"], size=150, y=0.42, sub="Sebuah Dokumentasi Perjalanan")]
    O += vo_subs("s1", 3.4, y=y)
    O += [Location(18.6, 21.3, name="TERENGGANU", size=170, sub="Destinasi Pertemuan"),
          Sub(21.9, 27.3, text="“Pada tengah hari ini, kita dapat berjumpa…”", quote=True, y=y),
          Lower(22.0, 26.8, l1="Sesi Pertemuan", l2=DATE),
          Lower(31.2, 37.5, l1="YB Ustaz Ismi", s1=52),
          Sub(31.1, 33.2, text="“Terima kasih kepada…”", quote=True, y=y),
          Sub(37.3, 38.8, text="“…atas pembentangan yang, bagi saya…”", quote=True, y=y),
          Lower(39.1, 41.6, l1="Penyerahan Cenderamata", l2="YB Ustaz Ismi"),
          Words(42.0, 44.2, word="PERTEMUAN", size=120, y=0.25), Words(44.6, 46.8, word="PERKONGSIAN", size=120, y=0.25),
          Words(47.2, 49.4, word="UKHUWAH", size=130, y=0.25)]
    O += vo_subs("s6", 41.0, y=y)
    O.append(Credits(53.5, 59.6, logos=logos()))
    A = {"vo": [("s1", 3.4), ("s6", 41.0)], "bites": [(V("0922_032159"), 0.8, 6.4, 21.4, 1.0),
                                                      (V("1126_180420"), 2.7, 8.0, 30.8, 1.0)], "nat": []}
    FXL = {"leaks": [(0, 12, 0, 0.25), (41, 60, 3, 0.2)], "burns": [3.2, 18.4, 41.8], "end": 60.0, "fade_out": (58.8, 60.0)}
    return dict(name="reel", W=1080, H=1920, shots=S, ovs=O, audio=A, fx=FXL,
                music=dict(total=60.0, cues=[(0, 0.5), (3.2, 0.6), (21.4, 0.35), (41.8, 0.9), (53.2, 0.6), (59.6, 0)],
                           hits=[3.2, 18.4, 41.8]))


ALL = {"main": main, "teaser": teaser, "reel": reel}
