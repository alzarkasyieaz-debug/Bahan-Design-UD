# Style: **Qoute Interaktif** — NakSeeHeart

Gaya video nasihat 9:16 yang menggabungkan **ucapan sebenar penceramah**, **tulisan 3D pada latar** dan **motion graphics kontekstual** yang muncul tepat pada perkataan yang disebut.
Dibina daripada video *"Jaga Komunikasi Bila Jumpa Kawan Lama"* (Master Prompt V2.0), yang menjadi rujukan visual utama: [`examples/jaga-komunikasi`](examples/jaga-komunikasi).

> **Prinsip:** *"Don't just add effects. Make every word feel meaningful."*
> Setiap grafik mesti membantu penonton faham nasihat, bukan sekadar hiasan.

---

## 1. Identiti visual
| Elemen | Ketetapan |
|---|---|
| Format | 9:16 · 1080×1920 · 30 fps · H.264 + AAC stereo · 60–120 s |
| Warna | Warm Gold `#D8B46A` · Deep Charcoal `#17191D` · Soft White `#F7F4ED` · Muted Teal `#406E73` · merah redup untuk amaran (✗, "FITNAH", "DIAIBKAN") |
| Tulisan 3D | **Bebas Neue**: extrusion 14–20 lapis, kecerunan emas/krim/merah, light sweep, bayang lembut |
| Label / lencana | **Cinzel** 800, jarak huruf lebar, garis emas |
| Petikan | **Playfair Display** italik, tanda petik emas |
| Subtitle & kad | **Montserrat** 800/900 |
| Gred | Kontras +6%, hangat sedikit, vignette 0.52 (klimaks 0.68), film grain 5%, light leak hanya pada peralihan |

## 2. Zon susun atur (skrin)
```
 y   0 ┌────────────────────────────┐
       │  (UI TikTok atas)          │
   200 │  LABEL / LENCANA 01·02·03  │  ← L.labelY
   345 │  TEKS 3D PADA LATAR        │  ← L.ceilingY (satah siling/dinding, perspektif)
       │                            │
   ~480│ ┌──── WAJAH ────┐          │  ← TIADA grafik di sini, sentiasa
       │ │               │          │
  ~1240│ └───────────────┘          │
  1300 │  KAD MOTION GRAPHICS       │  ← L.cardY
  1478 │  SUBTITLE (maks 2 baris)   │  ← L.subtitleY
  1565 │  [♪ FOLLOW @NakSeeHeart +] │  ← L.lowerThirdY (sepanjang video)
       │  (UI TikTok bawah)         │
  1920 └────────────────────────────┘
       x 60 ─────────────── 940  (elak rel ikon TikTok di kanan)
```
Laraskan `layout` dalam `storyboard.json` mengikut kedudukan wajah (ukur dengan grid pada satu bingkai).

## 3. Struktur video
| Babak | Masa | Isi |
|---|---|---|
| **Hook** | 0–~5 s | Petikan paling kuat daripada ucapan (selalunya ayat ringkasan); punch-in 1.34× ke 1.18×, latar kabur, label + 3D tajuk, cip konteks |
| **Build-up** | ~5–25 s | Perkenalkan mesej; **kaunter** jumlah perkara; meter / ikon kontekstual |
| **Isi utama** | ~25–80 s | Setiap point: **lencana bernombor** (atas) + **3D kata kunci** (latar) + **satu kad MG** (bawah) |
| **Rekap** | 4–5 s | Senarai bernombor progresif (jika ada senarai) |
| **B-roll** | 3–5 s setiap satu | Ilustrasi kontekstual (bukan rakaman sebenar) |
| **Klimaks** | ~8–10 s | Close-up 1.2× ke 1.3×, vignette gelap, **MG minimum** (satu 3D sahaja) |
| **Penutup** | ~6 s | Zoom-out, 3D kata akhir, nadi hati / bar kemajuan |
| **CTA** | 5.5 s | Tetap: SETIAP NASIHAT ADA MAKNA. + kad FOLLOW TIKTOK @NakSeeHeart + "Untuk Lebih Banyak Nasihat Kehidupan." |

