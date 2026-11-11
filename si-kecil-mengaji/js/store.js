/*
 * Simpanan kemajuan dalam localStorage (kekal dalam peranti, tiada pelayan).
 */
const Store = (() => {
  const KEY = 'si-kecil-mengaji:v1';

  const blankLetter = () => ({ heard: 0, traced: 0, quizRight: 0, quizWrong: 0, recOk: 0, recRetry: 0 });

  function fresh() {
    const letters = {};
    LETTERS.forEach((L) => { letters[L.id] = blankLetter(); });
    return { version: 1, settings: { lang: 'ms', limitMin: 10 }, stars: 0, letters, usage: {} };
  }

  let data;
  try {
    data = JSON.parse(localStorage.getItem(KEY)) || fresh();
  } catch { data = fresh(); }
  // Pastikan semua huruf wujud (jika data lama).
  LETTERS.forEach((L) => { data.letters[L.id] = Object.assign(blankLetter(), data.letters[L.id]); });
  data.settings = Object.assign({ lang: 'ms', limitMin: 10 }, data.settings);
  data.usage = data.usage || {};

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* penuh */ } };

  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return {
    get data() { return data; },
    save,
    today,
    letter(id) { return data.letters[id]; },
    bump(id, field, n = 1) { data.letters[id][field] += n; save(); },
    /** Tambah bintang; pulangkan true jika pelekat baharu dibuka. */
    addStars(n = 1) {
      const before = this.stickerCount();
      data.stars += n;
      save();
      return this.stickerCount() > before;
    },
    stickerCount() { return Math.min(STICKERS.length, Math.floor(data.stars / STARS_PER_STICKER)); },
    isMastered(id) {
      const p = data.letters[id];
      return p.heard > 0 && p.traced > 0 && p.quizRight >= 2;
    },
    masteredCount() { return LETTERS.filter((L) => this.isMastered(L.id)).length; },
    /** Ketepatan kuiz 0..1, atau null jika belum cuba. */
    accuracy(id) {
      const p = data.letters[id];
      const t = p.quizRight + p.quizWrong;
      return t ? p.quizRight / t : null;
    },
    weakLetters() {
      return LETTERS
        .map((L) => ({ L, acc: this.accuracy(L.id), p: data.letters[L.id] }))
        .filter((x) => (x.acc !== null && x.acc < 0.6 && x.p.quizWrong >= 2) || x.p.recRetry > x.p.recOk)
        .sort((a, b) => (a.acc ?? 1) - (b.acc ?? 1));
    },
    usedToday() { return data.usage[today()] || 0; },
    addUsage(sec) { const t = today(); data.usage[t] = (data.usage[t] || 0) + sec; save(); },
    lastDays(n = 7) {
      const out = [];
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        out.push({ day: d, key: k, sec: data.usage[k] || 0 });
      }
      return out;
    },
    reset() { const s = data.settings; data = fresh(); data.settings = s; save(); },
  };
})();
