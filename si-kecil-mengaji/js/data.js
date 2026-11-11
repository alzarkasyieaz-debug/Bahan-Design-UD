/*
 * Data kandungan: 28 huruf hijaiyah.
 *
 * PENTING: Sebutan, kumpulan makhraj dan arah surihan di sini ialah draf
 * awal. Semuanya MESTI disemak oleh ustaz/ustazah bertauliah sebelum
 * dilancarkan. Lihat README.md bahagian "Semakan kandungan".
 *
 * Koordinat surihan berada dalam kotak 200 x 200 (paksi y ke bawah).
 * Setiap huruf ada senarai "strokes" mengikut turutan tulisan:
 *   { d: "<laluan SVG>" }        -> garisan yang perlu diikut dengan jari
 *   { dot: [x, y] }              -> titik yang perlu disentuh
 */

// Bentuk asas (rangka) yang dikongsi oleh beberapa huruf.
const BASE = {
  alif: 'M100 32 L100 158',
  ba: 'M168 96 Q170 132 140 132 L62 132 Q34 132 33 100',
  jim: 'M74 64 Q110 50 146 60 L72 104 Q38 130 58 160 Q84 184 152 172',
  dal: 'M84 70 Q122 100 126 122 Q127 136 110 136 L70 136',
  ra: 'M132 88 Q138 130 112 154 Q90 172 58 168',
  sin: 'M182 100 Q180 132 166 132 Q152 132 152 106 Q152 132 138 132 Q125 132 125 104 L125 124 Q125 166 86 166 Q46 166 42 124',
  sad: 'M110 130 Q114 88 156 88 Q186 90 179 116 Q172 132 110 130 Q98 130 98 108 L98 126 Q98 166 62 166 Q28 166 26 126',
  taLoop: 'M58 132 Q70 92 120 92 Q160 95 152 120 Q142 134 58 132',
  taStem: 'M78 38 L78 128',
  ain: 'M142 70 Q116 48 98 66 Q86 86 122 98 L138 100 Q76 100 62 136 Q55 172 148 172',
  fa: 'M156 110 Q144 80 165 78 Q183 80 179 106 Q176 132 150 132 L62 132 Q34 132 33 100',
  qaf: 'M142 102 Q130 72 152 70 Q174 72 169 100 Q166 124 150 136 Q120 170 82 165 Q46 158 50 116',
  kaf: 'M152 40 L152 120 Q152 134 136 134 L62 134 Q38 134 37 106',
  kafHamza: 'M86 92 Q104 80 100 96 Q96 108 114 100',
  lam: 'M136 30 L136 126 Q136 166 96 166 Q56 166 55 126',
  mim: 'M128 130 Q104 114 118 94 Q144 84 150 110 Q150 132 126 132 L88 132 Q76 134 76 152 L76 184',
  nun: 'M150 94 Q156 122 145 146 Q126 170 90 165 Q55 158 54 118',
  waw: 'M132 128 Q108 112 122 90 Q146 82 147 112 Q146 146 116 166 Q96 176 66 170',
  ha: 'M100 56 Q150 66 150 110 Q150 148 104 148 Q58 148 58 110 Q60 70 100 56',
  haIn: 'M102 98 Q82 120 102 134 Q120 120 102 98',
  ya: 'M146 78 Q112 70 114 98 Q118 120 150 122 Q172 128 160 148 Q144 168 92 166 Q50 160 48 130',
};

