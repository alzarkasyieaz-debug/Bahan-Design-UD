#!/usr/bin/env bash
# Cipta projek video baharu dalam STYLE QOUTE INTERAKTIF.
#   bash styles/qoute-interaktif/new_video.sh <slug> <Fail.MOV> "<Tajuk>" <CompositionId>
# Contoh:
#   bash styles/qoute-interaktif/new_video.sh sabar ~/IMG_5000.MOV "Sabar Itu Kekuatan" NakSeeHeartSabar
# Hasil: video-nakseeheart-<slug>/ dengan media disediakan, transkrip Whisper, dan
#        storyboard.json/script.json/timeline.json rangka untuk diisi.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
SLUG="$1"; SRC="$2"; TITLE="$3"; ID="$4"
DEST="$ROOT/video-nakseeheart-$SLUG"
[ -e "$DEST" ] && { echo "✗ $DEST sudah wujud"; exit 1; }

echo "▶ Salin templat"
mkdir -p "$DEST"
(cd "$HERE/template" && tar cf - --exclude=node_modules --exclude=out --exclude=public/media --exclude=public/audio --exclude='src/data/*.json' .) | (cd "$DEST" && tar xf -)
mkdir -p "$DEST/out" "$DEST/public/media" "$DEST/public/audio" "$DEST/src/data"
# node_modules dikongsi (jika ada) — atau jalankan `npm install`
if [ -d "$HERE/template/node_modules" ]; then ln -sfn "$(readlink -f "$HERE/template/node_modules")" "$DEST/node_modules"; fi

echo "▶ Media (proxy 1080x1920 + suara bersih)"
bash "$DEST/scripts/prepare_media.sh" "$SRC"

echo "▶ Transkripsi Whisper large-v3"
ffmpeg -v error -y -i "$SRC" -vn -ac 1 -ar 16000 "$DEST/out/audio16k.wav"
HF_HUB_DISABLE_XET=1 python3 -I "$HERE/tools/transcribe.py" "$DEST/out/audio16k.wav" large-v3 "$DEST/src/data/transcript.raw.json"
echo "▶ Jeda sebenar (untuk EDL):"
python3 -I "$HERE/tools/silences.py" "$DEST/out/audio16k.wav" | tee "$DEST/out/jeda.txt"

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
python3 - "$DEST" "$SLUG" "$TITLE" "$ID" "$(basename "$SRC")" "$DUR" <<'PY'
import json, sys
dest, slug, title, cid, src, dur = sys.argv[1:]; dur = float(dur)
end = round(min(dur, 114.0) + 4.0 + 5.5, 2)
tl = {"fps": 30, "width": 1080, "height": 1920, "sourceVideo": f"{src} ({dur:.2f} s)",
      "segments": [
        {"id": "hook", "out": [0.0, 4.0], "src": 0.0, "srcEnd": 4.0},
        {"id": "s1", "out": [4.0, round(end - 5.5, 2)], "src": 0.0, "srcEnd": round(min(dur, 114.0), 2)},
        {"id": "cta", "out": [round(end - 5.5, 2), end], "src": max(0.0, round(dur - 1.2, 2)), "srcEnd": round(dur, 2), "rate": 0.15}],
      "beats": {"flashToBody": 4.0, "climax": [round(end - 20, 2), round(end - 12, 2)], "finale": [round(end - 12, 2), round(end - 5.5, 2)],
                "cta": round(end - 5.5, 2), "end": end, "followPulse": [20.0, 45.0, 70.0, 95.0]}}
sb = {"meta": {"title": title, "compositionId": cid, "output": f"nakseeheart-{slug}", "source": src},
      "layout": {"face": {"x": 540, "y": 820}, "ceilingY": 345, "ceilingTilt": -22, "labelY": 200, "cardY": 1300, "recapY": 318,
                 "subtitleY": 1478, "lowerThirdY": 1565, "hookFocusY": 880, "climaxFocusY": 880},
      "camera": {"punch": [], "jumpCutZoom": 1.08, "climaxZoom": [1.2, 1.3], "hookZoom": [1.34, 1.18, 1.26]},
      "subtitleCalm": [], "music": {"buildUp": "climax.0-12"}, "sfx": [], "elements": []}
sc = {"source": src, "maxChars": 48, "gold": [], "upper": [], "chunks": [], "unsure": []}
for name, d in (("timeline", tl), ("storyboard", sb), ("script", sc)):
    json.dump(d, open(f"{dest}/src/data/{name}.json", "w"), indent=1, ensure_ascii=False)
PY
echo "✔ Projek sedia: $DEST"
echo "  Seterusnya: isi timeline.json (EDL + beat), script.json (chunk disemak), storyboard.json (elemen),"
echo "  kemudian: npm run subs && npm run audio && npm run still -- 300 && npm run render"
