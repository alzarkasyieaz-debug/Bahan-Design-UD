import React from 'react';
import subs from '../data/subtitles.json';
import { C, FONT, tw, easeOut, back, useTime } from '../lib';

type Word = { text: string; start: number; end: number; gold: boolean };
type Chunk = { segment: string; start: number; end: number; words: Word[] };

/**
 * Subtitle 2 baris, word-by-word terkawal.
 * Kawasan selamat: x 60–940 (elak rel ikon TikTok di kanan), pusat y ≈ 1270.
 */
/** calm (0..1): kurangkan animasi subtitle ketika motion graphics utama dipaparkan (V2 §8) */
export const Subtitles: React.FC<{ y?: number; dim?: number; calm?: number }> = ({ y = 1478, dim = 1, calm = 0 }) => {
  const t = useTime();
  const chunk = (subs as Chunk[]).find((c) => t >= c.start && t < c.end);
  if (!chunk) return null;
  const cin = tw(t, [chunk.start, chunk.start + 0.18], [0, 1], easeOut);
  const cout = tw(t, [chunk.end - 0.15, chunk.end], [1, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        width: 880,
        top: y,
        transform: `translateY(-50%) translateY(${(1 - cin) * 14}px)`,
        textAlign: 'center',
        opacity: Math.min(cin, cout) * dim,
        fontFamily: FONT.sans,
        fontWeight: 800,
        fontSize: 54,
        lineHeight: 1.18,
        letterSpacing: '0.005em',
      }}
    >
      {chunk.words.map((w, i) => {
        // muncul perkataan demi perkataan, sedikit lebih awal daripada sebutan
        const p = tw(t, [w.start - 0.1, w.start + 0.08], [0, 1], easeOut);
        const active = t >= w.start - 0.05 && t < w.end + 0.05;
        const pop = w.gold ? 1 + (tw(t, [w.start - 0.05, w.start + 0.18], [1.28, 1], back) - 1) * (1 - calm) : 1;
        const color = w.gold ? C.goldLight : C.white;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: '0 0.14em',
              opacity: p,
              transform: `translateY(${(1 - p) * 10}px) scale(${p < 1 ? 0.96 + p * 0.04 : pop})`,
              color,
              textShadow: `0 3px 0 rgba(0,0,0,0.55), 0 6px 22px rgba(0,0,0,0.85)${w.gold && active && calm < 0.5 ? `, 0 0 26px rgba(216,180,106,0.9)` : ''}`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
