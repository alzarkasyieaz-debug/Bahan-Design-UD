import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { SCENES } from './data';
import { Grade } from './components/FX';
import { CollageScene, FilmScene, FinaleScene, MosaicScene, Opening, WallScene } from './Scenes';
import { SCENE, XF } from './theme';

export const TOTAL = SCENE * SCENES.length; // 6300 frame = 210 s

const SceneFade: React.FC<{ first: boolean; children: React.ReactNode }> = ({ first, children }) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, XF], [0, 1], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const SebuahRindu: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    {SCENES.map((s, i) => {
      const last = i === SCENES.length - 1;
      return (
        <Sequence key={i} from={i * SCENE} durationInFrames={SCENE + (last ? 0 : XF)}>
          <SceneFade first={i === 0}>
            {s.layout === 'opening' && <Opening s={s} />}
            {s.layout === 'film' && <FilmScene s={s} />}
            {s.layout === 'collage' && <CollageScene s={s} />}
            {s.layout === 'mosaic' && <MosaicScene s={s} />}
            {s.layout === 'wall' && <WallScene s={s} />}
            {s.layout === 'finale' && <FinaleScene s={s} />}
          </SceneFade>
        </Sequence>
      );
    })}
    <Grade />
    {/* Lagu tema: "Kita Pernah Bersama" (udcreative) — dipotong 0:00–3:30, fade-in 0.5 s, fade-out 8 s */}
    <Audio src={staticFile('audio/kita-pernah-bersama-210s.mp3')} volume={1} />
  </AbsoluteFill>
);