const LETTERS = [
  { id: 1,  char: 'ا', name: 'Alif',  slug: 'alif',  ar: 'أَلِف', makhraj: 'halq',
    strokes: [{ d: BASE.alif }] },
  { id: 2,  char: 'ب', name: 'Ba',    slug: 'ba',    ar: 'بَاء', makhraj: 'syafatain',
    strokes: [{ d: BASE.ba }, { dot: [100, 160] }] },
  { id: 3,  char: 'ت', name: 'Ta',    slug: 'ta',    ar: 'تَاء', makhraj: 'lisan',
    strokes: [{ d: BASE.ba }, { dot: [112, 100] }, { dot: [88, 100] }] },
  { id: 4,  char: 'ث', name: 'Tsa',   slug: 'tsa',   ar: 'ثَاء', makhraj: 'lisan',
    strokes: [{ d: BASE.ba }, { dot: [112, 104] }, { dot: [88, 104] }, { dot: [100, 82] }] },
  { id: 5,  char: 'ج', name: 'Jim',   slug: 'jim',   ar: 'جِيم', makhraj: 'lisan',
    strokes: [{ d: BASE.jim }, { dot: [104, 136] }] },
  { id: 6,  char: 'ح', name: 'Ha',    slug: 'ha-besar', ar: 'حَاء', makhraj: 'halq',
    strokes: [{ d: BASE.jim }] },
  { id: 7,  char: 'خ', name: 'Kho',   slug: 'kho',   ar: 'خَاء', makhraj: 'halq',
    strokes: [{ d: BASE.jim }, { dot: [104, 34] }] },
  { id: 8,  char: 'د', name: 'Dal',   slug: 'dal',   ar: 'دَال', makhraj: 'lisan',
    strokes: [{ d: BASE.dal }] },
  { id: 9,  char: 'ذ', name: 'Dzal',  slug: 'dzal',  ar: 'ذَال', makhraj: 'lisan',
    strokes: [{ d: BASE.dal }, { dot: [86, 44] }] },
  { id: 10, char: 'ر', name: 'Ra',    slug: 'ra',    ar: 'رَاء', makhraj: 'lisan',
    strokes: [{ d: BASE.ra }] },
  { id: 11, char: 'ز', name: 'Zai',   slug: 'zai',   ar: 'زَاي', makhraj: 'lisan',
    strokes: [{ d: BASE.ra }, { dot: [130, 62] }] },
  { id: 12, char: 'س', name: 'Sin',   slug: 'sin',   ar: 'سِين', makhraj: 'lisan',
    strokes: [{ d: BASE.sin }] },
  { id: 13, char: 'ش', name: 'Syin',  slug: 'syin',  ar: 'شِين', makhraj: 'lisan',
    strokes: [{ d: BASE.sin }, { dot: [166, 80] }, { dot: [140, 80] }, { dot: [153, 60] }] },
  { id: 14, char: 'ص', name: 'Sod',   slug: 'sod',   ar: 'صَاد', makhraj: 'lisan',
    strokes: [{ d: BASE.sad }] },
  { id: 15, char: 'ض', name: 'Dhod',  slug: 'dhod',  ar: 'ضَاد', makhraj: 'lisan',
    strokes: [{ d: BASE.sad }, { dot: [146, 64] }] },
  { id: 16, char: 'ط', name: 'Tho',   slug: 'tho',   ar: 'طَاء', makhraj: 'lisan',
    strokes: [{ d: BASE.taLoop }, { d: BASE.taStem }] },
  { id: 17, char: 'ظ', name: 'Zho',   slug: 'zho',   ar: 'ظَاء', makhraj: 'lisan',
    strokes: [{ d: BASE.taLoop }, { d: BASE.taStem }, { dot: [116, 66] }] },
  { id: 18, char: 'ع', name: 'Ain',   slug: 'ain',   ar: 'عَيْن', makhraj: 'halq',
    strokes: [{ d: BASE.ain }] },
  { id: 19, char: 'غ', name: 'Ghain', slug: 'ghain', ar: 'غَيْن', makhraj: 'halq',
    strokes: [{ d: BASE.ain }, { dot: [116, 34] }] },
  { id: 20, char: 'ف', name: 'Fa',    slug: 'fa',    ar: 'فَاء', makhraj: 'syafatain',
    strokes: [{ d: BASE.fa }, { dot: [166, 54] }] },
  { id: 21, char: 'ق', name: 'Qof',   slug: 'qof',   ar: 'قَاف', makhraj: 'lisan',
    strokes: [{ d: BASE.qaf }, { dot: [164, 46] }, { dot: [142, 46] }] },
  { id: 22, char: 'ك', name: 'Kaf',   slug: 'kaf',   ar: 'كَاف', makhraj: 'lisan',
    strokes: [{ d: BASE.kaf }, { d: BASE.kafHamza }] },
  { id: 23, char: 'ل', name: 'Lam',   slug: 'lam',   ar: 'لَام', makhraj: 'lisan',
    strokes: [{ d: BASE.lam }] },
  { id: 24, char: 'م', name: 'Mim',   slug: 'mim',   ar: 'مِيم', makhraj: 'syafatain',
    strokes: [{ d: BASE.mim }] },
  { id: 25, char: 'ن', name: 'Nun',   slug: 'nun',   ar: 'نُون', makhraj: 'lisan',
    strokes: [{ d: BASE.nun }, { dot: [102, 84] }] },
  { id: 26, char: 'و', name: 'Wau',   slug: 'wau',   ar: 'وَاو', makhraj: 'syafatain',
    strokes: [{ d: BASE.waw }] },
  { id: 27, char: 'ه', name: 'Ha',    slug: 'ha-kecil', ar: 'هَاء', makhraj: 'halq',
    strokes: [{ d: BASE.ha }, { d: BASE.haIn }] },
  { id: 28, char: 'ي', name: 'Ya',    slug: 'ya',    ar: 'يَاء', makhraj: 'lisan',
    strokes: [{ d: BASE.ya }, { dot: [112, 186] }, { dot: [88, 186] }] },
];

