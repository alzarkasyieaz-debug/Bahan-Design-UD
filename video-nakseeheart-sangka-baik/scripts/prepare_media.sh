#!/usr/bin/env bash
# Sediakan media daripada video asal (IMG_9879.mov dari folder Google Drive).
#   bash scripts/prepare_media.sh /path/ke/IMG_9879.mov
# Hasil:
#   public/media/speaker.mp4      – video tegak 1080x1920, 30 fps (putaran iPhone dibetulkan)
#   public/media/speaker_fg.webm  – penceramah sahaja (VP9 + saluran alfa) untuk teks 3D di belakang subjek
#   public/audio/voice_clean.wav  – suara dibersihkan (high-pass, denoise, kompresor lembut)
# Keperluan: ffmpeg, python3, pip install "rembg[cpu]" pillow
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="${1:-../source/IMG_9879.mov}"
WORK="${WORK:-.work}"
mkdir -p "$WORK/rgb" "$WORK/masks" public/media public/audio

echo "▶ 1/4 Proxy tegak 1080x1920 @30fps"
ffmpeg -v error -y -i "$SRC" -map 0:v -an -vf "scale=1080:1920,fps=30,format=yuv420p" \
  -c:v libx264 -crf 23 -preset slow -movflags +faststart public/media/speaker.mp4

echo "▶ 2/4 Bersihkan suara"
ffmpeg -v error -y -i "$SRC" -vn -ac 1 -ar 48000 \
  -af "highpass=f=85,lowpass=f=13000,afftdn=nf=-30:nr=14:tn=1,equalizer=f=250:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1.5:g=2.5,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=180:makeup=3" \
  public/audio/voice_clean.wav

echo "▶ 3/4 Matte penceramah (u2net_human_seg, 3 proses selari)"
ffmpeg -v error -y -i public/media/speaker.mp4 -vf scale=540:960 "$WORK/rgb/%04d.jpg"
for i in 0 1 2; do OMP_NUM_THREADS=1 python3 -I scripts/make_masks.py "$WORK" $i 3 & done; wait

echo "▶ 4/4 Video alfa (VP9 yuva420p) — matte dilicinkan secara temporal & dilembutkan tepinya"
ffmpeg -v error -y -i public/media/speaker.mp4 -framerate 30 -i "$WORK/masks/%04d.png" \
  -filter_complex "[1:v]format=gray,tmix=frames=3:weights='1 2 1',scale=1080:1920:flags=bicubic,erosion,gblur=sigma=1.6,format=gray[m];[0:v][m]alphamerge,format=yuva420p[v]" \
  -map "[v]" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 26 -row-mt 1 -deadline good -cpu-used 4 -auto-alt-ref 0 \
  public/media/speaker_fg.webm
echo "✔ Media siap"
