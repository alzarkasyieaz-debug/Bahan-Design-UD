import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, FONT, SB } from './lib';

/* =====================================================================
 * COVER "POSTER" — STYLE QOUTE INTERAKTIF (1080x1920)
 * Konsep thumbnail berani: tajuk 3 tingkat (italik tebal, perkataan utama emas dalam kotak gelap),
 * ikon emas + garis kilauan, banner sapuan berus emas, wajah terang, pil nombor bulat emas,
 * lengkung emas & logo ▶ NakSeeHeart.
 * Data: storyboard.json -> "poster" {
 *   frame, icon: 'chat'|'heart'|'check'|'star', top, mid, last, banner, num, numLabel,
 *   headTop, chinY, faceX, maxScale? }   <- kedudukan atas kepala / bawah janggut / tengah wajah dalam bingkai cover (px 1080x1920)
 * Wajah TIDAK ditindih: gambar diskala automatik supaya kepala→janggut muat di antara banner (y≈650)
 * dan pil nombor (y≈1470); tepi yang kosong diisi versi kabur gambar yang sama.
 * ===================================================================== */
type PosterData = {
  frame?: number;
  faceY?: number;
  headTop?: number;
  chinY?: number;
  faceX?: number;
  maxScale?: number;
  icon?: 'chat' | 'heart' | 'check' | 'star';
  top: string;
  mid: string;
  last: string;
  banner: string;
  num: string;
  numLabel: string;
};

const GOLD_FILL = 'linear-gradient(180deg, #FFF6D8 0%, #FFE08A 30%, #F2B33D 60%, #C98A1E 100%)';
const SKEW = 'skewX(-8deg)';

/** Saiz huruf supaya teks muat dalam lebar (anggaran Montserrat 900: huruf besar ≈ 0.78em, campuran huruf kecil ≈ 0.6em) */
const fit = (text: string, width: number, max: number) =>
  Math.min(max, width / (Math.max(4, text.length) * (/[a-z]/.test(text) ? 0.6 : 0.78)));

const GoldText: React.FC<{ text: string; size: number; white?: boolean }> = ({ text, size, white }) => (
  <div style={{ position: 'relative', fontFamily: FONT.sans, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: '-0.01em', transform: SKEW, whiteSpace: 'nowrap' }}>
    {/* extrusion + bayang */}
    <div style={{ color: white ? '#8B7A66' : '#7A4A0C', textShadow: Array.from({ length: 10 }, (_, i) => `${i * 0.7}px ${i * 1.1}px 0 ${white ? '#5E5246' : '#5A3406'}`).join(', ') + ', 0 18px 34px rgba(0,0,0,0.75)' }}>{text}</div>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: white ? 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 55%, #E9E1D3 100%)' : GOLD_FILL,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {text}
    </div>
  </div>
);

