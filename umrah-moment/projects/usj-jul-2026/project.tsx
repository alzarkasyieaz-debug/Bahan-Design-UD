import React from 'react';
import {
  CardWall, FramedShot, FullShot, GoldenFrame, Tiles, sec,
} from '../../src/components/core';

/*
 * ============================================================================
 *  PROJEK: USJ 4 – 12 Julai 2026 (Darul Mubarak Travel & Tours) — style UMRAH MOMENT
 * ============================================================================
 *  Album : Google Photos "Memori USJ 4- 12 Julai 2026"  (pNNN = album/usj-jul-2026/NNN.jpg)
 *          Nota: hanya 300 item pertama (4–6 Julai: KLIA, taklimat, ziarah perkampungan warisan,
 *          makan, kuda/unta) dapat dimuat — tiada gambar Masjidil Haram, jadi kapsyen tidak
 *          menyebut Kaabah.
 *  Lagu  : "Kita Pernah Bersama" (udcreative), segmen 0:02–4:02 (sama seperti projek usj-okt-2026)
 */

export const PROJECT = {
  title: 'UMRAH MOMENT',
  subtitle: 'Kenangan Indah Bersama di Tanah Suci',
  captions: {
    2: 'Kita datang dengan kisah berbeza…',
    3: 'Satu niat… satu perjalanan.',
    4: 'Bismillah… perjalanan bermula.',
    5: 'Doa mengiringi setiap langkah…',
    6: 'Menjadi tetamu Allah… satu anugerah.',
    7: 'Dari tidak mengenali… menjadi satu keluarga.',
    8: 'Senyuman ini… akan terus dirindui.',
    9: 'Ukhuwah yang terbina sepanjang perjalanan.',
    10: 'Langkah demi langkah… bersama.',
    11: 'Setiap detik… menjadi kenangan.',
    12: 'Saling membantu… saling menjaga.',
    13: 'Menyusuri bumi penuh sejarah.',
    14: 'Terima kasih atas setiap bimbingan…',
    15: 'Menyusuri bumi penuh keberkatan.',
    16: 'Gelak tawa, cerita dan kenangan…',
    17: 'Rezeki yang dikongsi bersama.',
    18: 'Ada doa yang dipanjatkan dalam diam…',
    19: 'Setiap gambar menyimpan sebuah cerita.',
    20: 'Andai rindu ini mampu berbicara…',
    21: 'Berat untuk berpisah…',
    22: 'Semoga Allah menerima segala amalan kita.',
  } as Record<number, string>,
  finale: {
    at: 223.0, until: 230.4,
    title: 'KENANGAN INDAH BERSAMA',
    subtitle: 'Berpisah di dunia… semoga bertemu lagi di Tanah Suci.',
    doa: 'Semoga Allah mempertemukan kita kembali. Aamiin.',
  },
  endCard: { at: 230.0, intro: 'INGATAN IKHLAS DARIPADA', name: 'Ustaz Zulhafeez', role: 'MUTAWWIF', bg: 'p233' },
  rays: [[0, 9, 0.5], [121, 129, 0.3], [171, 179, 0.3], [211, 219, 0.45], [224, 240, 0.3]] as [number, number, number][],
  dustHigh: [[0, 10], [190, 240]] as [number, number][],
};

const S = (s: number) => sec(s);
const X = 14;

