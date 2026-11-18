import React from 'react';
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Black, GoldDust, Grade, LightLeak, LightRays, LightSweep, sec } from './components/core';
import { Caption, SubTitle, Title3D } from './components/Typography';
import { PROJECT, Scenes } from './project';

/*
 * UMRAH MOMENT — enjin gaya (jangan ubah untuk setiap group; ubah src/project.tsx).
 * 12 babak × 10 s · 1920×1080 · 30 fps · gred emas/ungu · tajuk emas 3D · debu emas · light leak.
 */

export const TOTAL_FRAMES = sec(120);
const S = (s: number) => sec(s);

const Effects: React.FC = () => {
  const f = useCurrentFrame();
  // Sinaran cahaya hanya pada babak pembukaan, Tanah Haram (8), doa (11) dan penutup
  const rays = interpolate(f, [0, S(9), S(10.5), S(69.5), S(71), S(79), S(80.5), S(99.5), S(101), S(109), S(110), S(113.5), S(115), S(120)],
    [0.5, 0.5, 0, 0, 0.3, 0.3, 0, 0, 0.45, 0.45, 0, 0, 0.3, 0.3], { extrapolateRight: 'clamp' });
  const dust = interpolate(f, [0, S(10), S(12), S(78), S(80), S(110), S(120)], [1, 1, 0.55, 0.55, 0.9, 0.9, 1], { extrapolateRight: 'clamp' });
  return (
    <>
      {rays > 0.01 && <LightRays opacity={rays} />}
      <GoldDust count={60} intensity={dust} />
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => (
        <LightLeak key={k} center={S(k * 10 - 0.3)} len={44} strength={0.42} dir={k % 2 ? 1 : -1} />
      ))}
      <LightSweep at={S(4.2)} len={50} strength={0.3} />
      <LightSweep at={S(115.2)} len={50} strength={0.3} />
    </>
  );
};

const Texts: React.FC = () => (
  <>
    <Title3D text={PROJECT.title} at={S(2.0)} until={S(9.6)} size={124} y={215} />
    <SubTitle text={PROJECT.subtitle} at={S(3.8)} until={S(9.6)} y={345} size={42} />
    {PROJECT.captions.map((c, i) => (
      <Caption key={i} text={c} at={S((i + 1) * 10 + 1.0)} until={S((i + 1) * 10 + (i === 9 ? 9.2 : 9.3))} />
    ))}
    <Title3D text={PROJECT.finaleTitle} at={S(114.0)} until={S(119.7)} size={92} y={165} />
    <SubTitle text={PROJECT.finaleSubtitle} at={S(115.4)} until={S(119.7)} y={282} size={38} />
    <SubTitle text={PROJECT.finaleDoa} at={S(116.7)} until={S(119.7)} y={988} size={36} italic color="#F3D58F" />
  </>
);

export const UmrahMoment: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Scenes />
    <Grade warmth={0.3} />
    <Effects />
    <Texts />
    <Black points={[[0, 1], [S(1.6), 0], [S(118.6), 0], [S(119.9), 1]]} />
    <Audio src={staticFile('audio/mix.wav')} />
  </AbsoluteFill>
);
