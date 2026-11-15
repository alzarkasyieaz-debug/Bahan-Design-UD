import React from 'react';
import { C, FONT, L, tw, ease, easeOut, back, useTime } from '../lib';

/* =====================================================================
 * INFO FX — kesan maklumat/point (Qoute Interaktif v2)
 * Diilhamkan daripada rujukan pengguna (kad bonus 3D kaca, notifikasi UGC,
 * baris pil berserlah + STEP, tag neon, perkataan gergasi). Palet jenama kekal:
 * emas #D8B46A, charcoal #17191D, krim #F7F4ED, teal #406E73.
 * Guna MENGIKUT KESESUAIAN kandungan (lihat STYLE.md §4b).
 * ===================================================================== */

const appear = (t: number, at: number, until: number, fin = 0.45, fout = 0.4) =>
  Math.min(tw(t, [at, at + fin], [0, 1], easeOut), tw(t, [until - fout, until], [1, 0], ease));

/* ------------------------------------------------------------- ikon garis */
import type { IconName } from '../lib';
export type { IconName };

const P: Record<IconName, React.ReactNode> = {
  heart: <path d="M50 82 C20 62 12 46 12 34 C12 22 22 14 32 14 C40 14 46 19 50 26 C54 19 60 14 68 14 C78 14 88 22 88 34 C88 46 80 62 50 82Z" />,
  book: <><path d="M50 26 C40 18 24 18 14 22 V78 C24 74 40 74 50 82 C60 74 76 74 86 78 V22 C76 18 60 18 50 26Z" /><path d="M50 26 V82" /><path d="M24 36 H40 M24 48 H40 M60 36 H76 M60 48 H76" /></>,
  chat: <><path d="M14 22 H86 V66 H44 L28 80 V66 H14Z" /><circle cx="34" cy="44" r="3" /><circle cx="50" cy="44" r="3" /><circle cx="66" cy="44" r="3" /></>,
  check: <><circle cx="50" cy="50" r="36" /><path d="M32 51 L45 64 L70 36" /></>,
  star: <path d="M50 12 L61 38 L88 40 L67 58 L74 86 L50 71 L26 86 L33 58 L12 40 L39 38Z" />,
  play: <><rect x="12" y="20" width="76" height="52" rx="10" /><path d="M43 34 L61 46 L43 58Z" /><path d="M28 84 H72" /></>,
  home: <><path d="M14 48 L50 18 L86 48" /><path d="M24 42 V84 H76 V42" /><path d="M42 84 V62 H58 V84" /></>,
  users: <><circle cx="36" cy="34" r="12" /><path d="M14 82 C14 62 24 54 36 54 C48 54 58 62 58 82" /><circle cx="66" cy="38" r="10" /><path d="M62 56 C76 56 86 64 86 82" /></>,
  phone: <><rect x="28" y="10" width="44" height="80" rx="9" /><path d="M44 78 H56" /></>,
  coin: <><ellipse cx="50" cy="30" rx="30" ry="12" /><path d="M20 30 V50 C20 57 33 62 50 62 C67 62 80 57 80 50 V30" /><path d="M20 50 V70 C20 77 33 82 50 82 C67 82 80 77 80 70 V50" /></>,
  leaf: <><path d="M20 80 C20 40 46 18 84 16 C82 54 60 80 20 80Z" /><path d="M20 80 C38 60 54 46 70 32" /></>,
  moon: <><path d="M62 14 C40 18 26 36 26 54 C26 74 44 88 64 86 C48 78 40 64 40 50 C40 34 50 20 62 14Z" /><path d="M74 30 L77 37 L84 38 L79 43 L80 50 L74 46 L68 50 L69 43 L64 38 L71 37Z" /></>,
  mosque: <><path d="M26 84 V54 C26 38 38 28 50 22 C62 28 74 38 74 54 V84" /><path d="M50 22 V12" /><path d="M14 84 V40 M86 84 V40" /><path d="M10 84 H90" /><path d="M42 84 V66 C42 60 58 60 58 66 V84" /></>,
  hand: <><path d="M30 86 V46 C30 40 38 40 38 46 V30 C38 24 46 24 46 30 V26 C46 20 54 20 54 26 V32 C54 26 62 26 62 32 V40 C62 34 70 34 70 40 V62 C70 76 62 86 50 86Z" /></>,
  calendar: <><rect x="14" y="20" width="72" height="66" rx="10" /><path d="M14 40 H86 M32 12 V28 M68 12 V28" /><path d="M30 56 H40 M46 56 H56 M62 56 H72 M30 70 H40 M46 70 H56" /></>,
  clock: <><circle cx="50" cy="50" r="36" /><path d="M50 28 V50 L66 60" /></>,
  shield: <><path d="M50 12 L82 24 V48 C82 68 68 82 50 88 C32 82 18 68 18 48 V24Z" /><path d="M36 50 L46 60 L66 40" /></>,
  smile: <><circle cx="50" cy="50" r="36" /><circle cx="38" cy="42" r="3" /><circle cx="62" cy="42" r="3" /><path d="M34 58 C42 70 58 70 66 58" /></>,
  bulb: <><path d="M50 12 C32 12 22 26 22 40 C22 52 30 58 34 66 V74 H66 V66 C70 58 78 52 78 40 C78 26 68 12 50 12Z" /><path d="M38 84 H62 M42 74 V66 M58 74 V66" /></>,
  target: <><circle cx="50" cy="50" r="36" /><circle cx="50" cy="50" r="22" /><circle cx="50" cy="50" r="7" /></>,
  family: <><circle cx="30" cy="28" r="10" /><circle cx="70" cy="28" r="10" /><circle cx="50" cy="52" r="7" /><path d="M14 86 C14 62 20 46 30 46 C40 46 44 56 44 66" /><path d="M86 86 C86 62 80 46 70 46 C60 46 56 56 56 66" /><path d="M38 86 C38 72 44 64 50 64 C56 64 62 72 62 86" /></>,
};

