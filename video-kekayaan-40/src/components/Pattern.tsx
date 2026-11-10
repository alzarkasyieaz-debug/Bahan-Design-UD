import React from 'react';

/** Corak geometri Islamik (bintang 8 bucu) — hiasan dinding halus */
export const StarPattern: React.FC<{ x: number; y: number; cols: number; rows: number; size: number; color: string; opacity?: number }> = ({
  x,
  y,
  cols,
  rows,
  size,
  color,
  opacity = 0.15,
}) => (
  <g opacity={opacity} stroke={color} strokeWidth={2} fill="none">
    {new Array(rows).fill(0).map((_, r) =>
      new Array(cols).fill(0).map((__, c) => {
        const cx = x + c * size + (r % 2 ? size / 2 : 0);
        const cy = y + r * size * 0.9;
        const h = size * 0.32;
        return (
          <g key={`${r}-${c}`} transform={`translate(${cx} ${cy})`}>
            <rect x={-h} y={-h} width={h * 2} height={h * 2} />
            <rect x={-h} y={-h} width={h * 2} height={h * 2} transform="rotate(45)" />
            <circle r={h * 0.45} />
          </g>
        );
      }),
    )}
  </g>
);
