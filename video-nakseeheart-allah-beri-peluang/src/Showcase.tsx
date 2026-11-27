import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, getInputProps, staticFile } from 'remotion';
import { B, TL, C, FONT, f, tw, ease, easeOut, back, useTime } from './lib';
import { Subtitles } from './components/Subtitles';
import { HeartMark } from './components/LowerThird';
import { LineIcon, IconName } from './components/InfoFX';
import SC from './data/showcase.json';

/* =====================================================================
 * SHOWCASE FINAL / RAW + suntingan KINETIC TYPOGRAPHY
 * Diilhamkan oleh video rujukan pengguna ("RECENT WORK"): logo & nama di atas,
 * panel FINAL (suntingan) besar, panel RAW (rakaman asal) serentak di bawah, label neon.
 * FINAL = suntingan semula format segi empat: wajah penceramah diselang-seli dengan
 *         kad grafik skrin penuh (perkataan besar, pilihan, cincin, siluet, jubin 1-2-3, sorotan).
 * Masa daripada timeline.json (EDL sama dengan video asal); audio = public/audio/mix.wav.
 * ===================================================================== */

/* ------------------------------------------------- TEMA WARNA Nasihat V4: merah (maroon, lalai) | hijau (hijau gelap) */
type Theme = { b1: string; b2: string; b3: string; b4: string; b5: string; b6: string; m1: string; m2: string; m3: string; l1: string; l2: string;
  a: string; a2: string; l2rgb: string; d: string; d2: string; pill: string; pillSh: string; pillText: string };
const THEMES: Record<string, Theme> = {
  merah: { b1: '#F08A86', b2: '#C8333F', b3: '#931827', b4: '#600C18', b5: '#36060D', b6: '#200408', m1: '#86202C', m2: '#521019', m3: '#3E0A12', l1: '#FFD2CC', l2: '#FFF1EE',
    a: '255,150,140', a2: '235,90,95', l2rgb: '255,241,238', d: '42,6,12', d2: '96,14,26', pill: '#FFF3C4', pillSh: '#B07A22', pillText: '#7A0E1C' },
  hijau: { b1: '#93DDB0', b2: '#2E9E68', b3: '#15734A', b4: '#0B4A30', b5: '#06281A', b6: '#031910', m1: '#1D6845', m2: '#0E452D', m3: '#0A3624', l1: '#C6F7DA', l2: '#ECFFF3',
    a: '150,255,195', a2: '70,205,135', l2rgb: '236,255,243', d: '4,30,20', d2: '12,72,46', pill: '#FE2C55', pillSh: '#9E1430', pillText: '#FFFFFF' },
};
const THEME_ID = String((getInputProps() as { theme?: string }).theme ?? (SC as { theme?: string }).theme ?? 'merah');
const T: Theme = THEMES[THEME_ID] ?? THEMES.merah;

const SQ = 1080;
/* Data style Nasihat V4: src/data/showcase.json (babak panel, point 3D, teks CTA).
 * Masa boleh nombor (saat output) atau nama beat dalam timeline.json (cth "cta", "end"). */
type T = number | string;
const bt = (v: T | undefined, d = 0): number => (v === undefined ? d : typeof v === 'number' ? v : Number((B as Record<string, unknown>)[v] ?? d));
const FACE = SC.face ?? { x: 540, y: 1050 };
const ZOOMS: number[] = SC.zoom ?? [1.0, 1.12];
const GOLD = 'linear-gradient(180deg, #FFF6D8 0%, #FFE08A 35%, #F2B33D 70%, #C98A1E 100%)';
const BG = `radial-gradient(circle at 50% 42%, ${T.m1} 0%, ${T.m2} 45%, ${T.b6} 100%)`;

const win = (t: number, a: number, b: number, fi = 0.25, fo = 0.25) =>
  Math.min(tw(t, [a, a + fi], [0, 1], easeOut), tw(t, [b - fo, b], [1, 0], ease));

/** Klip mengikut EDL (sumber video boleh ditukar: suntingan bergred / RAW) */
const Clips: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <>
    {TL.segments.map((seg) => {
      const from = f(seg.out[0]);
      return (
        <Sequence key={seg.id} from={from} durationInFrames={f(seg.out[1]) - from} layout="none">
          <OffthreadVideo src={staticFile(src)} trimBefore={f(seg.src)} muted playbackRate={(seg as { rate?: number }).rate ?? 1}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }} />
        </Sequence>
      );
    })}
  </>
);

/* ------------------------------------------------------------- babak */
type Scene =
  | { k: 'side'; a: number; b: number; small: string; big: string; right?: boolean }
  | { k: 'word'; a: number; b: number; big: string; small?: string; box?: boolean; lines?: string[] }
  | { k: 'versus'; a: number; b: number; title: string; left: string; right: string; at2: number }
  | { k: 'ring'; a: number; b: number; big: string; small: string; icon: IconName }
  | { k: 'silhouette'; a: number; b: number; lines: string[] }
  | { k: 'list'; a: number; b: number; title: string; items: { t: string; at: number }[] }
  | { k: 'tiles'; a: number; b: number; title: string; items: { n: string; t: string; at: number }[] }
  | { k: 'spot'; a: number; b: number; big: string; small: string; sub: string; subAt?: number; icon: IconName }
  | { k: 'cta'; a: number; b: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normScene = (x: any): Scene => ({ ...x, a: bt(x.a), b: bt(x.b), ...(x.at2 !== undefined ? { at2: bt(x.at2) } : {}), ...(x.subAt !== undefined ? { subAt: bt(x.subAt) } : {}),
  ...(x.items ? { items: x.items.map((it: { at: T }) => ({ ...it, at: bt(it.at) })) } : {}) });
const S: Scene[] = (SC.scenes as unknown as Scene[]).map(normScene);

const Card: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (
  <AbsoluteFill style={{ opacity: o, background: BG }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(rgba(${T.a},0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(${T.a},0.07) 2px, transparent 2px)`, backgroundSize: '90px 90px' }} />
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(${T.a2},0.30), rgba(0,0,0,0) 55%)` }} />
    {children}
  </AbsoluteFill>
);
const Big: React.FC<{ text: string; size: number; t: number; a: number; style?: React.CSSProperties }> = ({ text, size, t, a, style }) => {
  const p = tw(t, [a, a + 0.45], [0, 1], back);
  return (
    <div style={{ fontFamily: FONT.display, fontSize: size, lineHeight: 0.95, letterSpacing: `${0.02 + (1 - p) * 0.25}em`, backgroundImage: GOLD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
      filter: `drop-shadow(0 6px 18px rgba(0,0,0,0.6)) blur(${(1 - Math.min(1, p)) * 6}px)`, transform: `scale(${0.8 + 0.2 * p})`, whiteSpace: 'nowrap', ...style }}>{text}</div>
  );
};
const Small: React.FC<{ text: string; t: number; a: number; size?: number }> = ({ text, t, a, size = 40 }) => (
  <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: size, letterSpacing: '0.18em', color: C.cream, opacity: tw(t, [a, a + 0.3], [0, 1]), transform: `translateY(${tw(t, [a, a + 0.35], [20, 0], easeOut)}px)`, whiteSpace: 'nowrap' }}>{text}</div>
);

