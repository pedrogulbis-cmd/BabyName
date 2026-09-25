/* babyName — mise en cache pour l'installation et l'usage hors ligne.
   Incrémenter CACHE à chaque mise en ligne d'une nouvelle version. */
const CACHE = "babyname-2";
const BASE = ["./", "./index.html", "./manifest.webmanifest", "./data/names.js?v=2",
  "./icons/logo.png", "./icons/logo-marque.png", "./icons/favicon-32.png", "./icons/icon-192.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  // la page : le réseau d'abord, pour recevoir les mises à jour
  if(req.mode === "navigate"){
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put("./index.html", c)); return r; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  // le reste (données, drapeaux, icônes) : le cache d'abord
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
    if(res.ok){ const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); }
    return res;
  })));
});
