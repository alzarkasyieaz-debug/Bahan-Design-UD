// Mengimbas public/audio/vo/ untuk fail suara latar babak-01 … babak-12
// dan menjana src/data/vo-manifest.json. Pilihan: public/audio/vo/timing.json
// (format: { "1": [[mula, tamat], ...], ... } dalam saat relatif babak) untuk
// menyelaraskan subtitle dengan rakaman sebenar.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const voDir = path.join(root, 'public/audio/vo');
const files = {};
for (let i = 1; i <= 12; i++) {
  const base = `babak-${String(i).padStart(2, '0')}`;
  for (const ext of ['wav', 'mp3', 'm4a', 'aac']) {
    if (fs.existsSync(path.join(voDir, `${base}.${ext}`))) {
      files[String(i)] = `audio/vo/${base}.${ext}`;
      break;
    }
  }
}
let timing = {};
const tPath = path.join(voDir, 'timing.json');
if (fs.existsSync(tPath)) timing = JSON.parse(fs.readFileSync(tPath, 'utf8'));
fs.writeFileSync(path.join(root, 'src/data/vo-manifest.json'), JSON.stringify({ files, timing }, null, 2) + '\n');
console.log(`VO ditemui untuk ${Object.keys(files).length}/12 babak` + (Object.keys(timing).length ? ' (+ timing.json)' : ''));
