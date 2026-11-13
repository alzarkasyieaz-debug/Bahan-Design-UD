import { Easing, interpolate, useCurrentFrame } from 'remotion';
import timeline from './data/timeline.json';

export const TL = timeline;
export const B = timeline.beats;
export const FPS = timeline.fps;
export const W = timeline.width;
export const H = timeline.height;
export const TOTAL_FRAMES = Math.round(B.end * FPS);
export const f = (sec: number) => Math.round(sec * FPS);

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

/** Palet jenama NakSeeHeart (V2 §11): Warm Gold #D8B46A, Deep Charcoal #17191D, Soft White #F7F4ED, Muted Teal #406E73 */
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
