#!/usr/bin/env bash
# Hasilkan cover/thumbnail 1080x1920 (PNG + JPG).
#   bash scripts/cover.sh          -> gaya klasik  (storyboard.json -> "cover")  -> out/<output>-cover.{png,jpg}
#   bash scripts/cover.sh poster   -> gaya poster  (storyboard.json -> "poster") -> out/<output>-poster.{png,jpg}
set -euo pipefail
cd "$(dirname "$0")/.."
MODE="${1:-classic}"
#   bash scripts/cover.sh impak|panel|info -> gaya cover v3 (data "poster" + "coverFx") -> out/<output>-poster.{png,jpg}
case "$MODE" in
  poster) KEY=poster; COMP=CoverPoster;;
  impak) KEY=poster; COMP=CoverImpak;;
  panel) KEY=poster; COMP=CoverPanel;;
  info)  KEY=poster; COMP=CoverInfo;;
  *) KEY=cover; COMP=Cover;;
esac
FRAME=$(node -p "const s=require('./src/data/storyboard.json'); (s.$KEY && s.$KEY.frame) ?? s.cover.frame")
OUT=$(node -p "require('./src/data/storyboard.json').meta.output")
ffmpeg -v error -y -ss "$FRAME" -i public/media/speaker.mp4 -frames:v 1 -q:v 2 public/media/cover-frame-raw.jpg
# Gred warna standard NakSeeHeart (semua cover selaras): imbangan putih + pendedahan wajah + look emas/teal
FACE=$(node -p "const s=require('./src/data/storyboard.json'); const p=s.poster||{}; const f=s.layout.face; [(p.faceX ?? f.x), (p.headTop && p.chinY) ? (p.headTop+p.chinY)/2 : f.y].join(' ')")
GRADE="$(dirname "$0")/grade_frame.py"
[ -f "$GRADE" ] || GRADE="$(dirname "$0")/../../styles/qoute-interaktif/tools/grade_frame.py"
python3 -I "$GRADE" public/media/cover-frame-raw.jpg public/media/cover-frame.jpg $FACE
if [ "$COMP" = CoverImpak ] || [ "$COMP" = CoverInfo ]; then
  # figura cut-out (rembg u2net_human_seg) untuk gaya Impak / Info
  python3 -I -c "from rembg import remove,new_session;from PIL import Image;remove(Image.open('public/media/cover-frame.jpg').convert('RGB'),session=new_session('u2net_human_seg'),post_process_mask=True).save('public/media/cover-cutout.png')"
fi
export REMOTION_BROWSER="${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}"
npx remotion still "$COMP" "out/$OUT-$KEY.png" --frame=0 --log=error
ffmpeg -v error -y -i "out/$OUT-$KEY.png" -q:v 2 "out/$OUT-$KEY.jpg"
ls -la "out/$OUT-$KEY.png" "out/$OUT-$KEY.jpg"
