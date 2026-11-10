import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Bokeh, Layer, LightRays, Particles, Sky, Stage, SunGlow, palette, tw, useT } from '../components/core';
import { Figure, POSES } from '../components/Figure';
import { Hills, PhotoFrame, Plant } from '../components/Props';

// BABAK 1 — HOOK EMOSI: lelaki di tepi tingkap ketika matahari terbit, memandang gambar keluarga.
export const Scene01: React.FC = () => {
  const t = useT();
  const w = 0.08 + t * 0.012;
  const p = palette(w);
  const cam = { x: tw(t, [0, 10], [0, -30]), y: tw(t, [0, 10], [0, -20]), zoom: tw(t, [0, 10], [1, 1.14]) };
  const sunY = tw(t, [0, 10], [1260, 1120]);
  // Rack focus: gambar di latar depan (tajam) -> lelaki di tingkap (tajam)
  const focus = tw(t, [3.2, 5.2], [0, 1]);
  const sec = Math.floor(Math.max(0, t));
  const secAngle = sec * 6 + 6 * Math.min(1, (Math.max(0, t) - sec) * 12); // jarum detik "tick"

  return (
    <AbsoluteFill>
      {/* Pemandangan luar tingkap */}
      <Layer cam={cam} depth={0}>
        <Sky w={w} id="s1" horizonY={1240} />
        <SunGlow x={640} y={sunY} r={700} w={0.7} id="s1" intensity={1} />
        <Stage>
          <Hills y={1300} color={p.silhouetteFar} amp={90} seed="s1a" opacity={0.55} />
          <Hills y={1380} color={p.interiorDark} amp={60} seed="s1b" opacity={0.75} />
        </Stage>
      </Layer>

      {/* Dinding dalaman + tingkap */}
      <Layer cam={cam} depth={0.3}>
        <Stage>
          <defs>
            <linearGradient id="wall1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={p.interiorDark} />
              <stop offset="0.5" stopColor={p.interiorWall} />
              <stop offset="1" stopColor={p.interiorDark} />
            </linearGradient>
          </defs>
          <path fillRule="evenodd" d="M -300 -300 H 1400 V 2300 H -300 Z M 300 470 H 1000 V 1450 H 300 Z" fill="url(#wall1)" />
          {/* bingkai tingkap */}
          <g stroke="#f6f1e8" strokeWidth={18} fill="none">
            <rect x={300} y={470} width={700} height={980} />
            <line x1={650} y1={470} x2={650} y2={1450} />
            <line x1={300} y1={860} x2={1000} y2={860} />
          </g>
          <rect x={270} y={1450} width={760} height={30} fill="#f6f1e8" />
          {/* langsir */}
          <path d="M 250 430 C 300 800 230 1200 290 1560 L 200 1560 C 160 1100 220 800 180 430 Z" fill="#ffffff" opacity={0.55} />
          {/* lantai */}
          <rect x={-300} y={1560} width={1700} height={800} fill={p.floor} />
          <rect x={-300} y={1560} width={1700} height={8} fill="#ffffff" opacity={0.25} />
          {/* jam dinding */}
          <g transform="translate(150 640)">
            <circle r={78} fill="#f6f1e8" stroke={p.interiorDark} strokeWidth={8} />
            {new Array(12).fill(0).map((_, i) => (
              <line key={i} x1={0} y1={-62} x2={0} y2={-52} stroke="#333" strokeWidth={4} transform={`rotate(${i * 30})`} />
            ))}
            <line x1={0} y1={0} x2={0} y2={-36} stroke="#2a2a2a" strokeWidth={7} strokeLinecap="round" transform="rotate(185)" />
            <line x1={0} y1={0} x2={0} y2={-52} stroke="#2a2a2a" strokeWidth={5} strokeLinecap="round" transform="rotate(-30)" />
            <line x1={0} y1={10} x2={0} y2={-58} stroke="#c0392b" strokeWidth={2.5} transform={`rotate(${secAngle})`} />
            <circle r={5} fill="#c0392b" />
          </g>
          <Plant x={1010} y={1560} s={1.6} color={p.silhouette} pot={p.interiorDark} />
        </Stage>
      </Layer>

      <LightRays x={650} y={300} angle={-28} spread={34} count={8} opacity={0.3} seed="s1r" />

      {/* Lelaki di tingkap memegang gambar */}
      <Layer cam={cam} depth={0.55} blur={(1 - focus) * 7}>
        <Stage>
          <Figure x={520} y={1600} scale={3.3} pose={POSES.holdPhoto} color={p.silhouette} rim="rgba(255,236,200,0.9)"
            holding={<rect x={-4} y={-26} width={22} height={30} rx={2} fill="#f6f1e8" opacity={0.9} transform="rotate(-20)" />}
          />
        </Stage>
      </Layer>

      <Particles count={45} seed="s1p" rise={10} area={[250, 400, 800, 1200]} />

      {/* Latar depan: meja sisi + gambar keluarga (rack focus) */}
      <Layer cam={cam} depth={1} blur={focus * 12}>
        <Stage>
          <rect x={660} y={1500} width={520} height={60} rx={10} fill={p.interiorDark} />
          <rect x={700} y={1560} width={440} height={400} fill={p.silhouette} opacity={0.9} />
          <PhotoFrame id="s1f" x={760} y={1130} w={270} h={370} tilt={-4} imgScale={1.05} />
        </Stage>
      </Layer>
      <Bokeh count={10} seed="s1b" opacity={0.25} minR={30} maxR={90} />
    </AbsoluteFill>
  );
};
