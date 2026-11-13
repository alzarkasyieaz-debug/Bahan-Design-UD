import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { B, SB, L, El, tv, tw, ease, easeOut, useTime } from './lib';
import { SpeakerStage } from './components/Stage';
import { Text3D, Label, NumberBadge, FloatQuote } from './components/Text3D';
import { Subtitles } from './components/Subtitles';
import { LowerThird, CtaHeadings } from './components/LowerThird';
import { FriendsBroll, SpiritualBroll } from './components/Broll';
import { Burst, Dust, Flash, Grade, Grain, LightLeak, Vignette } from './components/Effects';
import {
  Chip, Counter, Meter, Compare, Checklist, ChatBubble, Crowd, RecapList, ProgressChips, HeartPulse, SocialBroll,
} from './components/MotionGraphics';

/* =====================================================================
 * STYLE: QOUTE INTERAKTIF — komposisi generik.
 * Melukis setiap elemen dalam src/data/storyboard.json mengikut jenisnya.
 * Lapisan (bawah -> atas):
 *   video penceramah -> teks 3D siling (parallax) -> B-roll -> gred -> grafik hadapan
 *   -> light leak / vignette / kilat -> subtitle -> CTA -> lower third -> grain
 * ===================================================================== */

const cols = (c: { title: string; good?: boolean; items: { text: string; at: number | string }[] }) => ({
  ...c,
  items: c.items.map((i) => ({ text: i.text, at: tv(i.at) })),
});

/** Elemen yang hidup dalam ruang SKRIN (bukan siling) */
const Front: React.FC<{ e: El }> = ({ e }) => {
  switch (e.type) {
    case 'text3d':
      return (
        <Text3D text={e.text} at={tv(e.at)} until={e.until !== undefined ? tv(e.until) : undefined} x={e.x ?? 540} y={e.y} size={e.size}
          fill={e.fill} reveal={e.reveal} depth={e.depth} rotX={e.rotX} float={e.float} />
      );
    case 'label':
      return <Label text={e.text} at={tv(e.at)} until={tv(e.until)} y={e.y ?? L.labelY} size={e.size} color={e.color} />;
    case 'badge':
      return <NumberBadge n={e.n} caption={e.caption} at={tv(e.at)} until={tv(e.until)} y={L.labelY} />;
    case 'chip':
      return <Chip text={e.text} at={tv(e.at)} until={tv(e.until)} icon={e.icon} />;
    case 'counter':
      return <Counter count={e.count} label={e.label} at={tv(e.at)} until={tv(e.until)} />;
    case 'meter':
      return <Meter label={e.label} good={e.good} bad={e.bad} at={tv(e.at)} until={tv(e.until)} dropAt={tv(e.dropAt)} />;
    case 'compare':
      return <Compare at={tv(e.at)} until={tv(e.until)} arrow={e.arrow} left={cols(e.left)} right={cols(e.right)} />;
    case 'checklist':
      return <Checklist title={e.title} at={tv(e.at)} until={tv(e.until)} items={e.items.map((i) => ({ text: i.text, at: tv(i.at) }))} />;
    case 'chat':
      return <ChatBubble text={e.text} at={tv(e.at)} until={tv(e.until)} stampAt={tv(e.stampAt)} stamp={e.stamp} />;
    case 'crowd':
      return <Crowd label={e.label} at={tv(e.at)} until={tv(e.until)} />;
    case 'recap':
      return <RecapList at={tv(e.at)} until={tv(e.until)} items={e.items} />;
    case 'progress':
      return <ProgressChips at={tv(e.at)} until={tv(e.until)} items={e.items.map((i) => ({ text: i.text, at: tv(i.at) }))} />;
    case 'heart':
      return <HeartPulse at={tv(e.at)} until={tv(e.until)} x={e.x ?? 540} y={e.y ?? L.labelY - 10} size={e.size} />;
    case 'quote':
      return <FloatQuote text={e.text} at={tv(e.at)} until={tv(e.until)} y={e.y} size={e.size} />;
    case 'burst':
      return <Burst at={tv(e.at)} x={e.x ?? 540} y={e.y ?? L.ceilingY} seed={e.seed} spread={e.spread} count={e.count} />;
    default:
      return null;
  }
};

