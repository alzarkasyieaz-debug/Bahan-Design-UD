import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { B, tw, ease, easeOut, useTime } from './lib';
import { SpeakerStage } from './components/Stage';
import { Text3D, Label, FloatQuote } from './components/Text3D';
import { Subtitles } from './components/Subtitles';
import { LowerThird, CtaHeadings } from './components/LowerThird';
import { SpiritualBroll } from './components/Broll';
import { Burst, Dust, Flash, Grade, Grain, LightLeak, Vignette } from './components/Effects';

/* ---------------------------------------------------------------------------
 * Teks 3D DI BELAKANG penceramah (ruang kamera — bergerak bersama punch-in/zoom)
 * ------------------------------------------------------------------------- */
const BehindSubject: React.FC = () => (
  <>
    {/* 01 — BAHAGIA: semua orang mahukan bahagia */}
    <Text3D text="BAHAGIA" at={B.bahagiaWord[0]} until={B.bahagiaWord[1]} x={545} y={735} size={330} depth={18} rotX={10} />

    {/* 02 — Tidak semestinya: DUIT / PANGKAT / HARTA / KERETA MEWAH */}
    <Text3D text="DUIT" at={B.duit} until={B.tidakSemestinya[1]} recedeAt={B.pangkat} x={290} y={560} size={200} reveal="punch" fill="cream" rotY={14} />
    <Text3D text="PANGKAT" at={B.pangkat} until={B.tidakSemestinya[1]} recedeAt={B.harta} x={790} y={450} size={170} reveal="punch" fill="cream" rotY={-14} />
    <Text3D text="HARTA" at={B.harta} until={B.tidakSemestinya[1]} recedeAt={B.keretaMewah} x={270} y={800} size={180} reveal="punch" fill="cream" rotY={16} />
    <Text3D text="KERETA MEWAH" at={B.keretaMewah} until={B.tidakSemestinya[1]} x={720} y={650} size={125} reveal="punch" fill="cream" rotY={-10} />

    {/* 03 — Kebahagiaan sebenar: MENTAATI PERINTAH ALLAH */}
    <Text3D text="MENTAATI" at={B.taatAllah - 0.08} until={26.75} x={540} y={540} size={190} fill="cream" depth={16} />
    <Text3D text="PERINTAH ALLAH" at={B.taatAllah + 0.5} until={26.75} x={545} y={745} size={170} depth={18} />

    {/* 06 — Penutup: CARI BAHAGIA, CIPTA BAHAGIA, DENGAN ALLAH */}
    <Text3D text="CARI BAHAGIA" at={B.cari} until={B.cta - 0.1} x={540} y={385} size={168} fill="cream" depth={14} rotX={12} />
    <Text3D text="CIPTA BAHAGIA" at={B.cipta} until={B.cta - 0.1} x={540} y={560} size={168} fill="cream" depth={14} rotX={10} />
    <Text3D text="DENGAN ALLAH" at={B.denganAllah} until={B.cta - 0.1} x={545} y={760} size={215} depth={20} rotX={8} />
  </>
);

/* ---------------------------------------------------------------------------
 * Teks hadapan (ruang skrin)
 * ------------------------------------------------------------------------- */
const FrontText: React.FC = () => (
  <>
    {/* HOOK */}
    <Label text="DI MANA" at={0.12} until={4.3} y={250} size={46} />
    <Text3D text="BAHAGIA SEBENAR?" at={0.3} until={4.3} x={540} y={400} size={150} reveal="punch" depth={16} float={false} />
    <Burst at={0.32} x={540} y={400} seed="hook" spread={460} />

    <Burst at={B.bahagiaWord[0] + 0.2} x={545} y={600} seed="bahagia" />
    <Label text="TIDAK SEMESTINYA" at={B.tidakSemestinya[0]} until={B.tidakSemestinya[1]} y={235} size={44} />
    <Label text="KEBAHAGIAAN SEBENAR" at={B.kebahagiaanSebenar[0]} until={26.75} y={255} size={44} />
    <Burst at={B.taatAllah + 0.5} x={545} y={745} seed="taat" />

    {/* KLIMAKS (close-up) */}
    <Label text="LEBIH MEMBAHAGIAKAN" at={B.lebihBahagia} until={B.finale[0] + 0.1} y={235} size={42} />
    <Text3D text="DI AKHIRAT" at={B.akhiratQuote} until={B.finale[0] + 0.15} x={540} y={400} size={180} reveal="punch" depth={18} float={false} />
    <Burst at={B.akhiratQuote} x={540} y={400} seed="akhirat" spread={500} />

    <Burst at={B.denganAllah} x={545} y={760} seed="allah" spread={520} count={48} />

    {/* CTA */}
    <Text3D text="SETIAP NASIHAT" at={B.cta + 0.35} x={540} y={600} size={128} fill="cream" depth={12} reveal="letters" />
    <Text3D text="ADA MAKNA." at={B.cta + 0.85} x={540} y={760} size={175} depth={18} reveal="letters" />
    <Burst at={B.cta + 1.0} x={540} y={700} seed="cta" spread={520} count={44} />
  </>
);

const BrollLayer: React.FC = () => {
  const t = useTime();
  const [a, b] = [B.brollIbadah[0] + 0.25, B.brollIbadah[1]];
  if (t < a - 0.05 || t > b + 0.4) return null;
  const o = Math.min(tw(t, [a, a + 0.6], [0, 1], ease), tw(t, [b - 0.2, b + 0.35], [1, 0], ease));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <SpiritualBroll from={a} to={b + 0.4} />
      <Text3D text="IBADAH" at={27.4} until={b - 0.1} x={540} y={430} size={240} depth={20} rotX={10} />
      <Burst at={27.45} x={540} y={430} seed="ibadah" />
      <FloatQuote text="dengan setenang-tenangnya" at={27.9} until={29.0} y={600} size={60} />
      <FloatQuote text="Itulah kebahagiaan yang sangat luar biasa." at={29.15} until={b - 0.1} y={620} size={58} />
    </AbsoluteFill>
  );
};

export const NakSeeHeartVideo: React.FC = () => {
  const t = useTime();
  const leak =
    tw(t, [0, 0.3, 1.4], [0.9, 0.6, 0.15]) +
    0.7 * Math.max(0, 1 - Math.abs(t - (B.brollIbadah[0] + 0.5)) / 0.7) +
    0.6 * Math.max(0, 1 - Math.abs(t - B.climax[0]) / 0.6) +
    0.6 * Math.max(0, 1 - Math.abs(t - B.finale[0]) / 0.6) +
    tw(t, [B.cta, B.cta + 1.2], [0, 0.55], easeOut);
  // Kecerahan subtitle diredam semasa CTA
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0b0d' }}>
      <SpeakerStage behind={<BehindSubject />} />
      <BrollLayer />
      <Grade />
      <Dust count={28} opacity={t >= B.cta ? 0.9 : 0.4} seed="global" />
      <FrontText />
      <LightLeak strength={Math.min(1, leak)} drift={(t % 12) / 12} />
      <Vignette strength={t >= B.climax[0] && t < B.finale[0] ? 0.72 : 0.6} />
      <Flash at={B.flashToBody} t={t} dur={0.45} />
      <Flash at={B.finale[0]} t={t} dur={0.4} peak={0.35} />
      <Subtitles />
      <CtaHeadings />
      <LowerThird />
      <Grain opacity={0.06} />
      {/* fade ke hitam pada akhir */}
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: tw(t, [B.end - 0.6, B.end], [0, 1]) }} />
      <Audio src={staticFile('audio/mix.wav')} />
    </AbsoluteFill>
  );
};
