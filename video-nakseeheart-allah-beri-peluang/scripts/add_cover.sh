#!/usr/bin/env bash
# Masukkan cover poster KE DALAM video (style Qoute Interaktif):
#  1) cover dipaparkan ~1 s pada permulaan video (bingkai pertama = thumbnail TikTok/Reels)
#  2) cover dibenamkan sebagai gambar kecil MP4 (attached_pic) untuk galeri/pengurus fail
#   bash scripts/add_cover.sh [fresh]    -> out/<output>.mp4 dikemas kini (asal disimpan di .work/<output>-tanpa-cover.mp4)
#   (render.sh memanggil dengan "fresh" selepas render baharu)
# Idempoten: sentiasa bermula daripada video tanpa cover.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=$(node -p "require('./src/data/storyboard.json').meta.output")
V="out/$OUT.mp4"; P="out/$OUT-poster.jpg"; RAW=".work/$OUT-tanpa-cover.mp4"
DUR="${COVER_SECONDS:-1.0}"
[ -f "$P" ] || { echo "✗ $P tiada — jalankan: bash scripts/cover.sh poster" >&2; exit 2; }
mkdir -p .work
# "fresh": video baru dirender (tiada cover) -> jadikan sumber; tanpa argumen guna sumber sedia ada
if [ "${1:-}" = "fresh" ] || [ ! -f "$RAW" ]; then cp "$V" "$RAW"; fi
MS=$(python3 -c "print(int(float('$DUR')*1000))")
ffmpeg -v error -y -loop 1 -framerate 30 -t "$DUR" -i "$P" -i "$RAW" -i "$P" \
  -filter_complex "[0:v]scale=1080:1920,setsar=1,format=yuv420p,fade=t=out:st=$(python3 -c "print(float('$DUR')-0.2)"):d=0.2[c];[1:v]setsar=1,format=yuv420p[v];[c][v]concat=n=2:v=1:a=0[vv];[1:a]adelay=${MS}|${MS}[aa]" \
  -map "[vv]" -map "[aa]" -map 2:v -c:v:0 libx264 -crf 21 -preset slow -pix_fmt:v:0 yuv420p -profile:v:0 high \
  -c:v:1 mjpeg -disposition:v:1 attached_pic -c:a aac -b:a 192k -movflags +faststart "out/_wc.mp4"
mv out/_wc.mp4 "$V"
ls -la "$V"
