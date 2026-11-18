import React from 'react';
import { Easing, Img, interpolate, random, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { C } from '../theme';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** Laluan gerbang mihrab (pointed arch) dalam kotak w×h, dianjak oleh (ox, oy) */
export const archPath = (w: number, h: number, ox = 0, oy = 0) => {
  const sh = w * 0.62; // ketinggian bahu gerbang
  const p = (x: number, y: number) => `${(x + ox).toFixed(1)} ${(y + oy).toFixed(1)}`;
  return [
    `M${p(0, h)}`,
    `L${p(0, sh)}`,
    `C${p(0, sh - w * 0.32)} ${p(w * 0.38, w * 0.16)} ${p(w / 2, 0)}`,
    `C${p(w * 0.62, w * 0.16)} ${p(w, sh - w * 0.32)} ${p(w, sh)}`,
    `L${p(w, h)}`,
    'Z',
  ].join(' ');
};

/** Gambar dengan gerakan Ken Burns yang deterministik */
export const KenBurns: React.FC<{ src: string; dur: number; seed: string; focusY?: number }> = ({ src, dur, seed, focusY = 0.4 }) => {
  const f = useCurrentFrame();
  const zoomIn = random(seed + 'z') > 0.4;
  const t = interpolate(f, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s = zoomIn ? 1.04 + t * 0.12 : 1.16 - t * 0.12;
  const dx = (random(seed + 'x') - 0.5) * 50 * (t - 0.5);
  const dy = (random(seed + 'y') - 0.5) * 40 * (t - 0.5);
  return (
    <Img
      src={staticFile(`img/${src}.jpg`)}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: `50% ${focusY * 100}%`,
        transform: `translate(${dx}px, ${dy}px) scale(${s})`,
        filter: 'saturate(1.06) contrast(1.04) sepia(0.08)',
      }}
    />
  );
};

/** Bingkai gerbang emas berganda. `photos` boleh lebih dari satu → silih berganti dengan pudaran */
export const ArchPhoto: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  photos: string[];
  dur: number;
  delay?: number;
  focusY?: number;
}> = ({ x, y, w, h, photos, dur, delay = 0, focusY }) => {
  const f = useCurrentFrame() - delay;
  const inT = interpolate(f, [0, 32], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const draw = interpolate(f, [6, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const pad = 26;
  const per = dur / photos.length;
  const fade = 18;
  const outer = archPath(w + pad * 2, h + pad * 2, 0, 0);
  const mid = archPath(w + 12, h + 12, pad - 6, pad - 6);
  const len = (w + h) * 3.2;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - pad,
        top: y - pad,
        width: w + pad * 2,
        height: h + pad * 2,
        opacity: inT,
        transform: `translateY(${(1 - inT) * 70}px) scale(${0.96 + inT * 0.04})`,
        filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.55))',
      }}
    >
      <div style={{ position: 'absolute', left: pad, top: pad, width: w, height: h, clipPath: `path('${archPath(w, h)}')`, background: C.night }}>
        {photos.map((p, i) => {
          const local = f - i * per;
          const op =
            i === 0
              ? interpolate(local, [per - fade / 2, per + fade / 2], [1, photos.length > 1 ? 0 : 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
              : interpolate(local, [-fade / 2, fade / 2, per - fade / 2, per + fade / 2], [0, 1, 1, i === photos.length - 1 ? 1 : 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });
          if (op <= 0) return null;
          return (
            <div key={p} style={{ position: 'absolute', inset: 0, opacity: op }}>
              <KenBurnsAt src={p} seed={p} dur={per + fade} offset={i * per - fade / 2 + delay} focusY={focusY} />
            </div>
          );
        })}
        {/* kilau emas lembut di atas foto */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(242,220,168,0.16), transparent 30%, transparent 70%, rgba(6,22,26,0.35))' }} />
      </div>
      <svg width={w + pad * 2} height={h + pad * 2} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id={`g${x}${y}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.goldLight} />
            <stop offset="50%" stopColor={C.gold} />
            <stop offset="100%" stopColor={C.goldDeep} />
          </linearGradient>
        </defs>
        <path d={outer} fill="none" stroke={`url(#g${x}${y})`} strokeWidth={3} strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
        <path d={mid} fill="none" stroke={`url(#g${x}${y})`} strokeWidth={1.4} opacity={0.8} strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
        {/* finial di puncak gerbang */}
        <g transform={`translate(${(w + pad * 2) / 2} ${-6})`} opacity={draw}>
          <path d="M0 -26 L9 -9 L0 0 L-9 -9 Z" fill={C.gold} />
          <circle cy={-34} r={4} fill={C.goldLight} />
        </g>
      </svg>
    </div>
  );
};

const KenBurnsAt: React.FC<{ src: string; seed: string; dur: number; offset: number; focusY?: number }> = ({ src, seed, dur, offset, focusY }) => {
  // KenBurns membaca frame semasa; anjakkan supaya setiap foto bergerak dari awal tayangannya
  return (
    <ShiftFrame by={offset}>
      <KenBurns src={src} seed={seed} dur={dur} focusY={focusY} />
    </ShiftFrame>
  );
};

const ShiftFrame: React.FC<{ by: number; children: React.ReactNode }> = ({ by, children }) => (
  <Sequence from={Math.round(by)} layout="none">
    {children}
  </Sequence>
);

/** Kad foto bersudut lembut dengan mat krim dan garis emas — untuk kolaj */
export const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  src: string;
  delay: number;
  dur: number;
  rot?: number;
  focusY?: number;
}> = ({ x, y, w, h, src, delay, dur, rot = 0, focusY }) => {
  const f = useCurrentFrame() - delay;
  const t = interpolate(f, [0, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const m = 12;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        padding: m,
        background: C.cream,
        borderRadius: 18,
        boxShadow: '0 26px 50px rgba(0,0,0,0.5)',
        opacity: t,
        transform: `translateY(${(1 - t) * 90}px) rotate(${rot * t + (1 - t) * rot * 3}deg) scale(${0.9 + 0.1 * t})`,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden', outline: `1.5px solid ${C.gold}`, outlineOffset: 4 }}>
        <Sequence from={delay} layout="none">
          <KenBurns src={src} seed={src} dur={dur} focusY={focusY} />
        </Sequence>
      </div>
    </div>
  );
};
