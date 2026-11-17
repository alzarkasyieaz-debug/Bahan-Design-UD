import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, FONT, SB } from './lib';
import { LineIcon, IconName } from './components/InfoFX';

/* =====================================================================
 * COVER STYLES v3 — 3 gaya alternatif (1080x1920)
 *   CoverImpak : gaya thumbnail berita/YouTube — sinar emas, figura cut-out bergaris putih,
 *                tajuk gergasi + bar merah condong, nombor besar
 *   CoverPanel : gaya majalah terang — foto dalam kad bertepi emas (condong) + pelekat bulat,
 *                panel krim dengan tajuk Bebas Neue gergasi, penanda emas & senarai 3 point
 *   CoverInfo  : gaya Info FX — latar kabur gelap + grid, figura cut-out bercahaya,
 *                tag neon ✓, tajuk dengan kotak emas, 3 kad ikon kaca 3D di bawah
 * Data: storyboard.json -> "poster" (top, mid, last, banner, num, numLabel, headTop, chinY, faceX)
 *       + "coverFx" { kicker?, hl?, sticker?, items?: [{ icon, text }] }
 * Media: public/media/cover-frame.jpg (bergred) + cover-cutout.png (rembg u2net_human_seg)
 * ===================================================================== */
type Poster = { top: string; mid: string; last: string; banner: string; num: string; numLabel: string; headTop?: number; chinY?: number; faceX?: number };
type Fx = { kicker?: string; hl?: string; sticker?: string; items?: { icon: IconName; text: string }[] };
const P = (SB as unknown as { poster: Poster }).poster;
const FX: Fx = (SB as unknown as { coverFx?: Fx }).coverFx ?? {};
const HEAD = P.headTop ?? 600, CHIN = P.chinY ?? 1300, FACEX = P.faceX ?? 540;
const GOLD = 'linear-gradient(180deg, #FFF6D8 0%, #FFE08A 30%, #F2B33D 62%, #C98A1E 100%)';
const fit = (t: string, w: number, max: number, k = 0.62) => Math.min(max, w / (Math.max(4, t.length) * k));

/** Figura cut-out: kepala bermula di y=top, badan sentiasa sampai ke bawah bingkai. */
const Subject: React.FC<{ top: number; x?: number; minScale?: number; glow?: string; stroke?: string }> = ({ top, x = 540, minScale = 0.9, glow, stroke }) => {
  const s = Math.max(minScale, (1920 - top) / (1920 - HEAD));
  const left = x - FACEX * s;
  const y = top - HEAD * s;
  const f = [
    stroke ? `drop-shadow(0 0 0 ${stroke}) drop-shadow(4px 0 0 ${stroke}) drop-shadow(-4px 0 0 ${stroke}) drop-shadow(0 -4px 0 ${stroke})` : '',
    glow ? `drop-shadow(0 0 40px ${glow})` : '',
    'drop-shadow(0 30px 40px rgba(0,0,0,0.6))',
  ].join(' ');
  return <Img src={staticFile('media/cover-cutout.png')} style={{ position: 'absolute', left, top: y, width: 1080 * s, height: 1920 * s, filter: f }} />;
};
/** Kedudukan dagu selepas Subject diskala (untuk susun atur teks) */
const chinAt = (top: number, minScale = 0.9) => top + (CHIN - HEAD) * Math.max(minScale, (1920 - top) / (1920 - HEAD));

const Brand: React.FC<{ y: number; dark?: boolean }> = ({ y, dark }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
    <svg width="44" height="44" viewBox="0 0 44 44"><rect x="3" y="3" width="38" height="38" rx="10" fill="none" stroke={C.gold} strokeWidth="3.5" /><path d="M17 13 L31 22 L17 31Z" fill={C.gold} /></svg>
    <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 42, color: dark ? C.charcoal : C.white }}>NakSee<span style={{ color: dark ? '#B07D22' : C.gold }}>Heart</span></span>
  </div>
);

