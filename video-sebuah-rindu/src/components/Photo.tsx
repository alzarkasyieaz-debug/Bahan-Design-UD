import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import sizes from '../photos.json';
import { Move } from '../data';
import { C, H, W } from '../theme';

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const S = sizes as Record<string, number[]>;
export const aspect = (src: string) => S[src][0] / S[src][1];
const img = (src: string) => staticFile(`img/${src}.jpg`);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Gerakan kamera lembut (skala ≤ 1.10 supaya wajah tidak herot/terpotong) */
const camera = (move: Move, t: number, slow: boolean) => {
  const k = slow ? 0.6 : 1;
  const e = ease(t);
  switch (move) {
    case 'in':
      return { s: 1.0 + 0.09 * k * e, x: 0, y: 0 };
    case 'out':
      return { s: 1.1 - 0.08 * k * e, x: 0, y: 0 };
    case 'left':
      return { s: 1.08, x: 55 * k - 110 * k * e, y: 0 };
    case 'right':
      return { s: 1.08, x: -55 * k + 110 * k * e, y: 0 };
    case 'up':
      return { s: 1.07, x: 0, y: 30 * k - 60 * k * e };
  }
};

/**
 * Foto skrin penuh.
 * - Landskap: cover + Ken Burns.
 * - Potret: latar kabur (dijana awal) bergerak berlawanan arah + foto penuh (tanpa potong kepala) → parallax 2.5D.
 */
