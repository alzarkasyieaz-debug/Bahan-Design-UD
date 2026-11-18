import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { C, F } from '../theme';

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/**
 * Tajuk emas 3D: lapisan ekstrusi (bayang berlapis) + isian gradien emas + sapuan cahaya.
 * Masuk dengan putaran X dalam perspektif, keluar dengan pudar.
 */
export const Title3D: React.FC<{
  text: string;
  size: number;
  top: number;
  delay?: number;
  out?: number;
  spacing?: number;
  depth?: number;
}> = ({ text, size, top, delay = 0, out = 99999, spacing = 0.08, depth = 7 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f - delay, [0, 42], [0, 1], { ...clamp, easing: ease });
  const o = interpolate(f, [out - 24, out], [1, 0], clamp);
  const sweep = interpolate(f - delay, [24, 84], [-30, 130], clamp);
  const ext = new Array(depth)
    .fill(0)
    .map((_, i) => `0 ${i + 1}px 0 ${i < depth / 2 ? C.goldDeep : '#5e431a'}`)
    .join(', ');
  const base: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    top,
    textAlign: 'center',
    fontFamily: F.title,
    fontWeight: 700,
    fontSize: size,
    letterSpacing: `${spacing + (1 - t) * 0.25}em`,
    lineHeight: 1.1,
    whiteSpace: 'nowrap',
  };
  return (
    <AbsoluteFill
      style={{
        perspective: 1200,
        opacity: t * o,
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, transform: `rotateX(${(1 - t) * 38}deg) translateY(${(1 - t) * 30}px)`, transformOrigin: `50% ${top + size / 2}px`, filter: `blur(${(1 - t) * 6}px)` }}>
        <div style={{ ...base, color: C.goldDeep, textShadow: `${ext}, 0 ${depth + 6}px 28px rgba(0,0,0,0.75)` }}>{text}</div>
        <div
          style={{
            ...base,
            color: 'transparent',
            backgroundImage: `linear-gradient(100deg, transparent ${sweep - 12}%, rgba(255,255,255,0.95) ${sweep}%, transparent ${sweep + 12}%), linear-gradient(180deg, ${C.goldLight} 0%, ${C.gold} 55%, #b88a3e 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Teks biasa yang muncul lembut (subtajuk, naratif) */
export const Fade: React.FC<{
  text: string;
  top: number;
  size: number;
  delay?: number;
  out?: number;
  color?: string;
  italic?: boolean;
  weight?: number;
  font?: string;
  maxWidth?: number;
  spacing?: string;
}> = ({ text, top, size, delay = 0, out = 99999, color = C.cream, italic, weight = 300, font = F.body, maxWidth = 1500, spacing = '0.01em' }) => {
  const f = useCurrentFrame();
  const t = interpolate(f - delay, [0, 30], [0, 1], { ...clamp, easing: ease });
  const o = interpolate(f, [out - 22, out], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top,
        width: maxWidth,
        marginLeft: -maxWidth / 2,
        textAlign: 'center',
        fontFamily: font,
        fontSize: size,
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: weight,
        color,
        letterSpacing: spacing,
        lineHeight: 1.45,
        opacity: t * o,
        transform: `translateY(${(1 - t) * 16}px)`,
        filter: `blur(${(1 - t) * 4}px)`,
        textShadow: '0 2px 18px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.6)',
      }}
    >
      {text}
    </div>
  );
};

/** Pertiga bawah: gradien gelap + tajuk babak (3D) + baris naratif */
export const LowerThird: React.FC<{ title: string; vo: string; dur: number }> = ({ title, vo, dur }) => {
  const f = useCurrentFrame();
  const bg = interpolate(f, [0, 30, dur - 30, dur], [0, 1, 1, 0], clamp);
  const size = title.length > 34 ? 50 : 58;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 400, opacity: bg, background: 'linear-gradient(180deg, transparent, rgba(20,10,36,0.55) 45%, rgba(20,10,36,0.88))' }} />
      <Title3D text={title} size={size} top={812} delay={14} out={dur - 8} spacing={0.04} depth={5} />
      <Ornament top={895} delay={36} out={dur - 8} />
      <Fade text={vo} top={922} size={30} italic delay={56} out={dur - 8} maxWidth={1480} />
    </AbsoluteFill>
  );
};

export const Ornament: React.FC<{ top: number; delay?: number; out?: number; width?: number }> = ({ top, delay = 0, out = 99999, width = 300 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f - delay, [0, 36], [0, 1], { ...clamp, easing: ease });
  const o = interpolate(f, [out - 22, out], [1, 0], clamp);
  const half = (width / 2) * t;
  return (
    <svg width={1920} height={24} style={{ position: 'absolute', left: 0, top: top - 12, opacity: t * o }}>
      <g transform="translate(960 12)">
        <line x1={-20} x2={-20 - half} stroke={C.gold} strokeWidth={1.4} />
        <line x1={20} x2={20 + half} stroke={C.gold} strokeWidth={1.4} />
        <path d="M0 -8 L8 0 L0 8 L-8 0 Z" fill="none" stroke={C.gold} strokeWidth={1.6} />
        <path d="M0 -3.5 L3.5 0 L0 3.5 L-3.5 0 Z" fill={C.goldLight} />
      </g>
    </svg>
  );
};
