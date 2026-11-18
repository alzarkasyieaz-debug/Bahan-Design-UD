import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import { photos, SLUG } from '../active';

export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

export const GOLD = '#E8C27A';
export const GOLD_DEEP = '#B8862F';
export const IVORY = '#FFF8E8';
export const PURPLE = '#2A1240';

const dims = photos as unknown as Record<string, [number, number]>;
const ease = Easing.bezier(0.45, 0, 0.55, 1);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Opasiti fade masuk/keluar untuk satu shot (frame global). */
export const useFade = (from: number, dur: number, fadeIn: number, fadeOut: number) => {
  const f = useCurrentFrame();
  const a = fadeIn > 0 ? interpolate(f, [from, from + fadeIn], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }) : 1;
  const b = fadeOut > 0 ? interpolate(f, [from + dur - fadeOut, from + dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }) : 1;
  return Math.min(a, b);
};

const progress = (f: number, from: number, dur: number) => ease(clamp((f - from) / dur, 0, 1));

/** Gambar "cover" dalam kotak (w×h) dengan Ken Burns berpusatkan titik fokus — tidak pernah meninggalkan ruang kosong. */
export const CoverImg: React.FC<{
  id: string; boxW: number; boxH: number; p: number;
  focal?: [number, number]; zoom?: [number, number]; pan?: [number, number, number, number]; filter?: string;
}> = ({ id, boxW, boxH, p, focal = [0.5, 0.45], zoom = [1, 1.08], pan = [0, 0, 0, 0], filter }) => {
  const [w, h] = dims[id];
  const z = zoom[0] + (zoom[1] - zoom[0]) * p;
  const s0 = Math.max(boxW / w, boxH / h);
  const dw = w * s0 * z;
  const dh = h * s0 * z;
  const px = pan[0] + (pan[2] - pan[0]) * p;
  const py = pan[1] + (pan[3] - pan[1]) * p;
  const left = clamp(boxW / 2 - focal[0] * dw + px, boxW - dw, 0);
  const top = clamp(boxH / 2 - focal[1] * dh + py, boxH - dh, 0);
  return (
    <Img
      src={staticFile(`img/${SLUG}/${id}.jpg`)}
      style={{ position: 'absolute', left: 0, top: 0, width: dw, height: dh, transform: `translate3d(${left}px, ${top}px, 0)`, filter }}
    />
  );
};

const PHOTO_GRADE = 'sepia(0.1) saturate(1.06) contrast(1.04) brightness(1.02)';

type ShotBase = { id: string; from: number; dur: number; fadeIn?: number; fadeOut?: number };

/** Shot penuh skrin (gambar landskap) dengan Ken Burns / dolly. */
export const FullShot: React.FC<ShotBase & { focal?: [number, number]; zoom?: [number, number]; pan?: [number, number, number, number] }> = ({
  id, from, dur, fadeIn = 18, fadeOut = 0, focal, zoom, pan,
}) => {
  const f = useCurrentFrame();
  const op = useFade(from, dur, fadeIn, fadeOut);
  if (f < from || f > from + dur) return null;
  return (
    <AbsoluteFill style={{ opacity: op, overflow: 'hidden' }}>
      <CoverImg id={id} boxW={W} boxH={H} p={progress(f, from, dur)} focal={focal} zoom={zoom} pan={pan} filter={PHOTO_GRADE} />
    </AbsoluteFill>
  );
};

/** Latar kabur (versi _bg) bergerak perlahan — lapisan belakang untuk parallax 2.5D. */
export const BlurBg: React.FC<{ id: string; p: number; dim?: number }> = ({ id, p, dim = 0.15 }) => {
  const [w, h] = dims[id];
  const s0 = Math.max(W / w, H / h) * 1.15;
  const z = 1 + 0.08 * p;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img
        src={staticFile(`img/${SLUG}/${id}_bg.jpg`)}
        style={{
          position: 'absolute', left: '50%', top: '50%', width: w * s0, height: h * s0,
          transform: `translate(-50%, -50%) scale(${z}) translateX(${-30 * p}px)`,
        }}
      />
      <AbsoluteFill style={{ background: `rgba(20,8,30,${dim})` }} />
    </AbsoluteFill>
  );
};

