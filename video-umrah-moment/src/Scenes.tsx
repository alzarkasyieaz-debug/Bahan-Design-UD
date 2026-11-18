import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ArchPhoto, Card } from './components/Frames';
import { Caption, ChapterTitle, Ornament, WordReveal } from './components/Typography';
import { Chapter, XFADE } from './data';
import { C, F } from './theme';

/** Pudar masuk/keluar setiap babak */
export const Fader: React.FC<{ dur: number; children: React.ReactNode; first?: boolean; last?: boolean }> = ({ dur, children, first, last }) => {
  const f = useCurrentFrame();
  const inO = first ? 1 : interpolate(f, [0, XFADE], [0, 1], { extrapolateRight: 'clamp' });
  const outO = last ? 1 : interpolate(f, [dur - XFADE, dur], [1, 0], { extrapolateLeft: 'clamp' });
  return <AbsoluteFill style={{ opacity: Math.min(inO, outO) }}>{children}</AbsoluteFill>;
};

export const Intro: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const fromBlack = interpolate(f, [0, 24], [1, 0], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <WordReveal text="MEMORI USJ" y={130} size={40} font={F.display} color={C.gold} spacing={14} delay={8} />
      <WordReveal text="لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ" y={205} size={66} font={F.arabic} color={C.goldLight} delay={16} stagger={6} weight={700} rtl />
      <ArchPhoto x={170} y={400} w={740} h={960} photos={['p046']} dur={dur} delay={10} focusY={0.55} />
      <WordReveal text="Umrah Moment" y={1430} size={132} font={F.script} italic delay={40} stagger={8} />
      <Ornament y={1625} delay={58} width={420} />
      <WordReveal text="4 – 12 JULAI 2026" y={1660} size={50} font={F.display} color={C.goldLight} spacing={12} delay={66} stagger={3} />
      <AbsoluteFill style={{ background: '#000', opacity: fromBlack }} />
    </AbsoluteFill>
  );
};

export const ChapterScene: React.FC<{ c: Chapter; no: number }> = ({ c, no }) => {
  const d = c.dur;
  return (
    <AbsoluteFill>
      <ChapterTitle no={no} title={c.title} />
      {c.layout === 'arch' && (
        <>
          <ArchPhoto x={150} y={430} w={780} h={1110} photos={c.photos} dur={d} delay={8} />
          <Caption text={c.caption} y={1640} delay={30} />
        </>
      )}
      {c.layout === 'trio' && (
        <>
          <ArchPhoto x={210} y={430} w={660} h={820} photos={[c.photos[0]]} dur={d} delay={6} />
          <Card x={70} y={1210} w={470} h={370} src={c.photos[1]} delay={34} dur={d} rot={-4} />
          <Card x={540} y={1250} w={470} h={370} src={c.photos[2]} delay={46} dur={d} rot={4} />
          <Caption text={c.caption} y={1700} delay={60} />
        </>
      )}
      {c.layout === 'grid' && (
        <>
          <Card x={70} y={430} w={460} h={540} src={c.photos[0]} delay={10} dur={d} rot={-3} />
          <Card x={550} y={475} w={460} h={540} src={c.photos[1]} delay={22} dur={d} rot={3} />
          <Card x={70} y={1010} w={460} h={540} src={c.photos[2]} delay={34} dur={d} rot={2.5} />
          <Card x={550} y={1055} w={460} h={540} src={c.photos[3]} delay={46} dur={d} rot={-2.5} />
          <Caption text={c.caption} y={1680} delay={60} />
        </>
      )}
    </AbsoluteFill>
  );
};

export const Outro: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const toBlack = interpolate(f, [dur - 40, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <WordReveal text="تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ" y={150} size={72} font={F.arabic} color={C.goldLight} delay={8} stagger={6} weight={700} rtl />
      <WordReveal text="Semoga Allah menerima ibadah kita" y={268} size={42} font={F.body} color={C.cream} delay={26} stagger={3} />
      <ArchPhoto x={190} y={420} w={700} h={900} photos={['p226', 'p051']} dur={dur - 40} delay={14} />
      <WordReveal text="Sehingga bertemu lagi," y={1400} size={56} font={F.script} italic color={C.goldLight} delay={70} stagger={5} />
      <WordReveal text="Tanah Suci" y={1470} size={124} font={F.script} italic delay={84} stagger={8} />
      <Ornament y={1660} delay={100} width={420} />
      <WordReveal text="UMRAH MOMENT · MEMORI USJ 2026" y={1700} size={40} font={F.display} color={C.gold} spacing={8} delay={110} stagger={3} />
      <AbsoluteFill style={{ background: '#000', opacity: toBlack }} />
    </AbsoluteFill>
  );
};
