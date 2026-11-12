import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { B, tw, ease, easeOut, useTime } from './lib';
import { SpeakerStage } from './components/Stage';
import { Text3D, Label, FloatQuote, NumberBadge } from './components/Text3D';
import { Subtitles } from './components/Subtitles';
import { LowerThird, CtaHeadings } from './components/LowerThird';
import { FriendsBroll, SpiritualBroll } from './components/Broll';
import { Burst, Dust, Flash, Grade, Grain, LightLeak, Vignette } from './components/Effects';

/*
 * Koordinat teks "di belakang subjek" ialah koordinat BINGKAI SUMBER (ia bergerak bersama kamera).
 * Bagi kamera asas (1.12x berlabuh di bawah): skrin_y ≈ 1.12·y − 230. Puncak songkok ≈ y 700.
 * Baris atas y≈540, baris bawah y≈690 (bahagian bawahnya ditutup songkok).
 */
const R1 = 540;
const R2 = 690;
const MID = 650; // satu baris tunggal

const BehindSubject: React.FC = () => (
  <>
    {/* 01 — Jangan bersangka buruk: merosakkan ukhuwah, persahabatan, persaudaraan */}
    <Text3D text="SANGKA BURUK" at={B.sangkaBuruk[0]} until={B.sangkaBuruk[1]} recedeAt={B.ukhuwah} x={540} y={R2} size={160} fill="red" depth={16} />
    <Text3D text="UKHUWAH" at={B.ukhuwah} until={B.persahabatan - 0.05} x={540} y={R1} size={150} reveal="punch" fill="cream" />
    <Text3D text="PERSAHABATAN" at={B.persahabatan} until={B.persaudaraan - 0.05} x={540} y={R1} size={130} reveal="punch" fill="cream" />
    <Text3D text="PERSAUDARAAN" at={B.persaudaraan} until={B.sangkaBuruk[1]} x={540} y={R1} size={130} reveal="punch" fill="cream" />

    {/* 02 — Lazimkan bersangka baik */}
    <Text3D text="SANGKA BAIK" at={B.sangkaBaik[0]} until={B.sangkaBaik[1] + 0.3} x={540} y={MID} size={200} depth={18} />

    {/* 03 — Kebaikan untuk kita & sekeliling */}
    <Text3D text="KEBAIKAN" at={B.kebaikanWord} until={B.kebaikan[1]} x={540} y={MID} size={210} depth={18} />

    {/* 04 — Cara pertama: selidik, tanya dahulu */}
    <Text3D text="SELIDIK DAHULU" at={B.selidik} until={B.caraPertama[1]} x={540} y={R1} size={140} depth={16} />
    <Text3D text="TANYA DAHULU" at={B.tanya} until={B.caraPertama[1]} x={540} y={R2} size={145} fill="cream" depth={16} />

    {/* 05 — Cara kedua: pastikan maklumat sah */}
    <Text3D text="PASTIKAN" at={B.pastikan} until={B.caraKedua[1]} x={540} y={R1} size={150} fill="cream" depth={16} />
    <Text3D text="MAKLUMAT SAH" at={B.sah - 0.05} until={B.caraKedua[1]} x={540} y={R2} size={155} depth={18} />

    {/* 06 — Jangan sebarkan: tidak betul, tidak pasti, FITNAH */}
    <Text3D text="TIDAK BETUL" at={B.tidakBetul} until={B.fitnah - 0.1} recedeAt={B.tidakPasti} x={540} y={R1} size={140} reveal="punch" fill="cream" />
    <Text3D text="TIDAK PASTI" at={B.tidakPasti} until={B.fitnah - 0.1} x={540} y={R2} size={150} reveal="punch" fill="cream" />
    <Text3D text="FITNAH" at={B.fitnah} until={B.janganSebar[1]} x={540} y={MID} size={260} reveal="punch" fill="red" depth={22} />

    {/* 07 — Paling penting */}
    <Text3D text="SANGKA BAIK" at={B.palingPenting + 1.85} until={B.brollHati[0] + 0.3} x={540} y={MID} size={190} depth={18} />

    {/* 09 — Penutup: lazimkan bersangka baik */}
    <Text3D text="LAZIMKAN" at={B.lazimkan} until={B.cta - 0.1} x={540} y={R1} size={160} fill="cream" depth={16} rotX={12} />
    <Text3D text="BERSANGKA BAIK" at={B.bersangkaBaik} until={B.cta - 0.1} x={540} y={R2} size={150} depth={20} rotX={8} />
  </>
);

