import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Bokeh, LensFlare, Layer, LightRays, Particles, Sky, Stage, SunGlow, palette, tw, useT, easeOut, mix } from '../components/core';
import { Figure, POSES, walkPose } from '../components/Figure';
import { Hills, Sejadah, Tree, archPath } from '../components/Props';
import { FONT_SERIF, FONT_TITLE, FONT_BODY } from '../components/Typography';
import { SCENES } from '../data/script';

// BABAK 12 — PENUTUP: doa, kemudian keluarga berjalan bersama menuju cahaya matahari senja.
export const Scene12: React.FC = () => {
  const t = useT();
  const w = 1;
  const p = palette(w);
  const toSunset = tw(t, [3.6, 5.0], [0, 1]);
  const camA = { x: 0, y: tw(t, [0, 5], [30, -20]), zoom: tw(t, [0, 5], [1.05, 1.12]) };
  const camB = { x: tw(t, [3.6, 10], [40, -30]), y: 0, zoom: tw(t, [3.6, 10], [1.0, 1.1]) };
  const walkT = Math.max(0, t - 3.6);
  const groupX = 120 + walkT * 34;
  const scene = SCENES[11];
  const mainK = (i: number) => tw(t, [4.6 + i * 0.12, 5.6 + i * 0.12], [0, 1], easeOut);
  const smallK = tw(t, [6.2, 7.3], [0, 1], easeOut);
  const words = scene.title.split(' ');

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a0f08' }}>
      {/* Bahagian 1: doa — cahaya senja masuk melalui gerbang */}
      <AbsoluteFill style={{ opacity: 1 - toSunset }}>
        <Layer cam={camA} depth={0.1}>
          <Stage>
            <rect x={-300} y={-300} width={1700} height={2600} fill="#4d3322" />
            <path d={archPath(600, 520, 340, 640)} fill="#ffcf8a" />
            <path d={archPath(600, 520, 340, 640)} fill="none" stroke="#f1dcb8" strokeWidth={14} />
            <rect x={-300} y={1480} width={1700} height={800} fill="#2e1c10" />
          </Stage>
        </Layer>
        <LightRays x={770} y={700} angle={38} spread={26} count={7} opacity={0.4} seed="s12r1" length={1300} color="#ffe2a8" />
        <Layer cam={camA} depth={0.5}>
          <Stage>
            <Sejadah x={180} y={1485} w={460} h={60} color="#8a4b2a" accent="#e8c98a" />
            <Figure x={400} y={1505} scale={3.1} pose={POSES.kneelDoa} color={p.silhouette} kopiah rim="rgba(255,226,170,0.9)" />
          </Stage>
        </Layer>
      </AbsoluteFill>

      {/* Bahagian 2: keluarga berjalan menuju matahari senja */}
      <AbsoluteFill style={{ opacity: toSunset }}>
        <Layer cam={camB} depth={0}>
          <Sky w={w} id="s12" horizonY={1340} />
          <SunGlow x={840} y={1290} r={980} w={w} id="s12" intensity={1} />
        </Layer>
        <LightRays x={840} y={1290} angle={180} spread={160} count={12} opacity={0.3} seed="s12r2" color="#ffe6b0" />
        <Layer cam={camB} depth={0.2}>
          <Stage>
            <Hills y={1350} color={p.silhouetteFar} amp={60} seed="s12h" opacity={0.7} />
            <Tree x={60} y={1400} s={1.6} color={p.silhouetteFar} seed="s12t" />
          </Stage>
        </Layer>
        <Layer cam={camB} depth={0.5}>
          <Stage>
            <rect x={-300} y={1390} width={1700} height={900} fill={p.silhouette} opacity={0.9} />
            <path d="M -300 1560 C 300 1470, 700 1420, 1400 1400" stroke={mix('#ffd9a0', '#ffd9a0', 1)} strokeWidth={60} opacity={0.18} fill="none" />
            {[
              { kind: 'man' as const, dx: 0, s: 2.6, ph: 0 },
              { kind: 'woman' as const, dx: -95, s: 2.6, ph: 0.5 },
              { kind: 'boy' as const, dx: 90, s: 2.5, ph: 0.25 },
              { kind: 'girl' as const, dx: -170, s: 2.5, ph: 0.75 },
            ].map((m, i) => (
              <Figure key={i} x={groupX + m.dx + 120} y={1530 - i * 4} scale={m.s} kind={m.kind} pose={walkPose(walkT * 0.6 + m.ph, m.kind === 'man' || m.kind === 'woman' ? 0.8 : 1)} color={p.silhouette} rim="rgba(255,220,150,0.95)" />
            ))}
          </Stage>
        </Layer>
        <LensFlare x={840} y={1290} opacity={0.5} />
      </AbsoluteFill>

      <Particles count={55} seed="s12p" rise={10} color="#ffe6b0" />
      <Bokeh count={12} seed="s12b" opacity={0.3} color="#ffd590" />

      {/* Teks penutup */}
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 900,
            opacity: tw(t, [4.4, 5.6], [0, 1]),
            background: 'linear-gradient(180deg, rgba(30,14,4,0.55) 0%, rgba(30,14,4,0.2) 65%, rgba(30,14,4,0) 100%)',
          }}
        />
        <div style={{ position: 'absolute', top: 250, width: 940, textAlign: 'center' }}>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 112, lineHeight: 1.0, color: '#fff', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 24 }}>
            {words.map((wd, i) => {
              const k = mainK(i);
              const gold = /KETENANGAN|KEBERKATAN/.test(wd);
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    opacity: k,
                    transform: `translateY(${(1 - k) * 30}px)`,
                    filter: `blur(${(1 - k) * 10}px)`,
                    color: gold ? '#ffd27a' : '#fff',
                    textShadow: gold ? '0 0 30px rgba(255,200,110,0.7), 0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.4)',
                  }}
                >
                  {wd}
                </span>
              );
            })}
          </div>
          <div style={{ margin: '34px auto 0', height: 3, width: 300 * smallK, background: 'linear-gradient(90deg, rgba(255,210,122,0), #ffd27a, rgba(255,210,122,0))' }} />
          <div
            style={{
              marginTop: 30,
              fontFamily: FONT_SERIF,
              fontStyle: 'italic',
              fontSize: 50,
              color: '#fff6e6',
              opacity: smallK,
              transform: `translateY(${(1 - smallK) * 16}px)`,
              textShadow: '0 2px 14px rgba(0,0,0,0.5)',
            }}
          >
            {scene.smallText}
          </div>
          <div style={{ marginTop: 26, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 30, letterSpacing: '0.12em', color: '#ffe2b0', opacity: smallK * 0.8 }}>#nasihatharini</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
