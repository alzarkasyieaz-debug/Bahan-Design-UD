# Di Saat Rakyat Diuji, Keprihatinan Terus Diberi
### Lawatan YB Ustaz Muhammad Ismi Mat Taib ke PPS SK Tanjung Belanja, Parit

Dokumentari kemanusiaan sinematik: **120 saat, 1080×1920 (9:16), 30 fps, H.264 + AAC, Bahasa Malaysia**.
Video siap: `out/lawatan-pps-sk-tanjung-belanja.mp4` · Sari kata SRT: `out/sari-kata-ucapan-yb.srt`

Durasi dipanjangkan dari 60 s kepada **2 minit** atas permintaan, supaya **ucapan penuh YB (≈101 s)** boleh dimuatkan tanpa dipotong
atau diambil di luar konteks. Hanya satu daripada dua ucapan "terima kasih" di hujung rakaman digunakan.

## Video 2 — Hook "Sabar ya" (`out/lawatan-pps-sabar-ya.mp4`)
Versi ini dibuka dengan **momen sebenar** YB bersama seorang ibu di khemah PPS. Dalam rakaman itu (B-roll IMG_3293, 00:05.9–00:09.2,
audio asal kamera), YB berkata *"Baik-baik, jumpa lagi. **Sabar ya.**"* sebelum beredar.
Perkataan sebenar ialah **"Sabar ya"**, bukan "Sabarlah", jadi teks hook memaparkan ayat itu tepat seperti disebut.
Sebutan "sabar, sabar" dalam IMG_3350 tidak digunakan kerana ia gurauan di koridor dan tiada kaitan dengan mangsa.

| Masa | Visual | Teks / audio |
|---|---|---|
| 00:00–00:03.8 | IMG_3293 @05.6 s, kelajuan asal: YB di sisi ibu di khemah | Suara asal: "Baik-baik, jumpa lagi." (sari kata) |
| 00:02.9–00:05.3 | (sambungan) → IMG_3293 @09.4 s slow-mo 60%: YB beredar di celah khemah | ***Sabar ya...*** (tipografi besar emas) + gema lembut pada suara asal, chime |
| 00:05.3–00:08 | IMG_3358 @09.0 s slow-mo 75%: keluarga & kanak-kanak di PPS | **DI SAAT RAKYAT DIUJI, KEPRIHATINAN TERUS DIBERI.** |
| 00:08–02:00 | Sama seperti Video 1, dianjak +1.5 s (ucapan penuh YB → montaj doa → tagline) | Tagline pada 01:50.8 / 01:53.2 / 01:55.6 |

EDL: `src/data/edl-sabar.json` · Komposisi Remotion: `LawatanPPS-Sabar` · Render: `npm run prep -- src/data/edl-sabar.json && python3 scripts/generate_audio.py src/data/edl-sabar.json && npm run render:sabar`

## Prinsip suntingan
- **Audio utama ialah suara asal YB**, berterusan dan tidak disusun semula. B-roll diselitkan secara J-cut/L-cut di atas ucapan yang sama.
- **Tiada kata-kata direka.** Sari kata dijana daripada transkripsi Whisper large-v3 dan masa setiap perkataan digunakan.
  Tipografi besar hanya menggunakan ungkapan yang benar-benar disebut.
  - Perkataan contoh dalam brief ("KESABARAN", "KETABAHAN", "KITA BERSAMA") **tidak disebut** dalam ucapan, jadi tidak dipaparkan.
- Semua visual ialah rakaman sebenar lawatan ini (13 klip B-roll + Video Master). Tiada rakaman air banjir dalam bahan, jadi tiada visual banjir dicipta.
- Muzik **disintesis sepenuhnya oleh skrip** (`scripts/generate_audio.py`): piano sinematik + strings. Tiada sampel berhak cipta, jadi selamat untuk TikTok, Facebook Reels dan Instagram.
- Teks diletakkan dalam zon selamat: tiada teks penting di bawah y=1520 px atau di lajur ikon kanan (x>900 px) pada kawasan bawah.

## Storyboard & timeline

