---
name: qoute-interaktif
description: Hasilkan video nasihat NakSeeHeart 9:16 (60–120 s) dalam style "Qoute Interaktif" — ucapan sebenar penceramah + teks 3D pada latar + motion graphics kontekstual (kad perbandingan, senarai semak, kaunter, rekap bernombor) + subtitle BM + lower third FOLLOW @NakSeeHeart. Guna bila pengguna minta video seterusnya / video nasihat daripada rakaman dalam Google Drive dengan style Qoute Interaktif (atau "seperti video ketiga / Jaga Komunikasi").
---

# Style Qoute Interaktif — aliran kerja

Rujukan penuh: `styles/qoute-interaktif/STYLE.md` (baca dahulu). Contoh lengkap: `styles/qoute-interaktif/examples/jaga-komunikasi/`.
Templat Remotion berasaskan data: `styles/qoute-interaktif/template/` — **jangan tulis kod komposisi baharu**; isi tiga fail data sahaja.

## 1. Dapatkan bahan
- Folder Drive pengguna: `19Hcvk58YYdGSmuTb3MWCBm_X79agr_5s`. Cari fail baharu dengan `mcp__Google_Drive__search_files` (`parentId = '...'`).
- Muat turun video besar terus: `curl -sSL -o <fail> "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t"` (simpan dalam scratchpad, folder tersendiri).
- Video rujukan TikTok disekat oleh rangkaian; minta pengguna simpan dalam Drive jika ada.

## 2. Cipta projek
```bash
bash styles/qoute-interaktif/new_video.sh <slug> <Fail.MOV> "<Tajuk>" <CompositionId>
```
Ia menyalin templat, menjana proxy 1080×1920 + suara bersih, transkripsi Whisper large-v3 (`HF_HUB_DISABLE_XET=1`), senarai jeda (`out/jeda.txt`) dan rangka data.
Jika `node_modules` tiada: `npm install` dalam projek (atau symlink daripada projek lain).

## 3. Analisis & EDL (`src/data/timeline.json`)
- Kenal pasti tema, hook (petikan paling kuat, selalunya ayat ringkasan) dan point bernombor.
- Video > 120 s: pilih klip mengikut urutan asal. Titik potong **pada jeda sebenar** daripada `out/jeda.txt`.
- Sahkan kandungan setiap klip: `python3 -I styles/qoute-interaktif/tools/clipcheck.py out/audio16k.wav '[[a,b],...]'`. Untuk loghat, bandingkan large-v3 dengan medium; **buang bahagian yang tidak dapat disahkan**, jangan reka.
- `segments`: `hook`, `s1..sN` (`src`, `srcEnd`, `out`), `cta` (`rate: 0.15`). `out` bersambung tanpa jurang.
- `beats` wajib: `flashToBody`, `climax[2]`, `finale[2]`, `cta`, `end`, `followPulse`. Tambah beat bernama untuk setiap perkataan penting (out = src + offset klip).

## 4. Subtitle (`src/data/script.json`)
`chunks`: `[klip, mula_src, tamat_src, "teks disemak"]`; `gold`/`upper`: kata kunci; `unsure`: nota bahagian yang dibuang. Kemudian `npm run subs`.

## 5. Storyboard (`src/data/storyboard.json`)
- `layout`: ukur wajah pada satu bingkai bergrid (`ffmpeg ... drawgrid`), laraskan `face`, `ceilingY`, `cardY`, `subtitleY` supaya tiada grafik menutup wajah.
- `elements`: ikut jadual dalam STYLE.md §4. Setiap point = `badge` + `ceiling3d` + satu kad MG. Masa guna rujukan beat (`"p1+0.5"`, `"brollX.1-0.1"`).
- `camera.punch`, `subtitleCalm`, `music.buildUp`, `sfx[]` khusus.
- Cut-out tidak wajib (lalai tiada). Lihat STYLE.md §5.

## 6. Audio, semakan, render
```bash
npm run audio                  # mix -14 LUFS, muzik perlahan (ducking -16 dB)
npx tsc -p .                   # typecheck
npm run still -- <bingkai>     # semak setiap babak (gabung jadi contact sheet & lihat)
npm run render                 # render + mampat < 100 MB -> out/<output>.mp4
```
Semak: tiada pertindihan, subtitle ≤2 baris, kenyaringan, saiz fail.

## 7. Serahan
- Commit projek (tanpa `public/media`, kerana proxy besar) + MP4 akhir ke branch kerja; push.
- Hantar MP4 kepada pengguna (`SendUserFile`). Laporkan secara jujur: durasi, bahagian yang dibuang & sebabnya, perkara yang tidak dapat dibuat (cth. video rujukan), dan bahawa audio disemak melalui ukuran sahaja.
- Tulis `README.md` projek: analisis, EDL dengan timestamp asal, storyboard, keputusan komposit, audio, QC, kapsyen hantaran + hashtag.
