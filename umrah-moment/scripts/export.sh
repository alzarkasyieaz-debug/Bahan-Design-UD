#!/usr/bin/env bash
# UMRAH MOMENT — eksport projek aktif: render → cover → mampat + cover terbenam sebagai thumbnail
set -euo pipefail
cd "$(dirname "$0")/.."
SLUG=$(cat ACTIVE)
CFG="projects/$SLUG/project.config.json"
OUT=$(python3 -c "import json;print(json.load(open('$CFG')).get('output','out/$SLUG.mp4'))")
TITLE=$(python3 -c "import json;c=json.load(open('$CFG'));print('Umrah Moment — '+c.get('group',''))")
RAW="out/render-raw-$SLUG.mp4"; COVER="out/cover-$SLUG.jpg"
npx remotion render UmrahMoment "$RAW" --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=320k
npx remotion still UmrahMoment "$COVER" --frame=215 --image-format=jpeg --jpeg-quality=92
ffmpeg -y -loglevel error -i "$RAW" -i "$COVER" -map 0:v:0 -map 0:a:0 -map 1 \
  -c:v:0 libx264 -preset slow -crf 20 -maxrate 9M -bufsize 18M -pix_fmt yuv420p -profile:v:0 high -c:a copy \
  -c:v:1 copy -disposition:v:1 attached_pic -metadata title="$TITLE" -movflags +faststart "$OUT"
rm -f "$RAW"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$OUT"
echo "Siap: $OUT"
