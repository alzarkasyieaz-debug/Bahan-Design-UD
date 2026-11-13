import { Easing, interpolate, useCurrentFrame } from 'remotion';
import timeline from './data/timeline.json';
import storyboard from './data/storyboard.json';

/* =====================================================================
 * STYLE: QOUTE INTERAKTIF — NakSeeHeart
 * Semua kandungan video datang daripada dua fail data:
 *   src/data/timeline.json   — EDL (klip sumber -> garis masa output) + beat bernama
 *   src/data/storyboard.json — susun atur, kamera & senarai elemen grafik
 * ===================================================================== */

export const TL = timeline;
export const SB = storyboard as unknown as Storyboard;
export const B = timeline.beats as unknown as Record<string, number | number[]> & {
  flashToBody: number;
  climax: number[];
  finale: number[];
  cta: number;
  end: number;
  followPulse: number[];
};
export const FPS = timeline.fps;
export const W = timeline.width;
export const H = timeline.height;
export const TOTAL_FRAMES = Math.round(B.end * FPS);
export const f = (sec: number) => Math.round(sec * FPS);

/** Masa: nombor (saat) atau rujukan beat — "p1", "p1+0.5", "brollSosial.1-0.1", "cta-0.1" */
export type TimeRef = number | string;
export const tv = (v: TimeRef): number => {
  if (typeof v === 'number') return v;
  const m = /^\s*([A-Za-z_]\w*)(?:\.(\d+))?\s*([+-]\s*\d*\.?\d+)?\s*$/.exec(v);
  if (!m) throw new Error(`Rujukan masa tidak sah: "${v}"`);
  const raw = (timeline.beats as Record<string, number | number[]>)[m[1]];
  if (raw === undefined) throw new Error(`Beat tidak wujud dalam timeline.json: "${m[1]}"`);
  const base = Array.isArray(raw) ? raw[Number(m[2] ?? 0)] : raw;
  return base + (m[3] ? Number(m[3].replace(/\s/g, '')) : 0);
};

/** Susun atur (zon skrin) — lihat STYLE.md */
export type Layout = {
  face: { x: number; y: number };
  ceilingY: number;
  ceilingTilt: number;
  labelY: number;
  cardY: number;
  recapY: number;
  subtitleY: number;
  lowerThirdY: number;
  hookFocusY: number;
  climaxFocusY: number;
};
export type Storyboard = {
  meta: { title: string; compositionId: string; output: string; source: string; reference?: string };
  layout: Layout;
  camera: { punch: TimeRef[]; jumpCutZoom: number; climaxZoom: [number, number]; hookZoom: [number, number, number] };
  subtitleCalm: [TimeRef, TimeRef][];
  elements: El[];
};
export type Item = { text: string; at: TimeRef };
export type El =
  | { type: 'ceiling3d'; text: string; at: TimeRef; until: TimeRef; size?: number; fill?: Fill; reveal?: Reveal; x?: number; depth?: number }
  | { type: 'text3d'; text: string; at: TimeRef; until?: TimeRef; x?: number; y: number; size: number; fill?: Fill; reveal?: Reveal; depth?: number; rotX?: number; float?: boolean }
  | { type: 'label'; text: string; at: TimeRef; until: TimeRef; y?: number; size?: number; color?: string }
  | { type: 'badge'; n: string; caption: string; at: TimeRef; until: TimeRef }
  | { type: 'chip'; text: string; at: TimeRef; until: TimeRef; icon?: 'friends' | 'none' }
  | { type: 'counter'; count: number; label: string; at: TimeRef; until: TimeRef }
  | { type: 'meter'; label: string; good: string; bad: string; at: TimeRef; until: TimeRef; dropAt: TimeRef }
  | { type: 'compare'; at: TimeRef; until: TimeRef; arrow?: boolean; left: Col; right: Col }
  | { type: 'checklist'; title: string; at: TimeRef; until: TimeRef; items: Item[] }
  | { type: 'chat'; text: string; at: TimeRef; until: TimeRef; stampAt: TimeRef; stamp: string }
  | { type: 'crowd'; label: string; at: TimeRef; until: TimeRef }
  | { type: 'recap'; at: TimeRef; until: TimeRef; items: string[] }
  | { type: 'progress'; at: TimeRef; until: TimeRef; items: Item[] }
  | { type: 'heart'; at: TimeRef; until: TimeRef; x?: number; y?: number; size?: number }
  | { type: 'quote'; text: string; at: TimeRef; until: TimeRef; y: number; size?: number }
  | { type: 'burst'; at: TimeRef; x?: number; y?: number; seed: string; spread?: number; count?: number }
  | { type: 'broll'; kind: 'social' | 'friends' | 'spiritual'; from: TimeRef; to: TimeRef; children: El[] };
export type Col = { title: string; good?: boolean; items: Item[] };
export type Fill = 'gold' | 'cream' | 'white' | 'red';
export type Reveal = 'letters' | 'punch' | 'rise';

export const L = SB.layout;

/** Masa semasa (saat) pada garis masa output. */
export const useTime = () => useCurrentFrame() / FPS;

export const ease = Easing.bezier(0.45, 0, 0.2, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.5, 0, 0.75, 0);
export const back = Easing.bezier(0.34, 1.56, 0.64, 1);

/** interpolate berclamp dengan easing sinematik */
export const tw = (t: number, inR: number[], outR: number[], e: (n: number) => number = ease) =>
  interpolate(t, inR, outR, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e });

/** Sampul masuk/keluar 0..1 untuk julat [a, b] */
export const window01 = (t: number, a: number, b: number, fin = 0.4, fout = 0.4) =>
  Math.min(tw(t, [a, a + fin], [0, 1], easeOut), tw(t, [b - fout, b], [1, 0], ease));

/** Palet jenama NakSeeHeart: Warm Gold #D8B46A, Deep Charcoal #17191D, Soft White #F7F4ED, Muted Teal #406E73 */
export const C = {
  gold: '#D8B46A',
  goldLight: '#FFE2A3',
  goldDeep: '#9A6A22',
  cream: '#F7F4ED',
  charcoal: '#17191D',
  teal: '#406E73',
  cyan: '#6FE3E9',
  white: '#FFFFFF',
};

export const FONT = {
  display: "'Bebas Neue', sans-serif",
  serif: "'Cinzel', serif",
  sans: "'Montserrat', sans-serif",
  italic: "'Playfair Display', serif",
};