export const FullPhoto: React.FC<{ src: string; dur: number; move?: Move; focusY?: number; slow?: boolean; forceCover?: boolean }> = ({
  src,
  dur,
  move,
  focusY = 0.45,
  slow = false,
  forceCover,
}) => {
  const f = useCurrentFrame();
  const mv: Move = move ?? (['in', 'out', 'left', 'right'] as Move[])[Math.floor(random(src) * 4)];
  const t = interpolate(f, [0, dur], [0, 1], clamp);
  const cam = camera(mv, t, slow);
  const portrait = aspect(src) < 1.2 && !forceCover;
  if (!portrait) {
    return (
      <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
        <Img
          src={img(src)}
          style={{
            position: 'absolute',
            inset: 0,
            width: W,
            height: H,
            objectFit: 'cover',
            objectPosition: `50% ${focusY * 100}%`,
            transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`,
          }}
        />
      </AbsoluteFill>
    );
  }
  const fh = H * 0.9;
  const fw = fh * aspect(src);
  const fgS = 1 + (cam.s - 1) * 0.6;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: C.purpleDeep }}>
      <Img
        src={staticFile(`img/blur/${src}.jpg`)}
        style={{
          position: 'absolute',
          inset: -60,
          width: W + 120,
          height: H + 120,
          objectFit: 'cover',
          transform: `translate(${-cam.x * 0.5}px, ${-cam.y * 0.5}px) scale(${1.15 - (cam.s - 1) * 0.5})`,
        }}
      />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, transparent 30%, rgba(20,10,36,0.55))' }} />
      <div
        style={{
          position: 'absolute',
          left: (W - fw) / 2,
          top: (H - fh) / 2 - 20,
          width: fw,
          height: fh,
          transform: `translate(${cam.x * 0.8}px, ${cam.y * 0.8}px) scale(${fgS})`,
          boxShadow: '0 30px 70px rgba(0,0,0,0.65)',
          outline: `2px solid ${C.gold}`,
          outlineOffset: 8,
        }}
      >
        <Img src={img(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </AbsoluteFill>
  );
};

/** Skrin pisah 2–3 panel yang masuk berperingkat dengan garis emas pemisah */
export const Split: React.FC<{ srcs: string[]; dur: number; slow?: boolean }> = ({ srcs, dur, slow }) => {
  const f = useCurrentFrame();
  const n = srcs.length;
  const pw = W / n;
  return (
    <AbsoluteFill style={{ background: C.purpleDeep, overflow: 'hidden' }}>
      {srcs.map((src, i) => {
        const tIn = interpolate(f, [i * 10, i * 10 + 34], [0, 1], { ...clamp, easing: ease });
        const dir = i % 2 === 0 ? 1 : -1;
        const t = interpolate(f, [0, dur], [0, 1], clamp);
        const s = 1.04 + (slow ? 0.03 : 0.06) * (i % 2 === 0 ? t : 1 - t);
        return (
          <div
            key={src}
            style={{
              position: 'absolute',
              left: i * pw,
              top: 0,
              width: pw,
              height: H,
              overflow: 'hidden',
              opacity: tIn,
              transform: `translateY(${(1 - tIn) * 80 * dir}px)`,
            }}
          >
            <Img
              src={img(src)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '50% 30%',
                transform: `scale(${s}) translateY(${dir * (t - 0.5) * 16}px)`,
              }}
            />
          </div>
        );
      })}
      {srcs.slice(1).map((_, i) => {
        const g = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: ease });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: (i + 1) * pw - 2,
              top: H / 2 - (H / 2) * g,
              width: 4,
              height: H * g,
              background: `linear-gradient(180deg, transparent, ${C.gold} 20%, ${C.goldLight} 50%, ${C.gold} 80%, transparent)`,
              boxShadow: '0 0 18px rgba(244,225,176,0.6)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Bingkai foto terapung (kolaj, dinding kenangan). Tinggi ikut nisbah foto — tiada potongan. */
export const Frame: React.FC<{ src: string; w: number; style?: React.CSSProperties; zoom?: number }> = ({ src, w, style, zoom = 1 }) => {
  const h = w / aspect(src);
  return (
    <div
      style={{
        position: 'absolute',
        width: w,
        height: h,
        boxShadow: '0 28px 60px rgba(0,0,0,0.6)',
        border: `3px solid ${C.gold}`,
        outline: `1px solid ${C.goldLight}`,
        outlineOffset: 6,
        background: '#000',
        overflow: 'hidden',
        ...style,
      }}
    >
      <Img src={img(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})` }} />
    </div>
  );
};

/**
 * "Ramai & Individu" dalam satu bingkai: foto kumpulan (kiri) + potret momen individu (kanan),
 * masuk berperingkat dan hanyut berlawanan arah (parallax 2.5D).
 */
export const Pair: React.FC<{ group: string; solo: string; dur: number }> = ({ group, solo, dur }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], clamp);
  const gIn = interpolate(f, [0, 34], [0, 1], { ...clamp, easing: ease });
  const sIn = interpolate(f, [16, 52], [0, 1], { ...clamp, easing: ease });
  const gw = 980;
  const gh = gw / aspect(group);
  const sh = Math.min(660, 520 / aspect(solo));
  const sw = sh * aspect(solo);
  return (
    <AbsoluteFill style={{ background: C.purpleDeep, overflow: 'hidden' }}>
      <Img
        src={staticFile(`img/blur/${group}.jpg`)}
        style={{ position: 'absolute', inset: -60, width: W + 120, height: H + 120, objectFit: 'cover', opacity: 0.8, transform: `translateX(${(t - 0.5) * -30}px) scale(1.12)` }}
      />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 45%, rgba(43,21,72,0.25), rgba(20,10,36,0.75))' }} />
      <div
        style={{
          position: 'absolute',
          left: 120 + (t - 0.5) * 30,
          top: 70,
          width: gw,
          height: gh,
          opacity: gIn,
          transform: `translateX(${(1 - gIn) * -80}px) rotate(-1.5deg)`,
          boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
          border: `3px solid ${C.gold}`,
          overflow: 'hidden',
        }}
      >
        <Img src={img(group)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.02 + 0.05 * t})` }} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 1210 - (t - 0.5) * 40,
          top: 95 + (660 - sh) / 2,
          width: sw,
          height: sh,
          opacity: sIn,
          transform: `translateY(${(1 - sIn) * 90}px) rotate(2.5deg)`,
          boxShadow: '0 34px 80px rgba(0,0,0,0.7), 0 0 60px rgba(244,225,176,0.25)',
          border: `3px solid ${C.goldLight}`,
          outline: `1px solid ${C.gold}`,
          outlineOffset: 7,
          overflow: 'hidden',
        }}
      >
        <Img src={img(solo)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.08 - 0.06 * t})` }} />
      </div>
    </AbsoluteFill>
  );
};
