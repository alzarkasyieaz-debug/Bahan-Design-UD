#!/usr/bin/env bash
# Render still pada beberapa bingkai dan gabungkan menjadi satu contact sheet untuk QA.
#   bash qa_sheet.sh <output.jpg> <bingkai1> <bingkai2> ...   (jalankan dalam folder projek)
set -euo pipefail
OUT="$1"; shift
ID=$(node -p "require('./src/data/storyboard.json').meta.compositionId")
export REMOTION_BROWSER="${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}"
TMP=$(mktemp -d)
for fr in "$@"; do npx remotion still "$ID" "$TMP/$fr.png" --frame="$fr" --scale=0.5 --log=error; done
python3 -I - "$OUT" "$TMP" "$@" <<'PY'
import sys
from PIL import Image, ImageDraw
out, tmp, frs = sys.argv[1], sys.argv[2], sys.argv[3:]
cols = min(9, len(frs)); rows = (len(frs) + cols - 1) // cols
c = Image.new('RGB', (216 * cols, 384 * rows))
for i, f in enumerate(frs):
    im = Image.open(f"{tmp}/{f}.png").convert('RGB').resize((216, 384))
    ImageDraw.Draw(im).text((4, 4), f"{int(f)/30:.1f}s", fill='yellow')
    c.paste(im, ((i % cols) * 216, (i // cols) * 384))
c.save(out, quality=90)
PY
rm -rf "$TMP"
