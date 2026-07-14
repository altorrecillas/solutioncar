'use strict';
// Service worker de la webapp de SolutionCar (generado por tools/build-webapp.js).
// Red primero con caché de reserva: siempre intenta traer la última versión y,
// sin conexión, sirve la última copia buena.
const CACHE = 'sc-webapp-v1.6.5';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) =>
    c.addAll(['./']).then(() =>
      // Extras opcionales: si alguno falta, la instalación no se cae.
      Promise.all(['./manifest.webmanifest', './apple-touch-icon.png', './icon-512.png', './maskable-512.png']
        .map((u) => c.add(u).catch(() => {})))
    )
  ).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then((r) => {
      const copy = r.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return r;
    }).catch(() =>
      caches.match(e.request, { ignoreSearch: true }).then((m) => m || caches.match('./'))
    )
  );
});
