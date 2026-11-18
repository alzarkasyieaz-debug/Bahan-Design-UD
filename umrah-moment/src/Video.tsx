import React from 'react';
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Black, BlurBg, GoldDust, GoldenFrame, Grade, LightLeak, LightRays, LightSweep, sec } from './components/core';
import { Caption, SignatureCard, SubTitle, Title3D } from './components/Typography';
import { PROJECT, SLUG, Scenes, config } from './active';

/*
 * UMRAH MOMENT — enjin gaya (jangan ubah untuk setiap group). Kandungan: projects/<slug>/ (pilih dengan npm run use -- <slug>).
 * Babak 10 s · 1920×1080 · 30 fps · durasi 120–240 s · gred emas/ungu · tajuk emas 3D · debu emas · light leak.
 */

export const DURATION = Math.min(240, Math.max(120, Number(config.duration) || 120));
export const TOTAL_FRAMES = sec(DURATION);
const S = (s: number) => sec(s);

/** Lengkung bertangga daripada senarai tetingkap [mula, tamat, nilai] (dengan fade 1.5 s). */
const windows = (f: number, wins: [number, number, number][], base: number) => {
  let v = base;
  for (const [a, b, val] of wins) {
    const w = interpolate(f, [S(a - 1.5), S(a), S(b), S(b + 1.5)], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    v = Math.max(v, base + (val - base) * w);
  }
  return v;
};

const Effects: React.FC = () => {
  const f = useCurrentFrame();
  const rays = windows(f, PROJECT.rays, 0);
  const dust = windows(f, PROJECT.dustHigh.map(([a, b]) => [a, b, 1] as [number, number, number]), 0.55);
  const scenes = Math.floor(DURATION / 10);
  return (
    <>
      {rays > 0.01 && <LightRays opacity={rays} />}
      <GoldDust count={60} intensity={dust} />
      {new Array(scenes - 1).fill(0).map((_, i) => (
        <LightLeak key={i} center={S((i + 1) * 10 - 0.3)} len={44} strength={0.42} dir={i % 2 ? -1 : 1} />
      ))}
      <LightSweep at={S(4.2)} len={50} strength={0.3} />
      <LightSweep at={S(PROJECT.finale.at + 1.2)} len={50} strength={0.3} />
    </>
  );
};

/** Jalur gelap lembut di bahagian bawah supaya teks doa penutup jelas dibaca. */
const FinaleBand: React.FC<{ from: number; until: number }> = ({ from, until }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [from, from + 20, until - 20, until], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (op <= 0) return null;
  return <AbsoluteFill style={{ opacity: op, background: 'linear-gradient(0deg, rgba(14,5,22,0.85) 0%, rgba(14,5,22,0.45) 16%, rgba(14,5,22,0) 30%)' }} />;
};

const Texts: React.FC = () => {
  const fin = PROJECT.finale;
  const end = PROJECT.endCard;
  return (
    <>
      <Title3D text={PROJECT.title} at={S(2.0)} until={S(9.6)} size={124} y={215} />
      <SubTitle text={PROJECT.subtitle} at={S(3.8)} until={S(9.6)} y={345} size={42} />
      {Object.entries(PROJECT.captions).map(([scene, text]) => {
        const t0 = (Number(scene) - 1) * 10;
        return <Caption key={scene} text={text} at={S(t0 + 1.0)} until={S(t0 + 9.3)} />;
      })}
      <Title3D text={fin.title} at={S(fin.at)} until={S(fin.until)} size={92} y={165} />
      <SubTitle text={fin.subtitle} at={S(fin.at + 1.4)} until={S(fin.until)} y={282} size={38} />
      <FinaleBand from={S(fin.at + 2.4)} until={S(fin.until)} />
      <SubTitle text={fin.doa} at={S(fin.at + 2.7)} until={S(fin.until)} y={988} size={36} italic color="#F3D58F" />
      {end && <SignatureCard at={S(end.at)} until={S(DURATION)} intro={end.intro} name={end.name} role={end.role} />}
    </>
  );
};

/** Latar kad tandatangan: foto kabur + bingkai emas. */
const EndCardBg: React.FC = () => {
  const f = useCurrentFrame();
  const end = PROJECT.endCard;
  if (!end || f < S(end.at)) return null;
  const op = interpolate(f, [S(end.at), S(end.at + 1)], [0, 1], { extrapolateRight: 'clamp' });
  const p = interpolate(f, [S(end.at), S(DURATION)], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <BlurBg id={end.bg} p={p} dim={0.62} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(60,25,80,0.25) 0%, rgba(10,4,16,0.75) 100%)' }} />
    </AbsoluteFill>
  );
};

export const UmrahMoment: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Scenes />
    <EndCardBg />
    <Grade warmth={0.3} />
    <Effects />
    {PROJECT.endCard && <GoldenFrame from={S(PROJECT.endCard.at + 0.5)} dur={S(DURATION - PROJECT.endCard.at - 0.5)} inset={40} />}
    <Texts />
    <Black points={[[0, 1], [S(1.6), 0], [S(DURATION - 1.4), 0], [S(DURATION - 0.1), 1]]} />
    <Audio src={staticFile(`audio/${SLUG}/mix.wav`)} />
  </AbsoluteFill>
);
