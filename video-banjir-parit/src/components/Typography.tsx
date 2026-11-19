import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, Easing } from 'remotion';
import { FPS, KEYWORDS, KText, Span, VoSlot, chunkTimes } from '../data/script';

export const POPPINS = 'Poppins, sans-serif';
export const CINZEL = 'Cinzel, serif';
export const GOLD = '#F6C866';
export const GOLD_GRAD = 'linear-gradient(180deg, #FFF1C4 0%, #F8CF6A 45%, #D99A2B 100%)';

/** Kedalaman 3D: tindanan bayang berlapis (extrusion) + cahaya lembut. */
export const depth3D = (layers: number, color: string, glow = 'rgba(0,0,0,0.55)') =>
  [...Array.from({ length: layers }, (_, i) => `${0}px ${i + 1}px 0 ${color}`), `0 ${layers + 6}px 24px ${glow}`, `0 0 40px rgba(0,0,0,0.35)`].join(', ');

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const fitSize = (lines: string[], base: number, width = 940) => {
  const longest = Math.max(...lines.map((l) => l.length));
  return Math.min(base, Math.floor(width / (longest * 0.66)));
};

/** Satu baris teks dengan pendedahan perkataan demi perkataan (blur → tajam, naik, mask). */
const RevealLine: React.FC<{
  text: string; start: number; stagger: number; size: number; gold?: boolean; weight?: number; tracking?: number; font?: string;
}> = ({ text, start, stagger, size, gold, weight = 800, tracking = 0.01, font = POPPINS }) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.26}px`, lineHeight: 1.08 }}>
      {words.map((w, i) => {
        const s = start + i * stagger;
        const p = interpolate(frame, [s, s + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'visible', paddingBottom: size * 0.12 }}>
            <span style={{
              display: 'inline-block', fontFamily: font, fontWeight: weight, fontSize: size, letterSpacing: `${tracking + (1 - p) * 0.08}em`,
              transform: `translateY(${(1 - p) * size * 0.45}px) scale(${0.94 + 0.06 * p})`, opacity: p,
              ...(gold
                ? { backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: `blur(${(1 - p) * 10}px) drop-shadow(0 4px 0 #8a5a12) drop-shadow(0 10px 18px rgba(0,0,0,0.6))` }
                : { color: '#fff', filter: `blur(${(1 - p) * 10}px)`, textShadow: depth3D(Math.round(size / 18), 'rgba(70,90,110,0.95)') }),
            }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Teks kinetik besar: hook, kata kunci, kemuncak emosi, kenyataan sokongan. */
