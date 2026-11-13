import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { C, FONT, L, tw, ease, easeOut, back, useTime } from '../lib';
import { Dust } from './Effects';

/** Zon kad motion graphics (ruang skrin): di bawah janggut, di atas subtitle. */
export const CARD_Y = L.cardY;

/* ------------------------------------------------------------------ asas */
const appear = (t: number, at: number, until: number, fin = 0.45, fout = 0.4) =>
  Math.min(tw(t, [at, at + fin], [0, 1], easeOut), tw(t, [until - fout, until], [1, 0], ease));

const glass: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(23,25,29,0.78), rgba(23,25,29,0.58))',
  backdropFilter: 'blur(14px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.2)',
  border: '1.5px solid rgba(216,180,106,0.55)',
  borderRadius: 26,
  boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 22px rgba(216,180,106,0.18)',
};

export const IconCheck: React.FC<{ size?: number; p?: number }> = ({ size = 44, p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="20" fill="#406E73" stroke="#9FE0D8" strokeWidth="2" />
    <path d="M12 23 L19 30 L33 15" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="34" strokeDashoffset={34 * (1 - p)} />
  </svg>
);
export const IconCross: React.FC<{ size?: number; p?: number }> = ({ size = 44, p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="20" fill="#8E2A1C" stroke="#FFB4A2" strokeWidth="2" />
    <path d="M14 14 L30 30" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="23" strokeDashoffset={23 * (1 - Math.min(1, p * 2))} />
    <path d="M30 14 L14 30" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="23" strokeDashoffset={23 * (1 - Math.max(0, p * 2 - 1))} />
  </svg>
);
const IconFriends: React.FC<{ size?: number }> = ({ size = 54 }) => (
  <svg width={size} height={size} viewBox="0 0 54 54" fill={C.goldLight}>
    <circle cx="18" cy="15" r="7" /><path d="M6 44 Q6 26 18 26 Q30 26 30 44Z" />
    <circle cx="36" cy="15" r="7" opacity="0.8" /><path d="M24 44 Q24 26 36 26 Q48 26 48 44Z" opacity="0.8" />
  </svg>
);

/** Cip bertajuk ringkas dengan ikon (cth. "BILA JUMPA KAWAN LAMA") */
export const Chip: React.FC<{ text: string; at: number; until: number; y?: number; icon?: 'friends' | 'none' }> = ({ text, at, until, y = CARD_Y, icon = 'friends' }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until);
  return (
    <div style={{ position: 'absolute', left: 500, top: y, transform: `translate(-50%,-50%) translateY(${(1 - o) * 30}px) scale(${0.92 + o * 0.08})`, opacity: o, ...glass, padding: '14px 30px', display: 'flex', alignItems: 'center', gap: 16 }}>
      {icon === 'friends' && <IconFriends size={50} />}
      <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 36, letterSpacing: '0.06em', color: C.white, whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  );
};

/** Kaunter nombor + slot bernombor yang menunggu (cth. "3 KEADAAN") */
export const Counter: React.FC<{ at: number; until: number; count?: number; label?: string }> = ({ at, until, count: n = 3, label = 'KEADAAN' }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until);
  const count = Math.min(n, Math.floor(tw(t, [at, at + 0.8], [0, n + 0.99])));
  return (
    <div style={{ position: 'absolute', left: 500, top: CARD_Y, transform: 'translate(-50%,-50%)', opacity: o, ...glass, padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 22 }}>
      <div style={{ fontFamily: FONT.display, fontSize: 92, lineHeight: 1, color: C.goldLight, textShadow: `0 0 18px ${C.gold}`, width: 56, textAlign: 'center' }}>{count}</div>
      <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 34, color: C.white, letterSpacing: '0.08em', marginRight: 6 }}>{label}</div>
      {Array.from({ length: n }).map((_, i) => {
        const p = tw(t, [at + 0.3 + i * 0.25, at + 0.75 + i * 0.25], [0, 1], back);
        return (
          <div key={i} style={{ width: 70, height: 70, borderRadius: 18, border: `2px solid rgba(216,180,106,${0.4 + 0.5 * p})`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`, fontFamily: FONT.display, fontSize: 40, color: C.cream, background: 'rgba(216,180,106,0.08)' }}>
            0{i + 1}
          </div>
        );
      })}
    </div>
  );
};

/** Meter mood: jarum jatuh dari "cantik" ke "tak cantik" */
export const Meter: React.FC<{ at: number; until: number; dropAt: number; label?: string; good?: string; bad?: string }> = ({ at, until, dropAt, label = 'MOOD', good = 'CANTIK', bad = 'TAK CANTIK' }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until);
  const v = tw(t, [dropAt, dropAt + 1.4], [0.85, 0.12], ease); // 1 = baik
  const ang = -90 + v * 180;
  const col = v > 0.5 ? '#9FE0D8' : '#FF9C84';
  return (
    <div style={{ position: 'absolute', left: 500, top: CARD_Y, transform: 'translate(-50%,-50%)', opacity: o, ...glass, padding: '12px 30px', display: 'flex', alignItems: 'center', gap: 24 }}>
      <svg width="150" height="86" viewBox="0 0 150 86">
        <defs>
          <linearGradient id="mg" x1="0" x2="1">
            <stop offset="0" stopColor="#E0533A" /><stop offset="0.5" stopColor="#D8B46A" /><stop offset="1" stopColor="#5FBFB2" />
          </linearGradient>
        </defs>
        <path d="M12 78 A63 63 0 0 1 138 78" fill="none" stroke="url(#mg)" strokeWidth="12" strokeLinecap="round" />
        <g transform={`translate(75 78) rotate(${ang})`}>
          <path d="M-4 0 L0 -58 L4 0Z" fill="#fff" />
        </g>
        <circle cx="75" cy="78" r="7" fill="#fff" />
      </svg>
      <div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 30, letterSpacing: '0.14em', color: C.cream }}>{label}</div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 40, color: col, transition: 'none', whiteSpace: 'nowrap' }}>{v > 0.5 ? good : bad}</div>
      </div>
    </div>
  );
};

/** Perbandingan dua lajur (✓ / ✗) — item muncul ikut masa sebutan */
export const Compare: React.FC<{
  at: number;
  until: number;
  left: { title: string; items: { text: string; at: number }[]; good?: boolean };
  right: { title: string; items: { text: string; at: number }[]; good?: boolean };
  arrow?: boolean;
}> = ({ at, until, left, right, arrow }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until);
  const Col: React.FC<{ c: typeof left; side: number }> = ({ c, side }) => {
    const first = c.items.length ? c.items[0].at : 9999;
    const co = tw(t, [first - 0.1, first + 0.35], [0, 1], easeOut);
    return (
      <div style={{ flex: 1, opacity: co, transform: `translateX(${(1 - co) * side * 40}px)`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 24, letterSpacing: '0.2em', color: c.good ? '#9FE0D8' : '#FFB4A2' }}>{c.title}</div>
        {c.items.map((it, i) => {
          const p = tw(t, [it.at - 0.05, it.at + 0.35], [0, 1], back);
          if (t < it.at - 0.05) return null;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, transform: `scale(${0.8 + 0.2 * p})`, transformOrigin: '0 50%', opacity: Math.min(1, p * 1.5) }}>
              {c.good ? <IconCheck size={38} p={p} /> : <IconCross size={38} p={p} />}
              <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 30, color: C.white, lineHeight: 1.1 }}>{it.text}</span>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div style={{ position: 'absolute', left: 500, top: CARD_Y, width: 880, transform: `translate(-50%,-50%) translateY(${(1 - o) * 26}px)`, opacity: o, ...glass, padding: '16px 26px', display: 'flex', gap: 18, alignItems: 'stretch' }}>
      <Col c={left} side={-1} />
      <div style={{ width: 2, background: 'linear-gradient(180deg, rgba(216,180,106,0), rgba(216,180,106,0.8), rgba(216,180,106,0))', position: 'relative' }}>
        {arrow && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 44, height: 44, borderRadius: '50%', background: C.charcoal, border: `2px solid ${C.gold}`, color: C.goldLight, fontFamily: FONT.sans, fontWeight: 900, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</div>
        )}
      </div>
      <Col c={right} side={1} />
    </div>
  );
};

/** Senarai semak: chip menyala satu demi satu */
export const Checklist: React.FC<{ title: string; at: number; until: number; items: { text: string; at: number }[] }> = ({ title, at, until, items }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until);
  return (
    <div style={{ position: 'absolute', left: 500, top: CARD_Y, transform: `translate(-50%,-50%) translateY(${(1 - o) * 26}px)`, opacity: o, ...glass, padding: '14px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 24, letterSpacing: '0.2em', color: C.goldLight, whiteSpace: 'nowrap' }}>{title}</div>
      <div style={{ display: 'flex', gap: 14 }}>
        {items.map((it, i) => {
          const p = tw(t, [it.at - 0.05, it.at + 0.35], [0, 1], back);
          const on = t >= it.at - 0.05;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 16, border: `2px solid ${on ? C.gold : 'rgba(255,255,255,0.18)'}`, background: on ? 'rgba(216,180,106,0.16)' : 'rgba(255,255,255,0.04)', transform: `scale(${on ? 0.9 + 0.1 * p : 0.92})`, boxShadow: on ? `0 0 ${18 * p}px rgba(216,180,106,0.5)` : 'none' }}>
              <IconCheck size={32} p={on ? p : 0} />
              <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 30, color: on ? C.white : 'rgba(255,255,255,0.45)' }}>{it.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Gelembung chat (contoh gurauan penceramah) dengan cap ✗ "TAK KENA TEMPAT" */
export const ChatBubble: React.FC<{ text: string; at: number; until: number; stampAt: number; stamp: string }> = ({ text, at, until, stampAt, stamp }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until);
  const sp = tw(t, [stampAt, stampAt + 0.3], [0, 1], back);
  const wob = t > stampAt ? Math.sin((t - stampAt) * 28) * 4 * Math.max(0, 1 - (t - stampAt) * 2.5) : 0;
  return (
    <div style={{ position: 'absolute', left: 470, top: CARD_Y, transform: `translate(-50%,-50%) translateX(${wob}px) scale(${0.85 + 0.15 * o})`, opacity: o }}>
      <div style={{ ...glass, borderRadius: '28px 28px 28px 6px', padding: '16px 30px', fontFamily: FONT.sans, fontWeight: 800, fontSize: 36, color: C.white, whiteSpace: 'nowrap' }}>
        <span style={{ color: C.goldLight, fontFamily: FONT.italic, fontSize: 50, lineHeight: 0 }}>{'“'}</span>
        {text}
        <span style={{ color: C.goldLight, fontFamily: FONT.italic, fontSize: 50, lineHeight: 0 }}>{'”'}</span>
      </div>
      {t >= stampAt && (
        <div style={{ position: 'absolute', right: -40, top: -46, transform: `rotate(-8deg) scale(${sp})`, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 12, background: '#8E2A1C', border: '2px solid #FFB4A2', fontFamily: FONT.sans, fontWeight: 900, fontSize: 22, color: '#fff', letterSpacing: '0.08em', whiteSpace: 'nowrap', boxShadow: '0 6px 20px rgba(0,0,0,0.5)' }}>
          <IconCross size={26} /> {stamp}
        </div>
      )}
    </div>
  );
};

/** Khalayak ramai: barisan siluet muncul satu demi satu + label */
export const Crowd: React.FC<{ at: number; until: number; label: string }> = ({ at, until, label }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until);
  return (
    <div style={{ position: 'absolute', left: 500, top: CARD_Y, transform: 'translate(-50%,-50%)', opacity: o, ...glass, padding: '12px 26px', display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width="300" height="80" viewBox="0 0 300 80">
        {Array.from({ length: 9 }).map((_, i) => {
          const p = tw(t, [at + 0.1 + i * 0.07, at + 0.45 + i * 0.07], [0, 1], back);
          const x = 18 + i * 33;
          const s = 0.75 + random(`cr${i}`) * 0.35;
          return (
            <g key={i} transform={`translate(${x} ${80 - (1 - p) * 30}) scale(${s * p})`} fill={i === 4 ? C.goldLight : 'rgba(246,235,217,0.75)'}>
              <circle cx="0" cy="-48" r="9" />
              <path d="M-14 0 Q-14 -34 0 -34 Q14 -34 14 0Z" />
            </g>
          );
        })}
      </svg>
      <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 30, color: C.white, lineHeight: 1.15, whiteSpace: 'pre-line' }}>{label}</div>
    </div>
  );
};

/** Rekap bernombor (timeline reveal) dalam zon atas — good: ikon ✓ (sifat/amalan baik), lalai ✗ (perkara dielakkan) */
export const RecapList: React.FC<{ at: number; until: number; items: string[]; good?: boolean }> = ({ at, until, items, good }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until);
  return (
    <div style={{ position: 'absolute', left: 540, top: L.recapY, transform: 'translate(-50%,-50%)', opacity: o, display: 'flex', flexDirection: 'column', gap: 10, width: 760 }}>
      {items.map((it, i) => {
        const a = at + 0.35 + i * 0.55;
        const p = tw(t, [a, a + 0.45], [0, 1], easeOut);
        const hi = t >= a && t < a + 0.9 ? tw(t, [a, a + 0.9], [1, 0]) : 0;
        return (
          <div key={i} style={{ ...glass, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateX(${(1 - p) * -80}px)`, boxShadow: `0 10px 30px rgba(0,0,0,0.45), 0 0 ${10 + hi * 30}px rgba(216,180,106,${0.2 + hi * 0.5})` }}>
            <div style={{ fontFamily: FONT.display, fontSize: 52, lineHeight: 1, color: C.goldLight, width: 60 }}>0{i + 1}</div>
            <div style={{ flex: 1, fontFamily: FONT.sans, fontWeight: 800, fontSize: 34, color: C.white, letterSpacing: '0.03em' }}>{it}</div>
            {good ? <IconCheck size={38} p={p} /> : <IconCross size={38} p={p} />}
          </div>
        );
      })}
    </div>
  );
};

