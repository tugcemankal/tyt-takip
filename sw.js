// TYT Takip - Service Worker
// Uygulama offline da çalışsın diye tüm dosyaları önbelleğe alır

const CACHE_NAME = 'tyt-takip-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/data.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js'
];

// Kurulum: dosyaları önbelleğe al
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS.filter(a => !a.startsWith('http')));
    })
  );
  self.skipWaiting();
});

// Aktivasyon: eski önbellekleri temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: önce ağdan dene, yoksa önbellekten sun
self.addEventListener('fetch', event => {
  // Firebase ve harici istekleri atlat
  if (event.request.url.includes('firebaseio.com') ||
      event.request.url.includes('googleapis.com') ||
      event.request.url.includes('gstatic.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Başarılı yanıtı önbelleğe kaydet
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Ağ yoksa önbellekten sun
        return caches.match(event.request).then(cached => {
          return cached || caches.match('/index.html');
        });
      })
  );
});
