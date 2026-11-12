import React from 'react';
import { Composition, continueRender, delayRender, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { NakSeeHeartVideo } from './Video';
import { FPS, TOTAL_FRAMES, W, H } from './lib';

// Fon tempatan (SIL Open Font License) — tiada muat turun semasa render
const handle = delayRender('Memuatkan fon');
Promise.all([
  loadFont({ family: 'Bebas Neue', url: staticFile('fonts/BebasNeue.woff2'), weight: '400' }),
  loadFont({ family: 'Cinzel', url: staticFile('fonts/cinzel-latin-800-normal.woff2'), weight: '800' }),
  loadFont({ family: 'Montserrat', url: staticFile('fonts/montserrat-latin-500-normal.woff2'), weight: '500' }),
  loadFont({ family: 'Montserrat', url: staticFile('fonts/montserrat-latin-600-normal.woff2'), weight: '600' }),
  loadFont({ family: 'Montserrat', url: staticFile('fonts/montserrat-latin-800-normal.woff2'), weight: '800' }),
  loadFont({ family: 'Montserrat', url: staticFile('fonts/montserrat-latin-900-normal.woff2'), weight: '900' }),
  loadFont({ family: 'Playfair Display', url: staticFile('fonts/PlayfairDisplay-Italic.woff2'), weight: '400', style: 'italic' }),
]).then(() => continueRender(handle));

export const RemotionRoot: React.FC = () => (
  <Composition id="NakSeeHeartSangkaBaik" component={NakSeeHeartVideo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
