# Sebuah Rindu… Kenangan Indah di Tanah Suci

Filem kenangan umrah sinematik: **120 s, 1920×1080 (16:9), 30 fps, H.264 + AAC**, dibina dengan [Remotion](https://www.remotion.dev/) (React).
Fail akhir: `out/sebuah-rindu-kenangan-umrah.mp4`

Semua visual ialah **foto asal jemaah** daripada album Google Photos *"USJ 30 Sept-9 Okt"*. 44 gambar dipilih (lihat jadual).
Tiada wajah, individu, pakaian atau peristiwa diubah. Gambar potret dipaparkan penuh dalam bingkai terapung di atas versi kabur
gambar yang sama, jadi tiada kepala atau wajah dipotong. Gambar landskap dipotong mengikut titik fokus wajah (`focal`).

## Storyboard (12 babak × 10 s)

| Babak | Masa | Teks pada skrin | Gambar (no. dalam album) | Gerakan / kesan |
|---|---|---|---|---|
| 1 | 00:00–00:10 | **SEBUAH RINDU…** / Kenangan Indah Bersama di Tanah Suci | 280 (Kaabah) | Dari skrin hitam, slow zoom-in, sinaran cahaya emas, debu emas, tajuk 3D huruf demi huruf + light sweep |
| 2 | 00:10–00:20 | Kita datang dengan kisah berbeza… | 022, 052 (KLIA), 092 (pesawat) | Pan sisi sinematik, dissolve |
| 3 | 00:20–00:30 | Menjadi tetamu Allah… satu anugerah. | 094 (Masjid Ar-Rahmah, Jeddah), 252 & 247 (miqat, ihram, matahari terbenam) | Push-in, bingkai terapung 2.5D |
| 4 | 00:30–00:40 | Setiap doa… membawa seribu harapan. | 259, 261, 270, 290 (Masjidil Haram) | Bingkai emas skrin, dolly in/out, bingkai foto emas |
| 5 | 00:40–00:50 | Senyuman ini… akan terus dirindui. | 218, 172, 130 → 189, 176, 279 | Kolaj bingkai terapung, kedalaman parallax |
| 6 | 00:50–01:00 | Dari tidak mengenali… menjadi satu keluarga. | 231 (foto kumpulan berbendera), 211, 185, 132 | Zoom-out kumpulan, split-screen 3 panel |
| 7 | 01:00–01:10 | Gelak tawa, cerita dan kenangan… | 223, 149, 155 → 226, 227, 147 | Mozek: makan bersama, unta, pasar buah, kereta kabel |
| 8 | 01:10–01:20 | Makkah… kota yang sentiasa dirindui. | 294, 296 (menara Masjidil Haram) | Panorama tilt-up perlahan, cahaya senja |
| 9 | 01:20–01:30 | Setiap gambar menyimpan sebuah cerita. | 285, 277, 263, 265, 241, 282 | Dinding kenangan 6 bingkai, depth parallax, partikel emas |
| 10 | 01:30–01:40 | Berat untuk berpisah… | 286, 276, 254 (matahari terbenam) | Kamera diperlahankan, muzik lebih sentimental |
| 11 | 01:40–01:50 | Semoga Allah menerima segala amalan kita. | 269 (jemaah di hadapan Kaabah) | Slow zoom-out, bingkai emas, sinaran cahaya, grain filem |
| 12 | 01:50–02:00 | **KENANGAN INDAH BERSAMA** / Berpisah di dunia… semoga bertemu lagi di Tanah Suci. / *Semoga Allah mempertemukan kita kembali. Aamiin.* | Montaj 258, 091, 173, 262 → 080 (foto kumpulan penuh di KLIA) | Bingkai emas, tajuk 3D, fade-out ke hitam |

### Perbezaan daripada brief (sebab: hanya menggunakan apa yang ada dalam gambar)
- **Babak 8 (Madinah):** 300 item album yang dapat dimuat turun (30 Sept–2 Okt) tidak mengandungi gambar Madinah/Masjid Nabawi.
  Babak ini diganti dengan **menara Masjidil Haram ketika senja**, dan teks/VO ditukar kepada *"Makkah… kota yang sentiasa dirindui"* /
  *"Dan di Tanah Haram, hati seakan menemukan ketenangan…"*. Jika gambar Madinah ditambah, tukar `p294`/`p296` dalam `src/Video.tsx`
  dan pulihkan teks asal.
- **Babak 10 (perpisahan):** tiada gambar hari terakhir/lapangan terbang pulang dalam item yang dimuat turun. Digunakan gambar jemaah
  berjalan di koridor Masjidil Haram, ayah mendukung anak tidur, dan matahari terbenam.
- **Logo Darul Mubarak:** tidak dibekalkan sebagai fail, jadi tidak diletakkan (logo hanya kelihatan secara semula jadi pada beg jemaah).

## Audio

- **Suara latar:** Bahasa Malaysia, suara lelaki neural `ms-MY-OsmanNeural` (edge-tts), tempo diperlahankan dan nada direndahkan,
  EQ hangat + kompresor. Skrip: `scripts/vo_script.json`. Klip: `public/audio/vo/babak-01.wav` … `babak-11.wav`.
  Babak 12 sengaja tanpa suara supaya muzik mencapai kemuncak.
- **Muzik:** disintesis 100% secara prosedur oleh `scripts/generate_audio.py` (bebas royalti): piano emosi, orchestral strings,
  pad atmosfera, dron + seruling ney (suasana Timur Tengah halus), perkusi frame drum lembut di 01:20–01:54, chime pada tajuk,
  penutup piano fade-out. Struktur dinamik mengikut brief (lembut → hangat → ceria → emosional → kemuncak).
- **Mixing:** muzik di-*duck* automatik (~6 dB) semasa suara; suara 13–18 dB di atas muzik. Loudness akhir ≈ −15 LUFS.

### Menggantikan suara AI dengan rakaman sebenar
Rakam 11 klip mengikut `scripts/vo_script.json` (setiap klip ≤ 8 s), simpan sebagai `public/audio/vo/babak-NN.wav`
(44.1 kHz), kemudian `npm run audio && npm run render`. Masa mula setiap klip: `VO_OFFSET` dalam `scripts/generate_audio.py`.

## Langkah render

```bash
cd video-kenangan-umrah
npm install
pip install numpy scipy pillow edge-tts          # sekali sahaja
python3 scripts/prepare_photos.py <folder-foto>  # pilihan: jana semula public/img daripada foto asal (000.jpg … 299.jpg)
npm run vo                                       # pilihan: jana semula suara latar
npm run audio                                    # jana muzik + mix.wav
npm run studio                                   # pratonton
REMOTION_BROWSER=/path/ke/chrome-headless-shell npm run render   # -> out/sebuah-rindu-kenangan-umrah.mp4
```

## Struktur

```
src/Video.tsx              Susunan 12 babak, teks, kesan, audio
src/components/core.tsx    Ken Burns berfokus wajah, bingkai terapung 2.5D, kolaj, split/mozek, tilt panorama,
                           debu emas, sinaran cahaya, light leak, light sweep, gred warna emas/ungu, grain filem, bingkai emas
src/components/Typography  Tajuk emas 3D (extrusion + sapuan cahaya), subtajuk Poppins, kapsyen Cinzel
scripts/                   prepare_photos.py, generate_vo.py, generate_audio.py, stills.mjs (pratonton bingkai)
```

Fon: Cinzel (tajuk, pengganti percuma Trajan Pro) & Poppins (subtajuk), SIL Open Font License.
