/*
 * Surih huruf: anak ikut anak panah dengan jari.
 * Setiap garisan dipecahkan kepada titik semak; jari mesti melalui titik
 * tersebut mengikut turutan. Jika jari terangkat atau tersasar, kemajuan
 * tidak hilang — anak boleh sambung semula dari titik hijau (pemaaf).
 */
class Tracer {
  constructor(canvas, letter, { onStroke, onDone, onMiss } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.letter = letter;
    this.onStroke = onStroke || (() => {});
    this.onDone = onDone || (() => {});
    this.onMiss = onMiss || (() => {});
    this.TOL = 26;          // toleransi (unit kotak 200)
    this.STEP = 7;          // jarak antara titik semak
    this.strokes = letter.strokes.map((s) => this._prepare(s));
    this.si = 0;            // indeks garisan semasa
    this.ci = 0;            // titik semak seterusnya
    this.drawing = false;
    this.trail = [];
    this.done = false;
    this.t0 = performance.now();

    this._resize = this._resize.bind(this);
    this._down = this._down.bind(this);
    this._move = this._move.bind(this);
    this._up = this._up.bind(this);
    canvas.addEventListener('pointerdown', this._down);
    canvas.addEventListener('pointermove', this._move);
    window.addEventListener('pointerup', this._up);
    window.addEventListener('pointercancel', this._up);
    window.addEventListener('resize', this._resize);
    this._resize();
    this._loop = this._loop.bind(this);
    this.raf = requestAnimationFrame(this._loop);
  }

