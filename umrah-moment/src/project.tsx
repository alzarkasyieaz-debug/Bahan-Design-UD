import React from 'react';
import {
  CardWall, FramedShot, FullShot, GoldenFrame, TiltShot, Tiles, sec,
} from './components/core';

/*
 * ============================================================================
 *  KANDUNGAN PROJEK (satu-satunya fail kod yang perlu diubah untuk group baharu)
 *  Style: UMRAH MOMENT — lihat STYLE.md · durasi: project.config.json ("duration", 120–240 s)
 * ============================================================================
 *  Group   : USJ 30 Sept – 9 Okt 2026 (Darul Mubarak Travel & Tours)
 *  Album   : Google Photos "USJ 30 Sept-9 Okt"  (pNNN = album/NNN.jpg)
 *  Lagu    : "Kita Pernah Bersama" (udcreative), segmen 0:02–4:02
 *            intro 0:00–0:12 · verse 1 · pre-chorus ~0:54 · chorus 1 ~1:20–2:01
 *            verse 2 (isi hati mutawif) ~2:07 · pre-chorus 2 ~2:49 · chorus 2 ~3:11–3:56
 *
 *  Peraturan gaya:
 *   - Babak 10 s; babak k bermula pada (k-1)*10 s. Shot pertama babak bermula 0.6 s lebih awal (dissolve).
 *   - Landskap → FullShot (Ken Burns, `focal` = titik wajah [x,y] 0..1).
 *   - Potret   → FramedShot / CardWall / Tiles (tiada wajah dipotong).
 *   - Seni bina potret → TiltShot (panorama menegak).
 *   - Babak 1 (cover) = foto kumpulan PALING RAMAI, ruang kosong di atas untuk tajuk.
 *   - Babak akhir = kad "Ingatan Ikhlas Daripada" + tandatangan.
 */