| Masa | Babak | Visual (klip sumber @ timecode) | Teks / grafik | Audio |
|---|---|---|---|---|
| 00:00–00:03.5 | Hook emosi | IMG_3358 @09.0 s, slow-mo 75%: keluarga & kanak-kanak di kantin PPS, petugas berjaket oren | **DI SAAT RAKYAT DIUJI...** (kinetic, blur-in huruf demi huruf) | Piano sayu (A minor) + bunyi suasana sebenar PPS |
| 00:03.5–00:06.5 | | IMG_3293 @00.3 s, slow-mo 75%: khemah mangsa di dewan, ibu duduk di sisi barang | **KEPRIHATINAN TERUS DIBERI.** (emas) + chime | |
| 00:06.5–00:11 | Kehadiran | Video Master @00.9 s, push-in perlahan | Lower third **YB USTAZ MUHAMMAD ISMI MAT TAIB / Ahli Parlimen Parit** | Suara YB bermula; muzik di-duck |
| 00:11–00:13 | | IMG_3392 @00.0 s (distabilkan): YB bersalaman | Lokasi 📍 **PPS SK TANJUNG BELANJA · PARIT** | "…di PPS SK Tanjung Belanja, Parit" |
| 00:13–00:22 | | IMG_3293 @03.0 s: YB berbual dengan keluarga di khemah → IMG_3369 @09.0 s: bersama petugas & kanak-kanak | **35 KELUARGA** → **68 ORANG · LEBIH KURANG** (angka berkira naik) | "…35 keluarga, lebih kurang 68 orang di sini" |
| 00:22–00:36.5 | Ucapan & pesanan | Master (push-in) → IMG_3388 @02.0 s: perbincangan dengan AJK/petugas → Master close-up 1.12–1.22× | **IKUT ARAHAN / PIHAK BERKUASA**, **JAGA KESIHATAN / & KESELAMATAN** | |
| 00:36.5–00:45.5 | | IMG_3356 @00.0 s: YB duduk semeja dengan mangsa → IMG_3357 @00.0 s: YB mendengar | | "…makanan … minuman … itu bersih" |
| 00:45.5–00:58.5 | | Master, punch-in 1.28× pada 00:52 | **ELAKKAN / MERANDUK AIR** | "…kerana kita tak pasti apa yang berada di dalam air…" |
| 00:58.5–01:12 | | IMG_3311 @00.0 s: penyerahan beg bantuan → IMG_3347 @10.7 s: YB melayan warga emas | | "…ikut arahan … bila dah dibenarkan pindah pulang" |
| 01:12–01:25.5 | | Master → IMG_3369 @29.0 s: YB mendengar penduduk | | "…sebelum ataupun selepas banjir" |
| 01:25.5–01:37.5 | | Master, zoom perlahan 1.1→1.3× ke wajah | **SENTIASA / BERJAGA-JAGALAH** | |
| 01:37.5–01:47 | Sentuhan kemanusiaan | Montaj slow-mo 80% + soft glow + light leak: IMG_3293 @09.0 s → IMG_3392 @00.0 s → IMG_3369 @14.0 s | Petikan: *"Sama-samalah kita berdoa kepada Allah Ta'ala"* | Strings berkembang, progresi harapan |
| 01:47–01:48.4 | | Master: "terima kasih" | | |
| 01:48.4–02:00 | Penutup | IMG_3294 @06.6 s, slow-mo 50% (distabilkan): YB terus melangkah di koridor sekolah | 3D emas-putih + sapuan cahaya: **PARIT SEJAHTERA** (01:50) → **MAKMUR BERSAMA** (01:52.6) → *Parit Sejahtera Makmur Bersama* (01:55) → fade-out | Muzik uplifting (C major), chime |

### Ucapan penuh yang digunakan (Video Master 00:00.9 – 01:41.9)
> Assalamualaikum warahmatullahi wabarakatuh. Saya berada di PPS SK Tanjung Belanja, Parit, bersama-sama dengan mangsa banjir.
> Ada 35 keluarga, lebih kurang 68 orang di sini. Jadi pertama sekali saya mengharapkan supaya semua mangsa-mangsa banjir ini ikut
> arahan yang diberikan oleh pihak yang berkenaan, yang oleh pihak berkuasa, dan yang keduanya jaga kesihatan dan keselamatan
> masing-masing. Pastikan makanan yang kita makan dan minuman yang kita minum itu bersih. Juga pastikan kita buat apa juga perkara
> dalam keadaan selamat. Elakkan daripada meranduk air, sama ada kita sendiri ataupun kenderaan, kerana kita tak pasti apa yang
> berada di dalam air sana, lubang dan sebagainya. Juga kalau air dah surut, diharapkan supaya ikut arahan daripada pihak
> berkenaan; bila dah dibenarkan untuk pindah pulang ke rumah, baru kita pindah. Dan apabila kita menyuci rumah juga, pastikan
> keselamatan masing-masing, supaya kita sentiasa berada dalam keadaan selamat, sama ada sebelum ataupun selepas banjir, dan
> begitu juga ketika berlakunya banjir ini. Dan sentiasa berjaga-jagalah kalau-kalau berlakunya banjir kali kedua dan sebagainya
> — mudah-mudahan tidaklah. Sama-samalah kita berdoa kepada Allah Ta'ala, mudah-mudahan kita diselamatkan dan dielakkan daripada
> berlakunya banjir pada masa-masa yang akan datang. Terima kasih.

