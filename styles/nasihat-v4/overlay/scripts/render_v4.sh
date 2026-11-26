#!/usr/bin/env bash
# Render style NASIHAT V4 (komposisi "Showcase" 1080x1920):
#   logo premium + SATU panel suntingan kinetic + point penting 3D + CTA Follow TikTok (klik + bunyi).
#   bash scripts/render_v4.sh            -> out/<output>.mp4 (cover dibenam, MP4 sahaja)
#   bash scripts/render_v4.sh still 300  -> out/still-300.png
# Prasyarat: npm run subs && npm run audio (public/audio/mix.wav), src/data/showcase.json diisi.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=$(node -p "require('./src/data/storyboard.json').meta.output")
if [ "${REMOTION_BROWSER:-}" = "" ] && [ -x /opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell ]; then
  export REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
fi
if [ "${1:-}" = "still" ]; then
  npx remotion still Showcase "out/still-${2:-60}.png" --frame="${2:-60}" --scale=0.5 --log=error; exit 0
fi
# 1) cover dahulu (hasilkan juga cover-cutout.png -> siluet)
bash scripts/cover.sh "${COVER_STYLE:-panel}"
[ -f public/media/silhouette.png ] || python3 -I scripts/make_silhouette.py public/media/cover-cutout.png public/media/silhouette.png
# 2) render Showcase
REMOTION_CONCURRENCY="${REMOTION_CONCURRENCY:-4}" npx remotion render Showcase "out/$OUT.mp4" --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=192k
ffmpeg -v error -y -i "out/$OUT.mp4" -c:v libx264 -crf 21 -preset slow -pix_fmt yuv420p -profile:v high -c:a copy -movflags +faststart out/_c.mp4
mv out/_c.mp4 "out/$OUT.mp4"
# 3) cover dibenam dalam video
bash scripts/add_cover.sh fresh
echo "✔ Nasihat V4 siap: out/$OUT.mp4"
