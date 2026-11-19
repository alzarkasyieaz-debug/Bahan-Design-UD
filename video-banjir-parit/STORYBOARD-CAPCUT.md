# Storyboard Bertimecode & Pelan Suntingan CapCut

**AIR BANJIR MUNGKIN SURUT, NAMUN DUGAAN MEREKA BELUM BERAKHIR…**
Rayuan Sumbangan Mangsa Banjir Parlimen Parit · Pusat Khidmat Masyarakat Ahli Parlimen Parit
9:16 · 1080×1920 · 30 fps · Bahasa Malaysia

> Dokumen ini dijana daripada `src/data/timeline.json` — pemasaan yang sama digunakan oleh render Remotion.
> Jika anda mahu menyunting semula dalam CapCut, ikut jadual di bawah syot demi syot.

## Analisis footaj (12 klip unik, dirakam iPhone, potret)

| Fail | Tempoh | Kandungan | Status |
|---|---|---|---|
| IMG_8273 | 16.8s | Rumah kayu bertiang ditenggelami air, pan ke halaman banjir | ✅ Hook, Babak 2 & 4 |
| IMG_8274 | 1.0s | Wanita meredah banjir (syot lebar) | ⏭ Terlalu pendek — diganti IMG_8275 |
| IMG_8275 | 22.5s | Wanita meredah banjir pulang ke rumah; rumah-rumah beratap merah tenggelam | ✅ Hook, Babak 2, cover (00:21 lelaki merokok — dielak) |
| IMG_8250 | 11.2s | Rumah kampung dinaiki air dari tingkap kenderaan, bendera Malaysia | ✅ Babak 2 |
| IMG_8249 | 27.4s | YB memandu masuk kawasan banjir; kebun pisang & pondok tenggelam | ✅ Babak 2 & 3 |
| IMG_8251 | 33.9s | YB berjalan & bertemu penduduk di jalan kampung, bersalaman, mendengar | ✅ Babak 3 & 6 (00:00–00:02 logo kenderaan — dielak) |
| IMG_8340 | 5.3s | YB meneliti papan INFO BENCANA JKM di PPS (4K) | ✅ Babak 3 |
| IMG_8343 | 9.4s | YB duduk berbual dengan mangsa di khemah NADMA, PPS | ✅ Babak 2 & 3 |
| IMG_8230 | 8.2s | Beg BANTUAN RAKYAT di atas pikap (dekat) | ✅ Babak 5 |
| IMG_8231 | 15.0s | Petugas & sukarelawan menyusun / menghulur beg bantuan | ✅ Babak 5 |
| copy_1760A675 | 20.7s | Suntingan sedia ada (gred hangat): YB serah bantuan di khemah, mangsa, petugas JKM | ✅ Babak 4–6 (00:00–00:03 teks tertanam — dielak; audio muzik asal dimatikan) |
| copy_3598760F | 20.7s | Sama seperti 1760 tetapi dengan kapsyen tertanam | ⏭ Tidak digunakan |

**Etika:** semua syot ialah rakaman sebenar; tiada adegan dijana AI, tiada dialog direka, tiada syot dekat mangsa yang dalam kesusahan.
Gred warna hanya mengubah tona, bukan keadaan. Label "Rakaman sebenar · Parlimen Parit" dipaparkan pada pembukaan.

## Tetapan projek CapCut

1. **Projek baharu → Nisbah 9:16**, resolusi 1080p, 30 fps.
2. Import semua fail `.MOV` asal (atau proksi H.264 dalam `public/footage/`).
3. **Fon:** Poppins ExtraBold (tajuk), SemiBold (subtitle), Medium (label); Cinzel Bold (pengganti Trajan Pro — boleh guna Trajan jika berlesen).
4. **Warna:** putih `#FFFFFF`, emas `#F6C866` → gradien `#FFF1C4 → #F8CF6A → #D99A2B`, panel gelap `#0E1A26` 85%.
5. **Gred (Adjust):**
   - Babak 1–2: Saturation −30, Temp −15, Tint −5, Contrast +6, Brightness −8, Vignette 40.
   - Babak 3–4: Saturation −15, Temp −5 (rona kulit semula jadi).
   - Babak 5–6: Saturation 0, Temp +18, Highlights hangat, tambah overlay emas (Blend: Soft Light 35%).
