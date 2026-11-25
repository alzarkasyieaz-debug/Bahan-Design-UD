// MUZIK: setiap bunyi datang daripada peristiwa dalam score.js.   node song.js   (STEMS=1 untuk stem)
// Orkestra dokumentari dalam D minor (Dm Bb F C), 90 BPM. Kotak muzik di pembukaan, timpani pada
// tajuk, marimba pada setiap angka, brass pada setiap isu, loceng pada kotak sorotan, akord F penutup.
const path = require('path');
const { SR, Bus, reverb } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const Genre = require('./engine/audio/genres');
const sc = require('./score');
const { T, BEAT, DURATION, m, ev, clock, chordAt } = sc;
const { placeBar, mtof } = require('./engine/music');

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const buses = { drums: bus(), bass: bus(), pad: bus(), keys: bus() };
const lead = bus(), fx = bus(), verb = bus(), kit = bus();

// cangkuk (hook) 8 not dalam D minor, dipakai semula dengan pelbagai "kostum"
const HOOK = [['A4', 0, 2], ['D5', 2, 2], ['F5', 4, 2], ['E5', 6, 1], ['D5', 7, 1]];
const HOOK2 = [['C5', 0, 2], ['D5', 2, 1], ['F5', 3, 1], ['A5', 4, 3], ['G5', 7, 1]];
const hookAt = (bar, which, fn) => placeBar(clock, which.map(([n, s, l]) => [n, s, l]), bar).forEach(fn);

