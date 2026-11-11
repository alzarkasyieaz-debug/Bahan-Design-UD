/*
 * Audio: utamakan rakaman sebenar (qari/qariah) dalam folder audio/.
 * Jika fail belum ada, guna suara peranti (speechSynthesis) sebagai sandaran
 * supaya aplikasi masih boleh dicuba semasa pembangunan.
 */
const Audio2 = (() => {
  const missing = new Set();      // URL yang sudah disahkan tiada
  // Senarai fail audio sebenar (audio/manifest.json). Fail yang tiada dalam
  // senarai terus guna suara peranti — tiada permintaan 404 yang sia-sia.
  let available = null;
  const ready = fetch('audio/manifest.json')
    .then((r) => (r.ok ? r.json() : []))
    .then((list) => { available = new Set(list.map((f) => `audio/${f}`)); })
    .catch(() => { available = new Set(); });
  const has = async (url) => { await ready; return available.has(url); };
  let current = null;             // HTMLAudioElement yang sedang dimainkan
  let onState = () => {};         // panggil balik (bermain / berhenti)

  function stop() {
    if (current) { current.pause(); current = null; }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    onState(false);
  }

  function playUrl(url) {
    return new Promise((resolve, reject) => {
      if (missing.has(url)) return reject(new Error('missing'));
      const a = new Audio(url);
      current = a;
      a.onended = () => { if (current === a) current = null; onState(false); resolve(); };
      a.onerror = () => { missing.add(url); if (current === a) current = null; reject(new Error('missing')); };
      a.play().then(() => onState(true)).catch((e) => { missing.add(url); reject(e); });
    });
  }

  function pickVoice(lang) {
    if (!('speechSynthesis' in window)) return null;
    const voices = speechSynthesis.getVoices();
    const base = lang.split('-')[0];
    return voices.find((v) => v.lang === lang) ||
           voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(base)) || null;
  }

  function speak(text, lang, rate = 0.85) {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) return resolve();
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = rate;
      const v = pickVoice(lang);
      if (v) u.voice = v;
      u.onstart = () => onState(true);
      u.onend = u.onerror = () => { onState(false); resolve(); };
      speechSynthesis.speak(u);
      // Sesetengah pelayar tidak memanggil onend; jangan tersangkut.
      setTimeout(() => { onState(false); resolve(); }, 6000);
    });
  }

  return {
    setStateListener(fn) { onState = fn; },
    stop,
    /** Sebutan huruf oleh guru. */
    async letter(L) {
      stop();
      const url = `audio/huruf/${String(L.id).padStart(2, '0')}-${L.slug}.mp3`;
      try { if (!(await has(url))) throw new Error('missing'); await playUrl(url); }
      catch { await speak(L.ar, 'ar-SA', 0.7); }
    },
    /** Arahan suara dalam bahasa pilihan. */
    async prompt(key, lang) {
      const p = PROMPTS[key];
      if (!p) return;
      stop();
      const url = `audio/arahan/${lang}/${key}.mp3`;
      try { if (!(await has(url))) throw new Error('missing'); await playUrl(url); }
      catch { await speak(p[lang] || p.ms, lang === 'en' ? 'en-US' : 'ms-MY', 0.95); }
    },
    /** Kesan bunyi ringkas tanpa fail (Web Audio). */
    chime(good = true) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        Audio2._ctx = Audio2._ctx || new Ctx();
        const ctx = Audio2._ctx;
        const notes = good ? [660, 880, 1046] : [300, 220];
        notes.forEach((f, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.value = f;
          const t = ctx.currentTime + i * 0.12;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
          o.connect(g).connect(ctx.destination);
          o.start(t);
          o.stop(t + 0.3);
        });
      } catch { /* abaikan */ }
    },
    playBlob(blob) {
      stop();
      return playUrl(URL.createObjectURL(blob)).catch(() => {});
    },
  };
})();

// Sesetengah pelayar memuatkan senarai suara secara tak segerak.
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => {};
