import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from 'remotion';
import { FPS, Span } from '../data/script';
import { DONATION, isPlaceholder } from '../data/donation';
import { CINZEL, GOLD, GOLD_GRAD, POPPINS, depth3D } from './Typography';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Medan maklumat: nilai sebenar jika diisi, atau kotak placeholder berlabel jelas. */
const Field: React.FC<{ label: string; value: string | null; big?: boolean; o: number }> = ({ label, value, big, o }) => (
  <div style={{ opacity: o, transform: `translateY(${(1 - o) * 14}px)` }}>
    <div style={{ fontFamily: POPPINS, fontWeight: 500, fontSize: 24, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{label}</div>
    {value ? (
      <div style={{ fontFamily: POPPINS, fontWeight: big ? 800 : 600, fontSize: big ? 44 : 38, color: big ? GOLD : '#fff', letterSpacing: big ? '0.04em' : 0, lineHeight: 1.2, textWrap: 'balance' }}>{value}</div>
    ) : (
      <div style={{ marginTop: 4, padding: '8px 14px', border: '2px dashed rgba(246,200,102,0.75)', borderRadius: 10, fontFamily: POPPINS, fontWeight: 600, fontSize: big ? 30 : 26, color: GOLD, background: 'rgba(246,200,102,0.08)' }}>
        [{label.toUpperCase()}]
      </div>
    )}
  </div>
);

export const CtaCard: React.FC<{ s: Span }> = ({ s }) => {
  const frame = useCurrentFrame();
  const a = Math.round(s.at * FPS);
  const e = Math.round(s.end * FPS);
  if (frame < a || frame > e) return null;
  const f = frame - a;
  const sp = spring({ frame: f, fps: FPS, config: { damping: 16, stiffness: 90 } });
  const out = interpolate(frame, [e - 12, e], [1, 0], clamp);
  const st = (d: number) => interpolate(f, [d, d + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const qrIn = spring({ frame: f - 40, fps: FPS, config: { damping: 12, stiffness: 120 } });
  const shimmer = interpolate(f, [40, 70], [-120, 120], clamp);
  const pulse = 1 + 0.025 * Math.sin(f / 7);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 250, padding: '50px 44px 44px', borderRadius: 34,
        background: 'linear-gradient(170deg, rgba(14,26,38,0.86), rgba(30,22,10,0.86))', border: '2px solid rgba(246,200,102,0.45)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 60px rgba(246,200,102,0.08)',
        transform: `scale(${0.9 + 0.1 * sp})`, opacity: Math.min(1, sp * 1.3),
      }}>
        {isPlaceholder && (
          <div style={{ position: 'absolute', right: -18, top: -26, transform: 'rotate(4deg)', background: '#d7372f', color: '#fff', fontFamily: POPPINS, fontWeight: 800, fontSize: 24, padding: '10px 18px', borderRadius: 8, letterSpacing: '0.06em', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}>
            PLACEHOLDER — BELUM UNTUK SIARAN
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: POPPINS, fontWeight: 800, fontSize: 92, lineHeight: 1, color: '#fff', textShadow: depth3D(5, 'rgba(60,80,100,0.95)'), opacity: st(4) }}>BANTUAN BANJIR</div>
          <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 66, letterSpacing: '0.12em', marginTop: 10, backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 4px 0 #8a5a12) drop-shadow(0 10px 16px rgba(0,0,0,0.5))', opacity: st(9) }}>PARLIMEN PARIT</div>
          <div style={{ display: 'inline-block', marginTop: 26, padding: '14px 34px', borderRadius: 60, background: GOLD_GRAD, transform: `scale(${pulse * (0.9 + 0.1 * st(16))})`, opacity: st(16), boxShadow: '0 0 40px rgba(246,200,102,0.55)' }}>
            <span style={{ fontFamily: POPPINS, fontWeight: 800, fontSize: 50, color: '#3a2306', letterSpacing: '0.02em' }}>AYUH KITA BANTU MEREKA!</span>
          </div>
        </div>

        {/* Butiran akaun — QR & pautan hanya dipaparkan jika dibekalkan */}
        <div style={{ display: 'flex', gap: 28, marginTop: 34, alignItems: 'flex-start' }}>
          {DONATION.qr && (
            <div style={{ position: 'relative', width: 240, height: 240, flexShrink: 0, borderRadius: 18, overflow: 'hidden', background: '#fff', transform: `scale(${0.6 + 0.4 * qrIn})`, opacity: Math.min(1, qrIn * 1.4), boxShadow: '0 0 0 6px rgba(246,200,102,0.8), 0 0 40px rgba(246,200,102,0.5)' }}>
              <Img src={staticFile(DONATION.qr)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, minWidth: 0 }}>
            <Field label="Nama sumbangan" value={DONATION.fundName} o={st(28)} />
            <Field label="Nama akaun" value={DONATION.accountHolder} o={st(34)} />
          </div>
        </div>

        {/* Nombor akaun — paling menonjol, dengan sapuan kilauan */}
        <div style={{
          position: 'relative', overflow: 'hidden', marginTop: 24, padding: '18px 26px 20px', borderRadius: 20, textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(246,200,102,0.16), rgba(246,200,102,0.06))', border: '2px solid rgba(246,200,102,0.7)',
          boxShadow: `0 0 ${30 + 14 * Math.sin(f / 9)}px rgba(246,200,102,0.35)`, opacity: Math.min(1, qrIn * 1.3), transform: `scale(${0.85 + 0.15 * qrIn})`,
        }}>
          <div style={{ fontFamily: POPPINS, fontWeight: 600, fontSize: 26, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.75)' }}>
            {(DONATION.bank ?? '[BANK]').toUpperCase()} · NO. AKAUN
          </div>
          {DONATION.accountNo ? (
            <div style={{ fontFamily: POPPINS, fontWeight: 800, fontSize: 78, lineHeight: 1.15, letterSpacing: '0.05em', backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 3px 0 #8a5a12) drop-shadow(0 8px 14px rgba(0,0,0,0.5))' }}>
              {DONATION.accountNo}
            </div>
          ) : (
            <Field label="Nombor akaun bank rasmi" value={null} big o={1} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(115deg, transparent ${50 + shimmer - 10}%, rgba(255,255,255,0.35) ${50 + shimmer}%, transparent ${50 + shimmer + 10}%)` }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
          {DONATION.link && <Field label="Pautan sumbangan" value={DONATION.link} o={st(50)} />}
          <div style={{ opacity: st(54), transform: `translateY(${(1 - st(54)) * 14}px)`, display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 32, background: GOLD_GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24"><path fill="#3a2306" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" /></svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: POPPINS, fontWeight: 500, fontSize: 22, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)' }}>HUBUNGI</div>
              {DONATION.contact ? (
                <div style={{ fontFamily: POPPINS, fontWeight: 600, fontSize: 38, color: '#fff', lineHeight: 1.2 }}>
                  {DONATION.contact}{DONATION.contactPhone && <span style={{ color: GOLD, fontWeight: 800 }}>{'  '}{DONATION.contactPhone}</span>}
                </div>
              ) : (
                <Field label="Maklumat hubungan" value={null} o={1} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1250, textAlign: 'center', opacity: st(64) }}>
        <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 34, letterSpacing: '0.16em', color: GOLD }}>BERSAMA MERINGANKAN BEBAN</div>
        <div style={{ fontFamily: POPPINS, fontWeight: 500, fontSize: 24, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.8)', marginTop: 6 }}>PUSAT KHIDMAT MASYARAKAT AHLI PARLIMEN PARIT</div>
      </div>
    </AbsoluteFill>
  );
};

export const EndCard: React.FC<{ s: Span }> = ({ s }) => {
  const frame = useCurrentFrame();
  const a = Math.round(s.at * FPS);
  const e = Math.round(s.end * FPS);
  if (frame < a) return null;
  const f = frame - a;
  const o = interpolate(f, [0, 16], [0, 1], clamp);
  const fadeBlack = interpolate(frame, [e - 24, e], [0, 1], clamp);
  const track = interpolate(f, [0, e - a], [0.3, 0.18]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: 'rgba(0,0,0,0.5)', opacity: o }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: o, transform: `scale(${1 + f * 0.0012})` }}>
        <div style={{ textAlign: 'center', marginTop: -120 }}>
          <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 82, lineHeight: 1.15, letterSpacing: `${track}em`, backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 4px 0 #8a5a12) drop-shadow(0 12px 22px rgba(0,0,0,0.6))' }}>
            BERSAMA<br />MERINGANKAN<br />BEBAN
          </div>
          <div style={{ width: 360, height: 3, margin: '34px auto', background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
          <div style={{ fontFamily: POPPINS, fontWeight: 600, fontSize: 36, color: '#fff', letterSpacing: '0.06em', lineHeight: 1.4 }}>PUSAT KHIDMAT MASYARAKAT<br />AHLI PARLIMEN PARIT</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: '#000', opacity: fadeBlack }} />
    </AbsoluteFill>
  );
};
