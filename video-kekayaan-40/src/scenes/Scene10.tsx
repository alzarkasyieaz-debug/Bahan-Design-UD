import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Bokeh, Layer, Particles, Stage, palette, tw, useT, warmthOf, mix, easeOut } from '../components/core';
import { Figure, POSES } from '../components/Figure';
import { PhotoFrame } from '../components/Props';
import { SceneTitle } from '../components/Typography';
import { SCENES } from '../data/script';

const MEMORIES = [
  { src: 'img/memori-anak.jpg', x: 120, y: 520, w: 520, h: 380, tilt: -6, at: 0.0 },
  { src: 'img/memori-ayah.jpg', x: 520, y: 760, w: 400, h: 430, tilt: 5, at: 1.0 },
  { src: 'img/memori-ibu-anak.jpg', x: 140, y: 1000, w: 420, h: 420, tilt: -3, at: 2.0 },
  { src: 'img/keluarga-tengah.jpg', x: 330, y: 560, w: 440, h: 620, tilt: 2, at: 3.0 },
];

// BABAK 10 — MUHASABAH: montaj kenangan, kemudian lelaki merenung usia di hadapan cermin.
export const Scene10: React.FC = () => {
  const t = useT();
  const w = warmthOf(9);
  const p = palette(w);
  const montage = 1 - tw(t, [4.6, 5.6], [0, 1]);
  const cam = { x: 0, y: 0, zoom: tw(t, [5, 10], [1.0, 1.1]) };

  return (
    <AbsoluteFill style={{ backgroundColor: '#1d1612' }}>
      {/* Bahagian 1: montaj kenangan (soft memory dissolve) */}
      <AbsoluteFill style={{ opacity: montage }}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${mix('#6b6f80', '#8c6a48', w)} 0%, #1d1612 75%)` }} />
        <Stage>
          {MEMORIES.map((m, i) => {
            const k = tw(t, [m.at, m.at + 1.2], [0, 1], easeOut);
            const out = tw(t, [m.at + 2.4, m.at + 3.4], [0, 1]);
            const z = 1 + (t - m.at) * 0.04;
            return (
              <g
                key={i}
                opacity={k * (i === 3 ? 1 : 1 - out * 0.75)}
                transform={`translate(${m.x + m.w / 2} ${m.y + m.h / 2 + (1 - k) * 60}) scale(${z}) translate(${-m.x - m.w / 2} ${-m.y - m.h / 2})`}
                style={{ filter: `blur(${out * 6 + (1 - k) * 8}px)` }}
              >
                <PhotoFrame id={`s10m${i}`} x={m.x} y={m.y} w={m.w} h={m.h} src={m.src} tilt={m.tilt} frame="#f3ead8" filter="sepia(0.55) saturate(0.9) contrast(1.05)" />
              </g>
            );
          })}
        </Stage>
      </AbsoluteFill>

      {/* Bahagian 2: cermin */}
      <AbsoluteFill style={{ opacity: 1 - montage }}>
        <Layer cam={cam} depth={0.1}>
          <Stage>
            <rect x={-300} y={-300} width={1700} height={2600} fill={mix('#3e4658', '#5a412c', w)} />
            <rect x={-300} y={1520} width={1700} height={800} fill={mix('#262b36', '#36261a', w)} />
            <circle cx={180} cy={700} r={420} fill="#ffd9a0" opacity={0.22} style={{ filter: 'blur(80px)' }} />
          </Stage>
        </Layer>
        <Layer cam={cam} depth={0.5}>
          <Stage>
            <defs>
              <clipPath id="s10mirror">
                <ellipse cx={720} cy={1050} rx={210} ry={330} />
              </clipPath>
              <linearGradient id="s10glass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={mix('#9fb2cc', '#e2c49a', w)} />
                <stop offset="1" stopColor={mix('#56657e', '#7d5a3a', w)} />
              </linearGradient>
            </defs>
            <ellipse cx={720} cy={1050} rx={230} ry={350} fill={p.silhouette} />
            <ellipse cx={720} cy={1050} rx={210} ry={330} fill="url(#s10glass)" />
            {/* pantulan (lebih terang & kabur — "diri yang lalu") */}
            <g clipPath="url(#s10mirror)" opacity={0.75} style={{ filter: 'blur(1.5px)' }}>
              <Figure x={700} y={1620} scale={2.6} pose={{ ...POSES.watch, head: 4 }} color={mix('#2c3a52', '#4a3020', w)} facing={-1} />
            </g>
            <path d="M 560 820 L 640 760 M 580 900 L 700 800" stroke="#fff" strokeWidth={10} opacity={0.18} strokeLinecap="round" />
            <rect x={600} y={1400} width={240} height={20} fill={p.silhouette} />
            <rect x={620} y={1420} width={20} height={110} fill={p.silhouette} />
            <rect x={800} y={1420} width={20} height={110} fill={p.silhouette} />
            <Figure x={330} y={1620} scale={3.3} pose={{ ...POSES.watch, head: 4 }} color={p.silhouette} rim="rgba(255,220,170,0.6)" />
          </Stage>
        </Layer>
        <Particles count={25} seed="s10p" rise={5} color="#ffe9c8" />
      </AbsoluteFill>
      <Bokeh count={9} seed="s10b" opacity={0.22} color="#ffdcae" blur={12} />
      <SceneTitle scene={SCENES[9]} delay={4.7} size={104} />
    </AbsoluteFill>
  );
};
