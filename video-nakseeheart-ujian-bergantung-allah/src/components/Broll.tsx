import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { C, tw, ease, useTime } from '../lib';
import { Dust } from './Effects';

/**
 * B-roll ilustrasi (bukan rakaman sebenar): suasana subuh/senja, siluet masjid,
 * sinar cahaya bergerak, burung, kamera push-in + parallax 2.5D.
 */
export const SpiritualBroll: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const t = useTime();
  const p = tw(t, [from, to], [0, 1], (x) => x);
  const push = 1.04 + p * 0.1;
  const L = (depth: number): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    transform: `translateY(${(1 - depth) * p * 26 - depth * p * 10}px) scale(${1 + (push - 1) * (0.4 + depth)})`,
    transformOrigin: '50% 62%',
  });
  const sun = tw(t, [from, to], [0.85, 1.1], ease);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#0e1d22' }}>
      {/* langit */}
      <div
        style={{
          ...L(0),
          background:
            'linear-gradient(180deg, #0f2830 0%, #24484d 26%, #7d6a52 46%, #e7a65a 58%, #ffd99a 64%, #f6c37a 70%, #5a3d22 100%)',
        }}
      />
      {/* matahari & halo */}
      <div
        style={{
          ...L(0.1),
          background: `radial-gradient(circle at 50% 61%, rgba(255,250,225,1) 0%, rgba(255,232,170,0.95) ${3 * sun}%, rgba(255,196,110,0.55) ${11 * sun}%, rgba(255,170,90,0) ${34 * sun}%)`,
        }}
      />
      {/* sinar cahaya (god rays) */}
      <div
        style={{
          ...L(0.15),
          background: `repeating-conic-gradient(from ${t * 3}deg at 50% 61%, rgba(255,226,163,0.16) 0deg 4deg, rgba(255,226,163,0) 4deg 13deg)`,
          maskImage: 'radial-gradient(circle at 50% 61%, black 0%, rgba(0,0,0,0.6) 30%, transparent 62%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 61%, black 0%, rgba(0,0,0,0.6) 30%, transparent 62%)',
          mixBlendMode: 'screen',
        }}
      />
      {/* burung */}
      <div style={L(0.2)}>
        {Array.from({ length: 7 }).map((_, i) => {
          const r = (k: string) => random(`bird-${i}-${k}`);
          const bx = 120 + r('x') * 700 + (t - from) * (22 + r('v') * 18);
          const by = 520 + r('y') * 260 - (t - from) * 4;
          const flap = Math.sin(t * (7 + r('f') * 3) + i) * 7;
          const s = 0.6 + r('s') * 0.7;
          return (
            <svg key={i} width={40 * s} height={20 * s} viewBox="0 0 40 20" style={{ position: 'absolute', left: bx, top: by }}>
              <path d={`M0 ${10 - flap * 0.3} Q10 ${2 - flap} 20 10 Q30 ${2 - flap} 40 ${10 - flap * 0.3}`} stroke="#2b1e14" strokeWidth="2.6" fill="none" />
            </svg>
          );
        })}
      </div>
      {/* bukit jauh */}
      <svg style={L(0.35)} width="1080" height="1920" viewBox="0 0 1080 1920">
        <path d="M0 1240 Q180 1170 360 1215 T720 1190 T1080 1220 V1920 H0Z" fill="#6b4a2c" opacity="0.65" />
      </svg>
      {/* masjid siluet */}
      <svg style={L(0.55)} width="1080" height="1920" viewBox="0 0 1080 1920">
        <g fill="#20150d">
          {/* menara kiri & kanan */}
          {[250, 830].map((mx) => (
            <g key={mx}>
              <rect x={mx - 16} y={830} width={32} height={430} />
              <rect x={mx - 24} y={960} width={48} height={14} />
              <rect x={mx - 22} y={1080} width={44} height={12} />
              <path d={`M${mx - 18} 832 Q${mx} 770 ${mx + 18} 832Z`} />
              <rect x={mx - 2} y={742} width={4} height={36} />
              <path d={`M${mx + 8} 728 a12 12 0 1 0 0 20 a9 9 0 1 1 0 -20Z`} />
            </g>
          ))}
          {/* kubah utama */}
          <path d="M380 1060 Q380 900 540 860 Q700 900 700 1060Z" />
          <rect x={537} y={800} width={6} height={64} />
          <path d="M552 778 a16 16 0 1 0 0 28 a12 12 0 1 1 0 -28Z" />
          {/* kubah sisi */}
          <path d="M300 1120 Q300 1040 370 1025 Q440 1040 440 1120Z" />
          <path d="M640 1120 Q640 1040 710 1025 Q780 1040 780 1120Z" />
          {/* badan */}
          <rect x={290} y={1060} width={500} height={220} />
          {/* gerbang bercahaya */}
          {[360, 450, 540, 630, 720].map((ax, i) => (
            <path
              key={ax}
              d={`M${ax - 26} 1280 V1170 Q${ax} 1120 ${ax + 26} 1170 V1280Z`}
              fill={`rgba(255,${200 - i * 4},120,${0.55 + 0.25 * Math.sin(t * 1.5 + i)})`}
            />
          ))}
        </g>
      </svg>
      {/* tanah hadapan */}
      <svg style={L(0.9)} width="1080" height="1920" viewBox="0 0 1080 1920">
        <path d="M0 1300 Q270 1255 540 1290 T1080 1280 V1920 H0Z" fill="#120c07" />
        {/* siluet seorang bermuhasabah (duduk tasyahhud) */}
        <g fill="#0a0704" transform="translate(170 1218) scale(1.05)">
          <circle cx="40" cy="8" r="13" />
          <path d="M22 26 Q40 16 58 26 L64 70 Q66 84 80 86 L84 96 H6 L10 80 Q20 72 22 60Z" />
          <rect x="-30" y="94" width="150" height="8" rx="3" fill="#3a2414" />
        </g>
      </svg>
      <Dust count={50} opacity={0.85} seed="broll" area={[500, 1500]} />
      {/* kabus hangat bawah */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(14,10,6,0.85) 100%)' }} />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 55%, rgba(0,0,0,0) 50%, rgba(5,8,10,0.6) 100%)',
        }}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 1, background: C.gold, opacity: 0 }} />
    </AbsoluteFill>
  );
};

