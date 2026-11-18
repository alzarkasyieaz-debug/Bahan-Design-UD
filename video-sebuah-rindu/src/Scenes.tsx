import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Scene, Shot } from './data';
import { GoldFrame, LightLeak, LightRays, Particles, PurpleBackdrop, Sweep } from './components/FX';
import { Frame, FullPhoto, Split, aspect } from './components/Photo';
import { Fade, LowerThird, Ornament, Title3D } from './components/Title';
import { C, F, H, SCENE, W, XF } from './theme';

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const SHOT_XF = 20;

/** Kira masa setiap shot dalam babak mengikut berat */
const shotTimes = (shots: Shot[], total: number) => {
  const sum = shots.reduce((a, s) => a + (s.weight ?? 1), 0);
  let t = 0;
  return shots.map((s) => {
    const len = Math.round((total * (s.weight ?? 1)) / sum);
    const r = { from: t, len };
    t += len;
    return r;
  });
};

const ShotView: React.FC<{ shot: Shot; dur: number; slow?: boolean }> = ({ shot, dur, slow }) =>
  shot.srcs.length > 1 ? (
    <Split srcs={shot.srcs} dur={dur} slow={slow} />
  ) : (
    <FullPhoto src={shot.srcs[0]} dur={dur} move={shot.move} focusY={shot.focusY} slow={slow} forceCover={shot.forceCover} />
  );

