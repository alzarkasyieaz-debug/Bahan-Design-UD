#!/usr/bin/env bash
# Hasilkan cover/thumbnail 1080x1920 (PNG + JPG) daripada storyboard.json -> "cover".
#   bash scripts/cover.sh      -> out/<output>-cover.png, out/<output>-cover.jpg
set -euo pipefail
cd "$(dirname "$0")/.."
FRAME=$(node -p "require('./src/data/storyboard.json').cover.frame")
OUT=$(node -p "require('./src/data/storyboard.json').meta.output")
ffmpeg -v error -y -ss "$FRAME" -i public/media/speaker.mp4 -frames:v 1 -q:v 2 public/media/cover-frame.jpg
export REMOTION_BROWSER="${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}"
npx remotion still Cover "out/$OUT-cover.png" --frame=0 --log=error
ffmpeg -v error -y -i "out/$OUT-cover.png" -q:v 2 "out/$OUT-cover.jpg"
ls -la "out/$OUT-cover.png" "out/$OUT-cover.jpg"
