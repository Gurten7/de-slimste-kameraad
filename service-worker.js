// Naam van de cache (verander dit als je iets wijzigt aan de bestanden)
const cacheName = 'slimste-kameraad-v2';

// Alle bestanden die je wilt cachen voor offline gebruik
const assets = [
  './index.html',
  './?view=edit',
  './?view=display',
  './manifest-edit.json',
  './manifest-display.json',
  './icon-192.png',
  './icon-512.png',
  './timer-sound.mp3',
  './timer-sound-end.mp3',
  './Sound-finale.mp3',
  './DSK.png'
];

// ✅ 1. Bij installatie: voeg alle bovenstaande bestanden toe aan de cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
  // Forceer activatie van de nieuwe service worker
  self.skipWaiting();
});

// ✅ 2. Bij activatie: verwijder oude caches (die een andere naam hebben)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== cacheName) // Verwijder andere versies
          .map(key => caches.delete(key))   // Verwijderen
      );
    })
  );
  // Zorg dat de nieuwe service worker meteen controle krijgt over alle tabs
  self.clients.claim();
});

// ✅ 3. Bij elk fetch-verzoek: probeer eerst de cache te gebruiken (ook met querystrings)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cacheResponse => {
      // Als het bestand in de cache zit, gebruik dat
      if (cacheResponse) {
        return cacheResponse;
      }
      // Zo niet: haal het van het internet
      return fetch(event.request);
    })
  );
});

