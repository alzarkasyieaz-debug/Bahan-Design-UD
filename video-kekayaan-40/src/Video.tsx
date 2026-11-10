import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { FPS, SCENES, SCENE_FRAMES, TOTAL_FRAMES, VO_END, VO_START, timeChunks } from './data/script';
import voManifest from './data/vo-manifest.json';
import { ColorGrade, FilmGrain, SceneCtx, Vignette, warmthOf } from './components/core';
import { SceneTitle, Subtitles } from './components/Typography';
import { Scene01 } from './scenes/Scene01';
import { Scene02 } from './scenes/Scene02';
import { Scene03 } from './scenes/Scene03';
import { Scene04 } from './scenes/Scene04';
import { Scene05 } from './scenes/Scene05';
import { Scene06 } from './scenes/Scene06';
import { Scene07 } from './scenes/Scene07';
import { Scene08 } from './scenes/Scene08';
import { Scene09 } from './scenes/Scene09';
import { Scene10 } from './scenes/Scene10';
import { Scene11 } from './scenes/Scene11';
import { Scene12 } from './scenes/Scene12';

const SCENE_COMPONENTS = [Scene01, Scene02, Scene03, Scene04, Scene05, Scene06, Scene07, Scene08, Scene09, Scene10, Scene11, Scene12];
const XFADE = 18; // frame cross-dissolve (0.6 s) — lembut, bukan flashy

type Manifest = { files: Record<string, string>; timing: Record<string, number[][]> };
const manifest = voManifest as Manifest;

/** Ducking automatik: muzik diperlahankan ketika suara latar berbunyi. */
const musicVolume = (frame: number) => {
  const sec = frame / FPS;
  const idx = Math.min(11, Math.floor(sec / 10));
  const local = sec - idx * 10;
  const hasVO = Boolean(manifest.files[String(idx + 1)]);
  const base = 0.9;
  if (!hasVO) return base;
  const chunks = timeChunks(SCENES[idx], manifest.timing[String(idx + 1)]);
  const s = chunks[0]?.start ?? VO_START;
  const e = chunks[chunks.length - 1]?.end ?? VO_END;
  const duck = interpolate(local, [s - 0.4, s, e, e + 0.6], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return base - duck * 0.55;
};

export const KekayaanSebenar: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneIdx = Math.min(11, Math.floor(frame / SCENE_FRAMES));
  const fadeIn = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [TOTAL_FRAMES - 45, TOTAL_FRAMES - 2], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
        {SCENES.map((scene, i) => {
          const C = SCENE_COMPONENTS[i];
          const lead = i === 0 ? 0 : XFADE;
          const from = i * SCENE_FRAMES - lead;
          return (
            <Sequence key={scene.id} from={from} durationInFrames={SCENE_FRAMES + lead + (i < 11 ? XFADE : 0)} name={`Babak ${scene.id} — ${scene.label}`}>
              <SceneCtx.Provider value={{ offset: lead, index: i }}>
                <CrossFade lead={lead}>
                  <C />
                  <ColorGrade w={warmthOf(i)} />
                  {scene.id !== 12 && scene.id !== 10 && <SceneTitle scene={scene} size={scene.id === 1 ? 138 : scene.title.length > 26 ? 92 : 112} />}
                  <Subtitles scene={scene} />
                </CrossFade>
              </SceneCtx.Provider>
            </Sequence>
          );
        })}
        <Vignette strength={0.42} />
        <FilmGrain opacity={sceneIdx === 6 || sceneIdx === 9 ? 0.12 : 0.06} />
      </AbsoluteFill>

      {/* -------- LAPISAN AUDIO -------- */}
      <Audio src={staticFile('audio/muzik.wav')} volume={musicVolume} />
      <Audio src={staticFile('audio/ambien.wav')} volume={0.9} />
      {SCENES.map((s, i) => {
        const file = manifest.files[String(s.id)];
        if (!file) return null;
        return (
          <Sequence key={`vo-${s.id}`} from={Math.round(i * SCENE_FRAMES + VO_START * FPS)} name={`VO ${s.id}`}>
            <Audio src={staticFile(file)} volume={1} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const CrossFade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const frame = useCurrentFrame();
  const o = lead === 0 ? 1 : interpolate(frame, [0, lead * 2], [0, 1], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
