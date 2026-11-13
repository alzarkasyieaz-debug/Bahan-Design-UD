import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { B, tw, ease, easeOut, useTime } from './lib';
import { SpeakerStage } from './components/Stage';
import { Text3D, Label, NumberBadge } from './components/Text3D';
import { Subtitles } from './components/Subtitles';
import { LowerThird, CtaHeadings } from './components/LowerThird';
import { FriendsBroll } from './components/Broll';
import { Burst, Dust, Flash, Grade, Grain, LightLeak, Vignette } from './components/Effects';
import {
  Chip, ThreeSlots, MoodMeter, Compare, Checklist, ChatBubble, Crowd, RecapList, ProgressChips, HeartPulse, SocialBroll,
} from './components/MotionGraphics';

/*
 * ZON SUSUN ATUR (skrin 1080x1920)
 *   Atas / siling : label & lencana y≈200, teks 3D siling y≈345 (perspektif satah siling, parallax)
 *   Wajah         : y≈476–1240 — TIADA grafik
 *   Kad MG        : y≈1300
 *   Subtitle      : y≈1480
 *   Lower third   : y 1565–1661
 */
const CY = 345; // baris teks 3D siling (koordinat sumber, dalam CeilingLayer)
const CEIL = -22; // kecondongan satah siling (rotateX)
const LY = 200;

/** Teks 3D pada siling — bergerak bersama kamera (parallax 0.75) */
const CeilingText: React.FC = () => (
  <>
    <Text3D text="3 PERKARA" at={0.3} until={B.flashToBody - 0.2} x={540} y={CY} size={160} reveal="punch" depth={18} rotX={CEIL} float={false} />
    <Text3D text="KAWAN LAMA" at={B.kawanLama} until={B.mood[0] - 0.1} x={540} y={CY} size={150} depth={16} rotX={CEIL} />
    <Text3D text="MOOD" at={B.mood[0]} until={B.mood[1]} x={540} y={CY} size={170} fill="cream" depth={14} rotX={CEIL} />
    <Text3D text="SAPAAN" at={B.sapaan} until={B.p1End - 0.15} x={540} y={CY} size={170} depth={18} rotX={CEIL} />
    <Text3D text="BERGURAU" at={B.bergurau} until={B.niat - 0.2} x={540} y={CY} size={165} depth={18} rotX={CEIL} />
    <Text3D text="NIAT BERGURAU" at={B.niat} until={B.situasi - 0.15} x={540} y={CY} size={140} fill="cream" depth={14} rotX={CEIL} />
    <Text3D text="SITUASI" at={B.situasi} until={B.diaibkan - 0.1} x={540} y={CY} size={170} depth={16} rotX={CEIL} />
    <Text3D text="DIAIBKAN" at={B.diaibkan} until={B.dimalukan - 0.05} x={540} y={CY} size={165} reveal="punch" fill="red" depth={18} rotX={CEIL} />
    <Text3D text="DIMALUKAN" at={B.dimalukan} until={B.p3 - 0.15} x={540} y={CY} size={160} reveal="punch" fill="red" depth={18} rotX={CEIL} />
    <Text3D text="SINDIRAN" at={B.sindiran} until={B.recap - 0.1} x={540} y={CY} size={170} reveal="punch" fill="red" depth={18} rotX={CEIL} />
    <Text3D text="JAGA KOMUNIKASI" at={B.jagaKomunikasi} until={B.finale[0] + 0.2} x={540} y={CY} size={128} depth={16} rotX={CEIL} />
    <Text3D text="UKHUWAH" at={B.ukhuwah} until={B.cta - 0.1} x={560} y={CY} size={175} depth={20} rotX={CEIL} />
  </>
);

