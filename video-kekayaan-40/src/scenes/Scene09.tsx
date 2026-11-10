import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Bokeh, Layer, LightRays, Particles, Stage, palette, tw, useT, warmthOf, mix } from '../components/core';
import { Figure, POSES, lerpPose } from '../components/Figure';
import { Sejadah, archPath } from '../components/Props';
import { StarPattern } from '../components/Pattern';

// BABAK 9 — DEKAT DENGAN ALLAH: selesai solat, berzikir dan berdoa; cahaya Subuh menyinari sejadah.
// (Tiada sebarang penggambaran zat Allah — hanya cahaya semula jadi.)
export const Scene09: React.FC = () => {
  const t = useT();
  const w = warmthOf(8);
  const p = palette(w);
  // kamera naik perlahan (slow rising camera)
  const cam = { x: 0, y: tw(t, [0, 10], [90, -70]), zoom: tw(t, [0, 10], [1.02, 1.12]) };
  const dawn = tw(t, [0, 8], [0.4, 1]);
  // zikir (tunduk) kemudian mengangkat tangan berdoa
  const pose = lerpPose(POSES.kneelRest, POSES.kneelDoa, tw(t, [3.6, 5.0], [0, 1]));
  const wall = mix('#33465f', '#4a3626', w);

  return (
    <AbsoluteFill style={{ backgroundColor: '#141a24' }}>
      <Layer cam={cam} depth={0.1}>
        <Stage>
          <rect x={-300} y={-300} width={1700} height={2600} fill={wall} />
          <StarPattern x={60} y={300} cols={9} rows={14} size={130} color="#f3e2c0" opacity={0.08} />
          {/* tingkap gerbang – langit Subuh */}
          <defs>
            <linearGradient id="s9sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={mix('#36507a', '#6e7fa6', dawn)} />
              <stop offset="0.6" stopColor={mix('#8aa3c8', '#f5c98e', dawn)} />
              <stop offset="1" stopColor={mix('#c8d3e6', '#ffe9c2', dawn)} />
            </linearGradient>
          </defs>
          <path d={archPath(610, 520, 330, 640)} fill="url(#s9sky)" />
          <path d={archPath(610, 520, 330, 640)} fill="none" stroke="#e9dcc4" strokeWidth={14} />
          <line x1={775} y1={480} x2={775} y2={1160} stroke="#e9dcc4" strokeWidth={8} />
          <line x1={610} y1={860} x2={940} y2={860} stroke="#e9dcc4" strokeWidth={8} />
          <circle cx={775} cy={1110} r={140 * dawn} fill="#fff1d0" opacity={0.6} style={{ filter: 'blur(30px)' }} />
          <rect x={-300} y={1480} width={1700} height={800} fill={mix('#1f2b3c', '#3a2718', w)} />
        </Stage>
      </Layer>
      {/* cahaya Subuh jatuh ke atas sejadah */}
      <LightRays x={775} y={700} angle={38} spread={26} count={7} opacity={0.18 + 0.22 * dawn} seed="s9r" length={1300} color="#fff0d2" />
      <AbsoluteFill style={{ mixBlendMode: 'screen' }}>
        <Stage>
          <ellipse cx={420} cy={1520} rx={330} ry={60} fill="#ffe7b8" opacity={0.25 * dawn} style={{ filter: 'blur(30px)' }} />
        </Stage>
      </AbsoluteFill>
      <Layer cam={cam} depth={0.5}>
        <Stage>
          <g transform="translate(0 0)">
            <Sejadah x={180} y={1485} w={460} h={60} color={mix('#3d5f8c', '#8a4b2a', w)} accent="#e8c98a" />
          </g>
          <Figure x={400} y={1505} scale={3.1} pose={pose} color={p.silhouette} kopiah rim={`rgba(255,232,190,${0.5 + 0.4 * dawn})`} />
        </Stage>
      </Layer>
      <Particles count={45} seed="s9p" rise={6} area={[300, 500, 700, 1100]} color="#fff4dc" />
      <Bokeh count={7} seed="s9b" opacity={0.18} color="#ffe6c0" blur={10} />
    </AbsoluteFill>
  );
};