/** Kad landskap untuk CardWall (3 kad melintang). */
const L3 = (a: string, b: string, c: string) => [
  { id: a, x: 420, y: 420, h: 400, rot: -5, depth: 0.8, focal: [0.5, 0.4] as [number, number] },
  { id: b, x: 1500, y: 470, h: 400, rot: 5, depth: 0.9, delay: 10, focal: [0.5, 0.4] as [number, number] },
  { id: c, x: 960, y: 460, h: 540, rot: 0.5, depth: 1.4, delay: 22, focal: [0.5, 0.4] as [number, number] },
];
/** Kad potret untuk CardWall (3 kad). */
const P3 = (a: string, b: string, c: string, gold = false) => [
  { id: a, x: 470, y: 450, h: 650, rot: -5, depth: 0.8, focal: [0.5, 0.3] as [number, number] },
  { id: b, x: 1450, y: 460, h: 630, rot: 5, depth: 0.9, delay: 12, focal: [0.5, 0.3] as [number, number] },
  { id: c, x: 960, y: 450, h: 730, rot: 0.5, depth: 1.4, delay: 26, gold, focal: [0.5, 0.3] as [number, number] },
];
/** Mozek: petak besar + 2 petak kecil (side: 'left' | 'right' untuk petak besar). */
const M3 = (big: string, a: string, b: string, side: 'left' | 'right') => {
  const bx = side === 'left' ? 24 : 736;
  const sx = side === 'left' ? 1208 : 24;
  return [
    { id: big, x: bx, y: 24, w: 1160, h: 1032, focal: [0.5, 0.42] as [number, number], delay: 0 },
    { id: a, x: sx, y: 24, w: 688, h: 504, focal: [0.5, 0.38] as [number, number], delay: 8 },
    { id: b, x: sx, y: 552, w: 688, h: 504, focal: [0.5, 0.38] as [number, number], delay: 14 },
  ];
};

