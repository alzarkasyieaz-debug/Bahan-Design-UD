import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, FONT, SB } from './lib';
import { Text3D } from './components/Text3D';
import { TikTokIcon, HeartMark } from './components/LowerThird';
import { Dust, Grain, Vignette } from './components/Effects';

/* =====================================================================
 * COVER / THUMBNAIL — STYLE QOUTE INTERAKTIF (1080x1920, satu bingkai)
 * Data: storyboard.json -> "cover" { frame, kicker, big, line2, tag, bigSize?, line2Size?, faceY? }
 * Latar: public/media/cover-frame.jpg (diekstrak oleh scripts/cover.sh daripada speaker.mp4)
 * Zon selamat grid profil TikTok (3:4 tengah): y 240–1680. Tajuk & jenama berada di dalamnya.
 * ===================================================================== */
type CoverData = { frame: number; kicker: string; big: string; line2: string; tag?: string; bigSize?: number; line2Size?: number; faceY?: number };

export const Cover: React.FC = () => {
  const cv = (SB as unknown as { cover: CoverData }).cover;
  const face = { x: SB.layout.face.x, y: cv.faceY ?? SB.layout.face.y }; // faceY: laras jika wajah dalam bingkai cover berbeza
  // zum 1.22 dengan wajah diletakkan sekitar y≈1180 (ruang atas untuk tajuk)
  const s = 1.22;
  const tx = Math.min(0, Math.max(1080 - 1080 * s, 540 - face.x * s));
  const ty = Math.min(0, Math.max(1920 - 1920 * s, 1180 - face.y * s));
  const big = cv.bigSize ?? 250;
  return (
    <AbsoluteFill style={{ backgroundColor: C.charcoal, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: '0 0' }}>
        <Img src={staticFile('media/cover-frame.jpg')} style={{ width: 1080, height: 1920, objectFit: 'cover', filter: 'none' }} />
      </AbsoluteFill>
      {/* gred: atas gelap (ruang tajuk), cahaya emas belakang tajuk, bawah gelap (jenama) */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(14,15,18,0.92) 0%, rgba(14,15,18,0.82) 22%, rgba(14,15,18,0.35) 38%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 70%, rgba(14,15,18,0.85) 92%)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 62% 16% at 50% 23%, rgba(216,180,106,0.32), rgba(216,180,106,0) 70%)', mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(216,180,106,0.18) 0%, rgba(0,0,0,0) 40%, rgba(64,110,115,0.22) 100%)', mixBlendMode: 'soft-light' }} />
      <Dust count={40} opacity={0.7} seed="cover" area={[150, 900]} />

      {/* kicker */}
      <div style={{ position: 'absolute', left: 540, top: 300, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 70, height: 3, background: `linear-gradient(90deg, rgba(216,180,106,0), ${C.gold})` }} />
        <div style={{ fontFamily: FONT.serif, fontWeight: 800, fontSize: 46, letterSpacing: '0.22em', color: C.goldLight, whiteSpace: 'nowrap', textShadow: '0 4px 18px rgba(0,0,0,0.8)' }}>{cv.kicker}</div>
        <div style={{ width: 70, height: 3, background: `linear-gradient(90deg, ${C.gold}, rgba(216,180,106,0))` }} />
      </div>
      {/* tajuk utama 3D */}
      <Text3D text={cv.big} at={-10} x={540} y={300 + 40 + big * 0.5} size={big} depth={24} rotX={10} float={false} sweep={false} />
      <Text3D text={cv.line2} at={-10} x={540} y={300 + 70 + big + (cv.line2Size ?? 100) * 0.45} size={cv.line2Size ?? 100} fill="cream" depth={12} rotX={8} float={false} sweep={false} />
      {cv.tag && (
        <div style={{ position: 'absolute', left: 540, top: 300 + 120 + big + (cv.line2Size ?? 100), transform: 'translate(-50%,-50%)', fontFamily: FONT.italic, fontStyle: 'italic', fontSize: 50, color: C.cream, whiteSpace: 'nowrap', textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
          {cv.tag}
        </div>
      )}

      {/* jenama */}
      <div style={{ position: 'absolute', left: 540, top: 1585, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 22, padding: '16px 30px', borderRadius: 30, background: 'linear-gradient(135deg, rgba(23,25,29,0.82), rgba(23,25,29,0.62))', border: `1.5px solid rgba(216,180,106,0.7)`, boxShadow: '0 12px 40px rgba(0,0,0,0.55), 0 0 30px rgba(216,180,106,0.25)' }}>
        <HeartMark size={56} t={0} />
        <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 46, color: C.white, letterSpacing: '0.02em' }}>
          NakSee<span style={{ color: C.gold }}>Heart</span>
        </div>
        <div style={{ width: 2, height: 46, background: 'rgba(216,180,106,0.6)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TikTokIcon size={34} />
          </div>
          <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 34, color: C.goldLight }}>@NakSeeHeart</span>
        </div>
      </div>
      <Vignette strength={0.45} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
