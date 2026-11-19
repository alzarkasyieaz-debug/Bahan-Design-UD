import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';
import { FPS, Shot } from '../data/script';

const XF = 12; // cross-dissolve 0.4 s — lembut, gaya dokumentari

/**
 * Gred warna mengikut arka emosi: warm=0 → biru-kelabu, pudar (dokumentari dingin);
 * warm=1 → sorotan keemasan (harapan). Hanya tona — keadaan sebenar adegan dikekalkan.
 */
const Grade: React.FC<{ warm: number }> = ({ warm }) => (
  <>
    <AbsoluteFill style={{ background: 'rgb(52,78,104)', mixBlendMode: 'soft-light', opacity: (1 - warm) * 0.55 }} />
    <AbsoluteFill style={{ background: 'rgb(40,58,78)', mixBlendMode: 'color', opacity: (1 - warm) * 0.12 }} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 30%, rgb(255,196,110), rgb(214,130,50))', mixBlendMode: 'soft-light', opacity: warm * 0.42 }} />
  </>
);

const ShotView: React.FC<{ shot: Shot; lead: number; volMul: (absSec: number) => number }> = ({ shot, lead, volMul }) => {
  const frame = useCurrentFrame();
  const total = Math.round(shot.dur * FPS) + lead;
  const rate = shot.rate ?? 1;
  const p = frame / total;
  const scale = interpolate(p, [0, 1], shot.zoom, { easing: Easing.inOut(Easing.sin) });
  const opacity = lead ? interpolate(frame, [0, lead], [0, 1], { extrapolateRight: 'clamp' }) : 1;
  const sat = 0.7 + 0.36 * shot.warm;
  const bright = 0.9 + 0.08 * shot.warm;
  const trim = Math.max(0, Math.round(shot.from * FPS - lead * rate));
  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, filter: `saturate(${sat}) contrast(1.06) brightness(${bright})${shot.blur ? ` blur(${shot.blur}px)` : ''}` }}>
        <OffthreadVideo
          src={staticFile(`footage/${shot.src}.mp4`)}
          trimBefore={trim}
          playbackRate={rate}
          volume={(f) => {
            if (!shot.nat) return 0;
            const edge = interpolate(f, [0, lead + 6, total - 8, total], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return shot.nat * edge * volMul(shot.at - lead / FPS + f / FPS);
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>
      <Grade warm={shot.warm} />
      {shot.dim ? <AbsoluteFill style={{ background: 'black', opacity: shot.dim }} /> : null}
    </AbsoluteFill>
  );
};

/** Susun semua syot mengikut timeline dengan cross-dissolve. */
export const FootageTrack: React.FC<{ shots: Shot[]; volMul: (absSec: number) => number }> = ({ shots, volMul }) => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    {shots.map((s, i) => {
      const lead = i === 0 ? 0 : XF;
      const from = Math.round(s.at * FPS) - lead;
      const dur = Math.round(s.dur * FPS) + lead;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`Syot ${i + 1} — ${s.src}`}>
          <ShotView shot={s} lead={lead} volMul={volMul} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
