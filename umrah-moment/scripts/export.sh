#!/usr/bin/env bash
# UMRAH MOMENT — eksport akhir: render → cover → mampat (<100 MB) + cover terbenam sebagai thumbnail
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=$(python3 -c "import json;print(json.load(open('project.config.json')).get('output','out/umrah-moment.mp4'))")
TITLE=$(python3 -c "import json;c=json.load(open('project.config.json'));print('Umrah Moment — '+c.get('group',''))")
npx remotion render UmrahMoment out/render-raw.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=320k
npx remotion still UmrahMoment out/cover.jpg --frame=215 --image-format=jpeg --jpeg-quality=92
ffmpeg -y -loglevel error -i out/render-raw.mp4 -i out/cover.jpg -map 0:v:0 -map 0:a:0 -map 1 \
  -c:v:0 libx264 -preset slow -crf 20 -maxrate 9M -bufsize 18M -pix_fmt yuv420p -profile:v:0 high -c:a copy \
  -c:v:1 copy -disposition:v:1 attached_pic -metadata title="$TITLE" -movflags +faststart "$OUT"
rm -f out/render-raw.mp4
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$OUT"
echo "Siap: $OUT"
