#!/usr/bin/env bash
# Hasilkan cover/thumbnail 1080x1920 (PNG + JPG).
#   bash scripts/cover.sh          -> gaya klasik  (storyboard.json -> "cover")  -> out/<output>-cover.{png,jpg}
#   bash scripts/cover.sh poster   -> gaya poster  (storyboard.json -> "poster") -> out/<output>-poster.{png,jpg}
set -euo pipefail
cd "$(dirname "$0")/.."
MODE="${1:-classic}"
KEY=$([ "$MODE" = "poster" ] && echo poster || echo cover)
COMP=$([ "$MODE" = "poster" ] && echo CoverPoster || echo Cover)
FRAME=$(node -p "const s=require('./src/data/storyboard.json'); (s.$KEY && s.$KEY.frame) ?? s.cover.frame")
OUT=$(node -p "require('./src/data/storyboard.json').meta.output")
ffmpeg -v error -y -ss "$FRAME" -i public/media/speaker.mp4 -frames:v 1 -q:v 2 public/media/cover-frame.jpg
export REMOTION_BROWSER="${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}"
npx remotion still "$COMP" "out/$OUT-$KEY.png" --frame=0 --log=error
ffmpeg -v error -y -i "out/$OUT-$KEY.png" -q:v 2 "out/$OUT-$KEY.jpg"
ls -la "out/$OUT-$KEY.png" "out/$OUT-$KEY.jpg"
