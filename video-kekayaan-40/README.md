# Selepas Umur 40 Tahun, Kekayaan Sebenar Adalah…

Video motivasi sinematik, **120 saat, 1080×1920 (9:16), 30 fps, H.264 + AAC**, dibina dengan [Remotion](https://www.remotion.dev/) (React).
Inspirasi utama: infografik `public/img/keluarga-infografik.jpg`. Kesemua 8 nilai kehidupan dikekalkan.

| Babak | Masa | Tema | Visual & animasi utama |
|---|---|---|---|
| 1 | 00:00–00:10 | Hook emosi | Lelaki di tingkap ketika matahari terbit, jam berdetik, **rack focus** dari gambar keluarga ke lelaki, dolly-in, partikel debu |
| 2 | 00:10–00:20 | 01 Kesihatan | Berjalan perlahan di taman (slow motion), berhenti menarik nafas, degupan cahaya, lens flare, daun gugur |
| 3 | 00:20–00:30 | 02 Hati tenang | Beranda, hujan renyai, menghirup kopi, wap, titisan dari cucur atap |
| 4 | 00:30–00:40 | 03 Rezeki berkat | Sarapan keluarga, doa makan, tangan menghulurkan mangkuk, orbit kamera |
| 5 | 00:40–00:50 | 04 Keluarga | Foto keluarga asal: rack focus, dolly-in, bloom sinematik, bokeh |
| 6 | 00:50–01:00 | 05 Anak-anak | Anak berlari di halaman (backlit golden), ayah berlutut & memeluk |
| 7 | 01:00–01:10 | 06 Sahabat | Dua sahabat bersalaman → berbual sambil minum kopi, film grain nostalgia |
| 8 | 01:10–01:20 | 07 Bebas hutang | Buku kewangan ditutup, partikel beban (RM, %) larut menjadi cahaya, rack focus ke keluarga |
| 9 | 01:20–01:30 | 08 Dekat dengan Allah | Berzikir & berdoa di sejadah, cahaya Subuh, corak geometri Islamik, kamera naik perlahan |
| 10 | 01:30–01:40 | Muhasabah | Montaj kenangan (memory dissolve) → lelaki merenung di cermin |
| 11 | 01:40–01:50 | Kesyukuran | Tangan saling menggenggam, pull-back golden hour, partikel memuncak |
| 12 | 01:50–02:00 | Penutup | Doa → keluarga berjalan ke arah matahari senja, teks penutup, fade to black |

Warna bergerak secara beransur dari **biru lembut → keemasan hangat** (`warmthOf()` dalam `src/components/core.tsx`).

## Struktur projek

```
src/
  data/script.ts         Skrip VO penuh, chunk subtitle, kata kunci, pemasaan
  data/vo-manifest.json  Dijana oleh `npm run vo:scan` (jangan sunting manual)
  Video.tsx              Komposisi utama: 12 babak, cross-dissolve, lapisan audio, ducking
  components/core.tsx    Kamera parallax 2.5D, light rays, bokeh, partikel, grain, vignette, gred warna
  components/Figure.tsx  Kit siluet parametrik (berdiri, berjalan, duduk, berdoa, tudung, kopiah, kanak-kanak)
  components/Typography  Tajuk kinetik, lencana nombor, subtitle 2 baris dengan kata kunci emas
  scenes/Scene01–12.tsx  Satu fail bagi setiap babak
scripts/
  generate_audio.py      Penjana muzik piano + strings dan bunyi ambien (disintesis, bebas hak cipta)
  scan-vo.mjs            Mengesan fail suara latar
public/
  audio/muzik.wav, ambien.wav, vo/   img/   fonts/
```

## Langkah render (MP4 H.264, 1080×1920, 30 fps, 120 s)

```bash
cd video-kekayaan-40
npm install
python3 -m pip install numpy scipy      # sekali sahaja
npm run audio                           # jana semula muzik & ambien (pilihan — fail sudah disertakan)
npm run studio                          # pratonton di pelayar (http://localhost:3000)
npm run render                          # -> out/kekayaan-sebenar-40.mp4
```

`npm run render` menjalankan:

```
remotion render KekayaanSebenar out/kekayaan-sebenar-40.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac
```

Tetapan komposisi (1080×1920, 30 fps, 3600 frame = 120 s) ditetapkan dalam `src/Root.tsx`.
Jika persekitaran anda tiada akses internet untuk memuat turun Chrome Headless Shell, tetapkan
pelayar sedia ada: `REMOTION_BROWSER=/path/ke/chrome npm run render`.

## Suara latar (voice-over)

Persekitaran ini tiada enjin TTS Bahasa Malaysia yang berkualiti, jadi **video yang dirender belum mengandungi suara latar**.
Ia mengandungi muzik, bunyi ambien dan subtitle penuh yang dipasang mengikut skrip. Untuk menambah suara:

1. Rakam 12 klip (satu bagi setiap babak) oleh suara lelaki 40–50 tahun: matang, ikhlas, sedikit serak dan lembut.
   Ikut skrip dalam `src/data/script.ts` (medan `vo`) **tepat seperti ditulis**. Berhenti sejenak pada `…` (±0.7 s) dan selepas
   ayat penting (±0.45 s). Setiap klip mesti **≤ 8.8 s** (suara bermula pada 0.6 s setiap babak dan tamat sebelum 9.4 s).
2. Simpan sebagai `public/audio/vo/babak-01.wav` … `babak-12.wav` (`.mp3`, `.m4a` juga diterima).
3. (Pilihan) Untuk subtitle yang tepat dengan rakaman, cipta `public/audio/vo/timing.json`:
   ```json
   { "1": [[0.6, 2.7], [3.2, 5.5], [5.5, 7.4], [7.5, 9.2]], "2": [[0.6, 2.4], [2.8, 5.1], [5.2, 8.8]] }
   ```
   Setiap pasangan = `[mula, tamat]` (saat dari permulaan babak) bagi setiap chunk subtitle, mengikut susunan dalam `chunks`.
   Nilai ialah masa dalam babak (bukan dalam klip), jadi tambah 0.6 s kepada masa dalam rakaman anda.
4. Jalankan `npm run render` sekali lagi. `vo:scan` akan mengesan fail dan **ducking muzik automatik**
   (muzik turun ±60 % semasa suara berbunyi) akan aktif.

## Aset & hak cipta

- **Muzik & bunyi**: disintesis 100 % secara prosedur oleh `scripts/generate_audio.py` (tiada sampel luar).
- **Fon**: Bebas Neue, Inter, Playfair Display — SIL Open Font License (melalui pakej `@fontsource`).
- **Imej**: infografik keluarga yang dibekalkan oleh pemilik projek; ilustrasi lain dilukis dengan SVG dalam kod.
- Tiada penggambaran zat Allah; babak ibadah hanya menggunakan cahaya semula jadi dan siluet.
