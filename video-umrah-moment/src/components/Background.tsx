import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { C, H, W } from '../theme';

/** Jubin corak geometri Islamik: bintang 8 bucu + roset */
const StarTile: React.FC<{ s: number }> = ({ s }) => {
  const h = s / 2;
  const r = s * 0.34;
  return (
    <g>
      <rect x={h - r} y={h - r} width={r * 2} height={r * 2} />
      <rect x={h - r} y={h - r} width={r * 2} height={r * 2} transform={`rotate(45 ${h} ${h})`} />
      <circle cx={h} cy={h} r={r * 0.42} />
      <path d={`M0 0 L${s * 0.16} ${s * 0.16} M${s} 0 L${s - s * 0.16} ${s * 0.16} M0 ${s} L${s * 0.16} ${s - s * 0.16} M${s} ${s} L${s - s * 0.16} ${s - s * 0.16}`} />
    </g>
  );
};

export const Background: React.FC<{ tint?: number }> = ({ tint = 0 }) => {
  const f = useCurrentFrame();
  const s = 150;
  const drift = (f * 0.35) % s;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 60% at 50% 38%, ${C.emerald} 0%, ${C.emeraldDeep} 45%, ${C.night} 100%)`,
        }}
      />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="star" width={s} height={s} patternUnits="userSpaceOnUse" patternTransform={`translate(0 ${-drift})`}>
            <g stroke={C.gold} strokeWidth={1.4} fill="none">
              <StarTile s={s} />
            </g>
          </pattern>
          <radialGradient id="fadeMask" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity={0.25} />
            <stop offset="100%" stopColor="white" stopOpacity={1} />
          </radialGradient>
          <mask id="m">
            <rect width={W} height={H} fill="url(#fadeMask)" />
          </mask>
        </defs>
        <rect width={W} height={H} fill="url(#star)" opacity={0.085 + tint * 0.03} mask="url(#m)" />
      </svg>
      <GoldDust />
      {/* cahaya atas */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 25% at 50% 0%, rgba(242,220,168,0.18), transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const GoldDust: React.FC<{ count?: number; seed?: string }> = ({ count = 46, seed = 'dust' }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      {new Array(count).fill(0).map((_, i) => {
        const x0 = random(`${seed}x${i}`) * W;
        const speed = 0.25 + random(`${seed}s${i}`) * 0.7;
        const y = (random(`${seed}y${i}`) * (H + 200) - f * speed + H * 4) % (H + 200) - 100;
        const x = x0 + Math.sin(f / 60 + i) * 18;
        const r = 1 + random(`${seed}r${i}`) * 2.6;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / (25 + i) + i));
        return <circle key={i} cx={x} cy={y} r={r} fill={C.goldLight} opacity={0.5 * tw} />;
      })}
    </svg>
  );
};

/** Vinyet + bijian filem halus di atas semua lapisan */
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill
        style={{ background: 'radial-gradient(ellipse 85% 75% at 50% 48%, transparent 55%, rgba(0,0,0,0.55) 100%)' }}
      />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay' }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 12} />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
