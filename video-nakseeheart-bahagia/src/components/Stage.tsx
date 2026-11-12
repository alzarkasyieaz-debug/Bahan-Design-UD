import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { B, TL, f, tw, ease, easeOut, useTime } from '../lib';

/**
 * Pergerakan kamera maya (saat output -> skala & titik asal).
 * Wajah penceramah berada sekitar (57%, 47%) bingkai.
 */
export const useCamera = () => {
  const t = useTime();
  let s = 1;
  let ox = 55;
  let oy = 46;
  if (t < B.flashToBody) {
    // HOOK: punch-in pantas, kemudian slow push-in ke wajah
    s = tw(t, [0, 0.45], [1.32, 1.12], easeOut) + tw(t, [0.45, 4.5], [0, 0.12], ease);
    oy = 44;
  } else if (t < B.brollIbadah[0]) {
    s = tw(t, [4.5, 4.9], [1.16, 1.0], easeOut) + tw(t, [4.9, 21.6], [0, 0.07]) + tw(t, [21.6, 26.4], [0, 0.1]);
    // punch-in lembut pada kata kunci
    for (const k of [B.duit, B.pangkat, B.harta, B.taatAllah]) {
      s += tw(t, [k - 0.05, k + 0.12], [0, 0.035], easeOut) * tw(t, [k + 0.12, k + 1.0], [1, 0]);
    }
  } else if (t < B.finale[0]) {
    // KLIMAKS: close-up perlahan pada wajah
    s = tw(t, [B.climax[0], B.climax[1]], [1.42, 1.62]);
    ox = 56;
    oy = 47;
  } else if (t < B.cta) {
    // FINALE: tarik keluar (pull-back) untuk tunjuk teks 3D besar
    s = tw(t, [B.finale[0], B.finale[0] + 0.8], [1.25, 1.02], easeOut) + tw(t, [B.finale[0] + 0.8, B.cta], [0, 0.05]);
  } else {
    s = tw(t, [B.cta, B.end], [1.08, 1.16]);
  }
  // goyangan genggam (handheld) yang sangat minimum
  const dx = Math.sin(t * 0.7) * 3 + Math.sin(t * 1.9) * 1.2;
  const dy = Math.cos(t * 0.5) * 3 + Math.sin(t * 1.3) * 1.0;
  return { s, ox, oy, dx, dy };
};

/** Tiga keping video sumber yang dipetakan pada garis masa output. */
const SourceClips: React.FC<{ src: string; transparent?: boolean; style?: React.CSSProperties }> = ({ src, transparent, style }) => (
  <>
    {TL.segments.map((seg) => {
      const from = f(seg.out[0]);
      const dur = f(seg.out[1]) - from;
      const isCta = seg.id === 'cta';
      return (
        <Sequence key={seg.id} from={from} durationInFrames={dur} layout="none">
          <OffthreadVideo
            src={staticFile(src)}
            trimBefore={f(seg.src)}
            muted
            transparent={transparent}
            playbackRate={isCta ? 0.15 : 1}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }}
          />
        </Sequence>
      );
    })}
  </>
);

export const SpeakerStage: React.FC<{ behind?: React.ReactNode; front?: React.ReactNode }> = ({ behind, front }) => {
  const t = useTime();
  const { s, ox, oy, dx, dy } = useCamera();
  // Kabur latar (depth-of-field) — kuat semasa hook & CTA
  const bgBlur = t < B.flashToBody ? 7 : t >= B.cta ? tw(t, [B.cta, B.cta + 0.8], [2, 16]) : 2.2;
  const fgBlur = t >= B.cta ? tw(t, [B.cta, B.cta + 0.8], [0, 12]) : 0;
  const bgDark = t >= B.cta ? 0.42 : 0.6;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#0d0d0f' }}>
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, transformOrigin: `${ox}% ${oy}%` }}>
        {/* Latar: dinding digelapkan & dihangatkan supaya teks emas menonjol */}
        <SourceClips
          src="media/speaker.mp4"
          style={{ filter: `brightness(${bgDark}) contrast(1.08) saturate(0.8) sepia(0.32) blur(${bgBlur}px)` }}
        />
        {/* Cahaya hangat di belakang kepala + bayang teal di tepi */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 48% 30% at 56% 34%, rgba(255,196,120,0.30), rgba(255,196,120,0) 70%), radial-gradient(ellipse 90% 70% at 50% 40%, rgba(0,0,0,0) 50%, rgba(18,40,44,0.55) 100%)',
          }}
        />
        {behind}
        {/* Subjek (cut-out) — warna kulit semula jadi */}
        <SourceClips
          src="media/speaker_fg.webm"
          transparent
          style={{ filter: `contrast(1.06) saturate(1.04) brightness(1.0) blur(${fgBlur}px)` }}
        />
        {front}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
