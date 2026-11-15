#!/usr/bin/env bash
# Sediakan media daripada video asal (IMG_4022.MOV dari folder Google Drive).
#   bash scripts/prepare_media.sh /path/ke/IMG_4022.MOV
# Hasil:
#   public/media/speaker.mp4      – video tegak 1080x1920, 30 fps (sumber 4K HEVC, putaran iPhone dibetulkan)
#   public/audio/voice_clean.wav  – suara dibersihkan (high-pass, denoise, EQ, kompresor lembut)
# Projek ini TIDAK menggunakan cut-out/matte (lihat src/components/Stage.tsx), jadi tiada langkah matte.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="${1:-../source/IMG_4022.MOV}"
mkdir -p public/media public/audio

echo "▶ 1/2 Proxy tegak 1080x1920 @30fps"
ffmpeg -v error -y -i "$SRC" -map 0:v -an -vf "scale=1080:1920:flags=lanczos,fps=30,format=yuv420p" \
  -c:v libx264 -crf 22 -preset slow -movflags +faststart public/media/speaker.mp4

echo "▶ 2/2 Bersihkan suara"
ffmpeg -v error -y -i "$SRC" -vn -ac 1 -ar 48000 \
  -af "highpass=f=85,lowpass=f=13000,afftdn=nf=-30:nr=14:tn=1,equalizer=f=250:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1.5:g=2.5,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=180:makeup=3" \
  public/audio/voice_clean.wav
echo "✔ Media siap"
