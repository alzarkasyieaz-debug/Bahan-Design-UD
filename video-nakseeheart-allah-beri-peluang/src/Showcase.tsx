import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { B, TL, C, FONT, f, tw, ease, easeOut, back, useTime } from './lib';
import { Subtitles } from './components/Subtitles';
import { HeartMark } from './components/LowerThird';
import { LineIcon, IconName } from './components/InfoFX';

/* =====================================================================
 * SHOWCASE FINAL / RAW + suntingan KINETIC TYPOGRAPHY
 * Diilhamkan oleh video rujukan pengguna ("RECENT WORK"): logo & nama di atas,
 * panel FINAL (suntingan) besar, panel RAW (rakaman asal) serentak di bawah, label neon.
 * FINAL = suntingan semula format segi empat: wajah penceramah diselang-seli dengan
 *         kad grafik skrin penuh (perkataan besar, pilihan, cincin, siluet, jubin 1-2-3, sorotan).
 * Masa daripada timeline.json (EDL sama dengan video asal); audio = public/audio/mix.wav.
 * ===================================================================== */

const SQ = 1080;
const FACE = { x: 540, y: 1050 };
const GOLD = 'linear-gradient(180deg, #FFF6D8 0%, #FFE08A 35%, #F2B33D 70%, #C98A1E 100%)';
const BG = 'radial-gradient(circle at 50% 42%, #1E6E72 0%, #0E3F45 45%, #061A1D 100%)';

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
  | { k: 'spot'; a: number; b: number; big: string; small: string; sub: string; icon: IconName }
  | { k: 'cta'; a: number; b: number };

const S: Scene[] = [
  { k: 'side', a: 0.15, b: B.flashToBody - 0.1, small: 'ALLAH SAHAJA', big: 'TEMPAT TERBAIK' },
  { k: 'word', a: 6.9, b: 9.7, small: 'ALLAH SENTIASA BERI', big: 'PELUANG', box: true },
  { k: 'side', a: 10.2, b: 12.9, small: 'UNTUK', big: 'MEMBETULKAN', right: true },
  { k: 'versus', a: 15.2, b: 18.1, title: 'TIDAK KIRA', left: 'SENGAJA', right: 'TIDAK SENGAJA', at2: 17.0 },
  { k: 'ring', a: 25.8, b: 28.6, small: 'ALLAH', big: 'MAHA MENYAYANGI', icon: 'heart' },
  { k: 'side', a: 30.1, b: 32.7, small: 'WALAU SEBANYAK MANA', big: 'KEKHILAFAN' },
  { k: 'silhouette', a: 32.8, b: 35.0, lines: ['MASIH', 'ADA', 'RUANG'] },
  { k: 'word', a: 38.7, b: 41.8, big: 'JANGAN', lines: ['PUTUS ASA'], box: true },
  { k: 'list', a: 43.2, b: 48.9, title: 'WALAUPUN KERAP', items: [{ t: 'GAGAL', at: 43.4 }, { t: 'BERDEPAN MASALAH', at: 47.7 }] },
  { k: 'side', a: 51.6, b: 56.9, small: 'SETIAP PERKARA', big: 'ALLAH ATURKAN', right: true },
  { k: 'tiles', a: 57.1, b: 64.3, title: 'ALLAH MENUNGGU', items: [{ n: '1', t: 'DOA', at: 59.2 }, { n: '2', t: 'CERITA', at: 61.3 }, { n: '3', t: 'KONGSI', at: 62.7 }] },
  { k: 'spot', a: 64.45, b: 74.05, small: 'ALLAH SAHAJA', big: 'TEMPAT TERBAIK', sub: 'UNTUK KITA MENGADU', icon: 'mosque' },
  { k: 'side', a: 75.7, b: 78.2, small: 'DENGAN', big: 'KEYAKINAN' },
  { k: 'ring', a: 78.3, b: 82.8, small: 'INSYAALLAH', big: 'ALLAH BANTU', icon: 'hand' },
  { k: 'tiles', a: 83.6, b: 91.0, title: 'YANG PENTING, JAGA', items: [{ n: '1', t: 'KETAATAN', at: 84.9 }, { n: '2', t: 'KEYAKINAN', at: 87.6 }] },
  { k: 'silhouette', a: 91.2, b: 93.5, lines: ['TIDAK', 'SIA-SIAKAN', 'HAMBA-NYA'] },
  { k: 'side', a: 93.6, b: 96.6, small: 'SETIAP', big: 'UJIAN', right: true },
  { k: 'word', a: 96.7, b: 100.0, small: 'ALLAH TAHU', big: 'KITA MAMPU', box: true },
  { k: 'side', a: 100.05, b: 100.8, small: '', big: 'PERCAYALAH' },
  { k: 'cta', a: 100.8, b: B.end },
];