const SceneView: React.FC<{ s: Scene }> = ({ s }) => {
  const t = useTime();
  if (t < s.a - 0.05 || t > s.b + 0.05) return null;
  const o = win(t, s.a, s.b);
  const center: React.CSSProperties = { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 };
  switch (s.k) {
    case 'side': {
      const x = s.right ? 1000 : 80;
      return (
        <AbsoluteFill style={{ opacity: o }}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(${T.d},0.88) 0%, rgba(${T.d},0.55) 22%, rgba(0,0,0,0) 40%)` }} />
          <div style={{ position: 'absolute', top: 40, ...(s.right ? { right: 1080 - x } : { left: x }), display: 'flex', flexDirection: 'column', alignItems: s.right ? 'flex-end' : 'flex-start', gap: 6 }}>
            {s.small && <Small text={s.small} t={t} a={s.a} size={34} />}
            <Big text={s.big} size={s.big.length > 11 ? 100 : 130} t={t} a={s.a + 0.1} style={{ transformOrigin: s.right ? 'right center' : 'left center' }} />
            <div style={{ height: 6, width: tw(t, [s.a + 0.2, s.a + 0.7], [0, 260], easeOut), background: C.gold, borderRadius: 3, boxShadow: '0 0 18px rgba(216,180,106,0.8)' }} />
          </div>
        </AbsoluteFill>
      );
    }
    case 'word':
      return (
        <Card o={o}>
          <div style={center}>
            {s.small && <Small text={s.small} t={t} a={s.a} />}
            <div style={{ padding: s.box ? '18px 46px 10px' : 0, border: s.box ? `4px solid ${C.goldLight}` : 'none', borderRadius: 18,
              boxShadow: s.box ? `0 0 ${30 * tw(t, [s.a + 0.3, s.a + 0.8], [0, 1])}px rgba(255,226,163,0.7), inset 0 0 30px rgba(216,180,106,0.25)` : 'none' }}>
              <Big text={s.big} size={s.big.length > 9 ? 170 : 220} t={t} a={s.a + 0.1} />
            </div>
            {(s.lines ?? []).map((l, i) => <Big key={i} text={l} size={150} t={t} a={s.a + 0.5 + i * 0.2} />)}
          </div>
        </Card>
      );
    case 'versus':
      return (
        <Card o={o}>
          <div style={center}>
            <Small text={s.title} t={t} a={s.a} />
            <div style={{ display: 'flex', gap: 40, marginTop: 30 }}>
              {[s.left, s.right].map((x, i) => {
                const at = i === 0 ? s.a + 0.3 : s.at2;
                const p = tw(t, [at, at + 0.4], [0, 1], back);
                return (
                  <div key={i} style={{ padding: '26px 36px', borderRadius: 24, border: `3px solid ${C.goldLight}`, background: 'rgba(216,180,106,0.12)', opacity: Math.min(1, p * 1.4),
                    transform: `translateY(${(1 - p) * 60}px) rotate(${i ? 3 : -3}deg)`, boxShadow: '0 0 30px rgba(216,180,106,0.35)', fontFamily: FONT.display, fontSize: 96, color: C.goldLight, whiteSpace: 'nowrap' }}>{x}</div>
                );
              })}
            </div>
          </div>
        </Card>
      );
    case 'ring': {
      const p = tw(t, [s.a + 0.1, s.a + 1.4], [0, 1], ease);
      const R = 250, L = 2 * Math.PI * R;
      return (
        <Card o={o}>
          <div style={center}>
            <svg width="620" height="620" viewBox="0 0 620 620" style={{ position: 'absolute', top: 120 }}>
              <circle cx="310" cy="310" r={R} fill="none" stroke="rgba(216,180,106,0.18)" strokeWidth="22" />
              <circle cx="310" cy="310" r={R} fill="none" stroke="#FFE08A" strokeWidth="22" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} transform="rotate(-90 310 310)"
                style={{ filter: 'drop-shadow(0 0 14px rgba(255,214,140,0.9))' }} />
            </svg>
            <div style={{ position: 'absolute', top: 250, opacity: tw(t, [s.a + 0.2, s.a + 0.6], [0, 1]) }}><LineIcon name={s.icon} size={150} color={C.goldLight} stroke={6} /></div>
            <div style={{ position: 'absolute', top: 760, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Small text={s.small} t={t} a={s.a + 0.4} size={36} />
              <Big text={s.big} size={s.big.length > 11 ? 120 : 150} t={t} a={s.a + 0.6} />
            </div>
          </div>
        </Card>
      );
    }
    case 'silhouette': {
      const p = tw(t, [s.a, s.a + 0.5], [0, 1], back);
      return (
        <Card o={o}>
          <div style={{ position: 'absolute', left: 140, top: 190, width: 800, height: 700, background: '#F7F4ED', borderRadius: 6, transform: `scale(${0.85 + 0.15 * p})`, overflow: 'hidden',
            boxShadow: '0 0 0 10px rgba(255,226,163,0.25), 0 30px 60px rgba(0,0,0,0.6)' }}>
            <Img src={staticFile('media/silhouette.png')} style={{ position: 'absolute', left: 360, top: -200, width: 600, height: 1067 }} />
            <div style={{ position: 'absolute', left: 50, top: 120, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {s.lines.map((l, i) => (
                <div key={i} style={{ fontFamily: FONT.display, fontSize: i === 1 ? (l.length > 8 ? 104 : 140) : 96, lineHeight: 0.95, color: i === 1 ? `${T.b3}` : C.charcoal,
                  opacity: tw(t, [s.a + 0.2 + i * 0.18, s.a + 0.45 + i * 0.18], [0, 1]), transform: `translateX(${tw(t, [s.a + 0.2 + i * 0.18, s.a + 0.6 + i * 0.18], [-40, 0], easeOut)}px)` }}>{l}</div>
              ))}
            </div>
          </div>
          {/* bucu bingkai */}
          <div style={{ position: 'absolute', left: 120, top: 170, width: 70, height: 70, borderLeft: `6px solid ${C.goldLight}`, borderTop: `6px solid ${C.goldLight}` }} />
          <div style={{ position: 'absolute', right: 120, bottom: 170, width: 70, height: 70, borderRight: `6px solid ${C.goldLight}`, borderBottom: `6px solid ${C.goldLight}` }} />
        </Card>
      );
    }
    case 'list':
      return (
        <Card o={o}>
          <div style={{ ...center, alignItems: 'flex-start', paddingLeft: 140 }}>
            <Small text={s.title} t={t} a={s.a} />
            {s.items.map((it, i) => {
              const p = tw(t, [it.at, it.at + 0.4], [0, 1], back);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 26, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -80}px)` }}>
                  <svg width="90" height="90" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#8E2A1C" stroke="#FFB4A2" strokeWidth="2" /><path d="M14 14 L30 30 M30 14 L14 30" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" /></svg>
                  <Big text={it.t} size={it.t.length > 10 ? 110 : 150} t={t} a={it.at} style={{ transformOrigin: 'left center' }} />
                </div>
              );
            })}
          </div>
        </Card>
      );
    case 'tiles':
      return (
        <Card o={o}>
          <div style={center}>
            <Small text={s.title} t={t} a={s.a} />
            <div style={{ display: 'flex', gap: 30, marginTop: 30 }}>
              {s.items.map((it, i) => {
                const p = tw(t, [it.at - 0.1, it.at + 0.35], [0, 1], back);
                const on = t >= it.at - 0.1;
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
                    <div style={{ width: s.items.length > 2 ? 250 : 300, height: 320, borderRadius: 22, background: on ? GOLD : 'rgba(255,255,255,0.06)', border: `3px solid ${on ? '#FFE08A' : 'rgba(216,180,106,0.4)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotateX(${(1 - p) * 80}deg)`, boxShadow: on ? '0 0 40px rgba(255,214,140,0.6)' : 'none',
                      fontFamily: FONT.display, fontSize: 230, color: on ? C.charcoal : 'rgba(216,180,106,0.5)' }}>{it.n}</div>
                    <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 46, letterSpacing: '0.06em', color: on ? C.goldLight : 'rgba(247,244,237,0.3)' }}>{it.t}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      );
    case 'spot': {
      const p = tw(t, [s.a + 0.1, s.a + 0.9], [0, 1], easeOut);
      return (
        <Card o={o}>
          {/* pancaran cahaya */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: SQ, height: SQ, background: 'conic-gradient(from 200deg at 72% 34%, rgba(255,226,163,0) 0deg, rgba(255,226,163,0.35) 18deg, rgba(255,226,163,0) 40deg)', opacity: p }} />
          <div style={{ position: 'absolute', left: 780 - 170, top: 370 - 170, width: 340, height: 340, borderRadius: '50%', background: GOLD, transform: `scale(${p})`,
            boxShadow: '0 0 0 14px rgba(255,226,163,0.25), 0 0 80px rgba(255,214,140,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LineIcon name={s.icon} size={200} color={C.charcoal} stroke={6} />
          </div>
          <div style={{ position: 'absolute', left: 80, top: 600, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Small text={s.small} t={t} a={s.a + 0.5} size={38} />
            <Big text={s.big} size={130} t={t} a={s.a + 0.7} style={{ transformOrigin: 'left center' }} />
            <Small text={s.sub} t={t} a={s.subAt ?? s.a + 1.0} size={42} />
          </div>
        </Card>
      );
    }
    case 'cta':
      return (
        <Card o={o}>
          <div style={center}>
            <HeartMark size={120} t={t} />
            <Big text={SC.cta.cardTop} size={120} t={t} a={s.a + 0.3} />
            <Big text={SC.cta.cardBig} size={170} t={t} a={s.a + 0.7} />
            <Small text={`FOLLOW ${SC.cta.handle.toUpperCase()}`} t={t} a={s.a + 1.2} size={44} />
          </div>
        </Card>
      );
  }
};

/** Suntingan FINAL (segi empat 1080x1080) */
export const KineticFinal: React.FC = () => {
  const t = useTime();
  const body = TL.segments.filter((s) => s.id !== 'hook' && s.id !== 'cta');
  const idx = body.findIndex((sg) => t >= sg.out[0] && t < sg.out[1]);
  const s = ZOOMS[Math.max(0, idx) % ZOOMS.length] + tw(t, [0, B.end], [0, 0.04]);
  const ty = SQ / 2 - FACE.y * s, tx = SQ / 2 - FACE.x * s;
  return (
    <AbsoluteFill style={{ background: `${T.b6}`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: tx, top: ty, width: 1080 * s, height: 1920 * s }}>
        <Clips src="media/speaker.mp4" style={{ filter: 'contrast(1.06) saturate(1.02)' }} />
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }} />
      {S.map((sc, i) => <SceneView key={i} s={sc} />)}
      <div style={{ position: 'absolute', left: 0, top: -560, width: 1080, height: 1920, transform: 'scale(0.82)', transformOrigin: '50% 100%' }}>
        {t < B.cta && !S.some((sc) => sc.k !== 'side' && t >= sc.a - 0.05 && t <= sc.b + 0.05) && <Subtitles y={1430} />}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- point penting (bawah panel) */
type Point = { a: number; b: number; small: string; big: string; chips?: { t: string; at: number }[]; icon: IconName };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normPoint = (x: any): Point => ({ ...x, a: bt(x.a), b: bt(x.b), chips: x.chips?.map((c: { t: string; at: T }) => ({ ...c, at: bt(c.at) })) });
const PTS: Point[] = (SC.points as unknown as Point[]).map(normPoint);

const Point3D: React.FC<{ p: Point; idx: number }> = ({ p, idx }) => {
  const t = useTime();
  if (t < p.a - 0.05 || t > p.b + 0.05) return null;
  const o = win(t, p.a, p.b, 0.35, 0.3);
  const pin = tw(t, [p.a, p.a + 0.5], [0, 1], back);
  const bob = Math.sin((t - p.a) * 1.6) * 6;
  const size = p.big.length > 14 ? 96 : p.big.length > 10 ? 118 : 150;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {/* nombor point + ikon */}
      <div style={{ position: 'absolute', left: 540, top: 1320, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * pin})`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 74, height: 74, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 0 #7A4A0C, 0 0 24px rgba(255,214,140,0.7)' }}>
          <LineIcon name={p.icon} size={48} color={C.charcoal} stroke={8} />
        </div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 36, letterSpacing: '0.18em', color: `${T.l2}`, textShadow: '0 3px 12px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>{p.small}</div>
      </div>
      {/* tulisan 3D emas */}
      <div style={{ position: 'absolute', left: 540, top: 1470 + bob, transform: `translate(-50%,-50%) perspective(1200px) rotateX(${(1 - pin) * 60 + 12}deg) scale(${0.85 + 0.15 * pin})`, whiteSpace: 'nowrap' }}>
        <div style={{ position: 'relative', fontFamily: FONT.display, fontSize: size, lineHeight: 1, letterSpacing: '0.02em' }}>
          <div style={{ color: '#7A4A0C', textShadow: Array.from({ length: 12 }, (_, i) => `0 ${i * 1.3}px 0 #5A3406`).join(', ') + ', 0 24px 40px rgba(0,0,0,0.55)' }}>{p.big}</div>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: GOLD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{p.big}</div>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(110deg, rgba(255,255,255,0) ${30 + ((t - p.a) * 40) % 140 - 40}%, rgba(255,255,255,0.75) ${38 + ((t - p.a) * 40) % 140 - 40}%, rgba(255,255,255,0) ${46 + ((t - p.a) * 40) % 140 - 40}%)`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{p.big}</div>
        </div>
      </div>
      {/* cip point */}
      {p.chips && (
        <div style={{ position: 'absolute', left: 540, top: 1620, transform: 'translate(-50%,-50%)', display: 'flex', gap: 16 }}>
          {p.chips.map((c, i) => {
            const q = tw(t, [c.at - 0.1, c.at + 0.35], [0, 1], back);
            return (
              <div key={i} style={{ padding: '12px 26px', borderRadius: 40, background: `rgba(${T.d},0.75)`, border: `2px solid ${C.goldLight}`, opacity: Math.min(1, q * 1.5),
                transform: `translateY(${(1 - q) * 30}px) scale(${0.8 + 0.2 * q})`, boxShadow: `0 0 20px rgba(${T.a},0.35)`, display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
                <svg width="30" height="30" viewBox="0 0 44 44"><path d="M10 23 L19 32 L35 13" fill="none" stroke={C.goldLight} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 34, color: '#FFFFFF' }}>{c.t}</span>
              </div>
            );
          })}
        </div>
      )}
      {/* penanda kemajuan */}
      <div style={{ position: 'absolute', left: 540, top: 1720, transform: 'translate(-50%,-50%)', display: 'flex', gap: 10 }}>
        {PTS.map((_, i) => <div key={i} style={{ width: i === idx ? 40 : 12, height: 12, borderRadius: 6, background: i <= idx ? C.goldLight : `rgba(${T.l2rgb},0.3)` }} />)}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- CTA: butang Follow TikTok + klik */
const CLICK = B.cta + (SC.cta.clickAfter ?? 2.0);
const TikTokGlyph: React.FC<{ size: number }> = ({ size }) => {
  const d = 'M27 4h7c.6 4.6 3.6 7.6 8 8v7c-3.2 0-6-1-8-2.6V31a12 12 0 1 1-12-12c.7 0 1.3 0 2 .2v7.2a5 5 0 1 0 3 4.6V4z';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path d={d} fill="#25F4EE" transform="translate(-1.6,-1.2)" />
      <path d={d} fill="#FE2C55" transform="translate(1.6,1.2)" />
      <path d={d} fill="#FFFFFF" />
    </svg>
  );
};
const FollowCTA: React.FC = () => {
  const t = useTime();
  if (t < B.cta - 0.05) return null;
  const capIn = tw(t, [B.cta, B.cta + 1.4], [0, 1], ease);
  const btnIn = tw(t, [B.cta + 0.4, B.cta + 0.95], [0, 1], back);
  const done = t >= CLICK;
  const press = t < CLICK - 0.08 ? 1 : t < CLICK + 0.12 ? 0.9 : tw(t, [CLICK + 0.12, CLICK + 0.45], [0.9, 1], back);
  const pulse = done ? 1 : 1 + 0.03 * Math.sin((t - B.cta) * 7);
  // kursor tangan masuk dari kanan bawah ke butang
  const cur = tw(t, [B.cta + 1.0, CLICK - 0.1], [0, 1], easeOut);
  const cx = 540 + 150 + (1 - cur) * 330, cy = 1565 + (1 - cur) * 330;
  const curO = tw(t, [B.cta + 1.0, B.cta + 1.2], [0, 1]) * tw(t, [CLICK + 0.9, CLICK + 1.3], [1, 0]);
  const rip = tw(t, [CLICK, CLICK + 0.7], [0, 1], easeOut);
  return (
    <AbsoluteFill>
      {/* kapsyen tandatangan */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontFamily: "'Great Vibes', cursive", fontSize: 84, lineHeight: 1.2, color: '#FFFFFF', padding: '0 30px', whiteSpace: 'nowrap',
          textShadow: `0 0 20px rgba(${T.a},0.6), 0 4px 12px rgba(0,0,0,0.4)`, clipPath: `inset(-30% ${100 - capIn * 100}% -30% -5%)` }}>
          {SC.cta.caption.split(/(\*[^*]+\*)/).map((w, i) => w.startsWith('*') ? <span key={i} style={{ color: '#FFE08A' }}>{w.slice(1, -1)}</span> : <React.Fragment key={i}>{w}</React.Fragment>)}
        </div>
      </div>
      {/* butang Follow TikTok */}
      <div style={{ position: 'absolute', left: 540, top: 1520, transform: `translate(-50%,-50%) scale(${btnIn * press * pulse})`, opacity: Math.min(1, btnIn * 1.5) }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 760 * (0.6 + rip * 0.8), height: 150 * (0.6 + rip * 1.6), borderRadius: 120,
          transform: 'translate(-50%,-50%)', border: `4px solid rgba(${T.a},0.9)`, opacity: done ? 1 - rip : 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '22px 46px 22px 26px', borderRadius: 80, whiteSpace: 'nowrap',
          background: done ? `linear-gradient(180deg,${T.b2},${T.b3})` : '#0B0B0F', border: `3px solid ${done ? '${T.l1}' : 'rgba(255,255,255,0.85)'}`,
          boxShadow: `0 ${10 * press}px 0 ${done ? '${T.b4}' : '#000'}, 0 18px 40px rgba(0,0,0,0.5), 0 0 30px rgba(37,244,238,0.45)` }}>
          <div style={{ width: 92, height: 92, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.25)' }}>
            <TikTokGlyph size={64} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
            <span style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 52, color: '#FFFFFF', letterSpacing: '0.02em' }}>{done ? 'Following' : 'Follow'}</span>
            <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 32, color: done ? `${T.l2}` : '#25F4EE' }}>{SC.cta.handle}</span>
          </div>
          <div style={{ width: 70, height: 70, borderRadius: '50%', marginLeft: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: done ? '#FFFFFF' : '#FE2C55' }}>
            {done
              ? <svg width="44" height="44" viewBox="0 0 44 44"><path d="M10 23 L19 32 L35 13" fill="none" stroke={`${T.b3}`} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              : <svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 8v24M8 20h24" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" /></svg>}
          </div>
        </div>
      </div>
      {/* hati terbang selepas klik */}
      {done && Array.from({ length: 8 }, (_, i) => {
        const q = tw(t, [CLICK + i * 0.05, CLICK + 1.2 + i * 0.05], [0, 1], easeOut);
        const ang = -Math.PI / 2 + (i - 3.5) * 0.32;
        return <div key={i} style={{ position: 'absolute', left: 540 + Math.cos(ang) * 320 * q, top: 1480 + Math.sin(ang) * 220 * q, opacity: (1 - q) * (q > 0 ? 1 : 0),
          transform: `translate(-50%,-50%) scale(${0.6 + q})`, fontSize: 0 }}>
          <svg width="44" height="40" viewBox="0 0 24 22"><path d="M12 21s-9-5.6-9-12A5 5 0 0 1 12 6a5 5 0 0 1 9 3c0 6.4-9 12-9 12z" fill={i % 2 ? '#FE2C55' : '#FFE08A'} /></svg>
        </div>;
      })}
      {/* kursor tangan */}
      <div style={{ position: 'absolute', left: cx, top: cy, opacity: curO, transform: `scale(${t >= CLICK - 0.08 && t < CLICK + 0.15 ? 0.85 : 1})`, transformOrigin: '14px 4px' }}>
        <svg width="96" height="110" viewBox="0 0 48 55" style={{ filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.45))' }}>
          <path d="M14 4a4 4 0 0 1 8 0v18h1V18a4 4 0 0 1 8 0v5h1v-2a4 4 0 0 1 8 0v4h.5a3.5 3.5 0 0 1 7 0V38c0 9-6 15-15 15h-5c-6 0-9-3-13-8L4 33a4 4 0 0 1 6-5l4 4V4z"
            fill="#FFFFFF" stroke="#0B0B0F" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      </div>
      <Sequence from={f(CLICK) - 1} durationInFrames={20}><Audio src={staticFile('audio/click.wav')} volume={1} /></Sequence>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- logo premium NakSeeHeart */