/** Teks 3D pada satah latar (siling) — dalam CeilingLayer, bergerak bersama kamera */
const Ceiling: React.FC = () => (
  <>
    {SB.elements.filter((e) => e.type === 'ceiling3d').map((e, i) =>
      e.type === 'ceiling3d' ? (
        <Text3D key={i} text={e.text} at={tv(e.at)} until={tv(e.until)} x={e.x ?? 540} y={L.ceilingY} size={e.size ?? 160}
          fill={e.fill} reveal={e.reveal} depth={e.depth ?? 16} rotX={L.ceilingTilt} float={e.reveal !== 'punch'} />
      ) : null,
    )}
  </>
);

const Broll: React.FC<{ e: Extract<El, { type: 'broll' }> }> = ({ e }) => {
  const t = useTime();
  const a = tv(e.from);
  const b = tv(e.to);
  if (t < a - 0.05 || t > b + 0.4) return null;
  const o = Math.min(tw(t, [a, a + 0.5], [0, 1], ease), tw(t, [b - 0.15, b + 0.35], [1, 0], ease));
  const Scene = e.kind === 'social' ? SocialBroll : e.kind === 'friends' ? FriendsBroll : SpiritualBroll;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Scene from={a} to={b + 0.4} />
      {e.children.map((c, i) => <Front key={i} e={c} />)}
    </AbsoluteFill>
  );
};

const BROLLS = SB.elements.filter((e): e is Extract<El, { type: 'broll' }> => e.type === 'broll');
const CALM = SB.subtitleCalm.map(([a, b]) => [tv(a), tv(b)] as const);

export const NakSeeHeartVideo: React.FC = () => {
  const t = useTime();
  const pulse = (c: number, w = 0.6) => Math.max(0, 1 - Math.abs(t - c) / w);
  // Light leak automatik: pembukaan, setiap B-roll, klimaks, penutup, CTA
  const leak =
    tw(t, [0, 0.3, 1.4], [0.8, 0.5, 0.12]) +
    BROLLS.reduce((acc, e) => acc + 0.6 * pulse(tv(e.from) + 0.25, 0.6), 0) +
    0.6 * pulse(B.climax[0] + 0.1) +
    0.5 * pulse(B.finale[0]) +
    tw(t, [B.cta, B.cta + 1.2], [0, 0.55], easeOut);
  const calm = CALM.some(([a, b]) => t >= a && t < b) ? 1 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0b0d' }}>
      <SpeakerStage ceiling={<Ceiling />} />
      {BROLLS.map((e, i) => <Broll key={i} e={e} />)}
      <Grade amount={0.85} />
      <Dust count={24} opacity={t >= B.cta ? 0.9 : 0.35} seed="global" />
      {SB.elements.filter((e) => e.type !== 'ceiling3d' && e.type !== 'broll').map((e, i) => <Front key={i} e={e} />)}

      {/* CTA tetap gaya (V2 §12) */}
      <Text3D text="SETIAP NASIHAT" at={B.cta + 0.35} x={540} y={600} size={128} fill="cream" depth={12} reveal="letters" />
      <Text3D text="ADA MAKNA." at={B.cta + 0.85} x={540} y={760} size={175} depth={18} reveal="letters" />
      <Burst at={B.cta + 1.0} x={540} y={700} seed="cta" spread={520} count={44} />

      <LightLeak strength={Math.min(1, leak)} drift={(t % 12) / 12} />
      <Vignette strength={t >= B.climax[0] && t < B.finale[0] ? 0.68 : 0.52} />
      <Flash at={B.flashToBody} t={t} dur={0.45} />
      <Flash at={B.finale[0]} t={t} dur={0.4} peak={0.3} />
      <Subtitles y={L.subtitleY} calm={calm} />
      <CtaHeadings />
      <LowerThird />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: tw(t, [B.end - 0.6, B.end], [0, 1]) }} />
      <Audio src={staticFile('audio/mix.wav')} />
    </AbsoluteFill>
  );
};
