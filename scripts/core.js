// scripts/core.js - Configuration, Auth, and Data Management
export const SUPABASE_URL = 'https://xwoxevuziypkcuplazdu.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3b3hldnV6aXlwa2N1cGxhemR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDUyNDUsImV4cCI6MjA5NDY4MTI0NX0.RTxipT-aTh_dxiOS72onfVfGEUlMOTNfLyOHy_ifWqw';

export let sb;
export let user = null;
export let currentTrip = null;
export let currentPage = 'overview';
export let realtimeChannels = [];
export let isLocalUpdate = false;

export let tripData = {
    overview: {},
    budget: [],
    savings: [],
    logistics: [],
    group: [],
    pendingInvites: [],
    destinations: { main: [], optional: [], other: [], restaurants: [] },
    dayPlans: [],
    sharedExpenses: [],
    packing: [],
    bookings: [],
    documents: [],
    emergencyContacts: [],
    importantInfo: []
};

export let exchangeRate = 20453.95;

// Initialize Supabase
export async function initSupabase() {
    try {
        sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('✅ Supabase initialized');
        return sb;
    } catch (err) {
        console.error('❌ Supabase init failed:', err);
        throw err;
    }
}

// IndexedDB cache for offline support
const DB_NAME = 'TripPlannerCache';
const DB_VERSION = 1;
let db;

export async function initCache() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            console.log('✅ IndexedDB cache ready');
            resolve(db);
        };
        
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('trips')) {
                db.createObjectStore('trips', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('userData')) {
                db.createObjectStore('userData', { keyPath: 'userId' });
            }
        };
    });
}

export async function getCached(storeName, key) {
    if (!db) return null;
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function setCache(storeName, data) {
    if (!db) return;
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.put(data);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Optimistic updates queue
const updateQueue = [];
let isSyncing = false;

export function queueUpdate(update) {
    updateQueue.push(update);
    if (!isSyncing) syncQueue();
}

async function syncQueue() {
    if (updateQueue.length === 0) {
        isSyncing = false;
        return;
    }
    
    isSyncing = true;
    const batch = updateQueue.splice(0, 10); // Process 10 at a time
    
    try {
        await Promise.all(batch.map(update => update()));
        console.log(`✅ Synced ${batch.length} updates`);
    } catch (err) {
        console.error('❌ Sync error:', err);
        updateQueue.unshift(...batch); // Re-queue failed updates
    }
    
    setTimeout(syncQueue, 100);
}
