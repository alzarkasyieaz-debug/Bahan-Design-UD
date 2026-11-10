import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { Bokeh, LensFlare, Layer, LightRays, Particles, Sky, Stage, SunGlow, palette, tw, useT, warmthOf } from '../components/core';
import { Figure, POSES, lerpPose, walkPose } from '../components/Figure';
import { Hills, Tree } from '../components/Props';

/** Daun gugur dalam gerak perlahan */
const Leaves: React.FC<{ t: number; color: string; count?: number; seed: string; size?: number }> = ({ t, color, count = 14, seed, size = 1 }) => (
  <Stage>
    {new Array(count).fill(0).map((_, i) => {
      const sp = 0.4 + random(`${seed}s${i}`) * 0.5;
      const y = ((random(`${seed}y${i}`) * 2200 + t * 70 * sp) % 2200) - 150;
      const x = random(`${seed}x${i}`) * 1080 + Math.sin(t * 0.7 * sp + i) * 60;
      const r = t * 40 * sp + i * 50;
      return (
        <ellipse key={i} cx={x} cy={y} rx={14 * size} ry={6 * size} fill={color} transform={`rotate(${r} ${x} ${y})`} opacity={0.85} />
      );
    })}
  </Stage>
);

// BABAK 2 — KESIHATAN: berjalan perlahan di taman, menarik nafas segar.
export const Scene02: React.FC = () => {
  const t = useT();
  const w = warmthOf(1) + 0.15;
  const p = palette(w);
  const cam = { x: tw(t, [0, 10], [40, -40]), y: 0, zoom: tw(t, [0, 10], [1.02, 1.12]) };
  // berjalan perlahan (slow motion) kemudian berhenti menarik nafas
  const stopK = tw(t, [5.6, 6.8], [0, 1]);
  const walkX = 230 + Math.min(t, 6.2) * 52;
  const pose = lerpPose(walkPose(Math.max(0, t) * 0.55), POSES.breathe, stopK);
  const breath = 1 + Math.sin(Math.max(0, t - 6.8) * 1.6) * 0.012 * stopK;
  // denyutan jantung lembut (selari dengan audio 3.0 s – 7.2 s)
  const beat = t > 3 && t < 7.4 ? Math.pow(Math.max(0, Math.sin(((t - 3) / 1.05) * Math.PI * 2)), 8) : 0;

  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0}>
        <Sky w={w} id="s2" horizonY={1250} />
        <SunGlow x={820} y={760} r={760} w={w} id="s2" intensity={1} />
      </Layer>
      <LightRays x={820} y={760} angle={-150} spread={100} count={10} opacity={0.28} seed="s2r" length={2000} />
      <Layer cam={cam} depth={0.15}>
        <Stage>
          <Hills y={1230} color={p.silhouetteFar} amp={80} seed="s2h" opacity={0.45} />
        </Stage>
      </Layer>
      <Layer cam={cam} depth={0.35}>
        <Stage>
          {[80, 260, 430, 900, 1040].map((x, i) => (
            <Tree key={i} x={x} y={1330} s={0.9 + random(`s2t${i}`) * 0.5} color={p.silhouetteFar} seed={`s2t${i}`} sway={Math.sin(t * 0.6 + i) * 1.2} />
          ))}
          <rect x={-300} y={1320} width={1700} height={1000} fill={p.silhouetteFar} opacity={0.7} />
        </Stage>
      </Layer>
      <Layer cam={cam} depth={0.55}>
        <Stage>
          {/* laluan taman */}
          <path d="M -300 1560 C 200 1490, 700 1470, 1400 1500 L 1400 2300 L -300 2300 Z" fill={p.silhouette} opacity={0.75} />
          <path d="M -300 1540 C 200 1478, 700 1458, 1400 1488" stroke="#fff4dc" strokeWidth={4} opacity={0.4} fill="none" />
          <g style={{ filter: `drop-shadow(0 0 ${20 + beat * 40}px rgba(255,220,170,${0.35 + beat * 0.5}))` }}>
            <g transform={`translate(${walkX} 1520) scale(1 ${breath}) translate(${-walkX} -1520)`}>
              <Figure x={walkX} y={1520} scale={2.9} pose={pose} color={p.silhouette} rim="rgba(255,240,205,0.95)" bounce={Math.abs(Math.sin(t * 0.55 * Math.PI * 2)) * 4 * (1 - stopK)} />
            </g>
          </g>
        </Stage>
      </Layer>
      <LensFlare x={820} y={760} opacity={0.45} />
      <Particles count={30} seed="s2p" rise={8} />
      {/* daun gugur – lapisan dekat & kabur */}
      <Layer cam={cam} depth={0.8}>
        <Leaves t={t} color={p.silhouette} seed="s2l" count={10} />
      </Layer>
      <Layer cam={cam} depth={1.1} blur={8}>
        <Stage>
          <Tree x={-40} y={2050} s={2.4} color={p.silhouette} seed="s2n1" sway={Math.sin(t * 0.5) * 1.5} />
          <Tree x={1150} y={2150} s={2.2} color={p.silhouette} seed="s2n2" sway={Math.sin(t * 0.5 + 1) * 1.5} />
        </Stage>
        <Leaves t={t + 3} color={p.silhouette} seed="s2l2" count={5} size={2.2} />
      </Layer>
      <Bokeh count={12} seed="s2b" opacity={0.3} />
    </AbsoluteFill>
  );
};
