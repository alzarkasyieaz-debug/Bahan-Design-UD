import React from 'react';
import { Composition, continueRender, delayRender, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { LawatanPPS } from './Video';
import { FPS, TOTAL_FRAMES } from './data/timeline';

// Fon tempatan (SIL Open Font License) — tiada muat turun semasa render
const handle = delayRender('Memuatkan fon');
const f = (family: string, file: string, weight: string, style = 'normal') =>
  loadFont({ family, url: staticFile(`fonts/${file}.woff2`), weight, style });
Promise.all([
  f('Cinzel', 'cinzel-latin-600-normal', '600'),
  f('Cinzel', 'cinzel-latin-700-normal', '700'),
  f('Montserrat', 'montserrat-latin-500-normal', '500'),
  f('Montserrat', 'montserrat-latin-600-normal', '600'),
  f('Montserrat', 'montserrat-latin-700-normal', '700'),
  f('Montserrat', 'montserrat-latin-800-normal', '800'),
  f('Playfair Display', 'playfair-display-latin-600-normal', '600'),
  f('Playfair Display', 'playfair-display-latin-700-normal', '700'),
  f('Playfair Display', 'playfair-display-latin-500-italic', '500', 'italic'),
]).then(() => continueRender(handle));

export const RemotionRoot: React.FC = () => (
  <Composition id="LawatanPPS" component={LawatanPPS} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
);