/** Teks hadapan & motion graphics (ruang skrin) */
const Front: React.FC = () => (
  <>
    {/* HOOK */}
    <Label text="ELAKKAN" at={0.12} until={B.flashToBody - 0.2} y={LY} size={48} />
    <Burst at={0.32} x={540} y={CY} seed="hook" spread={460} />
    <Chip text="BILA JUMPA KAWAN LAMA" at={B.hookSub} until={B.flashToBody - 0.1} />

    {/* BUILD-UP */}
    <ThreeSlots at={B.tigaKeadaan} until={B.kawanLama + 2.4} />
    <Burst at={B.kawanLama + 0.2} x={540} y={CY} seed="kawan" />
    <MoodMeter at={B.mood[0]} until={B.mood[1]} dropAt={B.mood[0] + 0.9} />

    {/* 01 — SAPAAN */}
    <NumberBadge n="01" caption="SAPAAN TAK CANTIK" at={B.p1} until={B.p1End - 0.1} y={LY} />
    <Compare
      at={B.salam - 0.05}
      until={B.p1End - 0.1}
      left={{ title: 'LEBIH BAIK', good: true, items: [{ text: '“Assalamualaikum, lama tak jumpa”', at: B.salam }] }}
      right={{ title: 'ELAKKAN', items: [{ text: 'Pekik panggil dia', at: B.pekik }, { text: 'Nama panggilan tak sesuai', at: B.namaPanggilan }] }}
    />

    {/* 02 — BERGURAU */}
    <NumberBadge n="02" caption="GURAU TAK KENA TEMPAT" at={B.p2} until={B.p3 - 0.15} y={LY} />
    <Checklist title="BERGURAU? TENGOK DULU" at={B.suasana - 0.5} until={B.contohGurau - 0.15} items={[{ text: 'SUASANA', at: B.suasana }, { text: 'TEMPAT', at: B.tempat }, { text: 'KEADAAN', at: B.keadaan }]} />
    <ChatBubble text="Oi, besar je badan hang!" at={B.contohGurau} until={B.niat - 0.4} stampAt={B.contohGurau + 1.9} stamp="TAK KENA TEMPAT" />
    <Compare
      at={B.niat}
      until={B.situasi + 1.2}
      arrow
      left={{ title: 'NIAT', good: true, items: [{ text: 'Bergurau, sebab lama tak jumpa', at: B.niat }] }}
      right={{ title: 'TAPI TENGOK', good: true, items: [{ text: 'Keadaan & situasi setempat', at: B.situasi }] }}
    />
    <Crowd at={B.ramai} until={B.diaibkan - 0.3} label={'Tengah ramai orang\n/ dalam majlis'} />
    <Compare
      at={B.diaibkan - 0.05}
      until={B.p3 - 0.15}
      arrow
      left={{ title: 'NIAT', good: true, items: [{ text: 'Bergurau', at: B.diaibkan - 0.05 }] }}
      right={{ title: 'KESAN', items: [{ text: 'Rasa diaibkan', at: B.diaibkan }, { text: 'Dimalukan di khalayak', at: B.dimalukan }] }}
    />

    {/* 03 — SINDIRAN */}
    <NumberBadge n="03" caption="SINDIRAN" at={B.p3} until={B.recap - 0.1} y={LY} />
    <Chip text="TENGOK KEADAAN" icon="none" at={B.p3 + 1.6} until={B.recap - 0.1} />

    {/* REKAP — animated numbered list */}
    <Label text="ELAKKAN 3 PERKARA INI" at={B.recap + 0.05} until={B.brollSosial[0] - 0.1} y={175} size={40} />
    <RecapList at={B.recap + 0.1} until={B.brollSosial[0] - 0.1} items={['SAPAAN TAK CANTIK', 'GURAU TAK KENA TEMPAT', 'SINDIRAN']} />
    <Chip text="BILA JUMPA KAWAN LAMA" at={B.recap + 2.3} until={B.brollSosial[0] - 0.1} />

    {/* KLIMAKS — minimum MG, beri ruang emosi */}
    <Burst at={B.jagaKomunikasi} x={540} y={330} seed="komunikasi" spread={480} />

    {/* PENUTUP */}
    <HeartPulse at={B.ukhuwah + 0.1} until={B.cta - 0.1} x={540} y={LY - 10} size={80} />
    <Burst at={B.ukhuwah} x={540} y={CY} seed="ukhuwah" spread={520} count={44} />
    <ProgressChips at={B.ukhuwah + 1.5} until={B.cta - 0.1} items={[{ text: 'LEBIH BAIK', at: B.ukhuwah + 2.2 }, { text: 'LEBIH LANCAR', at: B.lancar - 0.1 }]} />

    {/* CTA */}
    <Text3D text="SETIAP NASIHAT" at={B.cta + 0.35} x={540} y={600} size={128} fill="cream" depth={12} reveal="letters" />
    <Text3D text="ADA MAKNA." at={B.cta + 0.85} x={540} y={760} size={175} depth={18} reveal="letters" />
    <Burst at={B.cta + 1.0} x={540} y={700} seed="cta" spread={520} count={44} />
  </>
);