export const PhotoCard: React.FC<{
  id: string; height: number; p: number; gold?: boolean; maxWidth?: number; innerZoom?: [number, number]; focal?: [number, number];
}> = ({ id, height, p, gold = false, maxWidth = 1500, innerZoom = [1.0, 1.05], focal = [0.5, 0.4] }) => {
  const [w, h] = dims[id];
  let ch = height;
  let cw = (w / h) * ch;
  if (cw > maxWidth) {
    cw = maxWidth;
    ch = (h / w) * cw;
  }
  const pad = gold ? 14 : 10;
  return (
    <div
      style={{
        position: 'relative', width: cw + pad * 2, height: ch + pad * 2, padding: pad, boxSizing: 'border-box',
        background: gold ? 'linear-gradient(135deg, #F7E3A8 0%, #C99A3E 35%, #FBE9B5 55%, #A97A26 100%)' : '#F6EEDC',
        boxShadow: '0 30px 70px rgba(0,0,0,0.55), 0 8px 18px rgba(0,0,0,0.35)',
        borderRadius: 4,
      }}
    >
      <div style={{ position: 'relative', width: cw, height: ch, overflow: 'hidden', borderRadius: 2, boxShadow: gold ? 'inset 0 0 0 2px rgba(90,60,10,0.6)' : undefined }}>
        <CoverImg id={id} boxW={cw} boxH={ch} p={p} zoom={innerZoom} focal={focal} filter={PHOTO_GRADE} />
        {gold && (
          <div style={{ position: 'absolute', inset: 10, border: '1.5px solid rgba(255,230,170,0.55)', pointerEvents: 'none' }} />
        )}
      </div>
    </div>
  );
};

