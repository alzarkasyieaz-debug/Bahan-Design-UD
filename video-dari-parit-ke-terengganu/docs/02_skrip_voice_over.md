# Skrip Voice-Over Lengkap

**Gaya:** narator lelaki Melayu dewasa, matang, tenang, berkarisma; tempo perlahan dengan jeda.
**Masa** merujuk kepada versi utama 16:9 (lihat `docs/timeline_main.md`).

| Scene | Masuk | Tempoh | Skrip |
|---|---|---|---|
| 1 — Pembukaan | 0:01.3 | 9.5 s | Setiap perjalanan mempunyai ceritanya. *(jeda)* Ada jarak yang ditempuh, ada pertemuan yang dinanti, dan ada pengalaman yang dibawa pulang. |
| 2 — Perjalanan bermula | 0:19.2 | 15.0 s | Bermula dari Parit, *(jeda)* delegasi Persatuan Halaqat Muqarrabin bersama Jabatan Pilihanraya PAS Parit meneruskan perjalanan menuju ke negeri Terengganu, bagi mengikuti program lawatan dan pertemuan. |
| 3 — Bukan sekadar perjalanan | 0:44.6 | 11.3 s | Di sepanjang perjalanan, hadir ruang untuk berbicara, mengenali, dan mengeratkan hubungan. *(jeda)* Kadangkala, kenangan yang paling berharga, lahir daripada detik-detik yang sederhana. |
| 4 — Ketibaan | — | — | *(tiada VO — biarkan muzik, bunyi suasana dan pendedahan lokasi bercerita)* |
| 5 — Pertemuan | 1:39.2 | 13.5 s | Pertemuan ini membuka ruang untuk mendengar, berbincang, dan berkongsi pengalaman. *(jeda)* Setiap pandangan dan perkongsian, memberikan perspektif baharu untuk difahami bersama. |
| 6 — Ukhuwah | 2:36.2 | 12.2 s | Bukan hanya pengisian program yang menjadi kenangan. *(jeda)* Pertemuan, senyuman, dan masa yang dilalui bersama, turut menjadi sebahagian daripada cerita perjalanan ini. |
| 7 — Penutup | 3:25.6 | 14.8 s | Setiap perjalanan akhirnya sampai ke penghujungnya. *(jeda)* Namun, pengalaman dan kenangan yang tercipta, akan terus dibawa pulang. *(jeda panjang)* Dari Parit ke Terengganu, *(jeda)* sebuah perjalanan yang meninggalkan cerita. |

## Petikan ucapan sebenar (audio asal rakaman)

| Masa | Fail | Petikan dipaparkan | Status |
|---|---|---|---|
| 1:26.3–1:32.7 | VID_20260922_032159 (0.8–7.2 s) | “Pada tengah hari ini, kita dapat berjumpa…” | ASR yakin tinggi (0.86–0.98 per perkataan) |
| 2:02.5–2:14.5 | VID_20261126_180420 (2.7–14.7 s) — **YB Ustaz Ismi** | “Terima kasih kepada…” / “…atas pembentangan yang, bagi saya, jelas…” | **Perlu semakan telinga**: perkataan “pembentangan” disimpulkan daripada ASR (“pernetangan”) |

Rakaman lain (VID_180554, 180715, 180740, 181932, 181954) mempunyai pertuturan jarak jauh yang tidak cukup
jelas untuk dipetik dengan tepat — digunakan hanya sebagai bunyi suasana bilik.

## Rakaman suara

Versi yang dirender menggunakan **suara sintetik** (Meta MMS-TTS Bahasa Melayu + penukaran suara lelaki
matang dengan vokoder WORLD), disahkan jelas melalui ujian pengecaman pertuturan. Untuk siaran rasmi,
disyorkan merakam narator manusia:

1. Rakam setiap baris di atas sebagai `build/vo/s1.wav … s7.wav` (48 kHz mono, jeda ±0.4 s antara ayat).
2. Kemas kini masa ayat dalam `build/vo/vo.json` (atau jalankan semula `scripts/vo.py` untuk templat).
3. `python3 scripts/audio.py main && python3 scripts/render.py main`.
