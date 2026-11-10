import React from 'react';
import { Composition, continueRender, delayRender, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { KekayaanSebenar } from './Video';
import { FPS, TOTAL_FRAMES } from './data/script';

// Fon tempatan (SIL Open Font License) — tiada muat turun semasa render
const fontHandle = delayRender('Memuatkan fon');
Promise.all([
  loadFont({ family: 'Bebas Neue', url: staticFile('fonts/BebasNeue.woff2'), weight: '400' }),
  loadFont({ family: 'Inter', url: staticFile('fonts/inter-latin-400-normal.woff2'), weight: '400' }),
  loadFont({ family: 'Inter', url: staticFile('fonts/inter-latin-600-normal.woff2'), weight: '600' }),
  loadFont({ family: 'Inter', url: staticFile('fonts/inter-latin-700-normal.woff2'), weight: '700' }),
  loadFont({ family: 'Playfair Display', url: staticFile('fonts/PlayfairDisplay-Italic.woff2'), weight: '400', style: 'italic' }),
]).then(() => continueRender(fontHandle));

export const RemotionRoot: React.FC = () => (
  <Composition
    id="KekayaanSebenar"
    component={KekayaanSebenar}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
