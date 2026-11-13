import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { B, TL, f, tw, ease, easeOut, useTime } from '../lib';

/**
 * TEKNIK KOMPOSIT (V2 §4B / STEP 5): TANPA CUT-OUT.
 * Latar ialah siling kereta kelabu muda, manakala penceramah berkopiah & berbaju putih (kontras rendah),
 * dan tangan banyak bergerak di hadapan badan. Matte tidak akan kemas, jadi video asal dikekalkan
 * sepenuhnya. Teks 3D diletakkan pada ruang siling (atas kepala) dengan perspektif satah siling
 * dan parallax 2.5D (lapisan teks bergerak 75% daripada kamera), tanpa menutup wajah.
 *
 * Wajah: kopiah y≈476, cermin mata y≈770, mulut y≈980, janggut y≈1240 (bingkai sumber 1080x1920).
 */
const FACE = { x: 520, y: 820 };
const W = 1080;
const H = 1920;

type Cam = { s: number; tx: number; ty: number };

const place = (s: number, focusY: number | null): Cam => {
  // focusY: kedudukan skrin wajah; null = berlabuh di tengah atas (kekalkan ruang siling)
  let tx = W / 2 - FACE.x * s;
  let ty = focusY === null ? -(H * (s - 1)) * 0.25 : focusY - FACE.y * s;
  tx = Math.min(0, Math.max(W - W * s, tx));
  ty = Math.min(0, Math.max(H - H * s, ty));
  return { s, tx, ty };
};

export const useCamera = (): Cam => {
  const t = useTime();
  const body = TL.segments.filter((s) => s.id !== 'hook' && s.id !== 'cta');
  let cam: Cam;
  if (t < B.flashToBody) {
    const s = tw(t, [0, 0.45], [1.34, 1.18], easeOut) + tw(t, [0.45, B.flashToBody], [0, 0.08], ease);
    cam = place(s, 880);
  } else if (t < B.climax[0]) {
    // Jump cut antara klip: tukar tahap zum (punch-in/out) supaya potongan kelihatan sengaja
    const idx = body.findIndex((sg) => t >= sg.out[0] && t < sg.out[1]);
    const seg = body[Math.max(0, idx)];
    const base = idx % 2 === 0 ? 1.0 : 1.08;
    const drift = tw(t, [seg.out[0], seg.out[1]], [0, 0.035]);
    let s = base + drift + tw(t, [B.flashToBody, B.flashToBody + 0.4], [0.12, 0], easeOut);
    for (const k of [B.p1, B.p2, B.p3, B.diaibkan, B.sindiran]) {
      s += tw(t, [k - 0.05, k + 0.12], [0, 0.04], easeOut) * tw(t, [k + 0.12, k + 1.0], [1, 0]);
    }
    cam = place(s, idx % 2 === 0 ? null : 900);
  } else if (t < B.finale[0]) {
    cam = place(tw(t, [B.climax[0], B.climax[1]], [1.2, 1.3]), 880);
  } else if (t < B.cta) {
    cam = place(tw(t, [B.finale[0], B.finale[0] + 1.6], [1.22, 1.0], ease) + tw(t, [B.finale[0] + 1.6, B.cta], [0, 0.03]), null);
  } else {
    cam = place(tw(t, [B.cta, B.end], [1.06, 1.14]), 900);
  }
  // goyangan genggam yang sangat minimum
  cam.tx += Math.sin(t * 0.7) * 2.5 + Math.sin(t * 1.9) * 1;
  cam.ty += Math.cos(t * 0.5) * 2.5;
  return cam;
};

const SourceClips: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <>
    {TL.segments.map((seg) => {
      const from = f(seg.out[0]);
      const dur = f(seg.out[1]) - from;
      return (
        <Sequence key={seg.id} from={from} durationInFrames={dur} layout="none">
          <OffthreadVideo
            src={staticFile('media/speaker.mp4')}
            trimBefore={f(seg.src)}
            muted
            playbackRate={(seg as { rate?: number }).rate ?? 1}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }}
          />
        </Sequence>
      );
    })}
  </>
);

/** Lapisan siling: teks 3D dengan parallax 2.5D (k = 0.75 daripada pergerakan kamera) */
export const CeilingLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { s, tx, ty } = useCamera();
  const k = 0.75;
  const sp = 1 + (s - 1) * k;
  return (
    <AbsoluteFill style={{ transform: `translate(${tx * k}px, ${ty * k}px) scale(${sp})`, transformOrigin: '0 0', perspective: 1600 }}>
      {children}
    </AbsoluteFill>
  );
};

export const SpeakerStage: React.FC<{ ceiling?: React.ReactNode }> = ({ ceiling }) => {
  const t = useTime();
  const { s, tx, ty } = useCamera();
  const blur = t >= B.cta ? tw(t, [B.cta, B.cta + 0.8], [0, 16]) : t < B.flashToBody ? 0 : 0;
  const dark = t >= B.cta ? tw(t, [B.cta, B.cta + 0.8], [1, 0.5]) : 1;
  // background blur lembut semasa hook (fokus pada wajah): vignette kabur di tepi
  const hookBlur = t < B.flashToBody ? tw(t, [0, 0.5, B.flashToBody - 0.4, B.flashToBody], [1, 1, 1, 0]) : 0;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#0d0d0f' }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: '0 0' }}>
        <SourceClips style={{ filter: `contrast(1.06) saturate(0.95) brightness(${0.97 * dark}) sepia(0.08) blur(${blur}px)` }} />
      </AbsoluteFill>
      {hookBlur > 0 && (
        <AbsoluteFill
          style={{
            backdropFilter: 'blur(7px)',
            WebkitBackdropFilter: 'blur(7px)',
            maskImage: 'radial-gradient(ellipse 42% 30% at 50% 47%, transparent 55%, black 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 42% 30% at 50% 47%, transparent 55%, black 100%)',
            opacity: hookBlur,
          }}
        />
      )}
      {/* Pembauran latar: siling digelapkan & dihangatkan supaya teks 3D emas jelas */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(14,16,19,0.78) 0%, rgba(14,16,19,0.55) 14%, rgba(23,25,29,0.22) 24%, rgba(0,0,0,0) 30%)',
        }}
      />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 60% 14% at 50% 15%, rgba(216,180,106,0.18), rgba(216,180,106,0) 70%)' }} />
      {ceiling && <CeilingLayer>{ceiling}</CeilingLayer>}
    </AbsoluteFill>
  );
};