## 4. Perpustakaan motion graphics (`storyboard.json` → `elements`)
| `type` | Bila digunakan | Zon |
|---|---|---|
| `ceiling3d` | Kata kunci identiti setiap bahagian (1 pada satu masa) | Latar |
| `label` | Konteks ringkas ("ELAKKAN", "PALING PENTING") | Atas |
| `badge` | Point bernombor 01/02/03 (whoosh + impact automatik) | Atas |
| `counter` | "3 keadaan", "5 tips": kaunter + slot | Kad |
| `meter` | Perubahan keadaan (mood, iman, semangat) | Kad |
| `compare` | Perbandingan ✓/✗ atau niat → kesan (`arrow`) | Kad |
| `checklist` | Senarai syarat/amalan yang disebut satu demi satu | Kad |
| `chat` | Contoh dialog yang penceramah sebut + cap ✗ | Kad |
| `crowd` | Orang ramai / majlis / masyarakat | Kad |
| `recap` | Ringkasan senarai bernombor (`good: true` = ✓ untuk sifat/amalan baik; lalai ✗ untuk perkara dielakkan) | Atas |
| `progress` | Hasil/kemajuan ("lebih baik", "lebih lancar") | Kad |
| `heart` | Hati, kasih sayang, ukhuwah | Atas |
| `chip` | Konteks pendek dengan ikon | Kad |
| `quote` | Petikan terapung (dalil, kata-kata mendalam) | Mana-mana |
| `text3d` | Teks 3D ruang skrin (dalam B-roll) | Bebas |
| `burst` | Partikel pada saat penting | Bebas |
| `broll` | `social` (telefon, chat), `friends` (dua sahabat), `spiritual` (masjid waktu subuh), dengan `children` | Skrin penuh |

**Peraturan MG**
- Satu kad MG pada satu masa; muncul **tepat pada perkataan** (beat dalam `timeline.json`).
- Tempoh 1–4 s; item dalam kad muncul berperingkat mengikut sebutan.
- Tiada grafik menutup wajah. Klimaks = MG minimum.
- Ketika kad utama aktif, letak julat dalam `subtitleCalm` supaya animasi subtitle diredam.

## 5. Komposit: cut-out **tidak wajib**
- **Lalai: TANPA cut-out.** Teks 3D berada pada satah latar (siling/dinding) dengan `ceilingTilt` (perspektif), parallax 2.5D (lapisan bergerak 75% daripada kamera) dan gradien gelap untuk kontras.
- Gunakan cut-out (`rembg u2net_human_seg`, lihat projek `video-nakseeheart-bahagia`) **hanya** jika latar kontras dengan penceramah, tepi kemas dan gerak tangan tidak kompleks.
- Jangan sesekali palsukan occlusion.

## 6. Penyuntingan & kamera
- EDL dalam `timeline.json` (`segments`). Potong **hanya pada jeda sebenar** (`tools/silences.py`), dengan crossfade audio 30 ms.
- Jump cut disamarkan dengan zum bergilir 1.00× ↔ `jumpCutZoom` (1.08×).
- Punch-in lembut (+4%) pada beat dalam `camera.punch`.
- Hook menggunakan latar kabur di sekeliling wajah; CTA menggunakan latar kabur 16 px + gelap.

## 7. Subtitle
- Bahasa Malaysia daripada audio sebenar (Whisper large-v3, kemudian **semak setiap klip** dengan `tools/clipcheck.py`).
- Putih, kata kunci **emas** (`gold`), kata utama HURUF BESAR (`upper`), maksimum 2 baris (≤48 aksara), muncul perkataan demi perkataan.
- Hanya ejaan/tanda baca dibetulkan. Bahagian loghat/tidak jelas yang **tidak dapat disahkan tidak dimasukkan**; catat dalam `script.json → unsure` dan maklumkan kepada pengguna.