const LY = 150; // baris label atas (ruang skrin)

const FrontText: React.FC = () => (
  <>
    {/* HOOK */}
    <Label text="HATI-HATI DENGAN" at={0.12} until={B.flashToBody - 0.15} y={LY + 20} size={44} />
    <Text3D text="SANGKAAN KITA" at={0.3} until={B.flashToBody - 0.15} x={540} y={320} size={150} reveal="punch" depth={16} float={false} />
    <Burst at={0.32} x={540} y={320} seed="hook" spread={460} />

    <Label text="BOLEH MEROSAKKAN" at={B.merosakkan} until={B.sangkaBuruk[1]} y={LY} size={42} />
    <Label text="LAZIMKAN" at={B.sangkaBaik[0] - 1.4} until={B.sangkaBaik[1] + 0.3} y={LY} size={46} />
    <Burst at={B.sangkaBaik[0] + 0.3} x={540} y={460} seed="baik" />
    <Label text="UNTUK KITA & SEKELILING" at={B.sekeliling} until={B.kebaikan[1]} y={LY} size={40} />
    <Burst at={B.kebaikanWord + 0.2} x={540} y={460} seed="kebaikan" />

    <NumberBadge n="01" caption="CARA PERTAMA" at={B.pertama} until={B.caraPertama[1]} y={LY + 10} />
    <NumberBadge n="02" caption="CARA KEDUA" at={B.kedua} until={B.caraKedua[1]} y={LY + 10} />
    <Burst at={B.sah + 0.1} x={540} y={490} seed="sah" />

    <Label text="JANGAN SEBARKAN" at={B.janganSebar[0]} until={B.janganSebar[1]} y={LY} size={44} color="#FFD2C4" />
    <Label text="PALING PENTING" at={B.palingPenting} until={B.brollHati[0] + 0.3} y={LY} size={46} />

    {/* KLIMAKS (close-up) */}
    <Label text="HADIS QUDSI" at={B.hadisLabel} until={B.apaSangka - 0.2} y={LY} size={44} />
    <FloatQuote text={'“Aku bersama dengan sangkaan hamba-hamba-Ku.”'} at={B.hadisQuote} until={B.apaSangka - 0.2} y={290} size={54} />
    <Burst at={B.hadisQuote} x={540} y={290} seed="hadis" spread={480} />
    <Text3D text="APA YANG KITA SANGKA" at={B.apaSangka} until={B.finale[0] + 0.1} x={540} y={170} size={100} fill="cream" depth={12} float={false} />
    <Text3D text="ITULAH YANG KITA DAPAT" at={B.itulahDapat} until={B.finale[0] + 0.1} x={540} y={300} size={108} reveal="punch" depth={14} float={false} />
    <Burst at={B.itulahDapat} x={540} y={300} seed="dapat" spread={500} />

    <Burst at={B.insyaAllah} x={540} y={490} seed="insya" spread={520} count={48} />

    {/* CTA */}
    <Text3D text="SETIAP NASIHAT" at={B.cta + 0.35} x={540} y={600} size={128} fill="cream" depth={12} reveal="letters" />
    <Text3D text="ADA MAKNA." at={B.cta + 0.85} x={540} y={760} size={175} depth={18} reveal="letters" />
    <Burst at={B.cta + 1.0} x={540} y={700} seed="cta" spread={520} count={44} />
  </>
);

