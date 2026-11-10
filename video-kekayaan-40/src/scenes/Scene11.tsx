import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Bokeh, LensFlare, LightRays, Particles, tw, useT, ease } from '../components/core';

// BABAK 11 — KESYUKURAN: keluarga duduk bersama, tangan saling menggenggam — golden hour.
// Bermula rapat pada tangan yang menggenggam, kemudian pull-back perlahan kepada seluruh keluarga.
export const Scene11: React.FC = () => {
  const t = useT();
  const zoom = tw(t, [0, 9.5], [1.55, 1.05], ease);
  const swell = tw(t, [5.5, 9], [0, 1]);
  const img = staticFile('img/keluarga-tengah.jpg');
  const photo: React.CSSProperties = { position: 'absolute', width: 1352, height: 1920, left: -136, top: 0, objectFit: 'cover' };
  const grade = 'sepia(0.5) saturate(1.6) hue-rotate(-6deg) brightness(1.06) contrast(1.05)';
  const mask = 'linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 260px)';
  const tf = `translate(0px, 250px) scale(${zoom})`;
  return (
    <AbsoluteFill style={{ backgroundColor: '#e8b878', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(1.3)`, filter: `blur(40px) ${grade}` }}>
        <Img src={img} style={photo} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: tf, transformOrigin: '72% 46%', filter: grade, WebkitMaskImage: mask }}>
        <Img src={img} style={photo} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: tf, transformOrigin: '72% 46%', filter: `blur(24px) brightness(1.35) ${grade}`, opacity: 0.3 + swell * 0.15, mixBlendMode: 'screen', WebkitMaskImage: mask }}>
        <Img src={img} style={photo} />
      </AbsoluteFill>
      {/* cahaya golden hour */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 80% 55% at 95% 30%, rgba(255,196,110,0.65) 0%, rgba(255,170,80,0) 70%)',
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(255,170,70,0.18), rgba(120,60,20,0.18))', mixBlendMode: 'multiply' }} />
      <AbsoluteFill style={{ backgroundColor: '#ff9636', opacity: 0.38, mixBlendMode: 'soft-light' }} />
      <AbsoluteFill style={{ backgroundColor: '#ffb45a', opacity: 0.16, mixBlendMode: 'color' }} />
      <LightRays x={1060} y={250} angle={-48} spread={40} count={9} opacity={0.3} seed="s11r" color="#ffe1a8" />
      <LensFlare x={1000} y={330} opacity={0.4} />
      {/* partikel cahaya yang indah – memuncak bersama muzik */}
      <Particles count={40 + Math.round(swell * 40)} seed="s11p" rise={12} color="#ffe7b0" size={3.6} opacity={0.6 + swell * 0.4} />
      <Bokeh count={14} seed="s11b" opacity={0.3 + swell * 0.2} color="#ffd590" blur={8} />
    </AbsoluteFill>
  );
};
