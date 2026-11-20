import edl from './edl.json';
import transcript from './transcript.json';

export const FPS = 30;
export const DURATION = 120;
export const TOTAL_FRAMES = FPS * DURATION;
export const SPEECH_OFFSET = edl.speechOffset; // masa output = masa ucapan + offset
export const SPEECH_OUT = edl.speechOut;
export const HANDLE = 0.5;

export type Clip = {
  id: string;
  src: string;
  srcIn?: number;
  speed?: number;
  start: number;
  end: number;
  fx?: string;
  stab?: boolean;
  last?: boolean;
  zoom?: number[];
  punch?: number[];
  note?: string;
};
export const CLIPS = edl.clips as Clip[];

/* ------------------------------------------------------------------ Sari kata
 * Dibina terus daripada transkrip (Whisper large-v3) ucapan sebenar YB — tiada
 * perkataan direka. Hanya pembetulan ejaan/penggabungan token: "bersama -sama" ->
 * "bersama-sama", "Ta 'ala" -> "Ta'ala".
 */
export type Word = { t: number; e: number; w: string; key: boolean };
export type Line = { start: number; end: number; words: Word[] };

// Perkataan yang benar-benar disebut & diberi penekanan warna
const KEYWORDS = [
  'mangsa', 'banjir', '35', 'keluarga', '68', 'orang', 'PPS', 'arahan', 'kesihatan', 'keselamatan',
  'bersih', 'selamat', 'elakkan', 'meranduk', 'air', 'surut', 'berjaga-jagalah', 'berdoa', 'Allah',
  "Ta'ala", 'diselamatkan', 'sama-samalah',
];

type Seg = { start: number; end: number; text: string; words: [number, number, string][] };

const rawWords: { t: number; e: number; w: string; segEnd?: boolean }[] = [];
for (const seg of transcript as Seg[]) {
  if (rawWords.length) rawWords[rawWords.length - 1].segEnd = true;
  for (const [s, e, w] of seg.words) {
    const tok = w.trim();
    const prev = rawWords[rawWords.length - 1];
    if (prev && (tok.startsWith('-') || tok.startsWith("'"))) {
      prev.w += tok;
      prev.e = e;
    } else {
      rawWords.push({ t: s, e, w: tok });
    }
  }
}
// hanya sehingga titik potong ucapan (satu "terima kasih")
const words = rawWords.filter((w) => w.t < SPEECH_OUT - 0.05);

const isKey = (w: string) => KEYWORDS.includes(w.replace(/[.,]/g, ''));

// Pecahan baris: ikut segmen Whisper (frasa semula jadi), maks ~26 aksara sebaris
const lines: Line[] = [];
let cur: Word[] = [];
const flush = () => {
  if (cur.length) lines.push({ start: cur[0].t, end: cur[cur.length - 1].e, words: cur });
  cur = [];
};
for (let i = 0; i < words.length; i++) {
  const w = words[i];
  const len = cur.reduce((a, x) => a + x.w.length + 1, 0);
  if (cur.length && len + w.w.length > 26) flush();
  cur.push({ t: w.t + SPEECH_OFFSET, e: w.e + SPEECH_OFFSET, w: w.w, key: isKey(w.w) });
  const next = words[i + 1];
  if (!next || w.segEnd || w.w.endsWith(',') || next.t - w.e > 0.45) flush();
}
flush();
// Panjangkan setiap baris sehingga baris berikutnya (maks 0.9 s jeda)
for (let i = 0; i < lines.length; i++) {
  const nxt = lines[i + 1];
  lines[i].end = nxt ? Math.min(nxt.start, lines[i].end + 0.9) : lines[i].end + 0.6;
}
export const SUB_LINES = lines;

const firstOf = (w: string, after = 0) => {
  const x = words.find((y) => y.w.replace(/[.,]/g, '') === w && y.t >= after);
  return (x ? x.t : after) + SPEECH_OFFSET;
};

/* ------------------------------------------------------------------ Tipografi kata kunci
 * Setiap teks di bawah ialah ungkapan yang BENAR-BENAR disebut oleh YB.
 * Masa diikat pada cap masa perkataan sebenar.
 */
export const KEY_PHRASES = [
  { from: firstOf('35'), to: firstOf('lebih') - 0.05, big: '35', small: 'KELUARGA', count: true },
  { from: firstOf('68') - 0.2, to: firstOf('68') + 2.3, big: '68', small: 'ORANG · LEBIH KURANG', count: true },
  { from: firstOf('ikut') - 0.1, to: firstOf('berkuasa') + 0.9, lines: ['IKUT ARAHAN', 'PIHAK BERKUASA'] },
  { from: firstOf('jaga') - 0.1, to: firstOf('pastikan') - 0.1, lines: ['JAGA KESIHATAN', '& KESELAMATAN'] },
  { from: firstOf('elakkan') - 0.05, to: firstOf('kerana') + 1.6, lines: ['ELAKKAN', 'MERANDUK AIR'] },
  { from: firstOf('berjaga-jagalah') - 1.2, to: firstOf('kalau-kalau') + 1.5, lines: ['SENTIASA', 'BERJAGA-JAGALAH'] },
];

export const DOA = { from: firstOf('sama-samalah'), to: firstOf('dielakkan') + 0.3 };

// Teks grafik tetap
export const HOOK = { a: [0.5, 3.45], b: [3.55, 6.55] };
export const LOWER_THIRD = [7.0, 11.0];
export const LOCATION = [11.1, 15.6];
export const TAGLINE = { a: 110.0, b: 112.6, full: 115.2, fadeOut: 118.6 };
