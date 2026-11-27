#!/usr/bin/env bash
# Cipta projek video baharu dalam STYLE NASIHAT V4.
#   bash styles/nasihat-v4/new_video.sh <slug> <Fail.MOV> "<Tajuk>" <CompositionId>
# Asas = templat Qoute Interaktif (media, Whisper, EDL, subtitle, audio, cover) + lapisan V4
# (Showcase.tsx, fon Great Vibes, bunyi klik, render_v4.sh, showcase.json rangka).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
SLUG="$1"
bash "$ROOT/styles/qoute-interaktif/new_video.sh" "$@"
DEST="$ROOT/video-nakseeheart-$SLUG"
echo "▶ Lapisan Nasihat V4"
cp "$HERE/overlay/src/Showcase.tsx" "$DEST/src/"
cp "$HERE/overlay/public/fonts/"* "$DEST/public/fonts/"
mkdir -p "$DEST/public/audio"; cp "$HERE/overlay/assets/click.wav" "$DEST/public/audio/click.wav"
cp "$HERE/overlay/scripts/"* "$DEST/scripts/"
python3 - "$DEST" <<'PY'
import json, re, sys
d = sys.argv[1]
# Root.tsx: import, fon, komposisi
p = f"{d}/src/Root.tsx"; s = open(p).read()
if 'Showcase' not in s:
    s = s.replace("import { loadFont } from '@remotion/fonts';", "import { loadFont } from '@remotion/fonts';\nimport { Showcase, KineticFinal, CoverV4, CoverV4B, CoverV4C, CoverV4D } from './Showcase';", 1)
    s = s.replace("  loadFont({ family: 'Bebas Neue',", "  loadFont({ family: 'Great Vibes', url: staticFile('fonts/GreatVibes-Regular.ttf'), weight: '400' }),\n  loadFont({ family: 'Bebas Neue',", 1)
    i = s.rindex("  </>")
    s = s[:i] + "    {/* Nasihat V4 */}\n    <Composition id=\"CoverV4\" component={CoverV4} durationInFrames={150} fps={FPS} width={W} height={H} />\n    <Composition id=\"CoverV4B\" component={CoverV4B} durationInFrames={150} fps={FPS} width={W} height={H} />\n    <Composition id=\"CoverV4C\" component={CoverV4C} durationInFrames={150} fps={FPS} width={W} height={H} />\n    <Composition id=\"CoverV4D\" component={CoverV4D} durationInFrames={150} fps={FPS} width={W} height={H} />\n    <Composition id=\"Showcase\" component={Showcase} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />\n    <Composition id=\"KineticFinal\" component={KineticFinal} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1080} />\n" + s[i:]
    open(p, "w").write(s)
# package.json: render -> V4
p = f"{d}/package.json"; pk = json.load(open(p))
pk["scripts"]["render"] = "bash scripts/render_v4.sh"; pk["scripts"]["still"] = "bash scripts/render_v4.sh still"
pk["scripts"]["render:qi"] = "bash scripts/render.sh"
json.dump(pk, open(p, "w"), indent=2, ensure_ascii=False)
# showcase.json rangka
sc = {"theme": "merah", "_nota": "Style Nasihat V4 — lihat styles/nasihat-v4/STYLE.md. theme: merah | hijau. Masa = saat output atau nama beat timeline.json.",
      "face": {"x": 540, "y": 1050}, "zoom": [1.0, 1.12],
      "logo": {"name": "NAKSEEHEART", "tagline": "NASIHAT · DARI · HATI"}, "label": "SHARING MOMENT",
      "cta": {"caption": "Nasihat Dari *Hati* Untuk *Hati*", "handle": "@nakseeheart", "clickAfter": 2.0, "cardTop": "SETIAP NASIHAT", "cardBig": "ADA MAKNA."},
      "scenes": [{"k": "side", "a": 0.15, "b": "flashToBody", "small": "KATA KECIL", "big": "HOOK"}, {"k": "cta", "a": "cta", "b": "end"}],
      "points": [{"a": 0, "b": "cta", "small": "KATA KECIL", "big": "POINT UTAMA", "icon": "heart"}],
      "cover": {"frameAt": 2.0, "photo": "media/cover-v4-frame.jpg", "zoom": 0.78, "photoTop": -330, "question": "SOALAN CANGKUK?",
                "small": "KATA KECIL", "big": "TAJUK BESAR", "quote": "Petikan sebenar penceramah", "watch": "TONTON SAMPAI HABIS",
                "chips": [{"icon": "shield", "t": "Point 1"}, {"icon": "hand", "t": "Point 2"}, {"icon": "target", "t": "Point 3"}]}}
json.dump(sc, open(f"{d}/src/data/showcase.json", "w"), indent=1, ensure_ascii=False)
PY
grep -q "Showcase" "$DEST/src/Root.tsx" || { echo "✗ gagal menampal Root.tsx" >&2; exit 1; }
echo "✔ Projek Nasihat V4 sedia: $DEST"
echo "  Isi timeline.json + script.json (seperti Qoute Interaktif), storyboard.json (poster/coverFx), kemudian src/data/showcase.json."
echo "  npm run subs && npm run audio && npm run still -- 300 && npm run render"
