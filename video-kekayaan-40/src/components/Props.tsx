import React from 'react';
import { random, staticFile } from 'remotion';

/* Prop & elemen latar yang dikongsi antara babak */

export const Hills: React.FC<{ y: number; color: string; amp?: number; seed?: string; opacity?: number }> = ({
  y,
  color,
  amp = 60,
  seed = 'h',
  opacity = 1,
}) => {
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const x = -300 + i * 70;
    const yy = y - amp * (0.4 + 0.6 * random(`${seed}${i}`)) * (0.6 + 0.4 * Math.sin(i * 0.7));
    pts.push(`${x},${yy}`);
  }
  return <path d={`M -300 2400 L ${pts.join(' L ')} L 1400 2400 Z`} fill={color} opacity={opacity} strokeLinejoin="round" stroke={color} strokeWidth={30} />;
};

/** Pokok bulat berkelompok (gaya ilustrasi lembut) */
export const Tree: React.FC<{ x: number; y: number; s?: number; color: string; seed?: string; sway?: number }> = ({
  x,
  y,
  s = 1,
  color,
  seed = 't',
  sway = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${sway})`}>
    <path d="M -9 0 L -6 -150 L 6 -150 L 9 0 Z" fill={color} />
    <path d="M 0 -110 L -40 -170 M 2 -130 L 45 -185" stroke={color} strokeWidth={7} strokeLinecap="round" />
    {new Array(9).fill(0).map((_, i) => (
      <circle
        key={i}
        cx={(random(`${seed}x${i}`) - 0.5) * 150}
        cy={-170 - random(`${seed}y${i}`) * 120}
        r={45 + random(`${seed}r${i}`) * 40}
        fill={color}
      />
    ))}
  </g>
);

export const Plant: React.FC<{ x: number; y: number; s?: number; color: string; pot?: string }> = ({ x, y, s = 1, color, pot }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-60, -35, -12, 10, 32, 55].map((a, i) => (
      <path key={i} d={`M 0 -40 Q ${a * 0.8} -110 ${a * 1.6} ${-150 - (i % 2) * 30}`} stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" />
    ))}
    <path d="M -38 -45 L 38 -45 L 28 0 L -28 0 Z" fill={pot ?? color} />
  </g>
);

/** Bingkai gambar keluarga (menggunakan gambar yang dimuat naik) */
export const PhotoFrame: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  src?: string;
  frame?: string;
  tilt?: number;
  imgScale?: number;
  imgX?: number;
  imgY?: number;
  id: string;
  filter?: string;
}> = ({ x, y, w, h, src = 'img/keluarga-tengah.jpg', frame = '#f4efe6', tilt = 0, imgScale = 1, imgX = 0, imgY = 0, id, filter }) => {
  const b = Math.max(10, w * 0.06);
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <rect x={-6} y={8} width={w + 12} height={h + 12} rx={6} fill="rgba(0,0,0,0.25)" style={{ filter: 'blur(10px)' }} />
      <rect x={0} y={0} width={w} height={h} rx={4} fill={frame} />
      <clipPath id={`clip-${id}`}>
        <rect x={b} y={b} width={w - b * 2} height={h - b * 2} />
      </clipPath>
      <g clipPath={`url(#clip-${id})`}>
        <image
          href={staticFile(src)}
          x={b + imgX - ((imgScale - 1) * (w - b * 2)) / 2}
          y={b + imgY - ((imgScale - 1) * (h - b * 2)) / 2}
          width={(w - b * 2) * imgScale}
          height={(h - b * 2) * imgScale}
          preserveAspectRatio="xMidYMid slice"
          style={filter ? { filter } : undefined}
        />
        <rect x={b} y={b} width={w - b * 2} height={(h - b * 2) * 0.45} fill="url(#glass)" opacity={0.25} />
      </g>
      <defs>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
    </g>
  );
};

/** Wap naik dari cawan */
export const Steam: React.FC<{ x: number; y: number; t: number; s?: number; color?: string }> = ({ x, y, t, s = 1, color = '#ffffff' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} style={{ filter: 'blur(3px)' }}>
    {[0, 1, 2].map((i) => {
      const ph = t * 0.9 + i * 0.33;
      const k = ph % 1;
      return (
        <path
          key={i}
          d={`M ${(i - 1) * 10} 0 C ${(i - 1) * 10 + 18 * Math.sin(ph * 4)} -30, ${(i - 1) * 10 - 18 * Math.sin(ph * 3)} -60, ${(i - 1) * 10 + 10 * Math.sin(ph * 5)} -100`}
          stroke={color}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          opacity={0.5 * Math.sin(Math.PI * k)}
          transform={`translate(0 ${-k * 30})`}
        />
      );
    })}
  </g>
);

export const Cup: React.FC<{ x: number; y: number; s?: number; color: string }> = ({ x, y, s = 1, color }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -18 -30 L 18 -30 L 14 0 L -14 0 Z" fill={color} />
    <path d="M 17 -24 q 14 2 10 12 q -3 7 -12 5" stroke={color} strokeWidth={4} fill="none" />
    <ellipse cx={0} cy={2} rx={26} ry={4} fill={color} />
  </g>
);

/** Corak sejadah ringkas (geometri, tanpa imej makhluk) */
export const Sejadah: React.FC<{ x: number; y: number; w: number; h: number; color: string; accent: string }> = ({ x, y, w, h, color, accent }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={h} rx={6} fill={color} />
    <rect x={10} y={8} width={w - 20} height={h - 16} rx={4} fill="none" stroke={accent} strokeWidth={4} opacity={0.8} />
    {new Array(Math.floor((w - 40) / 30)).fill(0).map((_, i) => (
      <path key={i} d={`M ${30 + i * 30} ${h / 2 - 6} l 8 6 l -8 6 l -8 -6 Z`} fill={accent} opacity={0.7} />
    ))}
  </g>
);

/** Gerbang tingkap gaya mihrab */
export const archPath = (x: number, y: number, w: number, h: number) =>
  `M ${x} ${y + h} L ${x} ${y + w * 0.55} Q ${x} ${y} ${x + w / 2} ${y - w * 0.12} Q ${x + w} ${y} ${x + w} ${y + w * 0.55} L ${x + w} ${y + h} Z`;
