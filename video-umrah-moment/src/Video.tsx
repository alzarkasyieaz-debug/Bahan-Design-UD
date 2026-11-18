import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Background, Finish } from './components/Background';
import { CHAPTERS, TIMELINE, TOTAL_FRAMES } from './data';
import { ChapterScene, Fader, Intro, Outro } from './Scenes';

export const UmrahMoment: React.FC = () => {
  const f = useCurrentFrame();
  const vol = interpolate(f, [0, 30, TOTAL_FRAMES - 60, TOTAL_FRAMES], [0, 0.9, 0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Background />
      {TIMELINE.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur}>
          <Fader dur={s.dur} first={s.kind === 'intro'} last={s.kind === 'outro'}>
            {s.kind === 'intro' && <Intro dur={s.dur} />}
            {s.kind === 'chapter' && <ChapterScene c={CHAPTERS[s.idx]} no={s.idx + 1} />}
            {s.kind === 'outro' && <Outro dur={s.dur} />}
          </Fader>
        </Sequence>
      ))}
      <Finish />
      <Audio src={staticFile('audio/muzik.wav')} volume={vol} />
    </AbsoluteFill>
  );
};
