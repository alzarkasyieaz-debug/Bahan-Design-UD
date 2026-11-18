---
name: umrah-moment
description: Hasilkan video kenangan umrah sinematik 2–4 minit gaya "Umrah Moment" (tajuk emas 3D, gred emas/ungu, babak 10 s, cover foto kumpulan, lagu latar, kad tandatangan "Ingatan Ikhlas Daripada") daripada pautan album Google Photos dan lagu. Guna apabila pengguna minta video kenangan umrah/haji/ziarah, "Umrah Moment", atau video jemaah daripada album gambar.
---

# Umrah Moment — aliran kerja

Enjin & template: `umrah-moment/` (Remotion). Panduan gaya: `umrah-moment/STYLE.md` — baca dahulu.
Hanya 3 perkara berubah untuk setiap group: **`src/project.tsx`**, **`project.config.json`**, dan fail lagu.

## Langkah

1. **Persediaan**
   ```bash
   cd umrah-moment && npm install && pip install numpy scipy pillow edge-tts
   ```
   Rangkaian perlu: `photos.app.goo.gl`, `photos.google.com`, `lh3.googleusercontent.com` (album),
   `speech.platform.bing.com` (suara latar). Pelayar: `REMOTION_BROWSER=<chrome-headless-shell>`.

2. **Konfigurasi** — kemas kini `project.config.json`: `group`, `album` (pautan), `song` (letak lagu dalam
   `public/audio/`), `output`, `duration` (120–240 s; gandaan 10). Tetapkan `songStart` kemudian (langkah 5).

3. **Muat turun & lihat gambar** — `npm run album` → `album/NNN.jpg` + lembaran berlabel `album/sheets/sNN.jpg`.
   Baca SEMUA lembaran. Kenal pasti: foto kumpulan paling ramai (cover), Kaabah/ibadah, detik sentimental,
   senyuman, makan/ziarah, seni bina, perpisahan, foto kumpulan penutup. Buat lembaran resolusi lebih tinggi
   untuk calon utama bagi menentukan `focal` (kedudukan wajah, 0..1).

4. **Isi `src/project.tsx`** — ganti ID gambar (`pNNN` = `album/NNN.jpg`) dalam setiap babak mengikut jadual
   STYLE.md (bilangan babak = duration/10, babak akhir = kad tandatangan); kemas kini `PROJECT` (termasuk
   `endCard`: intro, nama, peranan; `finale.at`; `rays`; `captions` mengikut nombor babak) (tajuk kekal `UMRAH MOMENT` melainkan diminta; kapsyen mesti jujur dengan
   gambar — jika tiada gambar Madinah, jangan tulis Madinah). Kemudian `npm run photos` (pilih gambar automatik
   daripada project.tsx) dan `npx tsc --noEmit -p .`.

5. **Audio** — analisis struktur lagu (tenaga band vokal 300–3000 Hz setiap 0.25–2 s) untuk mencari chorus;
   pilih `songStart` dan `duration` supaya video tamat pada penghujung chorus (2 min: 1 chorus; 4 min: 2 chorus). Lagu bervokal → `voScenes: {"1": 3.0}`
   (VO pembukaan dalam intro sahaja). Jalankan `npm run vo` (jika skrip VO berubah) dan `npm run audio`.

6. **Semak visual** — `REMOTION_BROWSER=… node scripts/stills.mjs <frame…>` (cth. 60 280 630 1080 1290 1530 1830
   2130 2580 2850 3060 3330 3530) → `out/stills/`. Sahkan: tiada wajah dipotong/ditutup teks, tiada gambar hampir
   sama berulang, tajuk duduk di ruang kosong.

7. **Eksport** — `REMOTION_BROWSER=… npm run export` (~15 min setiap 2 minit video, jalankan di latar belakang) →
   MP4 1080p30 dengan cover terbenam + `out/cover.jpg`. MP4 tidak di-commit (`out/*.mp4` diabaikan; had GitHub 100 MB). Semak dengan ffprobe & beberapa bingkai, commit,
   push, dan hantar MP4 kepada pengguna.

## Peraturan
- Jangan ubah wajah, tambah orang, atau reka lokasi/tarikh/peristiwa. Nyatakan dengan jujur jika babak brief
  tidak ada gambarnya dan apa penggantinya.
- Logo agensi hanya jika fail logo dibekalkan.
- Jangan dakwa video siap sebelum render berjaya dan disemak.
