import React from 'react';
import { B, C, FONT, tw, ease, easeOut, back, useTime } from '../lib';

/** Ikon nota muzik gaya TikTok (vektor ringkas, dengan offset cyan/merah jambu) */
export const TikTokIcon: React.FC<{ size?: number }> = ({ size = 46 }) => {
  const path =
    'M30 4h8.5c.6 5.4 4.6 9.6 10 10.2v8.6c-3.7-.1-7.1-1.2-10-3.1v15.8C38.5 44.4 31.6 51 23.4 51 15.4 51 9 44.6 9 36.6s6.4-14.4 14.4-14.4c.8 0 1.6.1 2.4.2v8.8c-.8-.3-1.5-.4-2.4-.4-3.2 0-5.8 2.6-5.8 5.8s2.6 5.8 5.8 5.8c3.3 0 6.6-2.6 6.6-6.4V4z';
  return (
    <svg width={size} height={size} viewBox="0 0 58 56">
      <path d={path} fill="#25F4EE" transform="translate(-2,-1.5)" />
      <path d={path} fill="#FE2C55" transform="translate(2,1.5)" />
      <path d={path} fill="#FFFFFF" />
    </svg>
  );
};

/**
 * Lower third "FOLLOW @NakSeeHeart" — sepanjang video.
 * 0–3 s slide-in; kemudian breathing glow; micro-animation pada FOLLOW (B.followPulse);
 * pada CTA berubah menjadi kad besar di tengah.
 */
