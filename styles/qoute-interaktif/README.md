# Style: Qoute Interaktif (NakSeeHeart)

Style video nasihat yang boleh digunakan semula, dibina daripada video ketiga *"Jaga Komunikasi Bila Jumpa Kawan Lama"*.

| Fail | Kegunaan |
|---|---|
| [`STYLE.md`](STYLE.md) | Panduan gaya: zon, palet, tipografi, struktur, perpustakaan motion graphics, peraturan audio & QC |
| [`template/`](template/) | Projek Remotion **berasaskan data**: komposisi dilukis daripada `src/data/storyboard.json` + `timeline.json` + `script.json` |
| [`examples/jaga-komunikasi/`](examples/jaga-komunikasi/) | Data lengkap video ketiga (rujukan); templat + data ini menghasilkan bingkai yang **sama piksel demi piksel** dengan video asal |
| [`new_video.sh`](new_video.sh) | Cipta projek baharu: salin templat, sediakan media, transkripsi, rangka data |
| [`tools/`](tools/) | `transcribe.py` (Whisper large-v3), `silences.py` (jeda sebenar untuk EDL), `clipcheck.py` (sahkan isi setiap klip) |
| [`../../.claude/skills/qoute-interaktif/SKILL.md`](../../.claude/skills/qoute-interaktif/SKILL.md) | Skill Claude Code: aliran kerja penuh untuk sesi akan datang (`/qoute-interaktif`) |

## Mula cepat
```bash
bash styles/qoute-interaktif/new_video.sh sabar /path/IMG_5000.MOV "Sabar Itu Kekuatan" NakSeeHeartSabar
cd video-nakseeheart-sabar
# isi src/data/timeline.json, script.json, storyboard.json (lihat contoh)
npm run subs && npm run audio && npm run still -- 300 && npm run render
```
