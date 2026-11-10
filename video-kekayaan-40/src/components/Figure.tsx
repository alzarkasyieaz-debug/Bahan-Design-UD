import React from 'react';

/**
 * Kit figura siluet parametrik (gaya backlit sinematik).
 * Sudut dalam darjah: 0 = ke bawah, 90 = ke hadapan (arah muka), 180 = ke atas, -90 = ke belakang.
 * "l" = anggota sebelah jauh, "r" = sebelah dekat.
 */
export type Pose = {
  torso: number;
  head?: number; // condong kepala (darjah) relatif kepada tegak
  lUpper: number;
  lFore: number;
  rUpper: number;
  rFore: number;
  lThigh: number;
  lShin: number;
  rThigh: number;
  rShin: number;
};

export type FigureKind = 'man' | 'woman' | 'boy' | 'girl';

const dir = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [Math.sin(a), Math.cos(a)];
};
const add = (p: number[], deg: number, len: number) => {
  const [dx, dy] = dir(deg);
  return [p[0] + dx * len, p[1] + dy * len];
};

export const POSES: Record<string, Pose> = {
  stand: { torso: 180, lUpper: -4, lFore: 4, rUpper: 6, rFore: 12, lThigh: -3, lShin: -3, rThigh: 3, rShin: 2 },
  standHands: { torso: 180, lUpper: 20, lFore: 70, rUpper: 22, rFore: 75, lThigh: -3, lShin: -3, rThigh: 3, rShin: 2 },
  sit: { torso: 175, lUpper: 15, lFore: 80, rUpper: 20, rFore: 85, lThigh: 85, lShin: 4, rThigh: 92, rShin: 8 },
  sitCup: { torso: 172, lUpper: 15, lFore: 80, rUpper: 30, rFore: 140, lThigh: 85, lShin: 4, rThigh: 92, rShin: 8 },
  sitDoa: { torso: 178, head: 8, lUpper: 30, lFore: 150, rUpper: 34, rFore: 155, lThigh: 85, lShin: 4, rThigh: 92, rShin: 8 },
  kneelDoa: { torso: 180, head: 10, lUpper: 28, lFore: 150, rUpper: 32, rFore: 156, lThigh: 95, lShin: -88, rThigh: 98, rShin: -86 },
  kneelRest: { torso: 178, head: 18, lUpper: 25, lFore: 70, rUpper: 28, rFore: 74, lThigh: 95, lShin: -88, rThigh: 98, rShin: -86 },
  kneelOpen: { torso: 172, head: -4, lUpper: 60, lFore: 110, rUpper: 70, rFore: 120, lThigh: 70, lShin: -60, rThigh: 120, rShin: 0 },
  writeDesk: { torso: 165, head: 25, lUpper: 40, lFore: 95, rUpper: 45, rFore: 100, lThigh: 85, lShin: 4, rThigh: 92, rShin: 8 },
  relief: { torso: 186, head: -14, lUpper: 10, lFore: 40, rUpper: 14, rFore: 50, lThigh: 85, lShin: 4, rThigh: 92, rShin: 8 },
  holdPhoto: { torso: 180, head: 14, lUpper: 25, lFore: 110, rUpper: 28, rFore: 115, lThigh: -3, lShin: -3, rThigh: 3, rShin: 2 },
  shake: { torso: 178, head: 4, lUpper: -4, lFore: 4, rUpper: 45, rFore: 80, lThigh: -4, lShin: -4, rThigh: 4, rShin: 3 },
  hug: { torso: 172, head: 8, lUpper: 70, lFore: 100, rUpper: 75, rFore: 105, lThigh: -6, lShin: -6, rThigh: 8, rShin: 6 },
  breathe: { torso: 186, head: -16, lUpper: -14, lFore: -8, rUpper: 16, rFore: 24, lThigh: -3, lShin: -3, rThigh: 3, rShin: 2 },
  watch: { torso: 182, head: 6, lUpper: 4, lFore: 30, rUpper: 8, rFore: 34, lThigh: -4, lShin: -4, rThigh: 4, rShin: 3 },
  armsOpen: { torso: 176, head: -6, lUpper: 80, lFore: 110, rUpper: 95, rFore: 125, lThigh: 70, lShin: -70, rThigh: 120, rShin: 0 },
};

export const lerpPose = (a: Pose, b: Pose, k: number): Pose => {
  const out = {} as Pose;
  (Object.keys(a) as (keyof Pose)[]).forEach((key) => {
    out[key] = (a[key] ?? 0) + ((b[key] ?? 0) - (a[key] ?? 0)) * k;
  });
  return out;
};