export const LowerThird: React.FC = () => {
  const t = useTime();
  const enter = tw(t, [0.4, 1.4], [0, 1], easeOut);
  const cta = tw(t, [B.cta + 0.2, B.cta + 1.2], [0, 1], ease);
  const breathe = 0.5 + 0.5 * Math.sin(t * 2.2);

  // micro-animation FOLLOW
  let pulse = 0;
  for (const p of B.followPulse) pulse = Math.max(pulse, tw(t, [p, p + 0.2], [0, 1], easeOut) * tw(t, [p + 0.2, p + 0.9], [1, 0]));
  const sheen = B.followPulse.reduce((acc, p) => (t >= p && t < p + 1.0 ? tw(t, [p, p + 1.0], [-40, 140]) : acc), -100);
  const ctaPulse = t > B.cta + 1.2 ? 0.5 + 0.5 * Math.sin((t - B.cta) * 4) : 0;

  // geometri: dari pil kiri-bawah ke kad tengah
  const x = tw(cta, [0, 1], [60, 90]);
  const y = tw(cta, [0, 1], [1418, 1090]);
  const w = tw(cta, [0, 1], [660, 900]);
  const h = tw(cta, [0, 1], [96, 230]);
  const slide = (1 - enter) * -80;

  return (
    <div
      style={{
        position: 'absolute',
        left: x + slide,
        top: y,
        width: w,
        height: h,
        opacity: enter,
        borderRadius: 28 + cta * 10,
        background: `linear-gradient(135deg, rgba(20,20,24,${0.55 + cta * 0.2}), rgba(8,8,10,${0.42 + cta * 0.2}))`,
        backdropFilter: 'blur(18px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.3)',
        border: `1.5px solid rgba(233,185,92,${0.45 + breathe * 0.35 + ctaPulse * 0.2})`,
        boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 ${18 + breathe * 18 + ctaPulse * 30}px rgba(233,185,92,${0.22 + breathe * 0.18 + cta * 0.2}), inset 0 1px 0 rgba(255,255,255,0.12)`,
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${22 + cta * 18}px`,
        gap: 18 + cta * 10,
        overflow: 'hidden',
        transform: `scale(${1 + pulse * 0.03 + ctaPulse * 0.012})`,
        transformOrigin: '0% 50%',
      }}
    >
      {/* kilauan kaca */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(100deg, rgba(255,255,255,0) ${sheen - 12}%, rgba(255,255,255,0.22) ${sheen}%, rgba(255,255,255,0) ${sheen + 12}%)`,
        }}
      />
      <div
        style={{
          width: 64 + cta * 52,
          height: 64 + cta * 52,
          borderRadius: 16 + cta * 10,
          background: '#000',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <TikTokIcon size={40 + cta * 36} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', flexDirection: cta > 0.5 ? 'column' : 'row', alignItems: cta > 0.5 ? 'flex-start' : 'baseline', gap: cta > 0.5 ? 0 : 12, whiteSpace: 'nowrap' }}>
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 34 + cta * 6,
              letterSpacing: '0.08em',
              color: C.goldLight,
              display: 'inline-block',
              transform: `scale(${1 + pulse * 0.18}) translateY(${-pulse * 3}px)`,
              transformOrigin: '0% 70%',
              textShadow: `0 0 ${10 + pulse * 20}px rgba(233,185,92,${0.5 + pulse * 0.5})`,
            }}
          >
            FOLLOW{cta > 0.5 ? ' TIKTOK' : ''}
          </span>
          <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 36 + cta * 18, color: C.white, lineHeight: 1.1 }}>@NakSeeHeart</span>
        </div>
        <div
          style={{
            fontFamily: FONT.italic,
            fontStyle: 'italic',
            fontSize: 22 + cta * 14,
            color: C.cream,
            opacity: 0.75 + cta * 0.25,
            marginTop: 2 + cta * 8,
            whiteSpace: 'nowrap',
          }}
        >
          Nasihat Ringkas, Makna Mendalam.
        </div>
      </div>
      {/* penunjuk follow animasi (+) */}
      <div
        style={{
          width: 52 + cta * 22,
          height: 52 + cta * 22,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`,
          color: C.charcoal,
          fontFamily: FONT.sans,
          fontWeight: 900,
          fontSize: 34 + cta * 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 0 0 ${(t * 1.2) % 1 * 14}px rgba(233,185,92,${0.45 * (1 - ((t * 1.2) % 1))})`,
          transform: `rotate(${pulse * 90}deg) scale(${1 + pulse * 0.15 + ctaPulse * 0.08})`,
        }}
      >
        +
      </div>
    </div>
  );
};

/** Paparan penutup: SETIAP NASIHAT ADA MAKNA + jenama */
export const CtaHeadings: React.FC = () => {
  const t = useTime();
  if (t < B.cta) return null;
  const lt = t - B.cta;
  const a = tw(lt, [0.9, 1.7], [0, 1], easeOut);
  const c = tw(lt, [1.6, 2.4], [0, 1], easeOut);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 1385,
          transform: `translate(-50%, -50%) translateY(${(1 - c) * 20}px)`,
          opacity: c,
          fontFamily: FONT.sans,
          fontWeight: 600,
          fontSize: 38,
          color: C.cream,
          whiteSpace: 'nowrap',
          textShadow: '0 4px 18px rgba(0,0,0,0.8)',
        }}
      >
        Untuk Lebih Banyak <span style={{ color: C.goldLight, fontWeight: 800 }}>Nasihat Kehidupan.</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 300,
          transform: `translate(-50%,-50%) scale(${0.9 + a * 0.1})`,
          opacity: a,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontFamily: FONT.sans,
          fontWeight: 800,
          fontSize: 44,
          letterSpacing: '0.04em',
          color: C.white,
          textShadow: '0 4px 20px rgba(0,0,0,0.8)',
        }}
      >
        <HeartMark size={52} t={t} />
        <span>
          NakSee<span style={{ color: C.gold }}>Heart</span>
        </span>
      </div>
    </>
  );
};

export const HeartMark: React.FC<{ size: number; t: number }> = ({ size, t }) => {
  const beat = 1 + 0.08 * Math.max(0, Math.sin(t * 6)) ** 8;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ transform: `scale(${beat})`, filter: `drop-shadow(0 0 10px ${C.gold})` }}>
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9B8" />
          <stop offset="1" stopColor="#D9A447" />
        </linearGradient>
      </defs>
      <path d="M24 42 C10 32 4 25 4 16.5 4 10 9 5 15.2 5c3.8 0 6.9 2 8.8 5 1.9-3 5-5 8.8-5C39 5 44 10 44 16.5 44 25 38 32 24 42z" fill="url(#hg)" />
      <path d="M11 22h7l3-6 4 12 3-6h9" stroke="#2A1C08" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export { back };
