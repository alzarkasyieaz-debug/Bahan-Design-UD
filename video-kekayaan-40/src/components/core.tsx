import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, random, useCurrentFrame } from 'remotion';
import { FPS } from '../data/script';

/* ------------------------------------------------------------------ MASA BABAK */
// Setiap babak dipasang 15 frame lebih awal untuk cross-dissolve.
export const SceneCtx = createContext<{ offset: number; index: number }>({ offset: 0, index: 0 });
/** Masa (saat) relatif kepada permulaan babak (boleh negatif semasa peralihan). */
export const useT = () => {
  const frame = useCurrentFrame();
  const { offset } = useContext(SceneCtx);
  return (frame - offset) / FPS;
};
export const useSceneIndex = () => useContext(SceneCtx).index;

export const ease = Easing.bezier(0.45, 0, 0.2, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
/** interpolate dengan clamp + easing sinematik */
export const tw = (t: number, inR: number[], outR: number[], e = ease) =>
  interpolate(t, inR, outR, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e });

/* ------------------------------------------------------------------ PALET */
// Warna bermula biru lembut, beransur kepada cahaya keemasan hangat.
export const warmthOf = (sceneIndex: number) => Math.pow(sceneIndex / 11, 0.85);
export const mix = (a: string, b: string, w: number) => interpolateColors(w, [0, 1], [a, b]);

export const palette = (w: number) => ({
  skyTop: mix('#9fc0e6', '#f0a860', w),
  skyMid: mix('#cfe2f6', '#ffd49a', w),
  horizon: mix('#f1f7fd', '#fff0cf', w),
  sun: mix('#ffffff', '#fff1c4', w),
  glow: mix('rgba(210,232,255,0.9)', 'rgba(255,214,140,0.95)', w),
  silhouette: mix('#1c3354', '#33200f', w),
  silhouetteFar: mix('#5b7ea6', '#9a6a3c', w),
  interiorWall: mix('#c9dcf1', '#e9c89a', w),
  interiorDark: mix('#7f9fc4', '#b07c46', w),
  floor: mix('#9db5d2', '#c39463', w),
  accent: mix('#7fb2ff', '#ffc864', w),
  gold: '#ffd27a',
});

/* ------------------------------------------------------------------ KAMERA 2.5D */
export type Cam = { x: number; y: number; zoom: number };
/**
 * Lapisan parallax. depth 0 = latar jauh, 1 = latar depan.
 * Pergerakan kamera digandakan mengikut kedalaman untuk ilusi 2.5D.
 */
export const Layer: React.FC<{
  cam: Cam;
  depth: number;
  blur?: number;
  opacity?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ cam, depth, blur = 0, opacity = 1, children, style }) => {
  const s = 1 + (cam.zoom - 1) * (0.35 + depth * 0.9);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${cam.x * (0.2 + depth)}px, ${cam.y * (0.2 + depth)}px) scale(${s})`,
        transformOrigin: '50% 50%',
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        opacity,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** SVG kanvas penuh 1080×1920 */
export const Stage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0, overflow: 'visible', ...style }}>
    {children}
  </svg>
);

/* ------------------------------------------------------------------ KESAN CAHAYA */
export const Sky: React.FC<{ w: number; id: string; horizonY?: number }> = ({ w, id, horizonY = 1300 }) => {
  const p = palette(w);
  return (
    <Stage>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.skyTop} />
          <stop offset={(horizonY / 1920) * 0.7} stopColor={p.skyMid} />
          <stop offset={horizonY / 1920} stopColor={p.horizon} />
          <stop offset="1" stopColor={p.skyMid} />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={1880} height={2720} fill={`url(#sky-${id})`} />
    </Stage>
  );
};

export const SunGlow: React.FC<{ x: number; y: number; r: number; w: number; id: string; intensity?: number }> = ({
  x,
  y,
  r,
  w,
  id,
  intensity = 1,
}) => {
  const p = palette(w);
  return (
    <Stage>
      <defs>
        <radialGradient id={`sun-${id}`}>
          <stop offset="0" stopColor="#ffffff" stopOpacity={intensity} />
          <stop offset="0.12" stopColor={p.sun} stopOpacity={intensity} />
          <stop offset="0.35" stopColor={p.glow} stopOpacity={0.55 * intensity} />
          <stop offset="1" stopColor={p.glow} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#sun-${id})`} />
    </Stage>
  );
};

