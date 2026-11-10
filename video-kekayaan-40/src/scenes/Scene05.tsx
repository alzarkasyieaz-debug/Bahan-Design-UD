import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Bokeh, LightRays, Particles, tw, useT, easeOut } from '../components/core';

// BABAK 5 — KELUARGA: gambar keluarga (inspirasi utama infografik) dengan dolly-in,
// rack focus, slow parallax dan cinematic bloom.
export const Scene05: React.FC = () => {
  const t = useT();
  const zoom = tw(t, [0, 10], [1.0, 1.13]);
  const focus = tw(t, [0, 1.8], [10, 0], easeOut);
  const driftX = tw(t, [0, 10], [18, -18]);
  const img = staticFile('img/keluarga-tengah.jpg');
  const photoStyle: React.CSSProperties = {
    position: 'absolute',
    width: 1352,
    height: 1920,
    left: -136,
    top: 0,
    objectFit: 'cover',
  };
  return (
    <AbsoluteFill style={{ backgroundColor: '#cfe0f3', overflow: 'hidden' }}>
      {/* latar: versi kabur untuk mengisi ruang atas */}
      <AbsoluteFill style={{ transform: `scale(${1.25 + (zoom - 1) * 0.5}) translateX(${driftX * 0.4}px)`, filter: 'blur(36px) brightness(1.05) saturate(1.1)' }}>
        <Img src={img} style={photoStyle} />
      </AbsoluteFill>
      {/* foto utama, dianjak ke bawah supaya wajah bebas daripada tajuk & subtitle */}
      <AbsoluteFill
        style={{
          transform: `translate(${driftX}px, 250px) scale(${zoom})`,
          transformOrigin: '50% 40%',
          filter: `blur(${focus}px) saturate(1.05) contrast(1.03)`,
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 260px)',
        }}
      >
        <Img src={img} style={photoStyle} />
      </AbsoluteFill>
      {/* bloom sinematik */}
      <AbsoluteFill
        style={{
          transform: `translate(${driftX}px, 250px) scale(${zoom})`,
          transformOrigin: '50% 40%',
          filter: 'blur(26px) brightness(1.3)',
          opacity: 0.32,
          mixBlendMode: 'screen',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 260px)',
        }}
      >
        <Img src={img} style={photoStyle} />
      </AbsoluteFill>
      {/* cahaya hangat menyelinap masuk (biru -> mula keemasan) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at 85% 25%, rgba(255,226,170,${0.35 + 0.1 * Math.sin(t)}) 0%, rgba(255,226,170,0) 70%)`,
          mixBlendMode: 'screen',
        }}
      />
      <LightRays x={1000} y={200} angle={-35} spread={40} count={7} opacity={0.22} seed="s5r" />
      <Particles count={30} seed="s5p" rise={7} />
      <Bokeh count={8} seed="s5b" opacity={0.35} minR={50} maxR={120} area={[0, 1350, 1080, 600]} blur={12} />
    </AbsoluteFill>
  );
};
