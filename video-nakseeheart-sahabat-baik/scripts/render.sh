#!/usr/bin/env bash
# Render video (atau still) berdasarkan meta dalam src/data/storyboard.json.
#   bash scripts/render.sh            -> out/<output>.mp4, kemudian dimampatkan (< 100 MB untuk GitHub)
#   bash scripts/render.sh still 300  -> out/still-300.png (bingkai 300, skala 0.5)
set -euo pipefail
cd "$(dirname "$0")/.."
ID=$(node -p "require('./src/data/storyboard.json').meta.compositionId")
OUT=$(node -p "require('./src/data/storyboard.json').meta.output")
if [ "${REMOTION_BROWSER:-}" = "" ] && [ -x /opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell ]; then
  export REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
fi
if [ "${1:-}" = "still" ]; then
  FR="${2:-60}"
  npx remotion still "$ID" "out/still-$FR.png" --frame="$FR" --scale=0.5 --log=error
  exit 0
fi
npx remotion render "$ID" "out/$OUT.mp4" --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=192k
# Mampatan akhir: kualiti visual hampir sama, saiz sesuai untuk GitHub & muat naik
ffmpeg -v error -y -i "out/$OUT.mp4" -c:v libx264 -crf 21 -preset slow -pix_fmt yuv420p -profile:v high -c:a copy -movflags +faststart "out/_c.mp4"
mv "out/_c.mp4" "out/$OUT.mp4"
ls -la "out/$OUT.mp4"
# COVER WAJIB — style Qoute Interaktif: setiap video siap disertakan cover poster
HAS_POSTER=$(node -p "Boolean(require('./src/data/storyboard.json').poster)")
if [ "$HAS_POSTER" != "true" ]; then
  echo "✗ storyboard.json tiada 'poster' — cover wajib. Tambah 'poster' (STYLE.md §10) dan jalankan: bash scripts/cover.sh poster" >&2
  exit 2
fi
bash "$(dirname "$0")/cover.sh" poster
echo "✔ Video + cover siap: out/$OUT.mp4 , out/$OUT-poster.jpg"
