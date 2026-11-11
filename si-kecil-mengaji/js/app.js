/*
 * Si Kecil Mengaji — logik aplikasi (skrin, permainan, ganjaran, ibu bapa).
 */
(() => {
  const view = document.getElementById('view');
  const fx = document.getElementById('fx');
  const $ = (sel, root = view) => root.querySelector(sel);
  const $$ = (sel, root = view) => [...root.querySelectorAll(sel)];
  const lang = () => Store.data.settings.lang;
  const say = (key) => Audio2.prompt(key, lang());
  const byId = (id) => LETTERS.find((L) => L.id === Number(id));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a, n) => shuffle(a).slice(0, n);
  const T = (ms, en) => (lang() === 'en' ? en : ms);

  // ---------------------------------------------------------------- Router
  let cleanup = null;
  let current = { name: 'home', params: {} };
  const history = [];
  const ADULT_SCREENS = new Set(['gate', 'parent', 'rest']);

  function go(name, params = {}, { push = true } = {}) {
    if (cleanup) { try { cleanup(); } catch { /* */ } cleanup = null; }
    Audio2.stop();
    if (push && current.name !== name) history.push(current);
    if (name === 'home') history.length = 0;
    current = { name, params };
    view.className = `screen-${name}`;
    view.innerHTML = '';
    document.body.dataset.screen = name;
    cleanup = SCREENS[name](params) || null;
    updateStars();
  }
  function back() {
    const prev = history.pop();
    go(prev ? prev.name : 'home', prev ? prev.params : {}, { push: false });
  }

  document.getElementById('btn-home').onclick = () => { if (current.name !== 'rest') go('home'); };
  document.getElementById('btn-back').onclick = () => { if (current.name !== 'rest') back(); };
  document.getElementById('btn-parent').onclick = () => go('gate', { then: 'parent' });

  function updateStars() {
    document.querySelector('#star-count span').textContent = Store.data.stars;
  }

  // ---------------------------------------------------------------- Kesan
  function reward(n = 1) {
    const newSticker = Store.addStars(n);
    updateStars();
    const sc = document.getElementById('star-count');
    sc.classList.remove('pop'); void sc.offsetWidth; sc.classList.add('pop');
    if (newSticker) {
      setTimeout(() => {
        const s = STICKERS[Store.stickerCount() - 1];
        burst([s, s, s, '⭐']);
        toast(`<span class="big-emoji">${s}</span>`);
        say('sticker');
      }, 900);
    }
  }

  function burst(items = ['⭐', '🌟', '✨', '🎉']) {
    for (let i = 0; i < 22; i++) {
      const e = document.createElement('div');
      e.className = 'confetti';
      e.textContent = items[i % items.length];
      e.style.left = `${Math.random() * 100}vw`;
      e.style.animationDelay = `${Math.random() * 0.4}s`;
      e.style.fontSize = `${24 + Math.random() * 24}px`;
      fx.appendChild(e);
      setTimeout(() => e.remove(), 2200);
    }
  }

  function toast(html, ms = 2200) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = html;
    fx.appendChild(t);
    setTimeout(() => t.remove(), ms);
  }

  function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

  // ---------------------------------------------------------------- Muka makhraj
  function faceSVG(zone) {
    const c = MAKHRAJ[zone].color;
    return `
<svg class="face zone-${zone}" viewBox="0 0 200 220" role="img" aria-label="Makhraj: ${MAKHRAJ[zone].ms}">
  <rect class="z-throat" x="78" y="168" width="44" height="46" rx="12" fill="#ffe0c2"/>
  <circle cx="100" cy="98" r="78" fill="#ffe0c2"/>
  <path d="M30 80 q70 -90 140 0 q-10 -60 -70 -62 q-60 2 -70 62z" fill="#5d4037"/>
  <circle cx="72" cy="88" r="7" fill="#3e2723"/><circle cx="128" cy="88" r="7" fill="#3e2723"/>
  <circle cx="74" cy="86" r="2" fill="#fff"/><circle cx="130" cy="86" r="2" fill="#fff"/>
  <circle cx="58" cy="114" r="9" fill="#ffab91" opacity=".5"/><circle cx="142" cy="114" r="9" fill="#ffab91" opacity=".5"/>
  <g class="mouth">
    <ellipse class="z-lips" cx="100" cy="138" rx="28" ry="16" fill="#e57373"/>
    <ellipse cx="100" cy="138" rx="21" ry="10" fill="#6d1b1b"/>
    <ellipse class="z-tongue" cx="100" cy="143" rx="13" ry="5" fill="#f48fb1"/>
  </g>
  <g class="hl" style="--c:${c}">
    ${zone === 'halq' ? '<rect x="74" y="168" width="52" height="50" rx="14" />' : ''}
    ${zone === 'lisan' ? '<ellipse cx="100" cy="143" rx="17" ry="8" />' : ''}
    ${zone === 'syafatain' ? '<ellipse cx="100" cy="138" rx="32" ry="20" />' : ''}
  </g>
</svg>`;
  }

  // ---------------------------------------------------------------- Skrin
  const SCREENS = {};

  SCREENS.home = () => {
    view.innerHTML = `
      <div class="home-hero">
        <div class="mascot-wrap bounce">${mascotSVG({ stage: mascotStage() })}</div>
      </div>
      <nav class="tiles">
        <button class="tile t-learn"  data-go="letters" data-mode="learn"  aria-label="Kenal huruf"><span>🔤</span><small>${T('Kenal', 'Learn')}</small></button>
        <button class="tile t-trace"  data-go="letters" data-mode="trace"  aria-label="Surih huruf"><span>✍️</span><small>${T('Surih', 'Trace')}</small></button>
        <button class="tile t-games"  data-go="games"  aria-label="Permainan"><span>🎮</span><small>${T('Main', 'Play')}</small></button>
        <button class="tile t-record" data-go="letters" data-mode="record" aria-label="Rakam"><span>🎤</span><small>${T('Rakam', 'Record')}</small></button>
        <button class="tile t-reward" data-go="rewards" aria-label="Ganjaran"><span>🏆</span><small>${T('Hadiah', 'Prizes')}</small></button>
      </nav>`;
    $$('.tile').forEach((b) => { b.onclick = () => go(b.dataset.go, { mode: b.dataset.mode }); });
    $('.mascot-wrap').onclick = () => say('welcome');
  };

  SCREENS.letters = ({ mode = 'learn' }) => {
    const icon = { learn: '🔊', trace: '✍️', record: '🎤' }[mode];
    view.innerHTML = `
      <div class="mode-badge">${icon}</div>
      <div class="grid" dir="rtl">
        ${LETTERS.map((L) => `
          <button class="letter-btn ${Store.isMastered(L.id) ? 'mastered' : ''}" data-id="${L.id}" aria-label="${L.name}">
            <span class="ar">${L.char}</span>
            ${Store.isMastered(L.id) ? '<i class="badge">⭐</i>' : ''}
          </button>`).join('')}
      </div>`;
    $$('.letter-btn').forEach((b) => {
      b.onclick = () => go(mode === 'learn' ? 'learn' : mode, { id: Number(b.dataset.id) });
    });
    if (mode === 'learn') say('tapLetter');
  };

  SCREENS.learn = ({ id }) => {
    const L = byId(id);
    view.innerHTML = `
      <div class="learn">
        <button class="nav-arrow prev" aria-label="Sebelum" ${id <= 1 ? 'disabled' : ''}>▶</button>
        <div class="learn-main">
          <button class="big-letter ar" aria-label="Dengar ${L.name}">${L.char}</button>
          <div class="letter-name">${L.name}</div>
          <div class="face-wrap">${faceSVG(L.makhraj)}<span class="zone-tag" style="background:${MAKHRAJ[L.makhraj].color}">${MAKHRAJ[L.makhraj][lang()]}</span></div>
        </div>
        <button class="nav-arrow next" aria-label="Seterusnya" ${id >= 28 ? 'disabled' : ''}>◀</button>
      </div>
      <div class="actions">
        <button class="round-btn play" aria-label="Dengar">🔊</button>
        <button class="round-btn" data-go="trace" aria-label="Surih">✍️</button>
        <button class="round-btn" data-go="record" aria-label="Rakam">🎤</button>
      </div>`;
    const face = $('.face');
    Audio2.setStateListener((on) => face && face.classList.toggle('speaking', on));
    const play = async () => {
      const first = Store.letter(id).heard === 0;
      Store.bump(id, 'heard');
      await Audio2.letter(L);
      if (first) reward(1);
    };
    $('.big-letter').onclick = play;
    $('.play').onclick = play;
    $('.prev').onclick = () => go('learn', { id: id - 1 }, { push: false });
    $('.next').onclick = () => go('learn', { id: id + 1 }, { push: false });
    $$('[data-go]').forEach((b) => { b.onclick = () => go(b.dataset.go, { id }); });
    const t = setTimeout(play, 350);
    return () => { clearTimeout(t); Audio2.setStateListener(() => {}); };
  };

  SCREENS.trace = ({ id }) => {
    const L = byId(id);
    view.innerHTML = `
      <div class="trace">
        <div class="trace-head">
          <button class="mini-letter ar" aria-label="Dengar">${L.char}</button>
        </div>
        <div class="canvas-wrap"><canvas id="trace-canvas" aria-label="Kawasan surih"></canvas></div>
        <div class="actions">
          <button class="round-btn redo" aria-label="Ulang">🔄</button>
          <button class="round-btn next hidden" aria-label="Huruf seterusnya">➡️</button>
        </div>
      </div>`;
    let tracer;
    const start = () => {
      if (tracer) tracer.destroy();
      $('.next').classList.add('hidden');
      tracer = new Tracer($('#trace-canvas'), L, {
        onStroke: (kind) => { Audio2.chime(true); if (kind === 'dot') setTimeout(() => say('tapDot'), 300); },
        onMiss: () => { if (navigator.vibrate) navigator.vibrate(40); },
        onDone: async () => {
          Store.bump(id, 'traced');
          Audio2.chime(true);
          burst();
          reward(1);
          $('.next').classList.remove('hidden');
          await Audio2.letter(L);
          say('great');
        },
      });
    };
    $('.mini-letter').onclick = () => Audio2.letter(L);
    $('.redo').onclick = start;
    $('.next').onclick = () => go('trace', { id: (id % 28) + 1 }, { push: false });
    start();
    say('trace');
    return () => tracer && tracer.destroy();
  };

  SCREENS.record = ({ id }) => {
    const L = byId(id);
    view.innerHTML = `
      <div class="record">
        <div class="big-letter ar static">${L.char}</div>
        <div class="rec-row">
          <button class="round-btn teacher" aria-label="Suara guru">👳🔊</button>
          <button class="rec-btn" aria-label="Rakam"><span class="dot"></span><svg class="ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46"/></svg></button>
          <button class="round-btn mine" aria-label="Suara saya" disabled>🧒▶️</button>
        </div>
        <div class="parent-eval hidden">
          <p>${T('Untuk ibu bapa: adakah sebutan betul?', 'For parents: was it said correctly?')}</p>
          <button class="eval ok" aria-label="Betul">👍</button>
          <button class="eval retry" aria-label="Cuba lagi">🔁</button>
        </div>
        <p class="note hidden" id="mic-note"></p>
      </div>`;
    let blob = null;
    let rec = null;
    let stream = null;
    const recBtn = $('.rec-btn');

    $('.teacher').onclick = () => Audio2.letter(L);
    $('.mine').onclick = async () => {
      if (!blob) return;
      await Audio2.playBlob(blob);
    };

    recBtn.onclick = async () => {
      if (rec && rec.state === 'recording') { rec.stop(); return; }
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        const n = $('#mic-note'); n.textContent = T('Peranti ini tidak menyokong rakaman.', 'Recording is not supported on this device.'); n.classList.remove('hidden');
        return;
      }
      try {
        stream = stream || await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        const n = $('#mic-note'); n.textContent = T('Benarkan mikrofon untuk merakam.', 'Please allow the microphone to record.'); n.classList.remove('hidden');
        return;
      }
      Audio2.stop();
      const chunks = [];
      rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = () => {
        recBtn.classList.remove('recording');
        blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
        $('.mine').disabled = false;
        $('.parent-eval').classList.remove('hidden');
        say('compare');
      };
      rec.start();
      recBtn.classList.add('recording');
      setTimeout(() => rec && rec.state === 'recording' && rec.stop(), 3000);
    };

    $('.eval.ok').onclick = () => {
      Store.bump(id, 'recOk'); Audio2.chime(true); burst(); reward(1);
      $('.parent-eval').classList.add('hidden');
    };
    $('.eval.retry').onclick = () => {
      Store.bump(id, 'recRetry'); say('tryAgain');
      $('.parent-eval').classList.add('hidden');
    };
    say('record');
    return () => {
      if (rec && rec.state === 'recording') rec.stop();
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  };

  SCREENS.games = () => {
    view.innerHTML = `
      <nav class="tiles games">
        <button class="tile t-learn" data-go="gMatch" aria-label="Padan bunyi"><span>👂</span><small>${T('Dengar & pilih', 'Listen & pick')}</small></button>
        <button class="tile t-games" data-go="gCatch" aria-label="Tangkap huruf"><span>🧺</span><small>${T('Tangkap', 'Catch')}</small></button>
        <button class="tile t-trace" data-go="gMissing" aria-label="Huruf hilang"><span>❓</span><small>${T('Yang hilang', 'Missing')}</small></button>
      </nav>`;
    $$('.tile').forEach((b) => { b.onclick = () => go(b.dataset.go); });
  };

  // Pilih huruf untuk kuiz: utamakan huruf yang lemah / sudah didengar.
  function quizPool() {
    const heard = LETTERS.filter((L) => Store.letter(L.id).heard > 0);
    const pool = heard.length >= 4 ? heard : LETTERS.slice(0, Math.max(6, heard.length + 3));
    const weak = Store.weakLetters().map((x) => x.L);
    return [...weak, ...pool];
  }

  function progressDots(n, i) {
    return `<div class="progress">${Array.from({ length: n }, (_, k) => `<i class="${k < i ? 'on' : ''}"></i>`).join('')}</div>`;
  }

  function endGame(stars) {
    view.innerHTML = `
      <div class="end">
        <div class="mascot-wrap bounce">${mascotSVG({ stage: mascotStage(), mood: 'wow' })}</div>
        <div class="end-stars">${'⭐'.repeat(Math.max(1, stars))}</div>
        <div class="actions">
          <button class="round-btn again" aria-label="Main lagi">🔄</button>
          <button class="round-btn home" aria-label="Rumah">🏠</button>
        </div>
      </div>`;
    burst();
    reward(Math.max(1, stars));
    say('great');
    $('.again').onclick = () => go(current.name, current.params, { push: false });
    $('.home').onclick = () => go('home');
  }

  SCREENS.gMatch = () => {
    const ROUNDS = 5;
    let round = 0; let score = 0; let firstTry = true; let target;
    const pool = quizPool();
    const next = () => {
      if (round >= ROUNDS) return endGame(Math.ceil((score / ROUNDS) * 3));
      target = pool[(Math.random() * Math.min(pool.length, 10)) | 0];
      const others = pick(LETTERS.filter((L) => L.id !== target.id), 2);
      const opts = shuffle([target, ...others]);
      firstTry = true;
      view.innerHTML = `
        ${progressDots(ROUNDS, round)}
        <button class="round-btn huge listen" aria-label="Dengar lagi">🔊</button>
        <div class="options">${opts.map((L) => `<button class="opt ar" data-id="${L.id}">${L.char}</button>`).join('')}</div>`;
      $('.listen').onclick = () => Audio2.letter(target);
      $$('.opt').forEach((b) => {
        b.onclick = async () => {
          if (Number(b.dataset.id) === target.id) {
            b.classList.add('correct');
            Audio2.chime(true);
            if (firstTry) { score++; Store.bump(target.id, 'quizRight'); }
            round++;
            $$('.opt').forEach((o) => { o.disabled = true; });
            setTimeout(next, 900);
          } else {
            if (firstTry) Store.bump(target.id, 'quizWrong');
            firstTry = false;
            shake(b); Audio2.chime(false);
            setTimeout(() => Audio2.letter(target), 400);
          }
        };
      });
      setTimeout(() => Audio2.letter(target), 300);
    };
    next();
  };

  SCREENS.gMissing = () => {
    const ROUNDS = 5;
    let round = 0; let score = 0;
    const next = () => {
      if (round >= ROUNDS) return endGame(Math.ceil((score / ROUNDS) * 3));
      const start = (Math.random() * 26) | 0;           // 3 huruf berturutan
      const seq = LETTERS.slice(start, start + 3);
      const hole = (Math.random() * 3) | 0;
      const target = seq[hole];
      const opts = shuffle([target, ...pick(LETTERS.filter((L) => !seq.includes(L)), 2)]);
      let firstTry = true;
      view.innerHTML = `
        ${progressDots(ROUNDS, round)}
        <div class="seq" dir="rtl">${seq.map((L, i) => `<div class="seq-cell ar ${i === hole ? 'hole' : ''}">${i === hole ? '?' : L.char}</div>`).join('')}</div>
        <div class="options">${opts.map((L) => `<button class="opt ar" data-id="${L.id}">${L.char}</button>`).join('')}</div>`;
      $$('.seq-cell').forEach((c, i) => { if (i !== hole) c.onclick = () => Audio2.letter(seq[i]); });
      $$('.opt').forEach((b) => {
        b.onclick = async () => {
          if (Number(b.dataset.id) === target.id) {
            const cell = $('.hole'); cell.textContent = target.char; cell.classList.add('filled');
            Audio2.chime(true);
            if (firstTry) { score++; Store.bump(target.id, 'quizRight'); }
            round++;
            $$('.opt').forEach((o) => { o.disabled = true; });
            Audio2.letter(target);
            setTimeout(next, 1300);
          } else {
            if (firstTry) Store.bump(target.id, 'quizWrong');
            firstTry = false; shake(b); Audio2.chime(false);
          }
        };
      });
      if (round === 0) say('missing');
    };
    next();
  };

  SCREENS.gCatch = () => {
    const GOAL = 6;
    const pool = quizPool();
    const target = pool[(Math.random() * Math.min(pool.length, 10)) | 0];
    const distractors = pick(LETTERS.filter((L) => L.id !== target.id), 4);
    let caught = 0; let mistakes = 0; let running = true;
    view.innerHTML = `
      <div class="catch-head">
        <button class="target ar" aria-label="Dengar">${target.char}</button>
        <div class="basket">🧺 <span>0</span>/${GOAL}</div>
      </div>
      <div class="sky"></div>`;
    const sky = $('.sky');
    $('.target').onclick = () => Audio2.letter(target);
    const items = [];
    let last = 0; let raf;
    const spawn = () => {
      const isT = Math.random() < 0.45;
      const L = isT ? target : distractors[(Math.random() * distractors.length) | 0];
      const el = document.createElement('button');
      el.className = 'faller ar';
      el.textContent = L.char;
      el.style.left = `${5 + Math.random() * 75}%`;
      const it = { el, L, y: -80, v: 55 + Math.random() * 40 + caught * 4 };
      el.onpointerdown = (e) => {
        e.preventDefault();
        if (!running || it.hit) return;
        it.hit = true;
        if (L.id === target.id) {
          caught++; Audio2.chime(true);
          el.classList.add('got');
          $('.basket span').textContent = caught;
          if (caught >= GOAL) finish();
        } else {
          mistakes++; Audio2.chime(false); shake(el);
          setTimeout(() => { it.hit = false; }, 500);
        }
      };
      sky.appendChild(el);
      items.push(it);
    };
    const finish = () => {
      running = false;
      Store.bump(target.id, 'quizRight', 2);
      if (mistakes > 2) Store.bump(target.id, 'quizWrong');
      setTimeout(() => endGame(mistakes === 0 ? 3 : mistakes < 3 ? 2 : 1), 600);
    };
    const tick = (now) => {
      if (!running) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const h = sky.clientHeight;
      if (Math.random() < dt * 0.9 || items.length === 0) spawn();
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        if (it.el.classList.contains('got')) { it.gone = (it.gone || 0) + dt; if (it.gone > 0.4) { it.el.remove(); items.splice(i, 1); } continue; }
        it.y += it.v * dt;
        it.el.style.transform = `translateY(${it.y}px)`;
        if (it.y > h) { it.el.remove(); items.splice(i, 1); }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    say('catchThis');
    setTimeout(() => Audio2.letter(target), 1800);
    return () => { running = false; cancelAnimationFrame(raf); };
  };

  SCREENS.rewards = () => {
    const n = Store.stickerCount();
    const stage = mascotStage();
    view.innerHTML = `
      <div class="rewards">
        <div class="mascot-wrap">${mascotSVG({ stage })}</div>
        <div class="growth">${MASCOT_STAGES.map((_, i) => `<i class="${i <= stage ? 'on' : ''}"></i>`).join('')}</div>
        <div class="big-stars">⭐ ${Store.data.stars}</div>
        <div class="album">${STICKERS.map((s, i) => `<div class="sticker ${i < n ? 'got' : ''}">${i < n ? s : '❔'}</div>`).join('')}</div>
      </div>`;
  };

  // ---------------------------------------------------------------- Ibu bapa
  SCREENS.gate = ({ then = 'parent' }) => {
    const a = 3 + ((Math.random() * 7) | 0);
    const b = 3 + ((Math.random() * 7) | 0);
    const ans = a + b;
    const opts = shuffle([ans, ans + 1, ans - 1, ans + 2]);
    view.innerHTML = `
      <div class="gate">
        <h2>${T('Untuk ibu bapa', 'For parents')}</h2>
        <p>${T('Jawab soalan ini untuk masuk:', 'Answer to continue:')}</p>
        <div class="q">${a} + ${b} = ?</div>
        <div class="gate-opts">${opts.map((o) => `<button data-v="${o}">${o}</button>`).join('')}</div>
      </div>`;
    $$('.gate-opts button').forEach((btn) => {
      btn.onclick = () => {
        if (Number(btn.dataset.v) === ans) go(then, {}, { push: false });
        else go('home');
      };
    });
  };

  SCREENS.parent = () => {
    const d = Store.data;
    const days = Store.lastDays(7);
    const maxSec = Math.max(60, ...days.map((x) => x.sec));
    const weak = Store.weakLetters();
    const dayName = (dt) => dt.toLocaleDateString(lang() === 'en' ? 'en-GB' : 'ms-MY', { weekday: 'short' });
    const mins = (s) => Math.round(s / 60);
    const cell = (v) => (v > 0 ? '✅' : '·');
    view.innerHTML = `
      <div class="parent">
        <h2>${T('Papan pemuka ibu bapa', 'Parent dashboard')}</h2>
        <div class="kpis">
          <div><b>${Store.masteredCount()}/28</b><span>${T('huruf dikuasai', 'letters mastered')}</span></div>
          <div><b>${d.stars}</b><span>${T('bintang', 'stars')}</span></div>
          <div><b>${mins(Store.usedToday())} min</b><span>${T('hari ini', 'today')}</span></div>
        </div>

        <h3>${T('Masa penggunaan (7 hari)', 'Screen time (7 days)')}</h3>
        <div class="bars">${days.map((x) => `
          <div class="bar"><div class="fill" style="height:${(x.sec / maxSec) * 100}%"></div><em>${mins(x.sec)}</em><span>${dayName(x.day)}</span></div>`).join('')}
        </div>

        <h3>${T('Huruf perlu diulang', 'Letters to practise')}</h3>
        <p class="weak">${weak.length ? weak.map((x) => `<span class="ar chip">${x.L.char}</span>`).join('') : T('Tiada lagi — teruskan!', 'None yet — keep going!')}</p>

        <h3>${T('Kemajuan setiap huruf', 'Progress per letter')}</h3>
        <div class="table-wrap"><table>
          <thead><tr><th>${T('Huruf', 'Letter')}</th><th>🔊</th><th>✍️</th><th>🎮 %</th><th>🎤</th></tr></thead>
          <tbody>${LETTERS.map((L) => {
            const p = d.letters[L.id]; const acc = Store.accuracy(L.id);
            return `<tr class="${Store.isMastered(L.id) ? 'm' : ''}"><td><span class="ar">${L.char}</span> ${L.name}</td><td>${cell(p.heard)}</td><td>${cell(p.traced)}</td><td>${acc === null ? '·' : Math.round(acc * 100)}</td><td>${p.recOk ? '👍' + p.recOk : ''}${p.recRetry ? ' 🔁' + p.recRetry : ''}</td></tr>`;
          }).join('')}</tbody>
        </table></div>

        <h3>${T('Tetapan', 'Settings')}</h3>
        <label class="row">${T('Bahasa suara arahan', 'Instruction voice')}
          <select id="set-lang"><option value="ms">Bahasa Melayu</option><option value="en">English</option></select></label>
        <label class="row">${T('Had masa sehari', 'Daily time limit')}
          <select id="set-limit">${[5, 10, 15, 20, 30, 0].map((m) => `<option value="${m}">${m ? m + ' min' : T('Tiada had', 'No limit')}</option>`).join('')}</select></label>
        <div class="row-btns">
          <button id="extend">${T('+5 minit hari ini', '+5 minutes today')}</button>
          <button id="reset" class="danger">${T('Set semula kemajuan', 'Reset progress')}</button>
        </div>
        <p class="small">${T(
          'Aplikasi ini tiada iklan, tiada pautan keluar dan semua data kekal dalam peranti ini.',
          'No ads, no external links, and all data stays on this device.')}</p>
        <button class="done-btn" id="done">${T('Selesai', 'Done')} ✔</button>
      </div>`;
    $('#set-lang').value = d.settings.lang;
    $('#set-limit').value = String(d.settings.limitMin);
    $('#set-lang').onchange = (e) => { d.settings.lang = e.target.value; Store.save(); go('parent', {}, { push: false }); };
    $('#set-limit').onchange = (e) => { d.settings.limitMin = Number(e.target.value); Store.save(); };
    $('#extend').onclick = () => { Session.extend(5 * 60); toast('⏱️ +5'); };
    $('#reset').onclick = () => {
      if (confirm(T('Padam semua kemajuan anak?', "Erase all of your child's progress?"))) { Store.reset(); go('parent', {}, { push: false }); }
    };
    $('#done').onclick = () => go('home');
  };

  SCREENS.rest = () => {
    view.innerHTML = `
      <div class="rest">
        <div class="mascot-wrap">${mascotSVG({ stage: mascotStage(), sleeping: true })}</div>
        <div class="moon">🌙</div>
        <button class="small-link" id="rest-parent">🔒</button>
      </div>`;
    say('rest');
    $('#rest-parent').onclick = () => go('gate', { then: 'parent' });
  };

  // ---------------------------------------------------------------- Had masa skrin
  const Session = (() => {
    let pending = 0;
    let bonus = { day: Store.today(), sec: 0 };
    const limitSec = () => {
      const m = Store.data.settings.limitMin;
      if (!m) return Infinity;
      if (bonus.day !== Store.today()) bonus = { day: Store.today(), sec: 0 };
      return m * 60 + bonus.sec;
    };
    setInterval(() => {
      if (document.hidden || ADULT_SCREENS.has(current.name)) return;
      pending++;
      if (pending >= 5) { Store.addUsage(pending); pending = 0; }
      if (Store.usedToday() + pending >= limitSec()) go('rest');
    }, 1000);
    document.addEventListener('visibilitychange', () => { if (document.hidden && pending) { Store.addUsage(pending); pending = 0; } });
    return {
      extend(sec) { if (bonus.day !== Store.today()) bonus = { day: Store.today(), sec: 0 }; bonus.sec += sec; },
      overLimit() { return Store.usedToday() >= limitSec(); },
    };
  })();

  // ---------------------------------------------------------------- Mula
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  go(Session.overLimit() ? 'rest' : 'home', {}, { push: false });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
