import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { C, F, W } from '../theme';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const reveal = (f: number, delay: number, len = 26) =>
  interpolate(f - delay, [0, len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

/** Ornamen pembahagi emas: garis — berlian — garis */
export const Ornament: React.FC<{ y: number; delay?: number; width?: number }> = ({ y, delay = 0, width = 360 }) => {
  const f = useCurrentFrame();
  const t = reveal(f, delay, 34);
  const half = (width / 2) * t;
  return (
    <svg width={W} height={40} style={{ position: 'absolute', left: 0, top: y - 20 }}>
      <g transform={`translate(${W / 2} 20)`} opacity={t}>
        <line x1={-26} x2={-26 - half} y1={0} y2={0} stroke={C.gold} strokeWidth={1.6} />
        <line x1={26} x2={26 + half} y1={0} y2={0} stroke={C.gold} strokeWidth={1.6} />
        <path d="M0 -11 L11 0 L0 11 L-11 0 Z" fill="none" stroke={C.gold} strokeWidth={1.8} />
        <path d="M0 -5 L5 0 L0 5 L-5 0 Z" fill={C.goldLight} />
        <circle cx={-20} r={2.4} fill={C.gold} />
        <circle cx={20} r={2.4} fill={C.gold} />
      </g>
    </svg>
  );
};

/** Teks yang muncul perkataan demi perkataan dengan kabur → tajam */
export const WordReveal: React.FC<{
  text: string;
  y: number;
  size: number;
  font: string;
  color?: string;
  delay?: number;
  stagger?: number;
  italic?: boolean;
  spacing?: number;
  weight?: number;
  shadow?: boolean;
  rtl?: boolean;
  nowrap?: boolean;
}> = ({ text, y, size, font, color = C.cream, delay = 0, stagger = 4, italic, spacing = 0, weight = 400, shadow = true, rtl, nowrap }) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: y,
        textAlign: 'center',
        direction: rtl ? 'rtl' : 'ltr',
        whiteSpace: nowrap ? 'nowrap' : 'normal',
        fontFamily: font,
        fontSize: size,
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: weight,
        letterSpacing: spacing,
        color,
        lineHeight: 1.15,
        textShadow: shadow ? '0 4px 24px rgba(0,0,0,0.55)' : undefined,
      }}
    >
      {words.map((w, i) => {
        const t = reveal(f, delay + i * stagger, 24);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: t,
              transform: `translateY(${(1 - t) * 22}px)`,
              filter: `blur(${(1 - t) * 8}px)`,
              marginInlineEnd: i < words.length - 1 ? size * 0.25 : 0,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Tajuk bab: label kecil "BAB 02" + tajuk skrip + ornamen */
export const ChapterTitle: React.FC<{ no: number; title: string; y?: number }> = ({ no, title, y = 150 }) => (
  <>
    <WordReveal text={`MOMEN ${String(no).padStart(2, '0')}`} y={y} size={36} font={F.display} color={C.gold} spacing={10} delay={4} />
    <WordReveal text={title} y={y + 52 + (title.length > 22 ? 8 : 0)} size={title.length > 22 ? 66 : 80} font={F.script} italic delay={10} stagger={5} nowrap />
    <Ornament y={y + 175} delay={18} />
  </>
);

/** Kapsyen bawah */
export const Caption: React.FC<{ text: string; y: number; delay?: number }> = ({ text, y, delay = 40 }) => (
  <WordReveal text={text} y={y} size={38} font={F.body} color={C.goldLight} delay={delay} stagger={2} weight={400} />
);