/** Sinar cahaya lembut (soft light rays) yang bergerak perlahan */
export const LightRays: React.FC<{
  x: number;
  y: number;
  angle?: number;
  spread?: number;
  count?: number;
  length?: number;
  color?: string;
  opacity?: number;
  seed?: string;
}> = ({ x, y, angle = 20, spread = 40, count = 7, length = 2200, color = '#fff6dc', opacity = 0.22, seed = 'r' }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', filter: 'blur(18px)', pointerEvents: 'none' }}>
      <Stage>
        <defs>
          <linearGradient id={`ray-${seed}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity={1} />
            <stop offset="1" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {new Array(count).fill(0).map((_, i) => {
          const a = angle - spread / 2 + (spread * i) / Math.max(1, count - 1) + Math.sin(t * 0.35 + i * 1.7) * 2.2;
          const wdt = 40 + random(`${seed}-w${i}`) * 110;
          const o = opacity * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.6 + random(`${seed}-p${i}`) * 6)));
          return (
            <polygon
              key={i}
              points={`${-wdt * 0.15},0 ${wdt * 0.15},0 ${wdt},${length} ${-wdt},${length}`}
              fill={`url(#ray-${seed})`}
              opacity={o}
              transform={`translate(${x} ${y}) rotate(${-a})`}
            />
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};

/** Bokeh — bulatan cahaya kabur pada pelbagai kedalaman */
export const Bokeh: React.FC<{
  count?: number;
  color?: string;
  seed?: string;
  minR?: number;
  maxR?: number;
  opacity?: number;
  area?: [number, number, number, number];
  blur?: number;
}> = ({ count = 14, color = '#fff3d6', seed = 'b', minR = 20, maxR = 90, opacity = 0.35, area = [0, 0, 1080, 1920], blur = 6 }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', filter: `blur(${blur}px)`, pointerEvents: 'none' }}>
      <Stage>
        {new Array(count).fill(0).map((_, i) => {
          const r = minR + random(`${seed}r${i}`) * (maxR - minR);
          const x = area[0] + random(`${seed}x${i}`) * area[2] + Math.sin(t * 0.25 + i) * 18;
          const y = area[1] + random(`${seed}y${i}`) * area[3] + Math.cos(t * 0.2 + i * 2) * 14 - t * 6;
          const o = opacity * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.8 + i * 1.3)));
          return (
            <g key={i} opacity={o}>
              <circle cx={x} cy={y} r={r} fill={color} opacity={0.35} />
              <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={r * 0.12} opacity={0.6} />
            </g>
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};

/** Partikel debu/cahaya halus yang terapung */
export const Particles: React.FC<{
  count?: number;
  color?: string;
  seed?: string;
  rise?: number;
  size?: number;
  opacity?: number;
  area?: [number, number, number, number];
  glow?: boolean;
}> = ({ count = 40, color = '#fff8e6', seed = 'p', rise = 14, size = 3.2, opacity = 0.8, area = [0, 0, 1080, 1920], glow = true }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', pointerEvents: 'none', filter: glow ? 'drop-shadow(0 0 6px rgba(255,240,200,0.9))' : undefined }}>
      <Stage>
        {new Array(count).fill(0).map((_, i) => {
          const sp = 0.5 + random(`${seed}s${i}`);
          let y = area[1] + random(`${seed}y${i}`) * area[3] - t * rise * sp;
          y = area[1] + ((((y - area[1]) % area[3]) + area[3]) % area[3]);
          const x = area[0] + random(`${seed}x${i}`) * area[2] + Math.sin(t * 0.5 * sp + i) * 22;
          const tw2 = 0.5 + 0.5 * Math.sin(t * (1.2 + sp) + i * 2.1);
          return <circle key={i} cx={x} cy={y} r={size * (0.4 + random(`${seed}r${i}`))} fill={color} opacity={opacity * tw2} />;
        })}
      </Stage>
    </AbsoluteFill>
  );
};

/** Butiran filem halus — berubah setiap 2 frame */
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 50;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
      <svg width={1080} height={1920}>
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number; color?: string }> = ({ strength = 0.55, color = '0,0,0' }) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 85% 70% at 50% 45%, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)`,
    }}
  />
);

/** Tompok cahaya lensa lembut (soft lens flare) */
export const LensFlare: React.FC<{ x: number; y: number; opacity?: number }> = ({ x, y, opacity = 0.5 }) => {
  const t = useT();
  const cx = 540;
  const cy = 960;
  const dx = cx - x;
  const dy = cy - y;
  const items = [
    { k: 0.35, r: 40, c: '#fff4d0' },
    { k: 0.7, r: 22, c: '#bfe0ff' },
    { k: 1.15, r: 70, c: '#ffe2b0' },
    { k: 1.5, r: 30, c: '#d8ffe8' },
  ];
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', filter: 'blur(4px)', opacity: opacity * (0.8 + 0.2 * Math.sin(t)) }}>
      <Stage>
        {items.map((it, i) => (
          <circle key={i} cx={x + dx * it.k} cy={y + dy * it.k} r={it.r} fill={it.c} opacity={0.22} />
        ))}
        <ellipse cx={x} cy={y} rx={420} ry={6} fill="#fff6e0" opacity={0.35} />
      </Stage>
    </AbsoluteFill>
  );
};

/** Gred warna sinematik global (biru -> emas) */
export const ColorGrade: React.FC<{ w: number }> = ({ w }) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      mixBlendMode: 'soft-light',
      background: `linear-gradient(180deg, ${mix('rgba(120,170,235,0.45)', 'rgba(255,190,110,0.5)', w)} 0%, ${mix(
        'rgba(40,80,140,0.35)',
        'rgba(150,80,30,0.35)',
        w,
      )} 100%)`,
    }}
  />
);

export const Bloom: React.FC<{ children: React.ReactNode; amount?: number }> = ({ children, amount = 0.35 }) => (
  <AbsoluteFill>
    {children}
    <AbsoluteFill style={{ filter: 'blur(28px) brightness(1.25)', opacity: amount, mixBlendMode: 'screen' }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);
