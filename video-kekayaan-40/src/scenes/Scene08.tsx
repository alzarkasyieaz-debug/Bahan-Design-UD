import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { Bokeh, Layer, LightRays, Particles, Stage, palette, tw, useT, warmthOf, mix } from '../components/core';
import { Figure, POSES, lerpPose } from '../components/Figure';

// BABAK 8 — BEBAS HUTANG: buku kewangan ditutup, beban larut, rack focus kepada keluarga.
export const Scene08: React.FC = () => {
  const t = useT();
  const w = warmthOf(7) + 0.05;
  const p = palette(w);
  const cam = { x: tw(t, [0, 10], [20, -30]), y: 0, zoom: tw(t, [0, 10], [1.04, 1.14]) };
  const close = tw(t, [2.9, 3.45], [0, 1]); // buku ditutup (bunyi pada 3.4 s)
  const relief = tw(t, [3.8, 5.4], [0, 1]);
  const dissolve = tw(t, [3.6, 7.5], [0, 1]);
  const focus = tw(t, [6.0, 8.0], [0, 1]); // rack focus ke keluarga
  const lightUp = tw(t, [4, 8], [0, 1]);
  const pose = lerpPose(POSES.writeDesk, POSES.relief, relief);

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1410' }}>
      {/* bilik + pintu dengan keluarga di latar */}
      <Layer cam={cam} depth={0.1}>
        <Stage>
          <rect x={-300} y={-300} width={1700} height={2600} fill={mix(mix('#5d7290', '#7a5a3c', w), mix('#b9c9dc', '#e6c08a', w), lightUp * 0.6)} />
          <rect x={620} y={520} width={330} height={980} fill={mix('#fff3d8', '#ffe2a6', w)} opacity={0.35 + 0.5 * lightUp} />
          <rect x={600} y={500} width={370} height={1000} fill="none" stroke={p.silhouette} strokeWidth={26} />
        </Stage>
      </Layer>
      <LightRays x={790} y={520} angle={-10} spread={30} count={6} opacity={0.12 + 0.2 * lightUp} seed="s8r" length={1500} />
      <Layer cam={cam} depth={0.2} blur={(1 - focus) * 12} opacity={0.6 + 0.4 * focus}>
        <Stage>
          <Figure x={700} y={1500} scale={2.5} kind="woman" pose={POSES.stand} color={p.silhouette} facing={-1} />
          <Figure x={800} y={1500} scale={2.4} kind="boy" pose={POSES.watch} color={p.silhouette} facing={-1} />
          <Figure x={880} y={1500} scale={2.4} kind="girl" pose={POSES.stand} color={p.silhouette} facing={-1} />
        </Stage>
      </Layer>

      {/* lelaki di meja */}
      <Layer cam={cam} depth={0.6} blur={focus * 5}>
        <Stage>
          <rect x={-300} y={1500} width={1700} height={800} fill={mix('#3a4a60', '#4a3020', w)} />
          <Figure x={420} y={1560} scale={2.9} pose={pose} color={p.silhouette} facing={-1} rim="rgba(255,225,170,0.7)" />
          <g fill={p.silhouette}>
            <rect x={-60} y={1290} width={400} height={22} rx={6} />
            <rect x={0} y={1300} width={22} height={260} />
            <rect x={300} y={1300} width={22} height={260} />
          </g>
          {/* lampu meja */}
          <path d="M 20 1290 L 40 1120 L 110 1060" stroke={p.silhouette} strokeWidth={10} fill="none" />
          <path d="M 90 1040 L 150 1040 L 170 1090 L 70 1090 Z" fill={p.silhouette} />
          <circle cx={120} cy={1150} r={160} fill="#ffd28a" opacity={0.25 * (1 - lightUp * 0.5)} style={{ filter: 'blur(40px)' }} />
          {/* buku kewangan */}
          <g transform="translate(200 1288)">
            <rect x={-80} y={-8} width={80} height={8} fill="#f3ead9" />
            <g transform={`scale(${1 - close * 2} 1)`}>
              <rect x={0} y={-8} width={80} height={8} fill="#f3ead9" />
              <rect x={0} y={-11} width={80} height={3} fill={mix('#5c7da6', '#8a5a33', w)} />
            </g>
            <rect x={-82} y={-2} width={84} height={4} fill={mix('#5c7da6', '#8a5a33', w)} />
          </g>
        </Stage>
      </Layer>

      {/* partikel beban (angka, %) yang larut menjadi cahaya */}
      <AbsoluteFill>
        <Stage>
          {new Array(26).fill(0).map((_, i) => {
            const a = random(`s8a${i}`) * Math.PI * 2 + t * 0.4 * (random(`s8s${i}`) > 0.5 ? 1 : -1);
            const r = 120 + random(`s8r${i}`) * 220;
            const x = 360 + Math.cos(a) * r * 1.2;
            const y = 1050 + Math.sin(a) * r * 0.7 - dissolve * (300 + random(`s8u${i}`) * 500);
            const sym = ['RM', '%', '−', '!', '$'][i % 5];
            const o = (1 - dissolve) * 0.8;
            const col = mix('#2a3346', '#ffd27a', dissolve);
            return (
              <text key={i} x={x} y={y} fontFamily="Bebas Neue" fontSize={34 + random(`s8f${i}`) * 26} fill={col} opacity={o} style={{ filter: `blur(${dissolve * 6}px)` }}>
                {sym}
              </text>
            );
          })}
        </Stage>
      </AbsoluteFill>
      <Particles count={40} seed="s8p" rise={30} opacity={0.9 * dissolve} area={[100, 700, 600, 700]} />
      <Bokeh count={8} seed="s8b" opacity={0.25 * lightUp} color="#ffe2b0" />
    </AbsoluteFill>
  );
};
