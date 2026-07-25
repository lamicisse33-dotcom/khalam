/* KHALAM.app — VERSION : khalam-site-v4.5 */
const VERSION = "khalam-site-v4.5";
const CACHE = "khalam-" + VERSION;
const SOCLE = ["./", "./index.html", "./manifest.webmanifest"];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SOCLE); }).catch(function () {}));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (cles) {
      return Promise.all(cles.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  const req = e.request;
  if (req.method !== "GET") return;

  const estPage = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");

  if (estPage) {
    // Réseau d'abord : une mise en ligne est visible immédiatement.
    e.respondWith(
      fetch(req).then(function (rep) {
        const copie = rep.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copie); });
        return rep;
      }).catch(function () {
        return caches.match(req).then(function (r) { return r || caches.match("./index.html"); });
      })
    );
    return;
  }

  // Reste (polices, icônes) : cache d'abord.
  e.respondWith(
    caches.match(req).then(function (r) {
      return r || fetch(req).then(function (rep) {
        if (rep.ok && new URL(req.url).origin === self.location.origin) {
          const copie = rep.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copie); });
        }
        return rep;
      });
    }).catch(function () { return Response.error(); })
  );
});
