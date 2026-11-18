#!/usr/bin/env python3
"""
Jana suara latar Bahasa Malaysia (lelaki, matang, tenang) menggunakan edge-tts
(suara neural ms-MY-OsmanNeural). Perlu: pip install edge-tts ; ffmpeg.
Output: public/audio/vo/babak-NN.wav  (+ vo_durations.json)
Untuk menggantikan dengan rakaman suara sebenar, letak fail WAV dengan nama yang sama
dan jalankan semula `npm run audio`.
"""
import json, os, subprocess
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "audio", "vo")
os.makedirs(OUT, exist_ok=True)
script = json.load(open(os.path.join(ROOT, "scripts", "vo_script.json")))
proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
durs = {}
# Babak dengan ayat panjang dibaca sedikit lebih laju supaya muat dalam 10 s
RATES = {"2": "-8%", "10": "-8%", "11": "-9%"}
for k, text in script.items():
    mp3 = os.path.join(OUT, f"babak-{int(k):02d}.mp3")
    wav = mp3[:-4] + ".wav"
    rate = RATES.get(k, "-14%")
    cmd = ["edge-tts", "--voice", "ms-MY-OsmanNeural", f"--rate={rate}", "--pitch=-7Hz",
           "--text", text, "--write-media", mp3]
    if proxy:
        cmd[1:1] = ["--proxy", proxy]
    subprocess.run(cmd, check=True)
    # Kehangatan: sedikit EQ bass, buang frekuensi rendah tak perlu, normalisasi
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, "-af",
                    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,highpass=f=70,lowshelf=g=2.5:f=180,equalizer=f=3200:t=q:w=1.2:g=1.5,"
                    "acompressor=threshold=-20dB:ratio=2.5:attack=8:release=200,loudnorm=I=-17:TP=-2",
                    "-ar", "44100", "-ac", "1", wav], check=True)
    os.remove(mp3)
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                       "-of", "csv=p=0", wav]))
    durs[k] = round(d, 2)
    print(k, durs[k])
json.dump(durs, open(os.path.join(OUT, "vo_durations.json"), "w"), indent=1)