6. **Peralihan:** Cross-dissolve 0.4s antara semua syot (Transitions → Basic → Mix). Elakkan peralihan flashy.
7. **Animasi teks:** In = "Blur in" / "Rise" 0.5s; Out = "Fade out + blur" 0.3s. Teks utama: tambah Shadow (jarak 8, kabur 20) + Stroke gelap nipis untuk kedalaman 3D.
8. **Overlay:** Effects → "Rain" (opacity 30%) pada 00:00–00:25 & kemuncak 1; "Light Leak"/"Light Sweep" pada setiap tajuk besar; "Bokeh/Gold Particles" (Screen 50%) dari 00:51 hingga akhir; "Film Grain" 8% sepanjang video.
9. **Audio (tiada suara latar):** Muzik −10 dB sebagai pemacu emosi; audio asal footaj 20–35% (bunyi air, suasana PPS); SFX lembut pada teks. Normalize sekitar −14 LUFS untuk TikTok/Reels.
10. **Kapsyen naratif:** Poppins SemiBold 52, putih, bayang hitam lembut; kata kunci emas & 15% lebih besar:
    *diuji, bantuan, keprihatinan, harapan, sumbangan, bersama, membantu, meringankan*. Maksimum 2 baris. Bahagian bawah teks di **y ≈ 1540 px** (380 px dari bawah) — di atas UI TikTok/Reels; jarak kanan 150 px.
11. **Zon selamat:** atas 200 px, bawah 380 px, kanan 150 px kosong daripada teks penting.

## A. VERSI PENUH — 90 SAAT

