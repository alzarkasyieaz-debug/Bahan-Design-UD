// FILEM (VERSI TIKTOK 9:16): babak yang sama, disusun semula untuk skrin menegak. Teks kekal dalam
// kawasan selamat (x 60–940, y 221–1498) supaya tidak dilindungi butang dan kapsyen TikTok.
// Asal: video info gaya dokumentari dalam 9 babak. Setiap visual ialah fungsi tulen masa t yang
// membaca score.js, jadi angka, isu dan kotak sorotan mendarat tepat pada bunyinya.
(function () {
  const U = globalThis.U, G = globalThis.G, S = globalThis.SCORE, Studio = globalThis.Studio;
  const { clamp, ease } = U;
  const { T, BEAT, ev } = S;
  const W = G.W, H = G.H;
  const NAVY = '#061226', CY = '#46d9e6', GOLD = '#d9b45a', VIO = '#c9b7ff', INK = '#eef4f6', MUTE = '#a9bdc7';
  const IMG = {};
  const sectionOf = (t) => Object.entries(S.S).find(([, [a, b]]) => t >= a && t < b)?.[0] || 'akhir';
  const prog = (t, t0, d) => clamp((t - t0) / d);
  const eo = (t, t0, d) => ease.outCubic(prog(t, t0, d));

  // ---------- alat lukis ----------
  function txt(ctx, s, x, y, { size = 40, weight = 700, color = INK, align = 'left', alpha = 1, maxW } = {}) {
    if (alpha <= 0) return;
    ctx.save(); ctx.globalAlpha *= alpha;
    let sz = size; ctx.font = `${weight} ${sz}px Inter`;
    if (maxW) while (ctx.measureText(s).width > maxW && sz > 14) { sz -= 1; ctx.font = `${weight} ${sz}px Inter`; }
    ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(s, x, y); ctx.restore();
  }
  function wrap(ctx, s, x, y, maxW, lh, o = {}) {
    ctx.font = `${o.weight || 500} ${o.size || 30}px Inter`;
    const words = s.split(' '); let line = '', yy = y;
    for (const w of words) { const tr = line ? line + ' ' + w : w; if (ctx.measureText(tr).width > maxW && line) { txt(ctx, line, x, yy, o); line = w; yy += lh; } else line = tr; }
    if (line) txt(ctx, line, x, yy, o);
    return yy;
  }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function glass(ctx, x, y, w, h, { r = 20, border = 'rgba(70,217,230,.28)', alpha = 1, fill = 'rgba(12,32,58,.72)' } = {}) {
    if (alpha <= 0) return;
    ctx.save(); ctx.globalAlpha *= alpha;
    rr(ctx, x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
    const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, 'rgba(255,255,255,.07)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = border; ctx.stroke(); ctx.restore();
  }
  // muncul: naik 30px dan pudar masuk dalam 0.6 s
  function rise(ctx, t, t0, fn, { d = 0.6, dy = 30, dx = 0 } = {}) {
    const u = eo(t, t0, d); if (u <= 0) return;
    ctx.save(); ctx.globalAlpha *= u; ctx.translate(dx * (1 - u), dy * (1 - u)); fn(u); ctx.restore();
  }
  function star(ctx, cx, cy, r, { rot = 0, u = 1, color = GOLD, alpha = 0.35, lw = 2 } = {}) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.globalAlpha *= alpha; ctx.strokeStyle = color; ctx.lineWidth = lw;
    const per = 8 * r; ctx.setLineDash([per, per]); ctx.lineDashOffset = per * (1 - u);
    for (const a of [0, Math.PI / 4]) { ctx.save(); ctx.rotate(a); ctx.strokeRect(-r, -r, 2 * r, 2 * r); ctx.restore(); }
    ctx.restore();
  }
  function bgScene(ctx, t, { tint = 1 } = {}) {
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#040c1c'); g.addColorStop(0.5, NAVY); g.addColorStop(1, '#062a2f'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const r = ctx.createRadialGradient(W * 0.85, H * 1.05, 0, W * 0.85, H * 1.05, W * 0.7); r.addColorStop(0, `rgba(5,71,58,${0.75 * tint})`); r.addColorStop(1, 'rgba(5,71,58,0)'); ctx.fillStyle = r; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.strokeStyle = 'rgba(70,217,230,.05)'; ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    // garisan digital bergerak perlahan
    ctx.setLineDash([8, 22]); ctx.lineDashOffset = -t * 18;
    [[260, CY, 0.22], [640, CY, 0.18], [930, GOLD, 0.14]].forEach(([y, c, a], i) => {
      ctx.strokeStyle = c; ctx.globalAlpha = a; ctx.beginPath(); ctx.moveTo(-20, y);
      ctx.bezierCurveTo(W * 0.3, y - 50 + i * 20, W * 0.6, y + 60, W + 20, y - 20); ctx.stroke();
    });
    ctx.restore();
  }
  function flash(ctx, t, times) {
    const c = times.filter((x) => t >= x).pop(); if (c === undefined || t - c > 0.25) return;
    ctx.save(); ctx.fillStyle = `rgba(190,245,250,${0.32 * (1 - (t - c) / 0.25)})`; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  function kicker(ctx, s, x, y, t, t0, color = GOLD) { rise(ctx, t, t0, () => txt(ctx, s, x, y, { size: 26, weight: 700, color })); }
  const ICON = {
    school: 'M3 21h18M5 21V10l7-5 7 5v11M9 21v-5h6v5M12 5V2l3 1-3 1',
    health: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8v8M8 12h8',
    card: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM11 11a2 2 0 1 1-4 0a2 2 0 1 1 4 0M6.5 16c.6-1.4 1.5-2 2.5-2s1.9.6 2.5 2M14 10h4M14 13h4',
    signal: 'M12 21v-9M8.5 8.5a5 5 0 0 1 7 0M5.6 5.6a9 9 0 0 1 12.8 0M13.2 11a1.2 1.2 0 1 1-2.4 0a1.2 1.2 0 1 1 2.4 0',
    padi: 'M12 17V8M12 8c-3 0-5-2-5-5 3 0 5 2 5 5zM12 12c3 0 5-2 5-5-3 0-5 2-5 5zM3 20c2 0 2-1.5 4.5-1.5S10 20 12 20s2-1.5 4.5-1.5S19 20 21 20',
    industry: 'M3 21V11l5 3v-3l5 3V7h3l1 4h4v10zM3 21h18M7 18h2M12 18h2M17 18h2',
  };
  const P2 = {}; for (const k in ICON) P2[k] = new Path2D(ICON[k]);
  function icon(ctx, k, cx, cy, size, color = CY) { ctx.save(); ctx.translate(cx - size / 2, cy - size / 2); ctx.scale(size / 24, size / 24); ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(P2[k]); ctx.restore(); }
  function photo(ctx, img, x, y, w, h, t, t0, t1, o = {}) { if (img) G.kenBurns(ctx, img, x, y, w, h, t, t0, t1, o); }
  function portrait(ctx, x, yBottom, h) { const im = IMG.ismi; if (!im) return; const w = h * im.width / im.height; ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; ctx.drawImage(im, x - w / 2, yBottom - h, w, h); ctx.restore(); }
  function glow(ctx, cx, cy, r, a = 0.25) { const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, `rgba(70,217,230,${a})`); g.addColorStop(0.6, 'rgba(4,57,47,.12)'); g.addColorStop(1, 'rgba(4,57,47,0)'); ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r); }

  const L = 70, R = 930, CW = R - L; // lajur teks dalam kawasan selamat
  // ---------- 1. pembukaan ----------
  function intro(ctx, t) {
    bgScene(ctx, t, { tint: eo(t, 0, 2) });
    star(ctx, 500, 800, 300, { u: eo(t, 0.1, ev.title - 0.2), rot: t * 0.03, alpha: 0.4, lw: 2.5 });
    if (t >= ev.title) {
      const k = 1 + 0.06 * (1 - eo(t, ev.title, 0.5));
      ctx.save(); ctx.translate(500, 760); ctx.scale(k, k);
      const sx = -600 + 1200 * eo(t, ev.title + 0.15, 1.1);
      const g = ctx.createLinearGradient(-600, 0, 600, 0); const p0 = clamp((sx + 600) / 1200);
      g.addColorStop(0, INK); g.addColorStop(clamp(p0 - 0.1), INK); g.addColorStop(p0, '#9ff3fa'); g.addColorStop(clamp(p0 + 0.1), INK); g.addColorStop(1, INK);
      txt(ctx, 'Suara Parit', 0, -10, { size: 132, weight: 800, align: 'center', color: g });
      txt(ctx, 'di Dewan Rakyat', 0, 100, { size: 92, weight: 800, align: 'center', color: g });
      ctx.restore();
    }
    rise(ctx, t, T(1, 2), () => { txt(ctx, 'Isu dibangkitkan,', 500, 1010, { size: 44, weight: 600, color: CY, align: 'center' }); txt(ctx, 'kepentingan rakyat diperjuangkan', 500, 1066, { size: 44, weight: 600, color: CY, align: 'center' }); });
    rise(ctx, t, T(2), () => { txt(ctx, 'Rekod ucapan YB Ustaz Ismi', 500, 1170, { size: 32, weight: 500, color: MUTE, align: 'center' }); txt(ctx, 'Ahli Parlimen Parit · 2023 hingga 2026', 500, 1214, { size: 32, weight: 500, color: MUTE, align: 'center' }); });
  }
  // ---------- 2. potret ----------
  function potret(ctx, t) {
    bgScene(ctx, t);
    const u = eo(t, ev.potret, 0.8);
    glow(ctx, 540, 1500, 620);
    star(ctx, 540, 1300, 380, { rot: t * 0.04, alpha: 0.3 });
    ctx.save(); ctx.globalAlpha = u; portrait(ctx, 540, H + 10 + 120 * (1 - u), 1120); ctx.restore();
    kicker(ctx, 'Ahli Parlimen Parit, Perak', L, 300, t, T(3, 0.5));
    rise(ctx, t, T(3, 1), () => txt(ctx, 'YB Ustaz Ismi', L, 400, { size: 100, weight: 800 }));
    rise(ctx, t, T(3, 2), () => wrap(ctx, 'Tuan Haji Muhammad Ismi bin Mat Taib', L, 470, CW, 46, { size: 38, weight: 500, color: '#d5e1e7' }));
    rise(ctx, t, T(3, 3), () => { ctx.fillStyle = GOLD; ctx.fillRect(L, 520, 420 * eo(t, T(3, 3), 0.7), 4); });
    rise(ctx, t, T(4), () => wrap(ctx, 'Membawa isu Parit ke Dewan Rakyat dan Kamar Khas: pendidikan, kesihatan, perkhidmatan awam, internet desa, pertanian dan pelaburan.', L, 590, CW, 44, { size: 31, weight: 500, color: '#cfdde4' }));
  }
  // ---------- 3. dewan ----------
  function dewan(ctx, t) {
    const two = t >= ev.dewan2, fade = eo(t, ev.dewan2, 0.8);
    photo(ctx, IMG.r3, 0, 0, W, H, t, ev.dewan, S.S.dewan[1], { from: { zoom: 1.1, x: 0.46, y: 0.4 }, to: { zoom: 1.0, x: 0.45, y: 0.42 } });
    if (two) { ctx.save(); ctx.globalAlpha = fade; photo(ctx, IMG.dw, 0, 0, W, H, t, ev.dewan2, S.S.dewan[1] + 1, { from: { zoom: 1.0, x: 0.5, y: 0.45 }, to: { zoom: 1.08, x: 0.52, y: 0.42 } }); ctx.restore(); }
    const g = ctx.createLinearGradient(0, H * 0.45, 0, H * 0.82); g.addColorStop(0, 'rgba(2,8,20,0)'); g.addColorStop(1, 'rgba(2,8,20,.94)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(2,8,20,.94)'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
    kicker(ctx, 'Di Dewan Rakyat', L, 1200, t, ev.dewan + 0.3);
    rise(ctx, t, ev.dewan + 0.6, () => { txt(ctx, 'Membawa suara', L, 1290, { size: 80, weight: 800 }); txt(ctx, 'Parit ke dewan', L, 1380, { size: 80, weight: 800 }); });
    const cap = two ? 'Di dalam Dewan Rakyat (tarikh tidak dinyatakan)' : 'Berucap di Dewan Rakyat · rakaman RTMKlik (tarikh tidak dinyatakan)';
    ctx.save(); ctx.globalAlpha = two ? fade : eo(t, ev.dewan + 1, 0.6); wrap(ctx, cap, L, 1450, CW, 36, { size: 28, weight: 500, color: GOLD }); ctx.restore();
  }
  // ---------- 4. angka ----------
  function angka(ctx, t) {
    bgScene(ctx, t);
    kicker(ctx, 'Angka utama', L, 300, t, ev.angka);
    rise(ctx, t, ev.angka + 0.15, () => { txt(ctx, 'Hampir empat tahun', L, 380, { size: 64, weight: 800 }); txt(ctx, 'rekod ucapan', L, 452, { size: 64, weight: 800 }); });
    S.STATS.forEach((s, i) => {
      const x = L - 10, y = 510 + i * 320, w = CW + 20, h = 296;
      rise(ctx, t, s.t - 0.2, () => {
        glass(ctx, x, y, w, h);
        const land = s.t + 0.9, v = Math.round(s.n * ease.outCubic(prog(t, s.t, 0.9)));
        const pop = t >= land ? 1 + 0.12 * Math.exp(-(t - land) * 10) : 1;
        ctx.save(); ctx.translate(x + 30, y + 170); ctx.scale(pop, pop); txt(ctx, String(v), 0, 0, { size: 150, weight: 800, color: s.col }); ctx.restore();
        const tx = x + 250;
        txt(ctx, s.a, tx, y + 80, { size: 34, weight: 700, maxW: w - 280 });
        wrap(ctx, s.b, tx, y + 122, w - 280, 32, { size: 25, weight: 500, color: MUTE });
        if (i === 0) for (let j = 0; j < 33; j++) { const a = prog(t, s.t + j * 0.025, 0.2); if (a > 0) { ctx.globalAlpha = a; ctx.fillStyle = CY; ctx.fillRect(tx + (j % 17) * 34, y + 190 + Math.floor(j / 17) * 44, 22, 34 * (0.4 + 0.6 * a)); ctx.globalAlpha = 1; } }
        if (i === 1) for (let j = 0; j < 9; j++) { const a = prog(t, s.t + j * 0.08, 0.2); if (a <= 0) continue; ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(tx + 18 + j * 60, y + 225, 18 * a, 0, Math.PI * 2); if (j < 8) { ctx.fillStyle = GOLD; ctx.fill(); } else { ctx.setLineDash([5, 5]); ctx.strokeStyle = MUTE; ctx.lineWidth = 3; ctx.stroke(); } ctx.restore(); }
        if (i === 2) ['2023', '2024', '2025', '2026'].forEach((yr, j) => rise(ctx, t, s.t + j * 0.15, () => { rr(ctx, tx + j * 140, y + 196, 126, 58, 10); ctx.fillStyle = 'rgba(70,217,230,.14)'; ctx.fill(); ctx.strokeStyle = 'rgba(70,217,230,.5)'; ctx.stroke(); txt(ctx, yr, tx + 63 + j * 140, y + 236, { size: 28, weight: 700, color: CY, align: 'center' }); }, { dy: 14 }));
      });
    });
    rise(ctx, t, T(9, 3), () => wrap(ctx, 'Senarai video dan senarai Kamar Khas ialah rekod berasingan dan tidak dijumlahkan.', L, 1480, CW, 30, { size: 23, weight: 500, color: MUTE }));
  }
  // ---------- 5. tahun ----------
  function tahun(ctx, t) {
    bgScene(ctx, t);
    kicker(ctx, 'Ucapan mengikut tahun', L, 300, t, ev.tahun);
    rise(ctx, t, ev.tahun + 0.15, () => { txt(ctx, '2024 paling aktif dalam', L, 375, { size: 52, weight: 800 }); txt(ctx, 'rakaman video; 2025 lebih', L, 437, { size: 52, weight: 800 }); txt(ctx, 'banyak di Kamar Khas', L, 499, { size: 52, weight: 800 }); });
    rise(ctx, t, ev.tahun + 0.3, () => {
      ctx.fillStyle = CY; rr(ctx, L, 560, 28, 28, 6); ctx.fill(); txt(ctx, 'Rakaman dalam senarai video', L + 44, 584, { size: 28, weight: 500 });
      ctx.fillStyle = GOLD; rr(ctx, L, 610, 28, 28, 6); ctx.fill(); txt(ctx, 'Ucapan Kamar Khas bertarikh', L + 44, 634, { size: 28, weight: 500 });
    });
    const x0 = L, base = 1380, ch = 620, colW = CW / 4, MX = 12;
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, base); ctx.lineTo(R, base); ctx.stroke();
    S.YEARS.forEach((y, i) => {
      const cx = x0 + i * colW + colW / 2;
      [[y.v, CY, -42], [y.k, GOLD, 42]].forEach(([v, c, dx], j) => {
        const u = ease.outBack(prog(t, y.t + j * 0.12, 0.7), 1.2);
        const h = v ? ch * (v / MX) * u : 4;
        const g = ctx.createLinearGradient(0, base - h, 0, base); g.addColorStop(0, c); g.addColorStop(1, j ? '#6a4c14' : '#0a5a4a');
        ctx.fillStyle = v ? g : 'rgba(255,255,255,.25)'; rr(ctx, cx + dx - 36, base - Math.max(h, 4), 72, Math.max(h, 4), 10); ctx.fill();
        if (prog(t, y.t + j * 0.12, 0.3) > 0) txt(ctx, String(Math.round(v * clamp(u))), cx + dx, base - Math.max(h, 4) - 16, { size: 40, weight: 800, align: 'center', alpha: prog(t, y.t + j * 0.12 + 0.2, 0.3) });
      });
      txt(ctx, y.y, cx, base + 64, { size: 40, weight: 800, align: 'center', alpha: eo(t, ev.tahun + 0.3, 0.6) });
    });
  }
  // ---------- 6. Kamar Khas ----------
  function kamar(ctx, t) {
    bgScene(ctx, t);
    kicker(ctx, 'Kamar Khas · Parlimen Ke-15', L, 300, t, ev.kamar);
    rise(ctx, t, ev.kamar + 0.15, () => { txt(ctx, '9 tajuk dibawa', L, 380, { size: 64, weight: 800 }); txt(ctx, 'ke Kamar Khas', L, 452, { size: 64, weight: 800 }); });
    const lx = L + 20, y0 = 540, step = 182;
    const u = eo(t, ev.kamar + 0.3, 2.4);
    ctx.save(); ctx.strokeStyle = CY; ctx.globalAlpha = 0.7; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lx, y0 - 20); ctx.lineTo(lx, y0 - 20 + (step * 4 + 60) * u); ctx.stroke(); ctx.restore();
    S.KAMAR.forEach((k, i) => {
      const y = y0 + i * step, a = prog(t, k.t, 0.35), unk = i === 4;
      if (a <= 0) return;
      ctx.save(); ctx.translate(lx, y); ctx.scale(ease.outBack(a, 2), ease.outBack(a, 2)); ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fillStyle = NAVY; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = unk ? MUTE : GOLD; if (unk) ctx.setLineDash([6, 5]); ctx.stroke(); ctx.restore();
      rise(ctx, t, k.t + 0.1, () => {
        txt(ctx, k.d, lx + 44, y + 12, { size: unk ? 28 : 34, weight: 800, color: unk ? MUTE : INK });
        k.items.forEach((it, j) => rise(ctx, t, k.t + 0.25 + j * 0.15, () => { ctx.fillStyle = j ? GOLD : CY; ctx.fillRect(lx + 44, y + 40 + j * 46, 6, 30); txt(ctx, it, lx + 64, y + 66 + j * 46, { size: 29, weight: 600, maxW: R - lx - 64 }); }, { dx: -20, dy: 0 }));
      }, { dx: -20, dy: 0 });
    });
    rise(ctx, t, T(13, 3), () => wrap(ctx, '8 kementerian dan portfolio: KDN, KKM, KPKM (2), MITI, MOT, PETRA, Komunikasi, Hal Ehwal Agama', L, 1440, CW, 30, { size: 23, weight: 500, color: MUTE }));
  }
  // ---------- 7. enam isu ----------
  function isu(ctx, t) {
    const i = S.ISU.filter((s) => t >= s.t).length - 1, s = S.ISU[Math.max(0, i)];
    bgScene(ctx, t);
    S.ISU.forEach((q, j) => { ctx.fillStyle = j < i ? 'rgba(70,217,230,.6)' : j === i ? GOLD : 'rgba(255,255,255,.15)'; rr(ctx, L + j * 70, 262, 56, 8, 4); ctx.fill(); });
    txt(ctx, `Isu ${i + 1} daripada 6`, L + 6 * 70 + 16, 274, { size: 26, weight: 600, color: MUTE });
    const cx = 500, cy = 560, u = eo(t, s.t, 0.6);
    glow(ctx, cx, cy, 360, 0.22);
    ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 200, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * u); ctx.stroke(); ctx.restore();
    star(ctx, cx, cy, 160, { rot: t * 0.05, alpha: 0.18 });
    const ring = 1 - prog(t, s.t, 1.2);
    if (ring > 0) { ctx.save(); ctx.globalAlpha = ring * 0.5; ctx.strokeStyle = CY; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, 120 + 100 * (1 - ring), 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.globalAlpha = u; ctx.translate(cx, cy); ctx.scale(0.8 + 0.2 * u, 0.8 + 0.2 * u); ctx.beginPath(); ctx.arc(0, 0, 120, 0, Math.PI * 2); ctx.fillStyle = 'rgba(70,217,230,.1)'; ctx.fill(); ctx.strokeStyle = 'rgba(70,217,230,.45)'; ctx.lineWidth = 2; ctx.stroke(); icon(ctx, s.ic, 0, 0, 130); ctx.restore();
    rise(ctx, t, s.t, () => txt(ctx, s.cat, L, 840, { size: 32, weight: 700, color: GOLD }), { dx: -30, dy: 0, d: 0.5 });
    rise(ctx, t, s.t + 0.1, () => wrap(ctx, s.title, L, 920, CW, 68, { size: 60, weight: 800 }), { dx: -30, dy: 0, d: 0.5 });
    const land = s.t + 0.6, v = Math.round(s.n * ease.outCubic(prog(t, s.t + 0.1, 0.5)));
    const pop = t >= land ? 1 + 0.1 * Math.exp(-(t - land) * 10) : 1;
    rise(ctx, t, s.t + 0.15, () => { ctx.save(); ctx.translate(L, 1170); ctx.scale(pop, pop); txt(ctx, String(v), 0, 0, { size: 150, weight: 800, color: GOLD }); ctx.restore(); ctx.font = '800 150px Inter'; const wN = ctx.measureText(String(s.n)).width; wrap(ctx, s.nl, L + wN + 26, 1110, CW - wN - 26, 38, { size: 32, weight: 500, color: MUTE }); });
    rise(ctx, t, s.t + 0.3, () => wrap(ctx, s.p, L, 1260, CW, 44, { size: 33, weight: 500, color: '#d5e1e7' }));
    rise(ctx, t, s.t + 0.45, () => wrap(ctx, s.meta.replace(/\s+\|\s+/g, ' · '), L, 1420, CW, 32, { size: 25, weight: 600, color: CY }));
  }
  // ---------- 8. sorotan ----------
  function sorotan(ctx, t) {
    bgScene(ctx, t);
    kicker(ctx, 'Sorotan utama', L, 290, t, ev.sorotan);
    rise(ctx, t, ev.sorotan + 0.15, () => { txt(ctx, 'Isu sekolah Seri Iskandar', L, 362, { size: 54, weight: 800, maxW: CW }); txt(ctx, 'dibawa dua kali', L, 426, { size: 54, weight: 800 }); });
    photo(ctx, IMG.r3, L, 470, CW, 290, t, ev.sorotan, S.S.sorotan[1], { radius: 18, from: { zoom: 1.15, x: 0.46, y: 0.35 }, to: { zoom: 1.02, x: 0.46, y: 0.35 } });
    ctx.save(); ctx.strokeStyle = 'rgba(217,180,90,.55)'; ctx.lineWidth = 2; rr(ctx, L, 470, CW, 290, 18); ctx.stroke(); ctx.restore();
    txt(ctx, 'Berucap di Dewan Rakyat (tarikh gambar tidak dinyatakan)', L, 790, { size: 20, weight: 500, color: MUTE });
    const ly = 880, lx0 = L, lx1 = R, u = eo(t, T(20, 3), 1.2);
    rise(ctx, t, T(20, 3), () => { txt(ctx, '28 Mac 2023', L, ly - 24, { size: 30, weight: 800 }); txt(ctx, 'Dewan Rakyat', L, ly + 40, { size: 22, weight: 500, color: MUTE }); });
    const g = ctx.createLinearGradient(lx0, 0, lx1, 0); g.addColorStop(0, CY); g.addColorStop(1, GOLD);
    ctx.fillStyle = g; ctx.fillRect(lx0, ly - 2, (lx1 - lx0) * u, 4);
    txt(ctx, 'selang kira-kira 18 bulan', (lx0 + lx1) / 2, ly + 40, { size: 24, weight: 700, color: GOLD, align: 'center', alpha: prog(t, T(20, 3) + 0.8, 0.4) });
    txt(ctx, '16 Okt 2024', R, ly - 24, { size: 30, weight: 800, align: 'right', alpha: prog(t, T(20, 3) + 1.1, 0.3) });
    txt(ctx, 'Kamar Khas', R, ly + 40, { size: 22, weight: 500, color: MUTE, align: 'right', alpha: prog(t, T(20, 3) + 1.1, 0.3) });
    S.FLOW.forEach((f, i) => {
      const x = L - 10, y = 970 + i * 172, w = CW + 20, h = 156;
      rise(ctx, t, f.t, () => {
        glass(ctx, x, y, w, h, { border: f.col });
        ctx.fillStyle = f.col; ctx.fillRect(x, y + 18, 6, h - 36);
        txt(ctx, f.k, x + 30, y + 46, { size: 27, weight: 700, color: f.col });
        wrap(ctx, f.v, x + 30, y + 90, w - 60, 36, { size: 28, weight: f.na ? 500 : 600, color: f.na ? MUTE : INK });
      }, { dx: -30, dy: 0 });
    });
  }
  // ---------- 9. penutup ----------
  function akhir(ctx, t) {
    photo(ctx, IMG.dw, 0, 0, W, H, t, ev.akhir, S.DURATION, { from: { zoom: 1.05, x: 0.55, y: 0.4 }, to: { zoom: 1.15, x: 0.6, y: 0.35 } });
    ctx.fillStyle = 'rgba(4,12,28,.84)'; ctx.fillRect(0, 0, W, H);
    const r = ctx.createRadialGradient(W * 0.5, H, 0, W * 0.5, H, W); r.addColorStop(0, 'rgba(5,71,58,.7)'); r.addColorStop(1, 'rgba(5,71,58,0)'); ctx.fillStyle = r; ctx.fillRect(0, 0, W, H);
    star(ctx, 540, 1380, 340, { rot: t * 0.04, alpha: 0.32 });
    glow(ctx, 540, 1600, 560);
    const u = eo(t, ev.akhir, 0.7);
    ctx.save(); ctx.globalAlpha = u; portrait(ctx, 540, H + 10, 960 + 30 * u); ctx.restore();
    const k = t >= ev.akhir ? 1 + 0.05 * (1 - eo(t, ev.akhir, 0.5)) : 1;
    ctx.save(); ctx.translate(L, 360); ctx.scale(k, k);
    txt(ctx, 'Suara Parit', 0, 0, { size: 112, weight: 800 }); txt(ctx, 'di Dewan Rakyat', 0, 100, { size: 80, weight: 800 }); ctx.restore();
    rise(ctx, t, T(23, 1), () => { txt(ctx, 'Isu dibangkitkan,', L, 540, { size: 36, weight: 600, color: CY }); txt(ctx, 'kepentingan rakyat diperjuangkan', L, 586, { size: 36, weight: 600, color: CY }); });
    rise(ctx, t, T(23, 2), () => { ctx.fillStyle = GOLD; ctx.fillRect(L, 630, 90, 4); txt(ctx, 'YB Ustaz Ismi', L, 690, { size: 46, weight: 800 }); txt(ctx, 'Ahli Parlimen Parit', L, 734, { size: 30, weight: 700, color: GOLD }); });
    rise(ctx, t, T(24), () => wrap(ctx, 'Sumber: Senarai Video Ucapan Parit; Hansard Kamar Khas; Aturan Urusan Mesyuarat. Jawapan kementerian tidak dinyatakan dalam bahan.', L, 800, CW, 28, { size: 21, weight: 500, color: MUTE }));
  }

  const SECTIONS = { intro, potret, dewan, angka, tahun, kamar, isu, sorotan, akhir };
  const HITS = [ev.title, ev.potret, ev.dewan, ev.angka, ev.tahun, ev.kamar, ...S.ISU.map((s) => s.t), ev.sorotan, ev.akhir];
  Studio.film({
    fadeOut: 1.4,
    post: { paper: 0, vignette: 0.35, grain: 0.035 },
    async init() {
      const L = (n) => Studio.loadImage('assets/' + n);
      [IMG.ismi, IMG.r3, IMG.dw] = await Promise.all(['ismi.webp', 'dr-rtm-3.webp', 'dr-dewan.webp'].map(L));
    },
    draw(ctx, t) {
      const sec = sectionOf(t);
      SECTIONS[sec](ctx, t);
      flash(ctx, t, HITS);
    },
  });
})();
