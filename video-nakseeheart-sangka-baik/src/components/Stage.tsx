import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { B, TL, f, tw, ease, easeOut, useTime } from '../lib';

/**
 * Pergerakan kamera maya untuk rakaman selfie dalam kereta.
 * Wajah penceramah di tengah (x 540, y ~1150 dalam bingkai sumber).
 * Asas: zum 1.12x berlabuh di bawah, jadi wajah naik dan ruang siling kereta dipakai untuk teks 3D.
 * Pulangkan transform piksel (s, tx, ty) yang sentiasa menutup penuh bingkai 1080x1920.
 */
const FACE = { x: 540, y: 1150 };
export const useCamera = () => {
  const t = useTime();
  let s = 1.12;
  let focus = false; // true = pusatkan wajah pada y=1000 skrin
  if (t < B.flashToBody) {
    s = tw(t, [0, 0.45], [1.5, 1.3], easeOut) + tw(t, [0.45, B.flashToBody], [0, 0.1], ease);
    focus = true;
  } else if (t < B.climax[0]) {
    s = tw(t, [B.flashToBody, B.flashToBody + 0.4], [1.2, 1.12], easeOut) + tw(t, [B.flashToBody, B.climax[0]], [0, 0.06]);
    // punch-in lembut pada kata kunci
    for (const k of [B.ukhuwah, B.persahabatan, B.persaudaraan, B.pertama, B.selidik, B.kedua, B.sah, B.fitnah, B.jagaHati]) {
      s += tw(t, [k - 0.05, k + 0.12], [0, 0.035], easeOut) * tw(t, [k + 0.12, k + 1.0], [1, 0]);
    }
  } else if (t < B.finale[0]) {
    s = tw(t, [B.climax[0], B.climax[1]], [1.3, 1.48]);
    focus = true;
  } else if (t < B.cta) {
    s = tw(t, [B.finale[0], B.finale[0] + 0.8], [1.3, 1.12], easeOut) + tw(t, [B.finale[0] + 0.8, B.cta], [0, 0.04]);
  } else {
    s = tw(t, [B.cta, B.end], [1.16, 1.24]);
  }
  const W = 1080, H = 1920;
  let tx = W / 2 - (W / 2) * s;
  let ty = focus ? 1000 - FACE.y * s : H - H * s;
  ty = Math.min(0, Math.max(H - H * s, ty));
  tx = Math.min(0, Math.max(W - W * s, tx));
  const dx = Math.sin(t * 0.7) * 3 + Math.sin(t * 1.9) * 1.2;
  const dy = Math.cos(t * 0.5) * 3 + Math.sin(t * 1.3) * 1.0;
  return { s, tx: tx + dx, ty: ty + dy };
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
  const { s, tx, ty } = useCamera();
  // Kabur latar (depth-of-field) — kuat semasa hook & CTA
  const bgBlur = t < B.flashToBody ? 7 : t >= B.cta ? tw(t, [B.cta, B.cta + 0.8], [2, 16]) : 2.2;
  const fgBlur = t >= B.cta ? tw(t, [B.cta, B.cta + 0.8], [0, 12]) : 0;
  const bgDark = t >= B.cta ? 0.42 : 0.55;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#0d0d0f' }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: '0 0' }}>
        {/* Latar: dinding digelapkan & dihangatkan supaya teks emas menonjol */}
        <SourceClips
          src="media/speaker.mp4"
          style={{ filter: `brightness(${bgDark}) contrast(1.08) saturate(0.8) sepia(0.32) blur(${bgBlur}px)` }}
        />
        {/* Cahaya hangat di belakang kepala + bayang teal di tepi */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 55% 26% at 50% 30%, rgba(255,196,120,0.30), rgba(255,196,120,0) 70%), radial-gradient(ellipse 90% 70% at 50% 40%, rgba(0,0,0,0) 50%, rgba(18,40,44,0.55) 100%)',
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