const GOLDTXT = 'linear-gradient(180deg, #FFF3C4 0%, #F4D27A 38%, #C8922E 62%, #F2CF77 100%)';
const PremiumLogo: React.FC<{ scale?: number; top?: number }> = ({ scale = SC.logo.scale ?? 0.74, top = 30 }) => {
  const t = useTime();
  const em = tw(t, [0.05, 0.9], [0, 1], back);
  const wm = tw(t, [0.4, 1.4], [0, 1], ease);
  const line = tw(t, [0.9, 1.7], [0, 1], ease);
  const sh = ((t * 0.35) % 1) * 260 - 80; // kilauan
  const S0 = 182;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, height: 218, display: 'flex', justifyContent: 'center', alignItems: 'center', transform: `scale(${scale})`, transformOrigin: '50% 0%' }}>
      {/* plak gelap berbingkai emas supaya logo menyerlah atas latar cerah */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 30, padding: '16px 52px 16px 22px', borderRadius: 120,
        background: `linear-gradient(180deg, rgba(${T.d2},0.96) 0%, rgba(${T.d},0.97) 100%)`, opacity: Math.min(1, em * 1.4),
        border: '3px solid #E9C46A', boxShadow: `0 0 0 6px rgba(233,196,106,0.18), 0 16px 34px rgba(${T.d},0.55), 0 0 40px rgba(255,214,140,0.35), inset 0 2px 0 rgba(255,255,255,0.12)` }}>
      {/* medalion */}
      <div style={{ width: S0, height: S0, position: 'relative', transform: `scale(${em}) rotate(${(1 - em) * -40}deg)` }}>
        <svg width={S0} height={S0} viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <linearGradient id="lg-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFF3C4" /><stop offset="0.45" stopColor="#E9B95A" /><stop offset="0.7" stopColor="#B07A22" /><stop offset="1" stopColor="#F6D88A" />
            </linearGradient>
            <radialGradient id="lg-core" cx="0.45" cy="0.38" r="0.7">
              <stop offset="0" stopColor={`${T.m1}`} /><stop offset="0.6" stopColor={`${T.m2}`} /><stop offset="1" stopColor={`${T.b5}`} />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#lg-gold)" />
          <circle cx="50" cy="50" r="44.5" fill="url(#lg-core)" />
          <circle cx="50" cy="50" r="41.5" fill="none" stroke="url(#lg-gold)" strokeWidth="0.8" strokeDasharray="1.2 2.2" />
          <g transform={`rotate(${t * 6} 50 50)`} fill="none" stroke="url(#lg-gold)" strokeWidth="1.6" strokeLinejoin="round">
            <rect x="24" y="24" width="52" height="52" />
            <rect x="24" y="24" width="52" height="52" transform="rotate(45 50 50)" />
          </g>
          <circle cx="50" cy="50" r="27" fill="url(#lg-core)" stroke="url(#lg-gold)" strokeWidth="1" />
          <g transform="translate(31 32) scale(0.79)">
            <path d="M24 42 C10 32 4 25 4 16.5 4 10 9 5 15.2 5c3.8 0 6.9 2 8.8 5 1.9-3 5-5 8.8-5C39 5 44 10 44 16.5 44 25 38 32 24 42z" fill="url(#lg-gold)" />
            <path d="M11 22h7l3-6 4 12 3-6h9" stroke={`${T.m3}`} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, bottom: -20, left: `${sh}%`, width: '22%', transform: 'skewX(-20deg)',
            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))' }} />
        </div>
      </div>
      {/* tanda kata */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: wm, transform: `translateX(${(1 - wm) * 30}px)` }}>
        <div style={{ position: 'relative', fontFamily: FONT.serif, fontWeight: 800, fontSize: 84, letterSpacing: '0.09em', lineHeight: 1, whiteSpace: 'nowrap' }}>
          <span style={{ position: 'absolute', inset: 0, color: '#3A2406', transform: 'translate(0, 4px)', textShadow: '0 0 22px rgba(255,214,140,0.55)' }}>{SC.logo.name}</span>
          <span style={{ position: 'relative', backgroundImage: GOLDTXT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{SC.logo.name}</span>
          <span style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${sh}%, rgba(255,255,255,0.9) ${sh + 8}%, rgba(255,255,255,0) ${sh + 16}%)`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{SC.logo.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
          <div style={{ width: 150 * line, height: 2, background: 'linear-gradient(90deg, rgba(246,216,138,0), #F6D88A)' }} />
          <div style={{ width: 12, height: 12, transform: `rotate(45deg) scale(${line})`, background: '#F6D88A', boxShadow: '0 0 10px rgba(255,224,138,0.9)' }} />
          <div style={{ width: 150 * line, height: 2, background: 'linear-gradient(90deg, #F6D88A, rgba(246,216,138,0))' }} />
        </div>
        <div style={{ marginTop: 12, fontFamily: FONT.sans, fontWeight: 600, fontSize: 25, letterSpacing: '0.42em', color: `${T.l2}`, opacity: line, whiteSpace: 'nowrap' }}>{SC.logo.tagline}</div>
      </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------- label kecil SHARING MOMENT (atas panel) + cahaya bergerak */
const MomentBadge: React.FC<{ y: number }> = ({ y }) => {
  const t = useTime();
  const pin = tw(t, [0.6, 1.2], [0, 1], back);
  const ang = (t * 140) % 360; // cahaya berlari di sekeliling bingkai
  const sw = ((t * 0.55) % 1) * 300 - 100; // sapuan cahaya pada teks
  const glow = 0.55 + 0.45 * Math.sin(t * 3.2);
  return (
    <div style={{ position: 'absolute', left: 540, top: y, transform: `translate(-50%,-50%) scale(${pin})`, opacity: Math.min(1, pin * 1.5) }}>
      <div style={{ padding: 3, borderRadius: 40, background: `conic-gradient(from ${ang}deg, rgba(${T.a},0.15) 0deg, ${T.l1} 40deg, #FFE08A 70deg, rgba(${T.a},0.15) 120deg, rgba(${T.a},0.15) 360deg)`,
        boxShadow: `0 0 ${14 + 14 * glow}px rgba(${T.a},${0.45 + 0.35 * glow}), 0 8px 18px rgba(0,0,0,0.45)` }}>
        <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 12, padding: '9px 26px', borderRadius: 37,
          background: `linear-gradient(180deg, ${T.m2} 0%, ${T.b5} 100%)` }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FE2C55', boxShadow: `0 0 ${6 + 8 * glow}px rgba(254,44,85,0.9)`, opacity: 0.6 + 0.4 * glow }} />
          <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 28, letterSpacing: '0.24em', color: `${T.l2}`, whiteSpace: 'nowrap',
            textShadow: `0 0 ${8 + 8 * glow}px rgba(${T.a},0.85)` }}>{SC.label}</span>
          <div style={{ position: 'absolute', top: -10, bottom: -10, left: `${sw}%`, width: '28%', transform: 'skewX(-24deg)',
            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.38), rgba(255,255,255,0))' }} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------- COVER Nasihat V4 (still pada bingkai 100) */
