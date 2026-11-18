import React from 'react';
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import { C, H, W } from '../theme';

/** Debu emas dua lapis kedalaman (parallax): lapis jauh kecil & perlahan, lapis dekat besar, kabur & laju */
export const Particles: React.FC<{ seed?: string; amount?: number; drift?: number }> = ({ seed = 'p', amount = 1, drift = 0 }) => {
  const f = useCurrentFrame();
  const layer = (n: number, depth: number, key: string) =>
    new Array(Math.round(n * amount)).fill(0).map((_, i) => {
      const r0 = random(`${seed}${key}${i}`);
      const r1 = random(`${seed}${key}y${i}`);
      const r2 = random(`${seed}${key}s${i}`);
      const speed = (0.15 + r2 * 0.35) * depth;
      const x = ((r0 * (W + 200) + f * 0.25 * depth + drift * depth + Math.sin(f / 70 + i) * 20 * depth) % (W + 200)) - 100;
      const y = ((r1 * (H + 200) - f * speed + 10 * H) % (H + 200)) - 100;
      const size = (1.2 + r2 * 2.2) * depth;
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (30 + i * 3) + i));
      return (
        <div
          key={key + i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: size * 2,
            height: size * 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${C.goldLight} 0%, rgba(244,225,176,0) 70%)`,
            opacity: (depth > 1.5 ? 0.35 : 0.7) * tw,
          }}
        />
      );
    });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {layer(40, 1, 'a')}
      {layer(10, 2.6, 'b')}
    </AbsoluteFill>
  );
};

/** Light leak hangat yang bergerak perlahan */
export const LightLeak: React.FC<{ seed?: string; strength?: number }> = ({ seed = 'l', strength = 1 }) => {
  const f = useCurrentFrame();
  const a = random(seed) * Math.PI * 2;
  const x1 = 15 + 25 * Math.sin(f / 140 + a);
  const y1 = 10 + 15 * Math.cos(f / 170 + a);
  const x2 = 85 + 12 * Math.sin(f / 120 + a * 2);
  const y2 = 90 + 10 * Math.cos(f / 150 + a);
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: 'screen',
        opacity: 0.32 * strength,
        background: `radial-gradient(ellipse 45% 55% at ${x1}% ${y1}%, rgba(255,190,110,0.85), transparent 70%), radial-gradient(ellipse 35% 40% at ${x2}% ${y2}%, rgba(190,120,255,0.55), transparent 70%)`,
      }}
    />
  );
};

/** Sinar cahaya keemasan dari atas */
export const LightRays: React.FC<{ strength?: number }> = ({ strength = 1 }) => {
  const f = useCurrentFrame();
  const rot = Math.sin(f / 120) * 3;
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.38 * strength, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: W * 0.62 - 1400,
          top: -1400,
          width: 2800,
          height: 2800,
          transform: `rotate(${rot}deg)`,
          background:
            'conic-gradient(from 150deg at 50% 50%, transparent 0deg, rgba(255,214,150,0.55) 4deg, transparent 9deg, transparent 14deg, rgba(255,214,150,0.35) 17deg, transparent 22deg, rgba(255,214,150,0.45) 27deg, transparent 33deg, transparent 40deg, rgba(255,214,150,0.3) 44deg, transparent 50deg, transparent 360deg)',
          maskImage: 'radial-gradient(circle at 50% 50%, black 0%, black 30%, transparent 62%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 0%, black 30%, transparent 62%)',
        }}
      />
      {/* lens glow */}
      <div
        style={{
          position: 'absolute',
          left: W * 0.62 - 260,
          top: -260,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,236,190,0.9), rgba(255,200,120,0.25) 40%, transparent 70%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Sapuan cahaya pepenjuru (transisi elegan) — t: 0→1 */
export const Sweep: React.FC<{ t: number }> = ({ t }) => {
  if (t <= 0 || t >= 1) return null;
  const x = interpolate(t, [0, 1], [-60, 160]);
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: 'screen',
        opacity: Math.sin(t * Math.PI) * 0.75,
        background: `linear-gradient(105deg, transparent ${x - 22}%, rgba(255,222,160,0.55) ${x - 6}%, rgba(255,246,220,0.9) ${x}%, rgba(255,222,160,0.55) ${x + 6}%, transparent ${x + 22}%)`,
      }}
    />
  );
};

/** Gred warna hangat + vinyet + bijian filem (tekstur dijana awal) */
export const Grade: React.FC = () => {
  const f = useCurrentFrame();
  const g = Math.floor(f / 2) % 4;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(255,200,130,0.10), rgba(80,40,120,0.12))', mixBlendMode: 'soft-light' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 70% at 50% 46%, transparent 55%, rgba(12,4,24,0.62) 100%)' }} />
      <Img
        src={staticFile(`fx/grain${g}.png`)}
        style={{ position: 'absolute', inset: 0, width: W, height: H, opacity: 0.06, mixBlendMode: 'overlay', transform: `translate(${(g % 2) * 7}px, ${g * 3}px) scale(1.02)` }}
      />
    </AbsoluteFill>
  );
};

/** Latar ungu dalam dengan corak bintang 8 bucu (untuk kolaj) */
export const PurpleBackdrop: React.FC<{ blurSrc?: string }> = ({ blurSrc }) => {
  const f = useCurrentFrame();
  const s = 130;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 70% at 50% 40%, ${C.purpleMid} 0%, ${C.purple} 45%, ${C.purpleDeep} 100%)` }} />
      {blurSrc && (
        <Img
          src={staticFile(`img/blur/${blurSrc}.jpg`)}
          style={{ position: 'absolute', inset: -40, width: W + 80, height: H + 80, objectFit: 'cover', opacity: 0.35, mixBlendMode: 'luminosity', transform: `scale(${1.05 + f * 0.0002})` }}
        />
      )}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: 0.09 }}>
        <defs>
          <pattern id="st" width={s} height={s} patternUnits="userSpaceOnUse" patternTransform={`translate(${-f * 0.3} 0)`}>
            <g stroke={C.gold} strokeWidth={1.3} fill="none">
              <rect x={s / 2 - 42} y={s / 2 - 42} width={84} height={84} />
              <rect x={s / 2 - 42} y={s / 2 - 42} width={84} height={84} transform={`rotate(45 ${s / 2} ${s / 2})`} />
              <circle cx={s / 2} cy={s / 2} r={18} />
            </g>
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#st)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Bingkai emas elegan di tepi skrin dengan hiasan sudut */
export const GoldFrame: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f - delay, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const m = 42;
  const corner = (x: number, y: number, sx: number, sy: number) => (
    <g transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
      <path d="M0 60 L0 0 L60 0" stroke={C.gold} strokeWidth={3} fill="none" />
      <path d="M14 46 L14 14 L46 14" stroke={C.goldLight} strokeWidth={1.4} fill="none" />
      <path d="M0 0 L10 -10 L20 0 L10 10 Z" fill={C.gold} transform="translate(-10 0) rotate(0)" />
    </g>
  );
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: t }}>
      <rect x={m} y={m} width={W - m * 2} height={H - m * 2} fill="none" stroke={C.gold} strokeWidth={1.6} opacity={0.85} />
      <rect x={m + 10} y={m + 10} width={W - m * 2 - 20} height={H - m * 2 - 20} fill="none" stroke={C.goldLight} strokeWidth={0.8} opacity={0.6} />
      {corner(m, m, 1, 1)}
      {corner(W - m, m, -1, 1)}
      {corner(m, H - m, 1, -1)}
      {corner(W - m, H - m, -1, -1)}
    </svg>
  );
};
