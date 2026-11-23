/* Offline shell. IndexedDB data is intentionally never cached or cleared here. */
const CACHE_NAME = 'pancho-gym-shell-v10';
const CORE_ASSETS = [
  './', './index.html', './styles.css', './db.js', './app.js', './manifest.webmanifest',
  './assets/icons/icon.svg', './assets/icons/icon-192.png', './assets/icons/icon-512.png',
  './assets/exercises/squat.svg', './assets/exercises/push-up.svg', './assets/exercises/lat-pulldown.svg',
  './assets/exercises/deadlift.svg', './assets/exercises/lunge.svg', './assets/exercises/plank.svg',
  './assets/exercises/mountain-climber.svg', './assets/exercises/glute-bridge.svg', './assets/exercises/jumping-jacks.svg',
  './assets/exercises/shoulder-press.svg', './assets/exercises/row.svg', './assets/exercises/biceps-curl.svg',
  './assets/exercises/cat-cow.svg', './assets/exercises/treadmill.svg', './assets/exercises/child-pose.svg', './assets/exercises/hip-flexor.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('pancho-gym-shell-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(response => {
      if (response && response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }).catch(() => {
      if (request.mode === 'navigate') return caches.match('./index.html');
      return Response.error();
    });
  }));
});