/** Cip kemajuan (cth. LEBIH BAIK • LEBIH LANCAR) dengan bar kemajuan naik */
export const ProgressChips: React.FC<{ at: number; until: number; items: { text: string; at: number }[] }> = ({ at, until, items }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until);
  return (
    <div style={{ position: 'absolute', left: 500, top: CARD_Y, transform: 'translate(-50%,-50%)', opacity: o, display: 'flex', gap: 16 }}>
      {items.map((it, i) => {
        const p = tw(t, [it.at - 0.05, it.at + 0.6], [0, 1], easeOut);
        if (t < it.at - 0.05) return null;
        return (
          <div key={i} style={{ ...glass, padding: '12px 22px', minWidth: 300, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 20}px)` }}>
            <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 32, color: C.white, letterSpacing: '0.06em' }}>{it.text}</div>
            <div style={{ marginTop: 8, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
              <div style={{ width: `${p * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.teal}, ${C.gold})`, boxShadow: `0 0 12px ${C.gold}` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Nadi hati lembut (HATI / UKHUWAH) */
export const HeartPulse: React.FC<{ at: number; until: number; x: number; y: number; size?: number }> = ({ at, until, x, y, size = 90 }) => {
  const t = useTime();
  if (t < at - 0.05 || t > until + 0.05) return null;
  const o = appear(t, at, until);
  const beat = 1 + 0.1 * Math.max(0, Math.sin((t - at) * 5.5)) ** 6;
  const ring = ((t - at) * 0.9) % 1;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${(0.6 + 0.4 * tw(t, [at, at + 0.4], [0, 1], back)) * beat})`, opacity: o }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: size * (1 + ring), height: size * (1 + ring), transform: 'translate(-50%,-50%)', borderRadius: '50%', border: `2px solid rgba(216,180,106,${0.6 * (1 - ring)})` }} />
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ filter: `drop-shadow(0 0 14px ${C.gold})` }}>
        <defs>
          <linearGradient id="hp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE9B8" /><stop offset="1" stopColor="#D8B46A" /></linearGradient>
        </defs>
        <path d="M24 42 C10 32 4 25 4 16.5 4 10 9 5 15.2 5c3.8 0 6.9 2 8.8 5 1.9-3 5-5 8.8-5C39 5 44 10 44 16.5 44 25 38 32 24 42z" fill="url(#hp)" />
      </svg>
    </div>
  );
};

