// Storyboard "SEBUAH RINDU… Kenangan Indah di Tanah Suci"
// 12 babak × 17.5 s = 210 s (3:30). Foto: public/img/pNNN.jpg (NNN = kedudukan dalam album).
// Nota: album yang boleh dicapai tiada foto Kaabah / Masjidil Haram / Masjid Nabawi / tawaf,
// jadi tiada teks yang menamakan lokasi yang tidak kelihatan dalam foto.

export type Move = 'in' | 'out' | 'left' | 'right' | 'up';
/** Satu "shot": 1 foto = skrin penuh; 2–3 foto = skrin pisah (split-screen) */
export type Shot = { srcs: string[]; move?: Move; focusY?: number; weight?: number; forceCover?: boolean };

export type Scene = {
  title: string;
  vo: string;
  layout: 'opening' | 'film' | 'collage' | 'mosaic' | 'wall' | 'finale';
  shots: Shot[];
  goldFrame?: boolean;
  slow?: boolean;
};

export const SCENES: Scene[] = [
  {
    title: 'SEBUAH RINDU…',
    vo: 'Ada perjalanan yang berakhir… namun kenangannya tidak pernah pergi.',
    layout: 'opening',
    shots: [
      { srcs: ['p114'], move: 'in', weight: 1.5, focusY: 0.38, forceCover: true },
      { srcs: ['p046'], move: 'out', focusY: 0.6 },
    ],
  },
  {
    title: 'Kita datang dengan kisah berbeza…',
    vo: 'Kita datang dari tempat dan kisah yang berbeza, tetapi Allah menemukan kita dalam satu perjalanan yang begitu istimewa.',
    layout: 'film',
    shots: [
      { srcs: ['p000'], move: 'right', focusY: 0.35 },
      { srcs: ['p004', 'p008', 'p012'] },
      { srcs: ['p013'], move: 'left', focusY: 0.3 },
      { srcs: ['p040', 'p042'] },
    ],
  },
  {
    title: 'Menjadi tetamu Allah… satu anugerah.',
    vo: 'Di bumi yang mulia ini, setiap langkah terasa begitu bermakna.',
    layout: 'film',
    shots: [
      { srcs: ['p050'], move: 'in', focusY: 0.6 },
      { srcs: ['p053'], move: 'left', focusY: 0.55 },
      { srcs: ['p120', 'p228'] },
    ],
  },
  {
    title: 'Setiap doa… membawa seribu harapan.',
    vo: 'Ada doa yang dipanjatkan dalam diam, ada air mata yang hanya Allah mengetahui sebabnya.',
    layout: 'film',
    goldFrame: true,
    shots: [
      { srcs: ['p028'], move: 'in', focusY: 0.3 },
      { srcs: ['p223'], move: 'up', focusY: 0.4 },
      { srcs: ['p232'], move: 'out', focusY: 0.45 },
    ],
  },
  {
    title: 'Senyuman ini… akan terus dirindui.',
    vo: 'Di sebalik penat dan lelah, tersimpan senyuman yang akan sentiasa menghidupkan kenangan.',
    layout: 'collage',
    shots: [{ srcs: ['p226', 'p064', 'p075', 'p077', 'p168', 'p178', 'p072'] }],
  },
  {
    title: 'Dari tidak mengenali… menjadi satu keluarga.',
    vo: 'Daripada pertemuan yang singkat, lahirlah sebuah ukhuwah yang begitu indah.',
    layout: 'film',
    shots: [
      { srcs: ['p051'], move: 'in', focusY: 0.45 },
      { srcs: ['p110', 'p093'] },
      { srcs: ['p230'], move: 'right', focusY: 0.4 },
      { srcs: ['p059'], move: 'out', focusY: 0.5 },
    ],
  },
  {
    title: 'Gelak tawa, cerita dan kenangan…',
    vo: 'Kita berkongsi cerita, gelak tawa, dan detik-detik kecil yang kini menjadi begitu berharga.',
    layout: 'mosaic',
    shots: [{ srcs: ['p141', 'p262', 'p247', 'p267', 'p283', 'p144'] }],
  },
  {
    title: 'Ketenangan… di setiap langkah.',
    vo: 'Dan di bumi barakah ini, hati seakan menemukan ketenangan yang sukar diungkapkan dengan kata-kata.',
    layout: 'film',
    shots: [
      { srcs: ['p135'], move: 'right', focusY: 0.45 },
      { srcs: ['p146', 'p153'] },
      { srcs: ['p129'], move: 'in', focusY: 0.45 },
      { srcs: ['p203'], move: 'left', focusY: 0.5 },
    ],
  },
  {
    title: 'Setiap gambar menyimpan sebuah cerita.',
    vo: 'Setiap wajah, setiap tempat dan setiap detik… kini menjadi sebahagian daripada kisah hidup kita.',
    layout: 'wall',
    shots: [{ srcs: ['p077', 'p226', 'p053', 'p262', 'p139', 'p131'] }],
  },
  {
    title: 'Berat untuk berpisah…',
    vo: 'Akhirnya, tibalah saat untuk berpisah. Namun kenangan indah ini tetap tinggal di dalam hati.',
    layout: 'film',
    slow: true,
    shots: [
      { srcs: ['p236', 'p237'] },
      { srcs: ['p113'], move: 'in', focusY: 0.35 },
      { srcs: ['p300'], move: 'out', focusY: 0.45 },
    ],
  },
  {
    title: 'Semoga Allah menerima segala amalan kita.',
    vo: 'Ya Allah, terimalah ibadah kami, eratkan ukhuwah ini dan izinkan kami kembali menjadi tetamu-Mu.',
    layout: 'film',
    slow: true,
    goldFrame: true,
    shots: [
      { srcs: ['p115'], move: 'out', weight: 1.3, focusY: 0.38, forceCover: true },
      { srcs: ['p212'], move: 'out', focusY: 0.5 },
    ],
  },
  {
    title: 'KENANGAN INDAH BERSAMA',
    vo: 'Berpisah di dunia… semoga bertemu lagi di Tanah Suci.',
    layout: 'finale',
    shots: [
      { srcs: ['p000', 'p051', 'p077', 'p226', 'p262', 'p141', 'p300', 'p120'] },
      { srcs: ['p046'] },
    ],
  },
];