const Gold3D: React.FC<{ text: string; size: number }> = ({ text, size }) => (
  <div style={{ position: 'relative', fontFamily: FONT.display, fontSize: size, lineHeight: 0.95, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
    <div style={{ color: '#7A4A0C', textShadow: Array.from({ length: 14 }, (_, i) => `0 ${i * 1.4}px 0 #5A3406`).join(', ') + ', 0 26px 44px rgba(0,0,0,0.6)' }}>{text}</div>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: GOLD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{text}</div>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0) 50%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{text}</div>
  </div>
);
export const CoverV4: React.FC = () => {
  const cv = SC.cover;
  const AX = 150, AY = 280, AW = 780, AH = 900;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: `linear-gradient(180deg, ${T.b1} 0%, ${T.b2} 20%, ${T.b3} 45%, ${T.b4} 72%, ${T.b5} 100%)` }}>
      {/* sinar cahaya dari belakang gerbang */}
      <AbsoluteFill style={{ background: 'repeating-conic-gradient(from 0deg at 50% 38%, rgba(255,255,255,0.10) 0deg 6deg, rgba(255,255,255,0) 6deg 18deg)', maskImage: 'radial-gradient(circle at 50% 38%, #000 0%, rgba(0,0,0,0) 62%)', WebkitMaskImage: 'radial-gradient(circle at 50% 38%, #000 0%, rgba(0,0,0,0) 62%)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 38%, rgba(255,240,200,0.45) 0%, rgba(0,0,0,0) 45%)' }} />
      {/* corak bintang 8 bucu halus */}
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0, opacity: 0.10 }}>
        <defs><pattern id="st8" width="120" height="120" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#FFFFFF" strokeWidth="1.5"><rect x="35" y="35" width="50" height="50" /><rect x="35" y="35" width="50" height="50" transform="rotate(45 60 60)" /></g>
        </pattern></defs>
        <rect width="1080" height="1920" fill="url(#st8)" />
      </svg>
      <PremiumLogo />
      {/* gerbang mihrab dengan foto */}
      <div style={{ position: 'absolute', left: AX - 12, top: AY - 12, width: AW + 24, height: AH + 24, borderRadius: `${(AW + 24) / 2}px ${(AW + 24) / 2}px 40px 40px`,
        background: 'linear-gradient(160deg, #FFF3C4 0%, #E9B95A 35%, #A8721E 60%, #F6D88A 100%)', boxShadow: '0 0 0 8px rgba(255,224,138,0.22), 0 30px 70px rgba(0,0,0,0.55), 0 0 60px rgba(255,214,140,0.45)' }} />
      <div style={{ position: 'absolute', left: AX, top: AY, width: AW, height: AH, borderRadius: `${AW / 2}px ${AW / 2}px 30px 30px`, overflow: 'hidden', background: `${T.b6}` }}>
        <Img src={staticFile(cv.photo)} style={{ position: 'absolute', left: -(1080 * cv.zoom - AW) / 2, top: cv.photoTop, width: 1080 * cv.zoom, height: 1920 * cv.zoom, filter: 'brightness(1.06) contrast(1.05) saturate(1.05)' }} />
        <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(${T.d},0) 55%, rgba(${T.d},0.85) 100%)` }} />
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 60% at 50% 40%, rgba(0,0,0,0) 60%, rgba(${T.d},0.45) 100%)` }} />
      </div>
      <div style={{ position: 'absolute', left: AX + 10, top: AY + 10, width: AW - 20, height: AH - 20, borderRadius: `${(AW - 20) / 2}px ${(AW - 20) / 2}px 24px 24px`, border: '2px solid rgba(255,236,190,0.55)' }} />
      <MomentBadge y={AY - 4} />
      {/* soalan cangkuk */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1090, display: 'flex', justifyContent: 'center' }}>
        <div style={{ padding: '14px 40px', borderRadius: 60, background: T.pill, transform: 'rotate(-2.5deg)', boxShadow: `0 8px 0 ${T.pillSh}, 0 16px 30px rgba(0,0,0,0.45)`,
          fontFamily: FONT.sans, fontWeight: 900, fontSize: 54, letterSpacing: '0.03em', color: T.pillText, whiteSpace: 'nowrap' }}>{cv.question}</div>
      </div>
      {/* tajuk 3D */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1215, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 62, letterSpacing: '0.16em', color: '#FFFFFF', textShadow: `0 4px 14px rgba(0,0,0,0.55), 0 0 24px rgba(${T.a},0.6)` }}>{cv.small}</div>
        <Gold3D text={cv.big} size={cv.big.length > 12 ? 150 : 180} />
      </div>
      {/* petikan sebenar */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 1500, textAlign: 'center', fontFamily: "'Great Vibes', cursive", fontSize: 76, lineHeight: 1.15, color: '#FFFFFF',
        textShadow: `0 0 20px rgba(${T.a},0.55), 0 4px 12px rgba(0,0,0,0.5)` }}>“{cv.quote}”</div>
      {/* cip point */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1660, display: 'flex', justifyContent: 'center', gap: 12 }}>
        {cv.chips.map((c: { icon: string; t: string }, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px 10px 10px', borderRadius: 50, background: `rgba(${T.d},0.82)`, border: '2px solid #E9C46A',
            boxShadow: '0 0 18px rgba(255,214,140,0.3)', whiteSpace: 'nowrap' }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LineIcon name={c.icon as IconName} size={32} color={C.charcoal} stroke={8} />
            </div>
            <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 28, color: '#FFFFFF' }}>{c.t}</span>
          </div>
        ))}
      </div>
      {/* butang tonton */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1775, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 34px 12px 14px', borderRadius: 60, background: 'rgba(255,255,255,0.14)', border: '2px solid rgba(255,255,255,0.5)' }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24"><path d="M7 4 L20 12 L7 20 Z" fill={`${T.b4}`} /></svg>
          </div>
          <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 32, letterSpacing: '0.12em', color: '#FFFFFF' }}>{cv.watch}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- konsep cover alternatif (B, C, D) */