/* ======================================================= A) IMPAK */
export const CoverImpak: React.FC = () => {
  const faceTop = 600;
  const chin = chinAt(faceTop);
  const words = (P.mid || '').replace(/\?$/, '');
  return (
    <AbsoluteFill style={{ background: '#120E0A', overflow: 'hidden' }}>
      {/* sinar emas berputar */}
      <AbsoluteFill style={{ background: 'repeating-conic-gradient(from 0deg at 50% 46%, rgba(255,206,110,0.22) 0deg 7deg, rgba(0,0,0,0) 7deg 15deg)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 46%, rgba(255,190,80,0.75) 0%, rgba(201,120,30,0.45) 22%, rgba(18,14,10,0) 58%)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 100%)' }} />
      {/* nombor gergasi di belakang */}
      <div style={{ position: 'absolute', right: -40, top: 520, fontFamily: FONT.display, fontSize: 900, lineHeight: 1, color: 'rgba(255,214,120,0.16)', WebkitTextStroke: '6px rgba(255,214,120,0.45)' }}>{P.num}</div>
      <Subject top={faceTop} x={540} stroke="#FFFFFF" glow="rgba(255,190,80,0.85)" />
      {/* bawah gelap untuk teks */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: chin - 60, bottom: 0, background: 'linear-gradient(180deg, rgba(18,14,10,0) 0%, rgba(18,14,10,0.92) 28%, #120E0A 60%)' }} />
      {/* kicker */}
      <div style={{ position: 'absolute', left: 540, top: 120, transform: 'translate(-50%,0) rotate(-3deg)', padding: '12px 34px', borderRadius: 14, background: '#E23A2A', boxShadow: '0 8px 0 #8E1D13, 0 16px 30px rgba(0,0,0,0.5)',
        fontFamily: FONT.sans, fontWeight: 900, fontSize: 44, color: '#fff', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{FX.kicker ?? 'JANGAN TERSILAP!'}</div>
      {/* tajuk atas */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', fontFamily: FONT.sans, fontWeight: 900, fontSize: fit(P.top, 980, 120, 0.7), lineHeight: 1, color: '#fff',
        letterSpacing: '-0.02em', textShadow: '0 6px 0 #000, 0 0 30px rgba(0,0,0,0.9)', transform: 'skewX(-6deg)' }}>{P.top}</div>
      <div style={{ position: 'absolute', left: 540, top: 360, transform: 'translate(-50%,0) rotate(-2deg) skewX(-6deg)', padding: '6px 34px 14px', background: GOLD, borderRadius: 12,
        boxShadow: '0 10px 0 #7A4A0C, 0 22px 40px rgba(0,0,0,0.6)', fontFamily: FONT.sans, fontWeight: 900, fontSize: fit(words + '?', 940, 130, 0.72), lineHeight: 1.05, color: '#1A1208', whiteSpace: 'nowrap' }}>
        {words}?
      </div>
      {/* tajuk bawah */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: Math.max(chin + 20, 1430), textAlign: 'center' }}>
        <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: fit(P.last, 980, 112, 0.7), lineHeight: 1, color: '#fff', textShadow: '0 6px 0 #000', transform: 'skewX(-6deg)' }}>{P.last}</div>
        <div style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 0 #7A4A0C',
            fontFamily: FONT.display, fontSize: 84, color: '#1A1208', paddingTop: 6 }}>{P.num}</div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 44, color: C.goldLight, whiteSpace: 'nowrap' }}>{P.numLabel}</div>
        </div>
      </div>
      <Brand y={1790} />
    </AbsoluteFill>
  );
};

