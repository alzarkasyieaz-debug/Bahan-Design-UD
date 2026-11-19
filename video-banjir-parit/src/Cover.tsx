import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { CINZEL, GOLD, GOLD_GRAD, POPPINS, depth3D } from './components/Typography';
import { FilmGrain, Vignette } from './components/FX';

/** Cover 9:16 — "BANJIR MELANDA, MEREKA PERLUKAN KITA!" atas syot sebenar wanita meredah banjir. */
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <AbsoluteFill style={{ transform: 'scale(1.16) translateY(100px)', filter: 'saturate(0.8) contrast(1.08) brightness(0.92)' }}>
      <Img src={staticFile('img/cover-bg.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: 'rgb(52,78,104)', mixBlendMode: 'soft-light', opacity: 0.5 }} />
    <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 38%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 85%, rgba(0,0,0,0.9) 100%)' }} />
    <Vignette strength={0.55} />

    <div style={{ position: 'absolute', top: 230, left: 60, right: 60, textAlign: 'center' }}>
      <div style={{ display: 'inline-block', padding: '10px 26px', borderRadius: 40, background: 'rgba(215,55,47,0.92)', fontFamily: POPPINS, fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: '0.12em' }}>RAYUAN KEMANUSIAAN</div>
      <div style={{ fontFamily: POPPINS, fontWeight: 800, fontSize: 132, lineHeight: 1.0, color: '#fff', marginTop: 34, textShadow: depth3D(8, 'rgba(60,80,100,0.95)') }}>
        BANJIR<br />MELANDA,
      </div>
      <div style={{ fontFamily: POPPINS, fontWeight: 800, fontSize: 104, lineHeight: 1.05, marginTop: 22, backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 4px 0 #b37a1c) drop-shadow(0 8px 0 #8a5a12) drop-shadow(0 18px 26px rgba(0,0,0,0.7))' }}>
        MEREKA<br />PERLUKAN KITA!
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 300, left: 60, right: 60, textAlign: 'center' }}>
      <div style={{ width: 300, height: 3, margin: '0 auto 26px', background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
      <div style={{ fontFamily: POPPINS, fontWeight: 600, fontSize: 40, color: '#fff', textShadow: '0 3px 12px rgba(0,0,0,0.8)' }}>Rayuan Sumbangan Mangsa Banjir</div>
      <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 54, letterSpacing: '0.12em', color: GOLD, marginTop: 8, textShadow: '0 3px 12px rgba(0,0,0,0.8)' }}>PARLIMEN PARIT</div>
      <div style={{ fontFamily: POPPINS, fontWeight: 500, fontSize: 26, color: 'rgba(255,255,255,0.8)', marginTop: 18, letterSpacing: '0.06em' }}>PUSAT KHIDMAT MASYARAKAT AHLI PARLIMEN PARIT</div>
    </div>
    <FilmGrain opacity={0.08} />
  </AbsoluteFill>
);
