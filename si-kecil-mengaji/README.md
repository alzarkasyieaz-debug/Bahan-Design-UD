# Si Kecil Mengaji — MVP Fasa 1

Aplikasi belajar huruf hijaiyah untuk kanak-kanak 3–6 tahun. Mereka belajar melalui
**bunyi, gambar, sentuhan dan permainan**, bukan teks. Aplikasi ini dibina sebagai **PWA**
(Progressive Web App): ia boleh dipasang pada telefon atau tablet, berfungsi **tanpa internet**,
tidak memaparkan iklan, tidak mempunyai pautan keluar, dan tidak memerlukan pelayan.

## Ciri yang sudah siap

| Ciri | Keterangan |
|---|---|
| 🔤 **Kenal huruf** | Sentuh huruf untuk dengar sebutan. Muka kartun menunjukkan zon makhraj (tekak / lidah / bibir) dan mulutnya bergerak semasa audio dimainkan. |
| ✍️ **Surih huruf** | Rangka 28 huruf disusun mengikut turutan tulisan. Ada titik hijau "mula di sini", anak panah bergerak dan titik yang perlu disentuh. Surihan pada arah yang salah tidak dikira. Jika jari terangkat, kemajuan tidak hilang. |
| 🎤 **Rakam & dengar** | Anak merakam suaranya (3 saat), kemudian membandingkannya dengan suara guru. **Ibu bapa yang menilai** (👍 / 🔁), bukan AI. Rakaman hanya disimpan dalam memori dan tidak dimuat naik ke mana-mana. |
| 🎮 **Permainan mini** | *Dengar & pilih* (padankan bunyi dengan huruf), *Tangkap huruf* yang jatuh, dan *Huruf yang hilang* dalam turutan. Huruf yang lemah akan lebih kerap keluar. |
| 🏆 **Ganjaran** | Bintang, 20 pelekat (satu dibuka bagi setiap 5 ⭐) dan maskot anak unta yang membesar dalam 5 peringkat. Pada setiap peringkat ia mendapat selendang, kopiah dan mahkota. |
| ⏱️ **Had masa skrin** | 5 / 10 / 15 / 20 / 30 minit sehari, atau tiada had. Bila masa tamat, maskot "tidur" dan aplikasi terkunci sehingga esok atau sehingga ibu bapa menambah 5 minit. |
| 🔒 **Papan pemuka ibu bapa** | Dikunci dengan soalan tambah. Paparannya: huruf yang dikuasai, bintang, masa penggunaan 7 hari, huruf yang perlu diulang dan jadual kemajuan setiap huruf. Tetapan bahasa dan had masa juga di sini. |
| 🌐 **Dwibahasa** | Suara arahan dalam Bahasa Melayu atau Inggeris. |
| 📴 **Luar talian** | Service worker menyimpan semua fail dalam cache. |

Navigasi menggunakan ikon besar sahaja. Teks kecil di bawah ikon hanya untuk ibu bapa.

Sesuatu huruf dikira **dikuasai** apabila anak sudah mendengarnya, sudah menyurihnya, dan
menjawab betul dalam kuiz sekurang-kurangnya 2 kali.

## Cara menjalankan

Tiada langkah build. Anda hanya perlu menghidangkan folder ini melalui HTTP:

```bash
cd si-kecil-mengaji
python3 -m http.server 8080
# buka http://localhost:8080
```

Mikrofon dan service worker memerlukan **HTTPS** (atau `localhost`). Untuk penggunaan sebenar,
hoskan folder ini di mana-mana hos statik yang menyokong HTTPS, contohnya GitHub Pages, Netlify
atau Cloudflare Pages. Kemudian buka di telefon dan pilih *Add to Home Screen*. Untuk Play Store
atau App Store, PWA ini boleh dibungkus dengan Capacitor atau Trusted Web Activity tanpa menulis
semula kod.

## ⚠️ Audio: perlu dirakam oleh qari/qariah

Fail audio sebenar **belum** disertakan. Sementara itu, aplikasi menggunakan suara peranti
(Text-to-Speech) sebagai sandaran supaya ia masih boleh diuji. Kualiti sebutan Arab TTS
berbeza-beza mengikut peranti dan **tidak sesuai untuk pelancaran**.

Langkah untuk menambah rakaman:

1. Rakam setiap fail dalam format MP3 (mono, 44.1 kHz, ~96 kbps) dan potong senyap di awal dan akhir.
2. Letakkan fail mengikut nama dalam jadual di bawah.
3. Jalankan `python3 tools/buat-manifest-audio.py` untuk mengemas kini `audio/manifest.json`.
4. Naikkan `VERSION` dalam `sw.js` supaya peranti yang sudah memasang aplikasi memuat turun audio baharu.

Aplikasi hanya akan cuba memainkan fail yang tersenarai dalam `audio/manifest.json`. Huruf lain
akan terus menggunakan TTS.

### Sebutan huruf

