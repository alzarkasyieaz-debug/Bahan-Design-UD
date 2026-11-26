# Style NASIHAT V4

Video nasihat NakSeeHeart 9:16 (1080×1920, 30 fps, 60–120 s) dalam bentuk **bingkai premium satu panel**:

```
┌──────────────────────────────┐
│ (◎) NAKSEEHEART              │  ← logo premium: medalion emas (bintang 8 bucu berputar + hati
│     ──◆── NASIHAT·DARI·HATI   │    berdenyut) + tanda kata Cinzel emas berkilau + tagline
│ ┌──────────────────────────┐ │
│ │                          │ │  ← SATU panel 960×960: suntingan kinetic typography
│ │  wajah penceramah ⇄ kad  │ │    (wajah diselang-seli dengan kad grafik skrin penuh)
│ │  grafik skrin penuh      │ │
│ └──────────────────────────┘ │
│ (ikon) KATA KECIL            │  ← point penting: tulisan 3D emas + cip ✓ ikut beat
│   POINT UTAMA 3D             │    + penanda kemajuan (titik)
│   [✓ cip] [✓ cip]            │
│ |SHARING MOMENT|             │  ← label neon turquoise
└──────────────────────────────┘
```

Latar: kecerunan **turquoise** `#7FF0E2 → #33C9BD → #14908C → #0B5357 → #062A2E`, emas untuk teks utama.
Asas aliran kerja (media, Whisper, EDL, subtitle, audio, cover) = **Qoute Interaktif** (`styles/qoute-interaktif/STYLE.md`);
V4 hanya menambah lapisan persembahan. Peraturan sama: jangan reka/ubah kata-kata penceramah; perkataan tidak jelas = "…".

Contoh: `examples/nasihat-v4-preview.jpg`, `examples/logo-premium.png`, data penuh `examples/showcase.allah-beri-peluang.json`
(video "Allah Sentiasa Beri Peluang", `video-nakseeheart-allah-beri-peluang/`).

## 1. Cipta projek
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
| `face {x,y}` | titik tengah wajah dalam bingkai 1080×1920 (panel memotong segi empat di sekitarnya) |
| `zoom [..]` | zum berselang-seli setiap segmen EDL (lalai `[1.0, 1.12]`) |
| `logo {name, tagline}` | `NAKSEEHEART`, `NASIHAT · DARI · HATI` |
| `label` | label neon bawah (`SHARING MOMENT`) |
| `cta {caption, handle, clickAfter, cardTop, cardBig}` | kapsyen tandatangan (`*kata*` = emas), handle TikTok, saat klik selepas beat `cta`, teks kad CTA dalam panel |
| `scenes[]` | babak dalam panel (jadual bawah) |
| `points[]` | point penting di bawah panel |

### Babak panel (`scenes[].k`)
Babak selain `side` ialah **kad skrin penuh** (subtitle panel disembunyikan semasa kad).

| k | Medan | Kegunaan |
|---|---|---|
| `side` | `small, big, right?` | teks emas di bahagian atas, wajah kekal kelihatan (hook / kata kunci ringkas) |
| `word` | `big, small?, box?, lines?[]` | perkataan besar (berbingkai jika `box`) |
| `versus` | `title, left, right, at2` | dua pilihan (kad kedua muncul pada `at2`) |
| `ring` | `small, big, icon` | cincin emas melengkap + ikon |
| `silhouette` | `lines[3]` | kad kertas + siluet penceramah (`public/media/silhouette.png`, dijana automatik) |
| `list` | `title, items[{t, at}]` | senarai ✗ (perkara negatif) |
| `tiles` | `title, items[{n, t, at}]` | jubin bernombor 1-2-3 menyala ikut beat |
| `spot` | `small, big, sub, subAt?, icon` | sorotan cahaya + medalion ikon |
| `cta` | `a:"cta", b:"end"` | kad penutup `cardTop`/`cardBig` + FOLLOW |

Panduan: 1 babak setiap 3–10 s, padankan dengan beat perkataan penting; selang-seli `side` (wajah) dengan kad
supaya penceramah kerap kelihatan; jangan letak kad lebih 10 s.

### Point penting (`points[]`)
`{a, b, small, big, icon, chips?[{t, at}]}` — bersambung dari 0 hingga beat `cta` tanpa jurang.
`big` ≤ 20 aksara (saiz auto), `small` = konteks huruf besar, `chips` = sub-point yang muncul tepat pada beat
perkataan. Ikon: heart, book, chat, check, star, play, home, users, phone, coin, leaf, moon, mosque, hand,
calendar, clock, shield, smile, bulb, target, family. 8–13 point untuk video ~100 s.

## 4. CTA penutup (automatik)
Bermula pada beat `cta`: kapsyen tandatangan **"Nasihat Dari Hati Untuk Hati"** (Great Vibes, ditulis dari kiri) →
butang **Follow @nakseeheart** (ikon nota muzik gaya TikTok, berdenyut) → kursor tangan masuk dan **klik**
(bunyi klik `click.wav`) pada `cta + clickAfter` → butang bertukar **Following ✓** turquoise + riak + hati terbang.
Pastikan `end − cta ≥ 4.5 s`.

## 5. Render & semak
```bash
npm run still -- 300        # semak beberapa bingkai (hook, kad, chips, CTA)
npm run render              # cover Panel v2 → siluet → Showcase → mampat CRF 21 → cover dibenam (~1 s + thumbnail)
```
Semak: tempoh = `end` + 1 s cover, kenyaringan ≈ −14 LUFS, tiada teks bertindih, chips muncul tepat pada ucapan.
Penghantaran: **MP4 sahaja** (cover di dalam video).

## 6. Fon & lesen
Cinzel (logo), Great Vibes (kapsyen; OFL), Bebas Neue, Montserrat. Ikon nota muzik dilukis sendiri (gaya TikTok,
bukan logo rasmi). Bunyi klik disintesis sendiri.
