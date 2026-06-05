const CACHE_NAME = "the-ink-home-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/assets/The_Ink_Home.webp",
  "/manifest.json"
];

// Install Event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching core publication shell...");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Evicting stale cache version:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Bypass non-GET methods or WebGL/audio assets dynamically synthesized
  if (e.request.method !== "GET" || url.protocol === "chrome-extension:") {
    return;
  }

  // Strategy for API feed calls (e.g. rss2json or backend API) -> Network First, fallback to Cache
  if (url.href.includes("api.rss2json.com") || url.pathname.includes("/api/") || url.href.includes("allorigins")) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log("[Service Worker] Device is offline. Fetching from cache:", url.pathname);
          return caches.match(e.request);
        })
    );
    return;
  }

  // Strategy for other requests (Stale-While-Revalidate for images, fonts, JS, CSS)
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background and update cache asynchronously
        fetch(e.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(e.request, networkResponse);
              });
            }
          })
          .catch(() => {/* Ignore background sync failure when offline */});
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});