const TURQ = `linear-gradient(180deg, ${T.b1} 0%, ${T.b2} 20%, ${T.b3} 45%, ${T.b4} 72%, ${T.b5} 100%)`;
const Star8BG: React.FC<{ o?: number }> = ({ o = 0.1 }) => (
  <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0, opacity: o }}>
    <defs><pattern id="st8b" width="120" height="120" patternUnits="userSpaceOnUse">
      <g fill="none" stroke="#FFFFFF" strokeWidth="1.5"><rect x="35" y="35" width="50" height="50" /><rect x="35" y="35" width="50" height="50" transform="rotate(45 60 60)" /></g>
    </pattern></defs>
    <rect width="1080" height="1920" fill="url(#st8b)" />
  </svg>
);
const QPill: React.FC<{ text: string; rot?: number; size?: number }> = ({ text, rot = -2.5, size = 54 }) => (
  <div style={{ padding: '14px 40px', borderRadius: 60, background: T.pill, transform: `rotate(${rot}deg)`, boxShadow: `0 8px 0 ${T.pillSh}, 0 16px 30px rgba(0,0,0,0.45)`,
    fontFamily: FONT.sans, fontWeight: 900, fontSize: size, letterSpacing: '0.03em', color: T.pillText, whiteSpace: 'nowrap' }}>{text}</div>
);
const Photo: React.FC<{ zoom: number; top: number; left?: number; w: number }> = ({ zoom, top, left, w }) => (
  <Img src={staticFile(SC.cover.photo)} style={{ position: 'absolute', left: left ?? -(1080 * zoom - w) / 2, top, width: 1080 * zoom, height: 1920 * zoom, filter: 'brightness(1.06) contrast(1.05) saturate(1.05)' }} />
);