export const Scenes: React.FC = () => (
  <>
    {/* 1 | 0:00 COVER — foto kumpulan besar dengan bendera di perkampungan warisan */}
    <FullShot id="p047" from={S(0)} dur={S(10.6)} fadeIn={0} zoom={[1.0, 1.12]} focal={[0.5, 0.44]} />

    {/* 2 | 0:10 KLIA — perpisahan dengan keluarga, daftar masuk */}
    <FullShot id="p000" from={S(9.4)} dur={S(4.4)} fadeIn={24} zoom={[1.06, 1.12]} pan={[60, 0, -60, 0]} focal={[0.55, 0.45]} />
    <FullShot id="p006" from={S(13.2)} dur={S(3.8)} fadeIn={X + 4} zoom={[1.08, 1.14]} pan={[-60, 0, 60, 0]} focal={[0.5, 0.5]} />
    <FramedShot id="p004" from={S(16.4)} dur={S(4.2)} fadeIn={X + 4} height={880} rot={[-6, 3]} focal={[0.5, 0.4]} />

    {/* 3 | 0:20 Satu niat — keluarga & jemaah */}
    <FramedShot id="p040" from={S(19.4)} dur={S(4.4)} fadeIn={24} height={880} rot={[5, -2]} focal={[0.5, 0.3]} />
    <FramedShot id="p008" from={S(23.2)} dur={S(3.6)} fadeIn={X + 4} height={880} rot={[-4, 3]} focal={[0.5, 0.35]} />
    <FullShot id="p031" from={S(26.2)} dur={S(4.4)} fadeIn={X + 4} zoom={[1.0, 1.08]} focal={[0.45, 0.6]} />

    {/* 4 | 0:30 Taklimat sebelum berlepas */}
    <FramedShot id="p028" from={S(29.4)} dur={S(5.0)} fadeIn={24} height={880} rot={[-4, 3]} focal={[0.5, 0.35]} />
    <FramedShot id="p020" from={S(33.8)} dur={S(6.8)} fadeIn={X + 6} height={880} rot={[4, -2]} focal={[0.5, 0.5]} />

    {/* 5 | 0:40 Menunggu & berdoa */}
    <FramedShot id="p024" from={S(39.4)} dur={S(3.6)} fadeIn={24} height={880} rot={[-5, 2]} focal={[0.5, 0.6]} />
    <FramedShot id="p043" from={S(42.4)} dur={S(3.6)} fadeIn={X + 4} height={880} rot={[5, -2]} focal={[0.5, 0.45]} />
    <FramedShot id="p044" from={S(45.4)} dur={S(5.2)} fadeIn={X + 4} gold height={880} rot={[-4, 3]} focal={[0.5, 0.45]} />

    {/* 6 | 0:50 Perkampungan warisan */}
    <FullShot id="p053" from={S(49.4)} dur={S(3.6)} fadeIn={24} zoom={[1.0, 1.08]} focal={[0.5, 0.55]} />
    <FullShot id="p052" from={S(52.4)} dur={S(3.6)} fadeIn={X + 4} zoom={[1.08, 1.0]} focal={[0.5, 0.55]} />
    <FullShot id="p059" from={S(55.4)} dur={S(5.2)} fadeIn={X + 4} zoom={[1.0, 1.08]} focal={[0.5, 0.55]} />

    {/* 7 | 1:00 Ukhuwah (pre-chorus) */}
    <CardWall from={S(59.4)} dur={S(5.8)} fadeIn={24} bg="p075" cards={L3('p070', 'p077', 'p075')} />
    <CardWall from={S(64.6)} dur={S(6.0)} fadeIn={X + 6} bg="p074" cards={L3('p071', 'p063', 'p074')} />

    {/* 8 | 1:10 Senyuman */}
    <Tiles from={S(69.4)} dur={S(5.6)} fadeIn={24} tiles={M3('p130', 'p137', 'p062', 'left')} />
    <Tiles from={S(74.4)} dur={S(6.2)} fadeIn={X + 4} tiles={M3('p264', 'p141', 'p144', 'right')} />

    {/* 9 | 1:20 CHORUS 1 — berhimpun bersama */}
    <FullShot id="p232" from={S(79.4)} dur={S(5.4)} fadeIn={24} zoom={[1.0, 1.1]} focal={[0.6, 0.5]} />
    <FullShot id="p213" from={S(84.2)} dur={S(6.4)} fadeIn={X + 6} zoom={[1.08, 1.0]} focal={[0.5, 0.5]} />

    {/* 10 | 1:30 Langkah demi langkah */}
    <FramedShot id="p097" from={S(89.4)} dur={S(3.6)} fadeIn={24} height={880} rot={[-5, 2]} focal={[0.5, 0.4]} />
    <FramedShot id="p099" from={S(92.4)} dur={S(3.6)} fadeIn={X + 4} height={880} rot={[5, -2]} focal={[0.5, 0.35]} />
    <FramedShot id="p113" from={S(95.4)} dur={S(5.2)} fadeIn={X + 4} height={880} rot={[-4, 3]} focal={[0.5, 0.35]} />
    <GoldenFrame from={S(90.0)} dur={S(10.0)} />

    {/* 11 | 1:40 Setiap detik */}
    <CardWall from={S(99.4)} dur={S(10.6)} fadeIn={24} bg="p279" cards={P3('p149', 'p164', 'p279', true)} />

    {/* 12 | 1:50 Saling membantu */}
    <FramedShot id="p003" from={S(109.4)} dur={S(5.0)} fadeIn={24} gold height={860} rot={[6, -3]} focal={[0.5, 0.3]} />
    <FramedShot id="p042" from={S(113.8)} dur={S(6.8)} fadeIn={X + 6} height={880} rot={[-4, 2]} focal={[0.5, 0.35]} />

    {/* 13 | 2:00 Bumi penuh sejarah */}
    <FullShot id="p135" from={S(119.4)} dur={S(5.6)} fadeIn={24} zoom={[1.0, 1.1]} focal={[0.5, 0.45]} />
    <FullShot id="p128" from={S(124.4)} dur={S(6.2)} fadeIn={X + 6} zoom={[1.1, 1.0]} focal={[0.5, 0.5]} />

    {/* 14 | 2:10 VERSE 2 (isi hati mutawif) — bimbingan */}
    <FramedShot id="p018" from={S(129.4)} dur={S(5.0)} fadeIn={24} height={880} rot={[-4, 3]} focal={[0.5, 0.4]} />
    <FullShot id="p225" from={S(133.8)} dur={S(6.8)} fadeIn={X + 6} zoom={[1.0, 1.08]} focal={[0.4, 0.35]} />

    {/* 15 | 2:20 Ziarah */}
    <CardWall from={S(139.4)} dur={S(10.6)} fadeIn={24} bg="p120" cards={P3('p165', 'p178', 'p120')} />

    {/* 16 | 2:30 Gelak tawa — kuda, unta, telaga */}
    <Tiles from={S(149.4)} dur={S(5.6)} fadeIn={24} tiles={M3('p282', 'p295', 'p214', 'left')} />
    <Tiles from={S(154.4)} dur={S(6.2)} fadeIn={X + 4} tiles={M3('p262', 'p186', 'p154', 'right').map((t) => (t.id === 'p154' ? { ...t, focal: [0.5, 0.62] as [number, number] } : t))} />

    {/* 17 | 2:40 Makan bersama */}
    <FullShot id="p267" from={S(159.4)} dur={S(5.0)} fadeIn={24} zoom={[1.0, 1.08]} focal={[0.5, 0.5]} />
    <FullShot id="p297" from={S(163.8)} dur={S(6.8)} fadeIn={X + 6} zoom={[1.08, 1.0]} focal={[0.5, 0.55]} />

    {/* 18 | 2:50 PRE-CHORUS 2 — doa dalam diam */}
    <FramedShot id="p114" from={S(169.4)} dur={S(5.0)} fadeIn={24} height={880} rot={[5, -2]} focal={[0.5, 0.35]} />
    <FramedShot id="p168" from={S(173.8)} dur={S(6.8)} fadeIn={X + 6} height={880} rot={[-5, 2]} focal={[0.5, 0.3]} />

    {/* 19 | 3:00 Bersama */}
    <CardWall from={S(179.4)} dur={S(10.6)} fadeIn={24} bg="p066" cards={[
      { id: 'p012', x: 470, y: 450, h: 650, rot: -5, depth: 0.8, focal: [0.5, 0.35] },
      { id: 'p090', x: 1450, y: 460, h: 630, rot: 5, depth: 0.9, delay: 12, focal: [0.5, 0.3] },
      { id: 'p066', x: 960, y: 470, h: 520, rot: 0.5, depth: 1.4, delay: 26, gold: true, focal: [0.5, 0.45] },
    ]} />

    {/* 20 | 3:10 CHORUS 2 — dinding kenangan */}
    <CardWall from={S(189.4)} dur={S(11.2)} fadeIn={24} bg="p188" camera={90} cards={[
      { id: 'p093', x: 230, y: 560, h: 400, rot: -4, depth: 0.6, delay: 0, focal: [0.5, 0.3] },
      { id: 'p147', x: 520, y: 330, h: 430, rot: -6, depth: 0.85, delay: 8, focal: [0.5, 0.3] },
      { id: 'p163', x: 560, y: 760, h: 390, rot: 4, depth: 0.9, delay: 16, focal: [0.5, 0.3] },
      { id: 'p177', x: 1400, y: 330, h: 430, rot: 5, depth: 0.85, delay: 24, focal: [0.5, 0.3] },
      { id: 'p106', x: 1380, y: 770, h: 390, rot: -4, depth: 0.9, delay: 32, focal: [0.5, 0.3] },
      { id: 'p188', x: 960, y: 520, h: 640, rot: 0.5, depth: 1.4, delay: 44, gold: true, focal: [0.5, 0.3] },
    ]} />

    {/* 21 | 3:20 Perpisahan */}
    <FullShot id="p230" from={S(199.4)} dur={S(5.0)} fadeIn={24} zoom={[1.0, 1.06]} focal={[0.5, 0.5]} />
    <FramedShot id="p236" from={S(203.8)} dur={S(6.8)} fadeIn={X + 6} height={880} rot={[-4, 2]} focal={[0.5, 0.4]} />

    {/* 22 | 3:30 Doa & harapan */}
    <FramedShot id="p228" from={S(209.4)} dur={S(11.0)} fadeIn={24} height={940} gold rot={[-3, 3]} zoom={[1.14, 1.0]} focal={[0.5, 0.4]} />

    {/* 23 | 3:40 Grand finale — montaj → foto kumpulan berhimpun */}
    <FullShot id="p060" from={S(219.4)} dur={S(1.8)} fadeIn={20} zoom={[1.0, 1.06]} focal={[0.5, 0.55]} />
    <FullShot id="p234" from={S(220.6)} dur={S(1.6)} fadeIn={10} zoom={[1.0, 1.06]} focal={[0.5, 0.5]} />
    <FullShot id="p263" from={S(221.6)} dur={S(1.6)} fadeIn={10} zoom={[1.0, 1.06]} focal={[0.5, 0.5]} />
    <FullShot id="p233" from={S(222.4)} dur={S(8.6)} fadeIn={18} zoom={[1.12, 1.0]} focal={[0.55, 0.55]} />
    <GoldenFrame from={S(222.8)} dur={S(7.6)} inset={30} />

    {/* 24 | 3:50 Kad penutup: Ingatan Ikhlas Daripada (PROJECT.endCard) */}
  </>
);
