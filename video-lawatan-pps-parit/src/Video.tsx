import React from 'react';
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Clip, FPS, HANDLE, makeTimeline, TimelineContext, useTimeline, VARIANTS } from './data/timeline';
import { ease, Grain, LightLeak, SoftGlow, TextScrim, Vignette } from './components/Looks';
import { DoaQuote, HookTitle, KeyPhrases, LocationTag, LowerThird, SabarHook, Subtitles } from './components/Typography';
import { Tagline } from './components/Tagline';

// Tempoh cross-dissolve (frame) bagi klip yang masuk
const DISSOLVE: Record<string, number> = { A2: 16, S1: 12, J1: 18, J2: 18, J3: 18, K: 14, L: 22 };

const ClipLayer: React.FC<{ c: Clip; index: number }> = ({ c, index }) => {
  const f = useCurrentFrame(); // relatif kepada Sequence
  const { fps } = useVideoConfig();
  const { speechOffset } = useTimeline();
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
  const mb = index === 0 ? 0 : interpolate(f, [0, Math.max(d, 8)], [5, 0], { extrapolateRight: 'clamp' });
  const startFrom = isMaster ? Math.round((c.start - speechOffset) * FPS) : 0;
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

const Body: React.FC = () => {
  const tl = useTimeline();
  const { g, clips } = tl;
  const f = useCurrentFrame();
  const t = f / FPS;
  const byId = (id: string) => clips.find((c) => c.id === id)!;
  const mont0 = byId('J1').start;
  const mont1 = byId('J3').end;
  const close0 = byId('L').start;
  const hookEnd = byId('B1').start;
  const fadeIn = interpolate(t, [0, 0.9], [1, 0], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(t, [118.4, 119.9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const closingDark = interpolate(t, [g.tagline.a - 0.8, g.tagline.a + 1.0], [0, 0.58], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hookDark = interpolate(t, [0, hookEnd - 0.3, hookEnd + 0.3], [0.28, 0.28, 0], { extrapolateRight: 'clamp' });
  const montageGlow = interpolate(
    t,
    [mont0 - 0.5, mont0 + 1, mont1 - 0.5, mont1 + 0.2, close0, close0 + 1.6, 120],
    [0, 0.55, 0.55, 0, 0, 0.6, 0.6],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {clips.map((c, i) => {
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
      <LightLeak from={0} to={(hookEnd + 0.1) * FPS} peak={0.28} seed="hook" />
      <LightLeak from={mont0 * FPS} to={(mont1 + 0.2) * FPS} peak={0.3} seed="montaj" />
      <LightLeak from={(close0 + 0.2) * FPS} to={120 * FPS} peak={0.32} seed="tutup" />
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${hookDark + closingDark})` }} />
      <TextScrim top={0.32} bottom={0.5} />
      <Vignette strength={0.5} />
      <Grain opacity={0.06} />

      {/* Grafik */}
      {g.hook === 'sabar' ? (
        <>
          <SabarHook from={g.sabar![0]} to={g.sabar![1]} />
          <HookTitle from={g.title![0]} to={g.title![1]} size={74} goldLines={[2, 3]} lines={['DI SAAT', 'RAKYAT DIUJI,', 'KEPRIHATINAN', 'TERUS DIBERI.']} />
        </>
      ) : (
        <>
          <HookTitle from={g.hookA![0]} to={g.hookA![1]} lines={['DI SAAT', 'RAKYAT DIUJI...']} />
          <HookTitle from={g.hookB![0]} to={g.hookB![1]} lines={['KEPRIHATINAN', 'TERUS DIBERI.']} gold />
        </>
      )}
      <LowerThird from={g.lowerThird[0]} to={g.lowerThird[1]} />
      <LocationTag from={g.location[0]} to={g.location[1]} />
      <KeyPhrases />
      <DoaQuote />
      <Subtitles hide={t > tl.subsUntil + 0.4} />
      <Tagline />

      <AbsoluteFill style={{ backgroundColor: '#000', opacity: Math.max(fadeIn, fadeOut) }} />
      <Audio src={staticFile(`audio/mix-${tl.edl.output}.wav`)} />
    </AbsoluteFill>
  );
};

export const LawatanPPS: React.FC<{ variant: string }> = ({ variant }) => {
  const tl = React.useMemo(() => makeTimeline(VARIANTS[variant] ?? VARIANTS.asal), [variant]);
  return (
    <TimelineContext.Provider value={tl}>
      <Body />
    </TimelineContext.Provider>
  );
};