/** Siluet orang berjalan (parametrik) */
const Walker: React.FC<{ x: number; y: number; scale: number; phase: number; t: number; armOver?: boolean; songkok?: boolean }> = ({
  x,
  y,
  scale,
  phase,
  t,
  armOver,
  songkok,
}) => {
  const step = Math.sin(t * 4.2 + phase);
  const bob = Math.abs(Math.cos(t * 4.2 + phase)) * 4;
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${scale})`} fill="#140d07">
      {/* kepala */}
      <circle cx="0" cy="-168" r="17" />
      {songkok && <rect x="-15" y="-190" width="30" height="13" rx="3" />}
      {/* badan */}
      <path d="M-22 -146 Q0 -154 22 -146 L26 -70 Q0 -62 -26 -70Z" />
      {/* kaki */}
      <path d={`M-12 -72 L${-10 + step * 16} 0 L${-2 + step * 16} 0 L2 -72Z`} />
      <path d={`M-2 -72 L${8 - step * 16} 0 L${16 - step * 16} 0 L14 -72Z`} />
      {/* tangan */}
      {armOver ? (
        <path d="M18 -142 Q52 -150 74 -142 L74 -134 Q50 -140 20 -128Z" />
      ) : (
        <path d={`M-24 -140 L${-30 - step * 10} -86 L${-22 - step * 10} -84 L-14 -134Z`} />
      )}
    </g>
  );
};

/**
 * B-roll ilustrasi persahabatan (bukan rakaman sebenar): dua sahabat berjalan bersama
 * di jalan desa ketika matahari terbenam, pokok, kamera push-in + parallax.
 */
export const FriendsBroll: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const t = useTime();
  const p = tw(t, [from, to], [0, 1], (x) => x);
  const push = 1.03 + p * 0.09;
  const L = (depth: number): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    transform: `translateX(${-depth * p * 30}px) scale(${1 + (push - 1) * (0.4 + depth)})`,
    transformOrigin: '50% 70%',
  });
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#1a1410' }}>
      <div
        style={{
          ...L(0),
          background:
            'linear-gradient(180deg, #2b3f4a 0%, #6a6a62 28%, #d69a5a 50%, #ffd08a 60%, #f3b26a 66%, #6b4526 100%)',
        }}
      />
      <div
        style={{
          ...L(0.1),
          background:
            'radial-gradient(circle at 62% 60%, rgba(255,248,220,1) 0%, rgba(255,226,160,0.9) 3%, rgba(255,190,110,0.5) 12%, rgba(255,170,90,0) 36%)',
        }}
      />
      <div
        style={{
          ...L(0.15),
          background: `repeating-conic-gradient(from ${t * 2.5}deg at 62% 60%, rgba(255,226,163,0.14) 0deg 4deg, rgba(255,226,163,0) 4deg 12deg)`,
          maskImage: 'radial-gradient(circle at 62% 60%, black 0%, transparent 55%)',
          WebkitMaskImage: 'radial-gradient(circle at 62% 60%, black 0%, transparent 55%)',
          mixBlendMode: 'screen',
        }}
      />
      {/* bukit jauh & pokok */}
      <svg style={L(0.35)} width="1080" height="1920" viewBox="0 0 1080 1920">
        <path d="M0 1200 Q200 1130 420 1180 T820 1160 T1080 1190 V1920 H0Z" fill="#7a5233" opacity="0.6" />
        {[90, 180, 900, 990].map((tx, i) => (
          <g key={tx} fill="#3a2616" opacity="0.85">
            <rect x={tx - 5} y={1060 - i * 8} width={10} height={140} />
            <ellipse cx={tx} cy={1040 - i * 8} rx={46 + (i % 2) * 12} ry={70} />
          </g>
        ))}
      </svg>
      {/* jalan */}
      <svg style={L(0.6)} width="1080" height="1920" viewBox="0 0 1080 1920">
        <path d="M0 1260 Q540 1215 1080 1255 V1920 H0Z" fill="#2a1a0e" />
        <path d="M470 1240 L610 1240 L900 1920 L180 1920Z" fill="#8a5c36" opacity="0.55" />
        <path d="M520 1240 L560 1240 L640 1920 L440 1920Z" fill="#f2c27f" opacity="0.18" />
      </svg>
      {/* dua sahabat — membelakangi kamera, berjalan ke arah matahari */}
      <svg style={L(0.75)} width="1080" height="1920" viewBox="0 0 1080 1920">
        <Walker x={500} y={1420} scale={1.35} phase={0} t={t} armOver songkok />
        <Walker x={600} y={1424} scale={1.32} phase={Math.PI} t={t} />
      </svg>
      <Dust count={45} opacity={0.8} seed="friends" area={[600, 1500]} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(14,10,6,0.85) 100%)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 55%, rgba(0,0,0,0) 50%, rgba(5,8,10,0.6) 100%)' }} />
    </AbsoluteFill>
  );
};
