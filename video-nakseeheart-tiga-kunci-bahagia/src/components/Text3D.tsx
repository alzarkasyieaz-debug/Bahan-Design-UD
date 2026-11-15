import React from 'react';
import { C, FONT, tw, easeOut, back, useTime } from '../lib';

/** Bayang extrusion bertingkat (kedalaman 3D) */
const extrusion = (depth: number, dx: number, dy: number, from: string, to: string) => {
  const layers: string[] = [];
  for (let i = 1; i <= depth; i++) {
    const k = i / depth;
    layers.push(`${(dx * i).toFixed(2)}px ${(dy * i).toFixed(2)}px 0 ${k < 0.5 ? from : to}`);
  }
  layers.push(`${dx * depth}px ${dy * depth + 18}px 40px rgba(0,0,0,0.65)`);
  return layers.join(', ');
};

export type Text3DProps = {
  text: string;
  /** masa mula (saat output) */
  at: number;
  /** masa tamat (saat) — keluar dengan pudar + kabur */
  until?: number;
  x: number;
  y: number;
  size: number;
  font?: string;
  tracking?: number;
  /** gaya pendedahan */
  reveal?: 'letters' | 'punch' | 'rise';
  depth?: number;
  fill?: 'gold' | 'cream' | 'white' | 'red';
  rotY?: number;
  rotX?: number;
  /** kuat sapuan cahaya (0 = tiada) */
  sweep?: boolean;
  /** goyang terapung */
  float?: boolean;
  /** menjadi pudar/kabur (cth. bila kata kunci seterusnya muncul) */
  recedeAt?: number;
  align?: 'center' | 'left' | 'right';
  opacity?: number;
};

const FILLS = {
  gold: 'linear-gradient(180deg, #FFF3CF 0%, #FFD989 38%, #E9B95C 62%, #B9852F 100%)',
  cream: 'linear-gradient(180deg, #FFFFFF 0%, #F6EBD9 55%, #D9C3A0 100%)',
  white: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 60%, #E6E6E6 100%)',
  red: 'linear-gradient(180deg, #FFE1D6 0%, #FF9C84 40%, #E0533A 70%, #9E2617 100%)',
};
const SIDES = {
  gold: ['#8A5A18', '#3A250A'],
  cream: ['#9C8462', '#3B3125'],
  white: ['#8D8D8D', '#2F2F2F'],
  red: ['#7A1C10', '#2E0904'],
};

