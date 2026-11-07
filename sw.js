const V="desco-inv-v1";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin!==location.origin&&u.hostname!=="cdnjs.cloudflare.com")return;
  e.respondWith(
    fetch(r).then(res=>{const copy=res.clone();caches.open(V).then(c=>c.put(r,copy));return res})
    .catch(()=>caches.match(r).then(m=>m||(r.mode==="navigate"?caches.match("index.html"):null)||new Response("Offline",{status:503})))
  );
});
