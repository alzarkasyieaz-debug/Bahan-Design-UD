# UMRAH MOMENT — Panduan Gaya

Gaya filem kenangan umrah sinematik, **2–4 minit** (`duration` 120–240 s dalam `project.config.json`), untuk dikongsi kepada jemaah selepas pulang.
Matlamat emosi: *"Ya Allah… rindunya saat-saat kita bersama di Tanah Suci."*

## Identiti visual

| Elemen | Spesifikasi |
|---|---|
| Format | 1920×1080 (16:9), 30 fps, 120–240 s, H.264 + AAC, cover terbenam |
| Warna | Emas hangat `#E8C27A` / `#B8862F`, ungu tua `#2A1240`, gading `#FFF8E8` |
| Gred warna | Sepia 10%, soft-light emas→ungu (30%), vignette ungu tua, film grain 7% |
| Tajuk | **Cinzel 700**, isian kecerunan emas, extrusion 3D 8 lapis, bayang, sapuan cahaya, masuk huruf demi huruf (kabur→tajam, condong 28°→rata) |
| Subtajuk | **Poppins 300**, gading, jarak huruf 0.10–0.16em |
| Tandatangan | **Great Vibes**, isian emas, ditulis kiri→kanan dengan titik cahaya, garis flourish dilukis, peranan (cth. MUTAWWIF) dalam Cinzel jarak lebar |
| Kapsyen babak | Cinzel 600 emas 3D halus + ornamen garis/berlian, jalur gelap lembut di bawah |
| Kesan | Debu emas terapung, sinaran cahaya (babak 1, 8, 11, 12), light leak di setiap peralihan, light sweep pada tajuk, bingkai emas skrin (babak 4 & 12) |
| Pergerakan | Ken Burns berfokus wajah, dolly in/out perlahan, bingkai foto terapung 2.5D (rotateY), dinding kenangan dengan kedalaman parallax, split-screen, mozek, panorama tilt menegak |
| Peralihan | Dissolve lembut 0.5–0.8 s, tiada glitch/shake/zoom laju |

## Kad penutup (wajib)
Babak terakhir (10 s): latar kabur foto kumpulan + bingkai emas →
**"INGATAN IKHLAS DARIPADA"** (Cinzel emas 3D) → **tandatangan nama** (Great Vibes emas, animasi menulis) →
garis flourish → **peranan** (cth. "MUTAWWIF") → fade ke hitam. Tetapan: `PROJECT.endCard`.

## Struktur cerita — versi 2 minit (12 babak × 10 s)
Versi 4 minit (24 babak) mengikut struktur lagu: verse 1 → perjalanan; pre-chorus → ukhuwah; chorus 1 → Kaabah & ibadah;
verse 2 → bimbingan mutawwif & ziarah; pre-chorus 2 → doa; chorus 2 → dinding kenangan, perpisahan, doa, finale, kad
tandatangan. Contoh lengkap: `src/project.tsx` (group USJ, 240 s).


| # | Masa | Tema | Jenis gambar | Layout |
|---|---|---|---|---|
| 1 | 00:00 | **Cover: tajuk "UMRAH MOMENT"** | Foto kumpulan PALING RAMAI (ruang kosong di atas untuk tajuk) | FullShot zoom-in dari hitam |
| 2 | 00:10 | Perjalanan bermula | Lapangan terbang, pesawat, senyuman | 3 × FullShot pan sisi |
| 3 | 00:20 | Saat pertama di Tanah Suci | Miqat, ihram, senja | FramedShot + FullShot |
| 4 | 00:30 | Detik ibadah | Kaabah, keluarga, anak, membantu jemaah | FullShot ×2 + FramedShot emas + bingkai emas skrin |
| 5 | 00:40 | Senyuman | Wajah tersenyum, kanak-kanak | 2 × CardWall (3 bingkai) |
| 6 | 00:50 | Ukhuwah | Foto kumpulan + 3 potret | FullShot + Tiles split-screen |
| 7 | 01:00 | Indahnya bersama | Makan bersama, ziarah, aktiviti | 2 × Tiles mozek |
| 8 | 01:10 | Ketenangan Tanah Haram | Menara/masjid (tanpa orang) | 2 × TiltShot |
| 9 | 01:20 | Dinding kenangan | 6 potret terbaik | CardWall 6 bingkai, tengah bingkai emas |
| 10 | 01:30 | Perpisahan | Berjalan pulang, pelukan, matahari terbenam | FullShot + FramedShot + TiltShot |
| 11 | 01:40 | Doa & harapan | Jemaah di hadapan Kaabah | FramedShot emas, zoom-out 11 s |
| 12 | 01:50 | Grand finale | Montaj 4 → foto kumpulan penutup | "KENANGAN INDAH BERSAMA" + doa, fade ke hitam |

## Pemilihan gambar
Utamakan **nilai sentimental**: ayah/ibu mendukung anak, warga emas, kanak-kanak bertelekung, membantu jemaah lain
(kerusi roda), pasangan suami isteri, senyuman spontan, foto kumpulan. Elak gambar kabur, gelap, berulang hampir sama,
atau tanpa manusia (kecuali babak 8).

**Peraturan mutlak:** jangan ubah wajah, jangan tambah orang, jangan reka lokasi/peristiwa. Potret tidak dipotong
(guna bingkai). Teks tidak menutup wajah: tajuk di ruang siling/langit, kapsyen di bawah.

## Audio
- Lagu nasyid/balada umrah (pilihan pelanggan) sebagai latar. Pilih `songStart` + `duration` supaya video berakhir pada
  **penghujung chorus** (sebelum bahagian lagu seterusnya), dengan fade-out 3.5 s.
- Jika lagu bervokal: suara latar hanya pada intro instrumental (babak 1). Jika instrumental: guna kesemua 11 ayat VO.
- Suara latar: lelaki matang Bahasa Malaysia (`ms-MY-OsmanNeural`, rate −14%, pitch −7Hz) atau rakaman sebenar.
- Loudness akhir ≈ −14 LUFS; muzik di-duck ~5–6 dB di bawah suara.
