# Style NASIHAT V4

Video nasihat NakSeeHeart 9:16 (1080×1920, 30 fps, 60–120 s) dalam bentuk **bingkai premium satu panel**:

```
┌──────────────────────────────┐
│ (◎) NAKSEEHEART              │  ← logo premium atas plak gelap berbingkai emas: medalion (bintang 8 bucu berputar + hati
│     ──◆── NASIHAT·DARI·HATI   │    berdenyut) + tanda kata Cinzel emas berkilau + tagline
│ ┌──[● SHARING MOMENT]──────┐ │  ← label kecil di bucu atas panel: cahaya berlari di bingkai + sapuan cahaya
│ │                          │ │  ← SATU panel 960×960 (top 290): suntingan kinetic typography
│ │  wajah penceramah ⇄ kad  │ │    (wajah diselang-seli dengan kad grafik skrin penuh)
│ │  grafik skrin penuh      │ │
│ └──────────────────────────┘ │
│ (ikon) KATA KECIL            │  ← point penting: tulisan 3D emas + cip ✓ ikut beat
│   POINT UTAMA 3D             │    + penanda kemajuan (titik)
│   [✓ cip] [✓ cip]            │
└──────────────────────────────┘
```

Latar: kecerunan tema **merah maroon** (lalai) atau **hijau gelap** (§3c); emas untuk teks utama, logo dan bingkai.
Asas aliran kerja (media, Whisper, EDL, subtitle, audio, cover) = **Qoute Interaktif** (`styles/qoute-interaktif/STYLE.md`);
V4 hanya menambah lapisan persembahan. Peraturan sama: jangan reka/ubah kata-kata penceramah; perkataan tidak jelas = "…".

Contoh: `examples/nasihat-v4-preview.jpg`, `examples/logo-premium.png`, data penuh `examples/showcase.allah-beri-peluang.json`
(video "Allah Sentiasa Beri Peluang", `video-nakseeheart-allah-beri-peluang/`).

## 1. Cipta projek
Projek Qoute Interaktif yang **sudah ada** (EDL/subtitle/audio siap): salin lapisan `overlay/` (Showcase.tsx, fon, `assets/click.wav` → `public/audio/`, skrip),
tampal Root.tsx seperti `new_video.sh`, tulis `showcase.json`, kemudian `V4_OUT=<output>-v4 bash scripts/render_v4.sh`.

Projek baharu:
```bash
bash styles/nasihat-v4/new_video.sh <slug> <Fail.MOV> "<Tajuk>" <CompositionId>
```
= `qoute-interaktif/new_video.sh` + lapisan V4: `src/Showcase.tsx`, fon Great Vibes, `public/audio/click.wav`,
`scripts/render_v4.sh`, `scripts/make_silhouette.py`, `src/data/showcase.json` rangka; Root.tsx didaftarkan
komposisi `Showcase` (1080×1920) dan `KineticFinal` (1080×1080); `npm run render` → V4 (`npm run render:qi` = video QI biasa).

## 2. Isi data seperti Qoute Interaktif
`timeline.json` (EDL + beat), `script.json` (subtitle disemak), `storyboard.json` (`meta`, `poster`, `coverFx` — cover Panel v2).
Kemudian `npm run subs && npm run audio` (menghasilkan `public/audio/mix.wav` yang dipakai Showcase).

## 3. `src/data/showcase.json`
Masa = saat output **atau nama beat** dalam `timeline.json` (cth `"cta"`, `"end"`, `"flashToBody"`).

| Kunci | Fungsi |
|---|---|
| `theme` | `merah` (lalai) atau `hijau` (§3c) |
| `face {x,y}` | titik tengah wajah dalam bingkai 1080×1920 (panel memotong segi empat di sekitarnya; dihadkan pada tepi bingkai) |
| `zoom [..]` | zum berselang-seli setiap segmen EDL (lalai `[1.0, 1.12]`) |
| `logo {name, tagline}` | `NAKSEEHEART`, `NASIHAT · DARI · HATI` |
| `label` | label kecil bercahaya di atas panel (`SHARING MOMENT`) |
| `cta {caption, handle, clickAfter, cardTop, cardBig}` | kapsyen tandatangan (`*kata*` = emas), handle TikTok, saat klik selepas beat `cta`, teks kad CTA dalam panel |
| `scenes[]` | babak dalam panel (jadual bawah) |
| `points[]` | point penting di bawah panel |

### Babak panel (`scenes[].k`)
Babak selain `side` ialah **kad skrin penuh** (subtitle panel disembunyikan semasa kad).

| k | Medan | Kegunaan |
|---|---|---|
| `side` | `small, big, right?` | teks emas di bahagian atas, wajah kekal kelihatan (hook / kata kunci ringkas) |
| `word` | `big, small?, box?, lines?[]` | perkataan besar (berbingkai jika `box`) |
| `versus` | `title, left, right, at2` | dua pilihan (kad kedua muncul pada `at2`; saiz fon auto ikut panjang) |
| `ring` | `small, big, icon` | cincin emas melengkap + ikon |
| `silhouette` | `lines[3]`, `silX?`, `silY?`, `silFlip?` | kad kertas + siluet penceramah (`public/media/silhouette.png`, dijana automatik); laras/cermin supaya tidak bertindih teks |
| `list` | `title, items[{t, at}]` | senarai ✗ (perkara negatif) |
| `tiles` | `title, items[{n, t, at}]` | jubin bernombor 1-2-3 menyala ikut beat |
| `spot` | `small, big, sub, subAt?, icon` | sorotan cahaya + medalion ikon |
| `cta` | `a:"cta", b:"end"` | kad penutup `cardTop`/`cardBig` + FOLLOW |