/** B — SINEMATIK: foto penuh, tajuk besar di bawah */
export const CoverV4B: React.FC = () => {
  const cv = SC.cover;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: `${T.b5}` }}>
      <Photo zoom={1.12} top={-260} w={1080} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(${T.d},0.75) 0%, rgba(${T.d},0) 18%, rgba(${T.d},0) 46%, rgba(${T.d2},0.88) 64%, ${T.b5} 84%)` }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 34%, rgba(255,240,200,0.18), rgba(0,0,0,0) 70%)' }} />
      {/* bingkai emas nipis */}
      <div style={{ position: 'absolute', inset: 28, border: '2px solid rgba(233,196,106,0.75)', borderRadius: 26 }} />
      <PremiumLogo />
      <MomentBadge y={262} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center' }}><QPill text={cv.question} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1270, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 66, letterSpacing: '0.16em', color: '#FFFFFF', textShadow: '0 4px 16px rgba(0,0,0,0.6)' }}>{cv.small}</div>
        <Gold3D text={cv.big} size={200} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1580, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <div style={{ width: 120, height: 2, background: 'linear-gradient(90deg, rgba(246,216,138,0), #F6D88A)' }} />
        <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 74, color: '#FFFFFF', textShadow: `0 0 20px rgba(${T.a},0.55)` }}>“{cv.quote}”</div>
        <div style={{ width: 120, height: 2, background: 'linear-gradient(90deg, #F6D88A, rgba(246,216,138,0))' }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1740, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 34px 12px 14px', borderRadius: 60, background: GOLD, boxShadow: '0 6px 0 #8A5A12, 0 0 30px rgba(255,214,140,0.5)' }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: `${T.b5}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24"><path d="M7 4 L20 12 L7 20 Z" fill="#FFE08A" /></svg>
          </div>
          <span style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 32, letterSpacing: '0.12em', color: '#2A1C08' }}>{cv.watch}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** C — MEDALION PETIKAN: potret bulat berbingkai bintang + kad petikan besar */