/* ======================================================= B) PANEL (majalah terang) */
export const CoverPanel: React.FC = () => {
  const photoH = 1060;
  // potong foto supaya wajah di tengah kad
  const s = Math.min(1.5, 820 / (CHIN - HEAD));
  const cx = 470, cy = 560;
  const fy = (HEAD + CHIN) / 2;
  const items = FX.items ?? [];
  const hl = FX.hl ?? P.mid.split(' ').slice(-1)[0].replace('?', '');
  const mid = P.mid.replace('?', '');
  const [pre, post] = mid.includes(hl) ? [mid.slice(0, mid.indexOf(hl)), mid.slice(mid.indexOf(hl) + hl.length)] : [mid + ' ', ''];
  return (
    <AbsoluteFill style={{ background: C.cream, overflow: 'hidden' }}>
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(23,25,29,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(23,25,29,0.05) 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
      <div style={{ position: 'absolute', left: -120, top: -160, width: 1320, height: 1220, background: `linear-gradient(160deg, ${C.charcoal} 0%, #2A2620 100%)`, transform: 'rotate(-6deg)' }} />
      {/* kad foto */}
      <div style={{ position: 'absolute', left: 90, top: 110, width: 900, height: photoH, borderRadius: 40, overflow: 'hidden', transform: 'rotate(-3deg)',
        border: `10px solid ${C.gold}`, boxShadow: '0 30px 60px rgba(0,0,0,0.55), 0 0 0 4px #7A4A0C' }}>
        <Img src={staticFile('media/cover-frame.jpg')} style={{ position: 'absolute', width: 1080 * s, height: 1920 * s, left: cx - FACEX * s, top: cy - fy * s }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 220, background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.55))' }} />
      </div>
      {/* pelekat bulat */}
      <div style={{ position: 'absolute', right: 40, top: 70, width: 220, height: 220, borderRadius: '50%', background: '#E23A2A', transform: 'rotate(12deg)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', border: '6px dashed rgba(255,255,255,0.8)', boxShadow: '0 14px 30px rgba(0,0,0,0.45)', textAlign: 'center' }}>
        <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 34, color: '#fff', lineHeight: 1.05 }}>{FX.sticker ?? 'WAJIB\nTONTON'}</div>
      </div>
      {/* panel teks krim */}
      <div style={{ position: 'absolute', left: 70, right: 70, top: 1170 }}>
        <div style={{ display: 'inline-block', padding: '8px 22px', borderRadius: 10, background: C.charcoal, color: C.goldLight, fontFamily: FONT.sans, fontWeight: 800, fontSize: 34, letterSpacing: '0.12em' }}>{P.top}</div>
        <div style={{ marginTop: 10, fontFamily: FONT.display, fontSize: fit(mid, 940, 220, 0.4), lineHeight: 0.92, color: C.charcoal, letterSpacing: '0.005em' }}>
          {pre}
          <span style={{ position: 'relative', whiteSpace: 'nowrap' }}>
            <span style={{ position: 'absolute', left: -8, right: -8, bottom: 6, height: '42%', background: C.gold, borderRadius: 8, transform: 'skewX(-10deg)', zIndex: 0 }} />
            <span style={{ position: 'relative', color: '#8E1D13' }}>{hl}</span>
          </span>
          {post}?
        </div>
        <div style={{ marginTop: 14, fontFamily: FONT.italic, fontStyle: 'italic', fontSize: 48, color: '#5A4630' }}>{P.banner}</div>
        {items.length > 0 && (
          <div style={{ marginTop: 40, display: 'flex', gap: 16 }}>
            {items.map((it, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '18px 14px', borderRadius: 18, background: '#fff', border: `3px solid ${C.gold}`, boxShadow: '0 6px 0 #D9C59A' }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: C.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <LineIcon name={it.icon} size={38} color={C.goldLight} stroke={8} />
                </div>
                <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 28, lineHeight: 1.1, color: C.charcoal }}>{it.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Brand y={1810} dark />
    </AbsoluteFill>
  );
};

/* ======================================================= C) INFO FX (kaca 3D) */
export const CoverInfo: React.FC = () => {
  const faceTop = 640;
  const items = FX.items ?? [];
  const hl = FX.hl ?? P.mid.split(' ').slice(-1)[0].replace('?', '');
  const head = `${P.top} ${P.mid}`.replace(/\s+/g, ' ');
  const parts = head.split(new RegExp(`(${hl})`));
  return (
    <AbsoluteFill style={{ background: C.charcoal, overflow: 'hidden' }}>
      <Img src={staticFile('media/cover-frame.jpg')} style={{ position: 'absolute', inset: -60, width: 1200, height: 2040, objectFit: 'cover', filter: 'blur(30px) brightness(0.35) saturate(1.2)' }} />
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(216,180,106,0.10) 2px, transparent 2px), linear-gradient(90deg, rgba(216,180,106,0.10) 2px, transparent 2px)', backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse at 50% 55%, black 20%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, black 20%, transparent 75%)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 52%, rgba(216,180,106,0.55) 0%, rgba(64,110,115,0.25) 30%, rgba(0,0,0,0) 60%)' }} />
      {/* cincin cahaya */}
      <div style={{ position: 'absolute', left: 540 - 330, top: faceTop - 60, width: 660, height: 660, borderRadius: '50%', border: `6px solid ${C.goldLight}`, boxShadow: `0 0 40px ${C.gold}, inset 0 0 40px rgba(216,180,106,0.6)` }} />
      <Subject top={faceTop} x={540} glow="rgba(255,226,163,0.9)" />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1330, bottom: 0, background: 'linear-gradient(180deg, rgba(23,25,29,0) 0%, rgba(23,25,29,0.9) 30%, #17191D 70%)' }} />
      {/* tag neon */}
      <div style={{ position: 'absolute', left: 540, top: 110, transform: 'translate(-50%,0)', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 34px', borderRadius: 60,
        background: 'rgba(14,16,20,0.9)', border: `3px solid ${C.goldLight}`, boxShadow: '0 0 20px rgba(255,226,163,0.9), 0 0 50px rgba(216,180,106,0.5)', whiteSpace: 'nowrap' }}>
        <svg width="40" height="40" viewBox="0 0 44 44"><path d="M8 23 L18 33 L37 11" fill="none" stroke={C.goldLight} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 40, color: C.goldLight, letterSpacing: '0.04em' }}>{P.last}</span>
      </div>
      {/* tajuk dengan kotak emas pada kata kunci */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 230, textAlign: 'center', fontFamily: FONT.sans, fontWeight: 900, fontSize: fit(head, 1900, 104, 0.66), lineHeight: 1.18, color: C.white,
        textShadow: '0 6px 24px rgba(0,0,0,0.85)' }}>
        {parts.map((p, i) => p === hl
          ? <span key={i} style={{ display: 'inline-block', padding: '0 18px', margin: '0 6px', borderRadius: 16, background: GOLD, color: C.charcoal, textShadow: 'none', boxShadow: '0 8px 0 #7A4A0C, 0 0 30px rgba(216,180,106,0.7)' }}>{p}</span>
          : <span key={i}>{p}</span>)}
      </div>
      {/* 3 kad kaca */}
      {items.length > 0 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1400, display: 'flex', justifyContent: 'center', gap: 26, perspective: 1200 }}>
          {items.map((it, i) => {
            const side = items.length === 1 ? 0 : (i - (items.length - 1) / 2) / ((items.length - 1) / 2);
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transform: `rotateY(${-side * 16}deg) translateY(${Math.abs(side) * 18}px)` }}>
                <div style={{ width: 280, height: 250, borderRadius: 28, background: 'linear-gradient(160deg, rgba(255,251,240,0.97), rgba(232,212,170,0.92))', border: '3px solid rgba(255,226,163,0.95)',
                  boxShadow: '0 2px 0 #E7C67F, 0 5px 0 #D8B46A, 0 8px 0 #B0853C, 0 11px 0 #9A6A22, 0 26px 40px rgba(0,0,0,0.6), 0 0 34px rgba(216,180,106,0.4)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 14 }}>
                  <LineIcon name={it.icon} size={96} />
                  <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 30, lineHeight: 1.08, textAlign: 'center', color: '#7A5420' }}>{it.text}</div>
                </div>
                <div style={{ padding: '6px 22px', borderRadius: 30, background: GOLD, boxShadow: '0 4px 0 #7A4A0C', fontFamily: FONT.sans, fontWeight: 900, fontSize: 26, color: C.charcoal }}>{String(i + 1).padStart(2, '0')}</div>
              </div>
            );
          })}
        </div>
      )}
      <Brand y={1790} />
    </AbsoluteFill>
  );
};
