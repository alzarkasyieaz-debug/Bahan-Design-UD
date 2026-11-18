import React from 'react';
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import {
  Black, CardWall, FramedShot, FullShot, GoldDust, GoldenFrame, Grade, LightLeak, LightRays, LightSweep, TiltShot, Tiles, sec,
} from './components/core';
import { Caption, SubTitle, Title3D } from './components/Typography';

export const TOTAL_FRAMES = sec(120);

/*
 * SEBUAH RINDU… KENANGAN INDAH DI TANAH SUCI — 12 babak × 10 s
 * Semua gambar ialah foto asal jemaah (album "USJ 30 Sept-9 Okt"). Tiada wajah/kandungan diubah:
 * gambar potret dipaparkan dalam bingkai penuh (tidak dipotong), gambar landskap dipotong mengikut titik fokus.
 * Audio: lagu "Kita Pernah Bersama" (segmen 5.5–125.5 s) + suara latar pembukaan, dimix ke public/audio/mix.wav
 * oleh scripts/generate_audio.py. Chorus lagu bermula ~01:16 (babak 8) dan memuncak hingga babak 12.
 */

const S = (s: number) => sec(s);
const X = 14; // tempoh dissolve antara shot (frame)

const Scenes: React.FC = () => (
  <>
    {/* 1 | 00:00–00:10  THE OPENING — Kaabah */}
    <FullShot id="p280" from={S(0)} dur={S(10.6)} fadeIn={0} zoom={[1.0, 1.16]} focal={[0.5, 0.4]} />

    {/* 2 | 00:10–00:20  Perjalanan yang menyatukan hati — KLIA & pesawat */}
    <FullShot id="p022" from={S(9.4)} dur={S(4.4)} fadeIn={24} zoom={[1.08, 1.12]} pan={[70, 0, -70, 0]} focal={[0.5, 0.4]} />
    <FullShot id="p052" from={S(13.2)} dur={S(3.8)} fadeIn={X + 4} zoom={[1.1, 1.14]} pan={[-70, 0, 70, 0]} focal={[0.5, 0.42]} />
    <FullShot id="p092" from={S(16.4)} dur={S(4.2)} fadeIn={X + 4} zoom={[1.06, 1.12]} pan={[60, 0, -40, 0]} focal={[0.62, 0.45]} />

    {/* 3 | 00:20–00:30  Saat pertama di Tanah Suci */}
    <FramedShot id="p113" from={S(19.4)} dur={S(4.4)} fadeIn={24} height={880} rot={[5, -3]} focal={[0.5, 0.3]} />
    <FullShot id="p252" from={S(23.2)} dur={S(3.8)} fadeIn={X + 4} zoom={[1.02, 1.1]} focal={[0.5, 0.5]} />
    <FramedShot id="p247" from={S(26.4)} dur={S(4.2)} fadeIn={X + 4} height={880} rot={[-7, 3]} focal={[0.5, 0.35]} />

    {/* 4 | 00:30–00:40  Detik ibadah yang bermakna — Masjidil Haram */}
    <FullShot id="p259" from={S(29.4)} dur={S(3.0)} fadeIn={24} zoom={[1.0, 1.06]} focal={[0.5, 0.42]} />
    <FullShot id="p270" from={S(31.8)} dur={S(3.0)} fadeIn={X + 4} zoom={[1.07, 1.0]} focal={[0.5, 0.45]} />
    <FramedShot id="p274" from={S(34.2)} dur={S(3.0)} fadeIn={X + 4} height={860} rot={[-5, 2]} focal={[0.5, 0.3]} />
    <FramedShot id="p290" from={S(36.6)} dur={S(4.0)} fadeIn={X + 4} gold height={860} rot={[6, -3]} focal={[0.4, 0.5]} />
    <GoldenFrame from={S(30.0)} dur={S(10.0)} />

    {/* 5 | 00:40–00:50  Senyuman yang takkan dilupakan — kolaj terapung */}
    <CardWall from={S(39.4)} dur={S(5.8)} fadeIn={24} bg="p250" cards={[
      { id: 'p250', x: 480, y: 440, h: 640, rot: -5, depth: 0.8, focal: [0.5, 0.3] },
      { id: 'p088', x: 1450, y: 470, h: 470, rot: 5, depth: 0.9, delay: 10, focal: [0.5, 0.4] },
      { id: 'p130', x: 960, y: 450, h: 700, rot: 1.5, depth: 1.4, delay: 22, focal: [0.5, 0.3] },
    ]} />
    <CardWall from={S(44.6)} dur={S(6.0)} fadeIn={X + 6} bg="p279" cards={[
      { id: 'p189', x: 520, y: 440, h: 640, rot: -4, depth: 0.8, focal: [0.5, 0.3] },
      { id: 'p019', x: 1420, y: 450, h: 620, rot: 4, depth: 0.9, delay: 10, focal: [0.5, 0.35] },
      { id: 'p279', x: 960, y: 450, h: 720, rot: -1, depth: 1.4, delay: 22, focal: [0.5, 0.3] },
    ]} />

    {/* 6 | 00:50–01:00  Ukhuwah yang terbina — foto kumpulan & split-screen */}
    <FullShot id="p231" from={S(49.4)} dur={S(4.6)} fadeIn={24} zoom={[1.1, 1.0]} focal={[0.5, 0.55]} />
    <Tiles from={S(53.4)} dur={S(7.2)} fadeIn={X} tiles={[
      { id: 'p211', x: 24, y: 24, w: 616, h: 1032, focal: [0.5, 0.35], delay: 0 },
      { id: 'p185', x: 652, y: 24, w: 616, h: 1032, focal: [0.5, 0.35], delay: 8 },
      { id: 'p132', x: 1280, y: 24, w: 616, h: 1032, focal: [0.45, 0.35], delay: 16 },
    ]} />

    {/* 7 | 01:00–01:10  Indahnya bersama — mozek kenangan santai */}
    <Tiles from={S(59.4)} dur={S(5.6)} fadeIn={24} tiles={[
      { id: 'p223', x: 24, y: 24, w: 1160, h: 1032, focal: [0.5, 0.42], delay: 0 },
      { id: 'p149', x: 1208, y: 24, w: 688, h: 504, focal: [0.5, 0.33], delay: 8 },
      { id: 'p155', x: 1208, y: 552, w: 688, h: 504, focal: [0.5, 0.42], delay: 14 },
    ]} />
    <Tiles from={S(64.4)} dur={S(6.2)} fadeIn={X + 4} tiles={[
      { id: 'p226', x: 736, y: 24, w: 1160, h: 1032, focal: [0.5, 0.45], delay: 0 },
      { id: 'p227', x: 24, y: 24, w: 688, h: 504, focal: [0.5, 0.45], delay: 8 },
      { id: 'p147', x: 24, y: 552, w: 688, h: 504, focal: [0.5, 0.42], delay: 14 },
    ]} />

    {/* 8 | 01:10–01:20  Ketenangan di Tanah Haram — panorama menegak menara Masjidil Haram */}
    <TiltShot id="p294" from={S(69.4)} dur={S(5.6)} fadeIn={24} fromY={0.95} toY={0.2} />
    <TiltShot id="p296" from={S(74.4)} dur={S(6.2)} fadeIn={X + 6} fromY={0.9} toY={0.15} />

    {/* 9 | 01:20–01:30  Kenangan yang tersimpan — dinding kenangan */}
    <CardWall from={S(79.4)} dur={S(11.2)} fadeIn={24} bg="p282" camera={90} cards={[
      { id: 'p285', x: 230, y: 560, h: 400, rot: -4, depth: 0.6, delay: 0, focal: [0.5, 0.3] },
      { id: 'p299', x: 520, y: 330, h: 430, rot: -6, depth: 0.85, delay: 8, focal: [0.5, 0.3] },
      { id: 'p263', x: 560, y: 760, h: 390, rot: 4, depth: 0.9, delay: 16, focal: [0.5, 0.4] },
      { id: 'p265', x: 1400, y: 330, h: 430, rot: 5, depth: 0.85, delay: 24, focal: [0.5, 0.3] },
      { id: 'p244', x: 1380, y: 770, h: 390, rot: -4, depth: 0.9, delay: 32, focal: [0.5, 0.3] },
      { id: 'p282', x: 960, y: 520, h: 640, rot: 0.5, depth: 1.4, delay: 44, gold: true, focal: [0.5, 0.3] },
    ]} />

    {/* 10 | 01:30–01:40  Saat perpisahan */}
    <FullShot id="p286" from={S(89.4)} dur={S(4.4)} fadeIn={24} zoom={[1.0, 1.05]} focal={[0.5, 0.55]} />
    <FramedShot id="p276" from={S(93.2)} dur={S(4.0)} fadeIn={X + 6} height={880} rot={[-4, 2]} focal={[0.5, 0.4]} />
    <TiltShot id="p254" from={S(96.6)} dur={S(4.0)} fadeIn={X + 6} fromY={0.6} toY={0.45} zoom={[1.0, 1.04]} />

    {/* 11 | 01:40–01:50  Doa dan harapan — Kaabah, zoom-out perlahan */}
    <FramedShot id="p269" from={S(99.4)} dur={S(11.0)} fadeIn={24} height={940} gold rot={[-3, 3]} zoom={[1.14, 1.0]} focal={[0.5, 0.35]} />

    {/* 12 | 01:50–02:00  Grand finale — montaj ringkas → foto kumpulan */}
    <FullShot id="p258" from={S(109.4)} dur={S(1.8)} fadeIn={20} zoom={[1.0, 1.06]} focal={[0.5, 0.45]} />
    <FullShot id="p255" from={S(110.6)} dur={S(1.6)} fadeIn={10} zoom={[1.0, 1.06]} focal={[0.5, 0.5]} />
    <FramedShot id="p275" from={S(111.6)} dur={S(1.6)} fadeIn={10} height={900} rot={[2, 0]} focal={[0.5, 0.35]} />
    <FullShot id="p261" from={S(112.6)} dur={S(1.6)} fadeIn={10} zoom={[1.0, 1.06]} focal={[0.5, 0.42]} />
    <FullShot id="p080" from={S(113.4)} dur={S(6.6)} fadeIn={18} zoom={[1.12, 1.0]} focal={[0.5, 0.52]} />
    <GoldenFrame from={S(113.8)} dur={S(6.2)} inset={30} />
  </>
);

