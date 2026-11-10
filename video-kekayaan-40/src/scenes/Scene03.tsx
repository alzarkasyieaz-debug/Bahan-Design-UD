import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { Bokeh, Layer, Stage, palette, tw, useT, warmthOf, mix } from '../components/core';
import { Cup, Plant, Steam, Tree } from '../components/Props';
import { Figure, POSES, lerpPose } from '../components/Figure';

/** Hujan renyai */
const Rain: React.FC<{ t: number; count: number; seed: string; len: number; speed: number; opacity: number; width?: number }> = ({
  t,
  count,
  seed,
  len,
  speed,
  opacity,
  width = 2,
}) => (
  <Stage>
    {new Array(count).fill(0).map((_, i) => {
      const x = random(`${seed}x${i}`) * 1300 - 100;
      const y = ((random(`${seed}y${i}`) * 2100 + t * speed) % 2100) - 100;
      return <line key={i} x1={x} y1={y} x2={x - len * 0.12} y2={y + len} stroke="#e6f0ff" strokeWidth={width} opacity={opacity} strokeLinecap="round" />;
    })}
  </Stage>
);

// BABAK 3 — KETENANGAN: duduk di beranda menikmati kopi, melihat hujan renyai.
export const Scene03: React.FC = () => {
  const t = useT();
  const w = warmthOf(2);
  const p = palette(w);
  const cam = { x: tw(t, [0, 10], [30, -50]), y: tw(t, [0, 10], [0, -10]), zoom: tw(t, [0, 10], [1.0, 1.1]) };
  // menghirup kopi perlahan pada 3.5–5.5 s
  const sip = tw(t, [3.4, 4.4], [0, 1]) - tw(t, [5.4, 6.4], [0, 1]);
  const pose = lerpPose(POSES.sitCup, { ...POSES.sitCup, rUpper: 40, rFore: 168, head: -6 }, sip);
  const outside = mix('#8fa8c4', '#a7a9b4', w);

  return (
    <AbsoluteFill style={{ backgroundColor: outside }}>
      {/* Luar: taman dalam hujan (kabur) */}
      <Layer cam={cam} depth={0} blur={6}>
        <Stage>
          <defs>
            <linearGradient id="s3sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={mix('#8ea6c3', '#a3a7b8', w)} />
              <stop offset="1" stopColor={mix('#c9d7e6', '#d6d0cc', w)} />
            </linearGradient>
          </defs>
          <rect x={-300} y={-300} width={1700} height={2600} fill="url(#s3sky)" />
          {[100, 300, 520, 760, 980].map((x, i) => (
            <Tree key={i} x={x} y={1350} s={1.1 + random(`s3t${i}`) * 0.4} color={mix('#6f88a6', '#8c8a90', w)} seed={`s3t${i}`} />
          ))}
          <rect x={-300} y={1340} width={1700} height={900} fill={mix('#6f88a6', '#8c8a90', w)} />
        </Stage>
      </Layer>
      <Layer cam={cam} depth={0.2}>
        <Rain t={t} count={110} seed="s3a" len={70} speed={900} opacity={0.35} width={1.6} />
      </Layer>

      {/* Beranda */}
      <Layer cam={cam} depth={0.5}>
        <Stage>
          {/* bumbung & tiang */}
          <rect x={-300} y={-300} width={1700} height={560} fill={p.silhouette} />
          <rect x={-300} y={250} width={1700} height={26} fill={mix('#3b5878', '#5a3d25', w)} />
          <rect x={30} y={260} width={56} height={1400} fill={p.silhouette} />
          <rect x={994} y={260} width={56} height={1400} fill={p.silhouette} />
          {/* titisan air dari cucur atap */}
          {new Array(9).fill(0).map((_, i) => {
            const x = 120 + i * 105 + random(`s3d${i}`) * 30;
            const ph = (t * 0.8 + random(`s3dp${i}`)) % 1;
            return <ellipse key={i} cx={x} cy={290 + ph * ph * 1300} rx={3} ry={9} fill="#eaf3ff" opacity={0.7 * (1 - ph)} />;
          })}
          {/* lantai kayu & pagar */}
          <rect x={-300} y={1560} width={1700} height={800} fill={mix('#4a6283', '#6b4a2c', w)} />
          {new Array(8).fill(0).map((_, i) => (
            <rect key={i} x={-300} y={1580 + i * 60} width={1700} height={3} fill="#000" opacity={0.12} />
          ))}
          <rect x={-300} y={1280} width={1700} height={22} fill={p.silhouette} />
          {new Array(16).fill(0).map((_, i) => (
            <rect key={i} x={-40 + i * 75} y={1300} width={16} height={260} fill={p.silhouette} />
          ))}
          {/* cahaya lampu hangat dari dalam rumah */}
          <circle cx={-80} cy={900} r={700} fill="#ffd9a0" opacity={0.18} style={{ filter: 'blur(60px)' }} />
          <Plant x={980} y={1560} s={1.3} color={p.silhouette} />
        </Stage>
      </Layer>

      {/* Lelaki duduk di kerusi */}
      <Layer cam={cam} depth={0.65}>
        <Stage>
          <g fill={p.silhouette}>
            <rect x={300} y={1420} width={200} height={18} rx={6} />
            <rect x={300} y={1180} width={18} height={258} rx={6} />
            <rect x={310} y={1430} width={14} height={140} />
            <rect x={478} y={1430} width={14} height={140} />
            {/* meja kecil & teko */}
            <rect x={640} y={1400} width={180} height={14} rx={5} />
            <rect x={720} y={1410} width={16} height={160} />
          </g>
          <Cup x={690} y={1400} s={1.4} color={p.silhouette} />
          <Steam x={690} y={1360} t={t} s={1.1} color="#fff8ec" />
          <Figure
            x={380}
            y={1572}
            scale={2.7}
            pose={pose}
            color={p.silhouette}
            rim="rgba(255,226,180,0.8)"
            holding={<g transform="rotate(10)"><Cup x={8} y={6} s={0.55} color={p.silhouette} /></g>}
          />
        </Stage>
      </Layer>
      <Layer cam={cam} depth={1}>
        <Rain t={t + 2} count={25} seed="s3b" len={160} speed={1500} opacity={0.2} width={3} />
      </Layer>
      <Bokeh count={10} seed="s3bk" color="#ffe6c0" opacity={0.25} area={[0, 300, 600, 1300]} />
    </AbsoluteFill>
  );
};
