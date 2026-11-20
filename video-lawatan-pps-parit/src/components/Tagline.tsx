import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ease } from './Looks';
import { GOLD, GOLD_SOFT } from './Typography';
import { useTimeline } from '../data/timeline';

/** Teks "3D" sinematik: lapisan ekstrusi + permukaan emas-putih + sapuan cahaya */
const Text3D: React.FC<{ text: string; size: number; t: number; sweepAt: number }> = ({ text, size, t, sweepAt }) => {
  const depth = 7;
  const extrude = Array.from({ length: depth }, (_, i) => `0 ${i + 1}px 0 rgb(${120 - i * 9},${82 - i * 7},${30 - i * 3})`).join(', ');
  const sweep = interpolate(t, [sweepAt, sweepAt + 1.4], [-60, 160], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const base: React.CSSProperties = {
    fontFamily: 'Cinzel', fontWeight: 700, fontSize: size, letterSpacing: '0.06em', lineHeight: 1.05, whiteSpace: 'nowrap',
  };
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{ ...base, color: '#7a5420', textShadow: `${extrude}, 0 ${depth + 8}px 24px rgba(0,0,0,0.65), 0 0 60px rgba(242,197,107,0.35)` }}>{text}</div>
      <div
        style={{
          ...base, position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 14}%, rgba(255,255,255,0.95) ${sweep}%, rgba(255,255,255,0) ${sweep + 14}%),
            linear-gradient(180deg, #FFFFFF 0%, #FFF4D6 32%, ${GOLD_SOFT} 55%, ${GOLD} 78%, #C9963F 100%)`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Tagline: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const TAGLINE = useTimeline().g.tagline;
  if (t < TAGLINE.a - 0.2) return null;
  const pa = interpolate(t, [TAGLINE.a, TAGLINE.a + 1.1], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const pb = interpolate(t, [TAGLINE.b, TAGLINE.b + 1.1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const pf = interpolate(t, [TAGLINE.full, TAGLINE.full + 1.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const out = interpolate(t, [TAGLINE.fadeOut, 119.85], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rotA = (1 - pa) * 38;
  const rotB = (1 - pb) * 38;
  const lift = pf * -70;
  const drift = interpolate(t, [TAGLINE.a, 120], [1, 1.04]);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: out, perspective: 1200 }}>
      <div style={{ textAlign: 'center', transform: `translateY(${lift - 60}px) scale(${drift})` }}>
        <div style={{ opacity: pa, transform: `rotateX(${rotA}deg) translateY(${(1 - pa) * 40}px)`, filter: `blur(${(1 - pa) * 10}px)` }}>
          <Text3D text="PARIT" size={150} t={t} sweepAt={TAGLINE.a + 0.8} />
          <div style={{ height: 6 }} />
          <Text3D text="SEJAHTERA" size={118} t={t} sweepAt={TAGLINE.a + 1.0} />
        </div>
        <div style={{ margin: '26px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, opacity: pb }}>
          <div style={{ width: 160 * pb, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
          <div style={{ width: 12, height: 12, transform: 'rotate(45deg)', background: GOLD, boxShadow: `0 0 14px ${GOLD}` }} />
          <div style={{ width: 160 * pb, height: 2, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
        </div>
        <div style={{ opacity: pb, transform: `rotateX(${rotB}deg) translateY(${(1 - pb) * 40}px)`, filter: `blur(${(1 - pb) * 10}px)` }}>
          <Text3D text="MAKMUR" size={118} t={t} sweepAt={TAGLINE.b + 0.8} />
          <div style={{ height: 6 }} />
          <Text3D text="BERSAMA" size={118} t={t} sweepAt={TAGLINE.b + 1.0} />
        </div>
        <div
          style={{
            marginTop: 70, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 500, fontSize: 52, color: '#FFF4DE',
            letterSpacing: `${0.02 + pf * 0.03}em`, opacity: pf, transform: `translateY(${(1 - pf) * 24}px)`,
            textShadow: `0 0 28px rgba(242,197,107,0.55), 0 3px 10px rgba(0,0,0,0.7)`,
          }}
        >
          Parit Sejahtera Makmur Bersama
        </div>
      </div>
    </AbsoluteFill>
  );
};