const BrollWrap: React.FC<{ range: number[]; children: (a: number, b: number) => React.ReactNode }> = ({ range, children }) => {
  const t = useTime();
  const [a, b] = range;
  if (t < a - 0.05 || t > b + 0.4) return null;
  const o = Math.min(tw(t, [a, a + 0.5], [0, 1], ease), tw(t, [b - 0.15, b + 0.35], [1, 0], ease));
  return <AbsoluteFill style={{ opacity: o }}>{children(a, b + 0.4)}</AbsoluteFill>;
};

export const NakSeeHeartVideo: React.FC = () => {
  const t = useTime();
  const pulse = (c: number, w = 0.6) => Math.max(0, 1 - Math.abs(t - c) / w);
  const leak =
    tw(t, [0, 0.3, 1.4], [0.8, 0.5, 0.12]) +
    0.6 * pulse(B.brollSosial[0] + 0.25, 0.6) +
    0.6 * pulse(B.brollKawan[0], 0.6) +
    0.6 * pulse(B.climax[0] + 0.1) +
    0.5 * pulse(B.finale[0]) +
    tw(t, [B.cta, B.cta + 1.2], [0, 0.55], easeOut);
  // motion graphics utama aktif -> subtitle lebih tenang
  const mgOn =
    (t >= B.salam && t < B.p1End) || (t >= B.suasana - 0.5 && t < B.p3) || (t >= B.recap && t < B.brollSosial[0]) ? 1 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0b0d' }}>
      <SpeakerStage ceiling={<CeilingText />} />

      <BrollWrap range={B.brollSosial}>
        {(a, b) => (
          <>
            <SocialBroll from={a} to={b} />
            <Label text="HANYA BERBICARA DI" at={a + 0.3} until={B.brollSosial[1] - 0.1} y={230} size={40} />
            <Text3D text="MEDIA SOSIAL" at={a + 0.6} until={B.brollSosial[1] - 0.1} x={540} y={370} size={150} depth={18} rotX={8} />
          </>
        )}
      </BrollWrap>
      <BrollWrap range={B.brollKawan}>
        {(a, b) => (
          <>
            <FriendsBroll from={a} to={b} />
            <Label text="BILA JUMPA" at={a + 0.2} until={B.brollKawan[1] - 0.1} y={260} size={44} />
            <Text3D text="KAWAN LAMA" at={a + 0.4} until={B.brollKawan[1] - 0.1} x={540} y={420} size={190} depth={20} rotX={8} />
          </>
        )}
      </BrollWrap>

      <Grade amount={0.85} />
      <Dust count={24} opacity={t >= B.cta ? 0.9 : 0.35} seed="global" />
      <Front />
      <LightLeak strength={Math.min(1, leak)} drift={(t % 12) / 12} />
      <Vignette strength={t >= B.climax[0] && t < B.finale[0] ? 0.68 : 0.52} />
      <Flash at={B.flashToBody} t={t} dur={0.45} />
      <Flash at={B.finale[0]} t={t} dur={0.4} peak={0.3} />
      <Subtitles y={1478} calm={mgOn} />
      <CtaHeadings />
      <LowerThird />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: tw(t, [B.end - 0.6, B.end], [0, 1]) }} />
      <Audio src={staticFile('audio/mix.wav')} />
    </AbsoluteFill>
  );
};
