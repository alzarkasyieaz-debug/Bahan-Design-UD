// Skrip penuh — voice-over digunakan TEPAT seperti yang diberikan.
// Subtitle dipecah kepada "chunk" (maks 2 baris). Kata kunci akan bertukar emas
// dengan animasi kinetic apabila chunk itu disebut.

export const FPS = 30;
export const SCENE_SECONDS = 10;
export const SCENE_FRAMES = FPS * SCENE_SECONDS; // 300
export const TOTAL_FRAMES = SCENE_FRAMES * 12; // 3600 = 120 s
export const VO_START = 0.6; // saat selepas babak bermula
export const VO_END = 9.4; // saat — ruang bernafas sebelum peralihan

export type Scene = {
  id: number;
  label: string;
  number?: string; // "01".."08" – nilai daripada infografik
  title: string;
  titleLines?: string[]; // pemecahan baris tajuk (pilihan)
  smallText?: string;
  vo: string;
  chunks: string[]; // subtitle, setiap satu maks 2 baris
  keywords: string[]; // perkataan yang diserlahkan (huruf kecil)
};

export const SCENES: Scene[] = [
  {
    id: 1,
    label: 'HOOK EMOSI',
    title: 'SELEPAS UMUR 40 TAHUN…',
    titleLines: ['SELEPAS UMUR', '40 TAHUN…'],
    vo: 'Sampai satu usia, kita mula sedar… kekayaan sebenar bukan lagi tentang berapa banyak wang yang kita simpan, tetapi apa yang masih kita miliki.',
    chunks: [
      'Sampai satu usia, kita mula sedar…',
      'kekayaan sebenar bukan lagi tentang',
      'berapa banyak wang yang kita simpan,',
      'tetapi apa yang masih kita miliki.',
    ],
    keywords: ['kekayaan', 'sebenar', 'masih', 'miliki'],
  },
  {
    id: 2,
    label: 'KESIHATAN',
    number: '01',
    title: 'KESIHATAN YANG MASIH BAIK',
    vo: 'Kita mungkin punya banyak harta. Tetapi kalau tubuh sudah tidak berdaya, barulah kita mengerti betapa mahalnya nikmat sihat.',
    chunks: [
      'Kita mungkin punya banyak harta.',
      'Tetapi kalau tubuh sudah tidak berdaya,',
      'barulah kita mengerti betapa mahalnya nikmat sihat.',
    ],
    keywords: ['mahalnya', 'nikmat', 'sihat'],
  },
  {
    id: 3,
    label: 'KETENANGAN',
    number: '02',
    title: 'HATI YANG TENANG',
    vo: 'Dulu kita mengejar pelbagai perkara. Sekarang, kita cuma mahu tidur dengan lena, bangun tanpa keresahan dan menjalani hari dengan hati yang lapang.',
    chunks: [
      'Dulu kita mengejar pelbagai perkara.',
      'Sekarang, kita cuma mahu tidur dengan lena,',
      'bangun tanpa keresahan',
      'dan menjalani hari dengan hati yang lapang.',
    ],
    keywords: ['lena', 'hati', 'lapang'],
  },
  {
    id: 4,
    label: 'REZEKI BERKAT',
    number: '03',
    title: 'REZEKI YANG CUKUP DAN BERKAT',
    vo: 'Tidak semestinya yang banyak itu cukup. Kadangkala rezeki yang sederhana, tetapi penuh keberkatan, jauh lebih membahagiakan daripada kemewahan yang tidak menenangkan.',
    chunks: [
      'Tidak semestinya yang banyak itu cukup.',
      'Kadangkala rezeki yang sederhana, tetapi penuh keberkatan,',
      'jauh lebih membahagiakan',
      'daripada kemewahan yang tidak menenangkan.',
    ],
    keywords: ['cukup', 'sederhana', 'keberkatan', 'membahagiakan'],
  },
  {
    id: 5,
    label: 'KELUARGA',
    number: '04',
    title: 'KELUARGA YANG BAHAGIA',
    vo: 'Apa gunanya rumah yang besar, kalau tiada kemesraan di dalamnya? Bahagia itu apabila kita masih punya tempat untuk pulang dan disayangi.',
    chunks: [
      'Apa gunanya rumah yang besar,',
      'kalau tiada kemesraan di dalamnya?',
      'Bahagia itu apabila kita masih punya',
      'tempat untuk pulang dan disayangi.',
    ],
    keywords: ['kemesraan', 'bahagia', 'pulang', 'disayangi.'],
  },
  {
    id: 6,
    label: 'ANAK-ANAK',
    number: '05',
    title: 'ANAK-ANAK YANG SIHAT',
    vo: 'Melihat anak-anak membesar dengan sihat, mendengar gelak tawa mereka… itulah antara nikmat yang tidak mampu dibeli dengan wang ringgit.',
    chunks: [
      'Melihat anak-anak membesar dengan sihat,',
      'mendengar gelak tawa mereka…',
      'itulah antara nikmat yang tidak mampu',
      'dibeli dengan wang ringgit.',
    ],
    keywords: ['sihat,', 'gelak', 'tawa', 'nikmat'],
  },
  {
    id: 7,
    label: 'SAHABAT',
    number: '06',
    title: 'SAHABAT YANG IKHLAS',
    vo: 'Semakin meningkat usia, semakin sedikit sahabat yang benar-benar tinggal. Tetapi seorang yang ikhlas jauh lebih berharga daripada seribu yang hanya datang ketika senang.',
    chunks: [
      'Semakin meningkat usia,',
      'semakin sedikit sahabat yang benar-benar tinggal.',
      'Tetapi seorang yang ikhlas jauh lebih berharga',
      'daripada seribu yang hanya datang ketika senang.',
    ],
    keywords: ['sahabat', 'ikhlas', 'berharga'],
  },
  {
    id: 8,
    label: 'BEBAS HUTANG',
    number: '07',
    title: 'HIDUP TANPA BEBAN HUTANG',
    vo: 'Nikmat yang besar juga ialah hidup tanpa diburu hutang. Tidak perlu berpura-pura kaya, asalkan hati tenang dan kehidupan tidak membebankan.',
    chunks: [
      'Nikmat yang besar juga ialah hidup tanpa diburu hutang.',
      'Tidak perlu berpura-pura kaya,',
      'asalkan hati tenang dan kehidupan tidak membebankan.',
    ],
    keywords: ['tanpa', 'hutang.', 'tenang'],
  },
  {
    id: 9,
    label: 'DEKAT DENGAN ALLAH',
    number: '08',
    title: 'MASA UNTUK MENDEKATKAN DIRI KEPADA ALLAH',
    vo: 'Dan yang paling mahal… apabila Allah masih memberikan kita masa. Masa untuk bertaubat, memperbaiki diri dan kembali mendekat kepada-Nya.',
    chunks: [
      'Dan yang paling mahal…',
      'apabila Allah masih memberikan kita masa.',
      'Masa untuk bertaubat, memperbaiki diri',
      'dan kembali mendekat kepada-Nya.',
    ],
    keywords: ['mahal…', 'masa.', 'bertaubat,', 'kepada-nya.'],
  },
  {
    id: 10,
    label: 'MUHASABAH',
    title: 'APA YANG SEBENARNYA KITA KEJAR?',
    vo: 'Empat puluh tahun mengajar kita bahawa hidup ini bukan perlumbaan mengumpul segalanya. Kerana akhirnya, yang kita perlukan hanyalah perkara yang benar-benar bermakna.',
    chunks: [
      'Empat puluh tahun mengajar kita',
      'bahawa hidup ini bukan perlumbaan mengumpul segalanya.',
      'Kerana akhirnya, yang kita perlukan',
      'hanyalah perkara yang benar-benar bermakna.',
    ],
    keywords: ['perlumbaan', 'bermakna.'],
  },
  {
    id: 11,
    label: 'KESYUKURAN',
    title: 'SYUKURI YANG MASIH ADA',
    vo: 'Jika hari ini kita masih sihat, ada keluarga, rezeki yang cukup dan hati yang damai… sebenarnya kita sudah sangat kaya.',
    chunks: [
      'Jika hari ini kita masih sihat, ada keluarga,',
      'rezeki yang cukup dan hati yang damai…',
      'sebenarnya kita sudah sangat kaya.',
    ],
    keywords: ['sihat,', 'keluarga,', 'damai…', 'kaya.'],
  },
  {
    id: 12,
    label: 'PENUTUP',
    title: 'KEKAYAAN SEBENAR IALAH KETENANGAN DAN KEBERKATAN.',
    smallText: 'Jangan tunggu kehilangan untuk belajar menghargai.',
    vo: 'Ya Allah… jangan jadikan kami terlalu sibuk mengejar dunia, sehingga terlupa mensyukuri nikmat yang telah Engkau kurniakan. Amin.',
    chunks: [
      'Ya Allah…',
      'jangan jadikan kami terlalu sibuk mengejar dunia,',
      'sehingga terlupa mensyukuri nikmat',
      'yang telah Engkau kurniakan.',
      'Amin.',
    ],
    keywords: ['allah…', 'mensyukuri', 'nikmat', 'amin.'],
  },
];

