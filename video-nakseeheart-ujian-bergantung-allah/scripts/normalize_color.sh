#!/usr/bin/env bash
# Normalisasi warna rakaman penceramah (imbangan putih, pendedahan wajah, ketepuan) supaya
# semua video NakSeeHeart selaras. Jalankan SEKALI selepas storyboard.json -> layout.face ditetapkan,
# sebelum `npm run render`. Rakaman asal disimpan dalam .work/ (diabaikan git, tidak dibundle).
#   bash scripts/normalize_color.sh
set -euo pipefail
cd "$(dirname "$0")/.."
M=public/media
RAWDIR=.work; mkdir -p "$RAWDIR"
[ -f "$RAWDIR/speaker_raw.mp4" ] || cp "$M/speaker.mp4" "$RAWDIR/speaker_raw.mp4"
FACE=$(node -p "const f=require('./src/data/storyboard.json').layout.face; f.x+' '+f.y")
CH=$(python3 -I scripts/grade_params.py "$RAWDIR/speaker_raw.mp4" $FACE 12)
ffmpeg -v error -y -i "$RAWDIR/speaker_raw.mp4" -vf "$CH,format=yuv420p" -c:v libx264 -crf 22 -preset slow -movflags +faststart "$M/speaker.mp4"
if [ -f "$M/speaker_fg.webm" ]; then
  [ -f "$RAWDIR/speaker_fg_raw.webm" ] || cp "$M/speaker_fg.webm" "$RAWDIR/speaker_fg_raw.webm"
  ffmpeg -v error -y -c:v libvpx-vp9 -i "$RAWDIR/speaker_fg_raw.webm" -vf "$CH,format=yuva420p" -c:v libvpx-vp9 -pix_fmt yuva420p \
    -b:v 0 -crf 26 -row-mt 1 -deadline good -cpu-used 4 -auto-alt-ref 0 "$M/speaker_fg.webm"
fi
echo "✔ Warna dinormalkan: $CH"
