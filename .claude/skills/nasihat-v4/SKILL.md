---
name: nasihat-v4
description: Hasilkan video nasihat NakSeeHeart 9:16 dalam style "Nasihat V4" — logo premium NAKSEEHEART (medalion emas), SATU panel suntingan kinetic typography (wajah penceramah ⇄ kad grafik), point penting tulisan 3D emas di bawah panel, latar turquoise, label neon SHARING MOMENT, dan CTA butang Follow TikTok dengan kursor klik + bunyi klik + kapsyen "Nasihat Dari Hati Untuk Hati". Guna bila pengguna minta style Nasihat V4 / "V4" / "seperti video Allah Sentiasa Beri Peluang (showcase)".
---

# Style Nasihat V4 — aliran kerja

Rujukan penuh: `styles/nasihat-v4/STYLE.md`. Asas = style Qoute Interaktif (`.claude/skills/qoute-interaktif/SKILL.md`,
`styles/qoute-interaktif/STYLE.md`) — ikut langkah 1, 3, 4 dan 5 di sana (bahan Drive, EDL, subtitle, audio).
Contoh siap: `video-nakseeheart-allah-beri-peluang/` (data: `styles/nasihat-v4/examples/showcase.allah-beri-peluang.json`).

1. **Cipta projek**: `bash styles/nasihat-v4/new_video.sh <slug> <Fail.MOV> "<Tajuk>" <CompositionId>`.
2. **Data Qoute Interaktif**: `timeline.json` (EDL pada jeda sebenar + beat perkataan penting), `script.json`
   (jangan reka/ubah kata-kata; tidak jelas = "…"), `storyboard.json` (`poster` + `coverFx` — cover Panel v2 wajib).
   `npm run subs && npm run audio`.
3. **`src/data/showcase.json`**:
   - `face` = kedudukan wajah (semak bingkai), `scenes[]` babak panel (`side`, `word`, `versus`, `ring`,
     `silhouette`, `list`, `tiles`, `spot`, `cta`), `points[]` point 3D bersambung 0 → `cta` dengan `chips` pada beat.
   - Masa boleh nama beat (`"cta"`, `"end"`).
   - Teks hanya daripada ucapan sebenar (diringkaskan ke kata kunci, bukan direka).
4. **QA still**: `npm run still -- <bingkai>` untuk hook, setiap jenis kad, chips dan CTA (klik pada `cta + 2 s`).
   Pastikan tiada teks bertindih/terpotong.
5. **Render**: `npm run render` (render_v4.sh: cover → siluet → Showcase → mampat → cover dibenam).
   Semak ffprobe (tempoh) + ebur128 (≈ −14 LUFS).
6. **Hantar MP4 sahaja** (SendUserFile), tambah README projek, commit + push.
