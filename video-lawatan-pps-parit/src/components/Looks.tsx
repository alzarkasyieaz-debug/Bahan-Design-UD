import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, Easing } from 'remotion';

/** Vignette sinematik lembut */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 62% at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** Film grain minimum (SVG noise, berubah setiap 2 frame) */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 97;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
      <svg width="1080" height="1920">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1080" height="1920" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Light leak hangat yang bergerak perlahan (minimum) */
export const LightLeak: React.FC<{ from: number; to: number; peak?: number; seed?: string }> = ({
  from, to, peak = 0.35, seed = 'a',
}) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const p = (f - from) / (to - from);
  const o = interpolate(p, [0, 0.3, 0.7, 1], [0, peak, peak, 0]);
  const x = interpolate(p, [0, 1], [-10 + random(seed) * 30, 70 + random(seed + 'x') * 30]);
  const y = 15 + random(seed + 'y') * 60;
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        mixBlendMode: 'screen',
        background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,170,90,0.85) 0%, rgba(255,120,60,0.35) 22%, rgba(0,0,0,0) 52%)`,
        pointerEvents: 'none',
      }}
    />
  );
};

/** Cahaya lembut (soft glow / bloom ringan) untuk babak montaj */
export const SoftGlow: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill
    style={{
      opacity,
      mixBlendMode: 'soft-light',
      background: 'linear-gradient(180deg, rgba(255,214,160,0.55) 0%, rgba(255,190,120,0.25) 45%, rgba(40,20,0,0.1) 100%)',
      pointerEvents: 'none',
    }}
  />
);

/** Gradien gelap bawah/atas untuk kebolehbacaan teks */
export const TextScrim: React.FC<{ top?: number; bottom?: number }> = ({ top = 0.35, bottom = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(0,0,0,${top}) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 52%, rgba(0,0,0,${bottom}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
