import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { Bokeh, LensFlare, Layer, LightRays, Particles, Sky, Stage, SunGlow, palette, tw, useT, warmthOf } from '../components/core';
import { Figure, POSES, lerpPose, runPose } from '../components/Figure';
import { Hills, Tree } from '../components/Props';

const Grass: React.FC<{ t: number; y: number; color: string; seed: string; h?: number; count?: number }> = ({ t, y, color, seed, h = 40, count = 90 }) => (
  <Stage>
    {new Array(count).fill(0).map((_, i) => {
      const x = (i / count) * 1300 - 110 + random(`${seed}${i}`) * 12;
      const hh = h * (0.6 + random(`${seed}h${i}`) * 0.8);
      const sway = Math.sin(t * 1.3 + i * 0.4) * 6;
      return <path key={i} d={`M ${x - 4} ${y} Q ${x + sway * 0.5} ${y - hh * 0.6} ${x + sway} ${y - hh} Q ${x + 2} ${y - hh * 0.5} ${x + 4} ${y} Z`} fill={color} />;
    })}
  </Stage>
);

// BABAK 6 — ANAK-ANAK: ayah melihat anak-anak bermain di halaman, kemudian memeluk mereka.
export const Scene06: React.FC = () => {
  const t = useT();
  const w = warmthOf(5) + 0.1;
  const p = palette(w);
  const cam = { x: tw(t, [0, 10], [-30, 30]), y: 0, zoom: tw(t, [0, 6, 10], [1.0, 1.05, 1.16]) };
  const slow = 0.85; // gerak perlahan
  const dadX = 800;
  const rush = tw(t, [5.4, 7.2], [0, 1]);
  const hugK = tw(t, [7.0, 7.8], [0, 1]);
  // anak lelaki berlari ke kanan & kembali, anak perempuan melompat riang
  const boyFree = 260 + Math.sin(t * 0.55) * 170;
  const girlFree = 420 + Math.sin(t * 0.5 + 2) * 140;
  const boyX = boyFree + (dadX - 120 - boyFree) * rush;
  const girlX = girlFree + (dadX - 70 - girlFree) * rush;
  const boyDir: 1 | -1 = rush > 0.05 ? 1 : Math.cos(t * 0.55) >= 0 ? 1 : -1;
  const girlDir: 1 | -1 = rush > 0.05 ? 1 : Math.cos(t * 0.5 + 2) >= 0 ? 1 : -1;
  const kidPose = (ph: number) => lerpPose(runPose(ph), POSES.hug, hugK);
  const dadPose = lerpPose(lerpPose(POSES.watch, POSES.kneelOpen, tw(t, [5.2, 6.6], [0, 1])), { ...POSES.kneelOpen, lUpper: 110, lFore: 150, rUpper: 120, rFore: 160, head: 14 }, hugK);
  const hop = (ph: number) => Math.abs(Math.sin(ph * Math.PI * 2)) * 22 * (1 - hugK);

  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0}>
        <Sky w={w} id="s6" horizonY={1330} />
        <SunGlow x={470} y={1250} r={900} w={w} id="s6" intensity={1} />
      </Layer>
      <LightRays x={470} y={1250} angle={180} spread={150} count={12} opacity={0.25} seed="s6r" color="#fff0c8" />
      <Layer cam={cam} depth={0.2}>
        <Stage>
          <Hills y={1340} color={p.silhouetteFar} amp={50} seed="s6h" opacity={0.6} />
          <Tree x={70} y={1380} s={1.5} color={p.silhouetteFar} seed="s6t1" sway={Math.sin(t * 0.6) * 1.5} />
          {/* rumah di kanan */}
          <path d="M 880 1380 V 1080 L 1030 960 L 1180 1080 V 1380 Z" fill={p.silhouetteFar} />
          <rect x={930} y={1180} width={70} height={90} fill="#ffe6b0" opacity={0.6} />
        </Stage>
      </Layer>
      <Layer cam={cam} depth={0.5}>
        <Stage>
          <rect x={-300} y={1370} width={1700} height={900} fill={p.silhouette} opacity={0.85} />
          <Figure x={dadX} y={1520} scale={2.9} pose={dadPose} color={p.silhouette} facing={-1} rim="rgba(255,230,170,0.95)" />
          <Figure x={boyX} y={1520} scale={2.6} kind="boy" pose={kidPose(t * slow)} color={p.silhouette} facing={boyDir} bounce={hop(t * slow)} rim="rgba(255,230,170,0.95)" />
          <Figure x={girlX} y={1520} scale={2.6} kind="girl" pose={kidPose(t * slow + 0.4)} color={p.silhouette} facing={girlDir} bounce={hop(t * slow + 0.3) * 1.3} rim="rgba(255,230,170,0.95)" />
        </Stage>
      </Layer>
      <Layer cam={cam} depth={0.7}>
        <Grass t={t} y={1540} color={p.silhouette} seed="s6g" h={50} />
      </Layer>
      <LensFlare x={470} y={1250} opacity={0.5} />
      <Particles count={50} seed="s6p" rise={10} color="#fff3d0" />
      <Layer cam={cam} depth={1.1} blur={6}>
        <Grass t={t + 1} y={1960} color={p.silhouette} seed="s6g2" h={160} count={40} />
      </Layer>
      <Bokeh count={12} seed="s6b" opacity={0.35} color="#ffe2a8" />
    </AbsoluteFill>
  );
};
