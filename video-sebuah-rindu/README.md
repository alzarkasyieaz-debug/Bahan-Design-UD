# SEBUAH RINDU… Kenangan Indah di Tanah Suci

Filem kenangan umrah sinematik — **3 min 30 s (210 s), 1920×1080 (16:9), 30 fps, H.264 + AAC 256k**, dibina dengan [Remotion](https://www.remotion.dev/).

- **Lagu tema:** "Kita Pernah Bersama" (udcreative) — bahagian 0:00–3:30, fade-in 0.5 s, fade-out 8 s → `public/audio/kita-pernah-bersama-210s.mp3`
- **Foto:** 47 foto sebenar daripada album "Memori USJ 4- 12 Julai 2026" (EXIF/GPS dibuang). Tiada wajah diubah, tiada individu ditambah.
- **Warna:** Warm Gold `#d8b067` · Deep Purple `#2b1548` · Cream White `#f7f0e2`
- **Fon:** Cinzel (tajuk — pengganti terbuka Trajan Pro) · Poppins (subtajuk/naratif) — kedua-duanya SIL OFL

## Storyboard — 12 babak × 17.5 s

| # | Masa | Tajuk | Susun atur & gerakan | Foto |
|---|---|---|---|---|
| 1 | 0:00–0:17 | **SEBUAH RINDU…** / Kenangan Indah Bersama di Tanah Suci | Skrin hitam → slow zoom-in, sinar cahaya emas, lens glow, tajuk 3D | p114 → p046 |
| 2 | 0:17–0:35 | Kita datang dengan kisah berbeza… | Pan sisi, skrin pisah 3 panel, potret 2.5D | p000, p004/p008/p012, p013, p040/p042 |
| 3 | 0:35–0:52 | Menjadi tetamu Allah… satu anugerah. | Slow push-in, pan, skrin pisah | p050, p053, p120/p228 |
| 4 | 0:52–1:10 | Setiap doa… membawa seribu harapan. | Bingkai emas skrin, glow lembut | p028, p223, p232 |
| 5 | 1:10–1:27 | Senyuman ini… akan terus dirindui. | Kolaj bingkai terapung (2 fasa), dolly-in | p226, p064, p075, p077, p168, p178, p072 |
| 6 | 1:27–1:45 | Dari tidak mengenali… menjadi satu keluarga. | Skrin pisah + camera tracking | p051, p110/p093, p230, p059 |
| 7 | 1:45–2:02 | Gelak tawa, cerita dan kenangan… | Mozek 3×2 (flip masuk) → zum ke satu foto | p141, p262, p247, p267, p283, p144 |
| 8 | 2:02–2:20 | Ketenangan… di setiap langkah. | Panorama perlahan, skrin pisah | p135, p146/p153, p129, p203 |
| 9 | 2:20–2:37 | Setiap gambar menyimpan sebuah cerita. | Dinding kenangan 3D (perspektif + parallax) | p077, p226, p053, p262, p139, p131 |
| 10 | 2:37–2:55 | Berat untuk berpisah… | Gerakan diperlahankan, dissolve panjang | p236/p237, p113, p300 |
| 11 | 2:55–3:12 | Semoga Allah menerima segala amalan kita. | Slow zoom-out, sinar cahaya, bingkai emas | p115, p212 |
| 12 | 3:12–3:30 | **KENANGAN INDAH BERSAMA** / Berpisah di dunia… semoga bertemu lagi di Tanah Suci. / Semoga Allah mempertemukan kita kembali. Aamiin. | Montaj 8 foto pantas → foto kumpulan berbingkai emas → fade to black | 8 foto → p046 |

Setiap babak memaparkan teks naratif (voice-over) dalam bentuk sari kata di bawah tajuk.

## Nota penting

- **Voice-over:** lagu tema mempunyai vokal, dan tiada enjin suara (TTS) dalam persekitaran ini, jadi naratif dipaparkan sebagai teks sahaja. Untuk VO sebenar, rakam suara lelaki dan letakkan muzik pada ~25–30% semasa VO (ducking).
- **Lokasi:** album yang dapat diakses (301 foto pertama) tiada foto Kaabah, Masjidil Haram, Masjid Nabawi atau tawaf. Babak 1, 3, 8 dan 11 menggunakan foto yang ada dan teks tidak menamakan Makkah/Madinah. Babak 8 ditukar daripada "Madinah…" kepada "Ketenangan… di setiap langkah."
- **Logo Darul Mubarak:** tidak dimasukkan (tiada fail logo diberikan).
- Potret dipaparkan penuh di atas latar kabur (tiada kepala terpotong). Zum dihadkan ≤ 10%.

Semua teks, foto dan gerakan disunting dalam **`src/data.ts`**.

## Render

```bash
cd video-sebuah-rindu
npm install
npm run studio     # pratonton
npm run render     # -> out/sebuah-rindu-1080p.mp4
```
