/* Service worker: la app abre sin cobertura y nunca guarda respuestas de error. */
const CACHE = "elenitafit-v5";

/** Pantallas que quedan disponibles sin conexión desde la primera visita. */
const PAGES = ["/", "/hoy", "/entreno", "/comidas", "/citas", "/videos", "/progreso", "/coach", "/coach/agenda", "/coach/plantillas", "/coach/videos"];

async function save(request, response) {
  if (response.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

const cached = (request, options) => caches.match(request, { ignoreVary: true, ...options });

/** Guarda cada pantalla junto con los archivos de Next que necesita para funcionar. */
async function precache() {
  const assets = new Set([
    "/brand/logo-mark.png",
    "/brand/logo-badge.png",
    "/manifest.webmanifest",
    "/icons/192",
    "/icons/512",
  ]);
  await Promise.allSettled(
    PAGES.map(async (page) => {
      const response = await fetch(page, { cache: "reload" });
      if (!response.ok) return;
      const html = await response.clone().text();
      for (const [url] of html.matchAll(/\/_next\/static\/[^"'\\\s)<>]+/g)) assets.add(url.replaceAll("&amp;", "&"));
      await save(page, response);
    }),
  );
  await Promise.allSettled([...assets].map(async (url) => save(url, await fetch(url))));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Pantallas: primero la red; sin conexión, la copia guardada
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          event.waitUntil(save(req, res.clone()));
          return res;
        })
        .catch(async () => (await cached(req, { ignoreSearch: true })) || Response.redirect("/")),
    );
    return;
  }

  // Archivos de Next: su nombre cambia con cada versión, así que la copia siempre vale
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cached(req).then((hit) => hit || fetch(req).then((res) => save(req, res))));
    return;
  }

  // Imágenes y manifiesto: se sirve la copia y se renueva por detrás
  if (url.pathname === "/_next/image" || url.pathname.startsWith("/icons/") || /\.(png|jpe?g|webp|svg|ico|woff2?|webmanifest)$/.test(url.pathname)) {
    const fresh = fetch(req).then((res) => save(req, res));
    event.waitUntil(fresh.catch(() => {}));
    event.respondWith(cached(req).then((hit) => hit || fresh));
  }
});
