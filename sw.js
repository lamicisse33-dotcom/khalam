/* ÉQUILIBRE — service worker. Bumpe CACHE à chaque déploiement pour forcer la mise à jour. */
const CACHE = 'piliers-v235';
// Ce qui est mis en cache DES L'INSTALLATION : le strict nécessaire pour que le jeu
// démarre et fonctionne hors ligne. Les illustrations d'habillage n'y sont PAS :
// elles se mettent en cache toutes seules à la première utilisation (voir plus bas),
// donc un joueur qui reste en Classique ne les télécharge jamais. C'est tout l'intérêt
// de les avoir sorties d'index.html.
const ASSETS = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
  './icon-180.png','./confidentialite.html','./la-revelation-des-coris.html'];

self.addEventListener('install', e => {
  self.skipWaiting();
  // c.addAll rejette EN BLOC si un seul fichier manque : le cache restait alors vide,
  // et le mode hors-ligne avec. On met en cache fichier par fichier, chacun toléré.
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ASSETS.map(u => c.add(u).catch(()=>{})))).catch(()=>{}));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   // laisse passer Google Fonts & co.
  // HTML (navigation ou fichiers .html) : RÉSEAU D'ABORD → toujours la dernière version quand on est en ligne,
  // cache seulement en secours hors-ligne. Corrige les PWA installées bloquées sur une vieille version.
  const estHTML = req.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  if (estHTML) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }
  // reste (icônes, manifest…) : cache d'abord (rapide + hors-ligne)
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