## Rawatan teknikal
- **Gred warna** (ffmpeg): sedikit muted (saturasi 0.66–0.84), hitam diangkat sedikit (filmic), tona kulit hangat. Hook lebih sejuk & gelap; montaj lebih hangat.
- **Slow motion** guna interpolasi gerakan (`minterpolate` MCI): 75% (hook), 80% (montaj), 50% (penutup).
- **Stabilisasi** `vidstab` pada syot berjalan (IMG_3392, IMG_3294).
- **Video Master** 720p dinaikkan ke 1080×1920 (lanczos + denoise + sharpen ringan).
- **Audio ucapan**: high-pass 85 Hz, denoise FFT, EQ kejelasan suara (+2.5 dB @3.2 kHz), compressor.
  Muzik di-duck automatik (≈-17 dB) sepanjang ucapan. Mix akhir: **-14 LUFS, true peak -1.5 dB**.
- **Grafik** (Remotion/React): kinetic typography, lower third, tag lokasi, sari kata animasi dengan penekanan warna emas pada kata kunci yang disebut,
  push-in/punch-in, cross dissolve + motion blur ringan, vignette, film grain minimum, light leak dan soft glow (hanya hook, montaj dan penutup).

## Struktur projek
```
raw/                     bahan asal dari Google Drive (tidak di-commit; muat turun semula)
scripts/prep_clips.py    potong, gred, stabilisasi, slow-mo -> public/clips/ ; bersihkan audio -> public/audio/
scripts/generate_audio.py  muzik asal + mixing akhir -> public/audio/mix.wav
src/data/edl.json        senarai suntingan (EDL): setiap klip, timecode sumber, kelajuan, kedudukan
src/data/transcript.json transkripsi ucapan (Whisper large-v3, cap masa setiap perkataan)
src/data/timeline.ts     sari kata, kata kunci & masa grafik (terikat pada cap masa perkataan sebenar)
src/Video.tsx            komposisi utama ; src/components/  tipografi, tagline 3D, rupa sinematik
```

## Render semula
```bash
cd video-lawatan-pps-parit
npm install && pip install numpy scipy
# letak fail asal dalam raw/ : master.mp4 (Video Master) dan IMG_*.MOV (B-roll)
npm run prep      # klip + audio ucapan
npm run audio     # muzik + mix (public/audio/mix-<output>.wav)
npm run render    # -> out/lawatan-pps-sk-tanjung-belanja.mp4
```
Jika Chrome tidak dapat dimuat turun, tetapkan `REMOTION_BROWSER=/path/ke/chrome-headless-shell`.

## Langkah alternatif dalam CapCut
1. Projek baharu 9:16, 30 fps. Import Video Master + B-roll mengikut jadual di atas.
2. Letak Video Master pada 00:06.5 (mula dari 00:00.9). Inilah trek audio utama. Jangan potong audionya.
3. Letak B-roll pada trek atas (overlay) mengikut masa jadual. Matikan audio B-roll, kecuali hook (volume 15%).
4. Slow-mo: Speed → Normal 0.75× / 0.8× / 0.5× dan aktifkan *Smooth slow-mo*. Stabilize pada IMG_3392 & IMG_3294.
5. Adjust: Saturation −20, Temperature +8, Highlights −10, Fade +8, Vignette 20.
6. Captions → Import `out/sari-kata-ucapan-yb.srt`. Warnakan kata kunci emas (#F2C56B).
7. Teks hook & tagline: fon Playfair Display / Cinzel, animasi *Blur in* / *Fade up*. Tagline emas-putih dengan Glow 20%.
8. Muzik: `public/audio/muzik.wav` (asal), Auto-ducking pada trek ucapan. Export 1080p, 30 fps.