/**
 * B-roll ilustrasi "media sosial": telefon bercahaya, gelembung chat & ikon reaksi
 * terapung (tanpa teks rekaan), parallax + push-in. Jelas ilustrasi, bukan rakaman sebenar.
 */
export const SocialBroll: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const t = useTime();
  const p = tw(t, [from, to], [0, 1], (x) => x);
  const push = 1 + p * 0.08;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: 'radial-gradient(ellipse 80% 60% at 50% 45%, #2a3d40 0%, #17191D 70%)' }}>
      <AbsoluteFill style={{ background: `repeating-radial-gradient(circle at 50% 45%, rgba(216,180,106,0.05) 0 2px, rgba(0,0,0,0) 2px 46px)`, transform: `scale(${1 + p * 0.2})` }} />
      <div style={{ position: 'absolute', left: 540, top: 900, transform: `translate(-50%,-50%) scale(${push}) rotate(${-6 + p * 4}deg)` }}>
        <div style={{ width: 380, height: 760, borderRadius: 56, background: 'linear-gradient(160deg, #2b2f35, #0d0e10)', border: '3px solid rgba(216,180,106,0.6)', boxShadow: '0 30px 90px rgba(0,0,0,0.7), 0 0 60px rgba(216,180,106,0.25)', padding: 20 }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 40, background: 'linear-gradient(180deg, #1f3336, #12191b)', overflow: 'hidden', position: 'relative' }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const a = from + 0.2 + i * 0.45;
              const q = tw(t, [a, a + 0.4], [0, 1], back);
              const mine = i % 2 === 1;
              const w = 140 + random(`b${i}`) * 140;
              return (
                <div key={i} style={{ position: 'absolute', top: 40 + i * 92 - p * 120, [mine ? 'right' : 'left']: 22, width: w, height: 58, borderRadius: mine ? '22px 22px 6px 22px' : '22px 22px 22px 6px', background: mine ? 'rgba(216,180,106,0.85)' : 'rgba(247,244,237,0.85)', transform: `scale(${q})`, transformOrigin: mine ? '100% 100%' : '0 100%', opacity: q, padding: '14px 18px' }}>
                  <div style={{ height: 8, width: '80%', borderRadius: 4, background: 'rgba(23,25,29,0.35)' }} />
                  <div style={{ height: 8, width: '55%', borderRadius: 4, background: 'rgba(23,25,29,0.25)', marginTop: 8 }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {['👋', '❤️', '😊', '👍', '🤝'].map((e, i) => {
        const a = from + 0.4 + i * 0.6;
        const life = t - a;
        if (life < 0) return null;
        const x = 200 + random(`e${i}`) * 680;
        const y = 1300 - life * 220;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, fontSize: 70, opacity: tw(life, [0, 0.3, 2.2, 3], [0, 1, 1, 0]), transform: `scale(${tw(life, [0, 0.4], [0.4, 1], back)})` }}>{e}</div>;
      })}
      <Dust count={30} opacity={0.6} seed="sosial" />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0) 50%, rgba(5,8,10,0.65) 100%)' }} />
    </AbsoluteFill>
  );
};