const Card: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (
  <AbsoluteFill style={{ opacity: o, background: BG }}>
    <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(120,255,235,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(120,255,235,0.07) 2px, transparent 2px)', backgroundSize: '90px 90px' }} />
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 45%, rgba(64,224,208,0.30), rgba(0,0,0,0) 55%)' }} />
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
          <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(6,26,29,0.88) 0%, rgba(6,26,29,0.55) 22%, rgba(0,0,0,0) 40%)' }} />
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
                <div key={i} style={{ fontFamily: FONT.display, fontSize: i === 1 ? (l.length > 8 ? 104 : 140) : 96, lineHeight: 0.95, color: i === 1 ? '#0F8C86' : C.charcoal,
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
            <Small text={s.sub} t={t} a={B.mengadu as number - 0.3} size={42} />
          </div>
        </Card>
      );
    }
    case 'cta':
      return (
        <Card o={o}>
          <div style={center}>
            <HeartMark size={120} t={t} />
            <Big text="SETIAP NASIHAT" size={120} t={t} a={s.a + 0.3} />
            <Big text="ADA MAKNA." size={170} t={t} a={s.a + 0.7} />
            <Small text="FOLLOW @NAKSEEHEART" t={t} a={s.a + 1.2} size={44} />
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
  const s = (idx % 2 === 0 ? 1.0 : 1.12) + tw(t, [0, 106], [0, 0.04]);
  const ty = SQ / 2 - FACE.y * s, tx = SQ / 2 - FACE.x * s;
  return (
    <AbsoluteFill style={{ background: '#061A1D', overflow: 'hidden' }}>
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
const PTS: Point[] = [
  { a: 0, b: 6.9, small: 'ALLAH SAHAJA', big: 'TEMPAT TERBAIK', icon: 'mosque' },
  { a: 6.9, b: 15.2, small: 'ALLAH SENTIASA BERI', big: 'PELUANG', chips: [{ t: 'Membetulkan kesilapan', at: 10.3 }], icon: 'star' },
  { a: 15.2, b: 25.8, small: 'TIDAK KIRA', big: 'SENGAJA ATAU TIDAK', icon: 'check' },
  { a: 25.8, b: 30.1, small: 'ALLAH', big: 'MAHA MENYAYANGI', icon: 'heart' },
  { a: 30.1, b: 38.7, small: 'WALAU BANYAK KEKHILAFAN', big: 'MASIH ADA RUANG', chips: [{ t: 'Sebagai hamba', at: 34.6 }, { t: 'Sebagai manusia', at: 36.3 }], icon: 'hand' },
  { a: 38.7, b: 51.6, small: 'JANGAN SESEKALI', big: 'PUTUS ASA', chips: [{ t: 'Walau kerap gagal', at: 43.3 }, { t: 'Walau banyak masalah', at: 47.7 }], icon: 'shield' },
  { a: 51.6, b: 64.45, small: 'ALLAH SENTIASA', big: 'MENUNGGU KITA', chips: [{ t: 'Doa', at: 59.3 }, { t: 'Bercerita', at: 61.4 }, { t: 'Berkongsi', at: 62.8 }], icon: 'clock' },
  { a: 64.45, b: 75.7, small: 'TEMPAT TERBAIK', big: 'UNTUK MENGADU', icon: 'chat' },
  { a: 75.7, b: 83.6, small: 'DENGAN KEYAKINAN', big: 'ALLAH BANTU', icon: 'hand' },
  { a: 83.6, b: 91.2, small: 'YANG PENTING, JAGA', big: 'KETAATAN & KEYAKINAN', chips: [{ t: 'Ketaatan', at: 85.0 }, { t: 'Keyakinan', at: 87.7 }], icon: 'shield' },
  { a: 91.2, b: 93.6, small: 'ALLAH TIDAK', big: 'SIA-SIAKAN HAMBA-NYA', icon: 'heart' },
  { a: 93.6, b: 100.8, small: 'SETIAP UJIAN', big: 'KITA MAMPU', icon: 'target' },
];

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
      <div style={{ position: 'absolute', left: 540, top: 1290, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * pin})`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 74, height: 74, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 0 #7A4A0C, 0 0 24px rgba(255,214,140,0.7)' }}>
          <LineIcon name={p.icon} size={48} color={C.charcoal} stroke={8} />
        </div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 36, letterSpacing: '0.18em', color: '#E9FFFB', textShadow: '0 3px 12px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>{p.small}</div>
      </div>
      {/* tulisan 3D emas */}
      <div style={{ position: 'absolute', left: 540, top: 1440 + bob, transform: `translate(-50%,-50%) perspective(1200px) rotateX(${(1 - pin) * 60 + 12}deg) scale(${0.85 + 0.15 * pin})`, whiteSpace: 'nowrap' }}>
        <div style={{ position: 'relative', fontFamily: FONT.display, fontSize: size, lineHeight: 1, letterSpacing: '0.02em' }}>
          <div style={{ color: '#7A4A0C', textShadow: Array.from({ length: 12 }, (_, i) => `0 ${i * 1.3}px 0 #5A3406`).join(', ') + ', 0 24px 40px rgba(0,0,0,0.55)' }}>{p.big}</div>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: GOLD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{p.big}</div>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(110deg, rgba(255,255,255,0) ${30 + ((t - p.a) * 40) % 140 - 40}%, rgba(255,255,255,0.75) ${38 + ((t - p.a) * 40) % 140 - 40}%, rgba(255,255,255,0) ${46 + ((t - p.a) * 40) % 140 - 40}%)`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{p.big}</div>
        </div>
      </div>
      {/* cip point */}
      {p.chips && (
        <div style={{ position: 'absolute', left: 540, top: 1590, transform: 'translate(-50%,-50%)', display: 'flex', gap: 16 }}>
          {p.chips.map((c, i) => {
            const q = tw(t, [c.at - 0.1, c.at + 0.35], [0, 1], back);
            return (
              <div key={i} style={{ padding: '12px 26px', borderRadius: 40, background: 'rgba(6,26,29,0.75)', border: `2px solid ${C.goldLight}`, opacity: Math.min(1, q * 1.5),
                transform: `translateY(${(1 - q) * 30}px) scale(${0.8 + 0.2 * q})`, boxShadow: '0 0 20px rgba(120,255,235,0.35)', display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
                <svg width="30" height="30" viewBox="0 0 44 44"><path d="M10 23 L19 32 L35 13" fill="none" stroke={C.goldLight} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 34, color: '#FFFFFF' }}>{c.t}</span>
              </div>
            );
          })}
        </div>
      )}
      {/* penanda kemajuan */}
      <div style={{ position: 'absolute', left: 540, top: 1690, transform: 'translate(-50%,-50%)', display: 'flex', gap: 10 }}>
        {PTS.map((_, i) => <div key={i} style={{ width: i === idx ? 40 : 12, height: 12, borderRadius: 6, background: i <= idx ? C.goldLight : 'rgba(233,255,251,0.3)' }} />)}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- CTA: butang Follow TikTok + klik */
const CLICK = B.cta + 2.0;
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
  const cx = 540 + 150 + (1 - cur) * 330, cy = 1525 + (1 - cur) * 330;
  const curO = tw(t, [B.cta + 1.0, B.cta + 1.2], [0, 1]) * tw(t, [CLICK + 0.9, CLICK + 1.3], [1, 0]);
  const rip = tw(t, [CLICK, CLICK + 0.7], [0, 1], easeOut);
  return (
    <AbsoluteFill>
      {/* kapsyen tandatangan */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1265, textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontFamily: "'Great Vibes', cursive", fontSize: 84, lineHeight: 1.2, color: '#FFFFFF', padding: '0 30px', whiteSpace: 'nowrap',
          textShadow: '0 0 20px rgba(120,255,235,0.6), 0 4px 12px rgba(0,0,0,0.4)', clipPath: `inset(-30% ${100 - capIn * 100}% -30% -5%)` }}>
          Nasihat Dari <span style={{ color: '#FFE08A' }}>Hati</span> Untuk <span style={{ color: '#FFE08A' }}>Hati</span>
        </div>
      </div>
      {/* butang Follow TikTok */}
      <div style={{ position: 'absolute', left: 540, top: 1480, transform: `translate(-50%,-50%) scale(${btnIn * press * pulse})`, opacity: Math.min(1, btnIn * 1.5) }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 760 * (0.6 + rip * 0.8), height: 150 * (0.6 + rip * 1.6), borderRadius: 120,
          transform: 'translate(-50%,-50%)', border: '4px solid rgba(191,255,245,0.9)', opacity: done ? 1 - rip : 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '22px 46px 22px 26px', borderRadius: 80, whiteSpace: 'nowrap',
          background: done ? 'linear-gradient(180deg,#2FD9C6,#14908C)' : '#0B0B0F', border: `3px solid ${done ? '#BFFFF5' : 'rgba(255,255,255,0.85)'}`,
          boxShadow: `0 ${10 * press}px 0 ${done ? '#0B5357' : '#000'}, 0 18px 40px rgba(0,0,0,0.5), 0 0 30px rgba(37,244,238,0.45)` }}>
          <div style={{ width: 92, height: 92, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.25)' }}>
            <TikTokGlyph size={64} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
            <span style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 52, color: '#FFFFFF', letterSpacing: '0.02em' }}>{done ? 'Following' : 'Follow'}</span>
            <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 32, color: done ? '#E9FFFB' : '#25F4EE' }}>@nakseeheart</span>
          </div>
          <div style={{ width: 70, height: 70, borderRadius: '50%', marginLeft: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: done ? '#FFFFFF' : '#FE2C55' }}>
            {done
              ? <svg width="44" height="44" viewBox="0 0 44 44"><path d="M10 23 L19 32 L35 13" fill="none" stroke="#14908C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              : <svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 8v24M8 20h24" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" /></svg>}
          </div>
        </div>
      </div>
      {/* hati terbang selepas klik */}
      {done && Array.from({ length: 8 }, (_, i) => {
        const q = tw(t, [CLICK + i * 0.05, CLICK + 1.2 + i * 0.05], [0, 1], easeOut);
        const ang = -Math.PI / 2 + (i - 3.5) * 0.32;
        return <div key={i} style={{ position: 'absolute', left: 540 + Math.cos(ang) * 320 * q, top: 1440 + Math.sin(ang) * 220 * q, opacity: (1 - q) * (q > 0 ? 1 : 0),
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
const PremiumLogo: React.FC = () => {
  const t = useTime();
  const em = tw(t, [0.05, 0.9], [0, 1], back);
  const wm = tw(t, [0.4, 1.4], [0, 1], ease);
  const line = tw(t, [0.9, 1.7], [0, 1], ease);
  const sh = ((t * 0.35) % 1) * 260 - 80; // kilauan
  const S0 = 176;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 38, height: 196, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30,
      filter: 'drop-shadow(0 6px 10px rgba(4,40,44,0.45))' }}>
      {/* medalion */}
      <div style={{ width: S0, height: S0, position: 'relative', transform: `scale(${em}) rotate(${(1 - em) * -40}deg)` }}>
        <svg width={S0} height={S0} viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <linearGradient id="lg-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFF3C4" /><stop offset="0.45" stopColor="#E9B95A" /><stop offset="0.7" stopColor="#B07A22" /><stop offset="1" stopColor="#F6D88A" />
            </linearGradient>
            <radialGradient id="lg-core" cx="0.45" cy="0.38" r="0.7">
              <stop offset="0" stopColor="#1C7A7C" /><stop offset="0.6" stopColor="#0B4A4E" /><stop offset="1" stopColor="#062A2E" />
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
            <path d="M11 22h7l3-6 4 12 3-6h9" stroke="#0B3B3E" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, bottom: -20, left: `${sh}%`, width: '22%', transform: 'skewX(-20deg)',
            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))' }} />
        </div>
      </div>
      {/* tanda kata */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: wm, transform: `translateX(${(1 - wm) * 30}px)` }}>
        <div style={{ position: 'relative', fontFamily: FONT.serif, fontWeight: 800, fontSize: 78, letterSpacing: '0.1em', lineHeight: 1, whiteSpace: 'nowrap' }}>
          <span style={{ position: 'absolute', inset: 0, color: '#0B3B3E', transform: 'translate(0, 4px)' }}>NAKSEEHEART</span>
          <span style={{ position: 'relative', backgroundImage: GOLDTXT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>NAKSEEHEART</span>
          <span style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${sh}%, rgba(255,255,255,0.9) ${sh + 8}%, rgba(255,255,255,0) ${sh + 16}%)`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>NAKSEEHEART</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
          <div style={{ width: 150 * line, height: 2, background: 'linear-gradient(90deg, rgba(246,216,138,0), #F6D88A)' }} />
          <div style={{ width: 12, height: 12, transform: `rotate(45deg) scale(${line})`, background: '#F6D88A', boxShadow: '0 0 10px rgba(255,224,138,0.9)' }} />
          <div style={{ width: 150 * line, height: 2, background: 'linear-gradient(90deg, #F6D88A, rgba(246,216,138,0))' }} />
        </div>
        <div style={{ marginTop: 12, fontFamily: FONT.sans, fontWeight: 600, fontSize: 24, letterSpacing: '0.42em', color: '#062A2E', opacity: line, whiteSpace: 'nowrap' }}>NASIHAT · DARI · HATI</div>
      </div>
    </div>
  );
};

/** Bingkai 9:16: tandatangan di atas, SATU panel suntingan, point penting 3D di bawah */
export const Showcase: React.FC = () => {
  const t = useTime();
  const FW = 960;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: 'linear-gradient(180deg, #7FF0E2 0%, #33C9BD 20%, #14908C 45%, #0B5357 72%, #062A2E 100%)' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 30% at 50% 0%, rgba(230,255,250,0.7), rgba(0,0,0,0) 70%)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 70% 22% at 50% 78%, rgba(255,214,140,0.22), rgba(0,0,0,0) 70%)' }} />
      <PremiumLogo />
      {/* SATU panel suntingan */}
      <div style={{ position: 'absolute', left: 60, top: 260, width: FW, height: FW, borderRadius: 30, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.65)', boxShadow: '0 30px 60px rgba(0,0,0,0.45), 0 0 40px rgba(120,255,235,0.35)' }}>
        <div style={{ width: SQ, height: SQ, transform: `scale(${FW / SQ})`, transformOrigin: '0 0' }}>
          <KineticFinal />
        </div>
      </div>
      {/* point penting: tulisan 3D + motion graphics */}
      {PTS.map((p, i) => <Point3D key={i} p={p} idx={i} />)}
      <FollowCTA />
      {/* label neon */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1810, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: FONT.sans, fontWeight: 700, fontSize: 52, letterSpacing: '0.06em', color: '#E9FFFB',
          textShadow: `0 0 ${12 + 6 * Math.sin(t * 3)}px rgba(120,255,235,0.95), 0 0 34px rgba(64,224,208,0.85)` }}>
          <span style={{ width: 6, height: 66, background: '#BFFFF5', boxShadow: '0 0 16px rgba(120,255,235,1)' }} />
          SHARING MOMENT
          <span style={{ width: 6, height: 66, background: '#BFFFF5', boxShadow: '0 0 16px rgba(120,255,235,1)' }} />
        </div>
      </div>
      <Audio src={staticFile('audio/mix.wav')} />
    </AbsoluteFill>
  );
};
