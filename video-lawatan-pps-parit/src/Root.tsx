import React from 'react';
import { Composition, continueRender, delayRender, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { LawatanPPS } from './Video';
import { FPS, TOTAL_FRAMES, VARIANTS } from './data/timeline';

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
  <>
    {/* Video 1: hook teks "Di saat rakyat diuji, keprihatinan terus diberi" */}
    <Composition id="LawatanPPS" component={LawatanPPS} defaultProps={{ variant: 'asal' }} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
    {/* Video 2: hook suara asal YB "Sabar ya" kepada mangsa di khemah PPS */}
    <Composition id="LawatanPPS-Sabar" component={LawatanPPS} defaultProps={{ variant: 'sabar' }} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
    {/* Video 3: versi ringkas - hook "Sabar ya" + petikan ucapan sebagai suara latar, lebih banyak B-roll */}
    <Composition id="LawatanPPS-Ringkas" component={LawatanPPS} defaultProps={{ variant: 'ringkas' }} durationInFrames={VARIANTS.ringkas.duration * FPS} fps={FPS} width={1080} height={1920} />
  </>
);