Panduan: 1 babak setiap 3–10 s, padankan dengan beat perkataan penting; selang-seli `side` (wajah) dengan kad
supaya penceramah kerap kelihatan; jangan letak kad lebih 10 s.

### Point penting (`points[]`)
`{a, b, small, big, icon, chips?[{t, at, x?}]}` (`x: true` = cip ✗ merah untuk perkara yang ditegah/negatif) — bersambung dari 0 hingga beat `cta` tanpa jurang.
`big` ≤ 20 aksara (saiz auto), `small` = konteks huruf besar, `chips` = sub-point yang muncul tepat pada beat
perkataan. Ikon: heart, book, chat, check, star, play, home, users, phone, coin, leaf, moon, mosque, hand,
calendar, clock, shield, smile, bulb, target, family. 8–13 point untuk video ~100 s.

## 3b. Cover V4 (`showcase.json → cover`)

**Cover lalai = Konsep A "Gerbang Mihrab" (`CoverV4`)** — pilihan pengguna. Alternatif: `COVER_V4=CoverV4B` (sinematik), `CoverV4C` (medalion petikan), `CoverV4D` (senarai pesanan); lihat `examples/konsep-cover-v4.jpg`.

Contoh: `examples/cover-v4.jpg`. Latar tema (merah/hijau) + sinar cahaya + corak bintang 8 bucu, logo premium, label
SHARING MOMENT, foto dalam **gerbang mihrab emas**, pil merah soalan cangkuk, tajuk 3D emas, petikan sebenar
(Great Vibes), 3 cip point, butang "TONTON SAMPAI HABIS".

| Kunci | Fungsi |
|---|---|
| `frameAt` | saat dalam `public/media/speaker.mp4` untuk foto (mata terbuka, pandang kamera, mulut tertutup — semak lembaran kecil) |
| `zoom`, `photoTop`, `photoLeft?` | saiz & kedudukan foto dalam gerbang (0.78 / −330: mata ≈ 40 % dari atas gerbang, bahu kelihatan) |
| `question` | soalan cangkuk (pil merah) — mesti selari dengan isi ucapan |
| `small`, `big` | tajuk 2 baris (`big` = 3D emas, ≤ 12 aksara untuk saiz penuh) |
| `quote` | petikan **sebenar** penceramah (pendek) |
| `chips[3]` | `{icon, t}` ≤ ~18 aksara setiap satu |

`npm run render` menjana cover ini dahulu (`out/<output>-poster.jpg`), kemudian membenamkannya ~1 s di awal video + thumbnail.

## 3c. Tema warna (`showcase.json → theme`)
Style ini hanya ada **dua** tema (emas kekal pada kedua-duanya):
- `merah` — **maroon, lalai** (`#F08A86 → #C8333F → #931827 → #600C18 → #36060D`); pil soalan cangkuk krim + teks merah.
- `hijau` — hijau gelap zamrud (`#93DDB0 → #2E9E68 → #15734A → #0B4A30 → #06281A`); pil soalan merah.

Contoh: `examples/sampel-tema-warna.jpg`. Uji tanpa ubah data: `npx remotion still CoverV4 out/x.png --frame=100 --props='{"theme":"hijau"}'`.

## 4. CTA penutup (automatik)
Bermula pada beat `cta`: kapsyen tandatangan **"Nasihat Dari Hati Untuk Hati"** (Great Vibes, ditulis dari kiri) →
butang **Follow @nakseeheart** (ikon nota muzik gaya TikTok, berdenyut) → kursor tangan masuk dan **klik**
(bunyi klik `click.wav`) pada `cta + clickAfter` → butang bertukar **Following ✓** warna tema + riak + hati terbang.
Pastikan `end − cta ≥ 4.5 s`.

## 5. Render & semak
```bash
npm run still -- 300        # semak beberapa bingkai (hook, kad, chips, CTA)
npm run render              # cover V4 → siluet → Showcase → cover dibenam (~1 s + thumbnail) → out/<output>.mp4
V4_OUT=<slug>-v4 bash scripts/render_v4.sh   # projek QI sedia ada: output berasingan, versi QI tidak ditimpa
```
Semak: tempoh = `end` + 1 s cover, kenyaringan ≈ −14 LUFS, tiada teks bertindih, chips muncul tepat pada ucapan.
Penghantaran: **MP4 sahaja** (cover di dalam video).

## 6. Fon & lesen
Cinzel (logo), Great Vibes (kapsyen; OFL), Bebas Neue, Montserrat. Ikon nota muzik dilukis sendiri (gaya TikTok,
bukan logo rasmi). Bunyi klik disintesis sendiri.
