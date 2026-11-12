/* PYLO — service worker. VERSION suit le moteur (Pilo.VERSION) : la changer
   à chaque mise en ligne, sinon les téléphones gardent l'ancienne page. */
const VERSION = 'pylo-1.4';
const FICHIERS = ['./', './index.html', './manifest.webmanifest', './icone.svg', './icone-192.png', './icone-512.png', './icone-maskable-512.png', './apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FICHIERS)).catch(() => {}));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((cles) => Promise.all(cles.filter((k) => k.startsWith('pylo-') && k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // La page : le réseau d'abord (toujours la dernière version), le cache hors ligne.
    e.respondWith(fetch(req).then((r) => { const c = r.clone(); caches.open(VERSION).then((x) => x.put('./index.html', c)).catch(() => {}); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