/** Kitaran berjalan; phase dalam saat × kelajuan */
export const walkPose = (phase: number, amp = 1): Pose => {
  const s = Math.sin(phase * Math.PI * 2);
  const c = Math.cos(phase * Math.PI * 2);
  const th = 24 * amp;
  return {
    torso: 182,
    head: 0,
    lThigh: s * th,
    lShin: s * th - Math.max(0, -c) * 38 * amp,
    rThigh: -s * th,
    rShin: -s * th - Math.max(0, c) * 38 * amp,
    lUpper: -s * 20 * amp,
    lFore: -s * 20 * amp + 18,
    rUpper: s * 20 * amp,
    rFore: s * 20 * amp + 18,
  };
};

export const runPose = (phase: number): Pose => {
  const p = walkPose(phase, 1.6);
  return { ...p, torso: 192, lFore: p.lFore + 50, rFore: p.rFore + 50 };
};

const DIM = { thigh: 46, shin: 46, torso: 64, neck: 9, head: 12, upper: 33, fore: 31 };

// Profil torso: [kedudukan sepanjang paksi (0=pinggul,1=bahu), tebal depan, tebal belakang]
const PROFILE: Record<string, number[][]> = {
  man: [[-0.3, 16, 17], [-0.05, 14, 15], [0.3, 13, 12], [0.6, 14.5, 13], [0.84, 14, 14.5], [0.98, 9, 12], [1.07, 3, 5]],
  boy: [[-0.08, 13, 14], [0.3, 12, 11], [0.65, 13, 12], [0.9, 12, 12.5], [1.0, 8, 10], [1.08, 3, 5]],
  woman: [[-0.12, 14, 16], [0.25, 12, 12], [0.62, 15, 12], [0.88, 12, 13], [1.0, 8, 10], [1.08, 3, 5]],
};

/** Laluan licin (Catmull-Rom tertutup) */
const smooth = (pts: number[][]) => {
  const n = pts.length;
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
  }
  return d + ' Z';
};

