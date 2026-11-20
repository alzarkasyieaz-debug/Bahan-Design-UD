import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ease } from './Looks';
import { useTimeline } from '../data/timeline';

export const GOLD = '#F2C56B';
export const GOLD_SOFT = '#FFE3A6';
const SANS = 'Montserrat';
const SERIF = 'Playfair Display';
const DISPLAY = 'Cinzel';
const SHADOW = '0 2px 6px rgba(0,0,0,0.75), 0 0 24px rgba(0,0,0,0.45)';

const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

/* ------------------------------------------------------------ Kinetic typography (hook) */
const Letters: React.FC<{ text: string; t0: number; t: number; stagger?: number; style?: React.CSSProperties }> = ({
  text, t0, t, stagger = 0.035, style,
}) => (
  <span style={style}>
    {(() => {
      // Kumpulkan huruf mengikut perkataan supaya baris hanya pecah di antara perkataan
      let idx = 0;
      return text.split(' ').map((word, wi, arr) => (
        <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {(word + (wi < arr.length - 1 ? ' ' : '')).split('').map((ch) => {
            const i = idx++;
            const p = interpolate(t - t0 - i * stagger, [0, 0.55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  whiteSpace: 'pre',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 26}px)`,
                  filter: `blur(${(1 - p) * 10}px)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ));
    })()}
  </span>
);

export const HookTitle: React.FC<{ from: number; to: number; lines: string[]; gold?: boolean; size?: number; goldLines?: number[] }> = ({ from, to, lines, gold, size = 92, goldLines = [] }) => {
  const t = useT();
  if (t < from - 0.05 || t > to + 0.05) return null;
  const out = interpolate(t, [to - 0.45, to], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const drift = interpolate(t, [from, to], [1.0, 1.045]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: out }}>
      <div
        style={{
          width: 900,
          textAlign: 'center',
          transform: `scale(${drift})`,
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.12,
          letterSpacing: '0.035em',
          color: gold ? GOLD_SOFT : '#fff',
          textShadow: gold
            ? '0 0 30px rgba(242,197,107,0.45), 0 3px 10px rgba(0,0,0,0.7)'
            : '0 3px 12px rgba(0,0,0,0.75), 0 0 40px rgba(0,0,0,0.4)',
          marginTop: -80,
        }}
      >
        {lines.map((l, i) => (
          <div key={i} style={goldLines.includes(i) ? { color: GOLD_SOFT, textShadow: '0 0 30px rgba(242,197,107,0.45), 0 3px 10px rgba(0,0,0,0.7)' } : undefined}>
            <Letters text={l} t0={from + i * 0.45} t={t} />
          </div>
        ))}
        <div
          style={{
            margin: '34px auto 0',
            height: 3,
            width: interpolate(t, [from + 0.4, from + 1.6], [0, 260], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }),
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ Lower third */
export const LowerThird: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const t = useT();
  if (t < from || t > to) return null;
  const pin = interpolate(t, [from, from + 0.6], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const a = interpolate(t, [from + 0.2, from + 0.9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const b = interpolate(t, [from + 0.5, from + 1.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const out = interpolate(t, [to - 0.5, to], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: 'absolute', left: 70, top: 1040, display: 'flex', alignItems: 'stretch' }}>
        <div style={{ width: 7, background: `linear-gradient(180deg, ${GOLD_SOFT}, ${GOLD})`, transform: `scaleY(${pin})`, transformOrigin: 'top', borderRadius: 4, boxShadow: `0 0 18px ${GOLD}88` }} />
        <div style={{ paddingLeft: 24, overflow: 'hidden' }}>
          <div
            style={{
              fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: '0.04em', color: '#fff',
              textShadow: SHADOW, transform: `translateX(${(1 - a) * -60}px)`, opacity: a, lineHeight: 1.15,
            }}
          >
            YB USTAZ MUHAMMAD ISMI<br />MAT TAIB
          </div>
          <div
            style={{
              marginTop: 10, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 40, color: GOLD_SOFT,
              textShadow: SHADOW, transform: `translateX(${(1 - b) * -60}px)`, opacity: b,
            }}
          >
            Ahli Parlimen Parit
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ Teks lokasi */
export const LocationTag: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const t = useT();
  if (t < from || t > to) return null;
  const a = interpolate(t, [from, from + 0.8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const out = interpolate(t, [to - 0.5, to], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: out * a, alignItems: 'center' }}>
      <div style={{ marginTop: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${(1 - a) * -20}px)` }}>
        <svg width="40" height="52" viewBox="0 0 24 32" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' }}>
          <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 32 12 32s12-11.5 12-20.3C24 5.2 18.6 0 12 0zm0 16.5a4.8 4.8 0 1 1 0-9.6 4.8 4.8 0 0 1 0 9.6z" fill={GOLD} />
        </svg>
        <div style={{ marginTop: 14, fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: `${0.1 + a * 0.08}em`, color: '#fff', textShadow: SHADOW }}>
          PPS SK TANJUNG BELANJA
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 8 }}>
          <div style={{ width: 70 * a, height: 2, background: GOLD }} />
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: '0.35em', color: GOLD_SOFT, textShadow: SHADOW }}>PARIT</div>
          <div style={{ width: 70 * a, height: 2, background: GOLD }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ Tipografi kata kunci (ucapan sebenar) */
export const KeyPhrases: React.FC = () => {
  const t = useT();
  const k = useTimeline().keyPhrases.find((p) => t >= p.from && t <= p.to);
  if (!k) return null;
  const a = interpolate(t, [k.from, k.from + 0.6], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const out = interpolate(t, [k.to - 0.4, k.to], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const grow = interpolate(t, [k.from, k.to], [1, 1.05]);
  return (
    <AbsoluteFill style={{ alignItems: 'center', opacity: out }}>
      <div style={{ position: 'absolute', top: 930, width: 860, textAlign: 'center', transform: `scale(${grow})` }}>
        {'big' in k && k.big ? (
          <>
            <div
              style={{
                fontFamily: DISPLAY, fontWeight: 700, fontSize: 190, lineHeight: 1, color: GOLD_SOFT,
                textShadow: `0 0 40px ${GOLD}66, 0 4px 14px rgba(0,0,0,0.7)`, opacity: a,
                transform: `translateY(${(1 - a) * 30}px)`, filter: `blur(${(1 - a) * 8}px)`,
              }}
            >
              {Math.round(interpolate(t, [k.from, k.from + 0.9], [0, Number(k.big)], { extrapolateRight: 'clamp', easing: ease }))}
            </div>
            <div style={{ marginTop: 6, fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: `${0.12 + 0.2 * a}em`, color: '#fff', textShadow: SHADOW, opacity: a }}>
              {k.small}
            </div>
          </>
        ) : (
          (k.lines ?? []).map((l, i) => {
            const p = interpolate(t, [k.from + i * 0.25, k.from + i * 0.25 + 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
            return (
              <div
                key={i}
                style={{
                  fontFamily: DISPLAY, fontWeight: 700, fontSize: l.length > 13 ? 76 : 92, lineHeight: 1.12, letterSpacing: '0.04em',
                  color: i === (k.lines!.length - 1) ? GOLD_SOFT : '#fff',
                  textShadow: i === (k.lines!.length - 1)
                    ? `0 0 34px ${GOLD}77, 0 4px 12px rgba(0,0,0,0.75)`
                    : '0 4px 14px rgba(0,0,0,0.75)',
                  opacity: p, transform: `translateY(${(1 - p) * 26}px) scale(${0.96 + 0.04 * p})`, filter: `blur(${(1 - p) * 8}px)`,
                }}
              >
                {l}
              </div>
            );
          })
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ Petikan doa (montaj) */
export const DoaQuote: React.FC = () => {
  const t = useT();
  const DOA = useTimeline().doa;
  if (t < DOA.from || t > DOA.to) return null;
  const a = interpolate(t, [DOA.from, DOA.from + 1.0], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const b = interpolate(t, [DOA.from + 1.6, DOA.from + 2.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const out = interpolate(t, [DOA.to - 0.6, DOA.to], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ alignItems: 'center', opacity: out }}>
      <AbsoluteFill style={{ opacity: a, background: 'radial-gradient(ellipse 70% 22% at 50% 43%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%)' }} />
      <div style={{ position: 'absolute', top: 640, width: 880, textAlign: 'center' }}>
        <div style={{ fontFamily: SERIF, fontSize: 140, lineHeight: 0.6, color: GOLD, opacity: a * 0.7, height: 70 }}>“</div>
        <div
          style={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 74, lineHeight: 1.2, color: '#fff',
            textShadow: `0 0 36px rgba(255,220,160,0.35), 0 4px 14px rgba(0,0,0,0.7)`,
            opacity: a, filter: `blur(${(1 - a) * 6}px)`, transform: `translateY(${(1 - a) * 20}px)`,
          }}
        >
          Sama-samalah kita<br />
          <span style={{ color: GOLD_SOFT, fontWeight: 600 }}>berdoa kepada Allah Ta'ala</span>
        </div>
        <div style={{ marginTop: 30, fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: '0.3em', color: GOLD_SOFT, opacity: b * 0.9, textShadow: SHADOW }}>
          — YB USTAZ MUHAMMAD ISMI —
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ Sari kata animasi */
export const Subtitles: React.FC<{ hide?: boolean }> = ({ hide }) => {
  const t = useT();
  const { subLines } = useTimeline();
  if (hide) return null;
  const line = subLines.find((l) => t >= l.start - 0.08 && t < l.end);
  if (!line) return null;
  const a = interpolate(t, [line.start - 0.08, line.start + 0.12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const out = interpolate(t, [line.end - 0.12, line.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute', left: 80, width: 820, top: 1330, textAlign: 'center',
          opacity: a * out, transform: `translateY(${(1 - a) * 12}px)`,
        }}
      >
        <div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 16, rowGap: 4 }}>
          {line.words.map((w, i) => {
            const spoken = t >= w.t - 0.03;
            const current = spoken && t < w.e + 0.05;
            const p = interpolate(t, [w.t - 0.03, w.t + 0.12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <span
                key={i}
                style={{
                  fontFamily: SANS, fontWeight: 800, fontSize: 54, lineHeight: 1.18,
                  color: w.key && spoken ? GOLD : '#fff',
                  opacity: 0.5 + 0.5 * p,
                  transform: `scale(${current ? 1.07 : 1})`,
                  display: 'inline-block',
                  textShadow: w.key && spoken
                    ? `0 0 18px ${GOLD}66, 0 3px 8px rgba(0,0,0,0.85)`
                    : '0 3px 8px rgba(0,0,0,0.85), 0 0 22px rgba(0,0,0,0.5)',
                }}
              >
                {w.w.replace(/,$/, '')}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ Hook "Sabar ya" (suara asal YB) */
export const SabarHook: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const t = useT();
  if (t < from - 0.05 || t > to + 0.05) return null;
  const a = interpolate(t, [from, from + 0.7], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const b = interpolate(t, [from + 0.35, from + 1.05], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const out = interpolate(t, [to - 0.5, to], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const push = interpolate(t, [from, to], [1, 1.07]);
  const glow = 0.35 + 0.15 * Math.sin((t - from) * 2.2);
  const big: React.CSSProperties = {
    fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 210, lineHeight: 0.95, color: GOLD_SOFT,
    textShadow: `0 0 50px rgba(242,197,107,${glow}), 0 6px 18px rgba(0,0,0,0.75)`,
  };
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: out }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 30% at 50% 44%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)', opacity: a }} />
      <div style={{ textAlign: 'center', transform: `scale(${push})`, marginTop: -120 }}>
        <div style={{ ...big, opacity: a, transform: `translateY(${(1 - a) * 40}px)`, filter: `blur(${(1 - a) * 14}px)`, letterSpacing: `${0.06 - 0.06 * a}em` }}>
          Sabar
        </div>
        <div style={{ ...big, fontSize: 170, opacity: b, transform: `translateY(${(1 - b) * 40}px)`, filter: `blur(${(1 - b) * 14}px)` }}>
          ya...
        </div>
        <div style={{ margin: '38px auto 0', height: 3, width: 300 * b, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        <div style={{ marginTop: 22, fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: '0.3em', color: '#fff', opacity: b * 0.85, textShadow: SHADOW }}>
          — YB USTAZ MUHAMMAD ISMI —
        </div>
      </div>
    </AbsoluteFill>
  );
};
