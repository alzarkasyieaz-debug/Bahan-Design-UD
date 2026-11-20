import React from 'react';
import edlAsal from './edl.json';
import edlSabar from './edl-sabar.json';
import transcript from './transcript.json';

export const FPS = 30;
export const DURATION = 120;
export const TOTAL_FRAMES = FPS * DURATION;
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

type Graphics = {
  hook: string;
  hookA?: number[];
  hookB?: number[];
  sabar?: number[];
  title?: number[];
  lowerThird: number[];
  location: number[];
  tagline: { a: number; b: number; full: number; fadeOut: number };
};
export type Edl = {
  speechOffset: number;
  speechOut: number;
  output: string;
  clips: Clip[];
  graphics: Graphics;
  hookWords?: [number, number, string][];
};
/** asal = hook teks "Di saat rakyat diuji" ; sabar = hook suara asal YB "Sabar ya" */
export const VARIANTS: Record<string, Edl> = {
  asal: edlAsal as unknown as Edl,
  sabar: edlSabar as unknown as Edl,
};

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
  "Ta'ala", 'diselamatkan', 'sama-samalah', 'Sabar',
];
const isKey = (w: string) => KEYWORDS.includes(w.replace(/[.,]/g, ''));

type Seg = { start: number; end: number; text: string; words: [number, number, string][] };
type RawWord = { t: number; e: number; w: string; segEnd?: boolean };

const rawWords: RawWord[] = [];
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

function buildLines(words: RawWord[], offset: number): Line[] {
  // Pecahan baris: ikut segmen (frasa semula jadi), maks ~26 aksara sebaris
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
    cur.push({ t: w.t + offset, e: w.e + offset, w: w.w, key: isKey(w.w) });
    const next = words[i + 1];
    if (!next || w.segEnd || /[.,]$/.test(w.w) || next.t - w.e > 0.45) flush();
  }
  flush();
  // Panjangkan setiap baris sehingga baris berikutnya (maks 0.9 s jeda)
  for (let i = 0; i < lines.length; i++) {
    const nxt = lines[i + 1];
    lines[i].end = nxt ? Math.min(nxt.start, lines[i].end + 0.9) : lines[i].end + 0.6;
  }
  return lines;
}

export function makeTimeline(edl: Edl) {
  const OFF = edl.speechOffset; // masa output = masa ucapan + offset
  const words = rawWords.filter((w) => w.t < edl.speechOut - 0.05); // satu "terima kasih" sahaja
  let subLines = buildLines(words, OFF);
  if (edl.hookWords) {
    // Sari kata suara asal YB dalam hook (B-roll IMG_3293), masa relatif kepada klip S0
    const s0 = edl.clips[0];
    const hw: RawWord[] = edl.hookWords.map(([t, e, w], i, a) => ({
      t: t - (s0.srcIn ?? 0), e: e - (s0.srcIn ?? 0), w, segEnd: i === 2 || i === a.length - 1,
    }));
    // "Sabar ya" dipaparkan sebagai tipografi besar, jadi sari kata hanya untuk ayat sebelumnya
    subLines = [...buildLines(hw.slice(0, 3), 0), ...subLines];
  }
  const firstOf = (w: string, after = 0) => {
    const x = words.find((y) => y.w.replace(/[.,]/g, '') === w && y.t >= after);
    return (x ? x.t : after) + OFF;
  };
  /* Tipografi kata kunci: setiap teks ialah ungkapan yang BENAR-BENAR disebut oleh YB,
   * masa diikat pada cap masa perkataan sebenar. */
  const keyPhrases = [
    { from: firstOf('35'), to: firstOf('lebih') - 0.05, big: '35', small: 'KELUARGA', count: true },
    { from: firstOf('68') - 0.2, to: firstOf('68') + 2.3, big: '68', small: 'ORANG · LEBIH KURANG', count: true },
    { from: firstOf('ikut') - 0.1, to: firstOf('berkuasa') + 0.9, lines: ['IKUT ARAHAN', 'PIHAK BERKUASA'] },
    { from: firstOf('jaga') - 0.1, to: firstOf('pastikan') - 0.1, lines: ['JAGA KESIHATAN', '& KESELAMATAN'] },
    { from: firstOf('elakkan') - 0.05, to: firstOf('kerana') + 1.6, lines: ['ELAKKAN', 'MERANDUK AIR'] },
    { from: firstOf('berjaga-jagalah') - 1.2, to: firstOf('kalau-kalau') + 1.5, lines: ['SENTIASA', 'BERJAGA-JAGALAH'] },
  ];
  const lastSpeech = edl.speechOut + OFF;
  return {
    edl,
    clips: edl.clips,
    speechOffset: OFF,
    subLines,
    subsUntil: lastSpeech,
    keyPhrases,
    doa: { from: firstOf('sama-samalah'), to: firstOf('dielakkan') + 0.3 },
    g: edl.graphics,
    montage: [firstOf('sama-samalah') - 0.5, lastSpeech - 0.5] as [number, number],
  };
}
export type Timeline = ReturnType<typeof makeTimeline>;

export const TimelineContext = React.createContext<Timeline>(makeTimeline(VARIANTS.asal));
export const useTimeline = () => React.useContext(TimelineContext);
