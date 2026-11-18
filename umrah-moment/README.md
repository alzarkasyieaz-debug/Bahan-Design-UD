# UMRAH MOMENT

**Gaya & template filem kenangan umrah sinematik**: 2–4 minit, 1920×1080 (16:9), 30 fps, H.264 + AAC, dibina dengan
[Remotion](https://www.remotion.dev/). Panduan gaya: [`STYLE.md`](STYLE.md). Aliran kerja untuk Claude:
[`.claude/skills/umrah-moment/SKILL.md`](../.claude/skills/umrah-moment/SKILL.md).

## Projek

| Slug | Group | Durasi | Output |
|---|---|---|---|
| `usj-okt-2026` | USJ 30 Sept – 9 Okt 2026 | 4:00 (24 babak, 73 gambar) | `out/usj-okt-2026.mp4` |
| `usj-jul-2026` | USJ 4 – 12 Julai 2026 | 4:00 (24 babak, 70 gambar) | `out/usj-jul-2026.mp4` |

Kedua-dua projek: lagu *Kita Pernah Bersama* (0:02–4:02, dua chorus), penutup *Ingatan Ikhlas Daripada* +
tandatangan **Ustaz Zulhafeez — Mutawwif**. MP4 tidak di-commit (melebihi had 100 MB GitHub); cover ada di
`out/cover-<slug>.jpg`.

## Struktur berbilang projek

```
projects/<slug>/project.tsx          kandungan: tajuk, kapsyen, kad tandatangan, gambar setiap babak
projects/<slug>/project.config.json  group, album, duration (120–240 s), lagu, songStart, VO, output
projects/<slug>/photos.json          dijana (dimensi gambar)
public/img/<slug>/                    gambar disediakan (npm run photos)
public/audio/<slug>/mix.wav           audio akhir (npm run audio)
album/<slug>/                         gambar asal dimuat turun (tidak di-commit)
ACTIVE, src/active.ts                 projek aktif (npm run use -- <slug>)
```

## Group baharu

```bash
npm install && pip install numpy scipy pillow edge-tts
mkdir projects/<slug> && cp projects/usj-jul-2026/project.config.json projects/<slug>/   # ubah slug, group, album, output
cp projects/usj-jul-2026/project.tsx projects/<slug>/
npm run use -- <slug>
npm run album          # muat turun album -> album/<slug>/NNN.jpg + lembaran pilihan album/<slug>/sheets/
# … pilih gambar & isi projects/<slug>/project.tsx …
npm run photos && npm run audio
REMOTION_BROWSER=/path/ke/chrome-headless-shell npm run export   # -> out/<slug>.mp4 (cover terbenam)
```

Enjin gaya (sama untuk semua projek): `src/Video.tsx`, `src/components/core.tsx`, `src/components/Typography.tsx`.

> Storyboard di bawah ialah versi asal 2 minit projek USJ Okt. Susunan 4 minit ada dalam `projects/<slug>/project.tsx`.

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
src/Video.tsx              Enjin: lapisan kesan, teks, gred, audio
src/components/core.tsx    Ken Burns berfokus wajah, bingkai terapung 2.5D, kolaj, split/mozek, tilt panorama,
                           debu emas, sinaran cahaya, light leak, light sweep, gred warna emas/ungu, grain filem, bingkai emas
src/components/Typography  Tajuk emas 3D (extrusion + sapuan cahaya), subtajuk Poppins, kapsyen Cinzel
scripts/                   fetch_album.py, prepare_photos.py, generate_vo.py, generate_audio.py, stills.mjs, export.sh
```

Fon: Cinzel (tajuk, pengganti percuma Trajan Pro), Poppins (subtajuk), Great Vibes (tandatangan), SIL Open Font License.
