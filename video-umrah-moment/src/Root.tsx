import React from 'react';
import { Composition, continueRender, delayRender, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { UmrahMoment } from './Video';
import { TOTAL_FRAMES } from './data';
import { FPS, H, W } from './theme';

// Fon tempatan (SIL Open Font License) — tiada muat turun semasa render
const fontHandle = delayRender('Memuatkan fon');
Promise.all([
  loadFont({ family: 'Bebas Neue', url: staticFile('fonts/BebasNeue.woff2'), weight: '400' }),
  loadFont({ family: 'Inter', url: staticFile('fonts/inter-latin-400-normal.woff2'), weight: '400' }),
  loadFont({ family: 'Inter', url: staticFile('fonts/inter-latin-600-normal.woff2'), weight: '600' }),
  loadFont({ family: 'Playfair Display', url: staticFile('fonts/PlayfairDisplay-Italic.woff2'), weight: '400', style: 'italic' }),
  loadFont({ family: 'Amiri', url: staticFile('fonts/amiri-arabic-700-normal.woff2'), weight: '700' }),
]).then(() => continueRender(fontHandle));

export const RemotionRoot: React.FC = () => (
  <Composition id="UmrahMoment" component={UmrahMoment} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
