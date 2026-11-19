import timeline from './timeline.json';

export const FPS = timeline.fps;

export type Shot = {
  src: string; from: number; at: number; dur: number;
  rate?: number; zoom: number[]; warm: number; nat: number;
  dim?: number; blur?: number; note?: string;
};
export type KText = { kind: 'hero' | 'keyword' | 'climax' | 'support'; lines: string[]; gold?: number[]; at: number; end: number };
export type VoSlot = { id: number; at: number; max: number; noSubs?: boolean };
export type Span = { at: number; end: number };
export type Version = {
  duration: number; shots: Shot[]; texts: KText[];
  money: Span & { amounts: number[]; gap: number };
  lowerThird: Span; sourceTag: Span; cta: Span; endCard: Span | null; vo: VoSlot[];
};

export const V90 = timeline.v90 as Version;
export const V30 = timeline.v30 as Version;

/**
 * Skrip suara latar — 9 klip. Setiap klip dipecah kepada chunk subtitle (maks 2 baris).
 * Teks MESTI sama dengan SKRIP-SUARA-LATAR.md.
 */
export const VO_CHUNKS: Record<number, string[]> = {
  1: ['Bayangkan…', 'saat kita masih lena di rumah sendiri,', 'ada saudara kita yang terpaksa meninggalkan kediaman demi keselamatan.'],
  2: ['Banjir bukan sekadar air yang melimpah.', 'Di sebaliknya, ada keluarga yang diuji…', 'ada rutin kehidupan yang terhenti…', 'dan ada hati yang sedang mencari kekuatan untuk meneruskan hari.'],
  3: ['Di Parlimen Parit, YB Ustaz Muhammad Ismi Mat Taib', 'turun meninjau Pusat Pemindahan Sementara,', 'bertemu penduduk yang terjejas,', 'dan mendengar sendiri keadaan yang sedang mereka hadapi.'],
  4: ['Di sebalik setiap pertemuan…', 'ada kisah yang perlu didengari.', 'Ada keperluan yang harus dibantu.'],
  5: ['Mungkin kita tidak mampu menghentikan hujan…', 'Tetapi kita mampu meringankan beban mereka.'],
  6: ['Hari ini, mereka tidak meminta kemewahan.', 'Mereka memerlukan bantuan, keprihatinan…', 'dan keyakinan bahawa mereka tidak bersendirian.'],
  7: ['Kecil pada nilai kita…', 'mungkin besar maknanya buat mereka.'],
  8: ['Marilah kita bersama-sama', 'membantu saudara kita yang sedang diuji.'],
  9: ['Kerana apabila kita berkongsi rezeki…', 'kita turut berkongsi harapan.'],
};

/** Kata kunci emas + animasi penegasan dalam subtitle. */
export const KEYWORDS = ['diuji', 'bantuan', 'keprihatinan', 'prihatin', 'harapan', 'sumbangan', 'bersama-sama', 'bersama', 'meringankan', 'membantu'];

/**
 * Pemasaan chunk dalam slot VO. Jika timing.json (dari rakaman sebenar) wujud, ia digunakan;
 * jika tidak, masa dibahagi mengikut panjang teks (jeda "…" diberi pemberat tambahan).
 */
export const chunkTimes = (slot: VoSlot, timing?: number[][]) => {
  const chunks = VO_CHUNKS[slot.id];
  if (timing && timing.length === chunks.length) {
    return chunks.map((text, i) => ({ text, start: slot.at + timing[i][0], end: slot.at + timing[i][1] }));
  }
  const weight = (s: string) => s.length + (s.includes('…') ? 10 : 0) + 6;
  const total = chunks.reduce((a, c) => a + weight(c), 0);
  let t = slot.at;
  return chunks.map((text) => {
    const d = (weight(text) / total) * slot.max;
    const r = { text, start: t, end: t + d - 0.08 };
    t += d;
    return r;
  });
};
