/* 备考 · 离线缓存 */
const CACHE = 'beikao-v4';
const ASSETS = [
  "./",
  "./index.html",
  "./全真模拟6套.html",
  "./冲刺2_复盘与48小时.html",
  "./变式选择题.html",
  "./工商管理全真模拟6套.html",
  "./机考模拟器.html",
  "./第一套卷复盘.html",
  "./经济基础_错题记忆卡.html",
  "./背点选择题.html",
  "./背诵清单.html",
  "./错位点_全真一二三四套.html",
  "./错位点_全真一二套.html",
  "./错题一眼卡.html",
  "./错题重做.html",
  "./manifest.json",
  "./icon-180.png"
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(ASSETS.map((u) => c.add(new Request(u, {cache: 'reload'})))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, {ignoreSearch: true}).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