export const LineIcon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number }> = ({ name, size = 96, color = C.goldDeep, stroke = 6 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {P[name] ?? P.star}
  </svg>
);

/* --------------------------------------------- 1) KAD IKON 3D KACA (bonus) */
export type IconCardItem = { icon: IconName; text: string; tag?: string; at: number };
/**
 * 2–4 kad kaca krim berbucu emas, diekstrud (3D), condong ke tengah, muncul satu demi satu.
 * Label di dalam kad; pil emas bernombor di bawah (cth. "BONUS 1" / "01").
 */
export const IconCards: React.FC<{ at: number; until: number; items: IconCardItem[]; y?: number; title?: string }> = ({ at, until, items, y = L.cardY + 40, title }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until);
  const n = items.length;
  const w = n >= 4 ? 210 : n === 3 ? 270 : 320;
  const gap = n >= 4 ? 22 : 34;
  const total = n * w + (n - 1) * gap;
  return (
    <div style={{ position: 'absolute', left: 540, top: y, transform: `translate(-50%,-50%)`, width: total, opacity: o, perspective: 1400 }}>
      {title && (
        <div style={{ textAlign: 'center', marginBottom: 18, fontFamily: FONT.sans, fontWeight: 900, fontSize: 34, letterSpacing: '0.18em', color: C.goldLight, textShadow: '0 4px 16px rgba(0,0,0,0.8)' }}>{title}</div>
      )}
      <div style={{ display: 'flex', gap, alignItems: 'flex-start', transformStyle: 'preserve-3d' }}>
        {items.map((it, i) => {
          const p = tw(t, [it.at - 0.05, it.at + 0.5], [0, 1], back);
          const on = t >= it.at - 0.05;
          const side = n === 1 ? 0 : (i - (n - 1) / 2) / ((n - 1) / 2); // -1..1
          const bob = Math.sin((t - it.at) * 2.2 + i) * 6 * Math.min(1, Math.max(0, t - it.at));
          return (
            <div key={i} style={{ width: w, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: on ? Math.min(1, p * 1.4) : 0,
              transform: `translateY(${(1 - p) * 120 + bob}px) rotateY(${-side * 16}deg) rotateX(6deg) scale(${0.7 + 0.3 * p})`, transformStyle: 'preserve-3d' }}>
              <div style={{
                width: w, height: w * 1.12, borderRadius: 30, position: 'relative',
                background: 'linear-gradient(160deg, rgba(255,251,240,0.96) 0%, rgba(247,236,214,0.92) 55%, rgba(232,212,170,0.9) 100%)',
                border: '3px solid rgba(255,226,163,0.95)',
                boxShadow: [
                  'inset 0 3px 0 rgba(255,255,255,0.9)', 'inset 0 -10px 24px rgba(154,106,34,0.25)',
                  '0 2px 0 #E7C67F', '0 4px 0 #D8B46A', '0 6px 0 #C49A4E', '0 8px 0 #B0853C', '0 10px 0 #9A6A22',
                  '0 24px 40px rgba(0,0,0,0.55)', '0 0 40px rgba(216,180,106,0.35)',
                ].join(','),
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 16, overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 60%)',
                  transform: `translateX(${tw(t, [it.at + 0.3, it.at + 1.3], [-120, 120])}%)` }} />
                <div style={{ filter: 'drop-shadow(0 3px 0 rgba(255,255,255,0.9)) drop-shadow(0 -2px 0 rgba(154,106,34,0.35))' }}>
                  <LineIcon name={it.icon} size={w * 0.42} />
                </div>
                <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: n >= 4 ? 28 : 34, lineHeight: 1.08, textAlign: 'center', color: '#7A5420',
                  textShadow: '0 2px 0 rgba(255,255,255,0.85), 0 -1px 0 rgba(0,0,0,0.12)' }}>{it.text}</div>
              </div>
              <div style={{ padding: '10px 26px', borderRadius: 40, background: `linear-gradient(180deg, ${C.goldLight}, ${C.gold} 55%, ${C.goldDeep})`,
                boxShadow: '0 5px 0 #7A5420, 0 10px 24px rgba(0,0,0,0.5)', fontFamily: FONT.sans, fontWeight: 900, fontSize: 30, letterSpacing: '0.04em', color: C.charcoal, whiteSpace: 'nowrap' }}>
                {it.tag ?? String(i + 1).padStart(2, '0')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------- 2) KAD NOTIFIKASI BERTINDAN */
export type NotifyItem = { app: string; icon: IconName; title: string; text: string; time?: string; at: number; tone?: 'gold' | 'teal' | 'charcoal' | 'red' };
const TONE: Record<string, string> = {
  gold: `linear-gradient(145deg, ${C.goldLight}, ${C.gold} 60%, ${C.goldDeep})`,
  teal: 'linear-gradient(145deg, #8FD3CF, #406E73 70%, #2B4D51)',
  charcoal: 'linear-gradient(145deg, #4A4F57, #17191D)',
  red: 'linear-gradient(145deg, #FF9A85, #C0392B 70%, #7E2219)',
};
/** Notifikasi gaya iOS (kaca gelap, ikon aplikasi berwarna, masa di kanan), meluncur masuk satu demi satu */
export const Notify: React.FC<{ at: number; until: number; items: NotifyItem[]; y?: number; badge?: string }> = ({ at, until, items, y = L.cardY, badge }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until);
  const H = 128, G = 18;
  return (
    <div style={{ position: 'absolute', left: 540, top: y, transform: 'translate(-50%,-50%)', width: 900, opacity: o }}>
      {badge && (
        <div style={{ position: 'absolute', right: -6, top: -20, zIndex: 3, padding: '4px 14px', borderRadius: 20, background: '#E0453A', color: '#fff', fontFamily: FONT.sans, fontWeight: 900, fontSize: 26,
          transform: `scale(${tw(t, [items[items.length - 1].at, items[items.length - 1].at + 0.35], [0, 1], back)})` }}>{badge}</div>
      )}
      {items.map((it, i) => {
        const p = tw(t, [it.at - 0.05, it.at + 0.45], [0, 1], back);
        const on = t >= it.at - 0.05;
        return (
          <div key={i} style={{
            height: H, marginBottom: G, borderRadius: 30, display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px',
            background: 'linear-gradient(135deg, rgba(36,39,46,0.80), rgba(23,25,29,0.66))', backdropFilter: 'blur(18px) saturate(1.3)', WebkitBackdropFilter: 'blur(18px) saturate(1.3)',
            border: '1.5px solid rgba(255,255,255,0.14)', boxShadow: '0 14px 40px rgba(0,0,0,0.45)',
            opacity: on ? Math.min(1, p * 1.5) : 0, transform: `translateX(${(1 - p) * 140}px) scale(${0.94 + 0.06 * p})`,
          }}>
            <div style={{ width: 80, height: 80, borderRadius: 22, background: TONE[it.tone ?? 'gold'], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4)' }}>
              <LineIcon name={it.icon} size={52} color="#FFFFFF" stroke={7} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.62)' }}>{it.app}</div>
              <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 34, color: C.white, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <b style={{ fontWeight: 800 }}>{it.title}</b>{it.text ? ` ${it.text}` : ''}
              </div>
            </div>
            {it.time && <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 24, color: 'rgba(255,255,255,0.6)', alignSelf: 'flex-start', marginTop: 26 }}>{it.time}</div>}
          </div>
        );
      })}
    </div>
  );
};

