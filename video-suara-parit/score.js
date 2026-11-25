// SUARA PARIT DI DEWAN RAKYAT (16:9, ~67 s): video info gaya dokumentari tentang rekod ucapan
// YB Ustaz Ismi, Ahli Parlimen Parit. Semua angka daripada bahan dalam folder rujukan (lihat README).
// Satu jam (clock) memandu muzik dan gambar: setiap angka mendarat, setiap isu masuk dan setiap
// kotak sorotan muncul tepat pada pukulan muzik.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const { m, makeClock, makeChords } = MU;

  const FPS = 30;
  const FORMAT = '16:9';
  const STYLE = 'flat';
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  const clock = makeClock({ bpm: 90, offset: 0.4 });
  const { T, BEAT, BAR } = clock;
  const END_BAR = 23;
  const DURATION = T(END_BAR + 2) + 0.4;

  // babak, dalam bar
  const S = {
    intro: [0, T(3)], potret: [T(3), T(5)], dewan: [T(5), T(8)], angka: [T(8), T(10)],
    tahun: [T(10), T(12)], kamar: [T(12), T(14)], isu: [T(14), T(20)], sorotan: [T(20), T(23)], akhir: [T(23), DURATION],
  };
  // Dm  Bb  F  C : sedih-berwibawa, kemudian naik ke F pada penutup
  const prog = ['Dm', 'Bb', 'F', 'C'];
  const rows = Array.from({ length: END_BAR }, (_, b) => [b, 0, 4, prog[b % 4]]);
  rows.push([END_BAR, 0, 4, 'Bb'], [END_BAR + 1, 0, 4, 'F']);
  const { chords, chordAt } = makeChords(clock, {
    Dm: { notes: ['D3', 'F3', 'A3'], bass: 'D2' }, Bb: { notes: ['D3', 'F3', 'Bb3'], bass: 'Bb1' },
    F: { notes: ['C3', 'F3', 'A3'], bass: 'F1' }, C: { notes: ['C3', 'E3', 'G3'], bass: 'C2' },
  }, rows);

  // ---------- data (daripada bahan) ----------
  const STATS = [
    { n: 33, a: 'rakaman ucapan', b: 'dalam Senarai Video Ucapan Parit', t: T(8, 1), col: '#46d9e6' },
    { n: 9, a: 'tajuk ucapan Kamar Khas', b: '8 bertarikh, 1 belum dikenal pasti', t: T(8, 3), col: '#d9b45a' },
    { n: 4, a: 'tahun liputan', b: '20 Feb 2023 hingga 19 Nov 2026', t: T(9, 1), col: '#46d9e6' },
  ];
  const YEARS = [
    { y: '2023', v: 10, k: 0 }, { y: '2024', v: 12, k: 2 }, { y: '2025', v: 4, k: 6 }, { y: '2026', v: 7, k: 0 },
  ].map((r, i) => ({ ...r, t: T(10, 2 + i) }));
  const KAMAR = [
    { d: '16 Okt 2024', items: ['Kaunter Imigresen', 'Doktor pakar Hospital Seri Iskandar'] },
    { d: '4 Mac 2025', items: ['Jelapang padi Perak Tengah', 'Pelaburan dan industri'] },
    { d: '5 Ogos 2025', items: ['Kaunter JPJ Seri Iskandar', 'Hakisan sungai'] },
    { d: '16 Okt 2025', items: ['Liputan telekomunikasi', 'Nelayan darat'] },
    { d: 'Tarikh belum dikenal pasti', items: ['Masjid Ghufraniah Titi Gantung'] },
  ].map((r, i) => ({ ...r, t: T(12, 2 + i * 0.75) }));
  const ISU = [
    { ic: 'school', cat: 'Pendidikan', title: 'Kesesakan sekolah di Seri Iskandar', n: 3, nl: 'tarikh ucapan', p: 'Murid bertambah mendadak; sekolah baharu di Bandar Universiti belum dibina.', meta: '28 Mac 2023 · Dewan Rakyat  |  16 Okt 2024 · Kamar Khas' },
    { ic: 'health', cat: 'Kesihatan', title: 'Doktor pakar Hospital Seri Iskandar', n: 4, nl: 'kawasan penduduk disebut', p: 'Seri Iskandar, Bota, Tronoh dan Parit memerlukan doktor pakar.', meta: '16 Okt 2024 · Kamar Khas · KKM' },
    { ic: 'card', cat: 'Perkhidmatan awam', title: 'Kaunter Imigresen dan JPJ setempat', n: 2, nl: 'usul di Kamar Khas', p: 'Penduduk terpaksa ke Ipoh atau Lumut untuk urusan pasport.', meta: '16 Okt 2024 · KDN  |  5 Ogos 2025 · MOT' },
    { ic: 'signal', cat: 'Infrastruktur digital', title: 'Liputan telefon dan internet desa', n: 11, nl: 'kampung dinamakan', p: 'Liputan lemah menjejaskan keselamatan, pendidikan dan ekonomi desa.', meta: '16 Okt 2025 · Kamar Khas · Kementerian Komunikasi' },
    { ic: 'padi', cat: 'Pertanian dan sumber air', title: 'Padi, sungai dan nelayan darat', n: 3, nl: 'usul di Kamar Khas', p: 'Jelapang padi Perak Tengah, hakisan sungai dan nelayan darat.', meta: '4 Mac 2025 · KPKM  |  5 Ogos 2025 · PETRA  |  16 Okt 2025 · KPKM' },
    { ic: 'industry', cat: 'Ekonomi', title: 'Pelaburan dan industri Seri Iskandar', n: 3, nl: 'rekod, Nov 2024 – Mac 2025', p: 'Usaha menarik pelaburan dan membangunkan industri.', meta: '20 Nov 2024  |  5 Feb 2025  |  4 Mac 2025 · MITI' },
  ].map((r, i) => ({ ...r, t: T(14 + i) }));
  const FLOW = [
    { k: 'Cadangan YB', v: 'Bina sekolah baharu di Bandar Universiti dan bangunan tambahan sekolah.', col: '#46d9e6', t: T(21, 0) },
    { k: 'Jawapan kementerian', v: 'Tidak dinyatakan dalam bahan', col: '#c9b7ff', t: T(21, 2), na: true },
    { k: 'Tindakan setakat ini', v: 'Tapak sudah diperuntukkan; sekolah belum dibina (setakat Mac 2023).', col: '#d9b45a', t: T(22, 0) },
  ];

  const ev = {
    title: T(1), potret: T(3), dewan: T(5), dewan2: T(6, 2), angka: T(8), tahun: T(10), kamar: T(12),
    isu: T(14), sorotan: T(20), akhir: T(23),
  };
  const markers = {
    title: { t: ev.title, sync: 'av' },
    potret: { t: ev.potret, sync: 'v' },
    angka: { t: ev.angka, sync: 'av' },
    isu1: { t: ISU[0].t, sync: 'av' }, isu4: { t: ISU[3].t, sync: 'av' },
    sorotan: { t: ev.sorotan, sync: 'av' },
    akhir: { t: ev.akhir, sync: 'av' },
  };

  const SCORE = { FPS, FORMAT, STYLE, W, H, SAFE, DURATION, clock, T, BEAT, BAR, S, m, chords, chordAt, STATS, YEARS, KAMAR, ISU, FLOW, ev, markers, vo: [] };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
