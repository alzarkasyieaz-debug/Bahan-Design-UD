import React from 'react';
import { Composition, Still, continueRender, delayRender, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { Appeal } from './Video';
import { Cover } from './Cover';
import { FPS, V30, V90 } from './data/script';

// Fon tempatan (SIL Open Font License). Cinzel digunakan sebagai pengganti Trajan Pro (berlesen komersial).
const fontHandle = delayRender('Memuatkan fon');
Promise.all([
  ...[500, 600, 700, 800].map((w) => loadFont({ family: 'Poppins', url: staticFile(`fonts/poppins-latin-${w}-normal.woff2`), weight: String(w) })),
  loadFont({ family: 'Cinzel', url: staticFile('fonts/cinzel-latin-700-normal.woff2'), weight: '700' }),
]).then(() => continueRender(fontHandle));

const Appeal90: React.FC = () => <Appeal v={V90} music="audio/muzik-90.wav" ambience="audio/ambien-90.wav" />;
const Appeal30: React.FC = () => <Appeal v={V30} music="audio/muzik-30.wav" ambience="audio/ambien-30.wav" />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="RayuanBanjir90" component={Appeal90} durationInFrames={V90.duration * FPS} fps={FPS} width={1080} height={1920} />
    <Composition id="RayuanBanjir30" component={Appeal30} durationInFrames={V30.duration * FPS} fps={FPS} width={1080} height={1920} />
    <Still id="Cover" component={Cover} width={1080} height={1920} />
  </>
);
