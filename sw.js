/* Baby Name — service worker.
   Il s'installe tout de suite (quelques petits fichiers seulement), ce qui
   rend l'app installable dès la première visite ; les données (13 Mo) sont
   mises en cache au passage, la première fois qu'elles sont chargées.
   Incrémenter CACHE à chaque mise en ligne d'une nouvelle version. */
const CACHE = "babyname-4";
const BASE = ["./", "./index.html", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/logo-marque.png", "./icons/favicon-32.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(BASE.map(u => c.add(u).catch(() => {})))));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if(req.mode === "navigate"){
    // la page : le réseau d'abord, pour recevoir les mises à jour ; le cache hors ligne
    e.respondWith(fetch(req).then(r => {
      const c = r.clone(); caches.open(CACHE).then(x => x.put("./index.html", c)); return r;
    }).catch(() => caches.match("./index.html").then(r => r || caches.match("./"))));
    return;
  }
  // données, drapeaux, icônes : le cache d'abord, rempli au fil de l'eau
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
    if(res.ok){ const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); }
    return res;
  })));
});