export const KineticText: React.FC<{ t: KText; top?: number }> = ({ t, top }) => {
  const frame = useCurrentFrame();
  const a = Math.round(t.at * FPS);
  const e = Math.round(t.end * FPS);
  if (frame < a - 2 || frame > e + 2) return null;
  const out = interpolate(frame, [e - 10, e], [1, 0], clamp);
  const outBlur = (1 - out) * 12;
  const drift = interpolate(frame, [a, e], [0, -18]);
  const cfg = {
    hero: { base: 128, y: 640, stagger: 5, lineGap: 10 },
    keyword: { base: 104, y: 520, stagger: 6, lineGap: 0 },
    climax: { base: 124, y: 520, stagger: 0, lineGap: 6 },
    support: { base: 84, y: 760, stagger: 4, lineGap: 4 },
  }[t.kind];
  const size = fitSize(t.lines, cfg.base);
  // Kemuncak: setiap baris muncul berasingan, disebar sepanjang 55% tempoh supaya selari dengan narasi.
  const perLine = t.kind === 'climax' ? ((e - a) * 0.55) / t.lines.length : 8;
  return (
    <AbsoluteFill style={{ opacity: out, filter: `blur(${outBlur}px)`, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 70, right: 70, top: top ?? cfg.y, transform: `translateY(${drift}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: cfg.lineGap, textAlign: 'center' }}>
        {t.kind === 'keyword' && <KeywordRule frame={frame} a={a} />}
        {t.lines.map((l, i) => (
          <RevealLine key={i} text={l} start={a + i * perLine} stagger={t.kind === 'climax' ? 5 : cfg.stagger} size={size}
            gold={t.gold?.includes(i)} tracking={t.kind === 'keyword' ? 0.06 : 0.005} />
        ))}
        {t.kind === 'keyword' && <KeywordRule frame={frame} a={a + 4} />}
      </div>
    </AbsoluteFill>
  );
};

const KeywordRule: React.FC<{ frame: number; a: number }> = ({ frame, a }) => {
  const w = interpolate(frame, [a, a + 18], [0, 420], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ width: w, height: 4, margin: '14px 0', borderRadius: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, boxShadow: '0 0 18px rgba(246,200,102,0.7)' }} />;
};

/** Kaunter RM10 / RM20 / RM50 — 3D emas, angka berdetik naik, pop lembut. */
export const MoneyCounters: React.FC<{ m: Span & { amounts: number[]; gap: number } }> = ({ m }) => {
  const frame = useCurrentFrame();
  const a = Math.round(m.at * FPS);
  const e = Math.round(m.end * FPS);
  if (frame < a || frame > e + 2) return null;
  const out = interpolate(frame, [e - 10, e], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        {m.amounts.map((amt, i) => {
          const s = a + Math.round(i * m.gap * FPS);
          const sp = spring({ frame: frame - s, fps: FPS, config: { damping: 11, stiffness: 140, mass: 0.7 } });
          const count = Math.round(interpolate(frame, [s, s + 16], [0, amt], { ...clamp, easing: Easing.out(Easing.quad) }));
          const tilt = (i - 1) * -4;
          return (
            <div key={amt} style={{
              transform: `perspective(900px) rotateY(${(1 - sp) * 35 + tilt}deg) scale(${0.4 + 0.6 * sp}) translateX(${(i - 1) * 90}px)`,
              opacity: frame < s ? 0 : Math.min(1, sp * 1.4), display: 'flex', alignItems: 'baseline', gap: 8,
            }}>
              <span style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 70, color: '#fff', textShadow: depth3D(4, 'rgba(120,80,20,0.9)') }}>RM</span>
              <span style={{
                fontFamily: POPPINS, fontWeight: 800, fontSize: 168, lineHeight: 1, backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                filter: 'drop-shadow(0 3px 0 #b37a1c) drop-shadow(0 6px 0 #8a5a12) drop-shadow(0 9px 0 #6b450c) drop-shadow(0 18px 24px rgba(0,0,0,0.65))',
                minWidth: 220, textAlign: 'left',
              }}>{count}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Lower-third premium: bar emas, panel kaca gelap, sapuan dari kiri. */
export const LowerThird: React.FC<{ s: Span }> = ({ s }) => {
  const frame = useCurrentFrame();
  const a = Math.round(s.at * FPS);
  const e = Math.round(s.end * FPS);
  if (frame < a || frame > e) return null;
  const inP = interpolate(frame, [a, a + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const outP = interpolate(frame, [e - 12, e], [1, 0], clamp);
  const bar = interpolate(frame, [a, a + 12], [0, 1], clamp);
  const txt = (d: number) => interpolate(frame, [a + d, a + d + 12], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', left: 64, top: 1120, opacity: outP, transform: `translateX(${(1 - outP) * -30}px)` }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ width: 8, borderRadius: 4, background: GOLD_GRAD, transform: `scaleY(${bar})`, transformOrigin: 'top', boxShadow: '0 0 16px rgba(246,200,102,0.8)' }} />
        <div style={{
          clipPath: `inset(0 ${(1 - inP) * 100}% 0 0)`, padding: '20px 34px 22px 26px', marginLeft: 10, borderRadius: 14,
          background: 'linear-gradient(90deg, rgba(8,18,28,0.82), rgba(8,18,28,0.55))', backdropFilter: 'blur(8px)', border: '1px solid rgba(246,200,102,0.25)',
        }}>
          <div style={{ fontFamily: POPPINS, fontWeight: 600, fontSize: 30, letterSpacing: '0.2em', color: GOLD, opacity: txt(6) }}>YB USTAZ</div>
          <div style={{ fontFamily: POPPINS, fontWeight: 800, fontSize: 52, lineHeight: 1.1, color: '#fff', opacity: txt(9), letterSpacing: '0.01em' }}>MUHAMMAD ISMI MAT TAIB</div>
          <div style={{ fontFamily: POPPINS, fontWeight: 500, fontSize: 34, color: 'rgba(255,255,255,0.85)', opacity: txt(13), marginTop: 4 }}>Ahli Parlimen Parit</div>
        </div>
      </div>
    </div>
  );
};

export const SourceTag: React.FC<{ s: Span; label: string }> = ({ s, label }) => {
  const frame = useCurrentFrame();
  const a = Math.round(s.at * FPS);
  const e = Math.round(s.end * FPS);
  const o = interpolate(frame, [a, a + 12, e - 12, e], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <div style={{ position: 'absolute', left: 64, top: 210, opacity: o, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 40, background: 'rgba(0,0,0,0.38)', border: '1px solid rgba(255,255,255,0.18)' }}>
      <div style={{ width: 12, height: 12, borderRadius: 6, background: '#ff5a4f', opacity: 0.5 + 0.5 * pulse, boxShadow: '0 0 10px #ff5a4f' }} />
      <span style={{ fontFamily: POPPINS, fontWeight: 500, fontSize: 28, color: 'rgba(255,255,255,0.92)', letterSpacing: '0.02em' }}>{label}</span>
    </div>
  );
};

/** Subtitle 2 baris, Poppins SemiBold, kata kunci emas dengan pop. Dalam zon selamat TikTok/Reels. */
export const Subtitles: React.FC<{ slots: VoSlot[]; timing: Record<string, number[][]> }> = ({ slots, timing }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  for (const slot of slots) {
    if (slot.noSubs) continue;
    for (const c of chunkTimes(slot, timing[String(slot.id)])) {
      if (t < c.start || t > c.end) continue;
      const a = c.start * FPS;
      const e = c.end * FPS;
      const o = interpolate(frame, [a, a + 5, e - 4, e], [0, 1, 1, 0], clamp);
      const words = c.text.split(' ');
      const span = Math.max(1, (e - a) * 0.45);
      return (
        <div style={{ position: 'absolute', left: 90, right: 150, bottom: 380, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - o) * 10}px)` }}>
          <div style={{ textAlign: 'center', maxWidth: 840, lineHeight: 1.28, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 14px' }}>
            {words.map((w, i) => {
              const ws = a + (i / words.length) * span;
              const wp = interpolate(frame, [ws, ws + 5], [0, 1], clamp);
              const bare = w.toLowerCase().replace(/[^a-z-]/g, '');
              const key = KEYWORDS.includes(bare);
              const pop = key ? spring({ frame: frame - ws, fps: FPS, config: { damping: 9, stiffness: 180 } }) : 1;
              return (
                <span key={i} style={{
                  fontFamily: POPPINS, fontWeight: key ? 800 : 600, fontSize: key ? 60 : 52, color: key ? GOLD : '#fff', opacity: 0.25 + 0.75 * wp,
                  display: 'inline-block', transform: `scale(${key ? 0.85 + 0.15 * pop : 1})`,
                  textShadow: '0 2px 2px rgba(0,0,0,0.9), 0 4px 18px rgba(0,0,0,0.75)',
                }}>{w}</span>
              );
            })}
          </div>
        </div>
      );
    }
  }
  return null;
};
