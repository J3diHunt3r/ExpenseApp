const CACHE_NAME = "expense-app-v2";
const urlsToCache = [
  "/",
  "/styles.css",
  "/script.js",
  "/manifest.json",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        urlsToCache.map((url) =>
          fetch(url)
            .then((response) => {
              if (response.ok) {
                return cache.put(url, response.clone());
              } else {
                console.error(`Failed to fetch ${url}:`, response.status);
              }
            })
            .catch((err) => console.error(`Error fetching ${url}:`, err))
        )
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Handle API requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      (async () => {
        try {
          // Try fetching from the network
          const networkResponse = await fetch(event.request);
          if (event.request.method === "GET" && networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, responseToCache);
          }
          return networkResponse;
        } catch (error) {
          console.error("API fetch failed, returning cached version if available:", error);
          // Fallback to cache for GET requests
          if (event.request.method === "GET") {
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
              return cachedResponse;
            }
          }
          throw error; // Propagate the error for non-GET requests
        }
      })()
    );
    return;
  }

  // Handle other requests (static assets and navigation)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }
        })
      );
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
