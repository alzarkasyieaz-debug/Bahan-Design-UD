import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setConcurrency(Number(process.env.REMOTION_CONCURRENCY) || null);
// Gunakan Chrome/Chromium sedia ada jika ditetapkan (cth. dalam persekitaran tanpa internet)
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
