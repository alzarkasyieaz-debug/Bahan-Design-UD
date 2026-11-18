# SEBUAH RINDU… Kenangan Indah di Tanah Suci

Filem kenangan umrah sinematik — **3 min 30 s (210 s), 1920×1080 (16:9), 30 fps, H.264 + AAC 256k**, dibina dengan [Remotion](https://www.remotion.dev/).

- **Lagu tema:** "Kita Pernah Bersama" (udcreative) — bahagian 0:00–3:30, fade-in 0.5 s, fade-out 8 s → `public/audio/kita-pernah-bersama-210s.mp3`
- **Foto:** 52 foto sebenar daripada album "Memori USJ 4- 12 Julai 2026" (EXIF/GPS dibuang). Tiada wajah diubah, tiada individu ditambah.
- **Warna:** Warm Gold `#d8b067` · Deep Purple `#2b1548` · Cream White `#f7f0e2`
- **Fon:** Cinzel (tajuk — pengganti terbuka Trajan Pro) · Poppins (subtajuk/naratif) — kedua-duanya SIL OFL

## Storyboard — 12 babak × 17.5 s

Setiap babak menggabungkan **momen ramai-ramai** (foto kumpulan) dan **momen individu** yang menyentuh perasaan.
Susun atur baharu **"Ramai & Individu"** memaparkan kedua-duanya dalam satu bingkai (kumpulan di kiri, potret individu di kanan).

| # | Masa | Tajuk | Momen ramai-ramai | Momen individu | Susun atur & gerakan |
|---|---|---|---|---|---|
| 1 | 0:00–0:17 | **SEBUAH RINDU…** / Kenangan Indah Bersama di Tanah Suci | p046 foto kumpulan | p114 jemaah merenung dari menara | Skrin hitam → slow zoom-in, sinar cahaya, lens glow, tajuk 3D |
| 2 | 0:17–0:35 | Kita datang dengan kisah berbeza… | p013 barisan di lapangan terbang | p000 pelukan perpisahan, p025 ibu menanti dengan tenang | Pan sisi, skrin pisah 3 panel, Ramai & Individu |
| 3 | 0:35–0:52 | Menjadi tetamu Allah… satu anugerah. | p050, p053 | p163 pemuda memandang jauh, p112 senyuman warga emas | Push-in, Ramai & Individu, skrin pisah |
| 4 | 0:52–1:10 | Setiap doa… membawa seribu harapan. | p232 mendengar tazkirah | p028 taklimat, p218 pemuda di ambang pintu, p223 mutawif | Bingkai emas skrin, glow lembut |
| 5 | 1:10–1:27 | Senyuman ini… akan terus dirindui. | p226, p064, p075 | p264, p168, p107, p266 | Kolaj terapung 2 fasa: kumpulan → individu |
| 6 | 1:27–1:45 | Dari tidak mengenali… menjadi satu keluarga. | p051, p230 | **p196 jemaah berlutut menemani warga emas**, p069 pasangan suami isteri | Push-in perlahan, Ramai & Individu, skrin pisah |
| 7 | 1:45–2:02 | Gelak tawa, cerita dan kenangan… | p262, p247, p267 | p141 unta, p292 membelai kuda, p144 teropong | Mozek 3×2 (flip masuk) → zum ke satu foto |
| 8 | 2:02–2:20 | Ketenangan… di setiap langkah. | p135 | p089 membelai kucing, p201/p153 berjalan sendiri, p279 warga emas duduk tenang | Panorama perlahan, potret 2.5D |
| 9 | 2:20–2:37 | Setiap gambar menyimpan sebuah cerita. | p077, p226, p053, p139 | p264, p069 | Dinding kenangan 3D (perspektif + parallax) |
| 10 | 2:37–2:55 | Berat untuk berpisah… | p236/p237, p046 | p113 warga emas dipimpin berjalan, p300 | Gerakan diperlahankan, Ramai & Individu |
| 11 | 2:55–3:12 | Semoga Allah menerima segala amalan kita. | p212 | p115 jemaah merenung | Slow zoom-out, sinar cahaya, bingkai emas |
| 12 | 3:12–3:30 | **KENANGAN INDAH BERSAMA** / Berpisah di dunia… semoga bertemu lagi di Tanah Suci. / Semoga Allah mempertemukan kita kembali. Aamiin. | Montaj selang-seli kumpulan ↔ individu → p046 | p196, p163, p089, p218 | Montaj pantas → foto kumpulan berbingkai emas → fade to black |

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