| # | Masa | Footaj sumber (in → out) | Visual | Kesan & gred |
|---|---|---|---|---|
| | **00:00.00** | **BABAK 1 — HOOK YANG MENYENTUH** | 🎵 Piano melankolik jarang + hujan + nota rendah panjang | |
| 1 | 00:00.00–00:03.80 | `IMG_8273.MOV` 1.0s → 4.8s | Rumah kayu bertiang ditenggelami air | Push-in 104%→112%; Gred: biru-kelabu; Audio asal 35% |
| 2 | 00:03.80–00:08.20 | `IMG_8275.MOV` 0.0s → 3.3s | Wanita meredah banjir pulang ke rumah (slow motion) | Kelajuan 0.75× (slow motion); Push-in 100%→108%; Gred: biru-kelabu; Audio asal 30% |
| | **00:08.20** | **BABAK 2 — REALITI MANGSA BANJIR** | 🎵 Piano jarang, hujan berkurang | |
| 3 | 00:08.20–00:11.60 | `IMG_8250.MOV` 1.5s → 4.9s | Rumah-rumah kampung dinaiki air, bendera Malaysia | Push-in 102%→110%; Gred: biru-kelabu; Audio asal 25% |
| 4 | 00:11.60–00:15.00 | `IMG_8275.MOV` 12.6s → 16.0s | Rumah beratap merah, barang terapung | Pull-out 106%→100%; Gred: biru-kelabu; Audio asal 25% |
| 5 | 00:15.00–00:18.40 | `IMG_8343.MOV` 5.2s → 8.6s | Mangsa di khemah NADMA, PPS | Push-in 100%→106%; Gred: biru-kelabu; Audio asal 20% |
| 6 | 00:18.40–00:21.60 | `IMG_8249.MOV` 12.0s → 15.2s | Kebun pisang tenggelam (dari kenderaan) | Push-in 100%→107%; Gred: biru-kelabu; Audio asal 20% |
| 7 | 00:21.60–00:25.00 | `IMG_8273.MOV` 12.0s → 15.4s | Halaman rumah dinaiki air | Push-in 100%→110%; Gred: biru-kelabu; Audio asal 25% |
| | **00:25.00** | **BABAK 3 — YB USTAZ ISMI BERSAMA RAKYAT** | 🎵 Strings hangat masuk, arpeggio piano | |
| 8 | 00:25.00–00:29.00 | `IMG_8249.MOV` 2.5s → 6.5s | YB memandu masuk ke kawasan banjir | Push-in 100%→106%; Gred: semula jadi; Audio asal 15% |
| 9 | 00:29.00–00:33.00 | `IMG_8251.MOV` 3.0s → 7.0s | YB berjalan ke arah penduduk | Push-in 100%→105%; Gred: semula jadi; Audio asal 30% |
| 10 | 00:33.00–00:37.20 | `IMG_8251.MOV` 12.5s → 16.7s | YB bersalaman & mendengar penduduk | Push-in 104%→110%; Gred: semula jadi; Audio asal 35% |
| 11 | 00:37.20–00:40.20 | `IMG_8340.MOV` 0.0s → 3.0s | YB meneliti papan INFO BENCANA JKM di PPS | Push-in 100%→106%; Gred: semula jadi; Audio asal 20% |
| 12 | 00:40.20–00:43.60 | `IMG_8343.MOV` 0.3s → 3.7s | YB duduk mendengar mangsa di PPS | Push-in 100%→108%; Gred: semula jadi; Audio asal 30% |
| | **00:43.60** | **BABAK 4 — SENTUH HATI MEREKA (KEMUNCAK)** | 🎵 Kebangkitan emosi + perkusi lembut, impak pada setiap baris | |
| 13 | 00:43.60–00:50.40 | `IMG_8273.MOV` 4.0s → 8.8s | Rumah tenggelam — latar teks kemuncak 1 | Kelajuan 0.7× (slow motion); Push-in 100%→115%; Gelap 35%; Gred: semula jadi; Audio asal 25% |
| 14 | 00:50.40–00:58.00 | `copy_1760A675….mov` 9.6s → 14.2s | YB menghulurkan bantuan kepada mangsa di khemah — latar teks kemuncak 2 | Kelajuan 0.6× (slow motion); Push-in 100%→110%; Gelap 30%; Gred: semula jadi; Audio asal: senyap |
| | **00:58.00** | **BABAK 5 — SERUAN KEMANUSIAAN** | 🎵 Progresi orkestra penuh harapan (F–C–Dm–Bb) | |
| 15 | 00:58.00–01:01.80 | `IMG_8231.MOV` 0.3s → 4.1s | Petugas menyusun beg bantuan di atas pikap | Push-in 100%→106%; Gred: keemasan; Audio asal 20% |
| 16 | 01:01.80–01:05.00 | `IMG_8230.MOV` 1.6s → 4.8s | Beg BANTUAN RAKYAT Parlimen Parit | Pull-out 108%→100%; Gelap 15%; Gred: keemasan; Audio asal 20% |
| 17 | 01:05.00–01:08.80 | `IMG_8231.MOV` 8.4s → 12.2s | Sukarelawan menghulur beg bantuan | Push-in 100%→106%; Gelap 15%; Gred: keemasan; Audio asal 20% |
| 18 | 01:08.80–01:13.00 | `copy_1760A675….mov` 14.2s → 16.5s | Mangsa di khemah PPS | Kelajuan 0.55× (slow motion); Push-in 100%→106%; Gred: keemasan; Audio asal: senyap |
| 19 | 01:13.00–01:15.80 | `IMG_8251.MOV` 30.8s → 33.6s | YB tersenyum bersama penduduk | Push-in 100%→105%; Gred: keemasan; Audio asal 20% |
| 20 | 01:15.80–01:17.40 | `copy_1760A675….mov` 17.1s → 18.7s | Petugas PPS JKM tersenyum | Push-in 100%→104%; Gred: keemasan; Audio asal: senyap |
| | **01:17.40** | **BABAK 6 — CTA SUMBANGAN & PENUTUP** | 🎵 Resolusi hangat Fadd9, riser → impak pada kad, shimmer pada QR | |
| 21 | 01:17.40–01:30.00 | `copy_1760A675….mov` 8.0s → 14.3s | Latar kabur — kad sumbangan | Kelajuan 0.5× (slow motion); Push-in 110%→118%; Blur 22; Gelap 55%; Gred: keemasan; Audio asal: senyap |

**Grafik gerak & teks**