// Zon makhraj (dipermudahkan untuk kanak-kanak).
const MAKHRAJ = {
  halq:      { ms: 'Tekak', en: 'Throat', color: '#ff8a65' },
  lisan:     { ms: 'Lidah', en: 'Tongue', color: '#f06292' },
  syafatain: { ms: 'Bibir', en: 'Lips',   color: '#ba68c8' },
};

// Arahan suara. Fail audio (jika ada) diletakkan di audio/arahan/<bahasa>/<kunci>.mp3.
// Jika fail tiada, aplikasi guna suara peranti (Text-to-Speech) sebagai sandaran.
const PROMPTS = {
  welcome:   { ms: 'Assalamualaikum! Jom belajar mengaji.', en: "Assalamualaikum! Let's learn to read." },
  tapLetter: { ms: 'Sentuh huruf untuk dengar.', en: 'Touch a letter to listen.' },
  trace:     { ms: 'Ikut anak panah dengan jari.', en: 'Follow the arrow with your finger.' },
  tapDot:    { ms: 'Sentuh titik.', en: 'Touch the dot.' },
  great:     { ms: 'Bagus! Hebatnya!', en: 'Great job!' },
  tryAgain:  { ms: 'Cuba lagi ya.', en: 'Try again.' },
  findThis:  { ms: 'Cari huruf ini.', en: 'Find this letter.' },
  catchThis: { ms: 'Tangkap huruf ini.', en: 'Catch this letter.' },
  missing:   { ms: 'Huruf mana yang hilang?', en: 'Which letter is missing?' },
  record:    { ms: 'Tekan butang merah dan sebut huruf.', en: 'Press the red button and say the letter.' },
  compare:   { ms: 'Dengar suara guru, kemudian suara kamu.', en: "Listen to the teacher, then to yourself." },
  sticker:   { ms: 'Wah! Kamu dapat pelekat baharu!', en: 'Wow! You got a new sticker!' },
  rest:      { ms: 'Masa untuk berehat. Jumpa esok!', en: 'Time to rest. See you tomorrow!' },
};

// Pelekat yang boleh dikumpul (dibuka setiap STARS_PER_STICKER bintang).
const STICKERS = ['🌙', '⭐', '🕌', '📖', '🌴', '🐪', '🌸', '🍎', '🦋', '🌈', '🐝', '🌻', '🐟', '🍇', '🐣', '🎈', '🌼', '🐢', '🍉', '☀️'];
const STARS_PER_STICKER = 5;

// Peringkat maskot (anak unta) membesar mengikut bilangan huruf yang dikuasai.
const MASCOT_STAGES = [
  { min: 0,  scale: 0.55, extra: '' },
  { min: 4,  scale: 0.65, extra: 'scarf' },
  { min: 10, scale: 0.78, extra: 'scarf' },
  { min: 18, scale: 0.9,  extra: 'scarf,cap' },
  { min: 28, scale: 1.0,  extra: 'scarf,cap,crown' },
];
