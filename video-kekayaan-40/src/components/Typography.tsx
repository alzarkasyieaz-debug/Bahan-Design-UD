import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { Scene, timeChunks } from '../data/script';
import { easeOut, tw, useT } from './core';
import voManifest from '../data/vo-manifest.json';

export const FONT_TITLE = "'Bebas Neue', 'Inter', sans-serif";
export const FONT_BODY = "'Inter', sans-serif";
export const FONT_SERIF = "'Playfair Display', serif";

const norm = (w: string) => w.toLowerCase().replace(/[^a-z\-]/g, '');

/* ---------------------------------------------------------- TAJUK KINETIK */
export const SceneTitle: React.FC<{
  scene: Scene;
  top?: number;
  size?: number;
  delay?: number;
  out?: number; // masa tajuk mula hilang (saat)
  align?: 'center' | 'left';
  color?: string;
}> = ({ scene, top = 210, size = 112, delay = 0.25, out = 9.35, color = '#ffffff' }) => {
  const t = useT();
  const exit = tw(t, [out, out + 0.55], [1, 0]);
  const badgeIn = tw(t, [delay, delay + 0.7], [0, 1], easeOut);
  return (
    <AbsoluteFill style={{ alignItems: 'center', pointerEvents: 'none', opacity: exit }}>
      {/* scrim lembut supaya teks jelas tanpa menutup wajah */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: top + size * 3.2,
          background: 'linear-gradient(180deg, rgba(8,20,40,0.45) 0%, rgba(8,20,40,0.18) 60%, rgba(8,20,40,0) 100%)',
        }}
      />
      <div style={{ position: 'absolute', top, width: 960, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {scene.number && (
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 52,
              marginBottom: 22,
              background: 'linear-gradient(160deg, #2b5fa6 0%, #12315f 100%)',
              border: '3px solid rgba(255,255,255,0.85)',
              boxShadow: '0 0 40px rgba(255,220,150,0.45), 0 10px 30px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT_TITLE,
              fontSize: 64,
              color: '#fff',
              paddingTop: 6,
              transform: `scale(${interpolate(badgeIn, [0, 1], [0.4, 1])}) rotate(${interpolate(badgeIn, [0, 1], [-25, 0])}deg)`,
              opacity: badgeIn,
            }}
          >
            {scene.number}
          </div>
        )}
        {(scene.titleLines ?? [scene.title]).map((line, li, all) => (
          <div
            key={li}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              columnGap: size * 0.22,
              fontFamily: FONT_TITLE,
              fontSize: size,
              lineHeight: 0.98,
              color,
              textAlign: 'center',
            }}
          >
            {line.split(' ').map((w, i) => {
              const idx = all.slice(0, li).join(' ').split(' ').filter(Boolean).length + i;
              const st = delay + 0.35 + idx * 0.16;
              const k = tw(t, [st, st + 0.9], [0, 1], easeOut);
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    opacity: k,
                    transform: `translateY(${(1 - k) * 34}px) scale(${1 + (1 - k) * 0.08})`,
                    filter: `blur(${(1 - k) * 10}px)`,
                    letterSpacing: `${(1 - k) * 0.25 + 0.02}em`,
                    textShadow: '0 4px 24px rgba(0,0,0,0.35), 0 0 60px rgba(255,220,160,0.25)',
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        ))}
        {/* garis emas halus */}
        <div
          style={{
            marginTop: 26,
            height: 3,
            width: 260 * tw(t, [delay + 0.8, delay + 1.8], [0, 1], easeOut),
            background: 'linear-gradient(90deg, rgba(255,210,122,0), #ffd27a, rgba(255,210,122,0))',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- SUBTITLE */
type Manifest = { files: Record<string, string>; timing: Record<string, number[][]> };
const manifest = voManifest as Manifest;

export const Subtitles: React.FC<{ scene: Scene; bottom?: number }> = ({ scene, bottom = 210 }) => {
  const t = useT();
  const chunks = timeChunks(scene, manifest.timing[String(scene.id)]);
  const kw = new Set(scene.keywords.map(norm));
  const active = chunks.find((c) => t >= c.start - 0.15 && t < c.end + 0.15);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: bottom + 330,
          background: 'linear-gradient(0deg, rgba(6,14,28,0.55) 0%, rgba(6,14,28,0.25) 55%, rgba(6,14,28,0) 100%)',
        }}
      />
      {active && (
        <div
          key={active.text}
          style={{
            position: 'absolute',
            left: 70,
            right: 70,
            bottom,
            textAlign: 'center',
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 47,
            lineHeight: 1.32,
            color: '#fff',
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            opacity: Math.min(tw(t, [active.start - 0.15, active.start + 0.2], [0, 1]), tw(t, [active.end, active.end + 0.15], [1, 0])),
            transform: `translateY(${tw(t, [active.start - 0.15, active.start + 0.35], [14, 0], easeOut)}px)`,
          }}
        >
          {active.text.split(' ').map((w, i, arr) => {
            const isKw = kw.has(norm(w));
            // masa anggaran perkataan disebut
            const wt = active.start + ((active.end - active.start) * i) / arr.length;
            const pop = tw(t, [wt, wt + 0.25], [0, 1], easeOut) - tw(t, [wt + 0.25, wt + 0.7], [0, 1]) * 0.6;
            const lit = tw(t, [wt - 0.05, wt + 0.2], [0, 1]);
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    display: 'inline-block',
                    color: isKw ? (lit > 0.5 ? '#ffd27a' : '#fff') : '#fff',
                    transform: isKw ? `scale(${1 + pop * 0.1})` : undefined,
                    margin: isKw ? '0 0.1em' : undefined,
                    textShadow: isKw && lit > 0.5 ? '0 0 18px rgba(255,200,110,0.75), 0 2px 12px rgba(0,0,0,0.6)' : undefined,
                    opacity: isKw ? 1 : 0.55 + 0.45 * lit,
                  }}
                >
                  {w}
                </span>
                {i < arr.length - 1 ? ' ' : ''}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