| Masa | Jenis | Teks | Animasi |
|---|---|---|---|
| 00:00.40–00:07.80 | LABEL | ● Rakaman sebenar · Parlimen Parit | Pudar masuk/keluar, titik merah berdenyut |
| 00:00.60–00:03.60 | HERO | SEKELIP MATA… | Perkataan demi perkataan: blur→tajam, naik dari bawah, kedalaman 3D, sapuan cahaya + impak |
| 00:03.90–00:07.90 | HERO | KEHIDUPAN / MEREKA BERUBAH. | Perkataan demi perkataan: blur→tajam, naik dari bawah, kedalaman 3D, sapuan cahaya + impak |
| 00:08.60–00:11.40 | KEYWORD | RUMAH TERJEJAS | Garis emas mengembang atas & bawah, huruf jarak lebar, whoosh lembut |
| 00:15.30–00:18.20 | KEYWORD | KELUARGA DIUJI | Garis emas mengembang atas & bawah, huruf jarak lebar, whoosh lembut |
| 00:18.80–00:21.40 | KEYWORD | KEHIDUPAN TERGANGGU | Garis emas mengembang atas & bawah, huruf jarak lebar, whoosh lembut |
| 00:25.80–00:31.60 | LOWER-THIRD | YB USTAZ MUHAMMAD ISMI MAT TAIB / Ahli Parlimen Parit | Bar emas tumbuh, panel kaca sapu dari kiri |
| 00:44.20–00:50.20 | CLIMAX | KITA MUNGKIN / TIDAK MAMPU / MENGHENTIKAN / HUJAN… | Baris demi baris diselaraskan dengan narasi, baris emas = 3D emas, impak muzik |
| 00:51.00–00:57.60 | CLIMAX | TAPI KITA / MAMPU / MERINGANKAN / BEBAN. | Baris demi baris diselaraskan dengan narasi, baris emas = 3D emas, impak muzik |
| 01:01.90–01:10.40 | KAUNTER | RM10 · RM20 · RM50 | Pop spring + angka berdetik naik, 3D emas, ding setiap 1.5s |
| 01:06.60–01:10.40 | SUPPORT | ATAU BERAPA SAHAJA / YANG TERMAMPU… | Naik + blur→tajam; baris emas bergradien |
| 01:10.60–01:13.00 | SUPPORT | SETIAP SUMBANGAN / AMAT BERMAKNA. | Naik + blur→tajam; baris emas bergradien |
| 01:17.40–01:27.00 | KAD CTA | BANTUAN BANJIR / PARLIMEN PARIT / AYUH KITA BANTU MEREKA! + QR + akaun + pautan + hubungan | Kad spring masuk, butiran berperingkat, QR pop + shimmer, butang berdenyut |
| 01:27.00–01:30.00 | PENUTUP | BERSAMA MERINGANKAN BEBAN / PUSAT KHIDMAT MASYARAKAT AHLI PARLIMEN PARIT | Cinzel emas, jarak huruf merapat perlahan, pudar ke hitam |

**Kapsyen naratif** (video tanpa suara latar — teks ini dipaparkan pada skrin sebagai penceritaan)

| # | Mula | Tempoh | Teks | Paparan |
|---|---|---|---|---|
| 01 | 00:00.90 | 6.9s | Bayangkan… saat kita masih lena di rumah sendiri, ada saudara kita yang terpaksa meninggalkan kediaman demi keselamatan. | Kapsyen bawah |
| 02 | 00:09.00 | 13.6s | Banjir bukan sekadar air yang melimpah. Di sebaliknya, ada keluarga yang diuji… ada rutin kehidupan yang terhenti… dan ada hati yang sedang mencari kekuatan untuk meneruskan hari. | Kapsyen bawah |
| 03 | 00:25.60 | 10.6s | Di Parlimen Parit, YB Ustaz Muhammad Ismi Mat Taib turun meninjau Pusat Pemindahan Sementara, bertemu penduduk yang terjejas, dan mendengar sendiri keadaan yang sedang mereka hadapi. | Kapsyen bawah |
| 04 | 00:36.80 | 6.4s | Di sebalik setiap pertemuan… ada kisah yang perlu didengari. Ada keperluan yang harus dibantu. | Kapsyen bawah |
| 05 | 00:44.40 | 9.0s | Mungkin kita tidak mampu menghentikan hujan… [JEDA] Tetapi kita mampu meringankan beban mereka. | Diganti teks kinetik besar |
| 06 | 00:58.40 | 9.2s | Hari ini, mereka tidak meminta kemewahan. Mereka memerlukan bantuan, keprihatinan… dan keyakinan bahawa mereka tidak bersendirian. | Kapsyen bawah |
| 07 | 01:08.20 | 4.6s | Kecil pada nilai kita… mungkin besar maknanya buat mereka. | Kapsyen bawah |
| 08 | 01:17.60 | 5.2s | Marilah kita bersama-sama membantu saudara kita yang sedang diuji. | Kapsyen bawah |
| 09 | 01:23.20 | 5.4s | Kerana apabila kita berkongsi rezeki… kita turut berkongsi harapan. | Kapsyen bawah |

## B. VERSI IKLAN — 30 SAAT