export const PROJECT = {
  /** Tajuk utama pembukaan (cover) — nama style */
  title: 'UMRAH MOMENT',
  subtitle: 'Kenangan Indah Bersama di Tanah Suci',
  /** Kapsyen mengikut nombor babak */
  captions: {
    2: 'Kita datang dengan kisah berbeza…',
    3: 'Satu niat… satu perjalanan.',
    4: 'Bismillah… menuju Baitullah.',
    5: 'Menjadi tetamu Allah… satu anugerah.',
    6: 'Berihram… menyahut seruan-Nya.',
    7: 'Dari tidak mengenali… menjadi satu keluarga.',
    8: 'Senyuman ini… akan terus dirindui.',
    9: 'Setiap doa… membawa seribu harapan.',
    10: 'Ukhuwah yang terikat di rumah Allah.',
    11: 'Anak-anak kecil… tetamu Allah yang istimewa.',
    12: 'Saling membantu… saling menjaga.',
    13: 'Makkah… kota yang sentiasa dirindui.',
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
  /** Kad penutup bertandatangan */
  endCard: { at: 230.0, intro: 'INGATAN IKHLAS DARIPADA', name: 'Ustaz Zulhafeez', role: 'MUTAWWIF', bg: 'p231' },
  /** Sinaran cahaya: [mula s, tamat s, kekuatan] */
  rays: [[0, 9, 0.5], [121, 129, 0.3], [171, 179, 0.3], [211, 219, 0.45], [224, 240, 0.3]] as [number, number, number][],
  /** Debu emas lebih terang: [mula s, tamat s] */
  dustHigh: [[0, 10], [190, 240]] as [number, number][],
};

const S = (s: number) => sec(s);
const X = 14; // tempoh dissolve antara shot (frame)

export const Scenes: React.FC = () => (
  <>
    {/* 1 | 0:00 COVER — seluruh jemaah di KLIA */}
    <FullShot id="p080" from={S(0)} dur={S(10.6)} fadeIn={0} zoom={[1.0, 1.14]} focal={[0.5, 0.54]} />

    {/* 2 | 0:10 Kita datang dengan kisah berbeza — KLIA */}
    <FullShot id="p022" from={S(9.4)} dur={S(4.4)} fadeIn={24} zoom={[1.08, 1.12]} pan={[70, 0, -70, 0]} focal={[0.5, 0.4]} />
    <FullShot id="p052" from={S(13.2)} dur={S(3.8)} fadeIn={X + 4} zoom={[1.1, 1.14]} pan={[-70, 0, 70, 0]} focal={[0.5, 0.42]} />
    <FramedShot id="p018" from={S(16.4)} dur={S(4.2)} fadeIn={X + 4} height={880} rot={[-6, 3]} focal={[0.5, 0.25]} />

    {/* 3 | 0:20 Satu niat — menunggu bersama keluarga */}
    <FullShot id="p037" from={S(19.4)} dur={S(4.4)} fadeIn={24} zoom={[1.0, 1.08]} focal={[0.45, 0.5]} />
    <FramedShot id="p030" from={S(23.2)} dur={S(3.6)} fadeIn={X + 4} height={880} rot={[5, -2]} focal={[0.5, 0.3]} />
    <FramedShot id="p055" from={S(26.2)} dur={S(4.4)} fadeIn={X + 4} height={880} rot={[-4, 3]} focal={[0.5, 0.3]} />

    {/* 4 | 0:30 Dalam pesawat */}
    <FullShot id="p087" from={S(29.4)} dur={S(3.6)} fadeIn={24} zoom={[1.0, 1.08]} focal={[0.4, 0.5]} />
    <FullShot id="p092" from={S(32.4)} dur={S(3.6)} fadeIn={X + 4} zoom={[1.06, 1.12]} pan={[60, 0, -40, 0]} focal={[0.62, 0.45]} />
    <FullShot id="p088" from={S(35.4)} dur={S(5.2)} fadeIn={X + 4} zoom={[1.1, 1.0]} focal={[0.5, 0.5]} />

    {/* 5 | 0:40 Tiba di Jeddah */}
    <FullShot id="p094" from={S(39.4)} dur={S(4.0)} fadeIn={24} zoom={[1.0, 1.1]} focal={[0.5, 0.55]} />
    <FullShot id="p109" from={S(42.8)} dur={S(3.4)} fadeIn={X + 4} zoom={[1.0, 1.06]} focal={[0.5, 0.45]} />
    <FramedShot id="p113" from={S(45.6)} dur={S(5.0)} fadeIn={X + 4} height={880} rot={[5, -3]} focal={[0.5, 0.3]} />

    {/* 6 | 0:50 Berihram ketika senja */}
    <FramedShot id="p236" from={S(49.4)} dur={S(3.6)} fadeIn={24} height={880} rot={[-5, 2]} focal={[0.5, 0.35]} />
    <FullShot id="p252" from={S(52.4)} dur={S(3.6)} fadeIn={X + 4} zoom={[1.02, 1.1]} focal={[0.5, 0.5]} />
    <FramedShot id="p247" from={S(55.4)} dur={S(5.2)} fadeIn={X + 4} height={880} rot={[-7, 3]} focal={[0.5, 0.35]} />

    {/* 7 | 1:00 Ukhuwah (pre-chorus: "kalian saudara yang amat ku kasih") */}
    <CardWall from={S(59.4)} dur={S(5.8)} fadeIn={24} bg="p117" cards={[
      { id: 'p115', x: 480, y: 450, h: 640, rot: -5, depth: 0.8, focal: [0.5, 0.3] },
      { id: 'p035', x: 1440, y: 460, h: 620, rot: 5, depth: 0.9, delay: 10, focal: [0.5, 0.35] },
      { id: 'p117', x: 960, y: 450, h: 720, rot: 1, depth: 1.4, delay: 22, focal: [0.5, 0.3] },
    ]} />
    <CardWall from={S(64.6)} dur={S(6.0)} fadeIn={X + 6} bg="p211" cards={[
      { id: 'p209', x: 500, y: 450, h: 640, rot: -4, depth: 0.8, focal: [0.5, 0.3] },
      { id: 'p176', x: 1430, y: 460, h: 620, rot: 4, depth: 0.9, delay: 10, focal: [0.5, 0.35] },
      { id: 'p211', x: 960, y: 450, h: 720, rot: -1, depth: 1.4, delay: 22, focal: [0.5, 0.3] },
    ]} />

    {/* 8 | 1:10 Senyuman */}
    <Tiles from={S(69.4)} dur={S(5.6)} fadeIn={24} tiles={[
      { id: 'p218', x: 24, y: 24, w: 1160, h: 1032, focal: [0.5, 0.4], delay: 0 },
      { id: 'p019', x: 1208, y: 24, w: 688, h: 504, focal: [0.5, 0.33], delay: 8 },
      { id: 'p185', x: 1208, y: 552, w: 688, h: 504, focal: [0.5, 0.3], delay: 14 },
    ]} />
    <Tiles from={S(74.4)} dur={S(6.2)} fadeIn={X + 4} tiles={[
      { id: 'p173', x: 736, y: 24, w: 1160, h: 1032, focal: [0.5, 0.45], delay: 0 },
      { id: 'p132', x: 24, y: 24, w: 688, h: 504, focal: [0.45, 0.3], delay: 8 },
      { id: 'p189', x: 24, y: 552, w: 688, h: 504, focal: [0.5, 0.3], delay: 14 },
    ]} />

    {/* 9 | 1:20 CHORUS 1 — di hadapan Kaabah */}
    <FullShot id="p280" from={S(79.4)} dur={S(5.4)} fadeIn={24} zoom={[1.0, 1.1]} focal={[0.5, 0.42]} />
    <FullShot id="p258" from={S(84.2)} dur={S(6.4)} fadeIn={X + 6} zoom={[1.08, 1.0]} focal={[0.5, 0.45]} />

    {/* 10 | 1:30 Ukhuwah di rumah Allah */}
    <FullShot id="p259" from={S(89.4)} dur={S(3.6)} fadeIn={24} zoom={[1.0, 1.06]} focal={[0.5, 0.42]} />
    <FullShot id="p261" from={S(92.4)} dur={S(3.6)} fadeIn={X + 4} zoom={[1.06, 1.0]} focal={[0.5, 0.42]} />
    <FullShot id="p270" from={S(95.4)} dur={S(5.2)} fadeIn={X + 4} zoom={[1.0, 1.07]} focal={[0.5, 0.45]} />
    <GoldenFrame from={S(90.0)} dur={S(10.0)} />

    {/* 11 | 1:40 Anak-anak kecil */}
    <CardWall from={S(99.4)} dur={S(10.6)} fadeIn={24} bg="p274" cards={[
      { id: 'p250', x: 470, y: 450, h: 660, rot: -5, depth: 0.8, focal: [0.5, 0.3] },
      { id: 'p263', x: 1450, y: 460, h: 640, rot: 5, depth: 0.9, delay: 12, focal: [0.5, 0.4] },
      { id: 'p274', x: 960, y: 460, h: 740, rot: 0.5, depth: 1.4, delay: 26, gold: true, focal: [0.5, 0.3] },
    ]} />

    {/* 12 | 1:50 Saling membantu, saling menjaga */}
    <FramedShot id="p290" from={S(109.4)} dur={S(5.0)} fadeIn={24} gold height={860} rot={[6, -3]} focal={[0.4, 0.5]} />
    <FramedShot id="p276" from={S(113.8)} dur={S(6.8)} fadeIn={X + 6} height={880} rot={[-4, 2]} focal={[0.5, 0.4]} />

    {/* 13 | 2:00 Makkah — menara & menara jam */}
    <TiltShot id="p294" from={S(119.4)} dur={S(5.6)} fadeIn={24} fromY={0.95} toY={0.2} />
    <TiltShot id="p288" from={S(124.4)} dur={S(6.2)} fadeIn={X + 6} fromY={0.9} toY={0.15} />

    {/* 14 | 2:10 VERSE 2 (isi hati mutawif) — taklimat & bimbingan */}
    <FullShot id="p066" from={S(129.4)} dur={S(5.0)} fadeIn={24} zoom={[1.0, 1.08]} focal={[0.4, 0.45]} />
    <FramedShot id="p069" from={S(133.8)} dur={S(6.8)} fadeIn={X + 6} height={880} rot={[-4, 3]} focal={[0.5, 0.4]} />

    {/* 15 | 2:20 Menyusuri bumi penuh keberkatan — ziarah */}
    <CardWall from={S(139.4)} dur={S(10.6)} fadeIn={24} bg="p120" cards={[
      { id: 'p116', x: 470, y: 450, h: 650, rot: -5, depth: 0.8, focal: [0.5, 0.3] },
      { id: 'p214', x: 1450, y: 460, h: 630, rot: 5, depth: 0.9, delay: 12, focal: [0.5, 0.3] },
      { id: 'p120', x: 960, y: 450, h: 730, rot: -1, depth: 1.4, delay: 26, focal: [0.5, 0.35] },
    ]} />

    {/* 16 | 2:30 Gelak tawa — pasar, unta, kereta kabel */}
    <Tiles from={S(149.4)} dur={S(5.6)} fadeIn={24} tiles={[
      { id: 'p153', x: 24, y: 24, w: 1160, h: 1032, focal: [0.5, 0.35], delay: 0 },
      { id: 'p149', x: 1208, y: 24, w: 688, h: 504, focal: [0.5, 0.33], delay: 8 },
      { id: 'p155', x: 1208, y: 552, w: 688, h: 504, focal: [0.5, 0.42], delay: 14 },
    ]} />
    <Tiles from={S(154.4)} dur={S(6.2)} fadeIn={X + 4} tiles={[
      { id: 'p223', x: 736, y: 24, w: 1160, h: 1032, focal: [0.5, 0.42], delay: 0 },
      { id: 'p147', x: 24, y: 24, w: 688, h: 504, focal: [0.5, 0.42], delay: 8 },
      { id: 'p227', x: 24, y: 552, w: 688, h: 504, focal: [0.5, 0.45], delay: 14 },
    ]} />

    {/* 17 | 2:40 Makan bersama */}
    <FullShot id="p226" from={S(159.4)} dur={S(5.0)} fadeIn={24} zoom={[1.0, 1.08]} focal={[0.5, 0.45]} />
    <FullShot id="p220" from={S(163.8)} dur={S(6.8)} fadeIn={X + 6} zoom={[1.08, 1.0]} focal={[0.5, 0.45]} />

    {/* 18 | 2:50 PRE-CHORUS 2 ("saat kalian menadah tangan") — doa dalam diam */}
    <FramedShot id="p248" from={S(169.4)} dur={S(3.6)} fadeIn={24} height={880} rot={[5, -2]} focal={[0.5, 0.35]} />
    <FramedShot id="p283" from={S(172.4)} dur={S(3.6)} fadeIn={X + 4} height={880} rot={[-5, 2]} focal={[0.5, 0.3]} />
    <FramedShot id="p228" from={S(175.4)} dur={S(5.2)} fadeIn={X + 4} height={880} rot={[4, -3]} focal={[0.5, 0.35]} />

    {/* 19 | 3:00 Keluarga di Tanah Haram */}
    <CardWall from={S(179.4)} dur={S(10.6)} fadeIn={24} bg="p299" cards={[
      { id: 'p241', x: 470, y: 450, h: 650, rot: -5, depth: 0.8, focal: [0.5, 0.35] },
      { id: 'p272', x: 1450, y: 460, h: 630, rot: 5, depth: 0.9, delay: 12, focal: [0.5, 0.3] },
      { id: 'p299', x: 960, y: 450, h: 730, rot: 0.5, depth: 1.4, delay: 26, gold: true, focal: [0.5, 0.35] },
    ]} />

    {/* 20 | 3:10 CHORUS 2 — dinding kenangan */}
    <CardWall from={S(189.4)} dur={S(11.2)} fadeIn={24} bg="p282" camera={90} cards={[
      { id: 'p285', x: 230, y: 560, h: 400, rot: -4, depth: 0.6, delay: 0, focal: [0.5, 0.3] },
      { id: 'p277', x: 520, y: 330, h: 430, rot: -6, depth: 0.85, delay: 8, focal: [0.5, 0.3] },
      { id: 'p279', x: 560, y: 760, h: 390, rot: 4, depth: 0.9, delay: 16, focal: [0.5, 0.3] },
      { id: 'p265', x: 1400, y: 330, h: 430, rot: 5, depth: 0.85, delay: 24, focal: [0.5, 0.3] },
      { id: 'p195', x: 1380, y: 770, h: 390, rot: -4, depth: 0.9, delay: 32, focal: [0.5, 0.3] },
      { id: 'p282', x: 960, y: 520, h: 640, rot: 0.5, depth: 1.4, delay: 44, gold: true, focal: [0.5, 0.3] },
    ]} />

    {/* 21 | 3:20 Saat perpisahan */}
    <FullShot id="p286" from={S(199.4)} dur={S(4.4)} fadeIn={24} zoom={[1.0, 1.05]} focal={[0.5, 0.55]} />
    <FramedShot id="p275" from={S(203.2)} dur={S(3.8)} fadeIn={X + 6} height={880} rot={[-4, 2]} focal={[0.5, 0.35]} />
    <TiltShot id="p254" from={S(206.4)} dur={S(4.2)} fadeIn={X + 6} fromY={0.6} toY={0.45} zoom={[1.0, 1.04]} />

    {/* 22 | 3:30 Doa & harapan — Kaabah, zoom-out perlahan */}
    <FramedShot id="p269" from={S(209.4)} dur={S(11.0)} fadeIn={24} height={940} gold rot={[-3, 3]} zoom={[1.14, 1.0]} focal={[0.5, 0.35]} />

    {/* 23 | 3:40 Grand finale — montaj ringkas → foto kumpulan berbendera di Makkah */}
    <FullShot id="p255" from={S(219.4)} dur={S(1.8)} fadeIn={20} zoom={[1.0, 1.06]} focal={[0.5, 0.5]} />
    <FullShot id="p262" from={S(220.6)} dur={S(1.6)} fadeIn={10} zoom={[1.0, 1.06]} focal={[0.5, 0.42]} />
    <FramedShot id="p251" from={S(221.6)} dur={S(1.6)} fadeIn={10} height={900} rot={[2, 0]} focal={[0.5, 0.3]} />
    <FullShot id="p231" from={S(222.4)} dur={S(8.6)} fadeIn={18} zoom={[1.12, 1.0]} focal={[0.5, 0.5]} />
    <GoldenFrame from={S(222.8)} dur={S(7.6)} inset={30} />

    {/* 24 | 3:50 Kad penutup: Ingatan Ikhlas Daripada — tandatangan Mutawwif (lihat PROJECT.endCard) */}
  </>
);
