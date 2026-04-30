var CACHE = 'barter-v2';
var ASSETS = [
  '/barter/',
  '/barter/index.html',
  '/barter/manifest.json',
  '/barter/icons/icon-192.png',
  '/barter/icons/icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if(e.request.method!=='GET') return;
  e.respondWith(
    caches.match(e.request).then(function(cached){
      var net = fetch(e.request).then(function(res){
        if(res.ok) caches.open(CACHE).then(function(c){c.put(e.request,res.clone());});
        return res;
      }).catch(function(){ return cached; });
      return cached || net;
    })
  );
});
