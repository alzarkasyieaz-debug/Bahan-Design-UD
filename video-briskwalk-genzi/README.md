# Liputan Briskwalk GenZI 2026 — YB Ustaz Muhammad Ismi Mat Taib (Ahli Parlimen Parit)

**Fail akhir:** `out/briskwalk-genzi-yb-parit.mp4`: 60 s, 1080×1920 (9:16), 30 fps, H.264 + AAC, sekitar −14 LUFS.
Sesuai untuk Facebook Reels, Instagram Reels dan TikTok.

| Perkara | Butiran |
|---|---|
| Program | Briskwalk GenZI (banner: *Briskwalk Masjid Bersama GenZ 2026*) |
| Tarikh | Sabtu, 21 November 2026 |
| Lokasi | Masjid As-Siddiq, Seri Iskandar |
| Peranan YB | Merasmikan & flag off, tajaan hadiah cabutan bertuah |
| Bahan | 18 klip video (360×640) + 37 foto daripada folder Google Drive |

## Pelan suntingan mengikut saat

| Masa | Syot (fail sumber, saat) | Teks skrin | Audio |
|---|---|---|---|
| 0:00–0:02.6 | S01: peserta meluru melepasi gerbang selepas flag off (`1vRLqq…`, 21.8 s, slow-mo 0.85×) | **HOOK:** "PAGI INI, PARIT MELANGKAH BERSAMA!" | Intro muzik + sorakan |
| 0:02.6–0:05.2 | S02: barisan hadapan berjalan di bawah gerbang (`1GxQPu…`, 0 s) | (hook bersambung) | |
| 0:05.2–0:09.2 | S03: wide ratusan peserta di garisan mula (`1CFFO0…`, 0.5 s), dissolve | **BRISKWALK** + pil **GenZI**, cip tarikh & lokasi | Muzik ringan |
| 0:09.2–0:12.8 | S04: pentas flag off, bendera (`1vRLqq…`, 3 s) | **Lower third:** YB Ustaz Muhammad Ismi Mat Taib / Ahli Parlimen Parit | |
| 0:12.8–0:15.8 | S05: kenamaan beramah mesra bersama peserta (`13YdcT…`, 1 s) | — | Groove penuh bermula (12 s) |
| 0:15.8–0:22.0 | S06: senaman memanaskan badan (`1Rxg9w…`, 0.3 s) | — | **Bunyi asal kiraan ditonjolkan**, muzik turun ke 45 % |
| 0:22.0–0:25.2 | S07: barisan kenamaan di rostrum menghadap peserta (`1ErVC0…`, 0.5 s) | Isi 1: **Merasmikan** Briskwalk GenZI 2026 | |
| 0:25.2–0:29.4 | S08: **FLAG OFF**, bendera dikibar (`1vRLqq…`, 17.2 s) | Isi 2: **Flag Off**: melepaskan ratusan peserta | Sorakan asal, muzik 60 % |
| 0:29.4–0:33.4 | S09: kenamaan berjalan seiring peserta (`1GxQPu…`, 3.5 s, slow-mo 0.8×) | — | Muzik penuh |
| 0:33.4–0:36.4 | S10: peserta melambai ke kamera (`1vRLqq…`, 26 s) | — | |
| 0:36.4–0:40.0 | S11: lautan peserta menyusuri laluan (`1vRLqq…`, 40 s) | — | |
| 0:40.0–0:44.8 | S12: foto penyampaian hadiah di pentas (`1Sq2fH….jpg`), zoom perlahan | Isi 3: **Tajaan Hadiah**: cabutan bertuah untuk peserta | |
| 0:44.8–0:48.6 | S13: peserta kembali ke gerbang (`1vRLqq…`, 56 s, slow-mo 0.8×) | — | Riser → klimaks muzik (45 s) |
| 0:48.6–0:53.4 | S14: foto kumpulan di gerbang (`1dhBI2….jpg`), latar kabur + zoom | "Setiap langkah, untuk komuniti yang lebih sihat." | |
| 0:53.4–1:00 | S15: foto kumpulan (`1MRSmB….jpg`) digelapkan & dikaburkan | **YB Ustaz / Muhammad Ismi Mat Taib / Ahli Parlimen Parit / Parit Sejahtera Makmur Bersama** | Kord akhir, fade out |

Gaya: push-in perlahan pada semua klip video, gred warna ringan (kontras +6 %, saturasi +10 %, sedikit hangat, warna kulit kekal semula jadi), palet hijau-emas mengikut gerbang dan banner program. Semua teks berada dalam kawasan selamat telefon (x 90–960, y 260–1480).

## Struktur & cara render semula

```
edit.json          Senarai syot, masa, teks skrin, ducking muzik (ubah di sini)
scripts/build.py   Syot -> xfade -> audio (ambien + muzik) -> overlay -> MP4
scripts/overlay.py Grafik teks (Pillow, font Inter) sebagai jujukan PNG
scripts/muzik.py   Muzik instrumental ceria 120 BPM (disintesis, bebas hak cipta)
public/audio/muzik.wav
```

```bash
pip install numpy scipy pillow
python3 scripts/muzik.py                       # pilihan, muzik.wav sudah disertakan
python3 scripts/build.py /path/ke/folder_bahan  # fail asal Drive (nama = ID fail)
```

## Nota & had

- **Resolusi sumber:** semua klip video hanya 360×640 (dimampatkan, kemungkinan melalui WhatsApp). Klip dinaikkan skala ke 1080×1920 dengan Lanczos dan sedikit penajaman, jadi ketajaman terhad. Jika ada fail asal dari telefon/kamera, render semula untuk kualiti jauh lebih baik.
- **Tiada ucapan YB dalam rakaman.** Transkripsi (Whisper) hanya mengesan bunyi suasana dan suara pengacara/jurulatih yang tidak jelas. Oleh itu tiada petikan ucapan atau sari kata dialog dimasukkan supaya tiada kata-kata yang direka. Jika ada rakaman ucapan, tambah dalam `edit.json` dan isi `text.subs`.
- **Pengenalan individu:** lower third diletakkan pada syot pentas flag off. Sila sahkan dan, jika perlu, alihkan ke syot close-up YB yang paling jelas.
- **Nama program:** banner di lokasi tertulis *Briskwalk Masjid Bersama GenZ 2026*, manakala video menggunakan "Briskwalk GenZI" seperti yang diberikan. Sila sahkan ejaan rasmi.
- Logo rasmi tidak digunakan kerana tidak dibekalkan.
