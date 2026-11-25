# Suara Parit di Dewan Rakyat: versi TikTok (9:16)

Versi menegak bagi video info dalam `../video-suara-parit/`: **kira-kira 67 saat, 1080×1920, 30 fps, H.264 + AAC**.
Garis masa (`score.js`), muzik (`song.js`) dan data adalah sama. Hanya `film.js` disusun semula untuk skrin menegak.

- Teks dan angka kekal dalam kawasan selamat TikTok/Reels/Shorts (x 60–940, y 221–1498), jadi tidak dilindungi butang kanan, nama akaun atau kapsyen di bawah.
- Bahagian bawah skrin diisi latar dan potret sahaja.

```bash
cd video-suara-parit-tiktok
node song.js
node engine/render.js video
node engine/render.js mux       # -> out/video-suara-parit-tiktok.mp4
node engine/render.js verify
```

Video akhir: `suara-parit-di-dewan-rakyat-tiktok.mp4`.
