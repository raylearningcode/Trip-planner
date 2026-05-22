// sw.js - Service Worker for offline support and caching
const CACHE_NAME = 'trip-planner-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/app.js',
    '/scripts/core.js',
    '/scripts/ui.js',
    '/scripts/budget.js',
    '/scripts/map.js',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.8',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install - cache assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 Caching app assets');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    
    e.respondWith(
        fetch(e.request)
            .then((response) => {
                // Clone and cache successful responses
                if (response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, clone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(e.request).then((cached) => {
                    if (cached) return cached;
                    
                    // Return offline page for navigation requests
                    if (e.request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }
                });
            })
    );
});

// Background sync for offline updates
self.addEventListener('sync', (e) => {
    if (e.tag === 'sync-updates') {
        e.waitUntil(syncUpdates());
    }
});

async function syncUpdates() {
    // Get pending updates from IndexedDB
    const db = await openDB();
    const updates = await getAll(db, 'pendingUpdates');
    
    for (const update of updates) {
        try {
            await fetch(update.url, update.options);
            await remove(db, 'pendingUpdates', update.id);
        } catch (err) {
            console.error('Sync failed:', err);
        }
    }
}

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('TripPlannerCache', 1);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function getAll(db, storeName) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const request = tx.objectStore(storeName).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function remove(db, storeName, key) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const request = tx.objectStore(storeName).delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}
