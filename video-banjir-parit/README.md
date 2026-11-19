# Air Banjir Mungkin Surut, Namun Dugaan Mereka Belum Berakhir…

Video rayuan sumbangan mangsa banjir **Parlimen Parit** (Pusat Khidmat Masyarakat Ahli Parlimen Parit).
Dibina dengan [Remotion](https://www.remotion.dev/) daripada **footaj sebenar** yang dibekalkan.

| Fail | Keterangan |
|---|---|
| `out/rayuan-banjir-parit-90s.mp4` | Versi penuh 90 s, 1080×1920, 30 fps, H.264/AAC |
| `out/rayuan-banjir-parit-30s.mp4` | Versi iklan media sosial 30 s |
| `out/cover-9x16.png` | Cover "BANJIR MELANDA, MEREKA PERLUKAN KITA!" |
| `STORYBOARD-CAPCUT.md` | Storyboard bertimecode + pelan suntingan CapCut (setiap syot, teks, muzik, peralihan) |
| `SKRIP-SUARA-LATAR.md` | Skrip suara latar (pilihan — versi semasa tanpa narasi) |

## Status

- **Tanpa suara latar (keputusan penganjur).** Cerita disampaikan melalui muzik, audio asal footaj, teks kinetik dan
  kapsyen naratif pada skrin — sesuai untuk tontonan tanpa bunyi di media sosial.
  (Jika kelak mahu menambah narasi: simpan `public/audio/vo/vo-01` … `vo-09` mengikut `SKRIP-SUARA-LATAR.md` dan render semula —
  muzik akan diperlahankan secara automatik.)
- **Maklumat sumbangan (dibekalkan penganjur):** Bantuan Banjir Parit · Pusat Khidmat Masyarakat Ahli Parlimen Parit ·
  Bank Islam 08086010044018 · Hubungi Haji Zawawi Ghazali 017-542 9662. Tiada QR atau pautan (tidak diperlukan).
  Untuk mengubahnya, sunting `src/data/donation.ts` dan render semula.
- **Tarikh footaj:** metadata klip menunjukkan rakaman pada 25 Oktober 2025. Sahkan sebelum siaran jika rayuan ini untuk banjir yang lebih baharu.

## Render semula

```bash
cd video-banjir-parit
npm install
pip install numpy scipy                  # untuk penjana audio
# Footaj: tukar fail .MOV asal kepada proksi H.264 1080x1920 dalam public/footage/<nombor>.mp4
#   ffmpeg -i IMG_8273.MOV -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30" \
#          -c:v libx264 -crf 19 -g 15 -c:a aac public/footage/8273.mp4      (copy_1760A675.mov -> 1760.mp4)
npm run audio                            # jana semula muzik & SFX (pilihan — fail disertakan)
npm run render                           # 90 s
npm run render:30                        # 30 s
npm run cover                            # cover PNG
python3 scripts/make_storyboard.py       # kemas kini storyboard selepas mengubah timeline
```

Tanpa internet untuk Chrome Headless Shell: `REMOTION_BROWSER=/path/ke/chrome-headless-shell npm run render`.

## Struktur

```
src/data/timeline.json   SUMBER TUNGGAL: syot (fail, in-point, kelajuan, zoom, gred), teks, slot VO, CTA — dibaca oleh video & penjana audio
src/data/script.ts       Teks subtitle per klip VO, kata kunci emas
src/data/donation.ts     Maklumat sumbangan rasmi (isi sebelum siaran)
src/components/          Footage (gred + dissolve), FX (hujan, partikel emas, jalur cahaya, grain), Typography, Cta
scripts/generate_audio.py  Muzik piano + strings + perkusi & SFX — 100% disintesis, bebas hak cipta
```

## Etika & ketelusan

- Semua visual ialah rakaman sebenar; tiada adegan AI, tiada dialog atau testimoni direka.
- Gred warna hanya mengubah tona; tiada manipulasi keadaan.
- Tiada slogan parti atau rayuan pilihan raya. Fokus pada mangsa dan keperluan bantuan.
- Klip `copy_3598760F` (berkapsyen tertanam) dan bahagian berteks/berlogo lain tidak digunakan.
- **Fon:** Poppins & Cinzel (SIL OFL). Cinzel ialah pengganti Trajan Pro yang berlesen komersial.