export const CoverV4C: React.FC = () => {
  const cv = SC.cover;
  const D = 600, CX = 540, CY = 640;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: TURQ }}>
      <Star8BG />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${CY / 19.2}%, rgba(255,240,200,0.55) 0%, rgba(0,0,0,0) 38%)` }} />
      <PremiumLogo />
      {/* bintang 8 bucu besar di belakang potret */}
      <svg width="900" height="900" viewBox="0 0 100 100" style={{ position: 'absolute', left: CX - 450, top: CY - 450 }}>
        <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF3C4" /><stop offset="0.5" stopColor="#E9B95A" /><stop offset="1" stopColor="#B07A22" /></linearGradient></defs>
        <g fill={`rgba(${T.d},0.55)`} stroke="url(#cg)" strokeWidth="0.8"><rect x="18" y="18" width="64" height="64" /><rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)" /></g>
      </svg>
      <div style={{ position: 'absolute', left: CX - D / 2 - 14, top: CY - D / 2 - 14, width: D + 28, height: D + 28, borderRadius: '50%', background: 'linear-gradient(160deg, #FFF3C4, #E9B95A 40%, #A8721E 65%, #F6D88A)',
        boxShadow: '0 0 0 8px rgba(255,224,138,0.25), 0 26px 60px rgba(0,0,0,0.5), 0 0 60px rgba(255,214,140,0.5)' }} />
      <div style={{ position: 'absolute', left: CX - D / 2, top: CY - D / 2, width: D, height: D, borderRadius: '50%', overflow: 'hidden', background: `${T.b6}` }}>
        <Photo zoom={0.7} top={-292} w={D} />
      </div>
      <MomentBadge y={CY + D / 2 + 14} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1040, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 60, letterSpacing: '0.16em', color: '#FFFFFF', textShadow: '0 4px 14px rgba(0,0,0,0.55)' }}>{cv.small}</div>
        <Gold3D text={cv.big} size={180} />
      </div>
      {/* kad petikan */}
      <div style={{ position: 'absolute', left: 80, right: 80, top: 1330, padding: '34px 40px 30px', borderRadius: 34, background: `rgba(${T.d},0.78)`, border: '3px solid #E9C46A',
        boxShadow: `0 20px 40px rgba(0,0,0,0.45), inset 0 0 40px rgba(${T.a2},0.15)`, textAlign: 'center' }}>
        <div style={{ position: 'absolute', left: 30, top: -48, fontFamily: FONT.serif, fontSize: 150, lineHeight: 1, color: '#E9C46A' }}>“</div>
        <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 84, lineHeight: 1.1, color: '#FFFFFF', textShadow: `0 0 18px rgba(${T.a},0.5)` }}>{cv.quote}</div>
        <div style={{ marginTop: 14, fontFamily: FONT.sans, fontWeight: 700, fontSize: 28, letterSpacing: '0.3em', color: '#E9C46A' }}>— {cv.question}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1660, display: 'flex', justifyContent: 'center', gap: 12 }}>
        {cv.chips.map((c: { icon: string; t: string }, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px 10px 10px', borderRadius: 50, background: 'rgba(255,255,255,0.14)', border: '2px solid rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LineIcon name={c.icon as IconName} size={32} color={C.charcoal} stroke={8} /></div>
            <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 28, color: '#FFFFFF' }}>{c.t}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** D — SENARAI PESANAN: foto atas bersudut condong + 3 pesanan bernombor */
export const CoverV4D: React.FC = () => {
  const cv = SC.cover;
  const list: string[] = cv.list ?? cv.chips.map((c: { t: string }) => c.t);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: TURQ }}>
      <Star8BG o={0.08} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1060, overflow: 'hidden', clipPath: 'polygon(0 0, 100% 0, 100% 86%, 0 100%)' }}>
        <Photo zoom={1.0} top={-230} w={1080} />
        <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(${T.d},0.7) 0%, rgba(${T.d},0) 22%, rgba(${T.d},0) 70%, rgba(${T.d},0.55) 100%)` }} />
      </div>
      {/* jalur emas condong */}
      <div style={{ position: 'absolute', left: 0, top: 1053, width: 1100, height: 14, background: GOLD, transform: 'rotate(-7.8deg)', transformOrigin: '0 50%', boxShadow: '0 0 24px rgba(255,214,140,0.7)' }} />
      <PremiumLogo />
      <MomentBadge y={262} />
      <div style={{ position: 'absolute', right: 50, top: 860 }}><QPill text={cv.question} rot={-7.8} size={48} /></div>
      <div style={{ position: 'absolute', left: 70, top: 1090, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 54, letterSpacing: '0.14em', color: '#FFFFFF', textShadow: '0 4px 14px rgba(0,0,0,0.5)' }}>{cv.small}</div>
        <Gold3D text={cv.big} size={170} />
      </div>
      <div style={{ position: 'absolute', left: 70, right: 70, top: 1400, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {list.slice(0, 3).map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 92, height: 92, borderRadius: 20, background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 0 #8A5A12',
              fontFamily: FONT.display, fontSize: 80, color: '#2A1C08' }}>{i + 1}</div>
            <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 48, color: '#FFFFFF', textShadow: '0 3px 12px rgba(0,0,0,0.5)' }}>{t}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1800, textAlign: 'center', fontFamily: "'Great Vibes', cursive", fontSize: 60, color: `${T.l2}`, textShadow: `0 0 16px rgba(${T.a},0.6)` }}>“{cv.quote}”</div>
    </AbsoluteFill>
  );
};

