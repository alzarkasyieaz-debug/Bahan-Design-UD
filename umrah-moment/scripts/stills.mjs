// Render bingkai pratonton: node scripts/stills.mjs 150 900 ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const browserExecutable = process.env.REMOTION_BROWSER || null;
const composition = await selectComposition({ serveUrl, id: 'UmrahMoment', browserExecutable });
for (const frame of frames) {
  const output = `out/stills/f${String(frame).padStart(4, '0')}.jpg`;
  await renderStill({ composition, serveUrl, frame, output, imageFormat: 'jpeg', jpegQuality: 80, browserExecutable, scale: 0.5 });
  console.log(output);
}
