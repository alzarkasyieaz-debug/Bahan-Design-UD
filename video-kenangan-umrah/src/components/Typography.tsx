import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { GOLD, IVORY, useFade } from './core';

const GOLD_FILL = 'linear-gradient(180deg, #FFF6D6 0%, #F3D58F 32%, #D9A54A 55%, #F6DE9C 78%, #C7953C 100%)';

/** Teks emas 3D: lapisan belakang memberi ketebalan (extrusion) + bayang, lapisan depan isian kecerunan + sapuan cahaya. */
export const GoldText: React.FC<{
  text: string; size: number; depth?: number; sweep?: number; spacing?: string; weight?: number; family?: string;
}> = ({ text, size, depth = 6, sweep = -1, spacing = '0.06em', weight = 700, family = 'Cinzel' }) => {
  const extrude = new Array(depth).fill(0).map((_, i) => `0 ${i + 1}px 0 rgba(${120 - i * 8},${78 - i * 6},${22 - i * 2},1)`).join(', ');
  const common: React.CSSProperties = {
    fontFamily: family, fontWeight: weight, fontSize: size, letterSpacing: spacing, lineHeight: 1.15,
    whiteSpace: 'pre', textAlign: 'center',
  };
  const sweepPos = sweep < 0 ? -100 : -60 + sweep * 220;
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{ ...common, color: '#8A5E1E', textShadow: `${extrude}, 0 ${depth + 8}px 26px rgba(0,0,0,0.65), 0 0 40px rgba(232,194,122,0.25)` }}>{text}</div>
      <div
        style={{
          ...common, position: 'absolute', left: 0, top: 0,
          backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${sweepPos - 12}%, rgba(255,255,255,0.95) ${sweepPos}%, rgba(255,255,255,0) ${sweepPos + 12}%), ${GOLD_FILL}`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Ornament: React.FC<{ width: number; p: number }> = ({ width, p }) => (
  <div style={{ position: 'relative', width, height: 16, margin: '0 auto' }}>
    <div style={{ position: 'absolute', top: 7, left: '50%', width: width * p, height: 1.5, transform: 'translateX(-50%)', background: `linear-gradient(90deg, rgba(232,194,122,0), ${GOLD} 30%, ${GOLD} 70%, rgba(232,194,122,0))` }} />
    <div style={{ position: 'absolute', top: 2, left: '50%', width: 11, height: 11, background: GOLD, transform: `translateX(-50%) rotate(45deg) scale(${p})`, boxShadow: '0 0 12px rgba(232,194,122,0.8)' }} />
  </div>
);

/** Tajuk utama dengan pendedahan 3D (huruf demi huruf, kabur → tajam, condong → rata) + sapuan cahaya. */
export const Title3D: React.FC<{ text: string; at: number; until: number; size?: number; y?: number }> = ({ text, at, until, size = 120, y = 400 }) => {
  const f = useCurrentFrame();
  const op = useFade(at, until - at, 1, 24);
  if (f < at || f > until) return null;
  const chars = text.split('');
  const sweep = interpolate(f, [at + 40, at + 85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tilt = interpolate(f, [at, at + 50], [28, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const scale = interpolate(f, [at, until], [1.06, 1.0]);
  return (
    <AbsoluteFill style={{ opacity: op, perspective: 1400 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: y + 260, background: 'linear-gradient(180deg, rgba(14,5,22,0.78) 0%, rgba(14,5,22,0.5) 60%, rgba(14,5,22,0) 100%)', opacity: interpolate(f, [at, at + 30], [0, 1], { extrapolateRight: 'clamp' }) }} />
      <div style={{ position: 'absolute', top: y, left: 0, right: 0, textAlign: 'center', transform: `translateY(-50%) rotateX(${tilt}deg) scale(${scale})` }}>
        {chars.map((c, i) => {
          const s = at + i * 2.2;
          const e = interpolate(f, [s, s + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
          return (
            <span key={i} style={{ display: 'inline-block', opacity: e, filter: `blur(${(1 - e) * 10}px)`, transform: `translateY(${(1 - e) * 24}px)` }}>
              <GoldText text={c === ' ' ? ' ' : c} size={size} depth={8} sweep={sweep} spacing="0.04em" />
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Subtajuk Poppins berwarna gading. */
export const SubTitle: React.FC<{ text: string; at: number; until: number; y: number; size?: number; italic?: boolean; color?: string }> = ({
  text, at, until, y, size = 40, italic = false, color = IVORY,
}) => {
  const f = useCurrentFrame();
  const op = useFade(at, until - at, 24, 24);
  if (f < at || f > until) return null;
  const e = interpolate(f, [at, at + 30], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const ls = interpolate(f, [at, until], [0.16, 0.1]);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{
        position: 'absolute', top: y, left: 0, right: 0, textAlign: 'center', transform: `translateY(calc(-50% + ${(1 - e) * 18}px))`,
        fontFamily: 'Poppins', fontWeight: 300, fontStyle: italic ? 'italic' : 'normal', fontSize: size, color,
        letterSpacing: `${ls}em`, textShadow: '0 2px 14px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.6)', filter: `blur(${(1 - e) * 6}px)`,
      }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Teks babak: Cinzel emas 3D halus, ornamen, jalur gelap lembut untuk kontras. */
export const Caption: React.FC<{ text: string; at: number; until: number; pos?: 'bottom' | 'top'; size?: number }> = ({
  text, at, until, pos = 'bottom', size = 60,
}) => {
  const f = useCurrentFrame();
  const op = useFade(at, until - at, 22, 22);
  if (f < at || f > until) return null;
  const e = interpolate(f, [at, at + 34], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const sweep = interpolate(f, [at + 20, at + 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const yc = pos === 'bottom' ? 930 : 140;
  const fit = Math.min(size, 1720 / (text.length * 0.74));
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 330, [pos === 'bottom' ? 'bottom' : 'top']: 0,
        background: `linear-gradient(${pos === 'bottom' ? '0deg' : '180deg'}, rgba(16,6,24,0.72) 0%, rgba(16,6,24,0.38) 55%, rgba(16,6,24,0) 100%)`,
      } as React.CSSProperties} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: yc, transform: `translateY(-50%) translateY(${(1 - e) * 22}px)`, textAlign: 'center', filter: `blur(${(1 - e) * 5}px)` }}>
        <Ornament width={260} p={e} />
        <div style={{ height: 10 }} />
        <GoldText text={text} size={fit} depth={3} sweep={sweep} weight={600} spacing="0.05em" />
      </div>
    </AbsoluteFill>
  );
};
