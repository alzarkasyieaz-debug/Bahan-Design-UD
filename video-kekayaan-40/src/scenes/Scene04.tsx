import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Bokeh, Layer, LightRays, Particles, Stage, palette, tw, useT, warmthOf, mix } from '../components/core';
import { Figure, POSES, lerpPose } from '../components/Figure';
import { Cup, Plant, Steam } from '../components/Props';

// BABAK 4 — REZEKI BERKAT: sarapan sederhana, doa makan, tangan menghulurkan makanan.
export const Scene04: React.FC = () => {
  const t = useT();
  const w = warmthOf(3) + 0.12;
  const p = palette(w);
  // "Gentle camera orbit" – pergerakan sisi + zoom ke tangan
  const cam = { x: tw(t, [0, 10], [70, -70]), y: tw(t, [4.5, 10], [0, -40]), zoom: tw(t, [0, 4.5, 10], [1.0, 1.04, 1.2]) };
  const doa = 1 - tw(t, [4.0, 5.0], [0, 1]); // tangan berdoa 0–4 s
  const give = tw(t, [5.2, 7.2], [0, 1]); // ayah menghulurkan mangkuk
  const sitRest = { ...POSES.sit, lUpper: 30, lFore: 95, rUpper: 35, rFore: 100, head: 10 };
  const dad = lerpPose(lerpPose(sitRest, { ...sitRest, rUpper: 70, rFore: 88, head: 4 }, give), POSES.sitDoa, doa);
  const mum = lerpPose(sitRest, POSES.sitDoa, doa);
  const kid = lerpPose({ ...sitRest, rUpper: 60, rFore: 75 }, POSES.sitDoa, Math.max(doa, 0));
  const kid2 = lerpPose(lerpPose(sitRest, { ...sitRest, rUpper: 70, rFore: 80, head: -6 }, give), POSES.sitDoa, doa);
  const bowlX = 380 + give * 120;
  const bowlY = 1196 - give * 40;

  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0}>
        <Stage>
          <defs>
            <radialGradient id="s4wall" cx="0.5" cy="0.35" r="0.8">
              <stop offset="0" stopColor={mix('#f3dcb6', '#f6d6a2', w)} />
              <stop offset="1" stopColor={p.interiorDark} />
            </radialGradient>
          </defs>
          <rect x={-300} y={-300} width={1700} height={2600} fill="url(#s4wall)" />
          {/* tingkap pagi */}
          <rect x={360} y={420} width={360} height={520} rx={8} fill="#fff7e4" opacity={0.85} />
          <path d="M 540 420 V 940 M 360 680 H 720" stroke={p.interiorDark} strokeWidth={14} />
          <Plant x={160} y={1060} s={1.4} color={p.interiorDark} />
          <Plant x={930} y={1060} s={1.2} color={p.interiorDark} />
        </Stage>
      </Layer>
      <LightRays x={540} y={520} angle={0} spread={60} count={8} opacity={0.3} seed="s4r" length={1500} />

      {/* Keluarga di meja */}
      <Layer cam={cam} depth={0.5}>
        <Stage>
          <Figure x={200} y={1560} scale={2.5} pose={dad} color={p.silhouette} rim="rgba(255,225,170,0.85)" />
          <Figure x={440} y={1470} scale={2.4} kind="boy" pose={kid2} color={p.silhouette} rim="rgba(255,225,170,0.85)" />
          <Figure x={660} y={1470} scale={2.4} kind="girl" pose={kid} color={p.silhouette} facing={-1} rim="rgba(255,225,170,0.85)" />
          <Figure x={890} y={1560} scale={2.5} kind="woman" pose={mum} color={p.silhouette} facing={-1} rim="rgba(255,225,170,0.85)" />
        </Stage>
      </Layer>

      {/* Meja & makanan sederhana */}
      <Layer cam={cam} depth={0.7}>
        <Stage>
          <g transform="translate(0 165)">
          <rect x={-200} y={1205} width={1480} height={30} rx={8} fill={mix('#f2ead8', '#fff1d8', w)} />
          <path d="M -200 1230 H 1280 V 1900 H -200 Z" fill={mix('#d9c7a6', '#e2bf8a', w)} />
          <path d="M -200 1230 H 1280 V 1300 H -200 Z" fill="#000" opacity={0.08} />
          {/* pinggan, teko, roti / nasi */}
          <ellipse cx={250} cy={1205} rx={70} ry={10} fill="#fff" />
          <ellipse cx={820} cy={1205} rx={70} ry={10} fill="#fff" />
          <path d={`M 470 1205 q 70 -90 140 0 Z`} fill={mix('#f7f2e6', '#fff3dc', w)} />
          <path d="M 640 1205 l 10 -70 h 50 l 10 70 Z" fill={p.interiorDark} />
          <path d="M 705 1150 q 30 -5 26 25" stroke={p.interiorDark} strokeWidth={8} fill="none" />
          <Cup x={330} y={1205} s={1.1} color={mix('#ffffff', '#fff6e8', w)} />
          <Cup x={930} y={1205} s={1.1} color={mix('#ffffff', '#fff6e8', w)} />
          <Steam x={330} y={1170} t={t} s={0.9} color="#fffaf0" />
          <Steam x={930} y={1170} t={t + 0.4} s={0.9} color="#fffaf0" />
          <Steam x={540} y={1120} t={t + 0.7} s={1.2} color="#fffaf0" />
          {/* mangkuk yang dihulurkan */}
          <g transform={`translate(${bowlX} ${bowlY})`}>
            <path d="M -40 0 q 40 40 80 0 Z" fill="#ffffff" />
            <path d="M -30 -2 q 30 -26 60 0 Z" fill="#fff4dc" />
          </g>
          </g>
        </Stage>
      </Layer>
      <Particles count={35} seed="s4p" rise={9} color="#fff1cf" />
      <Bokeh count={9} seed="s4b" opacity={0.3} color="#ffe3b0" area={[0, 1500, 1080, 400]} blur={10} />
    </AbsoluteFill>
  );
};