const Broll: React.FC<{ range: number[]; children: (from: number, to: number) => React.ReactNode }> = ({ range, children }) => {
  const t = useTime();
  const [a, b] = range;
  if (t < a - 0.05 || t > b + 0.4) return null;
  const o = Math.min(tw(t, [a, a + 0.6], [0, 1], ease), tw(t, [b - 0.2, b + 0.35], [1, 0], ease));
  return <AbsoluteFill style={{ opacity: o }}>{children(a, b + 0.4)}</AbsoluteFill>;
};

export const NakSeeHeartVideo: React.FC = () => {
  const t = useTime();
  const pulse = (c: number, w = 0.6) => Math.max(0, 1 - Math.abs(t - c) / w);
  const leak =
    tw(t, [0, 0.3, 1.4], [0.9, 0.6, 0.15]) +
    0.7 * pulse(B.brollFriends[0] + 0.3, 0.7) +
    0.5 * pulse(B.brollFriends[1], 0.6) +
    0.7 * pulse(B.brollHati[0] + 0.3, 0.7) +
    0.6 * pulse(B.climax[0]) +
    0.6 * pulse(B.finale[0]) +
    tw(t, [B.cta, B.cta + 1.2], [0, 0.55], easeOut);
  // bayang merah halus ketika "FITNAH"
  const fitnahTint = tw(t, [B.fitnah - 0.05, B.fitnah + 0.3], [0, 1], easeOut) * tw(t, [B.janganSebar[1] - 0.6, B.janganSebar[1]], [1, 0]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0b0d' }}>
      <SpeakerStage behind={<BehindSubject />} />

      <Broll range={B.brollFriends}>
        {(a, b) => (
          <>
            <FriendsBroll from={a} to={b} />
            <Text3D text="HARMONI" at={B.harmoni} until={B.tidakRugi - 0.1} x={540} y={420} size={230} depth={20} rotX={10} />
            <Burst at={B.harmoni + 0.05} x={540} y={420} seed="harmoni" />
            <FloatQuote text="mengharmonikan hubungan" at={B.harmoni + 0.4} until={B.segarkanUkhuwah - 0.1} y={600} size={58} />
            <FloatQuote text="menyegarkan ukhuwah" at={B.segarkanUkhuwah} until={B.tidakRugi - 0.1} y={600} size={58} />
            <Text3D text="TIDAK AKAN RUGI" at={B.tidakRugi} until={B.brollFriends[1] - 0.1} x={540} y={430} size={135} depth={16} reveal="punch" />
          </>
        )}
      </Broll>

      <Broll range={B.brollHati}>
        {(a, b) => (
          <>
            <SpiritualBroll from={a} to={b} />
            <Label text="ALLAH TA'ALA AKAN" at={B.brollHati[0] + 0.3} until={B.brollHati[1] - 0.1} y={270} size={44} />
            <Text3D text="JAGA HATI KITA" at={B.jagaHati} until={B.brollHati[1] - 0.1} x={540} y={440} size={165} depth={18} rotX={10} />
            <Burst at={B.jagaHati + 0.05} x={540} y={440} seed="hati" />
            <FloatQuote text="daripada perkara-perkara yang tidak diingini berlaku." at={B.tidakDiingini + 0.2} until={B.brollHati[1] - 0.1} y={640} size={52} />
          </>
        )}
      </Broll>

      <Grade />
      <Dust count={28} opacity={t >= B.cta ? 0.9 : 0.4} seed="global" />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 40%, rgba(90,14,8,0.55) 100%)', opacity: fitnahTint * 0.8 }} />
      <FrontText />
      <LightLeak strength={Math.min(1, leak)} drift={(t % 12) / 12} />
      <Vignette strength={t >= B.climax[0] && t < B.finale[0] ? 0.72 : 0.6} />
      <Flash at={B.flashToBody} t={t} dur={0.45} />
      <Flash at={B.finale[0]} t={t} dur={0.4} peak={0.35} />
      <Subtitles />
      <CtaHeadings />
      <LowerThird />
      <Grain opacity={0.06} />
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: tw(t, [B.end - 0.6, B.end], [0, 1]) }} />
      <Audio src={staticFile('audio/mix.wav')} />
    </AbsoluteFill>
  );
};