/* ---------------------------------------- 3) BARIS PIL BERSERLAH + STEP */
/** Teks dalam *bintang* diserlahkan dengan kecerunan emas. */
const rich = (s: string, hl: React.CSSProperties) =>
  s.split(/(\*[^*]+\*)/g).filter(Boolean).map((part, i) =>
    part.startsWith('*') ? <span key={i} style={hl}>{part.slice(1, -1)}</span> : <span key={i}>{part}</span>);
export const PillLines: React.FC<{ at: number; until: number; lines: { text: string; at: number }[]; step?: string; y?: number; size?: number }> = ({ at, until, lines, step, y = L.cardY, size = 54 }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until);
  const hl: React.CSSProperties = { background: `linear-gradient(90deg, ${C.goldLight}, ${C.gold} 60%, #F3C778)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontWeight: 900 };
  return (
    <div style={{ position: 'absolute', left: 540, top: y, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: o }}>
      {step && (
        <div style={{ marginBottom: 6, padding: '12px 40px', borderRadius: 60, background: `linear-gradient(180deg, ${C.goldLight}, ${C.gold} 55%, ${C.goldDeep})`,
          boxShadow: '0 6px 0 #7A5420, 0 0 34px rgba(216,180,106,0.6), 0 14px 30px rgba(0,0,0,0.5)', fontFamily: FONT.sans, fontWeight: 900, fontSize: 40, letterSpacing: '0.08em', color: C.charcoal,
          transform: `scale(${tw(t, [at, at + 0.4], [0.6, 1], back)})` }}>{step}</div>
      )}
      {lines.map((ln, i) => {
        const p = tw(t, [ln.at - 0.05, ln.at + 0.4], [0, 1], back);
        return (
          <div key={i} style={{ padding: '10px 34px 14px', borderRadius: 40, background: 'linear-gradient(180deg, rgba(31,28,40,0.94), rgba(23,25,29,0.9))',
            border: '1.5px solid rgba(216,180,106,0.35)', boxShadow: '0 10px 28px rgba(0,0,0,0.5)', fontFamily: FONT.sans, fontWeight: 700, fontSize: size, color: C.cream, whiteSpace: 'nowrap',
            opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px) scale(${0.85 + 0.15 * p})` }}>
            {rich(ln.text, hl)}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------- 4) TAG NEON ✓ */