| # | Masa | Footaj sumber (in → out) | Visual | Kesan & gred |
|---|---|---|---|---|
| 1 | 00:00.00–00:03.20 | `IMG_8273.MOV` 1.0s → 4.2s |  | Push-in 104%→112%; Gred: biru-kelabu; Audio asal 35% |
| 2 | 00:03.20–00:07.60 | `IMG_8275.MOV` 0.0s → 3.3s |  | Kelajuan 0.75× (slow motion); Push-in 100%→108%; Gred: biru-kelabu; Audio asal 30% |
| 3 | 00:07.60–00:10.80 | `IMG_8251.MOV` 12.5s → 15.7s |  | Push-in 104%→110%; Gred: semula jadi; Audio asal 30% |
| 4 | 00:10.80–00:15.00 | `IMG_8343.MOV` 0.3s → 3.7s |  | Kelajuan 0.8× (slow motion); Push-in 100%→110%; Gelap 35%; Gred: semula jadi; Audio asal 20% |
| 5 | 00:15.00–00:18.20 | `copy_1760A675….mov` 9.6s → 11.8s |  | Kelajuan 0.7× (slow motion); Push-in 100%→108%; Gelap 30%; Gred: keemasan; Audio asal: senyap |
| 6 | 00:18.20–00:21.20 | `IMG_8231.MOV` 8.4s → 11.4s |  | Push-in 100%→106%; Gelap 15%; Gred: keemasan; Audio asal 20% |
| 7 | 00:21.20–00:30.00 | `copy_1760A675….mov` 8.0s → 12.4s |  | Kelajuan 0.5× (slow motion); Push-in 110%→118%; Blur 22; Gelap 55%; Gred: keemasan; Audio asal: senyap |

**Grafik gerak & teks**

| Masa | Jenis | Teks | Animasi |
|---|---|---|---|
| 00:00.30–00:07.40 | LABEL | ● Rakaman sebenar · Parlimen Parit | Pudar masuk/keluar, titik merah berdenyut |
| 00:00.40–00:03.10 | HERO | SEKELIP MATA… | Perkataan demi perkataan: blur→tajam, naik dari bawah, kedalaman 3D, sapuan cahaya + impak |
| 00:03.40–00:07.40 | HERO | KEHIDUPAN / MEREKA BERUBAH. | Perkataan demi perkataan: blur→tajam, naik dari bawah, kedalaman 3D, sapuan cahaya + impak |
| 00:07.90–00:10.70 | LOWER-THIRD | YB USTAZ MUHAMMAD ISMI MAT TAIB / Ahli Parlimen Parit | Bar emas tumbuh, panel kaca sapu dari kiri |
| 00:11.00–00:14.60 | CLIMAX | KITA MUNGKIN / TIDAK MAMPU / MENGHENTIKAN / HUJAN… | Baris demi baris diselaraskan dengan narasi, baris emas = 3D emas, impak muzik |
| 00:14.90–00:18.00 | CLIMAX | TAPI KITA / MAMPU / MERINGANKAN / BEBAN. | Baris demi baris diselaraskan dengan narasi, baris emas = 3D emas, impak muzik |
| 00:18.30–00:21.10 | KAUNTER | RM10 · RM20 · RM50 | Pop spring + angka berdetik naik, 3D emas, ding setiap 0.7s |
| 00:21.20–00:30.00 | KAD CTA | BANTUAN BANJIR / PARLIMEN PARIT / AYUH KITA BANTU MEREKA! + QR + akaun + pautan + hubungan | Kad spring masuk, butiran berperingkat, QR pop + shimmer, butang berdenyut |

**Kapsyen naratif** (video tanpa suara latar — teks ini dipaparkan pada skrin sebagai penceritaan)

| # | Mula | Tempoh | Teks | Paparan |
|---|---|---|---|---|
| 01 | 00:00.50 | 7.0s | Bayangkan… saat kita masih lena di rumah sendiri, ada saudara kita yang terpaksa meninggalkan kediaman demi keselamatan. | Kapsyen bawah |
| 05 | 00:11.10 | 7.0s | Mungkin kita tidak mampu menghentikan hujan… [JEDA] Tetapi kita mampu meringankan beban mereka. | Diganti teks kinetik besar |
| 08 | 00:18.30 | 5.0s | Marilah kita bersama-sama membantu saudara kita yang sedang diuji. | Kapsyen bawah |
| 09 | 00:23.80 | 5.6s | Kerana apabila kita berkongsi rezeki… kita turut berkongsi harapan. | Kapsyen bawah |
