#!/usr/bin/env python3
"""
Penjana suara latar (voice-over) Bahasa Melayu — narator lelaki.

Enjin : Meta MMS-TTS (facebook/mms-tts-zlm, lesen CC-BY-NC 4.0) -> penukaran
        suara lelaki matang dengan vokoder WORLD (pic F0 x0.60, envelop formant
        x0.88) -> EQ hangat + mampatan lembut + gema bilik ringan.
Output: build/vo/<id>.wav (48 kHz mono) + build/vo/vo.json (tempoh & masa ayat)

Untuk siaran rasmi, gantikan fail build/vo/<id>.wav dengan rakaman narator
manusia (nama fail & tempoh yang sama) dan render semula — semua masa
dikawal oleh vo.json.

Keperluan: pip install torch transformers pyworld soundfile librosa scipy
"""
import json, os, sys
import numpy as np, soundfile as sf, librosa, pyworld as pw
from scipy.signal import butter, sosfilt, fftconvolve

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "build", "vo")
SR = 48000

# Skrip voice-over (teks rasmi daripada brief). Setiap baris dipecah kepada
# ayat supaya jeda semula jadi & subtitle diselaraskan per ayat.
VO = {
    "s1": ["Setiap perjalanan mempunyai ceritanya.",
           "Ada jarak yang ditempuh, ada pertemuan yang dinanti,",
           "dan ada pengalaman yang dibawa pulang."],
    "s2": ["Bermula dari Parit,",
           "delegasi Persatuan Halaqat Muqarrabin bersama Jabatan Pilihanraya PAS Parit",
           "meneruskan perjalanan menuju ke negeri Terengganu,",
           "bagi mengikuti program lawatan dan pertemuan."],
    "s3": ["Di sepanjang perjalanan, hadir ruang untuk berbicara, mengenali, dan mengeratkan hubungan.",
           "Kadangkala, kenangan yang paling berharga,",
           "lahir daripada detik-detik yang sederhana."],
    "s5": ["Pertemuan ini membuka ruang untuk mendengar, berbincang, dan berkongsi pengalaman.",
           "Setiap pandangan dan perkongsian,",
           "memberikan perspektif baharu untuk difahami bersama."],
    "s6": ["Bukan hanya pengisian program yang menjadi kenangan.",
           "Pertemuan, senyuman, dan masa yang dilalui bersama,",
           "turut menjadi sebahagian daripada cerita perjalanan ini."],
    "s7": ["Setiap perjalanan akhirnya sampai ke penghujungnya.",
           "Namun, pengalaman dan kenangan yang tercipta, akan terus dibawa pulang.",
           "Dari Parit ke Terengganu,",
           "sebuah perjalanan yang meninggalkan cerita."],
}
# Teks paparan subtitle (ejaan rasmi; "Pilihanraya" dll. kekal)
GAP_SENT = 0.42   # jeda antara ayat (s)
# Ejaan fonetik khusus untuk enjin TTS (subtitle kekal ejaan rasmi)
PRON = {"parit": "paritt", "terengganu": "terengganuu"}


def phon(s):
    s = s.lower()
    for a, b in PRON.items():
        s = s.replace(a, b)
    return s


def bq(x, kind, f, sr, order=2):
    return sosfilt(butter(order, f, kind, fs=sr, output="sos"), x)


def to_male(x, sr):
    x = x.astype(np.float64)
    f0, t = pw.harvest(x, sr, f0_floor=70, f0_ceil=400, frame_period=5.0)
    sp = pw.cheaptrick(x, f0, t, sr)
    ap = pw.d4c(x, f0, t, sr)
    n = sp.shape[1]
    idx = np.arange(n) * 0.88
    sp2 = np.array([np.interp(idx, np.arange(n), r) for r in sp])
    # kurangkan variasi pic sedikit -> nada lebih tenang/matang
    f0m = f0.copy(); v = f0m > 0
    if v.any():
        med = np.median(f0m[v]); f0m[v] = med + (f0m[v] - med) * 0.8
    return pw.synthesize(f0m * 0.60, sp2, ap, sr, frame_period=5.0)


def polish(y, sr):
    y = librosa.resample(y, orig_sr=sr, target_sr=SR)
    y = bq(y, "high", 70, SR)
    # kehangatan: sedikit rangsangan 120-300 Hz, kurangkan 'boxy' 3 kHz
    y = y + 0.35 * bq(y, "band", [110, 320], SR) - 0.12 * bq(y, "band", [2500, 4200], SR)
    # pengujaan harmonik halus untuk 'udara' (MMS hanya 8 kHz lebar jalur)
    air = bq(np.tanh(bq(y, "high", 2500, SR) * 3.0), "high", 7000, SR)
    y = y + 0.05 * air
    # mampatan lembut
    env = np.sqrt(bq(y ** 2, "low", 8, SR).clip(1e-9))
    g = np.minimum(1.0, (env / (env.max() * 0.35)) ** -0.35)
    y = y * g
    return y


def room(y, sec=0.6, wet=0.08):
    r = np.random.default_rng(7); n = int(sec * SR); t = np.arange(n) / SR
    ir = bq(r.standard_normal(n), "low", 4000, SR) * np.exp(-t * 6.9 / sec)
    ir /= np.sqrt((ir ** 2).sum())
    return y * (1 - wet) + fftconvolve(y, ir)[: len(y)] * wet


def main():
    import torch
    from transformers import VitsModel, AutoTokenizer
    os.makedirs(OUT, exist_ok=True)
    model = VitsModel.from_pretrained("facebook/mms-tts-zlm")
    tok = AutoTokenizer.from_pretrained("facebook/mms-tts-zlm")
    model.speaking_rate = 0.86
    model.noise_scale = 0.55
    sr = model.config.sampling_rate
    meta = {}
    for key, sents in VO.items():
        parts, timing, cur = [], [], 0.0
        for i, s in enumerate(sents):
            torch.manual_seed(11 + i)
            with torch.no_grad():
                w = model(**tok(phon(s), return_tensors="pt")).waveform[0].numpy()
            y = polish(to_male(w, sr), sr)
            # pangkas senyap di hujung
            nz = np.where(np.abs(y) > np.abs(y).max() * 0.006)[0]
            y = y[max(0, nz[0] - 1200): nz[-1] + 9600]
            timing.append([round(cur, 3), round(cur + len(y) / SR, 3), s])
            parts.append(y); cur += len(y) / SR
            if i < len(sents) - 1:
                parts.append(np.zeros(int(GAP_SENT * SR))); cur += GAP_SENT
        y = room(np.concatenate(parts))
        y = y / (np.abs(y).max() + 1e-9) * 0.89
        sf.write(os.path.join(OUT, key + ".wav"), y.astype(np.float32), SR)
        meta[key] = {"dur": round(len(y) / SR, 3), "sent": timing}
        print(key, meta[key]["dur"], "s")
    json.dump(meta, open(os.path.join(OUT, "vo.json"), "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
