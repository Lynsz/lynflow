const CACHE_VERSION = "lynflow-v1"
const STATIC_CACHE = `${CACHE_VERSION}-static`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`
const OFFLINE_URL = "/offline.html"

const STATIC_ASSETS = [
  "/",
  OFFLINE_URL,
  "/favicon.svg",
  "/site.webmanifest",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  )

  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
  )

  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone()

          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })

          return response
        })
        .catch(async () => {
          const cachedPage = await caches.match(request)

          return cachedPage || caches.match(OFFLINE_URL)
        })
    )

    return
  }

  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".gif") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".webmanifest")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(request).then((response) => {
          const responseClone = response.clone()

          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })

          return response
        })
      })
    )
  }
})