// Jeda emosi (saat) selepas tanda baca penting – memberi "nafas" pada bacaan.
const pauseAfter = (chunk: string) =>
  chunk.endsWith('…') ? 0.7 : chunk.endsWith('.') || chunk.endsWith('?') ? 0.45 : chunk.endsWith(',') ? 0.25 : 0.1;

export type TimedChunk = { text: string; start: number; end: number };

/**
 * Masa subtitle: dibahagi mengikut bilangan aksara dalam tetingkap VO,
 * dengan jeda selepas ungkapan penting. Jika fail VO sebenar dirakam,
 * selaraskan masa ini dengan `public/audio/vo/timing.json` (lihat README).
 */
export const timeChunks = (scene: Scene, override?: number[][]): TimedChunk[] => {
  if (override && override.length === scene.chunks.length) {
    return scene.chunks.map((text, i) => ({ text, start: override[i][0], end: override[i][1] }));
  }
  const window = VO_END - VO_START;
  const pauses = scene.chunks.map(pauseAfter);
  const pauseTotal = pauses.slice(0, -1).reduce((a, b) => a + b, 0);
  const chars = scene.chunks.map((c) => c.length + 8);
  const totalChars = chars.reduce((a, b) => a + b, 0);
  const speakTime = window - pauseTotal;
  let t = VO_START;
  return scene.chunks.map((text, i) => {
    const d = (chars[i] / totalChars) * speakTime;
    const res = { text, start: t, end: t + d + (i === scene.chunks.length - 1 ? 0.3 : pauses[i] * 0.6) };
    t += d + pauses[i];
    return res;
  });
};