| Huruf | Nama | Fail |
|---|---|---|
| ا | Alif | `audio/huruf/01-alif.mp3` |
| ب | Ba | `audio/huruf/02-ba.mp3` |
| ت | Ta | `audio/huruf/03-ta.mp3` |
| ث | Tsa | `audio/huruf/04-tsa.mp3` |
| ج | Jim | `audio/huruf/05-jim.mp3` |
| ح | Ha | `audio/huruf/06-ha-besar.mp3` |
| خ | Kho | `audio/huruf/07-kho.mp3` |
| د | Dal | `audio/huruf/08-dal.mp3` |
| ذ | Dzal | `audio/huruf/09-dzal.mp3` |
| ر | Ra | `audio/huruf/10-ra.mp3` |
| ز | Zai | `audio/huruf/11-zai.mp3` |
| س | Sin | `audio/huruf/12-sin.mp3` |
| ش | Syin | `audio/huruf/13-syin.mp3` |
| ص | Sod | `audio/huruf/14-sod.mp3` |
| ض | Dhod | `audio/huruf/15-dhod.mp3` |
| ط | Tho | `audio/huruf/16-tho.mp3` |
| ظ | Zho | `audio/huruf/17-zho.mp3` |
| ع | Ain | `audio/huruf/18-ain.mp3` |
| غ | Ghain | `audio/huruf/19-ghain.mp3` |
| ف | Fa | `audio/huruf/20-fa.mp3` |
| ق | Qof | `audio/huruf/21-qof.mp3` |
| ك | Kaf | `audio/huruf/22-kaf.mp3` |
| ل | Lam | `audio/huruf/23-lam.mp3` |
| م | Mim | `audio/huruf/24-mim.mp3` |
| ن | Nun | `audio/huruf/25-nun.mp3` |
| و | Wau | `audio/huruf/26-wau.mp3` |
| ه | Ha | `audio/huruf/27-ha-kecil.mp3` |
| ي | Ya | `audio/huruf/28-ya.mp3` |

### Suara arahan

Simpan setiap fail sebagai `audio/arahan/ms/<kunci>.mp3` dan `audio/arahan/en/<kunci>.mp3`.
Teks bagi setiap kunci ada dalam `PROMPTS` di `js/data.js`.

Kunci: `halq`, `lisan`, `syafatain`, `welcome`, `tapLetter`, `trace`, `tapDot`, `great`, `tryAgain`, `findThis`, `catchThis`, `missing`, `record`, `compare`, `sticker`, `rest`.

## ⚠️ Semakan kandungan (wajib sebelum pelancaran)

Semua perkara berikut ialah **draf pembangun** dan mesti disahkan oleh ustaz/ustazah bertauliah:

- **Kumpulan makhraj** setiap huruf (`makhraj` dalam `js/data.js`). Zon ini sengaja dipermudahkan kepada tiga (tekak, lidah, bibir) untuk kanak-kanak.
- **Turutan dan arah surihan** setiap huruf (`strokes` dalam `js/data.js`, koordinat dalam kotak 200×200). Bentuk dan arah tulisan mungkin berbeza mengikut kaedah yang digunakan, contohnya Iqra' atau buku tadika tertentu.
- **Nama transliterasi** huruf (contohnya Tsa / Tha, Sod / Shod) supaya selaras dengan kaedah yang dipilih.
- Semua rakaman audio.

## Struktur fail

```
index.html              Rangka aplikasi
manifest.webmanifest    Maklumat PWA (nama, ikon, warna)
sw.js                   Service worker (luar talian)
css/style.css           Gaya (butang besar, animasi)
js/data.js              Kandungan: 28 huruf, makhraj, laluan surihan, arahan, pelekat
js/store.js             Simpanan kemajuan (localStorage, dalam peranti sahaja)
js/audio.js             Main audio + sandaran TTS + bunyi ganjaran
js/trace.js             Enjin surihan (titik semak berturutan)
js/mascot.js            Maskot anak unta (SVG)
js/app.js               Skrin, permainan, ganjaran, papan pemuka, had masa
tools/                  Skrip bantuan (manifest audio)
audio/                  Rakaman (perlu ditambah)
```

## Langkah seterusnya (ikut pelan)

- **Fasa 2:** baris (fathah, kasrah, dhammah) dan sambungan huruf. Struktur `LETTERS` dan permainan boleh diguna semula untuk suku kata seperti بَ بِ بُ.
- **Fasa 3:** surah pendek (Al-Fatihah, 3 Qul), doa harian, lagu hijaiyah, langganan (contohnya RM9.90 sebulan) dan pakej tadika/TASKA dengan beberapa profil anak.
- Simpan rakaman anak dalam IndexedDB jika ibu bapa mahu mendengarnya semula kemudian.
- Uji kebolehgunaan dengan kanak-kanak sebenar, termasuk saiz butang dan toleransi surihan (`TOL` dalam `js/trace.js`).
