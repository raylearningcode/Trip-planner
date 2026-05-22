// sw.js - Service Worker for PWA and Offline Support
const CACHE_NAME='trip-planner-v1';
const ASSETS=[
    '/',
    '/index.html',
    '/app.js',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.8',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

self.addEventListener('install',e=>{
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache=>{
            console.log('📦 Caching assets');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate',e=>{
    e.waitUntil(
        caches.keys().then(keys=>
            Promise.all(
                keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch',e=>{
    if(e.request.method!=='GET')return;
    
    e.respondWith(
        fetch(e.request)
            .then(response=>{
                if(response.status===200){
                    const clone=response.clone();
                    caches.open(CACHE_NAME).then(cache=>{
                        cache.put(e.request,clone);
                    });
                }
                return response;
            })
            .catch(()=>
                caches.match(e.request).then(cached=>{
                    if(cached)return cached;
                    if(e.request.mode==='navigate'){
                        return caches.match('/index.html');
                    }
                })
            )
    );
});
