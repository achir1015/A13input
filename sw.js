// 極簡 Service Worker：只為了讓瀏覽器認定這是可安裝的 App，不做離線快取（資料一律即時走雲端）
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',()=>{});