export const NeonTag: React.FC<{ text: string; at: number; until: number; y?: number; x?: number }> = ({ text, at, until, y = L.subtitleY - 150, x = 540 }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until, 0.3);
  const glow = 0.75 + 0.25 * Math.sin(t * 6);
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${tw(t, [at, at + 0.35], [0.8, 1], back)})`, opacity: o,
      padding: '18px 40px', borderRadius: 60, background: 'rgba(14,16,20,0.88)', border: `3px solid ${C.goldLight}`,
      boxShadow: `0 0 ${18 * glow}px rgba(255,226,163,0.9), 0 0 ${46 * glow}px rgba(216,180,106,0.55), inset 0 0 18px rgba(216,180,106,0.25)`,
      display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
      <svg width="44" height="44" viewBox="0 0 44 44"><path d="M8 23 L18 33 L37 11" fill="none" stroke={C.goldLight} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="42" strokeDashoffset={42 * (1 - tw(t, [at + 0.1, at + 0.5], [0, 1]))} /></svg>
      <span style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 46, letterSpacing: '0.04em', color: C.goldLight, textShadow: `0 0 ${14 * glow}px rgba(255,226,163,0.8)` }}>{text}</span>
    </div>
  );
};

/* ------------------------------------------------ 5) PERKATAAN GERGASI */
export const BigWord: React.FC<{ text: string; at: number; until: number; y?: number; color?: string; size?: number }> = ({ text, at, until, y = L.ceilingY, color = C.gold, size = 230 }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until, 0.25);
  const sc = tw(t, [at, at + 0.35], [1.25, 1], back);
  return (
    <div style={{ position: 'absolute', left: 540, top: y, transform: `translate(-50%,-50%) scale(${sc})`, opacity: o,
      fontFamily: FONT.sans, fontWeight: 900, fontSize: size, lineHeight: 0.9, letterSpacing: '-0.035em', color, whiteSpace: 'nowrap',
      textShadow: '0 8px 30px rgba(0,0,0,0.45)' }}>{text}</div>
  );
};
