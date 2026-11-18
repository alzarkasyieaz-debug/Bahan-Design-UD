// Susunan babak "Umrah Moment" — Memori USJ 4–12 Julai 2026
// Foto: public/img/pNNN.jpg (NNN = kedudukan dalam album Google Photos)

export type Layout = 'arch' | 'trio' | 'grid';

export type Chapter = {
  title: string;
  caption: string;
  layout: Layout;
  photos: string[];
  dur: number; // frame @30fps
};

export const INTRO_DUR = 210;
export const OUTRO_DUR = 300;
export const XFADE = 16;

export const CHAPTERS: Chapter[] = [
  { title: 'Bermula Sebuah Perjalanan', caption: 'Niat dipasang, langkah pertama diatur.', layout: 'arch', photos: ['p000', 'p004', 'p008'], dur: 210 },
  { title: 'Bersama Menuju Tanah Suci', caption: 'Satu kumpulan, satu tujuan.', layout: 'grid', photos: ['p012', 'p040', 'p042', 'p024'], dur: 195 },
  { title: 'Menanti Seruan', caption: 'Taklimat, doa dan debar menanti penerbangan.', layout: 'trio', photos: ['p038', 'p028', 'p034'], dur: 195 },
  { title: 'Satu Jemaah, Satu Hati', caption: 'Ukhuwah yang terikat kerana Allah.', layout: 'arch', photos: ['p046', 'p053'], dur: 195 },
  { title: 'Senyum di Bumi Barakah', caption: 'Wajah-wajah penuh syukur.', layout: 'grid', photos: ['p064', 'p072', 'p075', 'p077'], dur: 195 },
  { title: 'Menyusuri Jejak Sejarah', caption: 'Setiap langkah, sebuah pelajaran.', layout: 'trio', photos: ['p146', 'p139', 'p141'], dur: 195 },
  { title: 'Detik Bersama', caption: 'Kenangan kecil yang paling bermakna.', layout: 'grid', photos: ['p093', 'p120', 'p131', 'p168'], dur: 195 },
  { title: 'Ukhuwah Fillah', caption: 'Bertemu kerana Allah, berpisah kerana-Nya.', layout: 'trio', photos: ['p228', 'p225', 'p232'], dur: 195 },
  { title: 'Rezeki Sepanjang Jalan', caption: 'Alhamdulillah atas setiap hidangan.', layout: 'grid', photos: ['p254', 'p262', 'p267', 'p271'], dur: 195 },
  { title: 'Kenangan Terindah', caption: 'Detik yang akan dirindui selamanya.', layout: 'arch', photos: ['p283', 'p300', 'p278'], dur: 210 },
];

// Kira masa mula setiap babak (dengan pertindihan pudar silang)
export const TIMELINE = (() => {
  const out: { kind: 'intro' | 'chapter' | 'outro'; from: number; dur: number; idx: number }[] = [];
  let t = 0;
  out.push({ kind: 'intro', from: 0, dur: INTRO_DUR, idx: -1 });
  t = INTRO_DUR - XFADE;
  CHAPTERS.forEach((c, i) => {
    out.push({ kind: 'chapter', from: t, dur: c.dur, idx: i });
    t += c.dur - XFADE;
  });
  out.push({ kind: 'outro', from: t, dur: OUTRO_DUR, idx: -1 });
  return out;
})();

export const TOTAL_FRAMES = TIMELINE[TIMELINE.length - 1].from + OUTRO_DUR;
