# Umrah Moment — Memori USJ 4–12 Julai 2026

Video memori **9:16 (1080×1920), 30 fps, ±78 s, H.264 + AAC**, dibina dengan [Remotion](https://www.remotion.dev/).
Foto daripada album Google Photos "Memori USJ 4- 12 Julai 2026" (38 foto terpilih, EXIF/GPS dibuang, saiz maks 1280 px).

## Gaya "Umrah Moment"

- **Warna:** zamrud malam (`#0c3b33` → `#06161a`), emas lembut (`#d6ae63`, `#f2dca8`), krim (`#f8f1e2`)
- **Bingkai:** gerbang mihrab bergaris emas berganda (dilukis secara animasi) + kad foto bermat krim untuk kolaj
- **Latar:** corak geometri Islamik bintang 8 bucu yang bergerak perlahan, debu emas, vinyet, bijian filem halus
- **Tipografi:** Playfair Display Italic (tajuk), Bebas Neue (label), Inter (kapsyen), Amiri (teks Arab)
- **Gerakan:** Ken Burns pada setiap foto, teks muncul perkataan demi perkataan, pudar silang antara babak
- **Audio:** muzik asli disintesis dalam maqam Hijaz (pad + petikan ala oud + loceng lembut) — bebas hak cipta

## Susunan

| Babak | Tajuk | Susun atur |
|---|---|---|
| Pembuka | *Umrah Moment* · لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ · 4–12 Julai 2026 | Gerbang (foto jemaah) |
| 01 | Bermula Sebuah Perjalanan | Gerbang, 3 foto silih berganti |
| 02 | Bersama Menuju Tanah Suci | Grid 4 kad |
| 03 | Menanti Seruan | Gerbang + 2 kad |
| 04 | Satu Jemaah, Satu Hati | Gerbang |
| 05 | Senyum di Bumi Barakah | Grid 4 kad |
| 06 | Menyusuri Jejak Sejarah | Gerbang + 2 kad |
| 07 | Detik Bersama | Grid 4 kad |
| 08 | Ukhuwah Fillah | Gerbang + 2 kad |
| 09 | Rezeki Sepanjang Jalan | Grid 4 kad |
| 10 | Kenangan Terindah | Gerbang, 3 foto |
| Penutup | تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ · *Sehingga bertemu lagi, Tanah Suci* | Gerbang |

Tajuk, kapsyen, foto dan tempoh setiap babak disunting dalam **`src/data.ts`** sahaja.

## Render

```bash
cd video-umrah-moment
npm install
pip install numpy scipy && npm run audio   # pilihan — muzik.wav sudah disertakan
npm run studio                             # pratonton
npm run render                             # -> out/umrah-moment-usj-2026.mp4
```

Tanpa internet untuk Chrome Headless Shell: `npm run render -- --browser-executable=/path/ke/chrome`.