## 8. Audio
- Suara: high-pass 85 Hz, denoise FFT, EQ (-2.5 dB @250, +2.5 dB @3.2k), kompresor lembut.
- Muzik: piano + strings disintesis (bebas hak cipta), crescendo dari `music.buildUp` ke klimaks, resolve semasa CTA.
- **Muzik perlahan:** ducking -16 dB, muzik 23–30 dB di bawah suara ketika bercakap (keutamaan pengguna).
- SFX minimum: automatik (hook, badge, item kad, B-roll, klimaks, penutup, CTA) + `sfx[]` khusus.
- Master -14 LUFS, true-peak -1.5 dBTP.

## 9. Lower third
Sepanjang video, **kelihatan sejak bingkai pertama**: kaca gelap, ikon TikTok, **FOLLOW @NakSeeHeart**, "Nasihat Ringkas, Makna Mendalam.", breathing glow, pulse FOLLOW pada `followPulse` (setiap ~25 s). Pada CTA ia bertukar menjadi kad besar di tengah.

## 10. Cover / thumbnail
`npm run cover` menghasilkan `out/<output>-cover.png` dan `.jpg` (1080×1920) daripada `storyboard.json → cover`:
`{ "frame": <saat dalam speaker.mp4>, "kicker": "LABEL ATAS", "big": "TAJUK 3D", "line2": "BARIS KEDUA", "tag": "teks italik", "bigSize"?, "line2Size"?, "faceY"? }`
- Pilih bingkai ekspresi terbaik (senyum/hangat, mata ke kamera).
- Tajuk & jenama dalam zon tengah 3:4 (y 240–1680), kerana grid profil TikTok memotong cover.
- `tag` bertanda petik **hanya** untuk ucapan tepat; parafrasa ditulis tanpa tanda petik.
- `faceY` melaraskan kedudukan wajah jika wajah dalam bingkai cover lebih tinggi/rendah daripada `layout.face`.

### Cover gaya **Poster** (thumbnail berani)
`npm run cover -- poster` (atau `bash scripts/cover.sh poster`) → `out/<output>-poster.{png,jpg}` daripada `storyboard.json → poster`:
`{ "icon": "chat|heart|check|star", "top": "ORANG KOMEN", "mid": "HASIL KERJA", "last": "KITA?", "banner": "Jangan cepat down!", "num": "3", "numLabel": "Cara Hadapi", "frame"?, "headTop", "chinY", "faceX", "maxScale"? }`
- Tajuk 3 tingkat italik tebal: `top` putih, **`mid` emas dalam kotak gelap**, `last` putih (soalan/cangkuk).
- Banner sapuan berus emas, ayat cangkuk pendek yang mendorong klik.
- Pil nombor bulat emas + label = isi video (jumlah tips/ciri/cara). Gunakan nombor **yang benar-benar disebut** dalam video.
- **Wajah tidak ditindih:** ukur `headTop` (atas kepala), `chinY` (bawah janggut) & `faceX` pada bingkai cover. Gambar diskala automatik supaya kepala→janggut muat di antara banner (y≈655) dan pil (y≈1468); tepi diisi versi kabur gambar yang sama. `maxScale` (lalai 1.1) boleh dinaikkan untuk rakaman jarak jauh.
- Wajah terang; logo ▶ NakSeeHeart + lengkung emas di bawah.

## 11. Kawalan kualiti (wajib sebelum render penuh)
1. `npm run still -- <bingkai>` di setiap babak; semak tiada pertindihan teks/wajah.
2. Subtitle ≤ 2 baris; tiada chunk < 1 s yang tidak perlu.
3. Kenyaringan -14 LUFS; muzik tidak menenggelamkan suara.
4. MP4 akhir < 100 MB (`scripts/render.sh` memampatkan secara automatik).