/** Urutan shot dengan soft dissolve + sapuan cahaya berselang-seli */
const ShotSequence: React.FC<{ shots: Shot[]; total: number; slow?: boolean }> = ({ shots, total, slow }) => {
  const f = useCurrentFrame();
  const times = shotTimes(shots, total);
  return (
    <AbsoluteFill>
      {shots.map((s, i) => {
        const { from, len } = times[i];
        const d = len + (i < shots.length - 1 ? SHOT_XF : 0);
        const fadeLen = slow ? SHOT_XF + 10 : SHOT_XF;
        const op = i === 0 ? 1 : interpolate(f - from, [0, fadeLen], [0, 1], clamp);
        return (
          <Sequence key={i} from={from} durationInFrames={d}>
            <AbsoluteFill style={{ opacity: op }}>
              <ShotView shot={s} dur={d} slow={slow} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      {times.slice(1).map(({ from }, i) =>
        i % 2 === 0 ? <Sweep key={i} t={interpolate(f, [from - 6, from + 30], [0, 1], clamp)} /> : null,
      )}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- 1. PEMBUKAAN */
export const Opening: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const total = SCENE + XF;
  const times = shotTimes(s.shots, total);
  const titleOut = times[1].from + 6;
  const black = interpolate(f, [0, 50], [1, 0], { ...clamp, easing: ease });
  const raysOn = interpolate(f, [20, 90, titleOut, titleOut + 30], [0, 1, 1, 0.35], clamp);
  return (
    <AbsoluteFill>
      <ShotSequence shots={s.shots} total={total} />
      <LightRays strength={raysOn} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(20,10,36,0.55), transparent 75%)', opacity: interpolate(f, [40, 90, titleOut - 10, titleOut + 20], [0, 1, 1, 0], clamp) }} />
      <Title3D text="SEBUAH RINDU…" size={128} top={378} delay={62} out={titleOut} spacing={0.12} depth={9} />
      <Ornament top={545} delay={100} out={titleOut} width={520} />
      <Fade text="Kenangan Indah Bersama di Tanah Suci" top={572} size={42} delay={112} out={titleOut} weight={300} spacing="0.08em" color={C.goldLight} />
      <Sequence from={times[1].from} durationInFrames={total - times[1].from}>
        <VoOnly text={s.vo} dur={total - times[1].from - XF} />
      </Sequence>
      <AbsoluteFill style={{ background: '#000', opacity: black }} />
    </AbsoluteFill>
  );
};

const VoOnly: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const bg = interpolate(f, [0, 30, dur - 20, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, opacity: bg, background: 'linear-gradient(180deg, transparent, rgba(20,10,36,0.85))' }} />
      <Fade text={text} top={930} size={34} italic delay={26} out={dur} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- BABAK FILEM */
export const FilmScene: React.FC<{ s: Scene }> = ({ s }) => (
  <AbsoluteFill>
    <ShotSequence shots={s.shots} total={SCENE + XF} slow={s.slow} />
    <LightLeak seed={s.title} strength={s.slow ? 0.7 : 1} />
    {s.goldFrame && <GoldFrame delay={10} />}
    {s.slow && <LightRays strength={0.45} />}
    <Particles seed={s.title} amount={s.slow ? 0.6 : 1} />
    <LowerThird title={s.title} vo={s.vo} dur={SCENE} />
  </AbsoluteFill>
);

/* ---------------------------------------------------------------- 5. KOLAJ TERAPUNG */
type Slot = { x: number; y: number; w: number; rot: number; z: number; t0: number };
export const CollageScene: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const p = s.shots[0].srcs;
  const A: Slot[] = [
    { x: 120, y: 170, w: 500, rot: -4, z: 0.6, t0: 10 },
    { x: 640, y: 90, w: 640, rot: 0, z: 1, t0: 0 },
    { x: 1300, y: 170, w: 500, rot: 4, z: 0.6, t0: 20 },
  ];
  const B: Slot[] = [
    { x: 110, y: 230, w: 470, rot: -3, z: 0.7, t0: 0 },
    { x: 640, y: 150, w: 300, rot: 2, z: 1, t0: 10 },
    { x: 990, y: 170, w: 300, rot: -2, z: 1, t0: 20 },
    { x: 1340, y: 240, w: 470, rot: 3, z: 0.7, t0: 30 },
  ];
  const phaseB = 250;
  const aOut = interpolate(f, [phaseB - 10, phaseB + 20], [1, 0], clamp);
  const dolly = 1 + interpolate(f, [0, SCENE], [0, 0.06], clamp);
  const drift = interpolate(f, [0, SCENE], [30, -30]);
  const card = (src: string, sl: Slot, base: number, key: string, alpha: number) => {
    const t = interpolate(f - base - sl.t0, [0, 36], [0, 1], { ...clamp, easing: ease });
    const bob = Math.sin((f + sl.t0 * 7) / 45) * 8 * sl.z;
    return (
      <Frame
        key={key}
        src={src}
        w={sl.w}
        zoom={1 + 0.04 * Math.sin(f / 90 + sl.t0)}
        style={{
          left: sl.x + drift * sl.z,
          top: sl.y + bob,
          opacity: t * alpha,
          transform: `translateY(${(1 - t) * 120}px) rotate(${sl.rot}deg) scale(${0.85 + 0.15 * t})`,
          zIndex: Math.round(sl.z * 10),
          filter: sl.z < 0.9 ? 'brightness(0.92)' : undefined,
        }}
      />
    );
  };
  return (
    <AbsoluteFill>
      <PurpleBackdrop blurSrc={p[0]} />
      <LightLeak seed="kolaj" />
      <AbsoluteFill style={{ transform: `scale(${dolly})` }}>
        {f < phaseB + 25 && A.map((sl, i) => card(p[[1, 0, 2][i]], sl, 0, 'a' + i, aOut))}
        {f > phaseB - 15 && B.map((sl, i) => card(p[3 + i], sl, phaseB - 10, 'b' + i, 1))}
      </AbsoluteFill>
      <Particles seed="kolaj" />
      <LowerThird title={s.title} vo={s.vo} dur={SCENE} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- 7. MOZEK */
export const MosaicScene: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const p = s.shots[0].srcs;
  const tw = 500;
  const th = 375;
  const gap = 26;
  const x0 = (W - (tw * 3 + gap * 2)) / 2;
  const y0 = 40;
  const focus = 1; // jubin yang dizum (p[1])
  const zStart = 300;
  const z = interpolate(f, [zStart, zStart + 60], [0, 1], { ...clamp, easing: ease });
  const fx = x0 + (focus % 3) * (tw + gap) + tw / 2;
  const fy = y0 + Math.floor(focus / 3) * (th + gap) + th / 2;
  const scale = 1 + z * (W / tw - 1);
  const tx = (W / 2 - fx) * z;
  const ty = (H / 2 - fy) * z;
  const fullOp = interpolate(f, [zStart + 56, zStart + 66], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <PurpleBackdrop />
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: `${fx}px ${fy}px` }}>
        {p.map((src, i) => {
          const t = interpolate(f - i * 16, [0, 34], [0, 1], { ...clamp, easing: ease });
          const others = i === focus ? 1 : 1 - z;
          return (
            <div
              key={src}
              style={{
                position: 'absolute',
                left: x0 + (i % 3) * (tw + gap),
                top: y0 + Math.floor(i / 3) * (th + gap),
                width: tw,
                height: th,
                opacity: t * others,
                transform: `perspective(900px) rotateY(${(1 - t) * (i % 2 ? -70 : 70)}deg) scale(${0.9 + 0.1 * t})`,
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                border: `2px solid ${C.gold}`,
                overflow: 'hidden',
              }}
            >
              <FullTile src={src} f={f} i={i} still={i === focus && z > 0} />
            </div>
          );
        })}
      </AbsoluteFill>
      {fullOp > 0 && (
        <Sequence from={zStart + 56}>
          <AbsoluteFill style={{ opacity: fullOp }}>
            <FullPhoto src={p[focus]} dur={SCENE - zStart} move="in" focusY={0.5} />
          </AbsoluteFill>
        </Sequence>
      )}
      <LightLeak seed="mozek" />
      <Particles seed="mozek" />
      <LowerThird title={s.title} vo={s.vo} dur={SCENE} />
    </AbsoluteFill>
  );
};

const FullTile: React.FC<{ src: string; f: number; i: number; still?: boolean }> = ({ src, f, i, still }) => (
  <Img
    src={staticFile(`img/${src}.jpg`)}
    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: still ? 'none' : `scale(${1.04 + 0.04 * Math.sin(f / 80 + i)})` }}
  />
);

