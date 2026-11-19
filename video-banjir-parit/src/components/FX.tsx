import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, Easing } from 'remotion';

/** Tekstur hujan halus (bukan hujan palsu yang berat) — garisan nipis yang jatuh condong. */
export const RainTexture: React.FC<{ opacity: number; count?: number }> = ({ opacity, count = 70 }) => {
  const frame = useCurrentFrame();
  if (opacity <= 0.001) return null;
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const speed = 38 + random(`rs${i}`) * 30;
        const len = 60 + random(`rl${i}`) * 110;
        const x = random(`rx${i}`) * 1240 - 80;
        const y = ((random(`ry${i}`) * 2200 + frame * speed) % 2300) - 250;
        const a = 0.18 + random(`ra${i}`) * 0.4;
        return (
          <div key={i} style={{
            position: 'absolute', left: x + y * 0.12, top: y, width: 2, height: len,
            background: `linear-gradient(to bottom, rgba(220,235,255,0), rgba(220,235,255,${a}))`,
            transform: 'rotate(7deg)', filter: 'blur(0.6px)',
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

/** Partikel cahaya keemasan — muncul apabila cerita bergerak ke arah harapan. */
export const GoldParticles: React.FC<{ opacity: number; count?: number }> = ({ opacity, count = 46 }) => {
  const frame = useCurrentFrame();
  if (opacity <= 0.001) return null;
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none', mixBlendMode: 'screen' }}>
      {Array.from({ length: count }).map((_, i) => {
        const size = 4 + random(`ps${i}`) * 12;
        const x = random(`px${i}`) * 1080 + Math.sin(frame / (40 + i) + i) * 30;
        const y = 1980 - ((random(`py${i}`) * 2100 + frame * (0.8 + random(`pv${i}`) * 1.8)) % 2100);
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / (14 + random(`pt${i}`) * 20) + i));
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,236,170,1) 0%, rgba(255,190,80,0.7) 40%, rgba(255,170,60,0) 70%)',
            opacity: tw, filter: `blur(${size > 11 ? 2 : 0.5}px)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

/** Jalur cahaya sinematik yang menyapu pepenjuru — dicetuskan pada pendedahan teks. */
export const LightStreak: React.FC<{ at: number; dur?: number; strength?: number }> = ({ at, dur = 26, strength = 0.55 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  if (p <= 0 || p >= 1) return null;
  const x = interpolate(p, [0, 1], [-900, 1500]);
  const o = Math.sin(p * Math.PI) * strength;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: o }}>
      <div style={{
        position: 'absolute', left: x, top: -400, width: 340, height: 2800, transform: 'rotate(22deg)',
        background: 'linear-gradient(90deg, rgba(255,210,140,0), rgba(255,228,180,0.75), rgba(255,210,140,0))', filter: 'blur(18px)',
      }} />
    </AbsoluteFill>
  );
};

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1.2 -0.1"/></filter><rect width="300" height="300" filter="url(#n)"/></svg>',
)}")`;

export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      backgroundImage: GRAIN, backgroundSize: '300px 300px', opacity, mixBlendMode: 'overlay', pointerEvents: 'none',
      backgroundPosition: `${Math.floor(random(`gx${frame}`) * 300)}px ${Math.floor(random(`gy${frame}`) * 300)}px`,
    }} />
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.5 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 62% at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`, pointerEvents: 'none' }} />
);

/** Gradien gelap atas & bawah supaya teks & subtitle sentiasa terbaca. */
export const ReadabilityScrims: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 22%)' }} />
    <AbsoluteFill style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.25) 26%, rgba(0,0,0,0) 40%)' }} />
  </>
);
