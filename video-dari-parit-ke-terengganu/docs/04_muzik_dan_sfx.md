# Muzik & Kesan Bunyi

## Skor yang digunakan dalam render

Skor **asli, disintesis sepenuhnya dalam kod** (`scripts/audio.py`) — tiada sampel berhak cipta, bebas royalti.
D major / B minor, 72 bpm. Lapisan: soft piano (arpeggio), inspirational strings (3 suara dinyahtala + vibrato),
cello akar, melodi piano + strings, perkusi lembut (kick & shaker) pada babak berintensiti tinggi,
boom + riser pada pendedahan tajuk. Intensiti mengikut cue:

| Masa | Intensiti | Babak |
|---|---|---|
| 0:00 | 0.25 | pembukaan jarang |
| 0:11 | 0.60 | tajuk (boom) |
| 0:17 | 0.50 | perjalanan |
| 0:41 | 0.60 | sepanjang jalan |
| 1:03 | 0.70 | ketibaan (boom) |
| 1:22 | 0.42 | pertemuan — muzik di bawah ucapan |
| 2:31 | 0.85 | ukhuwah — perkusi masuk (boom) |
| 2:47 | 0.95 | showcase momen (boom) |
| 3:23 | 0.70 | penutup |
| 3:36 | 1.00 | kemuncak tajuk penutup (boom) |
| 3:46 | 0.45 → 0 | tenang & fade |

**Ducking:** muzik turun ke 30% semasa VO dan 16% semasa ucapan sebenar (serangan 0.25 s, lepasan 0.7 s, mula 0.3 s lebih awal).
Kenyaringan akhir ±−16 LUFS (sesuai YouTube/Facebook).

## Bunyi suasana

- Pagi: burung + angin lembut (pembukaan, ketibaan)
- Deruan kenderaan / enjin rendah (peta perjalanan & peta pulang)
- Suasana bilik **sebenar** daripada audio klip video (bilik mesyuarat, perbualan)
- Ucapan sebenar (VID_032159, VID_180420) dengan normalisasi dinamik
- Peralihan: riser udara lembut + boom rendah pada film burn

## Cadangan muzik berlesen (jika mahu ganti skor)

Cari dengan kata kunci *cinematic documentary, emotional piano strings, inspiring travel*:

| Sumber | Lesen | Cadangan carian |
|---|---|---|
| YouTube Audio Library | percuma untuk video YouTube | “Cinematic”, mood *Inspirational / Calm* |
| Pixabay Music | Pixabay Content License (tiada atribusi) | “emotional documentary piano”, “inspiring cinematic strings” |
| Artlist / Musicbed / Epidemic Sound | langganan, lesen komersial & media sosial | “hopeful journey”, “brotherhood orchestral” |
| Facebook Sound Collection | percuma untuk FB/IG | kategori Cinematic |

Elakkan lagu nasyid/komersial berhak cipta tanpa lesen — Facebook/YouTube akan menyekat atau membisukan video.

Untuk tukar: letak fail di `build/audio/main_music.wav` lalu ubah `audio.py` (fungsi `build`) untuk memuatkannya
sebagai ganti `music()`.

## SFX tambahan dicadangkan (pilihan)
Whoosh lembut pada zoom transition, desiran kamera pada montaj foto, gema dewan pada pendedahan TERENGGANU.
