import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { C, FPS, tw, easeOut } from '../lib';

/** Film grain minimum (SVG turbulence, benih berubah setiap 2 frame). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 12;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.62 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 62% at 50% 45%, rgba(0,0,0,0) 45%, rgba(8,8,10,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** Gred warna: highlight keemasan, bayang teal/charcoal (soft-light). */
export const Grade: React.FC<{ amount?: number }> = ({ amount = 1 }) => (
  <>
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, rgba(233,185,92,${0.22 * amount}) 0%, rgba(233,185,92,${0.06 * amount}) 45%, rgba(40,78,84,${0.28 * amount}) 100%)`,
        mixBlendMode: 'soft-light',
      }}
    />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(10,11,13,${0.55 * amount}) 100%)`,
      }}
    />
  </>
);

/** Light leak hangat — dipacu oleh kekuatan 0..1 */
export const LightLeak: React.FC<{ strength: number; hue?: 'gold' | 'rose'; drift?: number }> = ({
  strength,
  hue = 'gold',
  drift = 0,
}) => {
  if (strength <= 0.001) return null;
  const col = hue === 'gold' ? '255,190,110' : '255,150,120';
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: strength, pointerEvents: 'none' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 40% at ${12 + drift * 30}% ${18 + drift * 10}%, rgba(${col},0.95), rgba(${col},0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 40% 55% at ${92 - drift * 20}% ${70 - drift * 15}%, rgba(255,120,60,0.55), rgba(255,120,60,0) 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Kilat peralihan putih-emas */
export const Flash: React.FC<{ at: number; t: number; dur?: number; peak?: number }> = ({ at, t, dur = 0.5, peak = 0.85 }) => {
  const o = Math.min(tw(t, [at - dur * 0.35, at], [0, peak], easeOut), tw(t, [at, at + dur * 0.65], [peak, 0]));
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, rgba(255,250,235,1) 0%, rgba(255,214,150,0.9) 45%, rgba(255,190,110,0.7) 100%)`,
        opacity: o,
      }}
    />
  );
};

/** Habuk cahaya terapung (deterministik) */
export const Dust: React.FC<{ count?: number; opacity?: number; seed?: string; area?: [number, number] }> = ({
  count = 40,
  opacity = 0.7,
  seed = 'dust',
  area = [0, 1920],
}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      {Array.from({ length: count }).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const size = 2 + r('s') * 6;
        const x = (r('x') * 1080 + Math.sin(t * (0.2 + r('w')) + i) * 30) % 1080;
        const y = area[0] + ((r('y') * (area[1] - area[0]) - t * (8 + r('v') * 22)) % (area[1] - area[0]) + (area[1] - area[0])) % (area[1] - area[0]);
        const tw2 = 0.35 + 0.65 * Math.abs(Math.sin(t * (0.6 + r('f')) + i));
        const blur = r('b') > 0.7 ? 3 : 0.5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: C.goldLight,
              boxShadow: `0 0 ${size * 3}px ${C.gold}`,
              opacity: tw2,
              filter: `blur(${blur}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Partikel letusan (particle reveal) di sekitar titik (x,y) bermula pada masa `at` */
export const Burst: React.FC<{ at: number; x: number; y: number; spread?: number; count?: number; seed: string }> = ({
  at,
  x,
  y,
  spread = 420,
  count = 36,
  seed,
}) => {
  const t = useCurrentFrame() / FPS - at;
  if (t < 0 || t > 2.2) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      {Array.from({ length: count }).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const ang = r('a') * Math.PI * 2;
        const dist = (0.3 + r('d') * 0.7) * spread * tw(t, [0, 1.6], [0, 1], easeOut);
        const px = x + Math.cos(ang) * dist * 1.3;
        const py = y + Math.sin(ang) * dist * 0.55 - t * 30;
        const s = 2 + r('s') * 6;
        const o = tw(t, [0, 0.1, 1.2, 2.2], [0, 1, 0.7, 0]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: s,
              height: s,
              borderRadius: '50%',
              background: '#fff6dc',
              boxShadow: `0 0 ${s * 4}px ${C.gold}`,
              opacity: o,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
