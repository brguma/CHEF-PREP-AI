/* ChefPrep (c) 2026 Bruno Machado - BM Engenharia e Consultoria Ltda. Todos os direitos reservados. */
/* v1.9.1 — estratégia network-first para o app:
   - index.html: sempre busca da REDE quando online (atualização automática,
     sem desinstalar, sem ritual de versão); cache só como fallback offline.
   - estáticos (ícones, manifest): cache-first. */
const CACHE = 'chefprep-v1.9.1';
const SHELL = ['./', './index.html', './manifest.webmanifest',
               './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const ehApp = e.request.mode === 'navigate' ||
    url.pathname.endsWith('/index.html') || url.pathname.endsWith('/');
  if (ehApp) {
    // REDE PRIMEIRO: online = versão mais nova sempre; offline = cache
    e.respondWith(
      fetch(e.request).then(resp => {
        const cp = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, cp));
        return resp;
      }).catch(() =>
        caches.match(e.request, { ignoreSearch: true })
          .then(hit => hit || caches.match('./index.html'))
      )
    );
    return;
  }
  // estáticos: cache primeiro
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit ||
      fetch(e.request).then(resp => {
        if (resp.ok && url.origin === self.location.origin) {
          const cp = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, cp));
        }
        return resp;
      })
    )
  );
});
