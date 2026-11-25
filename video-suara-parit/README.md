# Suara Parit di Dewan Rakyat: video info

Video info gaya dokumentari, **kira-kira 67 saat, 1920×1080 (16:9), 30 fps, H.264 + AAC**. Setiap bingkai dilukis dengan kod (canvas) dan muzik disintesis sepenuhnya, jadi tiada sampel atau muzik berhak cipta.
Satu garis masa (`score.js`) memandu muzik dan gambar, jadi setiap angka, isu dan kotak sorotan muncul tepat pada pukulannya.

| Babak | Masa | Isi | Motion dan bunyi |
|---|---|---|---|
| 1 Pembukaan | 0:00–0:08 | Tajuk dan subtajuk | Motif bintang Islamik dilukis, tajuk muncul dengan timpani, cahaya menyapu tajuk |
| 2 Potret | 0:08–0:14 | YB Ustaz Ismi, nama penuh, jawatan | Potret meluncur masuk, motif berputar, garis emas dilukis |
| 3 Di Dewan Rakyat | 0:14–0:22 | Gambar berucap (RTMKlik) dan di dalam dewan | Zum perlahan (Ken Burns), peralihan silang, brass membawa melodi |
| 4 Angka utama | 0:22–0:27 | 33 rakaman, 9 tajuk Kamar Khas, 4 tahun | Kiraan naik; marimba berbunyi ketika setiap angka mendarat |
| 5 Ucapan mengikut tahun | 0:27–0:32 | Video lawan Kamar Khas, 2023–2026 | Lajur tumbuh; satu nada pizzicato menaik bagi setiap tahun |
| 6 Kamar Khas | 0:32–0:38 | 9 tajuk mengikut tarikh | Garis masa dilukis; "pop" bagi setiap titik |
| 7 Enam isu | 0:38–0:54 | Satu isu bagi setiap bar | Brass stab, timpani dan kilatan pada setiap isu; angka naik; gelang berdenyut |
| 8 Sorotan utama | 0:54–1:02 | Isu sekolah Seri Iskandar | Garis selang 18 bulan; loceng bagi setiap kotak: Cadangan → Jawapan → Tindakan |
| 9 Penutup | 1:02–1:07 | Tajuk, YB, sumber, pautan | Akord F penuh, timpani, potret, pudar ke hitam |

Semua angka dan teks diambil daripada bahan dalam folder rujukan, sama seperti dek slaid dan infografik. Jawapan kementerian tidak dinyatakan dalam bahan, jadi ia ditulis begitu dalam video.

## Bina semula

Keperluan: Node 22+, ffmpeg, Google Chrome/Chromium.

```bash
cd video-suara-parit
node song.js                    # muzik -> out/music.wav
node engine/render.js video     # semua bingkai -> out/video.mp4
node engine/render.js mux       # video akhir -> out/video-suara-parit.mp4
node engine/render.js verify    # semak bunyi dan gambar pada setiap penanda segerak
```

Video akhir: `suara-parit-di-dewan-rakyat.mp4` (26 MB). Gambar dalam `assets/` disalin daripada folder "Gambar YB" (tanda air RTM dikekalkan).
