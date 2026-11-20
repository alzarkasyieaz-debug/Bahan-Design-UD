import React from 'react';
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { CLIPS, Clip, FPS, HANDLE, HOOK, LOCATION, LOWER_THIRD, SPEECH_OFFSET } from './data/timeline';
import { ease, Grain, LightLeak, SoftGlow, TextScrim, Vignette } from './components/Looks';
import { DoaQuote, HookTitle, KeyPhrases, LocationTag, LowerThird, Subtitles } from './components/Typography';
import { Tagline } from './components/Tagline';

// Tempoh cross-dissolve (frame) bagi klip yang masuk
const DISSOLVE: Record<string, number> = { A2: 16, J1: 18, J2: 18, J3: 18, K: 14, L: 22 };

const ClipLayer: React.FC<{ c: Clip; index: number }> = ({ c, index }) => {
  const f = useCurrentFrame(); // relatif kepada Sequence
  const { fps } = useVideoConfig();
  const len = (c.end - c.start) * fps;
  const d = index === 0 ? 1 : DISSOLVE[c.id] ?? 9;
  const opacity = interpolate(f, [0, d], [0, 1], { extrapolateRight: 'clamp' });
  const isMaster = c.src === 'master';
  const p = Math.min(1, f / len);

  let scale: number;
  let origin = '50% 50%';
  if (isMaster) {
    const [z0, z1] = c.zoom ?? [1, 1.06];
    scale = z0 + (z1 - z0) * ease(p);
    if (c.punch) {
      const [pt, ps] = c.punch;
      const k = interpolate(f / fps + c.start, [pt, pt + 0.35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
      scale = scale + (ps - scale) * k;
    }
    origin = '50% 27%'; // wajah YB
  } else {
    // Gentle push-in / pull-out berselang-seli
    const push = index % 3 !== 2;
    scale = push ? 1.0 + 0.07 * p : 1.07 - 0.06 * p;
    origin = index % 2 ? '45% 45%' : '55% 50%';
  }
  // Motion-blur lembut semasa klip masuk
  const mb = interpolate(f, [0, Math.max(d, 8)], [5, 0], { extrapolateRight: 'clamp' });
  const startFrom = isMaster ? Math.round((c.start - SPEECH_OFFSET) * FPS) : 0;
  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ transform: `scale(${scale + mb * 0.006})`, transformOrigin: origin, filter: mb > 0.05 ? `blur(${mb}px)` : undefined }}>
        <OffthreadVideo
          src={staticFile(`clips/${isMaster ? 'master' : c.id}.mp4`)}
          startFrom={startFrom}
          muted
          style={{ width: 1080, height: 1920, objectFit: 'cover' }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LawatanPPS: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const fadeIn = interpolate(t, [0, 0.9], [1, 0], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(t, [118.4, 119.9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const closingDark = interpolate(t, [109.2, 111.0], [0, 0.58], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hookDark = interpolate(t, [0, 6.2, 6.8], [0.28, 0.28, 0], { extrapolateRight: 'clamp' });
  const montageGlow = interpolate(t, [97, 98.5, 106.5, 107.2, 108.4, 110, 120], [0, 0.55, 0.55, 0, 0, 0.6, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const showSubs = t < 107.6;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {CLIPS.map((c, i) => {
        const from = Math.round(c.start * FPS);
        const dur = Math.round((c.end - c.start + (c.last ? 0 : HANDLE)) * FPS);
        return (
          <Sequence key={c.id} from={from} durationInFrames={dur} name={`${c.id} ${c.note ?? ''}`}>
            <ClipLayer c={c} index={i} />
          </Sequence>
        );
      })}

      {/* Rupa sinematik */}
      <SoftGlow opacity={montageGlow} />
      <LightLeak from={0} to={6.6 * FPS} peak={0.28} seed="hook" />
      <LightLeak from={97.5 * FPS} to={107.2 * FPS} peak={0.3} seed="montaj" />
      <LightLeak from={108.6 * FPS} to={120 * FPS} peak={0.32} seed="tutup" />
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${hookDark + closingDark})` }} />
      <TextScrim top={0.32} bottom={0.5} />
      <Vignette strength={0.5} />
      <Grain opacity={0.06} />

      {/* Grafik */}
      <HookTitle from={HOOK.a[0]} to={HOOK.a[1]} lines={['DI SAAT', 'RAKYAT DIUJI...']} />
      <HookTitle from={HOOK.b[0]} to={HOOK.b[1]} lines={['KEPRIHATINAN', 'TERUS DIBERI.']} gold />
      <LowerThird from={LOWER_THIRD[0]} to={LOWER_THIRD[1]} />
      <LocationTag from={LOCATION[0]} to={LOCATION[1]} />
      <KeyPhrases />
      <DoaQuote />
      <Subtitles hide={!showSubs} />
      <Tagline />

      <AbsoluteFill style={{ backgroundColor: '#000', opacity: Math.max(fadeIn, fadeOut) }} />
      <Audio src={staticFile('audio/mix.wav')} />
    </AbsoluteFill>
  );
};
