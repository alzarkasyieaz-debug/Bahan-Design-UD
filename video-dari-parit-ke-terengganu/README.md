# DARI PARIT KE TERENGGANU

*Merentas Jarak, Menjalin Ukhuwah, Berkongsi Pengalaman*

Dokumentari travelog sinematik — Program Lawatan dan Pertemuan **Persatuan Halaqat Muqarrabin** dan
**Jabatan Pilihanraya PAS Parit** ke Terengganu (26 November 2026).

## Output (`out/`)

| Fail | Format |
|---|---|
| `dari-parit-ke-terengganu_dokumentari_16x9_1080p.mp4` | Dokumentari penuh 3:59, 1920×1080, 24 fps, H.264/AAC |
| `dari-parit-ke-terengganu_teaser30s_16x9.mp4` | Teaser 30 s media sosial, 16:9 |
| `dari-parit-ke-terengganu_highlight60s_9x16.mp4` | Highlight 60 s, 1080×1920 (TikTok / Reels / FB Reels) |
| `*.srt` | Subtitle Bahasa Malaysia, diselaraskan dengan VO & petikan ucapan |

Subtitle juga sudah “dibakar” (burned-in) dalam video — fail SRT untuk dimuat naik sebagai kapsyen berasingan
(YouTube/Facebook) atau untuk terjemahan.

## Dokumen (`docs/`)

1. `01_storyboard.md` — storyboard 7 scene berdasarkan bahan sebenar + kronologi EXIF
2. `02_skrip_voice_over.md` — skrip VO lengkap + petikan ucapan sebenar
3. `03_pemilihan_bahan.md` — senarai gambar/video setiap scene, momen YB Ustaz Ismi
4. `04_muzik_dan_sfx.md` — skor, ducking, cadangan muzik berlesen & SFX
5. `timeline_main.md`, `timeline_teaser.md`, `timeline_reel.md` — timeline suntingan setiap saat (dijana automatik)

## Projek suntingan (Python + FFmpeg)

```
scripts/
  fetch.py        muat turun bahan asal dari Google Drive (assets/manifest.tsv)
  vo.py           voice-over Melayu (MMS-TTS + penukaran suara lelaki) -> build/vo/
  audio.py        skor muzik asli + bunyi suasana + ucapan sebenar + ducking -> build/audio/
  engine.py       gred warna, font, pembaca video, grain/vignette/light leak
  shots.py        Ken Burns, kad parallax, klip video, kad grafik
  mapshot.py      peta animasi Bota, Perak -> Kuala Terengganu (Natural Earth)
  overlays.py     tajuk, bab, lower third, subtitle, teks tema, kredit
  timelines.py    timeline lengkap: main / teaser / reel   <- sunting di sini
  render.py       pemapar selari + mux
  export_docs.py  jana SRT & jadual timeline
```

### Render

```bash
pip install numpy scipy pillow soundfile librosa pyworld "setuptools<70" torch transformers faster-whisper
python3 scripts/fetch.py                 # ~1.2 GB bahan asal ke build/raw/
python3 scripts/vo.py                    # voice-over
python3 scripts/audio.py main teaser reel
python3 scripts/render.py main           # ±40 min pada 4 teras
python3 scripts/render.py teaser
python3 scripts/render.py reel
python3 scripts/export_docs.py
# semak satu bingkai:  python3 scripts/render.py still main 127.0
```

### Mengubah suai

- **Nama/jawatan lower third**: `timelines.py` → `Lower(..., l1="Nama", l2="Jawatan")`.
- **Logo**: letak PNG lutsinar dalam `assets/logo/` — dipaparkan automatik pada kad kredit.
- **Narator manusia**: ganti `build/vo/s*.wav` (lihat `docs/02_skrip_voice_over.md`).
- **Muzik berlesen**: lihat `docs/04_muzik_dan_sfx.md`.

## Keaslian & had

- Semua visual ialah bahan sebenar program; wajah tidak diubah; tiada individu/aktiviti direka.
- Tiada rakaman persiapan, lebuh raya, persinggahan, jamuan atau perjalanan pulang dalam bahan —
  bahagian itu disampaikan melalui **peta animasi** (laluan = ilustrasi arah, bukan jejak GPS) dan foto ketibaan sebenar.
- Fail `*_20260922_*` dari telefon kedua mempunyai jam tidak tepat; disusun sebagai sesi pagi 26.11.2026.
- Nama yang dipaparkan hanya **YB Ustaz Ismi** (disahkan pemilik bahan). Lokasi tepat bangunan pertemuan tidak dinyatakan kerana tidak disahkan.
- Voice-over ialah suara sintetik (Meta MMS-TTS, CC-BY-NC 4.0 — sesuai untuk dokumentasi bukan komersial);
  disyorkan rakaman narator manusia untuk siaran rasmi.
- Peta: Natural Earth (domain awam). Font: Bebas Neue, Inter, Playfair Display (SIL OFL).
