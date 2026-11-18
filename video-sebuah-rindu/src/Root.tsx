import React from 'react';
import { Composition, continueRender, delayRender, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { SebuahRindu, TOTAL } from './Video';
import { FPS, H, W } from './theme';

// Fon tempatan (SIL Open Font License): Cinzel (tajuk), Poppins (subtajuk), Amiri (Arab)
const fontHandle = delayRender('Memuatkan fon');
Promise.all([
  loadFont({ family: 'Cinzel', url: staticFile('fonts/cinzel-latin-400-normal.woff2'), weight: '400' }),
  loadFont({ family: 'Cinzel', url: staticFile('fonts/cinzel-latin-600-normal.woff2'), weight: '600' }),
  loadFont({ family: 'Cinzel', url: staticFile('fonts/cinzel-latin-700-normal.woff2'), weight: '700' }),
  loadFont({ family: 'Poppins', url: staticFile('fonts/poppins-latin-300-normal.woff2'), weight: '300' }),
  loadFont({ family: 'Poppins', url: staticFile('fonts/poppins-latin-300-italic.woff2'), weight: '300', style: 'italic' }),
  loadFont({ family: 'Poppins', url: staticFile('fonts/poppins-latin-400-normal.woff2'), weight: '400' }),
  loadFont({ family: 'Poppins', url: staticFile('fonts/poppins-latin-500-normal.woff2'), weight: '500' }),
]).then(() => continueRender(fontHandle));

export const RemotionRoot: React.FC = () => (
  <Composition id="SebuahRindu" component={SebuahRindu} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