  _prepare(s) {
    if (s.dot) return { dot: s.dot, pts: [s.dot] };
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', s.d);
    const len = el.getTotalLength();
    const n = Math.max(2, Math.ceil(len / this.STEP));
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const p = el.getPointAtLength((len * i) / n);
      pts.push([p.x, p.y]);
    }
    return { d: s.d, path: new Path2D(s.d), pts };
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.canvas.removeEventListener('pointerdown', this._down);
    this.canvas.removeEventListener('pointermove', this._move);
    window.removeEventListener('pointerup', this._up);
    window.removeEventListener('pointercancel', this._up);
    window.removeEventListener('resize', this._resize);
  }

  _resize() {
    const r = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(r.width * dpr);
    this.canvas.height = Math.round(r.height * dpr);
    this.scale = (r.width * dpr) / 200;
    this.cssScale = r.width / 200;
  }

  _toLocal(e) {
    const r = this.canvas.getBoundingClientRect();
    return [(e.clientX - r.left) / this.cssScale, (e.clientY - r.top) / this.cssScale];
  }

  get cur() { return this.strokes[this.si]; }

  _down(e) {
    if (this.done) return;
    e.preventDefault();
    const p = this._toLocal(e);
    const s = this.cur;
    if (s.dot) {
      if (dist(p, s.dot) < this.TOL + 8) this._finishStroke();
      else this.onMiss();
      return;
    }
    // Mula/ sambung hanya berhampiran titik hijau.
    if (dist(p, s.pts[this.ci]) < this.TOL + 6) {
      this.drawing = true;
      this.canvas.setPointerCapture?.(e.pointerId);
      this.trail = [p];
      this._advance(p);
    } else {
      this.onMiss();
    }
  }

  _move(e) {
    if (!this.drawing || this.done) return;
    const p = this._toLocal(e);
    this.trail.push(p);
    if (this.trail.length > 40) this.trail.shift();
    const s = this.cur;
    // Tersasar jauh daripada laluan seterusnya?
    const look = s.pts.slice(Math.max(0, this.ci - 2), this.ci + 5);
    const near = Math.min(...look.map((q) => dist(p, q)));
    if (near > this.TOL * 1.9) {
      this.drawing = false;
      this.trail = [];
      this.onMiss();
      return;
    }
    this._advance(p);
  }

  _up() { this.drawing = false; this.trail = []; }

  _advance(p) {
    const s = this.cur;
    // Majukan ke titik semak terjauh (dalam tetingkap kecil) yang berada dalam toleransi.
    let best = -1;
    for (let k = this.ci; k < Math.min(s.pts.length, this.ci + 4); k++) {
      if (dist(p, s.pts[k]) < this.TOL) best = k;
    }
    if (best >= 0) this.ci = best + 1;
    if (this.ci >= s.pts.length) this._finishStroke();
  }

  _finishStroke() {
    this.drawing = false;
    this.trail = [];
    this.si++;
    this.ci = 0;
    if (this.si >= this.strokes.length) {
      this.done = true;
      this.onDone();
    } else {
      this.onStroke(this.cur.dot ? 'dot' : 'line');
    }
  }

  _loop(now) {
    const { ctx } = this;
    const t = (now - this.t0) / 1000;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1) Bayang huruf (semua garisan).
    this.strokes.forEach((s, i) => {
      if (s.dot) {
        ctx.fillStyle = i < this.si ? '#7c4dff' : '#e6e0ff';
        ctx.beginPath(); ctx.arc(s.dot[0], s.dot[1], 11, 0, Math.PI * 2); ctx.fill();
        return;
      }
      ctx.strokeStyle = i < this.si ? '#7c4dff' : '#e6e0ff';
      ctx.lineWidth = i < this.si ? 18 : 24;
      ctx.stroke(s.path);
      if (i >= this.si) {
        ctx.save();
        ctx.setLineDash([2, 7]);
        ctx.strokeStyle = '#b9aaff';
        ctx.lineWidth = 2.5;
        ctx.stroke(s.path);
        ctx.restore();
      }
    });

    if (!this.done) {
      const s = this.cur;
      if (s.dot) {
        const r = 13 + Math.sin(t * 6) * 3;
        ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(s.dot[0], s.dot[1], r, 0, Math.PI * 2); ctx.stroke();
        drawHand(ctx, s.dot[0] + 10, s.dot[1] + 10, t);
      } else {
        // 2) Kemajuan garisan semasa.
        if (this.ci > 0) {
          ctx.strokeStyle = '#7c4dff'; ctx.lineWidth = 18;
          ctx.beginPath();
          ctx.moveTo(...s.pts[0]);
          for (let k = 1; k < this.ci; k++) ctx.lineTo(...s.pts[k]);
          ctx.stroke();
        }
        // 3) Anak panah bergerak di sepanjang laluan seterusnya.
        const rem = s.pts.length - this.ci;
        const span = Math.min(rem - 1, 14);
        if (span > 1) {
          for (let j = 0; j < 3; j++) {
            const f = ((t * 0.9 + j / 3) % 1);
            const k = this.ci + Math.floor(f * span);
            const a = s.pts[k];
            const b = s.pts[Math.min(s.pts.length - 1, k + 1)];
            drawArrow(ctx, a, b, 1 - Math.abs(f - 0.5) * 1.4);
          }
        }
        // 4) Titik hijau = mula di sini.
        const p = s.pts[Math.min(this.ci, s.pts.length - 1)];
        const r = 12 + Math.sin(t * 6) * 2.5;
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, Math.PI * 2); ctx.fill();
        if (!this.drawing) drawHand(ctx, p[0] + 10, p[1] + 10, t);
      }
    }

    // 5) Jejak jari.
    if (this.trail.length > 1) {
      ctx.strokeStyle = 'rgba(255,193,7,.8)'; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(...this.trail[0]);
      this.trail.forEach((q) => ctx.lineTo(...q));
      ctx.stroke();
    }
    this.raf = requestAnimationFrame(this._loop);
  }
}

function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

function drawArrow(ctx, a, b, alpha) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.translate(a[0], a[1]);
  ctx.rotate(ang);
  ctx.fillStyle = '#ff7043';
  ctx.beginPath();
  ctx.moveTo(9, 0); ctx.lineTo(-6, -8); ctx.lineTo(-2, 0); ctx.lineTo(-6, 8);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawHand(ctx, x, y, t) {
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.font = '26px system-ui, "Apple Color Emoji", "Noto Color Emoji", sans-serif';
  ctx.fillText('👆', x + Math.sin(t * 4) * 2, y + 18 + Math.cos(t * 4) * 2);
  ctx.restore();
}