const Icon: React.FC<{ kind: PosterData['icon'] }> = ({ kind }) => {
  const g = (
    <defs>
      <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFE9A8" />
        <stop offset="1" stopColor="#D08A1A" />
      </linearGradient>
    </defs>
  );
  if (kind === 'heart')
    return (
      <svg width="150" height="140" viewBox="0 0 48 46">{g}
        <path d="M24 42 C10 32 4 25 4 16.5 4 10 9 5 15.2 5c3.8 0 6.9 2 8.8 5 1.9-3 5-5 8.8-5C39 5 44 10 44 16.5 44 25 38 32 24 42z" fill="url(#pg)" stroke="#5A3406" strokeWidth="1.4" />
        <path d="M11 22h7l3-6 4 12 3-6h9" stroke="#3A2304" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (kind === 'check')
    return (
      <svg width="140" height="140" viewBox="0 0 48 48">{g}
        <rect x="4" y="4" width="40" height="40" rx="11" fill="url(#pg)" stroke="#5A3406" strokeWidth="1.4" />
        <path d="M13 25 L21 33 L36 16" stroke="#2A1A04" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (kind === 'star')
    return (
      <svg width="140" height="140" viewBox="0 0 48 48">{g}
        <path d="M24 3 L29.5 17.5 L45 18 L33 28 L37 43 L24 34.5 L11 43 L15 28 L3 18 L18.5 17.5 Z" fill="url(#pg)" stroke="#5A3406" strokeWidth="1.4" />
      </svg>
    );
  return (
    <svg width="160" height="140" viewBox="0 0 56 48">{g}
      <path d="M8 4 H48 a6 6 0 0 1 6 6 V30 a6 6 0 0 1 -6 6 H24 L12 46 L14 36 H8 a6 6 0 0 1 -6 -6 V10 a6 6 0 0 1 6 -6Z" fill="url(#pg)" stroke="#5A3406" strokeWidth="1.4" />
      <circle cx="17" cy="20" r="3.6" fill="#3A2304" />
      <circle cx="28" cy="20" r="3.6" fill="#3A2304" />
      <circle cx="39" cy="20" r="3.6" fill="#3A2304" />
    </svg>
  );
};

/** Garis kilauan (sparkle burst) */
const Spark: React.FC<{ x: number; y: number; flip?: boolean }> = ({ x, y, flip }) => (
  <svg width="90" height="90" viewBox="0 0 90 90" style={{ position: 'absolute', left: x, top: y, transform: flip ? 'scaleX(-1)' : undefined }}>
    {[[45, 8, 45, 32], [70, 20, 56, 38], [82, 50, 60, 50]].map(([a, b, c, d], i) => (
      <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#F5C451" strokeWidth="7" strokeLinecap="round" />
    ))}
  </svg>
);

/** Banner sapuan berus emas (920x170, berpusat pada x=540) */
const Brush: React.FC<{ text: string; y: number }> = ({ text, y }) => {
  const size = fit(text, 740, 74);
  return (
    <div style={{ position: 'absolute', left: 540 - 460, top: y - 85, width: 920, height: 170, transform: 'rotate(-2deg)' }}>
      <svg width="920" height="170" viewBox="0 0 920 170" style={{ position: 'absolute', inset: 0, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.5))' }}>
        <defs>
          <linearGradient id="br" x1="0" x2="1">
            <stop offset="0" stopColor="#E9B54A" />
            <stop offset="0.5" stopColor="#FFE7A6" />
            <stop offset="1" stopColor="#E3A93C" />
          </linearGradient>
        </defs>
        <path
          d="M30 52 C120 30 260 38 420 34 C600 30 760 26 890 40 L872 58 L905 66 L878 84 L900 98 L870 112 L892 128 C760 140 600 136 430 138 C280 140 140 142 40 128 L58 112 L22 100 L52 86 L18 72 L50 62 Z"
          fill="url(#br)"
        />
        <path d="M60 60 C300 50 600 48 860 58" stroke="rgba(255,255,255,0.45)" strokeWidth="5" fill="none" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: size, color: '#1E1608', transform: SKEW, whiteSpace: 'nowrap', letterSpacing: '-0.01em', marginTop: -4 }}>{text}</div>
      </div>
    </div>
  );
};

