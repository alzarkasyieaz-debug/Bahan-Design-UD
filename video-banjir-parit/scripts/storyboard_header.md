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
Gred warna hanya mengubah tona, bukan keadaan.

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