/** Bingkai 9:16: tandatangan di atas, SATU panel suntingan, point penting 3D di bawah */
export const Showcase: React.FC = () => {
  const t = useTime();
  const FW = 960;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: `linear-gradient(180deg, ${T.b1} 0%, ${T.b2} 20%, ${T.b3} 45%, ${T.b4} 72%, ${T.b5} 100%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 30% at 50% 0%, rgba(${T.l2rgb},0.7), rgba(0,0,0,0) 70%)` }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 70% 22% at 50% 78%, rgba(255,214,140,0.22), rgba(0,0,0,0) 70%)' }} />
      <PremiumLogo />
      {/* SATU panel suntingan */}
      <div style={{ position: 'absolute', left: 60, top: 262, width: FW, height: FW, borderRadius: 30, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.65)', boxShadow: `0 30px 60px rgba(0,0,0,0.45), 0 0 40px rgba(${T.a},0.35)` }}>
        <div style={{ width: SQ, height: SQ, transform: `scale(${FW / SQ})`, transformOrigin: '0 0' }}>
          <KineticFinal />
        </div>
      </div>
      {/* point penting: tulisan 3D + motion graphics */}
      {PTS.map((p, i) => <Point3D key={i} p={p} idx={i} />)}
      <FollowCTA />
      <MomentBadge y={262} />
      <Audio src={staticFile('audio/mix.wav')} />
    </AbsoluteFill>
  );
};