// ---- 1. pembukaan: pad gelap + kotak muzik; tajuk di bar 1 dengan timpani ----
Genre.play('orchestral', { clock, from: 0, to: 3, chordAt, buses, drums: false, bassline: false, gain: 0.7 });
[0, 2].forEach((b, i) => hookAt(b, i ? HOOK2 : HOOK, (n) => { const x = I.musicBox(n.midi + 12); lead.addMono(x, n.t, 0.16, 0.15); verb.addMono(x, n.t, 0.22); }));
fx.addMono(I.timpani(m('D2'), { decay: 1.6 }), ev.title, 0.9);
fx.addMono(I.subBoom(1.4, 70, 32), ev.title, 0.55);
fx.addMono(I.thud(90, 0.1), ev.title, 0.5);
// ---- 2. potret: rentetan tali (strings) naik; desiran berakhir sebelum potongan ----
fx.addMono(I.noiseSweep(BEAT * 3, 400, 5000, { pink: true }), ev.potret - BEAT * 3.5, 0.12);
Genre.play('orchestral', { clock, from: 3, to: 8, chordAt, buses, gain: 0.85 });
// ---- 3. dewan: brass membawa cangkuk ----
const brass = Genre.lead('orchestral');
[5, 6, 7].forEach((b, i) => hookAt(b, i === 1 ? HOOK2 : HOOK, (n) => { const x = brass(n.midi - 12, n.dur * 0.95); if (x.L) lead.addStereo(x.L, x.R, n.t, 0.2); else lead.addMono(x, n.t, 0.24); }));
fx.addMono(I.paperFwip(0.8, 2), ev.dewan2 - 0.05, 0.12);
// ---- 4. angka: tenaga naik, marimba + timpani pada setiap angka yang mendarat ----
const { kicks: k1 } = Genre.play('orchestral', { clock, from: 8, to: 14, chordAt, buses, gain: 1 });
fx.addMono(I.timpani(m('D2'), { decay: 1.0 }), ev.angka, 0.8);
sc.STATS.forEach((s, i) => { const x = I.marimba(m(['D5', 'F5', 'A5'][i]), { thock: 0.6 }); lead.addMono(x, s.t + 0.9, 0.5, [-0.3, 0, 0.3][i]); verb.addMono(x, s.t + 0.9, 0.2); fx.addMono(I.thud(110, 0.08), s.t + 0.9, 0.35); });
// ---- 5. tahun: satu nada pizzicato menaik bagi setiap lajur ----
sc.YEARS.forEach((y, i) => { const x = I.pizz(m(['D4', 'F4', 'A4', 'D5'][i])); lead.addMono(x, y.t, 0.95, (i - 1.5) * 0.2); verb.addMono(x, y.t, 0.15); });
// ---- 6. Kamar Khas: "pop" pada setiap titik garis masa ----
sc.KAMAR.forEach((k, i) => fx.addMono(I.pop(1500 + i * 180), k.t, 0.5, (i - 2) * 0.2));
// ---- 7. enam isu: dram lembut + brass stab + timpani pada setiap isu ----
const { kicks: k2 } = Genre.play('orchestral', { clock, from: 14, to: 20, chordAt, buses, gain: 1.05 });
for (let b = 14; b < 20; b++) for (let q = 0; q < 4; q++) {
  if (q % 2 === 0) kit.addMono(I.kick({ punch: 0.8, tail: 0.5, seed: b * 4 + q }), T(b, q), 0.55);
  else kit.addMono(I.clap({ decay: 0.18 }), T(b, q), 0.22, 0.1);
  kit.addMono(I.hat(false, b * 8 + q), T(b, q + 0.5), 0.1, -0.2);
}
sc.ISU.forEach((s, i) => {
  const c = chordAt(s.t);
  c.notes.forEach((n) => { const x = I.brassNote(n + 12, BEAT * 0.9, { stab: true, bright: 1.1, seed: i }); lead.addStereo(x.L, x.R, s.t, 0.09); });
  fx.addMono(I.timpani(c.bass + 12, { decay: 0.7 }), s.t, 0.6);
  fx.addMono(I.crash(i + 3), s.t, i === 0 || i === 3 ? 0.22 : 0.1);
});
// ---- 8. sorotan: tenang, e-piano + loceng pada setiap kotak ----
Genre.play('orchestral', { clock, from: 20, to: 23, chordAt, buses, drums: false, gain: 0.8 });
fx.addMono(I.timpani(m('D2'), { decay: 1.4 }), ev.sorotan, 0.75);
fx.addMono(I.subBoom(1.0, 60, 30), ev.sorotan, 0.35);
for (let b = 20; b < 23; b++) chordAt(T(b)).notes.forEach((n, j) => keysEp(n + 12, T(b, j * 0.5)));
function keysEp(midi, t) { const x = I.epiano(midi, BEAT * 2, { decay: 1.2 }); buses.keys.addMono(x, t, 0.12, 0.1); verb.addMono(x, t, 0.08); }
sc.FLOW.forEach((f, i) => { const x = I.bell(mtof(m(['A5', 'C6', 'D6'][i])), 1.4, 2, 3.5); lead.addMono(x, f.t, 0.16, (i - 1) * 0.3); verb.addMono(x, f.t, 0.2); });
// ---- 9. penutup: brass penuh + tali, timpani + subBoom; akord F ditahan ----
Genre.play('orchestral', { clock, from: 23, to: 25, chordAt, buses, gain: 1 });
fx.addMono(I.timpani(m('Bb1'), { decay: 1.8 }), ev.akhir, 0.95);
fx.addMono(I.crash(9), ev.akhir, 0.3);
fx.addMono(I.subBoom(1.6, 70, 30), ev.akhir, 0.5);
hookAt(23, HOOK, (n) => { const x = brass(n.midi - 12, n.dur * 0.95); if (x.L) lead.addStereo(x.L, x.R, n.t, 0.13); else lead.addMono(x, n.t, 0.15); });
for (const n of ['F3', 'A3', 'C4', 'F4']) { const x = I.strings(m(n), BEAT * 6, { attack: 0.3, release: 1.6, bright: 0.9 }); lead.addStereo(x.L, x.R, T(24), 0.08); }
hookAt(24, [['F5', 0, 2], ['A5', 2, 2], ['C6', 4, 4]], (n) => { const x = I.musicBox(n.midi); lead.addMono(x, n.t, 0.15); verb.addMono(x, n.t, 0.25); });

MIX.sidechain([buses.pad, buses.keys], [...k1, ...k2], { depth: 0.25 });
const room = reverb(verb, { room: 0.82, damp: 0.45 });
const hall = reverb(lead, { room: 0.7, damp: 0.5 });
const stems = { ...buses, kit, lead, fx, verb: room, hall };
const GAIN = { drums: 0.85, bass: 0.85, pad: 1, keys: 1, kit: 0.6, lead: 1, fx: 1, verb: 0.45, hall: 0.18 };
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? path.join(__dirname, 'out') : null });
MIX.highpass(mix, 28);
MIX.fadeOut(mix, DURATION - 1.6, DURATION);
const res = MIX.master(mix, 0.8, undefined, { lufs: process.env.LUFS ? +process.env.LUFS : -14 });
MIX.writeWav(path.join(__dirname, 'out', 'music.wav'), mix);
console.log(`out/music.wav  ${DURATION.toFixed(1)}s  ${res.lufs.toFixed(1)} LUFS`);