/* ---------------------------------------------------------------- 9. DINDING KENANGAN 2.5D */
export const WallScene: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const p = s.shots[0].srcs;
  const slots = [
    { x: 150, y: 70, z: 0 },
    { x: 720, y: 50, z: -220 },
    { x: 1290, y: 80, z: 60 },
    { x: 300, y: 450, z: -140 },
    { x: 870, y: 430, z: 90 },
    { x: 1440, y: 460, z: -260 },
  ];
  const ry = interpolate(f, [0, SCENE], [10, -10]);
  const rx = interpolate(f, [0, SCENE], [4, -2]);
  const camZ = interpolate(f, [0, SCENE], [-80, 60]);
  return (
    <AbsoluteFill>
      <PurpleBackdrop blurSrc={p[1]} />
      <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: '50% 40%' }}>
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `translateZ(${camZ}px) rotateY(${ry}deg) rotateX(${rx}deg)` }}>
          {p.map((src, i) => {
            const sl = slots[i];
            const t = interpolate(f - 8 - i * 18, [0, 40], [0, 1], { ...clamp, easing: ease });
            return (
              <Frame
                key={src}
                src={src}
                w={460}
                style={{
                  left: sl.x,
                  top: sl.y + Math.sin(f / 50 + i) * 6,
                  opacity: t,
                  transform: `translateZ(${sl.z - (1 - t) * 300}px) rotate(${(i % 2 ? 1.5 : -1.5)}deg)`,
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>
      <LightLeak seed="dinding" strength={0.8} />
      <Particles seed="dinding" amount={1.4} drift={ry * 8} />
      <LowerThird title={s.title} vo={s.vo} dur={SCENE} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- 12. KEMUNCAK PENUTUP */
export const FinaleScene: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const mont = s.shots[0].srcs;
  const hero = s.shots[1].srcs[0];
  const per = 20;
  const mEnd = mont.length * per;
  const heroIn = interpolate(f, [mEnd - 10, mEnd + 40], [0, 1], { ...clamp, easing: ease });
  const end = SCENE;
  const black = interpolate(f, [end - 60, end], [0, 1], clamp);
  const fw = 860;
  const fh = fw / aspect(hero);
  return (
    <AbsoluteFill>
      {/* montaj kenangan ringkas */}
      {f < mEnd + 30 &&
        mont.map((src, i) => {
          const from = i * per;
          const op = interpolate(f - from, [0, 6, per, per + 8], [0, 1, 1, i === mont.length - 1 ? 1 : 0], clamp);
          if (op <= 0) return null;
          return (
            <Sequence key={src + i} from={from} durationInFrames={per + 40}>
              <AbsoluteFill style={{ opacity: op }}>
                <FullPhoto src={src} dur={per + 40} move={i % 2 ? 'in' : 'out'} focusY={0.4} />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      {f < mEnd + 30 && <Sweep t={interpolate(f, [mEnd - 20, mEnd + 25], [0, 1], clamp)} />}
      {/* foto kumpulan utama */}
      <AbsoluteFill style={{ opacity: heroIn }}>
        <PurpleBackdrop blurSrc={hero} />
        <LightRays strength={0.6} />
        <Frame
          src={hero}
          w={fw}
          zoom={1.0 + interpolate(f, [mEnd, end], [0.06, 0], clamp)}
          style={{
            left: (W - fw) / 2,
            top: 170,
            transform: `scale(${0.92 + 0.08 * heroIn})`,
          }}
        />
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          <rect x={(W - fw) / 2 - 24} y={146} width={fw + 48} height={fh + 48} fill="none" stroke={C.gold} strokeWidth={1.4} opacity={0.8} />
        </svg>
      </AbsoluteFill>
      <Particles seed="akhir" amount={1.3} />
      <Title3D text={s.title} size={74} top={44} delay={mEnd + 20} spacing={0.1} depth={8} />
      <Fade text={s.vo} top={170 + fh + 62} size={40} italic delay={mEnd + 80} weight={300} color={C.cream} />
      <Ornament top={170 + fh + 140} delay={mEnd + 120} width={420} />
      <Fade text="Semoga Allah mempertemukan kita kembali. Aamiin." top={170 + fh + 160} size={32} delay={mEnd + 150} weight={400} color={C.goldLight} font={F.body} spacing="0.04em" />
      <AbsoluteFill style={{ background: '#000', opacity: black }} />
    </AbsoluteFill>
  );
};