/** Gambar potret dalam bingkai terapung di atas latar kabur — tiada wajah dipotong. */
export const FramedShot: React.FC<ShotBase & {
  x?: number; height?: number; gold?: boolean; rot?: [number, number]; zoom?: [number, number]; focal?: [number, number]; bgId?: string;
}> = ({ id, from, dur, fadeIn = 18, fadeOut = 0, x = W / 2, height = 900, gold = false, rot = [-6, 4], zoom, focal, bgId }) => {
  const f = useCurrentFrame();
  const op = useFade(from, dur, fadeIn, fadeOut);
  if (f < from || f > from + dur) return null;
  const p = progress(f, from, dur);
  const lin = clamp((f - from) / dur, 0, 1);
  const enter = interpolate(f, [from, from + 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const ry = rot[0] + (rot[1] - rot[0]) * p;
  const floatY = Math.sin(lin * Math.PI * 2 * 0.6) * 6;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <BlurBg id={bgId ?? id} p={p} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div
          style={{
            position: 'absolute', left: x, top: H / 2,
            transform: `translate(-50%, -50%) translateY(${(1 - enter) * 40 + floatY}px) rotateY(${ry}deg) scale(${0.94 + 0.06 * enter + 0.03 * p})`,
          }}
        >
          <PhotoCard id={id} height={height} p={p} gold={gold} innerZoom={zoom} focal={focal} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Pan menegak (tilt) untuk gambar seni bina potret — gambar memenuhi lebar skrin. */
export const TiltShot: React.FC<ShotBase & { fromY?: number; toY?: number; zoom?: [number, number] }> = ({
  id, from, dur, fadeIn = 18, fadeOut = 0, fromY = 1, toY = 0.15, zoom = [1.0, 1.06],
}) => {
  const f = useCurrentFrame();
  const op = useFade(from, dur, fadeIn, fadeOut);
  if (f < from || f > from + dur) return null;
  const p = progress(f, from, dur);
  return (
    <AbsoluteFill style={{ opacity: op, overflow: 'hidden' }}>
      <CoverImg id={id} boxW={W} boxH={H} p={p} focal={[0.5, 0.5]} zoom={zoom}
        pan={[0, (fromY - 0.5) * -2000, 0, (toY - 0.5) * -2000]} filter={PHOTO_GRADE} />
    </AbsoluteFill>
  );
};

export type Card = { id: string; x: number; y: number; h: number; rot?: number; delay?: number; depth?: number; gold?: boolean; focal?: [number, number] };

/** Kolaj / dinding kenangan: bingkai terapung dengan kedalaman parallax. */
export const CardWall: React.FC<{ from: number; dur: number; bg: string; cards: Card[]; fadeIn?: number; fadeOut?: number; camera?: number }> = ({
  from, dur, bg, cards, fadeIn = 18, fadeOut = 0, camera = 60,
}) => {
  const f = useCurrentFrame();
  const op = useFade(from, dur, fadeIn, fadeOut);
  if (f < from || f > from + dur) return null;
  const p = progress(f, from, dur);
  const cam = (p - 0.5) * camera;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <BlurBg id={bg} p={p} dim={0.3} />
      <AbsoluteFill style={{ perspective: 2000 }}>
        {cards.map((c, i) => {
          const d0 = from + (c.delay ?? i * 8);
          const e = interpolate(f, [d0, d0 + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
          const depth = c.depth ?? 1;
          const fl = Math.sin((f - from) / 40 + i * 1.7) * 5;
          return (
            <div
              key={c.id + i}
              style={{
                position: 'absolute', left: c.x, top: c.y, opacity: e,
                transform: `translate(-50%, -50%) translateX(${-cam * depth}px) translateY(${(1 - e) * 50 + fl}px) rotate(${c.rot ?? 0}deg) scale(${(0.9 + 0.1 * e) * (1 + 0.04 * p * depth)})`,
                zIndex: Math.round(depth * 10),
              }}
            >
              <PhotoCard id={c.id} height={c.h} p={p} gold={c.gold} focal={c.focal} innerZoom={[1.02, 1.08]} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export type Tile = { id: string; x: number; y: number; w: number; h: number; delay?: number; focal?: [number, number]; zoom?: [number, number] };

/** Split-screen / mozek: setiap petak dipotong secara "cover" mengikut titik fokus wajah. */
export const Tiles: React.FC<{ from: number; dur: number; tiles: Tile[]; fadeIn?: number; fadeOut?: number }> = ({
  from, dur, tiles, fadeIn = 14, fadeOut = 0,
}) => {
  const f = useCurrentFrame();
  const op = useFade(from, dur, fadeIn, fadeOut);
  if (f < from || f > from + dur) return null;
  const p = progress(f, from, dur);
  return (
    <AbsoluteFill style={{ opacity: op, background: 'radial-gradient(ellipse at 50% 40%, #3b1d52 0%, #160a22 75%)' }}>
      {tiles.map((t, i) => {
        const d0 = from + (t.delay ?? i * 7);
        const e = interpolate(f, [d0, d0 + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
        return (
          <div
            key={t.id + i}
            style={{
              position: 'absolute', left: t.x, top: t.y, width: t.w, height: t.h, overflow: 'hidden', opacity: e,
              clipPath: `inset(${(1 - e) * 50}% 0 ${(1 - e) * 50}% 0)`,
              boxShadow: '0 0 0 2px rgba(232,194,122,0.55), 0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <CoverImg id={t.id} boxW={t.w} boxH={t.h} p={p} focal={t.focal} zoom={t.zoom ?? [1.0, 1.08]} filter={PHOTO_GRADE} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ kesan */

/** Partikel debu emas yang terapung perlahan. */
export const GoldDust: React.FC<{ count?: number; intensity?: number }> = ({ count = 55, intensity = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      {new Array(count).fill(0).map((_, i) => {
        const x0 = random(`x${i}`) * W;
        const y0 = random(`y${i}`) * H;
        const sp = 8 + random(`s${i}`) * 26;
        const size = 2 + random(`z${i}`) * 5;
        const y = ((y0 - f * sp / FPS) % (H + 40) + H + 40) % (H + 40) - 20;
        const x = x0 + Math.sin(f / 50 + i) * 22;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / (18 + random(`t${i}`) * 30) + i));
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%',
            background: 'radial-gradient(circle, #FFF2C8 0%, #E8C27A 45%, rgba(232,194,122,0) 75%)',
            opacity: tw * 0.8 * intensity, filter: size > 5 ? 'blur(1.5px)' : undefined,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

/** Sinaran cahaya keemasan dari atas. */
export const LightRays: React.FC<{ opacity?: number }> = ({ opacity = 0.5 }) => {
  const f = useCurrentFrame();
  const breathe = 0.75 + 0.25 * Math.sin(f / 45);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: opacity * breathe }}>
      {[-28, -18, -9, 2, 12, 22].map((a, i) => (
        <div key={i} style={{
          position: 'absolute', left: 760 + i * 70, top: -300, width: 90 + (i % 3) * 50, height: 1700,
          transformOrigin: '50% 0%', transform: `rotate(${a + Math.sin(f / 90 + i) * 1.5}deg)`,
          background: 'linear-gradient(180deg, rgba(255,226,160,0.55) 0%, rgba(255,210,130,0.12) 45%, rgba(255,210,130,0) 75%)',
          filter: 'blur(18px)',
        }} />
      ))}
    </AbsoluteFill>
  );
};

/** Light leak keemasan (peralihan sinematik). center = frame puncak. */
export const LightLeak: React.FC<{ center: number; len?: number; strength?: number; dir?: 1 | -1 }> = ({ center, len = 40, strength = 0.55, dir = 1 }) => {
  const f = useCurrentFrame();
  if (f < center - len / 2 || f > center + len / 2) return null;
  const t = (f - (center - len / 2)) / len;
  const op = Math.sin(t * Math.PI) * strength;
  const x = dir === 1 ? -20 + 140 * t : 120 - 140 * t;
  return (
    <AbsoluteFill style={{
      pointerEvents: 'none', mixBlendMode: 'screen', opacity: op,
      background: `radial-gradient(ellipse 55% 85% at ${x}% 45%, rgba(255,196,110,0.95) 0%, rgba(255,140,60,0.45) 35%, rgba(120,40,120,0.15) 65%, rgba(0,0,0,0) 80%)`,
    }} />
  );
};

/** Sapuan cahaya pepenjuru (elegant light sweep). */
export const LightSweep: React.FC<{ at: number; len?: number; strength?: number }> = ({ at, len = 36, strength = 0.35 }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + len) return null;
  const t = (f - at) / len;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: Math.sin(t * Math.PI) * strength }}>
      <div style={{
        position: 'absolute', top: -400, left: -600 + t * 3200, width: 420, height: 2000, transform: 'rotate(20deg)',
        background: 'linear-gradient(90deg, rgba(255,235,190,0) 0%, rgba(255,235,190,0.9) 50%, rgba(255,235,190,0) 100%)',
        filter: 'blur(30px)',
      }} />
    </AbsoluteFill>
  );
};

/** Gred warna menyeluruh: kehangatan emas + vignette ungu tua + film grain. */
export const Grade: React.FC<{ warmth?: number }> = ({ warmth = 0.3 }) => {
  const f = useCurrentFrame();
  const g = Math.floor(f / 2) % 4;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ mixBlendMode: 'soft-light', opacity: warmth, background: 'linear-gradient(160deg, #FFC66B 0%, #F2B35E 40%, #7B4A8F 100%)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(26,8,38,0.55) 100%)' }} />
      <AbsoluteFill style={{
        opacity: 0.07, mixBlendMode: 'overlay',
        backgroundImage: `url(${staticFile(`fx/grain${g}.png`)})`, backgroundSize: '512px 512px',
        backgroundPosition: `${(g * 137) % 512}px ${(g * 271) % 512}px`,
      }} />
    </AbsoluteFill>
  );
};

/** Bingkai emas elegan di tepi skrin (babak 4 & 12). */
export const GoldenFrame: React.FC<{ from: number; dur: number; inset?: number }> = ({ from, dur, inset = 34 }) => {
  const f = useCurrentFrame();
  const op = useFade(from, dur, 24, 24);
  if (f < from || f > from + dur) return null;
  const draw = interpolate(f, [from, from + 40], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const corner = (rot: number, style: React.CSSProperties) => (
    <div style={{ position: 'absolute', width: 70, height: 70, ...style, transform: `rotate(${rot}deg)` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 70, height: 3, background: GOLD }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: 3, height: 70, background: GOLD }} />
      <div style={{ position: 'absolute', left: 12, top: 12, width: 12, height: 12, background: GOLD, transform: 'rotate(45deg)' }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: op }}>
      <div style={{
        position: 'absolute', inset, border: '2px solid rgba(232,194,122,0.85)',
        clipPath: `inset(0 ${(1 - draw) * 50}% 0 ${(1 - draw) * 50}%)`,
        boxShadow: '0 0 18px rgba(232,194,122,0.35), inset 0 0 18px rgba(232,194,122,0.2)',
      }} />
      <div style={{ position: 'absolute', inset: inset + 10, border: '1px solid rgba(232,194,122,0.4)' }} />
      {corner(0, { left: inset - 8, top: inset - 8 })}
      {corner(90, { right: inset - 8, top: inset - 8 })}
      {corner(180, { right: inset - 8, bottom: inset - 8 })}
      {corner(270, { left: inset - 8, bottom: inset - 8 })}
    </AbsoluteFill>
  );
};

export const Black: React.FC<{ points: [number, number][] }> = ({ points }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, points.map((p) => p[0]), points.map((p) => p[1]), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (op <= 0) return null;
  return <AbsoluteFill style={{ background: '#000', opacity: op }} />;
};
