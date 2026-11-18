# UMRAH MOMENT

**Gaya & template filem kenangan umrah sinematik**: 120 s, 1920×1080 (16:9), 30 fps, H.264 + AAC, dibina dengan
[Remotion](https://www.remotion.dev/). Panduan gaya: [`STYLE.md`](STYLE.md). Aliran kerja untuk Claude:
[`.claude/skills/umrah-moment/SKILL.md`](../.claude/skills/umrah-moment/SKILL.md).

**Projek semasa:** group USJ 30 Sept – 9 Okt 2026 · fail akhir `out/umrah-moment.mp4` (≈97 MB, cover terbenam) · cover `out/cover.jpg`

## Guna semula untuk group baharu

| Fail | Apa diubah |
|---|---|
| `project.config.json` | Nama group, pautan album, fail lagu, `songStart`, suara latar, nama fail output |
| `src/project.tsx` | Tajuk/kapsyen (`PROJECT`) dan ID gambar + titik fokus wajah bagi setiap babak |
| `public/audio/<lagu>.mp3` | Lagu latar |

```bash
npm install && pip install numpy scipy pillow edge-tts
npm run album          # muat turun album -> album/NNN.jpg + lembaran pilihan album/sheets/
# … pilih gambar & isi src/project.tsx …
npm run photos         # sediakan gambar yang dirujuk dalam project.tsx
npm run vo             # (pilihan) suara latar daripada scripts/vo_script.json
npm run audio          # mix lagu + suara -> public/audio/mix.wav
npm run studio         # pratonton
REMOTION_BROWSER=/path/ke/chrome-headless-shell npm run export   # render + cover + mampat + cover terbenam
```

Enjin gaya (tidak perlu diubah): `src/Video.tsx`, `src/components/core.tsx`, `src/components/Typography.tsx`.

## Storyboard (12 babak × 10 s)

| Babak | Masa | Teks pada skrin | Gambar (no. dalam album) | Gerakan / kesan |
|---|---|---|---|---|
| 1 | 00:00–00:10 | **UMRAH MOMENT** / Kenangan Indah Bersama di Tanah Suci | 080 (cover: foto kumpulan seluruh jemaah di KLIA) | Dari skrin hitam, slow zoom-in, sinaran cahaya emas, debu emas, tajuk 3D huruf demi huruf + light sweep |
| 2 | 00:10–00:20 | Kita datang dengan kisah berbeza… | 022, 052 (KLIA), 092 (pesawat) | Pan sisi sinematik, dissolve |
| 3 | 00:20–00:30 | Menjadi tetamu Allah… satu anugerah. | 113 (suami isteri di bawah langit senja), 252 & 247 (miqat, ihram, matahari terbenam) | Push-in, bingkai terapung 2.5D |
| 4 | 00:30–00:40 | Setiap doa… membawa seribu harapan. | 280 (keluarga di hadapan Kaabah), 270 (ayah mendukung anak), 274 (anak minum zamzam), 290 (menolak kerusi roda) | Bingkai emas skrin, dolly in/out, bingkai foto emas |
| 5 | 00:40–00:50 | Senyuman ini… akan terus dirindui. | 250, 088, 130 → 189, 019, 279 | Kolaj bingkai terapung, kedalaman parallax |
| 6 | 00:50–01:00 | Dari tidak mengenali… menjadi satu keluarga. | 259 (jemaah lelaki berihram di hadapan Kaabah), 211, 185, 132 | Zoom-out kumpulan, split-screen 3 panel |
| 7 | 01:00–01:10 | Gelak tawa, cerita dan kenangan… | 223, 149, 155 → 226, 227, 147 | Mozek: makan bersama, unta, pasar buah, kereta kabel |
| 8 | 01:10–01:20 | Makkah… kota yang sentiasa dirindui. | 294, 296 (menara Masjidil Haram) | Panorama tilt-up perlahan, cahaya senja |
| 9 | 01:20–01:30 | Setiap gambar menyimpan sebuah cerita. | 285, 299, 263, 265, 244, 282 | Dinding kenangan 6 bingkai, depth parallax, partikel emas |
| 10 | 01:30–01:40 | Berat untuk berpisah… | 286, 276, 254 (matahari terbenam) | Kamera diperlahankan, muzik lebih sentimental |
| 11 | 01:40–01:50 | Semoga Allah menerima segala amalan kita. | 269 (jemaah di hadapan Kaabah) | Slow zoom-out, bingkai emas, sinaran cahaya, grain filem |
| 12 | 01:50–02:00 | **KENANGAN INDAH BERSAMA** / Berpisah di dunia… semoga bertemu lagi di Tanah Suci. / *Semoga Allah mempertemukan kita kembali. Aamiin.* | Montaj 258, 255, 275, 261 → 231 (foto kumpulan berbendera Darul Mubarak di Makkah) | Bingkai emas, tajuk 3D, fade-out ke hitam |

### Perbezaan daripada brief (sebab: hanya menggunakan apa yang ada dalam gambar)
- **Babak 8 (Madinah):** 300 item album yang dapat dimuat turun (30 Sept–2 Okt) tidak mengandungi gambar Madinah/Masjid Nabawi.
  Babak ini diganti dengan **menara Masjidil Haram ketika senja**, dan teks/VO ditukar kepada *"Makkah… kota yang sentiasa dirindui"* /
  *"Dan di Tanah Haram, hati seakan menemukan ketenangan…"*. Jika gambar Madinah ditambah, tukar `p294`/`p296` dalam `src/Video.tsx`
  dan pulihkan teks asal.
- **Pemilihan gambar:** diutamakan detik yang mempunyai nilai sentimental: ayah mendukung anak di hadapan Kaabah,
  anak kecil minum zamzam, jemaah menolak kerusi roda, pasangan warga emas, kanak-kanak bertelekung tersenyum, foto kumpulan.
- **Babak 10 (perpisahan):** tiada gambar hari terakhir/lapangan terbang pulang dalam item yang dimuat turun. Digunakan gambar jemaah
  berjalan di koridor Masjidil Haram, ayah mendukung anak tidur, dan matahari terbenam.
- **Logo Darul Mubarak:** tidak dibekalkan sebagai fail, jadi tidak diletakkan (logo hanya kelihatan secara semula jadi pada beg jemaah).

## Audio

- **Lagu latar:** *Kita Pernah Bersama* (udcreative), fail `public/audio/kita-pernah-bersama.mp3`.
  Segmen **5.5 s → 125.5 s** daripada lagu (7:31) digunakan:

  | Video | Lagu |
  |---|---|
  | 00:00–00:08 | Intro piano (tajuk pembukaan + suara latar) |
  | 00:08–00:50 | Verse 1: *"Hari ini tiba-tiba ku terkenang… Menuju Kaabah penuh air mata…"* |
  | 00:50–01:15 | Pre-chorus: *"…Bukan sekadar jemaah dan mutawif, kalian saudara yang amat ku kasih"* (babak ukhuwah) |
  | 01:16–01:57 | Chorus: *"Andai rindu ini mampu berbicara… Satukan kami di syurga-Mu"* (babak 8–12, kemuncak emosi) |
  | 01:57–02:00 | Fade-out lembut |

  Sempadan bahagian lagu dianggar melalui analisis tenaga audio. Laraskan `songStart` dalam `project.config.json` jika perlu.
- **Suara latar:** kerana lagu mempunyai vokal, hanya ayat pembukaan *"Ada perjalanan yang berakhir… namun kenangannya
  tidak pernah pergi."* dikekalkan (00:03–00:07.5, dalam intro instrumental). Lagu di-*duck* ~5 dB semasa suara itu.
  Suara lelaki neural Bahasa Malaysia `ms-MY-OsmanNeural`. Skrip penuh 11 babak masih ada dalam `scripts/vo_script.json`
  dan klip `public/audio/vo/` jika mahu digunakan dengan muzik instrumental.
- **Sandaran:** jika fail lagu dibuang, `npm run audio` menjana muzik asli secara sintesis (piano, strings, ney, frame drum)
  dan menggunakan kesemua 11 klip suara latar dengan ducking automatik.
- Loudness akhir ≈ −14.4 LUFS.

## Struktur

```
src/project.tsx            KANDUNGAN group: tajuk, kapsyen, gambar setiap babak
src/Video.tsx              Enjin: lapisan kesan, teks, gred, audio
src/components/core.tsx    Ken Burns berfokus wajah, bingkai terapung 2.5D, kolaj, split/mozek, tilt panorama,
                           debu emas, sinaran cahaya, light leak, light sweep, gred warna emas/ungu, grain filem, bingkai emas
src/components/Typography  Tajuk emas 3D (extrusion + sapuan cahaya), subtajuk Poppins, kapsyen Cinzel
scripts/                   fetch_album.py, prepare_photos.py, generate_vo.py, generate_audio.py, stills.mjs, export.sh
```

Fon: Cinzel (tajuk, pengganti percuma Trajan Pro) & Poppins (subtajuk), SIL Open Font License.
