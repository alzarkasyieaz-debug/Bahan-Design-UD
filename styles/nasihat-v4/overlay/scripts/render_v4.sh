#!/usr/bin/env bash
# Render style NASIHAT V4 (komposisi "Showcase" 1080x1920):
#   logo premium + SATU panel suntingan kinetic + point penting 3D + CTA Follow TikTok (klik + bunyi).
#   bash scripts/render_v4.sh            -> out/<output>.mp4 (cover V4 dibenam ~1 s + thumbnail, MP4 sahaja)
#   bash scripts/render_v4.sh still 300  -> out/still-300.png
#   V4_OUT=<nama>  tukar nama output (cth projek yang sudah ada versi Qoute Interaktif)
#   COVER_V4=CoverV4 (A, lalai) | CoverV4B | CoverV4C | CoverV4D
# Prasyarat: npm run subs && npm run audio (public/audio/mix.wav), src/data/showcase.json diisi.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${V4_OUT:-$(node -p "require('./src/data/storyboard.json').meta.output")}"
if [ "${REMOTION_BROWSER:-}" = "" ] && [ -x /opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell ]; then
  export REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
fi
if [ "${1:-}" = "still" ]; then
  npx remotion still Showcase "out/still-${2:-60}.png" --frame="${2:-60}" --scale=0.5 --log=error; exit 0
fi
mkdir -p out .work
# 1) COVER V4 -> out/<OUT>-cover.{png,jpg}
FA=$(node -p "require('./src/data/showcase.json').cover.frameAt ?? 2")
ffmpeg -v error -y -ss "$FA" -i public/media/speaker.mp4 -frames:v 1 -q:v 2 public/media/cover-v4-frame.jpg
npx remotion still "${COVER_V4:-CoverV4}" "out/$OUT-cover.png" --frame=100 --log=error
ffmpeg -v error -y -i "out/$OUT-cover.png" -q:v 2 "out/$OUT-cover.jpg"; rm -f "out/$OUT-cover.png"
# siluet untuk babak 'silhouette' (rembg u2net_human_seg -> komponen terbesar)
if [ ! -f public/media/silhouette.png ]; then
  python3 -I -c "from rembg import remove,new_session;from PIL import Image;remove(Image.open('public/media/cover-v4-frame.jpg').convert('RGB'),session=new_session('u2net_human_seg'),post_process_mask=True).save('public/media/v4-cutout.png')"
  python3 -I scripts/make_silhouette.py public/media/v4-cutout.png public/media/silhouette.png
fi
# 2) render Showcase -> .work/<OUT>-tanpa-cover.mp4
RAW=".work/$OUT-tanpa-cover.mp4"
REMOTION_CONCURRENCY="${REMOTION_CONCURRENCY:-4}" npx remotion render Showcase "$RAW" --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=192k
# 3) cover dibenam: ~1 s di awal (pudar) + attached_pic
P="out/$OUT-cover.jpg"
ffmpeg -v error -y -loop 1 -framerate 30 -t 1.0 -i "$P" -i "$RAW" -i "$P" \
  -filter_complex "[0:v]scale=1080:1920,setsar=1,format=yuv420p,fade=t=out:st=0.8:d=0.2[c];[1:v]setsar=1,format=yuv420p[v];[c][v]concat=n=2:v=1:a=0[vv];[1:a]adelay=1000|1000[aa]" \
  -map "[vv]" -map "[aa]" -map 2:v -c:v:0 libx264 -crf 21 -preset slow -pix_fmt:v:0 yuv420p -profile:v:0 high \
  -c:v:1 mjpeg -disposition:v:1 attached_pic -c:a aac -b:a 192k -movflags +faststart "out/$OUT.mp4"
ls -la "out/$OUT.mp4"
echo "✔ Nasihat V4 siap: out/$OUT.mp4 (cover: $P)"