const Effects: React.FC = () => {
  const f = useCurrentFrame();
  // Sinaran cahaya hanya pada babak pembukaan, Tanah Haram, doa dan penutup
  const rays = interpolate(f, [0, S(9), S(10.5), S(69.5), S(71), S(79), S(80.5), S(99.5), S(101), S(109), S(110), S(113.5), S(115), S(120)],
    [0.5, 0.5, 0, 0, 0.3, 0.3, 0, 0, 0.45, 0.45, 0, 0, 0.3, 0.3], { extrapolateRight: 'clamp' });
  const dust = interpolate(f, [0, S(10), S(12), S(78), S(80), S(110), S(120)], [1, 1, 0.55, 0.55, 0.9, 0.9, 1], { extrapolateRight: 'clamp' });
  return (
  <>
    {rays > 0.01 && <LightRays opacity={rays} />}
    <GoldDust count={60} intensity={dust} />
    {/* light leak & sapuan cahaya di setiap peralihan babak */}
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => (
      <LightLeak key={k} center={S(k * 10 - 0.3)} len={44} strength={0.42} dir={k % 2 ? 1 : -1} />
    ))}
    <LightSweep at={S(4.2)} len={50} strength={0.3} />
    <LightSweep at={S(115.2)} len={50} strength={0.3} />
  </>
  );
};