export const Figure: React.FC<{
  x: number;
  y: number; // paras lantai
  scale?: number;
  kind?: FigureKind;
  pose: Pose;
  color: string;
  facing?: 1 | -1;
  kopiah?: boolean;
  bounce?: number;
  opacity?: number;
  rim?: string; // warna cahaya pinggir (rim light)
  holding?: React.ReactNode; // objek di tangan dekat
}> = ({ x, y, scale = 1, kind = 'man', pose, color, facing = 1, kopiah = false, bounce = 0, opacity = 1, rim, holding }) => {
  const child = kind === 'boy' || kind === 'girl';
  const female = kind === 'woman' || kind === 'girl';
  const d = DIM;
  const k = child ? 0.64 : female ? 0.93 : 1;
  const headR = d.head * (child ? 1.2 : 1);
  const headA = pose.torso - (pose.head ?? 0); // head > 0 = tunduk ke hadapan

  const hip = [0, 0];
  const shoulder = add(hip, pose.torso, d.torso * k);
  const neckTop = add(shoulder, pose.torso - (pose.head ?? 0) * 0.5, d.neck * k);
  const headC = add(neckTop, headA, headR * k * 0.95);
  const lKnee = add(hip, pose.lThigh, d.thigh * k);
  const lFoot = add(lKnee, pose.lShin, d.shin * k);
  const rKnee = add(hip, pose.rThigh, d.thigh * k);
  const rFoot = add(rKnee, pose.rShin, d.shin * k);
  const shArm = add(shoulder, pose.torso + 180, 6 * k);
  const lElbow = add(shArm, pose.lUpper, d.upper * k);
  const lHand = add(lElbow, pose.lFore, d.fore * k);
  const rElbow = add(shArm, pose.rUpper, d.upper * k);
  const rHand = add(rElbow, pose.rFore, d.fore * k);

  const lowest = Math.max(lFoot[1], rFoot[1], lKnee[1] + 7 * k, rKnee[1] + 7 * k) + 3 * k;
  const L = (a: number[], b: number[], w: number) => (
    <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} strokeWidth={w * k} stroke={color} strokeLinecap="round" />
  );
  const foot = (f: number[]) => {
    const toe = add(f, 90, 13 * k);
    return <line x1={f[0] - 3 * k} y1={f[1]} x2={toe[0]} y2={toe[1] + 1 * k} strokeWidth={8 * k} stroke={color} strokeLinecap="round" />;
  };

  // Torso berkontur
  const len = d.torso * k;
  const u = [(shoulder[0] - hip[0]) / len, (shoulder[1] - hip[1]) / len];
  const nrm = [-u[1], u[0]];
  const prof = PROFILE[female ? 'woman' : child ? 'boy' : 'man'];
  const front = prof.map(([s2, f]) => [hip[0] + u[0] * s2 * len + nrm[0] * f * k, hip[1] + u[1] * s2 * len + nrm[1] * f * k]);
  const back = prof.map(([s2, , b]) => [hip[0] + u[0] * s2 * len - nrm[0] * b * k, hip[1] + u[1] * s2 * len - nrm[1] * b * k]);
  const torsoD = smooth([...front, ...back.reverse()]);

  const standing = Math.abs(pose.lThigh) < 45 && Math.abs(pose.rThigh) < 45;
  const floorY = Math.max(lFoot[1], rFoot[1]);
  const xs = [lFoot[0], rFoot[0]];

  const head = (
    <g transform={`translate(${headC[0]} ${headC[1]}) rotate(${180 - headA}) scale(${k})`}>
      <ellipse cx={0} cy={0} rx={headR * 0.9} ry={headR * 1.05} fill={color} />
      <path d={`M ${headR * 0.75} ${-headR * 0.25} L ${headR * 1.12} ${headR * 0.22} L ${headR * 0.75} ${headR * 0.4} Z`} fill={color} />
      <circle cx={headR * 0.45} cy={headR * 0.72} r={headR * 0.42} fill={color} />
      {kopiah && <rect x={-headR * 0.92} y={-headR * 1.35} width={headR * 1.84} height={headR * 0.62} rx={2} fill={color} />}
      {female && (
        <path
          d={`M 0 ${-headR * 1.32} C ${headR * 1.25} ${-headR * 1.3}, ${headR * 1.38} ${headR * 0.15}, ${headR * 1.02} ${headR * 1.05}
             L ${headR * 1.5} ${headR * 3.7} C ${headR * 0.2} ${headR * 4.1}, ${-headR * 1.2} ${headR * 4.0}, ${-headR * 1.75} ${headR * 3.5}
             C ${-headR * 1.6} ${headR * 1.2}, ${-headR * 1.55} ${-headR * 1.2}, 0 ${-headR * 1.32} Z`}
          fill={color}
        />
      )}
    </g>
  );

  const body = (
    <g>
      {/* Anggota jauh */}
      {L(hip, lKnee, 20)}
      {L(lKnee, lFoot, 15.5)}
      {foot(lFoot)}
      {L(shArm, lElbow, 11)}
      {L(lElbow, lHand, 9)}
      <circle cx={lHand[0]} cy={lHand[1]} r={5.5 * k} fill={color} />

      {/* Kaki dekat */}
      {L(hip, rKnee, 20.5)}
      {L(rKnee, rFoot, 16)}
      {foot(rFoot)}

      {/* Pakaian wanita: jubah / baju kurung */}
      {female && standing && (
        <path
          d={`M ${-15 * k} ${-26 * k} L ${15 * k} ${-26 * k} Q ${Math.max(...xs) + 10 * k} ${floorY * 0.5}, ${Math.max(...xs) + 16 * k} ${floorY - 5 * k}
             L ${Math.min(...xs) - 16 * k} ${floorY - 5 * k} Q ${Math.min(...xs) - 10 * k} ${floorY * 0.5}, ${-15 * k} ${-26 * k} Z`}
          fill={color}
          stroke={color}
          strokeWidth={6 * k}
          strokeLinejoin="round"
        />
      )}
      {female && !standing && (
        <g>
          {L(hip, rKnee, 30)}
          {L(rKnee, add(rKnee, pose.rShin, d.shin * k * 0.85), 24)}
          {L(hip, lKnee, 28)}
        </g>
      )}

      <path d={torsoD} fill={color} />
      {L(shoulder, neckTop, 11)}
      {head}

      {/* Lengan dekat */}
      {L(shArm, rElbow, 11.5)}
      {L(rElbow, rHand, 9.5)}
      <circle cx={rHand[0]} cy={rHand[1]} r={5.8 * k} fill={color} />
      {holding && <g transform={`translate(${rHand[0]} ${rHand[1]})`}>{holding}</g>}
    </g>
  );

  return (
    <g
      transform={`translate(${x} ${y - bounce}) scale(${scale * facing} ${scale}) translate(0 ${-lowest})`}
      opacity={opacity}
      style={rim ? { filter: `drop-shadow(0 0 2px ${rim}) drop-shadow(0 0 9px ${rim})` } : undefined}
    >
      {body}
    </g>
  );
};
