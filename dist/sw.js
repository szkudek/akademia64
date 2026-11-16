const scope=new URL(self.registration.scope);
const assetsBase=new URL(self.ACADEMY_ASSET_PATH??'./',scope);
importScripts(new URL('offline-assets.js',assetsBase).href);

const prefix='akademia64-offline:'+scope.pathname+':';
const cacheName=prefix+self.ACADEMY_OFFLINE.version;
const shell=new URL('index.html',scope).href;
const manifest=new URL('manifest.webmanifest',scope).href;
const assets=new Set([shell,manifest,...self.ACADEMY_OFFLINE.assets.map(path=>new URL(path,assetsBase).href)]);

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(cacheName).then(cache=>
  cache.addAll([...assets].map(url=>new Request(url,{cache:'reload'})))
 ));
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith(prefix)&&key!==cacheName).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==scope.origin)return;
 const appNavigation=request.mode==='navigate'&&(url.pathname===scope.pathname||url.pathname===new URL(shell).pathname);
 const cachedKey=appNavigation?shell:request.url;
 if(!assets.has(cachedKey))return;
 event.respondWith((async()=>{
  const cache=await caches.open(cacheName);
  return await cache.match(cachedKey)??fetch(request);
 })());
});