export const Text3D: React.FC<Text3DProps> = ({
  text,
  at,
  until = 9999,
  x,
  y,
  size,
  font = FONT.display,
  tracking = 0.02,
  reveal = 'letters',
  depth = 14,
  fill = 'gold',
  rotY = 0,
  rotX = 8,
  sweep = true,
  float = true,
  recedeAt,
  align = 'center',
  opacity = 1,
}) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.6) return null;
  const lt = t - at;
  const out = tw(t, [until, until + 0.55], [0, 1]);
  const rec = recedeAt !== undefined ? tw(t, [recedeAt, recedeAt + 0.6], [0, 1]) : 0;

  const punch = reveal === 'punch' ? tw(lt, [0, 0.35], [1.35, 1], back) : 1;
  const rise = reveal === 'rise' ? tw(lt, [0, 0.7], [60, 0], easeOut) : 0;
  const baseO = reveal === 'letters' ? 1 : tw(lt, [0, 0.25], [0, 1]);
  const fl = float ? Math.sin(t * 1.1 + x * 0.01) * 6 : 0;
  const ry = rotY + (float ? Math.sin(t * 0.6 + y) * 3 : 0);
  const scale = punch * (1 - rec * 0.18) * (1 + out * 0.08);
  const blur = (reveal === 'letters' ? 0 : tw(lt, [0, 0.3], [10, 0])) + rec * 5 + out * 14;
  const o = baseO * (1 - out) * (1 - rec * 0.6) * opacity;

  const anchor = align === 'center' ? '-50%' : align === 'left' ? '0%' : '-100%';
  const chars = Array.from(text);

  const renderLayer = (layer: 'side' | 'face' | 'sweep') => (
    <div
      style={{
        position: layer === 'side' ? 'relative' : 'absolute',
        inset: 0,
        whiteSpace: 'pre',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {chars.map((ch, i) => {
        const d = reveal === 'letters' ? i * 0.045 : 0;
        const p = reveal === 'letters' ? tw(lt, [d, d + 0.55], [0, 1], easeOut) : 1;
        const style: React.CSSProperties = {
          display: 'inline-block',
          transform: `translateY(${(1 - p) * 0.5 * size}px) rotateX(${(1 - p) * -85}deg) translateZ(${(1 - p) * -200}px)`,
          opacity: p,
          filter: reveal === 'letters' && p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
          transformOrigin: '50% 100%',
        };
        if (layer === 'side') {
          return (
            <span key={i} style={{ ...style, color: SIDES[fill][0], textShadow: extrusion(depth, 0.55, 0.9, SIDES[fill][0], SIDES[fill][1]) }}>
              {ch}
            </span>
          );
        }
        if (layer === 'face') {
          return (
            <span
              key={i}
              style={{
                ...style,
                backgroundImage: FILLS[fill],
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {ch}
            </span>
          );
        }
        // sapuan cahaya: jalur putih bergerak merentasi teks
        const sx = tw(lt, [0.5, 1.6], [-60, 160]);
        return (
          <span
            key={i}
            style={{
              ...style,
              backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${sx - 18}%, rgba(255,255,255,0.95) ${sx}%, rgba(255,255,255,0) ${sx + 18}%)`,
              backgroundSize: `${chars.length * 100}% 100%`,
              backgroundPosition: `${(i / Math.max(1, chars.length - 1)) * 100}% 0`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              mixBlendMode: 'overlay',
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${anchor}, -50%) translateY(${fl + rise}px)`,
        perspective: 1400,
        opacity: o,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      }}
    >
      <div
        style={{
          position: 'relative',
          fontFamily: font,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: `${tracking}em`,
          transform: `rotateX(${rotX}deg) rotateY(${ry}deg) scale(${scale})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {renderLayer('side')}
        {renderLayer('face')}
        {sweep && renderLayer('sweep')}
      </div>
    </div>
  );
};

/** Label kecil elegan (Cinzel) dengan garis emas */
export const Label: React.FC<{ text: string; at: number; until?: number; x?: number; y: number; size?: number; color?: string }> = ({
  text,
  at,
  until = 9999,
  x = 540,
  y,
  size = 40,
  color = C.goldLight,
}) => {
  const t = useTime();
  if (t < at || t > until + 0.5) return null;
  const p = tw(t - at, [0, 0.7], [0, 1], easeOut);
  const o = p * tw(t, [until, until + 0.45], [1, 0]);
  const line = tw(t - at, [0.2, 1.0], [0, 1], easeOut);
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: o, textAlign: 'center' }}>
      <div
        style={{
          fontFamily: FONT.serif,
          fontWeight: 800,
          fontSize: size,
          letterSpacing: `${0.32 - p * 0.1}em`,
          color,
          textShadow: '0 4px 18px rgba(0,0,0,0.75), 0 0 24px rgba(233,185,92,0.35)',
          whiteSpace: 'nowrap',
          filter: `blur(${(1 - p) * 6}px)`,
        }}
      >
        {text}
      </div>
      <div
        style={{
          margin: '14px auto 0',
          height: 3,
          width: 260 * line,
          background: `linear-gradient(90deg, rgba(233,185,92,0), ${C.gold}, rgba(233,185,92,0))`,
          boxShadow: `0 0 12px ${C.gold}`,
        }}
      />
    </div>
  );
};

/** Petikan terapung italik (Playfair) */
export const FloatQuote: React.FC<{ text: string; at: number; until: number; y: number; size?: number; x?: number }> = ({
  text,
  at,
  until,
  y,
  size = 58,
  x = 540,
}) => {
  const t = useTime();
  if (t < at || t > until + 0.6) return null;
  const words = text.split(' ');
  const out = tw(t, [until, until + 0.5], [1, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 920,
        transform: `translate(-50%,-50%) translateY(${Math.sin(t * 0.9) * 5}px)`,
        textAlign: 'center',
        opacity: out,
        fontFamily: FONT.italic,
        fontStyle: 'italic',
        fontSize: size,
        lineHeight: 1.22,
        color: C.cream,
        textShadow: '0 6px 26px rgba(0,0,0,0.85), 0 0 30px rgba(233,185,92,0.35)',
      }}
    >
      {words.map((w, i) => {
        const p = tw(t - at, [i * 0.09, i * 0.09 + 0.6], [0, 1], easeOut);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: '0.28em',
              opacity: p,
              transform: `translateY(${(1 - p) * 26}px)`,
              filter: `blur(${(1 - p) * 8}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Lencana nombor (01 / 02) dengan cincin emas berputar */
export const NumberBadge: React.FC<{ n: string; caption: string; at: number; until: number; x?: number; y: number }> = ({
  n,
  caption,
  at,
  until,
  x = 540,
  y,
}) => {
  const t = useTime();
  if (t < at || t > until + 0.5) return null;
  const p = tw(t - at, [0, 0.5], [0, 1], back);
  const o = tw(t - at, [0, 0.2], [0, 1]) * tw(t, [until, until + 0.45], [1, 0]);
  const ring = tw(t - at, [0, 0.9], [0, 360], easeOut);
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${p})`, opacity: o, display: 'flex', alignItems: 'center', gap: 22 }}>
      <div
        style={{
          width: 116,
          height: 116,
          borderRadius: '50%',
          background: `conic-gradient(from ${ring}deg, ${C.goldLight}, ${C.gold}, ${C.goldDeep}, ${C.goldLight})`,
          padding: 5,
          boxShadow: `0 0 30px rgba(233,185,92,0.6), 0 10px 30px rgba(0,0,0,0.6)`,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #2b2620, #0e0d0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.display,
            fontSize: 70,
            color: C.goldLight,
            textShadow: `0 0 16px ${C.gold}`,
          }}
        >
          {n}
        </div>
      </div>
      <div
        style={{
          fontFamily: FONT.serif,
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: '0.22em',
          color: C.cream,
          textShadow: '0 4px 18px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
        }}
      >
        {caption}
      </div>
    </div>
  );
};