const Texts: React.FC = () => (
  <>
    {/* Babak 1 */}
    <Title3D text="SEBUAH RINDU…" at={S(2.0)} until={S(9.6)} size={124} y={215} />
    <SubTitle text="Kenangan Indah Bersama di Tanah Suci" at={S(3.8)} until={S(9.6)} y={345} size={42} />

    <Caption text="Kita datang dengan kisah berbeza…" at={S(11.0)} until={S(19.3)} />
    <Caption text="Menjadi tetamu Allah… satu anugerah." at={S(21.0)} until={S(29.3)} />
    <Caption text="Setiap doa… membawa seribu harapan." at={S(31.0)} until={S(39.3)} />
    <Caption text="Senyuman ini… akan terus dirindui." at={S(41.0)} until={S(49.3)} />
    <Caption text="Dari tidak mengenali… menjadi satu keluarga." at={S(51.0)} until={S(59.3)} />
    <Caption text="Gelak tawa, cerita dan kenangan…" at={S(61.0)} until={S(69.3)} />
    <Caption text="Makkah… kota yang sentiasa dirindui." at={S(71.0)} until={S(79.3)} />
    <Caption text="Setiap gambar menyimpan sebuah cerita." at={S(81.0)} until={S(89.3)} />
    <Caption text="Berat untuk berpisah…" at={S(91.0)} until={S(99.3)} />
    <Caption text="Semoga Allah menerima segala amalan kita." at={S(101.0)} until={S(109.2)} />

    {/* Babak 12 */}
    <Title3D text="KENANGAN INDAH BERSAMA" at={S(114.0)} until={S(119.7)} size={92} y={165} />
    <SubTitle text="Berpisah di dunia… semoga bertemu lagi di Tanah Suci." at={S(115.4)} until={S(119.7)} y={282} size={38} />
    <SubTitle text="Semoga Allah mempertemukan kita kembali. Aamiin." at={S(116.7)} until={S(119.7)} y={988} size={36} italic color="#F3D58F" />
  </>
);

export const SebuahRindu: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Scenes />
    <Grade warmth={0.3} />
    <Effects />
    <Texts />
    <Black points={[[0, 1], [S(1.6), 0], [S(118.6), 0], [S(119.9), 1]]} />
    <Audio src={staticFile('audio/mix.wav')} />
  </AbsoluteFill>
);

