import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { FPS, Version } from './data/script';
import voManifest from './data/vo-manifest.json';
import { FootageTrack } from './components/Footage';
import { FilmGrain, GoldParticles, LightStreak, RainTexture, ReadabilityScrims, Vignette } from './components/FX';
import { KineticText, LowerThird, MoneyCounters, Subtitles } from './components/Typography';
import { CtaCard, EndCard } from './components/Cta';

type Manifest = { files: Record<string, string>; timing: Record<string, number[][]> };
const manifest = voManifest as Manifest;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** 1 = tiada VO, 0 = VO sedang berbunyi (dengan tanjakan 0.4 s). Hanya slot yang ada rakaman dikira. */
const voPresence = (v: Version, sec: number) => {
  let m = 0;
  for (const s of v.vo) {
    if (!manifest.files[String(s.id)]) continue;
    m = Math.max(m, interpolate(sec, [s.at - 0.4, s.at, s.at + s.max, s.at + s.max + 0.6], [0, 1, 1, 0], clamp));
  }
  return m;
};

export const Appeal: React.FC<{ v: Version; music: string; ambience: string }> = ({ v, music, ambience }) => {
  const frame = useCurrentFrame();
  const sec = frame / FPS;
  const total = v.duration * FPS;
  const ctaStart = v.cta.at;

  // Arka FX: hujan pada babak awal & kemuncak 1; partikel emas apabila beralih ke harapan.
  const climax1 = v.texts.find((t) => t.kind === 'climax');
  const climax2 = v.texts.filter((t) => t.kind === 'climax')[1];
  let rain = interpolate(sec, [0, 0.5, (v.shots[2]?.at ?? 8) + 12, (v.shots[2]?.at ?? 8) + 15], [0.3, 0.42, 0.3, 0], clamp);
  if (climax1) rain = Math.max(rain, interpolate(sec, [climax1.at - 1, climax1.at, climax1.end - 0.5, climax1.end + 0.5], [0, 0.4, 0.4, 0], clamp));
  const goldFrom = climax2 ? climax2.at : ctaStart - 6;
  const gold = interpolate(sec, [goldFrom - 0.5, goldFrom + 1.5, ctaStart, ctaStart + 1, v.duration - 1, v.duration], [0, 0.55, 0.55, 0.9, 0.9, 0], clamp);
  const fadeIn = interpolate(frame, [0, 6], [0, 1], clamp);
  const fadeOut = v.endCard ? 1 : interpolate(frame, [total - 15, total], [1, 0], clamp);

  const natMul = (s: number) => 1 - 0.55 * voPresence(v, s);
  const musicVol = (f: number) => {
    const s = f / FPS;
    const base = interpolate(s, [0, 0.3, v.duration - 1.2, v.duration], [0, 0.85, 0.85, 0], clamp);
    return base * (1 - 0.6 * voPresence(v, s));
  };

  const textStreaks = v.texts.filter((t) => t.kind === 'hero' || t.kind === 'climax').map((t) => Math.round(t.at * FPS));

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
        <FootageTrack shots={v.shots} volMul={natMul} />
        <RainTexture opacity={rain} />
        <ReadabilityScrims />
        <Vignette strength={0.55} />
        <GoldParticles opacity={gold} />
        {textStreaks.map((f, i) => <LightStreak key={i} at={f + 4} />)}
        <LightStreak at={Math.round(ctaStart * FPS) + 40} strength={0.4} />

        {v.texts.map((t, i) => {
          const overlapsMoney = t.kind === 'support' && t.at < v.money.end && t.end > v.money.at;
          return <KineticText key={i} t={t} top={overlapsMoney ? 1000 : undefined} />;
        })}
        <MoneyCounters m={v.money} />
        <LowerThird s={v.lowerThird} />
        <CtaCard s={v.cta} />
        {v.endCard && <EndCard s={v.endCard} />}
        <Subtitles slots={v.vo} timing={manifest.timing} />
        <FilmGrain opacity={0.08} />
      </AbsoluteFill>

      {/* ---------------- AUDIO ---------------- */}
      <Audio src={staticFile(music)} volume={musicVol} />
      <Audio src={staticFile(ambience)} volume={(f) => interpolate(f, [total - 30, total], [0.9, 0], clamp)} />
      {v.vo.map((s) => {
        const file = manifest.files[String(s.id)];
        if (!file) return null;
        return (
          <Sequence key={s.id} from={Math.round(s.at * FPS)} name={`VO ${s.id}`}>
            <Audio src={staticFile(file)} volume={1} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
