/*
 * Service worker: simpan semua fail dalam cache supaya aplikasi berfungsi
 * tanpa internet. Naikkan VERSION setiap kali fail berubah.
 */
const VERSION = 'skm-v1';
const CORE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/data.js',
  'js/store.js',
  'js/audio.js',
  'js/trace.js',
  'js/mascot.js',
  'js/app.js',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(CORE);
    // Audio dimuatkan satu-satu; fail yang belum wujud diabaikan.
    try {
      const res = await fetch('audio/manifest.json');
      if (res.ok) {
        const files = await res.json();
        await Promise.all(files.map((f) => cache.add(`audio/${f}`).catch(() => {})));
      }
    } catch { /* tiada senarai audio */ }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
    self.clients.claim();
  })());
});

// Cache dahulu, kemudian rangkaian (dan simpan salinan).
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok && !req.headers.has('range')) cache.put(req, res.clone());
      return res;
    } catch {
      if (req.mode === 'navigate') return cache.match('index.html');
      return new Response('', { status: 504 });
    }
  })());
});
