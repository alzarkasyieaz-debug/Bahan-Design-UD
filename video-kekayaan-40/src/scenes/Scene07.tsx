import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { Bokeh, Layer, Particles, Stage, palette, tw, useT, warmthOf, mix } from '../components/core';
import { Figure, POSES, lerpPose, walkPose } from '../components/Figure';
import { Cup, Steam } from '../components/Props';

const Lamp: React.FC<{ x: number; y: number; t: number; i: number; color: string }> = ({ x, y, t, i, color }) => {
  const sw = Math.sin(t * 0.8 + i) * 2;
  return (
    <g transform={`rotate(${sw} ${x} 0)`}>
      <line x1={x} y1={-50} x2={x} y2={y} stroke={color} strokeWidth={3} />
      <path d={`M ${x - 46} ${y + 40} L ${x - 20} ${y} L ${x + 20} ${y} L ${x + 46} ${y + 40} Z`} fill={color} />
      <circle cx={x} cy={y + 50} r={90} fill="#ffcf7a" opacity={0.35} style={{ filter: 'blur(30px)' }} />
      <circle cx={x} cy={y + 44} r={12} fill="#fff1c9" />
    </g>
  );
};

// BABAK 7 — SAHABAT: dua sahabat lama bertemu, bersalaman, kemudian berbual sambil minum kopi.
export const Scene07: React.FC = () => {
  const t = useT();
  const w = warmthOf(6) + 0.1;
  const p = palette(w);
  const cam = { x: tw(t, [0, 10], [0, -20]), y: tw(t, [5, 10], [0, -30]), zoom: tw(t, [0, 4.5, 10], [1.0, 1.06, 1.18]) };
  const meet = tw(t, [0, 3.0], [0, 1]);
  const shakeK = tw(t, [2.6, 3.4], [0, 1]);
  const seated = tw(t, [4.6, 5.6], [0, 1]); // cross-dissolve ke babak duduk
  const shakeBob = Math.sin(Math.max(0, t - 3.2) * 9) * 3 * shakeK * (1 - seated);
  const aPose = lerpPose(walkPose(t * 0.6), POSES.shake, shakeK);
  const bPose = lerpPose(walkPose(t * 0.6 + 0.5), POSES.shake, shakeK);
  const talk = (o: number) => ({ ...POSES.sitCup, rUpper: 30 + Math.sin(t * 1.4 + o) * 8, rFore: 100 + Math.sin(t * 1.4 + o) * 20, head: Math.sin(t * 0.9 + o) * 6 });
  const warmWall = mix('#c9b79f', '#d9a86c', w);
  const rim = 'rgba(255,214,150,0.85)';

  return (
    <AbsoluteFill style={{ backgroundColor: '#2a1d14' }}>
      <Layer cam={cam} depth={0}>
        <Stage>
          <rect x={-300} y={-300} width={1700} height={2600} fill={warmWall} />
          {/* tingkap kedai dengan bokeh jalan */}
          <rect x={120} y={560} width={840} height={620} rx={10} fill={mix('#7c95b3', '#c08a55', w)} />
          {new Array(16).fill(0).map((_, i) => (
            <circle key={i} cx={150 + random(`s7w${i}`) * 780} cy={640 + random(`s7h${i}`) * 520} r={20 + random(`s7r${i}`) * 34} fill="#ffe0a3" opacity={0.3 + 0.2 * Math.sin(t + i)} style={{ filter: 'blur(8px)' }} />
          ))}
          <path d="M 540 560 V 1180 M 120 870 H 960" stroke={p.silhouette} strokeWidth={14} />
          <rect x={-300} y={1180} width={1700} height={30} fill={p.silhouette} />
          <rect x={-300} y={1500} width={1700} height={800} fill={mix('#6b5440', '#5e3c22', w)} />
        </Stage>
      </Layer>
      <Layer cam={cam} depth={0.25}>
        <Stage>
          {[200, 540, 880].map((x, i) => (
            <Lamp key={i} x={x} y={300 + (i % 2) * 40} t={t} i={i} color={p.silhouette} />
          ))}
        </Stage>
      </Layer>

      {/* Bahagian 1: bertemu & bersalaman */}
      <Layer cam={cam} depth={0.55} opacity={1 - seated}>
        <Stage>
          <g transform={`translate(0 ${shakeBob})`}>
            <Figure x={250 + meet * 215} y={1560} scale={3.0} pose={aPose} color={p.silhouette} rim={rim} />
          </g>
          <Figure x={830 - meet * 215} y={1560} scale={3.0} pose={bPose} color={p.silhouette} facing={-1} rim={rim} kopiah />
        </Stage>
      </Layer>

      {/* Bahagian 2: duduk berbual sambil menikmati kopi */}
      <Layer cam={cam} depth={0.55} opacity={seated}>
        <Stage>
          <Figure x={330} y={1570} scale={2.8} pose={talk(0)} color={p.silhouette} rim={rim} />
          <Figure x={750} y={1570} scale={2.8} pose={talk(2)} color={p.silhouette} facing={-1} rim={rim} kopiah />
          <g fill={p.silhouette}>
            <ellipse cx={540} cy={1360} rx={170} ry={16} />
            <rect x={530} y={1360} width={20} height={200} />
            <ellipse cx={540} cy={1565} rx={80} ry={10} />
          </g>
          <Cup x={480} y={1352} s={1.2} color={mix('#f5efe4', '#fff1dc', w)} />
          <Cup x={600} y={1352} s={1.2} color={mix('#f5efe4', '#fff1dc', w)} />
          <Steam x={480} y={1316} t={t} color="#fff7e8" />
          <Steam x={600} y={1316} t={t + 0.5} color="#fff7e8" />
        </Stage>
      </Layer>
      <Particles count={30} seed="s7p" rise={6} color="#ffe6b8" />
      <Bokeh count={8} seed="s7b" opacity={0.3} color="#ffcf88" area={[0, 1450, 1080, 470]} blur={12} />
    </AbsoluteFill>
  );
};
