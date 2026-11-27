import React from 'react';
import { Composition, continueRender, delayRender, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { Showcase, KineticFinal, CoverV4, CoverV4B, CoverV4C, CoverV4D } from './Showcase';
import { NakSeeHeartVideo } from './Video';
import { Cover } from './Cover';
import { CoverPoster } from './CoverPoster';
import { CoverImpak, CoverPanel, CoverInfo } from './CoverStyles';
import { FPS, TOTAL_FRAMES, W, H, SB } from './lib';

// Fon tempatan (SIL Open Font License) — tiada muat turun semasa render
const handle = delayRender('Memuatkan fon');
Promise.all([
  loadFont({ family: 'Great Vibes', url: staticFile('fonts/GreatVibes-Regular.ttf'), weight: '400' }),
  loadFont({ family: 'Bebas Neue', url: staticFile('fonts/BebasNeue.woff2'), weight: '400' }),
  loadFont({ family: 'Cinzel', url: staticFile('fonts/cinzel-latin-800-normal.woff2'), weight: '800' }),
  loadFont({ family: 'Montserrat', url: staticFile('fonts/montserrat-latin-500-normal.woff2'), weight: '500' }),
  loadFont({ family: 'Montserrat', url: staticFile('fonts/montserrat-latin-600-normal.woff2'), weight: '600' }),
  loadFont({ family: 'Montserrat', url: staticFile('fonts/montserrat-latin-800-normal.woff2'), weight: '800' }),
  loadFont({ family: 'Montserrat', url: staticFile('fonts/montserrat-latin-900-normal.woff2'), weight: '900' }),
  loadFont({ family: 'Playfair Display', url: staticFile('fonts/PlayfairDisplay-Italic.woff2'), weight: '400', style: 'italic' }),
]).then(() => continueRender(handle));

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id={SB.meta.compositionId} component={NakSeeHeartVideo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
    {/* Cover/thumbnail: bash scripts/cover.sh */}
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={FPS} width={W} height={H} />
    {/* Cover gaya poster: bash scripts/cover.sh poster */}
    <Composition id="CoverPoster" component={CoverPoster} durationInFrames={1} fps={FPS} width={W} height={H} />
    {/* Cover v3 (3 gaya alternatif): bash scripts/cover.sh impak|panel|info */}
    <Composition id="CoverImpak" component={CoverImpak} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="CoverPanel" component={CoverPanel} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="CoverInfo" component={CoverInfo} durationInFrames={1} fps={FPS} width={W} height={H} />
    {/* Nasihat V4 */}
    <Composition id="CoverV4" component={CoverV4} durationInFrames={150} fps={FPS} width={W} height={H} />
    <Composition id="CoverV4B" component={CoverV4B} durationInFrames={150} fps={FPS} width={W} height={H} />
    <Composition id="CoverV4C" component={CoverV4C} durationInFrames={150} fps={FPS} width={W} height={H} />
    <Composition id="CoverV4D" component={CoverV4D} durationInFrames={150} fps={FPS} width={W} height={H} />
    <Composition id="Showcase" component={Showcase} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="KineticFinal" component={KineticFinal} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1080} />
  </>
);