export const CoverPoster: React.FC = () => {
  const p = (SB as unknown as { poster: PosterData; cover?: { frame: number; faceY?: number } }).poster;
  // zon wajah bebas grafik: atas kepala di y=HEAD, bawah janggut di y=CHIN
  const HEAD = 655;
  const CHIN = 1468;
  const headTop = p.headTop ?? SB.layout.face.y - 420;
  const chinY = p.chinY ?? SB.layout.face.y + 430;
  const faceX = p.faceX ?? SB.layout.face.x;
  const s = Math.min(p.maxScale ?? 1.1, (CHIN - HEAD) / (chinY - headTop)); // maxScale: naikkan untuk rakaman jarak jauh
  const tx = 540 - faceX * s;
  const ty = HEAD - headTop * s;
  const topSize = fit(p.top, 680, 96);
  const midSize = fit(p.mid, 860, 138);
  const lastSize = fit(p.last, 740, 124);
  return (
    <AbsoluteFill style={{ backgroundColor: C.charcoal, overflow: 'hidden' }}>
      {/* latar kabur (isi tepi) */}
      <AbsoluteFill style={{ transform: 'scale(1.35)', transformOrigin: '50% 45%' }}>
        <Img src={staticFile('media/cover-frame.jpg')} style={{ width: 1080, height: 1920, objectFit: 'cover', filter: 'blur(26px) brightness(0.85) saturate(1.1)' }} />
      </AbsoluteFill>
      {/* gambar utama: kepala→janggut dalam zon bebas grafik */}
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: '0 0' }}>
        <Img
          src={staticFile('media/cover-frame.jpg')}
          style={{
            width: 1080,
            height: 1920,
            objectFit: 'cover',
            filter: 'none', // gred warna standard dibakar oleh tools/grade_frame.py
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 13%, black 87%, transparent 100%)',
            maskImage: 'linear-gradient(90deg, transparent 0%, black 13%, black 87%, transparent 100%)',
          }}
        />
      </AbsoluteFill>
      {/* cahaya hangat pada wajah, gelap di atas (tajuk) & bawah (pil) */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 55% 30% at 50% 50%, rgba(255,214,150,0.18), rgba(0,0,0,0) 70%)', mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(10,9,8,0.9) 0%, rgba(10,9,8,0.78) 26%, rgba(10,9,8,0.25) 34%, rgba(0,0,0,0) 37%, rgba(0,0,0,0) 74%, rgba(10,9,8,0.6) 80%, rgba(10,9,8,0.94) 100%)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)' }} />

      {/* ikon + kilauan */}
      <div style={{ position: 'absolute', left: 62, top: 66, transform: 'rotate(-8deg) scale(0.9)', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.6)) drop-shadow(0 0 18px rgba(245,196,81,0.45))' }}>
        <Icon kind={p.icon ?? 'chat'} />
      </div>
      <Spark x={905} y={50} />

      {/* tajuk 3 tingkat */}
      <div style={{ position: 'absolute', left: 560, top: 170, transform: 'translate(-50%,-50%)' }}>
        <GoldText text={p.top} size={topSize} white />
      </div>
      <div style={{ position: 'absolute', left: 540, top: 300, transform: 'translate(-50%,-50%)' }}>
        <div style={{ position: 'absolute', left: -40, right: -40, top: -14, bottom: -18, borderRadius: 26, background: 'linear-gradient(180deg, rgba(30,24,16,0.92), rgba(16,13,9,0.86))', border: '2px solid rgba(245,196,81,0.55)', boxShadow: '0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)', transform: SKEW }} />
        <div style={{ position: 'relative' }}><GoldText text={p.mid} size={midSize} /></div>
      </div>
      <div style={{ position: 'absolute', left: 540, top: 440, transform: 'translate(-50%,-50%)' }}>
        <GoldText text={p.last} size={lastSize} white />
      </div>
      {/* garis emas bawah tajuk */}
      <div style={{ position: 'absolute', left: 190, width: 700, top: 515, height: 3, background: 'linear-gradient(90deg, rgba(245,196,81,0), #F5C451, rgba(245,196,81,0))', boxShadow: '0 0 14px #F5C451' }} />
      <Brush text={p.banner} y={575} />

      {/* pil nombor */}
      <div style={{ position: 'absolute', left: 540, top: 1565, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 22, padding: '10px 46px 10px 10px', borderRadius: 120, background: 'linear-gradient(180deg, rgba(28,22,14,0.92), rgba(12,10,7,0.9))', border: '3px solid #E9B54A', boxShadow: '0 18px 46px rgba(0,0,0,0.65), 0 0 30px rgba(233,181,74,0.45), inset 0 1px 0 rgba(255,255,255,0.12)' }}>
        <div style={{ width: 132, height: 132, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #3A2C16, #120D06)', border: '5px solid #F2C35A', boxShadow: '0 0 24px rgba(242,195,90,0.6), inset 0 0 18px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GoldText text={p.num} size={100} />
        </div>
        <GoldText text={p.numLabel} size={fit(p.numLabel, 520, 80)} white />
      </div>

      {/* lengkung emas */}
      <svg width="1080" height="260" viewBox="0 0 1080 260" style={{ position: 'absolute', left: 0, top: 1680 }}>
        <defs>
          <linearGradient id="sw" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(245,196,81,0)" />
            <stop offset="0.5" stopColor="#FFE29A" />
            <stop offset="1" stopColor="rgba(245,196,81,0)" />
          </linearGradient>
        </defs>
        <path d="M-40 230 C260 120 820 120 1120 230" stroke="url(#sw)" strokeWidth="7" fill="none" />
        <path d="M-40 255 C300 160 780 160 1120 255" stroke="url(#sw)" strokeWidth="3" fill="none" opacity="0.7" />
      </svg>
      {/* logo */}
      <div style={{ position: 'absolute', left: 540, top: 1712, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 150, height: 2, background: 'linear-gradient(90deg, rgba(245,196,81,0), #F5C451)' }} />
        <svg width="46" height="46" viewBox="0 0 46 46">
          <rect x="2" y="2" width="42" height="42" rx="12" fill="none" stroke="#F5C451" strokeWidth="4" />
          <path d="M18 13 L33 23 L18 33 Z" fill="#F5C451" />
        </svg>
        <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 46, color: C.white, letterSpacing: '0.01em' }}>
          NakSee<span style={{ color: '#F5C451' }}>Heart</span>
        </div>
        <div style={{ width: 150, height: 2, background: 'linear-gradient(90deg, #F5C451, rgba(245,196,81,0))' }} />
      </div>
    </AbsoluteFill>
  );
};
