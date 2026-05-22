// VERSION: 2026-05-22-PERFORMANCE-OPTIMIZED
        console.log('🚀 Trip Planner v2026-05-22-PERFORMANCE-OPTIMIZED loading...');
        console.log('⚡ Performance optimizations enabled');
        
        // ========================================
        // PERFORMANCE UTILITIES
        // ========================================
        
        // Virtual Scrolling for large lists
        class VirtualScroller {
            constructor(container, itemHeight, renderItem) {
                this.container = container;
                this.itemHeight = itemHeight;
                this.renderItem = renderItem;
                this.items = [];
                this.visibleItems = new Map();
                this.scrollTop = 0;
            }
            
            setItems(items) {
                this.items = items;
                this.render();
            }
            
            render() {
                const containerHeight = this.container.clientHeight;
                const startIndex = Math.floor(this.scrollTop / this.itemHeight);
                const endIndex = Math.min(
                    startIndex + Math.ceil(containerHeight / this.itemHeight) + 1,
                    this.items.length
                );
                
                // Clear old items
                this.container.innerHTML = '';
                
                // Create spacer for items before viewport
                const topSpacer = document.createElement('div');
                topSpacer.style.height = `${startIndex * this.itemHeight}px`;
                this.container.appendChild(topSpacer);
                
                // Render visible items
                for (let i = startIndex; i < endIndex; i++) {
                    const itemEl = this.renderItem(this.items[i], i);
                    this.container.appendChild(itemEl);
                }
                
                // Create spacer for items after viewport
                const bottomSpacer = document.createElement('div');
                bottomSpacer.style.height = `${(this.items.length - endIndex) * this.itemHeight}px`;
                this.container.appendChild(bottomSpacer);
            }
            
            onScroll(scrollTop) {
                this.scrollTop = scrollTop;
                this.render();
            }
        }
        
        // Debounce function with immediate option
        function debounce(func, wait, immediate = false) {
            let timeout;
            return function executedFunction(...args) {
                const context = this;
                const later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }
        
        // Throttle function for scroll events
        function throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
        
        // Image lazy loading
        function setupLazyLoading() {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img.lazy').forEach(img => {
                imageObserver.observe(img);
            });
        }
        
        // Request Animation Frame wrapper for smooth animations
        const requestFrame = window.requestAnimationFrame || 
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            ((cb) => setTimeout(cb, 16));
        
        // ========================================
        // COMPREHENSIVE ERROR LOGGING
        // ========================================
        console.log('🚀 Script starting...');
        
        // Catch all errors
        window.addEventListener('error', (e) => {
            console.error('❌ GLOBAL ERROR:', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error
            });
            alert('ERROR: ' + e.message + ' at line ' + e.lineno);
        });
        
        // Catch promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('❌ UNHANDLED PROMISE REJECTION:', e.reason);
            alert('PROMISE ERROR: ' + (e.reason?.message || e.reason));
        });
        
        // Check if Supabase loaded
        if (typeof supabase === 'undefined') {
            console.error('❌ Supabase SDK not loaded!');
            alert('ERROR: Supabase SDK failed to load. Check internet connection.');
        } else {
            console.log('✅ Supabase SDK loaded');
        }

        /* ═══════════════════════════════════════════════════════════════════════
           ⚡ UTILITY FUNCTIONS & ENHANCEMENTS
           ═══════════════════════════════════════════════════════════════════════ */

        // Toast Notification System
        class ToastSystem {
            constructor() {
                this.container = null;
                this.init();
            }

            init() {
                if (!document.querySelector('.toast-container')) {
                    this.container = document.createElement('div');
                    this.container.className = 'toast-container';
                    document.body.appendChild(this.container);
                }
            }

            show(message, type = 'info', duration = 4000) {
                const icons = {
                    success: '✅',
                    error: '❌',
                    warning: '⚠️',
                    info: 'ℹ️'
                };

                const toast = document.createElement('div');
                toast.className = `toast toast-${type}`;
                toast.innerHTML = `
                    <span class="toast-icon">${icons[type]}</span>
                    <div class="toast-content">
                        <div class="toast-message">${message}</div>
                    </div>
                    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
                `;

                this.container.appendChild(toast);

                // Auto-remove after duration
                setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateX(400px)';
                    setTimeout(() => toast.remove(), 300);
                }, duration);

                return toast;
            }

            success(message, duration) {
                return this.show(message, 'success', duration);
            }

            error(message, duration) {
                return this.show(message, 'error', duration);
            }

            warning(message, duration) {
                return this.show(message, 'warning', duration);
            }

            info(message, duration) {
                return this.show(message, 'info', duration);
            }
        }

        // Initialize Toast System
        const toast = new ToastSystem();

        // Input Validation Utilities
        const validate = {
            number(value, min = 0, max = Infinity) {
                const num = parseFloat(value);
                if (isNaN(num)) return { valid: false, error: 'Please enter a valid number' };
                if (num < min) return { valid: false, error: `Must be at least ${min}` };
                if (num > max) return { valid: false, error: `Must be at most ${max}` };
                return { valid: true, value: num };
            },

            required(value, fieldName = 'This field') {
                if (!value || value.trim() === '') {
                    return { valid: false, error: `${fieldName} is required` };
                }
                return { valid: true, value: value.trim() };
            },

            email(value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return { valid: false, error: 'Please enter a valid email' };
                }
                return { valid: true, value };
            },

            url(value) {
                try {
                    new URL(value);
                    return { valid: true, value };
                } catch {
                    return { valid: false, error: 'Please enter a valid URL' };
                }
            },

            date(value) {
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                    return { valid: false, error: 'Please enter a valid date' };
                }
                return { valid: true, value: date };
            }
        };

        // Enhanced saveData with quota checking
        function saveDataEnhanced() {
            try {
                const data = JSON.stringify(tripData);
                const sizeKB = new Blob([data]).size / 1024;
                
                if (sizeKB > 5000) { // 5MB warning
                    console.warn(`⚠️ Data size: ${sizeKB.toFixed(2)}KB - approaching localStorage limit`);
                    toast.warning(`Large data size: ${sizeKB.toFixed(0)}KB. Consider archiving old data.`, 6000);
                }
                
                localStorage.setItem('tripData', data);
                
                // Show save indicator briefly
                showSaveIndicator();
                
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    toast.error('Storage full! Please delete some data or clear browser cache.', 8000);
                    console.error('localStorage quota exceeded:', e);
                } else {
                    toast.error('Failed to save data: ' + e.message);
                    console.error('Save error:', e);
                }
            }
        }

        // Save Indicator
        function showSaveIndicator() {
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(16, 185, 129, 0.95);
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                z-index: 10000;
                animation: fadeInScale 0.2s ease;
            `;
            indicator.textContent = '✓ Saved';
            document.body.appendChild(indicator);
            
            setTimeout(() => {
                indicator.style.opacity = '0';
                indicator.style.transform = 'translateY(10px)';
                setTimeout(() => indicator.remove(), 200);
            }, 1500);
        }

        // Debounce utility
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Auto-save with debounce
        const autoSave = debounce(() => {
            saveDataEnhanced();
        }, 1000);

        // Keyboard Shortcuts System
        class KeyboardShortcuts {
            constructor() {
                this.shortcuts = new Map();
                this.init();
            }

            init() {
                document.addEventListener('keydown', (e) => {
                    // Skip if user is typing in input
                    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
                        return;
                    }

                    const key = this.getKeyCombo(e);
                    const handler = this.shortcuts.get(key);
                    
                    if (handler) {
                        e.preventDefault();
                        handler(e);
                    }
                });
            }

            getKeyCombo(e) {
                const parts = [];
                if (e.ctrlKey || e.metaKey) parts.push('ctrl');
                if (e.altKey) parts.push('alt');
                if (e.shiftKey) parts.push('shift');
                parts.push(e.key.toLowerCase());
                return parts.join('+');
            }

            register(combo, handler, description) {
                this.shortcuts.set(combo, handler);
                return this;
            }

            unregister(combo) {
                this.shortcuts.delete(combo);
                return this;
            }

            showHelp() {
                const shortcuts = Array.from(this.shortcuts.keys());
                toast.info('Keyboard shortcuts: ' + shortcuts.join(', '), 6000);
            }
        }

        // Initialize Keyboard Shortcuts
        const kb = new KeyboardShortcuts();

        // Register shortcuts
        kb.register('ctrl+s', (e) => {
            saveDataEnhanced();
            toast.success('Data saved!');
        }, 'Save data');

        kb.register('ctrl+/', () => {
            kb.showHelp();
        }, 'Show shortcuts');

        kb.register('escape', () => {
            // Close any open modals/overlays
            const overlay = document.getElementById('mobileOverlay');
            if (overlay) overlay.style.display = 'none';
        }, 'Close modals');

        // Prevent default Ctrl+S (browser save)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
            }
        });

        // Error Boundary Wrapper
        function safeExecute(fn, context = 'Action') {
            try {
                return fn();
            } catch (error) {
                console.error(`Error in ${context}:`, error);
                toast.error(`${context} failed: ${error.message}`);
                return null;
            }
        }

        // Enhanced localStorage with error handling
        const storage = {
            get(key, defaultValue = null) {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : defaultValue;
                } catch (error) {
                    console.error(`Error reading ${key}:`, error);
                    toast.error(`Failed to load ${key}`);
                    return defaultValue;
                }
            },

            set(key, value) {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (error) {
                    console.error(`Error saving ${key}:`, error);
                    if (error.name === 'QuotaExceededError') {
                        toast.error('Storage full!');
                    } else {
                        toast.error(`Failed to save ${key}`);
                    }
                    return false;
                }
            },

            remove(key) {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (error) {
                    console.error(`Error removing ${key}:`, error);
                    return false;
                }
            },

            clear() {
                try {
                    localStorage.clear();
                    return true;
                } catch (error) {
                    console.error('Error clearing storage:', error);
                    return false;
                }
            }
        };

        // Format currency
        function formatCurrency(amount, currency = 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
            }).format(amount);
        }

        // Format date
        function formatDate(date, format = 'short') {
            const d = typeof date === 'string' ? new Date(date) : date;
            
            const formats = {
                short: { month: 'short', day: 'numeric' },
                medium: { month: 'short', day: 'numeric', year: 'numeric' },
                long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
            };
            
            return d.toLocaleDateString('en-US', formats[format] || formats.medium);
        }

        // Calculate days between dates
        function daysBetween(date1, date2) {
            const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
            const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
            const diffTime = Math.abs(d2 - d1);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // Copy to clipboard
        async function copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                toast.success('Copied to clipboard!');
                return true;
            } catch (error) {
                console.error('Failed to copy:', error);
                toast.error('Failed to copy to clipboard');
                return false;
            }
        }

        // Generate unique ID
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        // Smooth scroll to element
        function scrollToElement(selector, offset = 0) {
            const element = document.querySelector(selector);
            if (element) {
                const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        }

        console.log('✨ Enhanced utilities loaded!');
        
        
        // Supabase Setup
        const SUPABASE_URL = 'https://xwoxevuziypkcuplazdu.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3b3hldnV6aXlwa2N1cGxhemR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDUyNDUsImV4cCI6MjA5NDY4MTI0NX0.RTxipT-aTh_dxiOS72onfVfGEUlMOTNfLyOHy_ifWqw';
        
        console.log('🔧 Initializing Supabase client...');
        let sb;
        try {
            sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('✅ Supabase client created:', sb);
        } catch (err) {
            console.error('❌ Failed to create Supabase client:', err);
            alert('CRITICAL: Cannot initialize Supabase - ' + err.message);
            throw err;
        }
        
        let user = null;
        let currentTrip = null;
        let currentPage = 'overview'; // Track current page/tab
        let realtimeChannels = []; // Store active subscriptions
        let isLocalUpdate = false; // Track our own saves to prevent reload loops

        // Data Structure
        let tripData = {
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

        const defaultBudget = [];

        const defaultLogistics = [];

        let exchangeRate = 20453.95;

        // Enhanced Modal Management System
        const ModalManager = {
            stack: [],
            scrollPosition: 0,

            open(content) {
                // Save scroll position
                this.scrollPosition = window.pageYOffset;
                
                // Add to stack
                this.stack.push('modal');
                
                // Set content
                const modalContent = document.getElementById('modalContent');
                const modalOverlay = document.getElementById('modalOverlay');
                
                if (modalContent && modalOverlay) {
                    modalContent.innerHTML = content;
                    modalOverlay.classList.add('active');
                }
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.top = `-${this.scrollPosition}px`;
                document.body.style.width = '100%';
                
                // Add escape key listener
                document.addEventListener('keydown', this.escapeHandler);
            },

            close() {
                // Remove from stack
                this.stack.pop();
                
                const modalOverlay = document.getElementById('modalOverlay');
                const modalContent = document.getElementById('modalContent');
                
                if (modalOverlay) {
                    modalOverlay.classList.remove('active');
                }
                
                // Clear content immediately
                if (modalContent) {
                    modalContent.innerHTML = '';
                }
                
                // Only restore scroll if no modals are open
                if (this.stack.length === 0) {
                    // Restore body scroll IMMEDIATELY
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    
                    // Restore scroll position
                    window.scrollTo(0, this.scrollPosition);
                    
                    // Remove escape listener
                    document.removeEventListener('keydown', this.escapeHandler);
                    
                    console.log('✅ Modal closed, scroll restored');
                }
            },

            closeAll() {
                this.stack = [];
                this.close();
            },

            escapeHandler(e) {
                if (e.key === 'Escape') {
                    ModalManager.close();
                }
            }
        };

        // Wrapper functions for compatibility
        function showModal(content) {
            ModalManager.open(content);
        }

        function closeModal() {
            ModalManager.close();
        }

        // Handle file input cleanup
        document.addEventListener('change', function(e) {
            if (e.target.type === 'file') {
                // Ensure scroll is restored after file dialog closes
                setTimeout(() => {
                    if (document.body.style.overflow === 'hidden' && ModalManager.stack.length === 0) {
                        console.log('🔧 Fixing stuck body scroll after file dialog');
                        document.body.style.overflow = '';
                        document.body.style.position = '';
                        document.body.style.top = '';
                        document.body.style.width = '';
                    }
                }, 100);
            }
        });

        // Handle mobile overlay
        const mobileOverlay = document.getElementById('mobileOverlay');
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', function() {
                this.classList.remove('active');
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) {
                    sidebar.style.transform = 'translateX(-100%)';
                }
                // Ensure body scroll is restored
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
            });
        }

        // Global cleanup on visibility change (handles tab switches)
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                // Check if we're stuck in no-scroll mode
                if (document.body.style.overflow === 'hidden' && ModalManager.stack.length === 0) {
                    console.log('🔧 Restoring scroll after tab switch');
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                }
            }
        });

        console.log('✅ Enhanced modal management loaded');

        function showSuccessToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `<span style="font-size: 20px;">✅</span><span>${message}</span>`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        function showErrorToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast error';
            toast.innerHTML = `<span style="font-size: 20px;">❌</span><span>${message}</span>`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        // Fetch live exchange rate
        async function fetchExchangeRate() {
            try {
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
                const data = await response.json();
                if (data.rates && data.rates.IDR) {
                    exchangeRate = data.rates.IDR;
                    localStorage.setItem('exchangeRate', exchangeRate);
                    localStorage.setItem('exchangeRateDate', new Date().toISOString());
                    return true;
                }
            } catch (error) {
                console.log('Using cached rate');
            }
            return false;
        }

        // Load cached exchange rate
        function loadExchangeRate() {
            const cached = localStorage.getItem('exchangeRate');
            const cacheDate = localStorage.getItem('exchangeRateDate');
            
            if (cached) {
                exchangeRate = parseFloat(cached);
            }
            
            // Refresh if cache is older than 1 day
            if (!cacheDate || (new Date() - new Date(cacheDate)) > 86400000) {
                fetchExchangeRate();
            }
        }

        // Load/Save Data
        async function loadData() {
            // Load trip details (shared) from trips table
            const { data: trip } = await sb
                .from('trips')
                .select('destination, departure_date, return_date')
                .eq('id', currentTrip)
                .maybeSingle();
            
            if (trip) {
                tripData.overview = {
                    destination: trip.destination || '',
                    departureDate: trip.departure_date || '',
                    returnDate: trip.return_date || ''
                };
            } else {
                // Initialize with empty values if no trip found
                tripData.overview = {
                    destination: '',
                    departureDate: '',
                    returnDate: ''
                };
            }
            
            // Load PERSONAL data from trip_data
            const { data: personalData } = await sb
                .from('trip_data')
                .select('*')
                .eq('trip_id', currentTrip)
                .eq('user_id', user.id);
            
            if (personalData && personalData.length > 0) {
                for (const row of personalData) {
                    if (row.data_type === 'checklist_progress') {
                        tripData.myChecklistProgress = row.data;
                    } else if (row.data_type !== 'personal_notes') {
                        tripData[row.data_type] = row.data;
                    }
                }
            }
            
            // Load SHARED data from shared_trip_data (all members see same)
            const { data: sharedData } = await sb
                .from('shared_trip_data')
                .select('*')
                .eq('trip_id', currentTrip);
            
            if (sharedData && sharedData.length > 0) {
                for (const row of sharedData) {
                    if (row.data_type === 'group') tripData.group = row.data;
                    if (row.data_type === 'destinations') tripData.destinations = row.data;
                    if (row.data_type === 'itinerary') tripData.dayPlans = row.data;
                    if (row.data_type === 'shared_expenses') tripData.sharedExpenses = row.data;
                    if (row.data_type === 'bookings') tripData.bookings = row.data;
                    if (row.data_type === 'todos') tripData.todos = row.data;
                    if (row.data_type === 'shared_checklist') tripData.sharedChecklist = row.data;
                    if (row.data_type === 'documents') tripData.documents = row.data; // LOAD DOCUMENTS!
                }
            }
            
            // Load trip members from database and sync with tripData.group
            const { data: dbMembers } = await sb
                .from('trip_members')
                .select('user_id, role')
                .eq('trip_id', currentTrip);
            
            if (dbMembers && dbMembers.length > 0) {
                // Get profiles separately
                const memberProfiles = await Promise.all(
                    dbMembers.map(async (m) => {
                        const { data: profile } = await sb
                            .from('profiles')
                            .select('username, email')
                            .eq('id', m.user_id)
                            .maybeSingle();
                        return { ...m, profile };
                    })
                );
                
                // Sync database members into tripData.group
                const existingGroup = tripData.group || [];
                
                // Get each member's personal budget
                const memberBudgets = await Promise.all(
                    memberProfiles.map(async (m) => {
                        const { data: personalBudget } = await sb
                            .from('trip_data')
                            .select('data')
                            .eq('trip_id', currentTrip)
                            .eq('user_id', m.user_id)
                            .eq('data_type', 'budget')
                            .maybeSingle();
                        
                        // Calculate total budget
                        const budgetItems = personalBudget?.data || [];
                        console.log(`Member ${m.user_id} budget items:`, budgetItems);
                        const totalIdr = budgetItems.reduce((sum, item) => sum + (item.amount || 0), 0);
                        const totalEur = totalIdr / exchangeRate;
                        console.log(`Member ${m.user_id} totals: IDR=${totalIdr}, EUR=${totalEur}`);
                        
                        return { user_id: m.user_id, budgetIdr: totalIdr, budgetEur: totalEur };
                    })
                );
                
                tripData.group = memberProfiles.map(m => {
                    const memberBudget = memberBudgets.find(b => b.user_id === m.user_id);
                    return {
                        user_id: m.user_id, // Add user_id for removal
                        name: m.profile?.username || m.profile?.email?.split('@')[0] || 'User',
                        email: m.profile?.email || '',
                        confirmed: true,
                        budget: memberBudget?.budgetIdr || 0,
                        budgetEur: memberBudget?.budgetEur || 0,
                        contact: m.profile?.email || '',
                        inviteStatus: m.role === 'owner' ? 'owner' : 'member'
                    };
                });
                
                // Save synced group back to shared data
                await sb.from('shared_trip_data').upsert({
                    trip_id: currentTrip,
                    data_type: 'group',
                    data: tripData.group,
                    last_edited_by: user.id
                }, { onConflict: 'trip_id,data_type' });
            }
            
            // Set defaults if empty
            if (!tripData.budget || tripData.budget.length === 0) tripData.budget = defaultBudget;
            if (!tripData.logistics || tripData.logistics.length === 0) tripData.logistics = defaultLogistics;
            if (!tripData.group) tripData.group = [];
            if (!tripData.pendingInvites) tripData.pendingInvites = [];
            if (!tripData.savings) tripData.savings = [];
            if (!tripData.sharedExpenses) tripData.sharedExpenses = [];
            if (!tripData.packing) tripData.packing = [];
            if (!tripData.bookings) tripData.bookings = [];
            if (!tripData.documents) tripData.documents = []; // ADD THIS
            if (!tripData.todos) tripData.todos = [];
            if (!tripData.sharedChecklist) tripData.sharedChecklist = [];
            if (!tripData.myChecklistProgress) tripData.myChecklistProgress = {};
            if (!tripData.todos) tripData.todos = [];
            if (!tripData.destinations) tripData.destinations = { main: [], optional: [], other: [], restaurants: [] };
            if (!tripData.dayPlans) tripData.dayPlans = [];
            
            // Add owner to group if not present
            if (tripData.group.length === 0 && user) {
                tripData.group.push({
                    name: user.username || user.email.split('@')[0],
                    email: user.email,
                    confirmed: true,
                    budget: 0,
                    budgetEur: 0,
                    contact: user.email,
                    inviteStatus: 'owner',
                    joinedDate: new Date().toISOString()
                });
            }

            const destEl = document.getElementById('destination');
            const depEl = document.getElementById('departureDate');
            const retEl = document.getElementById('returnDate');
            
            if (destEl) destEl.value = tripData.overview.destination || 'Germany (Multi-City)';
            if (depEl) depEl.value = tripData.overview.departureDate || '2027-06-01';
            if (retEl) retEl.value = tripData.overview.returnDate || '2027-06-14';

            renderAll();
            updateAllStats();
            
            // Restore last viewed page
            const savedPage = localStorage.getItem('currentPage');
            if (savedPage && document.getElementById(savedPage)) {
                showPage(savedPage);
            }
        }

        // Sync wrapper for inline onchange handlers (can't use async directly in HTML)
        function saveDataSync() {
            debouncedSave();
        }
        
        // Debounced version for rapid input changes (e.g., typing)
        const debouncedSave = debounce(async () => {
            try {
                await saveData();
            } catch (err) {
                console.error('Save error:', err);
                showErrorToast('Failed to save data');
            }
        }, 500); // 500ms debounce for typing
        
        async function saveData() {
            isLocalUpdate = true;
            
            tripData.overview = {
                destination: document.getElementById('destination').value,
                departureDate: document.getElementById('departureDate').value,
                returnDate: document.getElementById('returnDate').value
            };
            
            try {
                // Batch all saves together
                const personalTypes = ['budget', 'savings', 'logistics', 'packing'];
                const savePromises = [];
                
                // Personal data saves (including checklist progress)
                for (const type of personalTypes) {
                    savePromises.push(
                        sb.from('trip_data').upsert({
                            trip_id: currentTrip,
                            user_id: user.id,
                            data_type: type,
                            data: tripData[type] || [],
                            visibility: 'members'
                        }, { onConflict: 'trip_id,user_id,data_type' })
                    );
                }
                
                // Save personal checklist progress
                savePromises.push(
                    sb.from('trip_data').upsert({
                        trip_id: currentTrip,
                        user_id: user.id,
                        data_type: 'checklist_progress',
                        data: tripData.myChecklistProgress || {},
                        visibility: 'members'
                    }, { onConflict: 'trip_id,user_id,data_type' })
                );
                
                // Shared data saves
                savePromises.push(
                    sb.from('shared_trip_data').upsert({
                        trip_id: currentTrip,
                        data_type: 'group',
                        data: tripData.group || [],
                        last_edited_by: user.id
                    }, { onConflict: 'trip_id,data_type' })
                );
                
                savePromises.push(
                    sb.from('shared_trip_data').upsert({
                        trip_id: currentTrip,
                        data_type: 'destinations',
                        data: tripData.destinations || { main: [], optional: [], other: [], restaurants: [] },
                        last_edited_by: user.id
                    }, { onConflict: 'trip_id,data_type' })
                );
                
                savePromises.push(
                    sb.from('shared_trip_data').upsert({
                        trip_id: currentTrip,
                        data_type: 'itinerary',
                        data: tripData.dayPlans || [],
                        last_edited_by: user.id
                    }, { onConflict: 'trip_id,data_type' })
                );
                
                savePromises.push(
                    sb.from('shared_trip_data').upsert({
                        trip_id: currentTrip,
                        data_type: 'shared_expenses',
                        data: tripData.sharedExpenses || [],
                        last_edited_by: user.id
                    }, { onConflict: 'trip_id,data_type' })
                );
                
                savePromises.push(
                    sb.from('shared_trip_data').upsert({
                        trip_id: currentTrip,
                        data_type: 'bookings',
                        data: tripData.bookings || [],
                        last_edited_by: user.id
                    }, { onConflict: 'trip_id,data_type' })
                );
                
                savePromises.push(
                    sb.from('shared_trip_data').upsert({
                        trip_id: currentTrip,
                        data_type: 'todos',
                        data: tripData.todos || [],
                        last_edited_by: user.id
                    }, { onConflict: 'trip_id,data_type' })
                );
                
                // Save shared checklist template
                savePromises.push(
                    sb.from('shared_trip_data').upsert({
                        trip_id: currentTrip,
                        data_type: 'shared_checklist',
                        data: tripData.sharedChecklist || [],
                        last_edited_by: user.id
                    }, { onConflict: 'trip_id,data_type' })
                );
                
                // Save documents (ADDED!)
                savePromises.push(
                    sb.from('shared_trip_data').upsert({
                        trip_id: currentTrip,
                        data_type: 'documents',
                        data: tripData.documents || [],
                        last_edited_by: user.id
                    }, { onConflict: 'trip_id,data_type' })
                );
                
                savePromises.push(
                    sb.from('trips').update({
                        destination: tripData.overview.destination,
                        departure_date: tripData.overview.departureDate,
                        return_date: tripData.overview.returnDate
                    }).eq('id', currentTrip)
                );
                
                // Execute all saves in parallel
                await Promise.all(savePromises);
                
            } catch (err) {
                console.error('Save error:', err);
                if (typeof toast !== 'undefined') {
                    toast.error('Failed to save: ' + err.message, 5000);
                }
            }
            
            // Extended timeout - all realtime events arrive within 1.5s
            setTimeout(() => {
                isLocalUpdate = false;
            }, 1500);
        }

        // REAL-TIME SUBSCRIPTIONS
        function setupRealtime() {
            // Clean up old subscriptions
            realtimeChannels.forEach(channel => sb.removeChannel(channel));
            realtimeChannels = [];
            
            console.log('🔴 Setting up real-time subscriptions for trip:', currentTrip);
            
            // Subscribe to trips table changes (dates, destination)
            const tripsChannel = sb.channel(`trips:${currentTrip}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'trips',
                    filter: `id=eq.${currentTrip}`
                }, (payload) => {
                    // Only reload if change is from another user
                    if (isLocalUpdate) {
                        console.log('🟡 REALTIME: Skipping own update (trips)');
                        return;
                    }
                    console.log('🔴 REALTIME: Trips changed by another user', payload);
                    showLiveUpdateIndicator();
                    reloadDataPreservingPage();
                })
                .subscribe();
            
            realtimeChannels.push(tripsChannel);
            
            // Subscribe to shared_trip_data changes (destinations, itinerary, bookings, etc.)
            const sharedDataChannel = sb.channel(`shared_data:${currentTrip}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'shared_trip_data',
                    filter: `trip_id=eq.${currentTrip}`
                }, (payload) => {
                    // Check if this is our own update
                    if (isLocalUpdate) {
                        console.log('🟡 REALTIME: Skipping own update (shared_data)');
                        return;
                    }
                    // Also check last_edited_by to be sure
                    if (payload.new?.last_edited_by === user.id && payload.eventType === 'UPDATE') {
                        console.log('🟡 REALTIME: Skipping - we were last editor');
                        return;
                    }
                    console.log('🔴 REALTIME: Shared data changed by another user', payload);
                    showLiveUpdateIndicator();
                    reloadDataPreservingPage();
                })
                .subscribe();
            
            realtimeChannels.push(sharedDataChannel);
            
            // Subscribe to trip_members changes (someone joins/leaves)
            const membersChannel = sb.channel(`members:${currentTrip}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'trip_members',
                    filter: `trip_id=eq.${currentTrip}`
                }, (payload) => {
                    if (isLocalUpdate) {
                        console.log('🟡 REALTIME: Skipping own update (members)');
                        return;
                    }
                    console.log('🔴 REALTIME: Members changed', payload);
                    showLiveUpdateIndicator();
                    reloadDataPreservingPage();
                })
                .subscribe();
            
            realtimeChannels.push(membersChannel);
            
            // Subscribe to notifications
            const notificationsChannel = sb.channel(`notifications:${user.id}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                }, (payload) => {
                    console.log('🔴 REALTIME: New notification', payload);
                    loadNotifications(); // Reload notification bell
                })
                .subscribe();
            
            realtimeChannels.push(notificationsChannel);
            
            console.log('✅ Real-time subscriptions active:', realtimeChannels.length);
        }
        
        async function reloadDataPreservingPage() {
            // Don't reload when viewing another member's data
            if (viewingMemberId) {
                console.log('🟡 REALTIME: Skipping reload (viewing member data)');
                return;
            }
            
            // Debounce rapid changes
            clearTimeout(window.reloadTimer);
            window.reloadTimer = setTimeout(async () => {
                await loadData();
                
                // Re-render based on current page
                renderAll();
                
                // Ensure current page stays active
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById(currentPage).classList.add('active');
                
                console.log('✅ Data reloaded, staying on page:', currentPage);
            }, 800); // 800ms debounce - wait for multiple changes
        }
        
        function showLiveUpdateIndicator() {
            let indicator = document.getElementById('liveIndicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'liveIndicator';
                indicator.style.cssText = `
                    position: fixed;
                    bottom: 100px;
                    left: 20px;
                    background: linear-gradient(135deg, var(--success) 0%, var(--primary) 100%);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 999;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                indicator.innerHTML = '🟢 Synced';
                document.body.appendChild(indicator);
            }
            
            indicator.style.opacity = '0.4';
            
            setTimeout(() => {
                indicator.style.opacity = '0';
            }, 1000);
        }
        
        // QUICK ACTIONS
        function toggleQuickActions() {
            const menu = document.getElementById('quickActionsMenu');
            menu.classList.toggle('active');
        }
        
        // Close quick actions when clicking outside
        document.addEventListener('click', (e) => {
            const fab = document.getElementById('quickActionsFab');
            const menu = document.getElementById('quickActionsMenu');
            if (menu && fab && !fab.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('active');
            }
        });
        
        // WEATHER WIDGET
        async function showWeatherWidget() {
            const destination = document.getElementById('destination').value || 'Berlin';
            const departure = document.getElementById('departureDate').value;
            
            if (!departure) {
                showErrorToast('Please set a departure date first');
                return;
            }
            
            showModal(`
                <div style="max-width: 500px;">
                    <h2 style="margin-bottom: 20px;">🌤️ Weather Forecast</h2>
                    <div style="text-align: center; padding: 40px; background: var(--bg-main); border-radius: 12px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🌤️</div>
                        <h3 style="margin-bottom: 8px;">${destination}</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 20px;">${new Date(departure).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.8;">
                            <p>💡 Tip: Check weather closer to your trip date for accurate forecasts.</p>
                            <p style="margin-top: 12px;">Search: <strong>"${destination} weather ${new Date(departure).toLocaleDateString('en-US', { month: 'long' })}"</strong></p>
                        </div>
                    </div>
                    <button onclick="closeModal()" class="btn btn-primary" style="width: 100%; margin-top: 20px;">Got it</button>
                </div>
            `);
        }
        
        
        // VIEW OTHER MEMBERS' DATA - Instagram-style (switch to their view)
        let viewingMemberId = null; // Track who we're viewing
        let viewingMemberName = ''; // Track their name
        
        async function viewMemberData(memberId) {
            try {
                // Fetch member profile
                const { data: profile, error: profileError } = await sb
                    .from('profiles')
                    .select('username, email')
                    .eq('id', memberId)
                    .maybeSingle();
                
                if (profileError) {
                    console.error('Profile fetch error:', profileError);
                    showErrorToast('Failed to load member profile');
                    return;
                }
                
                viewingMemberName = profile?.username || profile?.email?.split('@')[0] || 'Member';
                viewingMemberId = memberId;
                
                // Fetch their personal data
                const { data: memberData, error: dataError } = await sb
                    .from('trip_data')
                    .select('data_type, data')
                    .eq('trip_id', currentTrip)
                    .eq('user_id', memberId);
                
                if (dataError) {
                    console.error('Data fetch error:', dataError);
                    showErrorToast('Failed to load member data');
                    return;
                }
                
                // Replace tripData temporarily
                window.originalTripData = JSON.parse(JSON.stringify(tripData));
                
                // Build member's tripData
                const memberTripData = {
                    overview: tripData.overview, // Keep shared overview
                    budget: [],
                    savings: [],
                    packing: [],
                    logistics: [],
                    destinations: tripData.destinations, // Keep shared
                    dayPlans: tripData.dayPlans, // Keep shared
                    bookings: tripData.bookings, // Keep shared
                    group: tripData.group, // Keep shared
                    sharedExpenses: tripData.sharedExpenses // Keep shared
                };
                
                // Fill in their personal data
                if (memberData) {
                    memberData.forEach(item => {
                        if (memberTripData.hasOwnProperty(item.data_type)) {
                            memberTripData[item.data_type] = item.data || [];
                        }
                    });
                }
                
                tripData = memberTripData;
                
                // Show viewing banner
                const banner = document.createElement('div');
                banner.id = 'viewingBanner';
                banner.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    color: white;
                    padding: 16px 20px;
                    z-index: 9999;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                `;
                banner.innerHTML = `
                    <div>
                        <strong style="font-size: 16px;">👤 Viewing ${viewingMemberName}'s Trip Data</strong>
                        <div style="font-size: 13px; margin-top: 4px; opacity: 0.9;">Read-only view • All their planning and preparation</div>
                    </div>
                    <button onclick="exitMemberView()" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        ✕ Back to My View
                    </button>
                `;
                document.body.appendChild(banner);
                
                // Adjust content margin - sidebar structure
                const sidebar = document.querySelector('.sidebar');
                const mainContent = document.querySelector('.main-content');
                if (sidebar) sidebar.style.marginTop = '80px';
                if (mainContent) mainContent.style.marginTop = '80px';
                
                // Render their data
                renderAll();
                updateAllStats();
                
                // Make everything readonly (view-only mode)
                setTimeout(() => {
                    document.querySelectorAll('input, textarea').forEach(el => {
                        el.setAttribute('readonly', 'readonly');
                    });
                    document.querySelectorAll('select, button').forEach(el => {
                        if (!el.onclick?.toString().includes('exitMemberView')) {
                            el.setAttribute('disabled', 'disabled');
                        }
                    });
                }, 100);
                
                // Show empty state if no data
                if (!memberData || memberData.length === 0) {
                    showSuccessToast(`${viewingMemberName} hasn't added any personal data yet`);
                }
                
            } catch (err) {
                console.error('Unexpected error in viewMemberData:', err);
                showErrorToast('Something went wrong. Please try again.');
            }
        }
        
        function exitMemberView() {
            // Restore original data
            if (window.originalTripData) {
                tripData = window.originalTripData;
                window.originalTripData = null;
            }
            
            viewingMemberId = null;
            viewingMemberName = '';
            
            // Remove banner
            const banner = document.getElementById('viewingBanner');
            if (banner) banner.remove();
            
            // Reset margins
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            if (sidebar) sidebar.style.marginTop = '0';
            if (mainContent) mainContent.style.marginTop = '0';
            
            // Remove readonly/disabled attributes
            document.querySelectorAll('input, textarea').forEach(el => {
                el.removeAttribute('readonly');
            });
            document.querySelectorAll('select, button').forEach(el => {
                el.removeAttribute('disabled');
            });
            
            // Restore scroll
            document.body.style.overflow = 'auto';
            
            // Re-render own data
            renderAll();
            updateAllStats();
            
            showSuccessToast('Back to your view');
        }
        
        function renderMemberDataType(type, data) {
            if (!data || (Array.isArray(data) && data.length === 0)) {
                return '<p style="color: var(--text-secondary); padding: 20px; text-align: center; background: var(--bg-main); border-radius: 8px;">No data added yet</p>';
            }
            
            if (type === 'budget' && Array.isArray(data)) {
                const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
                const totalEur = total / exchangeRate;
                return `
                    <div style="margin-bottom: 16px; padding: 16px; background: var(--bg-main); border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">Total Budget</div>
                                <div style="font-size: 24px; font-weight: 700; color: var(--primary);">Rp ${total.toLocaleString()}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">EUR Equivalent</div>
                                <div style="font-size: 20px; font-weight: 600; color: var(--success);">€${totalEur.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; font-size: 14px;">
                            <thead><tr style="background: var(--bg-main);">
                                <th style="padding: 10px; text-align: left;">Category</th>
                                <th style="padding: 10px; text-align: left;">Item</th>
                                <th style="padding: 10px; text-align: right;">EUR</th>
                                <th style="padding: 10px; text-align: center;">Priority</th>
                                ${data.some(i => i.notes) ? '<th style="padding: 10px; text-align: left;">Notes</th>' : ''}
                            </tr></thead>
                            <tbody>
                                ${data.map(item => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 10px;">${item.category || '-'}</td>
                                        <td style="padding: 10px;">${item.item || '-'}</td>
                                        <td style="padding: 10px; text-align: right; font-weight: 600;">€${((item.amount || 0) / exchangeRate).toFixed(2)}</td>
                                        <td style="padding: 10px; text-align: center;">
                                            <span style="padding: 4px 8px; background: ${item.priority === 'MUST' ? 'rgba(239, 68, 68, 0.1)' : item.priority === 'Flexible' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)'}; color: ${item.priority === 'MUST' ? 'var(--danger)' : item.priority === 'Flexible' ? 'var(--warning)' : 'var(--primary)'}; border-radius: 4px; font-size: 11px; font-weight: 600;">
                                                ${item.priority || 'MUST'}
                                            </span>
                                        </td>
                                        ${item.notes ? `<td style="padding: 10px; color: var(--text-secondary); font-size: 13px;">${item.notes}</td>` : data.some(i => i.notes) ? '<td></td>' : ''}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            } else if (type === 'savings' && Array.isArray(data)) {
                const totalTarget = data.reduce((sum, item) => sum + (item.target || 0), 0);
                const totalActual = data.reduce((sum, item) => sum + (item.actual || 0), 0);
                const progressPct = totalTarget > 0 ? (totalActual / totalTarget * 100).toFixed(1) : 0;
                
                return `
                    <div style="margin-bottom: 16px; padding: 16px; background: var(--bg-main); border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div>
                                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">Total Progress</div>
                                <div style="font-size: 20px; font-weight: 700;">${progressPct}%</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">Saved</div>
                                <div style="font-size: 18px; font-weight: 600; color: var(--success);">Rp ${totalActual.toLocaleString()} / ${totalTarget.toLocaleString()}</div>
                            </div>
                        </div>
                        <div style="background: var(--bg-hover); border-radius: 8px; height: 8px; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, var(--success) 0%, var(--primary) 100%); height: 100%; width: ${Math.min(progressPct, 100)}%; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                    <table style="width: 100%; font-size: 14px;">
                        <thead><tr style="background: var(--bg-main);">
                            <th style="padding: 10px; text-align: left;">Month</th>
                            <th style="padding: 10px; text-align: right;">Target</th>
                            <th style="padding: 10px; text-align: right;">Actual</th>
                            <th style="padding: 10px; text-align: center;">Status</th>
                        </tr></thead>
                        <tbody>
                            ${data.map(item => {
                                const achieved = (item.actual || 0) >= (item.target || 0);
                                return `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 10px;">${item.month || '-'}</td>
                                        <td style="padding: 10px; text-align: right;">Rp ${(item.target || 0).toLocaleString()}</td>
                                        <td style="padding: 10px; text-align: right; font-weight: 600; color: ${achieved ? 'var(--success)' : 'var(--text-primary)'};">Rp ${(item.actual || 0).toLocaleString()}</td>
                                        <td style="padding: 10px; text-align: center; font-size: 20px;">${achieved ? '✅' : '⏳'}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                `;
            } else if (type === 'packing' && Array.isArray(data)) {
                return data.map(cat => `
                    <div style="margin-bottom: 16px; padding: 16px; background: var(--bg-main); border-radius: 8px;">
                        <div style="font-weight: 700; margin-bottom: 12px; font-size: 15px; color: var(--primary);">${cat.category || 'Category'}</div>
                        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                            ${(cat.items || []).map(item => `<li style="color: var(--text-primary);">${item}</li>`).join('')}
                        </ul>
                    </div>
                `).join('');
            } else if (type === 'logistics') {
                // Handle logistics as text or structured data
                if (typeof data === 'string') {
                    return `<div style="padding: 16px; background: var(--bg-main); border-radius: 8px; white-space: pre-wrap; line-height: 1.6;">${data}</div>`;
                } else if (Array.isArray(data)) {
                    return data.map(item => `
                        <div style="margin-bottom: 12px; padding: 16px; background: var(--bg-main); border-radius: 8px;">
                            ${typeof item === 'string' ? item : JSON.stringify(item, null, 2)}
                        </div>
                    `).join('');
                }
            }
            
            // Fallback for unknown types
            return `<div style="padding: 16px; background: var(--bg-main); border-radius: 8px;"><pre style="white-space: pre-wrap; margin: 0;">${JSON.stringify(data, null, 2)}</pre></div>`;
        }
        
        // EXPORT TO PDF
        async function exportToPDF() {
            const tripName = document.getElementById('destination').value || 'My Trip';
            const departure = document.getElementById('departureDate').value;
            const returnDate = document.getElementById('returnDate').value;
            
            // Create printable content
            let content = `
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="font-size: 36px; color: #6366f1; margin-bottom: 8px;">✈️ ${tripName}</h1>
                        <p style="font-size: 18px; color: #64748b;">
                            ${departure ? new Date(departure).toLocaleDateString() : 'Date TBD'} - 
                            ${returnDate ? new Date(returnDate).toLocaleDateString() : 'Date TBD'}
                        </p>
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                        <h2 style="border-bottom: 2px solid #6366f1; padding-bottom: 8px; margin-bottom: 16px;">📍 Destinations</h2>
            `;
            
            // Add destinations
            ['main', 'optional', 'other'].forEach(type => {
                const dests = tripData.destinations[type] || [];
                if (dests.length > 0) {
                    content += `<h3 style="margin-top: 16px; color: #64748b;">${type.charAt(0).toUpperCase() + type.slice(1)} Destinations</h3><ul>`;
                    dests.forEach(d => {
                        content += `<li style="margin: 8px 0;">${d.city}, ${d.country}${d.notes ? ` - ${d.notes}` : ''}</li>`;
                    });
                    content += `</ul>`;
                }
            });
            
            content += `</div><div style="margin-bottom: 30px;">
                        <h2 style="border-bottom: 2px solid #6366f1; padding-bottom: 8px; margin-bottom: 16px;">🗓️ Itinerary</h2>`;
            
            // Add itinerary
            if (tripData.dayPlans && tripData.dayPlans.length > 0) {
                tripData.dayPlans.forEach((day, idx) => {
                    content += `
                        <div style="margin-bottom: 20px;">
                            <h3 style="color: #6366f1;">Day ${idx + 1}${day.date ? ` - ${new Date(day.date).toLocaleDateString()}` : ''}</h3>
                            <p style="font-weight: 600; margin: 4px 0;">📍 ${day.city || 'Location TBD'}</p>
                            <p style="margin: 4px 0;">${day.activities || 'No activities planned yet'}</p>
                        </div>
                    `;
                });
            } else {
                content += `<p style="color: #64748b;">No itinerary planned yet.</p>`;
            }
            
            content += `</div><div style="margin-bottom: 30px;">
                        <h2 style="border-bottom: 2px solid #6366f1; padding-bottom: 8px; margin-bottom: 16px;">🎫 Bookings</h2>`;
            
            // Add bookings
            if (tripData.bookings && tripData.bookings.length > 0) {
                content += `<table style="width: 100%; border-collapse: collapse;">
                    <thead><tr style="background: #f1f5f9;">
                        <th style="padding: 8px; text-align: left; border: 1px solid #e2e8f0;">Type</th>
                        <th style="padding: 8px; text-align: left; border: 1px solid #e2e8f0;">Name</th>
                        <th style="padding: 8px; text-align: left; border: 1px solid #e2e8f0;">Date</th>
                        <th style="padding: 8px; text-align: left; border: 1px solid #e2e8f0;">Confirmation</th>
                    </tr></thead><tbody>`;
                
                tripData.bookings.forEach(b => {
                    content += `
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">${b.type}</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">${b.name}</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">${b.datetime ? new Date(b.datetime).toLocaleDateString() : 'TBD'}</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">${b.confirmation || '-'}</td>
                        </tr>
                    `;
                });
                
                content += `</tbody></table>`;
            } else {
                content += `<p style="color: #64748b;">No bookings yet.</p>`;
            }
            
            content += `
                    </div>
                    <div style="text-align: center; margin-top: 60px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #94a3b8; font-size: 14px;">
                        Generated by Trip Planner Pro • ${new Date().toLocaleDateString()}
                    </div>
                </div>
            `;
            
            // Open in new window for printing
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${tripName} - Trip Itinerary</title>
                    <style>
                        @media print {
                            button { display: none; }
                        }
                    </style>
                </head>
                <body>
                    ${content}
                    <div style="text-align: center; margin: 40px 0;">
                        <button onclick="window.print()" style="background: #6366f1; color: white; padding: 12px 32px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">
                            🖨️ Print / Save as PDF
                        </button>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            
            showSuccessToast('Opening printable itinerary...');
        }

        async function onTripDateChange() {
            const oldDeparture = tripData.overview.departureDate;
            const oldReturn = tripData.overview.returnDate;
            
            await saveData();
            renderAll();
            updateAllStats();
            
            const newDeparture = document.getElementById('departureDate').value;
            const newReturn = document.getElementById('returnDate').value;
            
            // Notify if dates actually changed
            if (oldDeparture !== newDeparture || oldReturn !== newReturn) {
                await notifyMembersAboutChange('trip_dates_changed', {
                    departure: newDeparture,
                    return: newReturn
                });
            }
        }
        
        async function onDestinationChange() {
            const oldDest = tripData.overview.destination;
            await saveData();
            renderAll();
            
            const newDest = document.getElementById('destination').value;
            if (oldDest !== newDest && newDest.trim()) {
                await notifyMembersAboutChange('destination_changed', {
                    destination: newDest
                });
            }
            
            // Fetch weather for new destination
            fetchWeather();
        }
        function showPage(pageId) {
            currentPage = pageId;
            localStorage.setItem('currentPage', pageId); // Save current page
            
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.bottom-nav-item').forEach(n => n.classList.remove('active'));
            
            document.getElementById(pageId).classList.add('active');
            
            // Update sidebar nav
            const sidebarNav = document.querySelector(`.nav-item[onclick*="'${pageId}'"]`);
            if (sidebarNav) sidebarNav.classList.add('active');
            
            // Update bottom nav
            const bottomNav = document.querySelector(`.bottom-nav-item[data-page="${pageId}"]`);
            if (bottomNav) bottomNav.classList.add('active');

            if (window.innerWidth <= 1024) toggleSidebar();
            
            // Lazy load map with Leaflet library
            if (pageId === 'map' && !window.mapInitialized) {
                if (typeof window.loadLeaflet === 'function') {
                    window.loadLeaflet().then(() => {
                        initMap();
                    }).catch(err => {
                        console.error('Failed to load Leaflet:', err);
                        toast.error('Failed to load map library');
                    });
                } else {
                    // Fallback if already loaded
                    initMap();
                }
            }
            
            // Lazy load images when page becomes active
            if (document.getElementById(pageId)) {
                requestFrame(() => setupLazyLoading());
            }
        }

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.querySelector('.mobile-overlay');
            
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
            
            // Manage body scroll
            if (sidebar.classList.contains('open')) {
                // Opening sidebar - prevent scroll
                ModalManager.scrollPosition = window.pageYOffset;
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.top = `-${ModalManager.scrollPosition}px`;
                document.body.style.width = '100%';
            } else {
                // Closing sidebar - restore scroll
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, ModalManager.scrollPosition);
            }
        }

        // Budget Functions
        function addBudgetItem() {
            tripData.budget.push({ category: '', item: '', amount: 0, amountEur: 0, priority: 'MUST', notes: '' });
            renderBudgetTable();
            saveData().then(() => reloadMemberBudgets());
        }

        async function deleteBudgetItem(idx, btn) {
            if (btn.textContent === 'Delete') {
                btn.textContent = 'Confirm?';
                btn.style.background = '#dc2626';
                setTimeout(() => {
                    if (btn.textContent === 'Confirm?') {
                        btn.textContent = 'Delete';
                        btn.style.background = '';
                    }
                }, 3000);
            } else {
                isLocalUpdate = true;
                tripData.budget.splice(idx, 1);
                renderBudgetTable();
                updateAllStats();
                await saveData();
                await reloadMemberBudgets();
                setTimeout(() => { isLocalUpdate = false; }, 500);
            }
        }

        function renderBudgetTable() {
            const tbody = document.getElementById('budgetTableBody');
            tbody.innerHTML = '';

            tripData.budget.forEach((item, idx) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="text" value="${item.category}" onchange="tripData.budget[${idx}].category = this.value; saveDataSync()"></td>
                    <td><input type="text" value="${item.item}" onchange="tripData.budget[${idx}].item = this.value; saveDataSync()"></td>
                    <td>
                        <input type="number" value="${item.amountEur || 0}" step="0.01" style="width: 100px;" onchange="updateBudgetEur(${idx}, this.value)">
                        <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${formatCurrency(item.amount || 0)}</div>
                    </td>
                    <td>
                        <select onchange="tripData.budget[${idx}].priority = this.value; saveDataSync(); updateAllStats()">
                            <option value="MUST" ${item.priority === 'MUST' ? 'selected' : ''}>MUST</option>
                            <option value="Flexible" ${item.priority === 'Flexible' ? 'selected' : ''}>Flexible</option>
                            <option value="Optional" ${item.priority === 'Optional' ? 'selected' : ''}>Optional</option>
                        </select>
                    </td>
                    <td><textarea oninput="autoResize(this); tripData.budget[${idx}].notes = this.value; saveData()">${item.notes}</textarea></td>
                    <td><button class="btn btn-danger btn-sm" onclick="deleteBudgetItem(${idx}, this)">Delete</button></td>
                `;
                tbody.appendChild(row);
            });
        }

        function updateBudgetEur(idx, eurValue) {
            const eur = parseFloat(eurValue) || 0;
            tripData.budget[idx].amountEur = eur;
            tripData.budget[idx].amount = Math.round(eur * exchangeRate);
            saveData().then(() => {
                // Reload member budgets to update group display
                reloadMemberBudgets();
            });
            renderBudgetTable();
            updateAllStats();
        }
        
        async function reloadMemberBudgets() {
            // Reload all members and their budgets
            const { data: members } = await sb
                .from('trip_members')
                .select('user_id, role, joined_at')
                .eq('trip_id', currentTrip)
                .order('joined_at', { ascending: true });
            
            if (!members) return;
            
            const memberProfiles = await Promise.all(
                members.map(async (m) => {
                    const { data: profile } = await sb
                        .from('profiles')
                        .select('username, email')
                        .eq('id', m.user_id)
                        .maybeSingle();
                    return { ...m, profile };
                })
            );
            
            // Get each member's personal budget
            const memberBudgets = await Promise.all(
                memberProfiles.map(async (m) => {
                    const { data: personalBudget } = await sb
                        .from('trip_data')
                        .select('data')
                        .eq('trip_id', currentTrip)
                        .eq('user_id', m.user_id)
                        .eq('data_type', 'budget')
                        .maybeSingle();
                    
                    // Calculate total budget
                    const budgetItems = personalBudget?.data || [];
                    console.log(`Reload - Member ${m.user_id} budget items:`, budgetItems);
                    const totalIdr = budgetItems.reduce((sum, item) => sum + (item.amount || 0), 0);
                    const totalEur = totalIdr / exchangeRate;
                    console.log(`Reload - Member ${m.user_id} totals: IDR=${totalIdr}, EUR=${totalEur}`);
                    
                    return { user_id: m.user_id, budgetIdr: totalIdr, budgetEur: totalEur };
                })
            );
            
            // Save existing group to preserve contact/confirmed status
            const oldGroup = tripData.group || [];
            
            // Update tripData.group with new budgets
            tripData.group = memberProfiles.map(m => {
                const memberBudget = memberBudgets.find(b => b.user_id === m.user_id);
                const existingMember = oldGroup.find(g => g.user_id === m.user_id);
                return {
                    user_id: m.user_id,
                    name: m.profile?.username || m.profile?.email?.split('@')[0] || 'User',
                    email: m.profile?.email || '',
                    budget: memberBudget?.budgetIdr || 0,
                    budgetEur: memberBudget?.budgetEur || 0,
                    contact: existingMember?.contact || '',
                    confirmed: existingMember?.confirmed || false,
                    inviteStatus: m.role === 'owner' ? 'owner' : 'member'
                };
            });
            
            renderGroupMembers();
            updateGroupStats();
        }

        function sortBudgetByPriority() {
            const order = { 'MUST': 1, 'Flexible': 2, 'Optional': 3 };
            tripData.budget.sort((a, b) => order[a.priority] - order[b.priority]);
            renderBudgetTable();
            saveData();
        }

        function sortBudgetByAmount() {
            tripData.budget.sort((a, b) => (b.amountEur || 0) - (a.amountEur || 0));
            renderBudgetTable();
            saveData();
        }

        function convertQuick() {
            const eur = parseFloat(document.getElementById('quickEur').value) || 0;
            const idr = Math.round(eur * exchangeRate);
            document.getElementById('quickIdr').value = formatCurrency(idr);
        }

        async function refreshRate() {
            const btn = event.target;
            btn.disabled = true;
            btn.textContent = '⏳';
            
            const success = await fetchExchangeRate();
            
            if (success) {
                updateRateDisplay();
                renderBudgetTable();
                updateAllStats();
                btn.textContent = '✓';
                setTimeout(() => {
                    btn.textContent = '🔄 Refresh';
                    btn.disabled = false;
                }, 2000);
            } else {
                btn.textContent = '✕ Failed';
                setTimeout(() => {
                    btn.textContent = '🔄 Refresh';
                    btn.disabled = false;
                }, 2000);
            }
        }

        function updateRateDisplay() {
            const display = document.getElementById('rateDisplay');
            if (display) {
                display.value = `1 EUR = Rp ${exchangeRate.toFixed(2)}`;
            }
        }

        // Savings Functions
        function addSavingsEntry() {
            tripData.savings.push({ month: new Date().toISOString().slice(0, 7), target: 0, actual: 0 });
            renderSavingsTable();
            saveData();
        }

        async function deleteSavingsEntry(idx, btn) {
            if (btn.textContent === 'Delete') {
                btn.textContent = 'Confirm?';
                btn.style.background = '#dc2626';
                setTimeout(() => { if (btn.textContent === 'Confirm?') { btn.textContent = 'Delete'; btn.style.background = ''; } }, 3000);
            } else {
                isLocalUpdate = true;
                tripData.savings.splice(idx, 1);
                renderSavingsTable();
                updateAllStats();
                await saveData();
                setTimeout(() => { isLocalUpdate = false; }, 500);
            }
        }

        function renderSavingsTable() {
            const tbody = document.getElementById('savingsTableBody');
            tbody.innerHTML = '';

            let cumulative = 0;
            tripData.savings.forEach((item, idx) => {
                cumulative += item.actual || 0;
                const status = (item.actual || 0) >= (item.target || 0);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="month" value="${item.month}" onchange="tripData.savings[${idx}].month = this.value; saveDataSync()"></td>
                    <td><input type="text" value="${formatNumberInput(item.target)}" onchange="tripData.savings[${idx}].target = parseNumber(this.value); saveDataSync()"></td>
                    <td><input type="text" value="${formatNumberInput(item.actual)}" onchange="tripData.savings[${idx}].actual = parseNumber(this.value); saveDataSync(); renderSavingsTable(); updateAllStats()"></td>
                    <td>${formatCurrency(cumulative)}</td>
                    <td><span class="badge badge-${status ? 'success' : 'warning'}">${status ? '✅ On Track' : '⚠️ Behind'}</span></td>
                    <td><button class="btn btn-danger btn-sm" onclick="deleteSavingsEntry(${idx}, this)">Delete</button></td>
                `;
                tbody.appendChild(row);
            });
        }

        // Bookings Functions
        function addBooking() {
            tripData.bookings.push({ type: 'Flight', name: '', confirmation: '', datetime: '', costEur: 0, status: 'Pending', notes: '' });
            renderBookings();
            saveData();
        }
        
        async function onBookingNameChange(idx, newName) {
            const oldName = tripData.bookings[idx].name;
            tripData.bookings[idx].name = newName;
            
            // Notify if name was just filled (meaningful booking added)
            if (!oldName && newName.trim()) {
                await saveData();
                await notifyMembersAboutChange('booking_added', {
                    type: tripData.bookings[idx].type,
                    name: newName
                });
            } else {
                await saveData();
            }
        }

        async function deleteBooking(idx, btn) {
            if (btn.textContent === 'Delete') {
                btn.textContent = 'Confirm?';
                btn.style.background = '#dc2626';
                setTimeout(() => { if (btn.textContent === 'Confirm?') { btn.textContent = 'Delete'; btn.style.background = ''; } }, 3000);
            } else {
                isLocalUpdate = true; // Prevent real-time reload
                tripData.bookings.splice(idx, 1);
                await saveData();
                renderBookings();
                setTimeout(() => { isLocalUpdate = false; }, 500); // Reset after save completes
            }
        }

        function renderBookings() {
            const tbody = document.getElementById('bookingsTableBody');
            tbody.innerHTML = '';

            tripData.bookings.forEach((booking, idx) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <select onchange="tripData.bookings[${idx}].type = this.value; saveDataSync()">
                            ${['Flight', 'Hotel', 'Train', 'Bus', 'Activity', 'Restaurant', 'Other'].map(t => 
                                `<option ${booking.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                        </select>
                    </td>
                    <td><input type="text" value="${booking.name}" onchange="onBookingNameChange(${idx}, this.value)"></td>
                    <td><input type="text" value="${booking.confirmation}" onchange="tripData.bookings[${idx}].confirmation = this.value; saveDataSync()"></td>
                    <td><input type="datetime-local" value="${booking.datetime}" onchange="tripData.bookings[${idx}].datetime = this.value; saveDataSync()"></td>
                    <td><input type="number" value="${booking.costEur || 0}" step="0.01" onchange="tripData.bookings[${idx}].costEur = parseFloat(this.value); saveDataSync()"></td>
                    <td>
                        <select onchange="tripData.bookings[${idx}].status = this.value; saveDataSync()">
                            ${['Confirmed', 'Pending', 'Cancelled'].map(s => 
                                `<option ${booking.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                        </select>
                    </td>
                    <td><textarea oninput="autoResize(this); tripData.bookings[${idx}].notes = this.value; saveData()">${booking.notes}</textarea></td>
                    <td><button class="btn btn-danger btn-sm" onclick="deleteBooking(${idx}, this)">Delete</button></td>
                `;
                tbody.appendChild(row);
            });
            
            // Render documents
            renderDocuments();
        }

        // Document Management Functions
        let currentDocFilter = 'all';
        let uploadCounter = 0; // For unique IDs

        async function handleDocumentUpload(event) {
            const files = event.target.files;
            if (!files || files.length === 0) {
                console.log('No files selected');
                return;
            }

            console.log(`📤 Starting upload of ${files.length} file(s)`);

            // Validate all files first
            const validFiles = [];
            for (const file of files) {
                // Increased to 50MB with Supabase Storage!
                if (file.size > 50 * 1024 * 1024) {
                    toast.error(`${file.name} is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 50MB per file.`);
                } else {
                    validFiles.push(file);
                }
            }

            if (validFiles.length === 0) {
                toast.warning('No valid files to upload');
                event.target.value = '';
                return;
            }

            // Ask for category ONCE for all files
            const category = await selectDocumentCategory();
            if (!category) {
                console.log('Category selection cancelled');
                event.target.value = '';
                return;
            }

            console.log(`📁 Category selected: ${category}`);
            toast.info(`Uploading ${validFiles.length} file(s) to cloud storage...`);

            // Process all files
            const uploadedDocs = [];
            for (const file of validFiles) {
                try {
                    console.log(`📄 Processing: ${file.name}`);
                    
                    // Check if filename already exists in this category
                    const existingDoc = tripData.documents.find(d => 
                        d.name === file.name && 
                        d.category === category
                    );
                    
                    let finalFileName = file.name;
                    
                    if (existingDoc) {
                        console.log(`⚠️ Duplicate filename detected: ${file.name}`);
                        
                        // Ask user what to do
                        const action = await handleDuplicateFile(file.name);
                        
                        if (action === 'cancel') {
                            console.log('User cancelled upload for:', file.name);
                            toast.info(`Skipped ${file.name}`);
                            continue;
                        } else if (action === 'rename') {
                            // Auto-rename with timestamp
                            const timestamp = Date.now();
                            const nameParts = file.name.split('.');
                            const ext = nameParts.pop();
                            const baseName = nameParts.join('.');
                            finalFileName = `${baseName}_${timestamp}.${ext}`;
                            console.log(`✏️ Renamed to: ${finalFileName}`);
                        } else if (action === 'replace') {
                            // Delete old document first
                            console.log('🔄 Replacing existing document');
                            if (existingDoc.storagePath) {
                                await sb.storage.from('trip-documents').remove([existingDoc.storagePath]);
                            }
                            tripData.documents = tripData.documents.filter(d => d.id !== existingDoc.id);
                        }
                    }
                    
                    console.log(`📤 Uploading to Supabase Storage: ${finalFileName}`);
                    
                    // Generate unique storage path
                    uploadCounter++;
                    const timestamp = Date.now();
                    const sanitizedName = finalFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
                    const storagePath = `${currentTrip}/${category}/${timestamp}_${uploadCounter}_${sanitizedName}`;
                    
                    // Upload to Supabase Storage
                    const { data: uploadData, error: uploadError } = await sb.storage
                        .from('trip-documents')
                        .upload(storagePath, file, {
                            cacheControl: '3600',
                            upsert: false
                        });
                    
                    if (uploadError) {
                        console.error(`❌ Upload error for ${finalFileName}:`, uploadError);
                        
                        // Handle specific duplicate error from Supabase
                        if (uploadError.message && uploadError.message.includes('already exists')) {
                            toast.error(`${finalFileName} already exists. Please try again with a different name.`);
                        } else {
                            toast.error(`Failed to upload ${finalFileName}: ${uploadError.message}`);
                        }
                        continue;
                    }
                    
                    console.log(`✅ Uploaded to storage:`, uploadData.path);
                    
                    // Get SIGNED URL for private bucket (expires in 1 year)
                    const { data: urlData, error: urlError } = await sb.storage
                        .from('trip-documents')
                        .createSignedUrl(storagePath, 31536000); // 1 year in seconds
                    
                    if (urlError) {
                        console.error('❌ Error creating signed URL:', urlError);
                        toast.error('Failed to create file URL');
                        continue;
                    }
                    
                    // Create document metadata
                    const doc = {
                        id: `${timestamp}_${uploadCounter}_${Math.random().toString(36).substr(2, 9)}`,
                        name: finalFileName,
                        category: category,
                        type: file.type,
                        size: file.size,
                        uploadedAt: new Date().toISOString(),
                        uploadedBy: user?.username || user?.email || 'Unknown',
                        storagePath: storagePath, // Path in Supabase Storage
                        signedUrl: urlData.signedUrl // Signed URL to view/download
                    };

                    uploadedDocs.push(doc);
                    console.log(`✅ Created metadata for: ${doc.name} (${(doc.size / 1024).toFixed(1)}KB)`);
                    
                } catch (error) {
                    console.error(`❌ Error processing ${file.name}:`, error);
                    toast.error(`Failed to process ${file.name}`);
                }
            }

            if (uploadedDocs.length === 0) {
                toast.error('No documents were uploaded successfully');
                event.target.value = '';
                return;
            }

            // Add all documents to tripData
            tripData.documents.push(...uploadedDocs);
            console.log(`✅ Added ${uploadedDocs.length} documents. Total: ${tripData.documents.length}`);

            // Save metadata to database
            try {
                await saveData();
                console.log('✅ Saved metadata to database');
            } catch (error) {
                console.error('❌ Save error:', error);
                toast.error('Failed to save document metadata');
                
                // Rollback: Delete uploaded files from storage
                for (const doc of uploadedDocs) {
                    await sb.storage.from('trip-documents').remove([doc.storagePath]);
                }
                tripData.documents = tripData.documents.filter(d => !uploadedDocs.includes(d));
                event.target.value = '';
                return;
            }
            
            // Render documents immediately
            renderDocuments();
            console.log('✅ Documents rendered');
            
            // Show success message
            if (uploadedDocs.length === 1) {
                toast.success(`${uploadedDocs[0].name} uploaded to cloud storage!`);
            } else {
                toast.success(`${uploadedDocs.length} documents uploaded to cloud storage!`);
            }
            
            // Reset input
            event.target.value = '';
            
            console.log(`🎉 Upload complete! Total documents: ${tripData.documents.length}`);
        }

        function selectDocumentCategory() {
            return new Promise(resolve => {
                showModal(`
                    <h2 style="margin-bottom: 20px;">Select Document Category</h2>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <button class="btn btn-primary" onclick="window.selectCategory('flights')">✈️ Flights</button>
                        <button class="btn btn-primary" onclick="window.selectCategory('hotels')">🏨 Hotels</button>
                        <button class="btn btn-primary" onclick="window.selectCategory('visas')">🛂 Visas</button>
                        <button class="btn btn-primary" onclick="window.selectCategory('insurance')">🛡️ Insurance</button>
                        <button class="btn btn-primary" onclick="window.selectCategory('tickets')">🎟️ Tickets</button>
                        <button class="btn btn-primary" onclick="window.selectCategory('ids')">🆔 IDs/Passports</button>
                    </div>
                    <button class="btn btn-secondary" style="margin-top: 16px; width: 100%;" onclick="window.selectCategory(null)">Cancel</button>
                `);
                
                // Create a safe callback that closes modal FIRST, then resolves
                window.selectCategory = (category) => {
                    console.log('📁 Category selected:', category);
                    
                    // Close modal
                    closeModal();
                    
                    // Small delay then resolve
                    setTimeout(() => {
                        resolve(category);
                    }, 150);
                };
            });
        }

        function handleDuplicateFile(filename) {
            return new Promise(resolve => {
                showModal(`
                    <div style="text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                        <h2 style="margin-bottom: 12px;">Duplicate Filename</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 8px;">
                            A file with this name already exists:
                        </p>
                        <p style="font-weight: 600; margin-bottom: 24px; color: var(--warning);">
                            ${filename}
                        </p>
                        <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 24px;">
                            What would you like to do?
                        </p>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <button class="btn btn-primary" onclick="window.handleDuplicateChoice('rename')" style="width: 100%;">
                                ✏️ Auto-rename (keep both files)
                            </button>
                            <button class="btn btn-warning" onclick="window.handleDuplicateChoice('replace')" style="width: 100%;">
                                🔄 Replace existing file
                            </button>
                            <button class="btn btn-secondary" onclick="window.handleDuplicateChoice('cancel')" style="width: 100%;">
                                ❌ Cancel upload
                            </button>
                        </div>
                        <p style="color: var(--text-tertiary); font-size: 12px; margin-top: 16px;">
                            Auto-rename will add a timestamp to the filename
                        </p>
                    </div>
                `);
                
                window.handleDuplicateChoice = (choice) => {
                    console.log('✅ User chose:', choice);
                    
                    // Close modal first
                    closeModal();
                    
                    // Small delay to let modal close, then resolve
                    setTimeout(() => {
                        resolve(choice);
                        
                        // Cleanup
                        delete window.handleDuplicateChoice;
                    }, 150);
                };
            });
        }

        function fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        // Multi-select state
        let selectModeActive = false;
        let selectedDocuments = new Set();
        
        function toggleSelectMode() {
            selectModeActive = !selectModeActive;
            selectedDocuments.clear();
            
            const btn = document.getElementById('selectModeBtn');
            const bar = document.getElementById('multiSelectBar');
            
            if (selectModeActive) {
                btn.textContent = '✕ Cancel';
                btn.classList.add('btn-secondary');
                btn.classList.remove('btn-primary');
                bar.style.display = 'block';
            } else {
                btn.textContent = '☑️ Select';
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-secondary');
                bar.style.display = 'none';
            }
            
            renderDocuments();
            updateSelectedCount();
        }
        
        function toggleDocumentSelect(docId) {
            if (selectedDocuments.has(docId)) {
                selectedDocuments.delete(docId);
            } else {
                selectedDocuments.add(docId);
            }
            renderDocuments();
            updateSelectedCount();
        }
        
        function selectAllDocuments() {
            const filtered = currentDocFilter === 'all' 
                ? tripData.documents 
                : tripData.documents.filter(d => d.category === currentDocFilter);
            filtered.forEach(doc => selectedDocuments.add(doc.id));
            renderDocuments();
            updateSelectedCount();
        }
        
        function deselectAllDocuments() {
            selectedDocuments.clear();
            renderDocuments();
            updateSelectedCount();
        }
        
        function updateSelectedCount() {
            const countEl = document.getElementById('selectedCount');
            const deleteBtn = document.getElementById('deleteSelectedBtn');
            
            if (countEl) {
                const count = selectedDocuments.size;
                countEl.textContent = `${count} selected`;
            }
            
            if (deleteBtn) {
                deleteBtn.disabled = selectedDocuments.size === 0;
            }
        }
        
        async function deleteSelectedDocuments() {
            if (selectedDocuments.size === 0) return;
            
            const count = selectedDocuments.size;
            
            // Beautiful confirmation modal
            showModal(`
                <div style="text-align: center;">
                    <div style="font-size: 64px; margin-bottom: 16px;">🗑️</div>
                    <h2 style="margin-bottom: 12px;">Delete ${count} Document${count > 1 ? 's' : ''}?</h2>
                    <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
                        <p style="color: var(--error); font-weight: 600; margin-bottom: 12px;">⚠️ This will permanently delete:</p>
                        <div style="max-height: 200px; overflow-y: auto; text-align: left;">
                            ${Array.from(selectedDocuments).map(id => {
                                const doc = tripData.documents.find(d => d.id === id);
                                return `<div style="padding: 8px; background: white; margin: 4px 0; border-radius: 6px; font-size: 13px;">📄 ${doc?.name || 'Unknown'}</div>`;
                            }).join('')}
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 24px;">
                        This action cannot be undone!
                    </p>
                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <button class="btn btn-secondary" onclick="closeModal()" style="min-width: 140px;">
                            Cancel
                        </button>
                        <button class="btn btn-danger" onclick="confirmDeleteSelected()" style="min-width: 140px;">
                            Delete ${count} File${count > 1 ? 's' : ''}
                        </button>
                    </div>
                </div>
            `);
            
            window.confirmDeleteSelected = async () => {
                closeModal();
                toast.info(`Deleting ${count} document(s)...`);
                
                try {
                    const docsToDelete = Array.from(selectedDocuments);
                    
                    // Delete from storage
                    for (const docId of docsToDelete) {
                        const doc = tripData.documents.find(d => d.id === docId);
                        if (doc && doc.storagePath) {
                            await sb.storage.from('trip-documents').remove([doc.storagePath]);
                        }
                    }
                    
                    // Remove from array
                    tripData.documents = tripData.documents.filter(d => !docsToDelete.includes(d.id));
                    
                    // Save to database
                    await saveData();
                    
                    // Clear selection and exit select mode
                    selectedDocuments.clear();
                    selectModeActive = false;
                    
                    const btn = document.getElementById('selectModeBtn');
                    const bar = document.getElementById('multiSelectBar');
                    btn.textContent = '☑️ Select';
                    btn.classList.add('btn-primary');
                    btn.classList.remove('btn-secondary');
                    bar.style.display = 'none';
                    
                    // Re-render
                    renderDocuments();
                    
                    // Show success with animation
                    toast.success(`🎉 ${count} document${count > 1 ? 's' : ''} deleted successfully!`);
                    
                } catch (error) {
                    console.error('❌ Delete failed:', error);
                    toast.error('Failed to delete documents');
                    await loadData();
                    renderDocuments();
                }
                
                delete window.confirmDeleteSelected;
            };
        }

        function filterDocuments(category) {
            currentDocFilter = category;
            
            // Update filter buttons
            document.querySelectorAll('[id^="docFilter"]').forEach(btn => {
                btn.style.background = 'var(--bg-hover)';
            });
            document.getElementById('docFilter' + category.charAt(0).toUpperCase() + category.slice(1)).style.background = 'var(--primary)';
            
            renderDocuments();
        }

        function renderDocuments() {
            if (!tripData.documents) tripData.documents = [];
            
            const grid = document.getElementById('documentsGrid');
            const noDocsEl = document.getElementById('noDocuments');
            
            const filtered = currentDocFilter === 'all' 
                ? tripData.documents 
                : tripData.documents.filter(d => d.category === currentDocFilter);

            if (filtered.length === 0) {
                grid.style.display = 'none';
                noDocsEl.style.display = 'block';
                return;
            }

            grid.style.display = 'grid';
            noDocsEl.style.display = 'none';
            grid.innerHTML = '';

            filtered.forEach(doc => {
                const card = document.createElement('div');
                card.className = 'document-card';
                if (selectedDocuments.has(doc.id)) {
                    card.classList.add('selected');
                }
                
                const isImage = doc.type.startsWith('image/');
                const isPDF = doc.type === 'application/pdf';
                
                // Use signedUrl for new docs, base64 for old docs (backward compatibility)
                const previewUrl = doc.signedUrl || doc.publicUrl || doc.base64 || '';
                
                card.innerHTML = `
                    ${selectModeActive ? `<div class="document-select-checkbox ${selectedDocuments.has(doc.id) ? 'checked' : ''}" 
                                              data-doc-id="${doc.id}"></div>` : ''}
                    <div class="document-preview">
                        ${isImage ? `<img src="${previewUrl}" alt="${doc.name}">` : 
                          isPDF ? '📄' : '📋'}
                    </div>
                    <div class="document-info">
                        <div class="document-name" title="${doc.name}">${doc.name}</div>
                        <div class="document-meta">
                            <span>${formatFileSize(doc.size)}</span>
                            <span>${new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                        <div style="font-size: 11px; color: var(--text-tertiary);">
                            By ${doc.uploadedBy}
                        </div>
                    </div>
                    <div class="document-actions">
                        <button class="doc-btn-view" data-doc-id="${doc.id}">👁️ View</button>
                        <button class="doc-btn-delete" data-doc-id="${doc.id}">🗑️</button>
                    </div>
                `;
                
                // Add event listeners
                if (selectModeActive) {
                    const checkbox = card.querySelector('.document-select-checkbox');
                    checkbox.addEventListener('click', (e) => {
                        e.stopPropagation();
                        toggleDocumentSelect(doc.id);
                    });
                    
                    card.addEventListener('click', () => toggleDocumentSelect(doc.id));
                } else {
                    const viewBtn = card.querySelector('.doc-btn-view');
                    const deleteBtn = card.querySelector('.doc-btn-delete');
                    
                    viewBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        viewDocument(doc.id);
                    });
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        deleteDocument(doc.id);
                    });
                }
                
                grid.appendChild(card);
            });
        }

        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }

        function viewDocument(docId) {
            console.log('🔍 Viewing document:', docId);
            const doc = tripData.documents.find(d => d.id === docId);
            
            if (!doc) {
                console.error('❌ Document not found:', docId);
                console.log('Available documents:', tripData.documents.map(d => d.id));
                toast.error('Document not found. Try refreshing the page.');
                return;
            }

            console.log('✅ Document found:', doc.name);
            console.log('📄 Storage path:', doc.storagePath);
            console.log('🔗 Signed URL:', doc.signedUrl ? 'exists' : 'missing');
            
            const isImage = doc.type.startsWith('image/');
            const isPDF = doc.type === 'application/pdf';
            
            // Use signedUrl for new docs, publicUrl/base64 for old docs (backward compatibility)
            let fileUrl = doc.signedUrl || doc.publicUrl || doc.base64 || '';
            
            // If no URL, regenerate signed URL from storage path
            if (!fileUrl && doc.storagePath) {
                console.log('⚠️ No URL found, regenerating signed URL...');
                toast.info('Loading document...');
                
                // Regenerate signed URL
                sb.storage
                    .from('trip-documents')
                    .createSignedUrl(doc.storagePath, 3600) // 1 hour
                    .then(({ data, error }) => {
                        if (error) {
                            console.error('❌ Error creating signed URL:', error);
                            toast.error('Failed to load document: ' + error.message);
                            return;
                        }
                        
                        fileUrl = data.signedUrl;
                        console.log('✅ Regenerated signed URL');
                        
                        // Show modal with regenerated URL
                        showDocumentModal(doc, fileUrl, isImage, isPDF);
                    });
                return;
            }

            showDocumentModal(doc, fileUrl, isImage, isPDF);
        }
        
        function showDocumentModal(doc, fileUrl, isImage, isPDF) {
            showModal(`
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2>${doc.name}</h2>
                    <a href="${fileUrl}" download="${doc.name}" class="btn btn-primary btn-sm" target="_blank">
                        💾 Download
                    </a>
                </div>
                <div style="max-height: 70vh; overflow: auto;">
                    ${isImage ? `<img src="${fileUrl}" style="width: 100%; border-radius: 8px;" onerror="this.parentElement.innerHTML='<p style=color:var(--error)>Failed to load image. Click Download button.</p>'">` :
                      isPDF ? `<embed src="${fileUrl}" type="application/pdf" style="width: 100%; height: 600px;" onerror="this.parentElement.innerHTML='<p style=color:var(--error)>Failed to load PDF. Click Download button.</p>'">` :
                      '<p>Preview not available. Click Download to view.</p>'}
                </div>
            `);
        }

        async function deleteDocument(docId) {
            const doc = tripData.documents.find(d => d.id === docId);
            if (!doc) return;
            
            // Show beautiful confirmation modal
            showModal(`
                <div style="text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                    <h2 style="margin-bottom: 12px;">Delete Document?</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 8px;">
                        Are you sure you want to delete:
                    </p>
                    <p style="font-weight: 600; margin-bottom: 24px;">
                        ${doc.name}
                    </p>
                    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 24px;">
                        <p style="color: #ef4444; font-size: 13px; margin: 0;">
                            ⚠️ This action cannot be undone!
                        </p>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <button class="btn btn-secondary" onclick="closeModal()" style="min-width: 120px;">
                            Cancel
                        </button>
                        <button class="btn btn-danger" onclick="window.confirmDeleteDocument('${docId}')" style="min-width: 120px;">
                            Delete Forever
                        </button>
                    </div>
                </div>
            `);
            
            // Create confirmation callback
            window.confirmDeleteDocument = async (id) => {
                const docToDelete = tripData.documents.find(d => d.id === id);
                console.log('🗑️ Deleting document:', id);
                closeModal();
                
                // Show loading toast
                toast.info('Deleting document...');
                
                try {
                    // Delete from Supabase Storage (if it has storagePath)
                    if (docToDelete && docToDelete.storagePath) {
                        console.log('🗑️ Deleting from storage:', docToDelete.storagePath);
                        const { error: storageError } = await sb.storage
                            .from('trip-documents')
                            .remove([docToDelete.storagePath]);
                        
                        if (storageError) {
                            console.error('⚠️ Storage delete warning:', storageError);
                            // Continue anyway - metadata should be deleted
                        } else {
                            console.log('✅ Deleted from storage');
                        }
                    }
                    
                    // Remove from array
                    tripData.documents = tripData.documents.filter(d => d.id !== id);
                    
                    // Save to database
                    await saveData();
                    
                    // Re-render
                    renderDocuments();
                    
                    // Success message
                    toast.success('Document deleted from cloud storage');
                    console.log('✅ Document deleted');
                    
                } catch (error) {
                    console.error('❌ Delete failed:', error);
                    toast.error('Failed to delete document');
                    
                    // Reload data to restore state
                    await loadData();
                    renderDocuments();
                }
                
                // Cleanup callback
                delete window.confirmDeleteDocument;
            };
        }

        // Weather Functions
        async function fetchWeather() {
            const destination = document.getElementById('destination').value;
            if (!destination || destination.trim() === '') {
                console.log('⚠️ No destination set, hiding weather widget');
                document.getElementById('weatherWidget').style.display = 'none';
                return;
            }

            console.log('🌤️ Fetching weather for:', destination);
            
            try {
                // Show weather widget with loading
                document.getElementById('weatherWidget').style.display = 'block';
                document.getElementById('weatherContent').innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        <div style="font-size: 48px; margin-bottom: 12px;">🌤️</div>
                        <div>Loading weather data...</div>
                    </div>
                `;
                
                // Extract city name (take first part before comma)
                const destParts = destination.split(',').map(s => s.trim());
                const city = destParts[0];
                
                // OpenWeatherMap API (free tier, no key needed for demo)
                // In production, you'd use: api.openweathermap.org/data/2.5/forecast?q=${city}&appid=YOUR_API_KEY&units=metric
                const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=auto&longitude=auto&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto&forecast_days=6`;
                
                // Use geocoding to get coordinates for the city
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
                
                const geoResponse = await fetch(geoUrl);
                const geoData = await geoResponse.json();
                
                if (!geoData.results || geoData.results.length === 0) {
                    throw new Error('City not found');
                }
                
                const { latitude, longitude, name: cityName, country } = geoData.results[0];
                
                // Fetch weather data
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto&forecast_days=6`;
                const weatherResponse = await fetch(weatherUrl);
                const weatherData = await weatherResponse.json();
                
                console.log('✅ Weather data received:', weatherData);
                
                renderWeatherData(cityName, country, weatherData);
                
            } catch (error) {
                console.error('❌ Weather fetch error:', error);
                document.getElementById('weatherContent').innerHTML = `
                    <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                        <p>Unable to fetch weather for "${destination}"</p>
                        <button class="btn btn-secondary btn-sm" onclick="refreshWeather()" style="margin-top: 12px;">Try Again</button>
                    </div>
                `;
            }
        }

        function getWeatherIcon(weatherCode) {
            // WMO Weather codes
            if (weatherCode === 0) return '☀️'; // Clear
            if (weatherCode <= 3) return '⛅'; // Partly cloudy
            if (weatherCode <= 48) return '🌫️'; // Fog
            if (weatherCode <= 57) return '🌧️'; // Drizzle
            if (weatherCode <= 67) return '🌧️'; // Rain
            if (weatherCode <= 77) return '🌨️'; // Snow
            if (weatherCode <= 82) return '🌧️'; // Rain showers
            if (weatherCode <= 86) return '🌨️'; // Snow showers
            if (weatherCode <= 99) return '⛈️'; // Thunderstorm
            return '🌤️';
        }

        function getWeatherCondition(weatherCode) {
            if (weatherCode === 0) return 'Clear';
            if (weatherCode <= 3) return 'Partly Cloudy';
            if (weatherCode <= 48) return 'Foggy';
            if (weatherCode <= 57) return 'Drizzle';
            if (weatherCode <= 67) return 'Rainy';
            if (weatherCode <= 77) return 'Snowy';
            if (weatherCode <= 82) return 'Rain Showers';
            if (weatherCode <= 86) return 'Snow Showers';
            if (weatherCode <= 99) return 'Thunderstorm';
            return 'Cloudy';
        }

        function renderWeatherData(cityName, country, data) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const today = new Date();
            
            // Prepare 5 days starting from today
            const weatherDays = [];
            for (let i = 0; i < 5; i++) {
                const date = new Date(data.daily.time[i]);
                const dayName = i === 0 ? 'Today' : days[date.getDay()];
                const tempMax = Math.round(data.daily.temperature_2m_max[i]);
                const tempMin = Math.round(data.daily.temperature_2m_min[i]);
                const weatherCode = data.daily.weathercode[i];
                const rain = data.daily.precipitation_probability_max[i] || 0;
                
                weatherDays.push({
                    day: dayName,
                    temp: `${tempMax}°/${tempMin}°`,
                    icon: getWeatherIcon(weatherCode),
                    condition: getWeatherCondition(weatherCode),
                    rain: `${rain}%`
                });
            }

            const html = `
                <div style="margin-bottom: 16px; padding: 12px; background: var(--bg-hover); border-radius: var(--radius-md); border-left: 3px solid var(--primary);">
                    <div style="font-weight: 600; margin-bottom: 4px;">📍 ${cityName}, ${country}</div>
                    <div style="font-size: 13px; color: var(--text-secondary);">5-Day Forecast • Real-time data</div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px;">
                    ${weatherDays.map(day => `
                        <div style="
                            padding: 16px;
                            background: var(--bg-hover);
                            border-radius: var(--radius-md);
                            border: 1px solid var(--border);
                            text-align: center;
                            transition: all 0.2s;
                            cursor: pointer;
                        " onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='var(--primary)'" 
                           onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='var(--border)'">
                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; font-weight: 600;">
                                ${day.day}
                            </div>
                            <div style="font-size: 36px; margin: 8px 0;">
                                ${day.icon}
                            </div>
                            <div style="font-size: 18px; font-weight: 600; margin: 8px 0;">
                                ${day.temp}
                            </div>
                            <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">
                                ${day.condition}
                            </div>
                            <div style="font-size: 11px; color: var(--primary);">
                                💧 ${day.rain}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 16px; padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: var(--radius-md); font-size: 12px; color: var(--success); text-align: center;">
                    ✅ Live weather data from Open-Meteo API • Updated ${new Date().toLocaleTimeString()}
                </div>
            `;
            
            document.getElementById('weatherContent').innerHTML = html;
        }

        function refreshWeather() {
            toast.info('Refreshing weather...');
            fetchWeather();
        }

        // PDF Export Function
        async function exportTripAsPDF() {
            toast.info('Generating beautiful PDF...');
            
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF('p', 'mm', 'a4');
                
                // Fetch trip members
                const { data: members } = await sb
                    .from('trip_members')
                    .select('*')
                    .eq('trip_id', currentTrip);
                
                const pageWidth = 210;
                const pageHeight = 297;
                const margin = 20;
                const contentWidth = pageWidth - (2 * margin);
                let yPos = margin;
                
                // Helper functions for styling
                const addPage = () => {
                    doc.addPage();
                    yPos = margin;
                };
                
                const checkPageBreak = (neededSpace) => {
                    if (yPos + neededSpace > pageHeight - margin) {
                        addPage();
                    }
                };
                
                // Cover Page
                doc.setFillColor(99, 102, 241); // Primary color
                doc.rect(0, 0, pageWidth, 80, 'F');
                
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(32);
                doc.setFont(undefined, 'bold');
                doc.text('Trip Itinerary', pageWidth / 2, 35, { align: 'center' });
                
                doc.setFontSize(20);
                doc.setFont(undefined, 'normal');
                const destination = tripData.overview.destination || 'Your Adventure';
                doc.text(destination, pageWidth / 2, 55, { align: 'center' });
                
                doc.setFontSize(12);
                const dateRange = `${tripData.overview.departureDate} to ${tripData.overview.returnDate}`;
                doc.text(dateRange, pageWidth / 2, 70, { align: 'center' });
                
                yPos = 100;
                doc.setTextColor(0, 0, 0);
                
                // Trip Summary Section
                doc.setFontSize(18);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(99, 102, 241);
                doc.text('📊 Trip Summary', margin, yPos);
                yPos += 10;
                
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(0, 0, 0);
                
                // Summary info in boxes
                const summaryItems = [
                    { label: 'Destination', value: tripData.overview.destination || 'Not set' },
                    { label: 'Duration', value: calculateDuration() + ' days' },
                    { label: 'Travelers', value: (members?.length || 0) + ' people' },
                    { label: 'Total Budget', value: formatCurrency(calculateTotalBudget()) }
                ];
                
                summaryItems.forEach((item, index) => {
                    const boxY = yPos + (index * 15);
                    doc.setFillColor(245, 245, 250);
                    doc.roundedRect(margin, boxY, contentWidth, 12, 2, 2, 'F');
                    doc.setFont(undefined, 'bold');
                    doc.text(item.label + ':', margin + 3, boxY + 8);
                    doc.setFont(undefined, 'normal');
                    doc.text(item.value, margin + 50, boxY + 8);
                });
                
                yPos += (summaryItems.length * 15) + 15;
                
                // Budget Breakdown
                checkPageBreak(60);
                doc.setFontSize(18);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(99, 102, 241);
                doc.text('💰 Budget Breakdown', margin, yPos);
                yPos += 10;
                
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(0, 0, 0);
                
                if (tripData.budget && tripData.budget.length > 0) {
                    // Group by priority
                    const must = tripData.budget.filter(b => b.priority === 'must');
                    const flexible = tripData.budget.filter(b => b.priority === 'flexible');
                    const optional = tripData.budget.filter(b => b.priority === 'optional');
                    
                    ['Essential', 'Flexible', 'Optional'].forEach((category, catIndex) => {
                        const items = [must, flexible, optional][catIndex];
                        if (items.length === 0) return;
                        
                        checkPageBreak(25);
                        doc.setFont(undefined, 'bold');
                        doc.text(`${category}:`, margin + 5, yPos);
                        yPos += 6;
                        
                        items.forEach(item => {
                            checkPageBreak(8);
                            doc.setFont(undefined, 'normal');
                            doc.text(`• ${item.item}`, margin + 10, yPos);
                            doc.text(formatCurrency(item.amount), pageWidth - margin - 30, yPos);
                            yPos += 5;
                        });
                        yPos += 3;
                    });
                } else {
                    doc.text('No budget items yet', margin + 5, yPos);
                    yPos += 10;
                }
                
                // Itinerary
                if (tripData.dayPlans && tripData.dayPlans.length > 0) {
                    checkPageBreak(60);
                    yPos += 5;
                    doc.setFontSize(18);
                    doc.setFont(undefined, 'bold');
                    doc.setTextColor(99, 102, 241);
                    doc.text('📅 Itinerary', margin, yPos);
                    yPos += 10;
                    
                    doc.setFontSize(10);
                    doc.setTextColor(0, 0, 0);
                    
                    tripData.dayPlans.forEach((day, index) => {
                        checkPageBreak(20);
                        doc.setFillColor(99, 102, 241, 0.1);
                        doc.roundedRect(margin, yPos - 2, contentWidth, 10, 1, 1, 'F');
                        doc.setFont(undefined, 'bold');
                        doc.text(`Day ${index + 1}: ${day.title || 'Untitled'}`, margin + 3, yPos + 5);
                        yPos += 12;
                        
                        if (day.activities) {
                            const activities = day.activities.split('\n').filter(a => a.trim());
                            activities.forEach(activity => {
                                checkPageBreak(6);
                                doc.setFont(undefined, 'normal');
                                const lines = doc.splitTextToSize(`• ${activity}`, contentWidth - 10);
                                lines.forEach(line => {
                                    doc.text(line, margin + 5, yPos);
                                    yPos += 5;
                                });
                            });
                        }
                        yPos += 3;
                    });
                }
                
                // Packing List
                if (tripData.packing && tripData.packing.length > 0) {
                    checkPageBreak(60);
                    yPos += 5;
                    doc.setFontSize(18);
                    doc.setFont(undefined, 'bold');
                    doc.setTextColor(99, 102, 241);
                    doc.text('🎒 Packing List', margin, yPos);
                    yPos += 10;
                    
                    doc.setFontSize(10);
                    doc.setTextColor(0, 0, 0);
                    
                    tripData.packing.forEach(item => {
                        checkPageBreak(6);
                        doc.setFont(undefined, 'normal');
                        const checkbox = item.packed ? '☑' : '☐';
                        doc.text(`${checkbox} ${item.item}`, margin + 5, yPos);
                        yPos += 5;
                    });
                }
                
                // Members
                if (members && members.length > 0) {
                    checkPageBreak(60);
                    yPos += 5;
                    doc.setFontSize(18);
                    doc.setFont(undefined, 'bold');
                    doc.setTextColor(99, 102, 241);
                    doc.text('👥 Trip Members', margin, yPos);
                    yPos += 10;
                    
                    doc.setFontSize(10);
                    doc.setTextColor(0, 0, 0);
                    
                    members.forEach(member => {
                        checkPageBreak(6);
                        doc.setFont(undefined, 'normal');
                        const roleEmoji = member.role === 'owner' ? '👑' : '👤';
                        doc.text(`${roleEmoji} ${member.username || member.email}`, margin + 5, yPos);
                        yPos += 5;
                    });
                }
                
                // Footer on last page
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128);
                doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                doc.text('Created with Trip Planner', pageWidth / 2, pageHeight - 6, { align: 'center' });
                
                // Save the PDF
                const fileName = `${tripData.overview.destination.replace(/[^a-z0-9]/gi, '_')}_Trip_Itinerary.pdf`;
                doc.save(fileName);
                
                toast.success('PDF exported successfully!');
                
            } catch (error) {
                console.error('❌ PDF export error:', error);
                toast.error('Failed to export PDF: ' + error.message);
            }
        }
        
        function calculateDuration() {
            if (!tripData.overview.departureDate || !tripData.overview.returnDate) return 0;
            const start = new Date(tripData.overview.departureDate);
            const end = new Date(tripData.overview.returnDate);
            const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            return diff + 1; // Include both start and end days
        }
        
        function calculateTotalBudget() {
            if (!tripData.budget) return 0;
            return tripData.budget.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        }
        
        function formatCurrency(amount) {
            return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
        }

        // Emergency Contacts Functions
        function addEmergencyContact() {
            showModal(`
                <h2 style="margin-bottom: 20px;">🚨 Add Emergency Contact</h2>
                <div style="display: grid; gap: 16px;">
                    <div>
                        <label class="form-label">Contact Name</label>
                        <input type="text" id="emergencyName" class="form-input" placeholder="e.g., Local Police, Hospital">
                    </div>
                    <div>
                        <label class="form-label">Phone Number</label>
                        <input type="tel" id="emergencyPhone" class="form-input" placeholder="+1 234 567 8900">
                    </div>
                    <div>
                        <label class="form-label">Type</label>
                        <select id="emergencyType" class="form-input">
                            <option value="police">🚓 Police</option>
                            <option value="medical">🏥 Medical</option>
                            <option value="embassy">🏛️ Embassy</option>
                            <option value="family">👨‍👩‍👧 Family</option>
                            <option value="hotel">🏨 Hotel</option>
                            <option value="other">📞 Other</option>
                        </select>
                    </div>
                    <div>
                        <label class="form-label">Notes (optional)</label>
                        <input type="text" id="emergencyNotes" class="form-input" placeholder="Available 24/7">
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 8px;">
                        <button class="btn btn-secondary" onclick="closeModal()" style="flex: 1;">Cancel</button>
                        <button class="btn btn-danger" onclick="saveEmergencyContact()" style="flex: 1;">Save Contact</button>
                    </div>
                </div>
            `);
        }
        
        async function saveEmergencyContact() {
            const name = document.getElementById('emergencyName').value;
            const phone = document.getElementById('emergencyPhone').value;
            const type = document.getElementById('emergencyType').value;
            const notes = document.getElementById('emergencyNotes').value;
            
            if (!name || !phone) {
                toast.error('Name and phone are required');
                return;
            }
            
            const contact = {
                id: Date.now().toString(),
                name,
                phone,
                type,
                notes,
                addedAt: new Date().toISOString()
            };
            
            tripData.emergencyContacts.push(contact);
            await saveData();
            renderEmergencyContacts();
            closeModal();
            toast.success('Emergency contact added');
        }
        
        function renderEmergencyContacts() {
            const container = document.getElementById('emergencyContactsList');
            if (!tripData.emergencyContacts || tripData.emergencyContacts.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No emergency contacts yet</p>';
                return;
            }
            
            const typeIcons = {
                police: '🚓',
                medical: '🏥',
                embassy: '🏛️',
                family: '👨‍👩‍👧',
                hotel: '🏨',
                other: '📞'
            };
            
            container.innerHTML = tripData.emergencyContacts.map(contact => `
                <div style="background: white; padding: 16px; border-radius: 8px; border: 2px solid rgba(239, 68, 68, 0.2); display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span style="font-size: 20px;">${typeIcons[contact.type]}</span>
                            <span style="font-weight: 600; font-size: 15px;">${contact.name}</span>
                        </div>
                        <div style="color: var(--primary); font-weight: 600; font-size: 16px; margin-bottom: 4px;">
                            📞 ${contact.phone}
                        </div>
                        ${contact.notes ? `<div style="color: var(--text-secondary); font-size: 13px;">${contact.notes}</div>` : ''}
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmergencyContact('${contact.id}')">🗑️</button>
                </div>
            `).join('');
        }
        
        async function deleteEmergencyContact(id) {
            if (!confirm('Delete this emergency contact?')) return;
            tripData.emergencyContacts = tripData.emergencyContacts.filter(c => c.id !== id);
            await saveData();
            renderEmergencyContacts();
            toast.success('Contact deleted');
        }
        
        // Important Information Functions
        function addImportantInfo() {
            showModal(`
                <h2 style="margin-bottom: 20px;">⚠️ Add Important Information</h2>
                <div style="display: grid; gap: 16px;">
                    <div>
                        <label class="form-label">Title</label>
                        <input type="text" id="infoTitle" class="form-input" placeholder="e.g., WiFi Password, Gate Code">
                    </div>
                    <div>
                        <label class="form-label">Information</label>
                        <textarea id="infoContent" class="form-input" rows="3" placeholder="Enter the important information here"></textarea>
                    </div>
                    <div>
                        <label class="form-label">Category</label>
                        <select id="infoCategory" class="form-input">
                            <option value="access">🔑 Access Codes</option>
                            <option value="medical">💊 Medical Info</option>
                            <option value="travel">✈️ Travel Details</option>
                            <option value="safety">🛡️ Safety Info</option>
                            <option value="other">📌 Other</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 8px;">
                        <button class="btn btn-secondary" onclick="closeModal()" style="flex: 1;">Cancel</button>
                        <button class="btn btn-primary" onclick="saveImportantInfo()" style="flex: 1; background: var(--warning);">Save Info</button>
                    </div>
                </div>
            `);
        }
        
        async function saveImportantInfo() {
            const title = document.getElementById('infoTitle').value;
            const content = document.getElementById('infoContent').value;
            const category = document.getElementById('infoCategory').value;
            
            if (!title || !content) {
                toast.error('Title and content are required');
                return;
            }
            
            const info = {
                id: Date.now().toString(),
                title,
                content,
                category,
                addedAt: new Date().toISOString()
            };
            
            tripData.importantInfo.push(info);
            await saveData();
            renderImportantInfo();
            closeModal();
            toast.success('Information added');
        }
        
        function renderImportantInfo() {
            const container = document.getElementById('importantInfoList');
            if (!tripData.importantInfo || tripData.importantInfo.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No important information yet</p>';
                return;
            }
            
            const categoryIcons = {
                access: '🔑',
                medical: '💊',
                travel: '✈️',
                safety: '🛡️',
                other: '📌'
            };
            
            container.innerHTML = tripData.importantInfo.map(info => `
                <div style="background: white; padding: 16px; border-radius: 8px; border: 2px solid rgba(245, 158, 11, 0.3);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 20px;">${categoryIcons[info.category]}</span>
                            <span style="font-weight: 600; font-size: 15px;">${info.title}</span>
                        </div>
                        <button class="btn btn-danger btn-sm" onclick="deleteImportantInfo('${info.id}')">🗑️</button>
                    </div>
                    <div style="background: var(--bg-hover); padding: 12px; border-radius: 6px; color: var(--text-primary); white-space: pre-wrap;">
                        ${info.content}
                    </div>
                </div>
            `).join('');
        }
        
        async function deleteImportantInfo(id) {
            if (!confirm('Delete this information?')) return;
            tripData.importantInfo = tripData.importantInfo.filter(i => i.id !== id);
            await saveData();
            renderImportantInfo();
            toast.success('Information deleted');
        }

        // Checklist Functions
        function addLogisticItem() {
            tripData.logistics.push({ item: '', deadline: '', cost: 0, status: false, notes: '' });
            renderLogisticsTable();
            saveData();
        }

        async function deleteLogisticItem(idx, btn) {
            if (btn.textContent === 'Delete') {
                btn.textContent = 'Confirm?';
                btn.style.background = '#dc2626';
                setTimeout(() => { if (btn.textContent === 'Confirm?') { btn.textContent = 'Delete'; btn.style.background = ''; } }, 3000);
            } else {
                isLocalUpdate = true;
                tripData.logistics.splice(idx, 1);
                renderLogisticsTable();
                updateAllStats();
                await saveData();
                setTimeout(() => { isLocalUpdate = false; }, 500);
            }
        }

        function renderLogisticsTable() {
            const tbody = document.getElementById('logisticsTableBody');
            tbody.innerHTML = '';

            tripData.logistics.forEach((item, idx) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="text" value="${item.item}" onchange="tripData.logistics[${idx}].item = this.value; saveDataSync()"></td>
                    <td><input type="date" value="${item.deadline}" onchange="tripData.logistics[${idx}].deadline = this.value; saveDataSync()"></td>
                    <td><input type="text" value="${formatNumberInput(item.cost)}" onchange="tripData.logistics[${idx}].cost = parseNumber(this.value); saveDataSync()"></td>
                    <td>
                        <input type="checkbox" ${item.status ? 'checked' : ''} onchange="tripData.logistics[${idx}].status = this.checked; saveDataSync(); renderLogisticsTable(); updateAllStats()">
                        <span class="badge badge-${item.status ? 'success' : 'warning'}">${item.status ? 'Done' : 'Pending'}</span>
                    </td>
                    <td><textarea oninput="autoResize(this); tripData.logistics[${idx}].notes = this.value; saveData()">${item.notes}</textarea></td>
                    <td><button class="btn btn-danger btn-sm" onclick="deleteLogisticItem(${idx}, this)">Delete</button></td>
                `;
                tbody.appendChild(row);
            });
        }

        // Packing Functions
        function addPackingCategory() {
            tripData.packing.push({ category: '', items: [], expanded: true });
            renderPackingList();
            saveData();
        }

        async function deletePackingCategory(idx, btn) {
            if (btn.textContent === 'Delete') {
                btn.textContent = 'Confirm?';
                btn.style.background = '#dc2626';
                setTimeout(() => { if (btn.textContent === 'Confirm?') { btn.textContent = 'Delete'; btn.style.background = ''; } }, 3000);
            } else {
                isLocalUpdate = true;
                tripData.packing.splice(idx, 1);
                renderPackingList();
                await saveData();
                setTimeout(() => { isLocalUpdate = false; }, 500);
            }
        }

        function addPackingItem(catIdx) {
            tripData.packing[catIdx].items.push({ name: '', amount: 1, packed: false });
            renderPackingList();
            saveData();
        }

        function renderPackingList() {
            const container = document.getElementById('packingContainer');
            container.innerHTML = '';

            tripData.packing.forEach((cat, catIdx) => {
                const div = document.createElement('div');
                div.style.cssText = 'background: var(--bg-hover); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: 16px; padding: 16px;';
                
                const totalItems = cat.items.length;
                const packedItems = cat.items.filter(i => i.packed).length;
                const progress = totalItems > 0 ? (packedItems / totalItems) * 100 : 0;
                
                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="flex: 1;">
                            <input type="text" value="${cat.category}" placeholder="Category name..." 
                                   style="background: transparent; border: none; font-size: 16px; font-weight: 600; color: var(--text-primary); width: 100%;"
                                   onchange="tripData.packing[${catIdx}].category = this.value; saveDataSync()">
                            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                                ${packedItems} / ${totalItems} packed
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-success btn-sm" onclick="addPackingItem(${catIdx})">+ Item</button>
                            <button class="btn btn-danger btn-sm" onclick="deletePackingCategory(${catIdx}, this)">Delete</button>
                        </div>
                    </div>
                    <div style="background: var(--bg-main); border-radius: 8px; height: 6px; margin-bottom: 12px; overflow: hidden;">
                        <div style="height: 100%; background: linear-gradient(90deg, var(--primary), var(--success)); width: ${progress}%; transition: width 0.3s;"></div>
                    </div>
                    <div id="packItems${catIdx}"></div>
                `;
                container.appendChild(div);

                const itemsDiv = div.querySelector(`#packItems${catIdx}`);
                cat.items.forEach((item, itemIdx) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.style.cssText = 'display: grid; grid-template-columns: auto 70px 1fr auto; gap: 10px; align-items: center; padding: 10px; background: var(--bg-main); border-radius: 6px; margin-bottom: 6px;';
                    itemDiv.innerHTML = `
                        <input type="checkbox" ${item.packed ? 'checked' : ''} 
                               style="width: 20px; height: 20px; cursor: pointer;"
                               onchange="tripData.packing[${catIdx}].items[${itemIdx}].packed = this.checked; renderPackingList(); saveDataSync()">
                        <input type="number" value="${item.amount || 1}" min="1" max="99"
                               style="padding: 6px; background: rgba(26, 26, 46, 0.6); border: 1px solid var(--border); border-radius: 6px; 
                                      color: var(--text-primary); text-align: center; font-weight: 600;"
                               onchange="tripData.packing[${catIdx}].items[${itemIdx}].amount = parseInt(this.value) || 1; saveDataSync()">
                        <input type="text" value="${item.name}" placeholder="Item name..." 
                               style="background: transparent; border: none; color: var(--text-primary); 
                                      ${item.packed ? 'text-decoration: line-through; opacity: 0.6;' : ''}"
                               onchange="tripData.packing[${catIdx}].items[${itemIdx}].name = this.value; saveDataSync()">
                        <button class="btn btn-danger btn-sm" onclick="tripData.packing[${catIdx}].items.splice(${itemIdx}, 1); renderPackingList(); saveDataSync()">✕</button>
                    `;
                    itemsDiv.appendChild(itemDiv);
                });
            });
        }

        function addSmartSuggestions() {
            const suggestions = [
                { category: '📄 Documents', items: ['Passport', 'Visa', 'Flight tickets', 'Hotel bookings', 'Insurance', 'ID card'] },
                { category: '👕 Clothes', items: ['T-shirts', 'Pants', 'Jacket', 'Underwear', 'Socks', 'Shoes'] },
                { category: '🧴 Toiletries', items: ['Toothbrush', 'Toothpaste', 'Shampoo', 'Soap', 'Deodorant'] },
                { category: '📱 Tech', items: ['Phone', 'Charger', 'Power bank', 'Adapter', 'Headphones'] }
            ];

            suggestions.forEach(cat => {
                const exists = tripData.packing.find(c => c.category === cat.category);
                if (!exists) {
                    tripData.packing.push({
                        category: cat.category,
                        items: cat.items.map(name => ({ name, amount: 1, packed: false })),
                        expanded: true
                    });
                }
            });

            renderPackingList();
            saveData();
        }

        // Group Functions
        // Group & Invitation Functions
        function addGroupMemberManual() {
            showModal(`
                <div class="modal-header">
                    <div class="modal-title">➕ Add Member</div>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="modal-input-group">
                        <label class="modal-label">Member Name</label>
                        <input type="text" id="memberNameInput" class="modal-input" placeholder="Enter name" autofocus>
                    </div>
                    <div class="modal-input-group">
                        <label class="modal-label">Email (Optional)</label>
                        <input type="email" id="memberEmailInput" class="modal-input" placeholder="email@example.com">
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn-secondary" onclick="closeModal()">Cancel</button>
                    <button class="modal-btn modal-btn-primary" onclick="submitAddMember()">Add Member</button>
                </div>
            `);
        }

        function submitAddMember() {
            const name = document.getElementById('memberNameInput').value.trim();
            const email = document.getElementById('memberEmailInput').value.trim();
            
            if (!name) {
                alert('Please enter a name');
                return;
            }
            
            tripData.group.push({ 
                name: name, 
                email: email || '', 
                confirmed: false, 
                budget: 0, 
                budgetEur: 0,
                contact: email || '',
                inviteStatus: 'manual',
                joinedDate: new Date().toISOString()
            });
            
            renderGroupMembers();
            updateGroupStats();
            saveData();
            closeModal();
        }

        async function sendInvite() {
            const email = document.getElementById('inviteEmail').value.trim();
            if (!email) {
                showErrorToast('Please enter an email address');
                return;
            }
            
            // Check if already invited
            const { data: existing } = await sb
                .from('trip_invitations')
                .select('*')
                .eq('trip_id', currentTrip)
                .eq('invitee_email', email)
                .eq('status', 'pending')
                .maybeSingle();
            
            if (existing) {
                showErrorToast('Already invited!');
                return;
            }
            
            // Insert invitation
            const { error } = await sb
                .from('trip_invitations')
                .insert([{
                    trip_id: currentTrip,
                    inviter_id: user.id,
                    invitee_email: email,
                    status: 'pending'
                }]);
            
            if (error) {
                showErrorToast('Error: ' + error.message);
                return;
            }
            
            showSuccessToast('Invitation sent to ' + email);
            document.getElementById('inviteEmail').value = '';
            renderPendingInvitations();
            updateGroupStats();
        }

        async function cancelInviteDB(inviteId) {
            showModal(`
                <div class="modal-header">
                    <div class="modal-title">⚠️ Cancel Invitation</div>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <p style="color: var(--text-secondary);">Are you sure you want to cancel this invitation?</p>
                </div>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn-secondary" onclick="closeModal()">Keep Invitation</button>
                    <button class="modal-btn modal-btn-primary" onclick="confirmCancelInviteDB('${inviteId}')" style="background: var(--danger);">Cancel Invite</button>
                </div>
            `);
        }

        async function confirmCancelInviteDB(inviteId) {
            const { error } = await sb
                .from('trip_invitations')
                .delete()
                .eq('id', inviteId);
            
            if (error) {
                console.error('Cancel error:', error);
                showErrorToast('Error: ' + error.message);
                closeModal();
                return;
            }
            
            closeModal();
            showSuccessToast('Invitation cancelled');
            renderPendingInvitations();
            updateGroupStats();
        }

        function copyShareLink() {
            const link = document.getElementById('shareLink');
            link.select();
            document.execCommand('copy');
            
            showSuccessToast('Link copied to clipboard!');
        }

        function cancelInvite(email) {
            showModal(`
                <div class="modal-header">
                    <div class="modal-title">⚠️ Cancel Invitation</div>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <p style="color: var(--text-secondary); margin-bottom: 16px;">Are you sure you want to cancel the invitation to:</p>
                    <p style="font-weight: 600; color: var(--text-primary); font-size: 16px;">${email}</p>
                </div>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn-secondary" onclick="closeModal()">Keep Invitation</button>
                    <button class="modal-btn modal-btn-primary" onclick="confirmCancelInvite('${email}')" style="background: var(--danger);">Cancel Invite</button>
                </div>
            `);
        }

        function confirmCancelInvite(email) {
            tripData.pendingInvites = tripData.pendingInvites.filter(inv => inv.email !== email);
            renderPendingInvitations();
            updateGroupStats();
            saveData();
            closeModal();
            showSuccessToast('Invitation cancelled');
        }

        async function removeMember(idx) {
            const member = tripData.group[idx];
            
            // Check if current user is owner
            const currentUserIsOwner = tripData.group.some(m => m.email === user.email && m.inviteStatus === 'owner');
            if (!currentUserIsOwner) {
                showErrorToast('Only the trip owner can remove members');
                return;
            }
            
            // Can't remove owner
            if (member.inviteStatus === 'owner') {
                showErrorToast('Cannot remove the trip owner');
                return;
            }
            
            if (!member.user_id) {
                showErrorToast('Cannot remove this member');
                return;
            }
            
            showModal(`
                <div class="modal-header">
                    <div class="modal-title">⚠️ Remove Member</div>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <p style="color: var(--text-secondary); margin-bottom: 16px;">Are you sure you want to remove:</p>
                    <p style="font-weight: 600; color: var(--text-primary); font-size: 16px;">${member.name}</p>
                </div>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn-secondary" onclick="closeModal()">Cancel</button>
                    <button class="modal-btn modal-btn-primary" onclick="confirmRemoveMember('${member.user_id}')" style="background: var(--danger);">Remove Member</button>
                </div>
            `);
        }

        async function confirmRemoveMember(userId) {
            // Delete from trip_members table
            const { error } = await sb
                .from('trip_members')
                .delete()
                .eq('trip_id', currentTrip)
                .eq('user_id', userId);
            
            if (error) {
                console.error('Remove error:', error);
                showErrorToast('Error: ' + error.message);
                closeModal();
                return;
            }
            
            closeModal();
            showSuccessToast('Member removed');
            
            // Reload data to refresh group
            await loadData();
            renderAll();
        }

        function toggleMemberConfirm(idx) {
            tripData.group[idx].confirmed = !tripData.group[idx].confirmed;
            renderGroupMembers();
            updateGroupStats();
            saveData();
        }

        function updateMemberBudget(idx, value) {
            const budgetIDR = parseNumber(value);
            tripData.group[idx].budget = budgetIDR;
            tripData.group[idx].budgetEur = budgetIDR / exchangeRate;
            renderGroupMembers();
            updateGroupStats();
            saveData();
        }

        function addTodo() {
            if (!tripData.todos) tripData.todos = [];
            tripData.todos.push({ id: Date.now(), task: '', assignedTo: '', deadline: '', priority: 'Medium', completed: false, createdBy: user.email, createdAt: new Date().toISOString() });
            renderTodos();
        }
        
        function renderTodos() {
            if (!tripData.todos) tripData.todos = [];
            const container = document.getElementById('todosContainer');
            if (!container) return;
            if (tripData.todos.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 60px; color: var(--text-secondary);"><div style="font-size: 48px;">📝</div><p>No tasks yet!</p></div>';
                return;
            }
            
            const sorted = [...tripData.todos].sort((a, b) => {
                if (a.completed !== b.completed) return a.completed ? 1 : -1;
                return 0;
            });
            
            container.innerHTML = sorted.map(todo => {
                const idx = tripData.todos.findIndex(t => t.id === todo.id);
                return `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: ${todo.completed ? 'var(--bg-main)' : 'var(--bg-hover)'}; border-radius: 10px; margin-bottom: 10px; border-left: 4px solid ${todo.completed ? 'var(--success)' : 'var(--primary)'};">
                        <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                            onchange="tripData.todos[${idx}].completed = this.checked; renderTodos(); saveData();" 
                            style="width: 20px; height: 20px; cursor: pointer; accent-color: var(--success); flex-shrink: 0;">
                        <input type="text" value="${todo.task}" placeholder="Task..." 
                            onchange="tripData.todos[${idx}].task = this.value; saveData();" 
                            style="flex: 1; padding: 8px 12px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 8px; font-size: 14px; ${todo.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                        <button class="btn btn-danger btn-sm" onclick="deleteTodo(${idx})" style="flex-shrink: 0;">✕</button>
                    </div>
                `;
            }).join('');
        }
        
        async function deleteTodo(idx) {
            const task = tripData.todos[idx].task || 'this task';
            if (!confirm(`Delete "${task}"?`)) return;
            if (!confirm('Are you sure? This cannot be undone.')) return;
            isLocalUpdate = true;
            tripData.todos.splice(idx, 1);
            renderTodos();
            await saveData();
            setTimeout(() => { isLocalUpdate = false; }, 500);
        }
        
        // SHARED CHECKLIST (Owner creates template, members track own progress)
        function addSharedChecklistItem() {
            const currentUserIsOwner = tripData.group && tripData.group.length > 0 && 
                                      tripData.group[0].user_id === user.id;
            if (!currentUserIsOwner) {
                showErrorToast('Only the trip owner can add checklist items');
                return;
            }
            
            if (!tripData.sharedChecklist) tripData.sharedChecklist = [];
            tripData.sharedChecklist.push({
                id: Date.now(),
                task: '',
                assignedTo: '',
                deadline: '',
                priority: 'Medium',
                createdBy: user.email,
                createdAt: new Date().toISOString()
            });
            renderSharedChecklist();
            saveData();
        }
        
        function renderSharedChecklist() {
            const container = document.getElementById('sharedChecklistContainer');
            if (!container) return;
            
            if (!tripData.sharedChecklist) tripData.sharedChecklist = [];
            if (!tripData.myChecklistProgress) tripData.myChecklistProgress = {};
            
            const currentUserIsOwner = tripData.group && tripData.group.length > 0 && 
                                      tripData.group[0].user_id === user.id;
            
            const addBtn = document.getElementById('addChecklistBtn');
            if (addBtn) addBtn.style.display = currentUserIsOwner ? 'block' : 'none';
            
            if (tripData.sharedChecklist.length === 0) {
                container.innerHTML = `<div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                    <div style="font-size: 48px; margin-bottom: 12px;">📝</div>
                    <p style="font-size: 14px;">${currentUserIsOwner ? 'No checklist yet. Add items!' : 'Owner hasn\'t added items yet'}</p>
                </div>`;
                return;
            }
            
            const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
            const sorted = [...tripData.sharedChecklist].sort((a, b) => {
                const aChecked = tripData.myChecklistProgress[a.id] || false;
                const bChecked = tripData.myChecklistProgress[b.id] || false;
                if (aChecked !== bChecked) return aChecked ? 1 : -1;
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            
            container.innerHTML = sorted.map(item => {
                const idx = tripData.sharedChecklist.findIndex(t => t.id === item.id);
                const isChecked = tripData.myChecklistProgress[item.id] || false;
                const overdue = item.deadline && new Date(item.deadline) < new Date() && !isChecked;
                const priorityColor = item.priority === 'High' ? 'var(--danger)' : item.priority === 'Medium' ? '#f59e0b' : 'var(--primary)';
                
                return `
                    <div style="padding: 16px; background: ${isChecked ? 'var(--bg-main)' : 'var(--bg-hover)'}; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid ${isChecked ? 'var(--success)' : priorityColor};">
                        <div style="display: flex; align-items: start; gap: 12px;">
                            <input type="checkbox" ${isChecked ? 'checked' : ''} 
                                onchange="tripData.myChecklistProgress[${item.id}] = this.checked; renderSharedChecklist(); saveData();" 
                                style="width: 20px; height: 20px; margin-top: 4px; cursor: pointer; accent-color: var(--success); flex-shrink: 0;">
                            
                            <div style="flex: 1;">
                                ${currentUserIsOwner ? 
                                    `<input type="text" value="${item.task}" placeholder="Task description..." 
                                        onchange="tripData.sharedChecklist[${idx}].task = this.value; saveData();" 
                                        style="width: 100%; padding: 8px 12px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary); font-size: 14px; ${isChecked ? 'text-decoration: line-through; opacity: 0.6;' : ''}">` 
                                    : 
                                    `<div style="font-size: 14px; font-weight: 500; ${isChecked ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${item.task || 'Unnamed task'}</div>`
                                }
                                
                                ${currentUserIsOwner ? `
                                    <div style="display: flex; gap: 12px; margin-top: 12px; flex-wrap: wrap;">
                                        <div style="flex: 1; min-width: 150px;">
                                            <label style="font-size: 11px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">👤 Assigned To</label>
                                            <button onclick="selectAssignee(${idx})" style="width: 100%; padding: 8px 12px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 8px; text-align: left; cursor: pointer; font-size: 13px; color: ${item.assignedTo ? 'var(--text-primary)' : 'var(--text-secondary)'};">
                                                ${item.assignedTo || 'Select member...'}
                                            </button>
                                        </div>
                                        <div style="flex: 1; min-width: 140px;">
                                            <label style="font-size: 11px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">📅 Deadline</label>
                                            <input type="date" value="${item.deadline || ''}" 
                                                onchange="tripData.sharedChecklist[${idx}].deadline = this.value; renderSharedChecklist(); saveData();" 
                                                style="width: 100%; padding: 8px 12px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 8px; font-size: 13px;">
                                        </div>
                                        <div style="flex: 0 0 100px;">
                                            <label style="font-size: 11px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">🎯 Priority</label>
                                            <select onchange="tripData.sharedChecklist[${idx}].priority = this.value; renderSharedChecklist(); saveData();" 
                                                style="width: 100%; padding: 8px 12px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 8px; font-size: 13px;">
                                                <option ${item.priority === 'High' ? 'selected' : ''}>High</option>
                                                <option ${item.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                                                <option ${item.priority === 'Low' ? 'selected' : ''}>Low</option>
                                            </select>
                                        </div>
                                    </div>
                                ` : `
                                    <div style="margin-top: 8px; font-size: 12px; color: var(--text-secondary); display: flex; gap: 16px; flex-wrap: wrap;">
                                        ${item.assignedTo ? `<span>👤 ${item.assignedTo}</span>` : ''}
                                        ${item.deadline ? `<span>📅 ${new Date(item.deadline).toLocaleDateString()}</span>` : ''}
                                        <span style="color: ${priorityColor};">🎯 ${item.priority}</span>
                                    </div>
                                `}
                                
                                ${overdue ? '<div style="margin-top: 8px; padding: 6px 12px; background: rgba(239, 68, 68, 0.1); border-radius: 6px; font-size: 12px; color: var(--danger); font-weight: 600;">⚠️ OVERDUE</div>' : ''}
                            </div>
                            
                            ${currentUserIsOwner ? 
                                `<button class="btn btn-danger btn-sm" onclick="deleteChecklistItem(${idx})" style="flex-shrink: 0;">✕</button>` 
                                : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        function selectAssignee(idx) {
            if (!tripData.group || tripData.group.length === 0) {
                showErrorToast('No members to assign');
                return;
            }
            
            const currentAssigned = tripData.sharedChecklist[idx].assignedTo || '';
            const currentNames = currentAssigned.split(', ').filter(n => n);
            
            const modalContent = `
                <div style="max-width: 500px;">
                    <h2 style="margin-bottom: 20px;">Assign To Members</h2>
                    <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">Select members who should complete this task</p>
                    
                    <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                        <button onclick="selectAllAssignees(${idx})" class="btn btn-secondary btn-sm">Select All</button>
                        <button onclick="deselectAllAssignees(${idx})" class="btn btn-secondary btn-sm">Deselect All</button>
                    </div>
                    
                    <div id="assigneeList" style="max-height: 300px; overflow-y: auto; margin-bottom: 20px;">
                        ${tripData.group.map((member, mIdx) => {
                            const isSelected = currentNames.includes(member.name);
                            return `
                                <label style="display: flex; align-items: center; padding: 12px; background: var(--bg-hover); border-radius: 8px; margin-bottom: 8px; cursor: pointer; border: 2px solid ${isSelected ? 'var(--primary)' : 'transparent'}; transition: all 0.2s;"
                                    onmouseover="this.style.background='var(--bg-main)'"
                                    onmouseout="this.style.background='var(--bg-hover)'">
                                    <input type="checkbox" ${isSelected ? 'checked' : ''} 
                                        onchange="toggleAssignee(${idx}, ${mIdx})"
                                        style="width: 18px; height: 18px; margin-right: 12px; cursor: pointer; accent-color: var(--primary);">
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600;">${member.name || 'Unnamed'}</div>
                                        ${member.email ? `<div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">${member.email}</div>` : ''}
                                    </div>
                                </label>
                            `;
                        }).join('')}
                    </div>
                    
                    <div style="display: flex; gap: 8px;">
                        <button onclick="closeModal()" class="btn btn-secondary" style="flex: 1;">Cancel</button>
                        <button onclick="saveAssignees(${idx})" class="btn btn-primary" style="flex: 1;">Done</button>
                    </div>
                </div>
            `;
            showModal(modalContent);
            
            // Store temp selection in window
            window.tempAssignees = [...currentNames];
        }
        
        function toggleAssignee(checklistIdx, memberIdx) {
            const memberName = tripData.group[memberIdx].name;
            if (!window.tempAssignees) window.tempAssignees = [];
            
            const idx = window.tempAssignees.indexOf(memberName);
            if (idx > -1) {
                window.tempAssignees.splice(idx, 1);
            } else {
                window.tempAssignees.push(memberName);
            }
        }
        
        function selectAllAssignees(checklistIdx) {
            window.tempAssignees = tripData.group.map(m => m.name);
            // Re-render modal
            selectAssignee(checklistIdx);
        }
        
        function deselectAllAssignees(checklistIdx) {
            window.tempAssignees = [];
            // Re-render modal
            selectAssignee(checklistIdx);
        }
        
        function saveAssignees(idx) {
            if (!window.tempAssignees) window.tempAssignees = [];
            tripData.sharedChecklist[idx].assignedTo = window.tempAssignees.join(', ');
            window.tempAssignees = null;
            closeModal();
            renderSharedChecklist();
            saveData();
        }
        
        async function deleteChecklistItem(idx) {
            if (!confirm('Delete this checklist item? This will remove it for everyone.')) return;
            isLocalUpdate = true;
            const itemId = tripData.sharedChecklist[idx].id;
            tripData.sharedChecklist.splice(idx, 1);
            if (tripData.myChecklistProgress) delete tripData.myChecklistProgress[itemId];
            renderSharedChecklist();
            await saveData();
            setTimeout(() => { isLocalUpdate = false; }, 500);
        }

        function renderGroupMembers() {
            const grid = document.getElementById('membersGrid');
            if (!tripData.group || tripData.group.length === 0) {
                grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No members yet. Invite your friends to join!</p>';
                return;
            }

            grid.innerHTML = tripData.group.map((member, idx) => {
                const initials = member.name ? member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
                const statusClass = member.confirmed ? 'confirmed' : 'pending';
                const statusText = member.confirmed ? '✓ Confirmed' : '⏳ Pending';
                const isOwner = member.inviteStatus === 'owner';
                const currentUserIsOwner = tripData.group.some(m => m.email === user.email && m.inviteStatus === 'owner');
                
                return `
                    <div class="member-card">
                        <div class="member-card-header">
                            <div>
                                <div class="member-avatar">${initials}</div>
                                <div class="member-name">
                                    ${member.name || 'Unnamed'}
                                    ${isOwner ? '<span style="margin-left: 8px; padding: 4px 10px; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border-radius: 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px;">👑 OWNER</span>' : ''}
                                </div>
                                ${member.email ? `<div class="member-email">${member.email}</div>` : ''}
                            </div>
                            <span class="member-status ${statusClass}" style="
                                padding: 6px 14px; 
                                border-radius: 20px; 
                                font-size: 12px; 
                                font-weight: 700;
                                ${member.confirmed 
                                    ? 'background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.25)); color: var(--success); border: 2px solid var(--success);' 
                                    : 'background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.25)); color: #f59e0b; border: 2px solid #f59e0b;'}
                            ">${statusText}</span>
                        </div>
                        
                        <div style="margin-top: 16px; background: var(--bg-main); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border);">
                            <div style="margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 8px; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Total Budget (from Budget Tab)</label>
                                <div style="font-size: 14px; color: var(--text-tertiary); margin-bottom: 4px;">
                                    ${formatCurrency(member.budget || 0)}
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%); border-radius: 8px;">
                                <span style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">EUR Equivalent</span>
                                <span style="font-size: 20px; font-weight: 700; color: var(--primary);">${formatEur(member.budgetEur || 0)}</span>
                            </div>
                            ${member.contact ? `
                            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);">
                                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Contact</div>
                                <div style="font-size: 14px; color: var(--text-primary);">${member.contact}</div>
                            </div>
                            ` : ''}
                        </div>
                        
                        <div style="display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;">
                            ${member.user_id && member.user_id !== user.id ? `
                                <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="viewMemberData('${member.user_id}')">
                                    👁️ View Data
                                </button>
                            ` : ''}
                            <button class="btn ${member.confirmed ? 'btn-secondary' : 'btn-success'} btn-sm" style="flex: 1; ${member.confirmed ? '' : 'background: linear-gradient(135deg, var(--success), #059669); border: none;'}" onclick="toggleMemberConfirm(${idx})">
                                ${member.confirmed ? '✗ Unconfirm' : '✓ Confirm Attendance'}
                            </button>
                            ${!isOwner ? `
                                <button class="btn btn-primary btn-sm" onclick="sendReminder('${member.user_id}', '${member.name}')" title="Send reminder">
                                    ⏰
                                </button>
                            ` : ''}
                            ${!isOwner && currentUserIsOwner ? `
                                <button class="btn btn-danger btn-sm" onclick="removeMember(${idx})">
                                    🗑️
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }

        async function renderPendingInvitations() {
            const container = document.getElementById('pendingInvitationsList');
            
            // Query database for invitations sent by current user
            const { data: invites } = await sb
                .from('trip_invitations')
                .select('*')
                .eq('trip_id', currentTrip)
                .eq('inviter_id', user.id)
                .eq('status', 'pending')
                .order('invited_at', { ascending: false });
            
            if (!invites || invites.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No pending invitations</p>';
                return;
            }

            container.innerHTML = invites.map(invite => {
                const initials = invite.invitee_email.slice(0, 2).toUpperCase();
                const timeAgo = getTimeAgo(new Date(invite.invited_at));
                
                return `
                    <div class="pending-invite-card">
                        <div class="pending-invite-info">
                            <div class="pending-invite-avatar">${initials}</div>
                            <div>
                                <div style="font-weight: 500; margin-bottom: 2px;">${invite.invitee_email}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Invited ${timeAgo}</div>
                            </div>
                        </div>
                        <button class="btn btn-danger btn-sm" onclick="cancelInviteDB('${invite.id}')">
                            Cancel
                        </button>
                    </div>
                `;
            }).join('');
        }

        async function updateGroupStats() {
            const totalMembers = (tripData.group || []).length;
            const confirmed = (tripData.group || []).filter(m => m.confirmed).length;
            
            // Count pending invites from database
            const { data: pendingInvites } = await sb
                .from('trip_invitations')
                .select('id')
                .eq('trip_id', currentTrip)
                .eq('inviter_id', user.id)
                .eq('status', 'pending');
            
            const pending = pendingInvites ? pendingInvites.length : 0;
            const totalBudget = (tripData.group || []).reduce((sum, m) => sum + (m.budgetEur || 0), 0);
            
            document.getElementById('totalMembers').textContent = totalMembers;
            document.getElementById('confirmedMembers').textContent = confirmed;
            document.getElementById('pendingInvites').textContent = pending;
            document.getElementById('totalGroupBudget').textContent = formatEur(totalBudget);
            
            // Update travelers count in overview
            const travelersElem = document.getElementById('travelers');
            if (travelersElem) {
                travelersElem.value = totalMembers + (totalMembers === 1 ? ' person' : ' people');
            }
        }

        function getTimeAgo(date) {
            const seconds = Math.floor((new Date() - date) / 1000);
            const intervals = {
                year: 31536000,
                month: 2592000,
                week: 604800,
                day: 86400,
                hour: 3600,
                minute: 60
            };
            
            for (const [unit, secondsInUnit] of Object.entries(intervals)) {
                const interval = Math.floor(seconds / secondsInUnit);
                if (interval >= 1) {
                    return interval + ' ' + unit + (interval === 1 ? '' : 's') + ' ago';
                }
            }
            return 'just now';
        }

        function deleteGroupMember(idx, btn) {
            removeMember(idx);
        }

        function renderGroupTable() {
            // Legacy function - redirects to new render
            renderGroupMembers();
        }

        function updateTravelerCount() {
            const count = tripData.group.length;
            const elem = document.getElementById('travelers');
            if (elem) {
                elem.value = count + (count === 1 ? ' person' : ' people');
            }
        }

        // Shared Expenses Functions
        function addSharedExpense() {
            tripData.sharedExpenses.push({ description: '', amount: 0, amountEur: 0, paidBy: '', splitBetween: [] });
            renderSharedExpenses();
            saveData();
        }

        async function deleteSharedExpense(idx, btn) {
            if (btn.textContent === 'Delete') {
                btn.textContent = 'Confirm?';
                btn.style.background = '#dc2626';
                setTimeout(() => { if (btn.textContent === 'Confirm?') { btn.textContent = 'Delete'; btn.style.background = ''; } }, 3000);
            } else {
                isLocalUpdate = true;
                tripData.sharedExpenses.splice(idx, 1);
                renderSharedExpenses();
                await saveData();
                setTimeout(() => { isLocalUpdate = false; }, 500);
            }
        }

        function renderSharedExpenses() {
            const tbody = document.getElementById('sharedExpensesBody');
            tbody.innerHTML = '';

            const members = tripData.group.map(m => m.name).filter(n => n);

            tripData.sharedExpenses.forEach((exp, idx) => {
                const splitCount = exp.splitBetween ? exp.splitBetween.length : 0;
                const perPerson = splitCount > 0 ? (exp.amount || 0) / splitCount : 0;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="text" value="${exp.description}" onchange="tripData.sharedExpenses[${idx}].description = this.value; saveDataSync()"></td>
                    <td><input type="number" value="${exp.amountEur || 0}" step="0.01" onchange="updateSharedEur(${idx}, this.value)"></td>
                    <td>
                        <select onchange="tripData.sharedExpenses[${idx}].paidBy = this.value; saveDataSync(); renderSharedExpenses()">
                            <option value="">Select...</option>
                            ${members.map(m => `<option ${exp.paidBy === m ? 'selected' : ''}>${m}</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                            ${members.map(m => {
                                const checked = exp.splitBetween && exp.splitBetween.includes(m);
                                return `<label style="display: flex; gap: 4px; font-size: 13px;">
                                    <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleSplitMember(${idx}, '${m}', this.checked)">
                                    ${m}
                                </label>`;
                            }).join('')}
                        </div>
                    </td>
                    <td style="font-weight: 600;">${formatCurrency(Math.round(perPerson))}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="deleteSharedExpense(${idx}, this)">Delete</button></td>
                `;
                tbody.appendChild(row);
            });

            calculateSettlements();
        }

        function updateSharedEur(idx, eurValue) {
            const eur = parseFloat(eurValue) || 0;
            tripData.sharedExpenses[idx].amountEur = eur;
            tripData.sharedExpenses[idx].amount = Math.round(eur * exchangeRate);
            saveData();
            renderSharedExpenses();
        }

        function toggleSplitMember(expIdx, memberName, checked) {
            if (!tripData.sharedExpenses[expIdx].splitBetween) {
                tripData.sharedExpenses[expIdx].splitBetween = [];
            }

            if (checked) {
                if (!tripData.sharedExpenses[expIdx].splitBetween.includes(memberName)) {
                    tripData.sharedExpenses[expIdx].splitBetween.push(memberName);
                }
            } else {
                tripData.sharedExpenses[expIdx].splitBetween = 
                    tripData.sharedExpenses[expIdx].splitBetween.filter(m => m !== memberName);
            }

            saveData();
            renderSharedExpenses();
        }

        function calculateSettlements() {
            if (!tripData.settlements) tripData.settlements = {}; // { "Alice->Bob": { amount: 50, paid: false, paidAt: null } }
            
            const balances = {};

            tripData.sharedExpenses.forEach(exp => {
                const paidBy = exp.paidBy;
                const amount = exp.amount || 0;
                const splitBetween = exp.splitBetween || [];

                if (!paidBy || splitBetween.length === 0 || amount === 0) return;

                const perPerson = amount / splitBetween.length;

                if (!balances[paidBy]) balances[paidBy] = 0;
                balances[paidBy] += amount;

                splitBetween.forEach(member => {
                    if (!balances[member]) balances[member] = 0;
                    balances[member] -= perPerson;
                });
            });

            const summary = document.getElementById('settlementSummary');
            summary.innerHTML = '';

            const sorted = Object.entries(balances).sort((a, b) => b[1] - a[1]);

            if (sorted.length === 0) {
                summary.innerHTML = '<p style="color: var(--text-secondary);">No settlements needed</p>';
                return;
            }

            // Calculate who owes whom
            const creditors = sorted.filter(([p, b]) => b > 1).map(([p, b]) => ({ name: p, amount: b }));
            const debtors = sorted.filter(([p, b]) => b < -1).map(([p, b]) => ({ name: p, amount: Math.abs(b) }));

            const transactions = [];
            let i = 0, j = 0;

            while (i < creditors.length && j < debtors.length) {
                const creditor = creditors[i];
                const debtor = debtors[j];
                const amount = Math.min(creditor.amount, debtor.amount);

                if (amount > 1) {
                    const key = `${debtor.name}->${creditor.name}`;
                    const isPaid = tripData.settlements[key]?.paid || false;
                    transactions.push({ from: debtor.name, to: creditor.name, amount: Math.round(amount), key, isPaid });
                }

                creditor.amount -= amount;
                debtor.amount -= amount;

                if (creditor.amount < 1) i++;
                if (debtor.amount < 1) j++;
            }

            // Render transactions
            transactions.forEach(tx => {
                const div = document.createElement('div');
                div.style.cssText = `
                    padding: 14px; 
                    background: var(--bg-hover); 
                    border-radius: 8px; 
                    margin-bottom: 10px; 
                    border-left: 4px solid ${tx.isPaid ? 'var(--success)' : 'var(--warning)'};
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `;

                div.innerHTML = `
                    <div style="flex: 1;">
                        <strong style="color: var(--text-primary);">${tx.from}</strong> 
                        <span style="color: var(--text-secondary);">→</span> 
                        <strong style="color: var(--text-primary);">${tx.to}</strong>
                        <div style="font-size: 18px; font-weight: 700; color: var(--primary); margin-top: 4px;">
                            ${formatCurrency(tx.amount)}
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        ${tx.isPaid ? 
                            `<button class="btn btn-sm" style="background: var(--success); color: white; pointer-events: none;">
                                ✓ Paid
                            </button>` :
                            `<button class="btn btn-sm btn-primary" onclick="markSettlementPaid('${tx.key}')">
                                Mark Paid
                            </button>`
                        }
                    </div>
                `;

                summary.appendChild(div);
            });

            // Add export button
            if (transactions.length > 0) {
                const exportDiv = document.createElement('div');
                exportDiv.style.cssText = 'margin-top: 20px; display: flex; gap: 12px;';
                exportDiv.innerHTML = `
                    <button class="btn btn-secondary btn-sm" onclick="exportSettlements()">
                        📋 Copy to Clipboard
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="exportSettlementsWhatsApp()">
                        💬 Format for WhatsApp
                    </button>
                `;
                summary.appendChild(exportDiv);
            }
        }

        function markSettlementPaid(key) {
            if (!tripData.settlements) tripData.settlements = {};
            tripData.settlements[key] = { paid: true, paidAt: new Date().toISOString() };
            saveData();
            calculateSettlements();
            showSuccessToast('Payment marked as complete');
            triggerHaptic('medium');
        }

        function exportSettlements() {
            const balances = {};
            tripData.sharedExpenses.forEach(exp => {
                const paidBy = exp.paidBy;
                const amount = exp.amount || 0;
                const splitBetween = exp.splitBetween || [];
                if (!paidBy || splitBetween.length === 0 || amount === 0) return;
                const perPerson = amount / splitBetween.length;
                if (!balances[paidBy]) balances[paidBy] = 0;
                balances[paidBy] += amount;
                splitBetween.forEach(member => {
                    if (!balances[member]) balances[member] = 0;
                    balances[member] -= perPerson;
                });
            });

            const sorted = Object.entries(balances).sort((a, b) => b[1] - a[1]);
            const creditors = sorted.filter(([p, b]) => b > 1).map(([p, b]) => ({ name: p, amount: b }));
            const debtors = sorted.filter(([p, b]) => b < -1).map(([p, b]) => ({ name: p, amount: Math.abs(b) }));
            const transactions = [];
            let i = 0, j = 0;
            while (i < creditors.length && j < debtors.length) {
                const creditor = creditors[i];
                const debtor = debtors[j];
                const amount = Math.min(creditor.amount, debtor.amount);
                if (amount > 1) transactions.push({ from: debtor.name, to: creditor.name, amount: Math.round(amount) });
                creditor.amount -= amount;
                debtor.amount -= amount;
                if (creditor.amount < 1) i++;
                if (debtor.amount < 1) j++;
            }

            let text = '💰 Trip Settlement Summary\n\n';
            transactions.forEach(tx => {
                text += `${tx.from} → ${tx.to}: ${formatCurrency(tx.amount)}\n`;
            });

            navigator.clipboard.writeText(text);
            showSuccessToast('Copied to clipboard!');
        }

        function exportSettlementsWhatsApp() {
            const balances = {};
            tripData.sharedExpenses.forEach(exp => {
                const paidBy = exp.paidBy;
                const amount = exp.amount || 0;
                const splitBetween = exp.splitBetween || [];
                if (!paidBy || splitBetween.length === 0 || amount === 0) return;
                const perPerson = amount / splitBetween.length;
                if (!balances[paidBy]) balances[paidBy] = 0;
                balances[paidBy] += amount;
                splitBetween.forEach(member => {
                    if (!balances[member]) balances[member] = 0;
                    balances[member] -= perPerson;
                });
            });

            const sorted = Object.entries(balances).sort((a, b) => b[1] - a[1]);
            const creditors = sorted.filter(([p, b]) => b > 1).map(([p, b]) => ({ name: p, amount: b }));
            const debtors = sorted.filter(([p, b]) => b < -1).map(([p, b]) => ({ name: p, amount: Math.abs(b) }));
            const transactions = [];
            let i = 0, j = 0;
            while (i < creditors.length && j < debtors.length) {
                const creditor = creditors[i];
                const debtor = debtors[j];
                const amount = Math.min(creditor.amount, debtor.amount);
                if (amount > 1) transactions.push({ from: debtor.name, to: creditor.name, amount: Math.round(amount) });
                creditor.amount -= amount;
                debtor.amount -= amount;
                if (creditor.amount < 1) i++;
                if (debtor.amount < 1) j++;
            }

            let text = '*💰 Trip Settlement*\n\n';
            transactions.forEach(tx => {
                text += `• ${tx.from} pays *${formatCurrency(tx.amount)}* to ${tx.to}\n`;
            });

            navigator.clipboard.writeText(text);
            showSuccessToast('WhatsApp format copied!');
        }

        // Destinations Functions
        function showDestinationType(type) {
            ['main', 'optional', 'other', 'restaurants'].forEach(t => {
                const elem = document.getElementById(t + 'Dest');
                const btn = document.getElementById(t + 'DestBtn');
                if (elem) elem.style.display = t === type ? 'block' : 'none';
                if (btn) {
                    btn.style.borderBottom = t === type ? '3px solid var(--primary)' : 'none';
                }
            });
        }

        function addDestination(type) {
            isLocalUpdate = true;
            if (!tripData.destinations[type]) tripData.destinations[type] = [];
            tripData.destinations[type].push({ 
                country: '', 
                city: '', 
                placeName: '', 
                mapsLink: '', 
                emoji: '📍',
                highlights: '', 
                notes: '', 
                expanded: true 
            });
            renderDestinations();
            saveData();
            setTimeout(() => { isLocalUpdate = false; }, 500);
        }

        function getEmojiName(emoji) {
            const names = {
                '📍': 'Location Pin', '🏛️': 'Museum/Monument', '🏰': 'Castle/Palace', '⛩️': 'Temple/Shrine',
                '🗼': 'Tower/Landmark', '⛪': 'Church', '🕌': 'Mosque', '🏟️': 'Stadium/Arena',
                '🏖️': 'Beach', '⛰️': 'Mountain', '🌋': 'Volcano', '🏞️': 'National Park',
                '🌊': 'Ocean/Sea', '🏜️': 'Desert', '🌲': 'Forest', '🎡': 'Theme Park',
                '🎢': 'Roller Coaster', '🎭': 'Theater/Show', '🎨': 'Art Gallery', '🎪': 'Circus/Festival',
                '🎬': 'Cinema', '🎤': 'Karaoke/Music', '🍜': 'Restaurant', '🍕': 'Pizza',
                '🍣': 'Sushi', '☕': 'Cafe/Coffee', '🍺': 'Bar/Pub', '🍰': 'Bakery/Dessert',
                '🥘': 'Local Cuisine', '🏨': 'Hotel', '🏠': 'House/Villa', '🏡': 'Cottage/Cabin',
                '⛺': 'Camping', '🛍️': 'Shopping Mall', '🏪': 'Store/Shop', '🎁': 'Gift Shop',
                '💎': 'Luxury Store', '✈️': 'Airport', '🚂': 'Train Station', '🚌': 'Bus Station',
                '🚢': 'Port/Harbor', '🚕': 'Taxi Stand'
            };
            return names[emoji] || 'Custom';
        }

        function renderDestinations() {
            ['main', 'optional', 'other', 'restaurants'].forEach(type => {
                const container = document.getElementById(type + 'DestContainer');
                if (!container) return;
                
                container.innerHTML = '';
                const dests = tripData.destinations[type] || [];

                // Group by country
                const byCountry = {};
                dests.forEach((dest, idx) => {
                    const country = dest.country || 'Other';
                    if (!byCountry[country]) byCountry[country] = [];
                    byCountry[country].push({ dest, idx });
                });

                // Render each country group
                Object.entries(byCountry).forEach(([country, items]) => {
                    const countryDiv = document.createElement('div');
                    countryDiv.style.cssText = 'margin-bottom: 20px;';

                    const countryExpanded = tripData.destinations[type + '_country_' + country] !== false;
                    const totalDays = items.reduce((sum, {dest}) => sum + countDaysInCity(dest.city), 0);

                    countryDiv.innerHTML = `
                        <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); 
                                    padding: 15px 20px; border-radius: var(--radius-md); cursor: pointer; 
                                    display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;"
                             onclick="toggleCountryGroup('${type}', '${country}')">
                            <div>
                                <h3 style="margin: 0; font-size: 1.2rem; display: inline-block;">🌍 ${country}</h3>
                                <span style="margin-left: 15px; opacity: 0.9; font-size: 0.9rem;">
                                    ${items.length} ${items.length === 1 ? 'city' : 'cities'}
                                    ${totalDays > 0 ? ' • ' + totalDays + ' days' : ''}
                                </span>
                            </div>
                            <span style="font-size: 1.2rem;" id="countryToggle_${type}_${country.replace(/\s/g, '_')}">
                                ${countryExpanded ? '▼' : '▶'}
                            </span>
                        </div>
                        <div id="countryContent_${type}_${country.replace(/\s/g, '_')}" 
                             style="display: ${countryExpanded ? 'block' : 'none'}; padding-left: 15px;">
                        </div>
                    `;
                    container.appendChild(countryDiv);

                    const countryContent = countryDiv.querySelector(`#countryContent_${type}_${country.replace(/\s/g, '_')}`);

                    // Group by city within country
                    const byCity = {};
                    items.forEach(({dest, idx}) => {
                        const city = dest.city || 'Unnamed City';
                        if (!byCity[city]) byCity[city] = [];
                        byCity[city].push({dest, idx});
                    });

                    // Render each city group
                    Object.entries(byCity).forEach(([city, cityItems]) => {
                        const cityExpanded = cityItems[0].dest.cityExpanded !== false;
                        const dayCount = countDaysInCity(city);

                        const cityGroupDiv = document.createElement('div');
                        cityGroupDiv.style.cssText = 'margin-bottom: 16px;';
                        cityGroupDiv.innerHTML = `
                            <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 15px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" 
                                 onclick="toggleCityGroup('${type}', '${city.replace(/'/g, "\\'")}')">
                                <div>
                                    <h4 style="margin: 0; color: var(--secondary); display: inline-block;">${city}</h4>
                                    <span style="margin-left: 15px; color: var(--text-secondary);">
                                        ${cityItems.length} ${cityItems.length === 1 ? 'place' : 'places'}
                                        ${dayCount > 0 ? ' • ' + dayCount + ' days' : ''}
                                    </span>
                                </div>
                                <span style="font-size: 1.2rem;" id="cityToggle_${type}_${city.replace(/\s/g, '_')}">
                                    ${cityExpanded ? '▼' : '▶'}
                                </span>
                            </div>
                            <div id="cityContent_${type}_${city.replace(/\s/g, '_')}" 
                                 style="display: ${cityExpanded ? 'block' : 'none'}; padding-left: 15px; padding-top: 10px;">
                            </div>
                        `;
                        countryContent.appendChild(cityGroupDiv);

                        const cityContent = cityGroupDiv.querySelector(`#cityContent_${type}_${city.replace(/\s/g, '_')}`);

                        // Render places within city
                        cityItems.forEach(({dest, idx}) => {
                            const isExpanded = dest.expanded !== false;

                            const placeDiv = document.createElement('div');
                            placeDiv.style.cssText = 'background: var(--bg-hover); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: 12px; overflow: hidden;';
                            placeDiv.innerHTML = `
                                <div style="padding: 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: var(--bg-main);" 
                                     onclick="toggleDestination('${type}', ${idx})">
                                    <div>
                                        <span style="font-size: 1.2rem; margin-right: 8px;">${dest.emoji || '📍'}</span>
                                        <strong style="color: var(--text-primary);">${dest.placeName || 'New Place'}</strong>
                                    </div>
                                    <div style="display: flex; gap: 10px; align-items: center;">
                                        <span style="font-size: 1rem;" id="destToggle_${type}_${idx}">${isExpanded ? '▼' : '▶'}</span>
                                        <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteDestination('${type}', ${idx}, this)">Delete</button>
                                    </div>
                                </div>
                                <div id="destContent_${type}_${idx}" style="display: ${isExpanded ? 'block' : 'none'}; padding: 20px;">
                                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                    <div>
                                        <label style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; display: block;">Icon</label>
                                        <select onchange="tripData.destinations['${type}'][${idx}].emoji = this.value.split(' ')[0]; saveDataSync(); renderDestinations()" 
                                                style="width: 100%; padding: 8px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary); font-size: 14px;">
                                            <option value="${dest.emoji || '📍'}" selected>${dest.emoji || '📍'} ${getEmojiName(dest.emoji || '📍')}</option>
                                            <optgroup label="Places">
                                                <option value="📍 Pin">📍 Location Pin</option>
                                                <option value="🏛️ Museum">🏛️ Museum/Monument</option>
                                                <option value="🏰 Castle">🏰 Castle/Palace</option>
                                                <option value="⛩️ Temple">⛩️ Temple/Shrine</option>
                                                <option value="🗼 Tower">🗼 Tower/Landmark</option>
                                                <option value="⛪ Church">⛪ Church</option>
                                                <option value="🕌 Mosque">🕌 Mosque</option>
                                                <option value="🏟️ Stadium">🏟️ Stadium/Arena</option>
                                            </optgroup>
                                            <optgroup label="Nature">
                                                <option value="🏖️ Beach">🏖️ Beach</option>
                                                <option value="⛰️ Mountain">⛰️ Mountain</option>
                                                <option value="🌋 Volcano">🌋 Volcano</option>
                                                <option value="🏞️ Park">🏞️ National Park</option>
                                                <option value="🌊 Ocean">🌊 Ocean/Sea</option>
                                                <option value="🏜️ Desert">🏜️ Desert</option>
                                                <option value="🌲 Forest">🌲 Forest</option>
                                            </optgroup>
                                            <optgroup label="Activities">
                                                <option value="🎡 Park">🎡 Theme Park</option>
                                                <option value="🎢 Ride">🎢 Roller Coaster</option>
                                                <option value="🎭 Theater">🎭 Theater/Show</option>
                                                <option value="🎨 Art">🎨 Art Gallery</option>
                                                <option value="🎪 Circus">🎪 Circus/Festival</option>
                                                <option value="🎬 Cinema">🎬 Cinema</option>
                                                <option value="🎤 Karaoke">🎤 Karaoke/Music</option>
                                            </optgroup>
                                            <optgroup label="Food & Drink">
                                                <option value="🍜 Restaurant">🍜 Restaurant</option>
                                                <option value="🍕 Pizza">🍕 Pizza</option>
                                                <option value="🍣 Sushi">🍣 Sushi</option>
                                                <option value="☕ Cafe">☕ Cafe/Coffee</option>
                                                <option value="🍺 Bar">🍺 Bar/Pub</option>
                                                <option value="🍰 Bakery">🍰 Bakery/Dessert</option>
                                                <option value="🥘 Local">🥘 Local Cuisine</option>
                                            </optgroup>
                                            <optgroup label="Accommodation">
                                                <option value="🏨 Hotel">🏨 Hotel</option>
                                                <option value="🏠 House">🏠 House/Villa</option>
                                                <option value="🏡 Cottage">🏡 Cottage/Cabin</option>
                                                <option value="⛺ Camp">⛺ Camping</option>
                                            </optgroup>
                                            <optgroup label="Shopping">
                                                <option value="🛍️ Shopping">🛍️ Shopping Mall</option>
                                                <option value="🏪 Store">🏪 Store/Shop</option>
                                                <option value="🎁 Gift">🎁 Gift Shop</option>
                                                <option value="💎 Luxury">💎 Luxury Store</option>
                                            </optgroup>
                                            <optgroup label="Transport">
                                                <option value="✈️ Airport">✈️ Airport</option>
                                                <option value="🚂 Train">🚂 Train Station</option>
                                                <option value="🚌 Bus">🚌 Bus Station</option>
                                                <option value="🚢 Port">🚢 Port/Harbor</option>
                                                <option value="🚕 Taxi">🚕 Taxi Stand</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div>
                                        <label style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; display: block;">Country</label>
                                        <input type="text" value="${dest.country || ''}" placeholder="Germany" 
                                               style="width: 100%; padding: 8px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary);"
                                               oninput="if(tripData.destinations['${type}'][${idx}]) tripData.destinations['${type}'][${idx}].country = this.value"
                                               onblur="saveDataSync(); renderDestinations()">
                                    </div>
                                    <div>
                                        <label style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; display: block;">City</label>
                                        <input type="text" value="${dest.city || ''}" placeholder="Berlin" 
                                               style="width: 100%; padding: 8px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary);"
                                               oninput="if(tripData.destinations['${type}'][${idx}]) tripData.destinations['${type}'][${idx}].city = this.value"
                                               onblur="saveDataSync(); renderDestinations(); updateOverviewSummary()">
                                    </div>
                                    <div>
                                        <label style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; display: block;">Place Name</label>
                                        <input type="text" value="${dest.placeName || ''}" placeholder="Brandenburg Gate" 
                                               style="width: 100%; padding: 8px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary);"
                                               oninput="if(tripData.destinations['${type}'][${idx}]) tripData.destinations['${type}'][${idx}].placeName = this.value"
                                               onblur="saveDataSync()">
                                    </div>
                                    <div>
                                        <label style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; display: block;">Google Maps Link</label>
                                        <input type="text" value="${dest.mapsLink || ''}" placeholder="Paste URL" 
                                               style="width: 100%; padding: 8px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary);"
                                               oninput="if(tripData.destinations['${type}'][${idx}]) tripData.destinations['${type}'][${idx}].mapsLink = this.value"
                                               onblur="saveDataSync()">
                                    </div>
                                </div>
                                <div style="margin-top: 12px;">
                                    <label style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; display: block;">Highlights / Things to Do</label>
                                    <textarea oninput="autoResize(this); tripData.destinations['${type}'][${idx}].highlights = this.value; saveData()" 
                                              style="width: 100%; padding: 8px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary); min-height: 60px;">${dest.highlights || ''}</textarea>
                                </div>
                                <div style="margin-top: 12px;">
                                    <label style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; display: block;">Notes</label>
                                    <textarea oninput="autoResize(this); tripData.destinations['${type}'][${idx}].notes = this.value; saveData()" 
                                              style="width: 100%; padding: 8px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary); min-height: 60px;">${dest.notes || ''}</textarea>
                                </div>
                            </div>
                        `;
                        cityContent.appendChild(placeDiv);
                        });
                    });
                });

                if (dests.length === 0) {
                    container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">No destinations yet. Click + Add to get started!</p>';
                }
            });
        }

        function toggleCountryGroup(type, country) {
            const key = type + '_country_' + country;
            const content = document.getElementById(`countryContent_${type}_${country.replace(/\s/g, '_')}`);
            const toggle = document.getElementById(`countryToggle_${type}_${country.replace(/\s/g, '_')}`);

            if (content && toggle) {
                const isExpanded = content.style.display !== 'none';
                content.style.display = isExpanded ? 'none' : 'block';
                toggle.textContent = isExpanded ? '▶' : '▼';
                tripData.destinations[key] = !isExpanded;
                saveData();
            }
        }

        function toggleCityGroup(type, city) {
            const content = document.getElementById(`cityContent_${type}_${city.replace(/\s/g, '_')}`);
            const toggle = document.getElementById(`cityToggle_${type}_${city.replace(/\s/g, '_')}`);

            if (content && toggle) {
                const isExpanded = content.style.display !== 'none';
                content.style.display = isExpanded ? 'none' : 'block';
                toggle.textContent = isExpanded ? '▶' : '▼';
                // Store state in first destination with this city
                const dests = tripData.destinations[type] || [];
                const firstDest = dests.find(d => d.city === city);
                if (firstDest) {
                    firstDest.cityExpanded = !isExpanded;
                    saveData();
                }
            }
        }

        function toggleDestination(type, idx) {
            const content = document.getElementById(`destContent_${type}_${idx}`);
            const toggle = document.getElementById(`destToggle_${type}_${idx}`);

            if (content && toggle) {
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    toggle.textContent = '▼';
                    tripData.destinations[type][idx].expanded = true;
                } else {
                    content.style.display = 'none';
                    toggle.textContent = '▶';
                    tripData.destinations[type][idx].expanded = false;
                }
                saveData();
            }
        }

        function countDaysInCity(city) {
            if (!city || !tripData.dayPlans) return 0;
            return tripData.dayPlans.filter(day => day.city === city).length;
        }

        async function deleteDestination(type, idx, btn) {
            if (btn.textContent === 'Delete') {
                btn.textContent = 'Confirm?';
                btn.style.background = '#dc2626';
                setTimeout(() => { if (btn.textContent === 'Confirm?') { btn.textContent = 'Delete'; btn.style.background = ''; } }, 3000);
            } else {
                isLocalUpdate = true;
                tripData.destinations[type].splice(idx, 1);
                renderDestinations();
                await saveData();
                setTimeout(() => { isLocalUpdate = false; }, 500);
            }
        }

        // Itinerary Functions
        function addDayPlan() {
            let newDate = '';
            const depDate = document.getElementById('departureDate').value;
            if (depDate) {
                const d = new Date(depDate);
                d.setDate(d.getDate() + tripData.dayPlans.length);
                newDate = d.toISOString().split('T')[0];
            }

            tripData.dayPlans.push({ 
                day: tripData.dayPlans.length + 1, 
                date: newDate, 
                city: '', 
                activities: [{ timeStart: '09:00', timeEnd: '10:00', activity: '', type: 'Activity', location: '', notes: '' }]
            });
            renderDayPlans();
            saveData();
        }

        // ITINERARY CONFLICT DETECTION
        function detectItineraryConflicts() {
            const conflicts = [];
            
            tripData.dayPlans.forEach((day, dayIdx) => {
                const activities = day.activities || [];
                
                // Check each activity
                activities.forEach((act, actIdx) => {
                    if (!act.timeStart || !act.timeEnd) return;
                    
                    const startMinutes = timeToMinutes(act.timeStart);
                    const endMinutes = timeToMinutes(act.timeEnd);
                    
                    // Conflict 1: End time before start time
                    if (endMinutes <= startMinutes) {
                        conflicts.push({
                            dayIdx,
                            actIdx,
                            type: 'invalid_time',
                            severity: 'high',
                            message: `${act.activity || 'Activity'}: End time (${act.timeEnd}) is before/same as start time (${act.timeStart})`
                        });
                    }
                    
                    // Conflict 2: Overlapping with next activity
                    if (actIdx < activities.length - 1) {
                        const nextAct = activities[actIdx + 1];
                        if (nextAct.timeStart) {
                            const nextStartMinutes = timeToMinutes(nextAct.timeStart);
                            const gap = nextStartMinutes - endMinutes;
                            
                            // Overlap
                            if (gap < 0) {
                                conflicts.push({
                                    dayIdx,
                                    actIdx,
                                    type: 'overlap',
                                    severity: 'high',
                                    message: `${act.activity || 'Activity'} overlaps with ${nextAct.activity || 'next activity'} by ${Math.abs(gap)} minutes`
                                });
                            }
                            // No gap between activities (might need travel time)
                            else if (gap === 0 && act.location && nextAct.location && act.location !== nextAct.location) {
                                conflicts.push({
                                    dayIdx,
                                    actIdx,
                                    type: 'no_travel_time',
                                    severity: 'medium',
                                    message: `No travel time between "${act.location}" and "${nextAct.location}"`
                                });
                            }
                            // Very tight gap (< 15 min between different locations)
                            else if (gap < 15 && act.location && nextAct.location && act.location !== nextAct.location) {
                                conflicts.push({
                                    dayIdx,
                                    actIdx,
                                    type: 'tight_schedule',
                                    severity: 'low',
                                    message: `Only ${gap} minutes between activities at different locations`
                                });
                            }
                        }
                    }
                    
                    // Conflict 3: Very long activity (>6 hours)
                    const duration = endMinutes - startMinutes;
                    if (duration > 360 && act.type !== 'Rest') {
                        conflicts.push({
                            dayIdx,
                            actIdx,
                            type: 'long_activity',
                            severity: 'low',
                            message: `${act.activity || 'Activity'} is ${Math.floor(duration/60)}h ${duration%60}m long - might be too ambitious`
                        });
                    }
                    
                    // Conflict 4: Activities starting too early or too late
                    if (startMinutes < 360) { // Before 6am
                        conflicts.push({
                            dayIdx,
                            actIdx,
                            type: 'early_start',
                            severity: 'low',
                            message: `${act.activity || 'Activity'} starts at ${act.timeStart} - very early morning`
                        });
                    }
                    if (endMinutes > 1380) { // After 11pm
                        conflicts.push({
                            dayIdx,
                            actIdx,
                            type: 'late_end',
                            severity: 'low',
                            message: `${act.activity || 'Activity'} ends at ${act.timeEnd} - very late night`
                        });
                    }
                });
                
                // Conflict 5: Check against bookings
                if (tripData.bookings) {
                    tripData.bookings.forEach(booking => {
                        if (!booking.datetime || booking.status === 'Cancelled') return;
                        
                        const bookingDate = booking.datetime.split('T')[0];
                        if (bookingDate !== day.date) return;
                        
                        const bookingTime = booking.datetime.split('T')[1]?.substring(0, 5);
                        if (!bookingTime) return;
                        
                        const bookingMinutes = timeToMinutes(bookingTime);
                        
                        // Check if any activity overlaps with booking
                        activities.forEach((act, actIdx) => {
                            if (!act.timeStart || !act.timeEnd) return;
                            const actStart = timeToMinutes(act.timeStart);
                            const actEnd = timeToMinutes(act.timeEnd);
                            
                            if (bookingMinutes >= actStart && bookingMinutes < actEnd) {
                                conflicts.push({
                                    dayIdx,
                                    actIdx,
                                    type: 'booking_conflict',
                                    severity: 'high',
                                    message: `${booking.type} booking "${booking.name}" at ${bookingTime} conflicts with ${act.activity || 'activity'}`
                                });
                            }
                        });
                    });
                }
            });
            
            return conflicts;
        }

        function timeToMinutes(timeStr) {
            if (!timeStr) return 0;
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        }

        function minutesToTime(minutes) {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        }

        function formatTimeInput(input) {
            let value = input.value.replace(/[^\d]/g, ''); // Remove non-digits
            
            // Auto-format as user types
            if (value.length >= 2) {
                let hours = value.substring(0, 2);
                let minutes = value.substring(2, 4);
                
                // Limit hours to 23
                if (parseInt(hours) > 23) hours = '23';
                // Limit minutes to 59
                if (minutes && parseInt(minutes) > 59) minutes = '59';
                
                value = hours + (minutes ? ':' + minutes : '');
            }
            
            input.value = value;
            
            // If user clears completely, set to 00:00
            if (input.value === '') {
                input.value = '00:00';
            }
        }

        function renderDayPlans() {
            const container = document.getElementById('dayPlansContainer');
            container.innerHTML = '';
            
            // Detect conflicts first
            const conflicts = detectItineraryConflicts();
            
            // Update stats
            const totalDays = tripData.dayPlans.length;
            const totalActivities = tripData.dayPlans.reduce((sum, day) => sum + (day.activities?.length || 0), 0);
            document.getElementById('totalDaysCount').textContent = totalDays;
            document.getElementById('totalActivitiesCount').textContent = totalActivities;
            document.getElementById('conflictsCount').textContent = conflicts.length;
            document.getElementById('conflictsCount').style.color = conflicts.length > 0 ? 'var(--danger)' : 'var(--success)';

            tripData.dayPlans.forEach((plan, idx) => {
                const dayConflicts = conflicts.filter(c => c.dayIdx === idx);
                const totalMinutes = (plan.activities || []).reduce((sum, act) => {
                    if (!act.timeStart || !act.timeEnd) return sum;
                    return sum + (timeToMinutes(act.timeEnd) - timeToMinutes(act.timeStart));
                }, 0);
                const hours = Math.floor(totalMinutes / 60);
                const mins = totalMinutes % 60;
                
                const div = document.createElement('div');
                div.setAttribute('data-day-idx', idx);
                div.style.cssText = `
                    background: var(--glass-bg);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-lg);
                    margin-bottom: 20px;
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s;
                `;
                
                div.innerHTML = `
                    <!-- Day number badge -->
                    <div style="position: absolute; top: 16px; right: 16px; width: 60px; height: 60px; 
                                background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);">
                        <span style="font-size: 24px; font-weight: 700; color: white;">${plan.day}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-right: 80px;">
                        <div>
                            <h3 style="font-size: 24px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">
                                ${plan.city || 'Unnamed City'}
                            </h3>
                            <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
                                <span style="font-size: 14px; color: var(--text-secondary);">📅 ${plan.date || 'No date'}</span>
                                <span style="font-size: 14px; color: var(--text-secondary);">⏱️ ${hours}h ${mins}m planned</span>
                                <span style="font-size: 14px; color: var(--text-secondary);">📍 ${plan.activities?.length || 0} stops</span>
                            </div>
                        </div>
                    </div>
                    
                    ${dayConflicts.length > 0 ? `
                        <div style="background: ${dayConflicts.some(c => c.severity === 'high') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; 
                                    border-left: 4px solid ${dayConflicts.some(c => c.severity === 'high') ? 'var(--danger)' : 'var(--warning)'}; 
                                    border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                            <div style="font-weight: 600; margin-bottom: 12px; color: ${dayConflicts.some(c => c.severity === 'high') ? 'var(--danger)' : 'var(--warning)'}; font-size: 15px;">
                                ⚠️ ${dayConflicts.length} Scheduling Issue${dayConflicts.length > 1 ? 's' : ''} Detected
                            </div>
                            ${dayConflicts.slice(0, 3).map(c => `
                                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px; padding-left: 20px; position: relative;">
                                    <span style="position: absolute; left: 0;">•</span>
                                    ${c.message}
                                </div>
                            `).join('')}
                            ${dayConflicts.length > 3 ? `<div style="font-size: 12px; color: var(--text-tertiary); margin-top: 8px; padding-left: 20px;">+${dayConflicts.length - 3} more</div>` : ''}
                        </div>
                    ` : ''}
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; margin-bottom: 20px;">
                        <div>
                            <label style="font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;">Date</label>
                            <input type="date" value="${plan.date}" 
                                   style="width: 100%; padding: 12px; background: rgba(15, 15, 35, 0.6); border: 1px solid var(--border); 
                                          border-radius: 8px; color: var(--text-primary); font-size: 14px;"
                                   onchange="tripData.dayPlans[${idx}].date = this.value; saveDataSync(); renderDayPlans()">
                        </div>
                        <div>
                            <label style="font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;">City</label>
                            <input type="text" value="${plan.city}" 
                                   style="width: 100%; padding: 12px; background: rgba(15, 15, 35, 0.6); border: 1px solid var(--border); 
                                          border-radius: 8px; color: var(--text-primary); font-size: 14px;"
                                   onchange="tripData.dayPlans[${idx}].city = this.value; saveDataSync(); renderDayPlans(); updateOverviewSummary()">
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 12px; margin-bottom: 20px;">
                        <button class="btn btn-success btn-sm" onclick="addActivity(${idx})" style="flex: 1;">+ Add Activity</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteDayPlan(${idx}, this)">🗑️ Delete Day</button>
                    </div>
                    
                    <!-- Timeline connector -->
                    <div style="position: relative; padding-left: 32px;">
                        <div style="position: absolute; left: 12px; top: 0; bottom: 0; width: 2px; 
                                    background: linear-gradient(180deg, var(--primary) 0%, var(--secondary) 100%);"></div>
                        <div id="activities${idx}"></div>
                    </div>
                `;
                container.appendChild(div);

                const activitiesDiv = div.querySelector(`#activities${idx}`);
                plan.activities.forEach((act, actIdx) => {
                    const actConflicts = dayConflicts.filter(c => c.actIdx === actIdx);
                    const hasConflict = actConflicts.length > 0;
                    const highSeverity = actConflicts.some(c => c.severity === 'high');
                    
                    const actDiv = document.createElement('div');
                    actDiv.style.cssText = `
                        background: rgba(15, 15, 35, 0.8);
                        backdrop-filter: blur(10px);
                        padding: 16px;
                        border-radius: 12px;
                        margin-bottom: 16px;
                        border: 1px solid ${hasConflict ? (highSeverity ? 'var(--danger)' : 'var(--warning)') : 'var(--border)'};
                        position: relative;
                        transition: all 0.2s;
                    `;
                    
                    // Activity type emoji
                    const typeEmoji = {
                        'Activity': '🎯',
                        'Food': '🍽️',
                        'Transport': '🚗',
                        'Rest': '😴',
                        'Shopping': '🛍️'
                    }[act.type] || '📌';
                    
                    actDiv.innerHTML = `
                        <!-- Timeline dot -->
                        <div style="position: absolute; left: -28px; top: 24px; width: 16px; height: 16px; 
                                    background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                    border-radius: 50%; border: 3px solid var(--bg-main);
                                    box-shadow: 0 0 0 2px var(--border);"></div>
                        
                        ${hasConflict ? `
                            <div style="background: ${highSeverity ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'}; 
                                        padding: 12px; border-radius: 8px; margin-bottom: 12px; font-size: 13px;
                                        border-left: 3px solid ${highSeverity ? 'var(--danger)' : 'var(--warning)'}";">
                                ${actConflicts.map(c => `<div style="color: ${c.severity === 'high' ? 'var(--danger)' : 'var(--warning)'}; margin-bottom: 4px;">⚠️ ${c.message}</div>`).join('')}
                            </div>
                        ` : ''}
                        
                        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
                            <span style="font-size: 28px;">${typeEmoji}</span>
                            <div style="flex: 1;">
                                <input type="text" value="${act.activity || ''}" placeholder="What are you doing?" 
                                       style="width: 100%; padding: 10px; background: rgba(26, 26, 46, 0.6); border: 1px solid var(--border); 
                                              border-radius: 8px; color: var(--text-primary); font-size: 15px; font-weight: 500;"
                                       onchange="tripData.dayPlans[${idx}].activities[${actIdx}].activity = this.value; saveDataSync()">
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 90px 90px 1fr auto; gap: 12px; align-items: center; margin-bottom: 12px;">
                            <input type="text" value="${act.timeStart}" placeholder="09:00" maxlength="5"
                                   style="padding: 10px; background: rgba(26, 26, 46, 0.6); border: 1px solid var(--border); 
                                          border-radius: 8px; color: var(--text-primary); text-align: center; font-weight: 600;"
                                   oninput="formatTimeInput(this)"
                                   onchange="tripData.dayPlans[${idx}].activities[${actIdx}].timeStart = this.value; saveDataSync(); renderDayPlans()">
                            <input type="text" value="${act.timeEnd}" placeholder="10:00" maxlength="5"
                                   style="padding: 10px; background: rgba(26, 26, 46, 0.6); border: 1px solid var(--border); 
                                          border-radius: 8px; color: var(--text-primary); text-align: center; font-weight: 600;"
                                   oninput="formatTimeInput(this)"
                                   onchange="tripData.dayPlans[${idx}].activities[${actIdx}].timeEnd = this.value; saveDataSync(); renderDayPlans()">
                            <select style="padding: 10px; background: rgba(26, 26, 46, 0.6); border: 1px solid var(--border); 
                                           border-radius: 8px; color: var(--text-primary);"
                                    onchange="tripData.dayPlans[${idx}].activities[${actIdx}].type = this.value; saveDataSync(); renderDayPlans()">
                                ${['Activity', 'Food', 'Transport', 'Rest', 'Shopping'].map(t => 
                                    `<option ${act.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                            </select>
                            <button class="btn btn-danger btn-sm" onclick="deleteActivity(${idx}, ${actIdx}, this)" 
                                    style="padding: 10px 14px;">✕</button>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 16px;">📍</span>
                                <input type="text" value="${act.location || ''}" placeholder="Location" 
                                       style="flex: 1; padding: 8px 12px; background: rgba(26, 26, 46, 0.6); border: 1px solid var(--border); 
                                              border-radius: 8px; color: var(--text-primary); font-size: 13px;"
                                       onchange="tripData.dayPlans[${idx}].activities[${actIdx}].location = this.value; saveDataSync(); renderDayPlans()">
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 16px;">📝</span>
                                <input type="text" value="${act.notes || ''}" placeholder="Notes" 
                                       style="flex: 1; padding: 8px 12px; background: rgba(26, 26, 46, 0.6); border: 1px solid var(--border); 
                                              border-radius: 8px; color: var(--text-primary); font-size: 13px;"
                                       onchange="tripData.dayPlans[${idx}].activities[${actIdx}].notes = this.value; saveDataSync()">
                            </div>
                        </div>
                    `;
                    activitiesDiv.appendChild(actDiv);
                });
            });
        }

        function addActivity(dayIdx) {
            const lastAct = tripData.dayPlans[dayIdx].activities[tripData.dayPlans[dayIdx].activities.length - 1];
            let nextStart = '09:00';
            let nextEnd = '10:00';

            if (lastAct && lastAct.timeEnd) {
                nextStart = lastAct.timeEnd;
                const [h, m] = lastAct.timeEnd.split(':');
                const nextHour = (parseInt(h) + 1) % 24;
                nextEnd = String(nextHour).padStart(2, '0') + ':' + m;
            }

            tripData.dayPlans[dayIdx].activities.push({
                timeStart: nextStart,
                timeEnd: nextEnd,
                activity: '',
                type: 'Activity',
                location: '',
                notes: ''
            });
            renderDayPlans();
            saveData();
        }

        async function deleteActivity(dayIdx, actIdx, btn) {
            if (btn.textContent === '✕') {
                btn.textContent = '?';
                btn.style.background = '#dc2626';
                setTimeout(() => { if (btn.textContent === '?') { btn.textContent = '✕'; btn.style.background = ''; } }, 3000);
            } else {
                isLocalUpdate = true;
                tripData.dayPlans[dayIdx].activities.splice(actIdx, 1);
                renderDayPlans();
                await saveData();
                setTimeout(() => { isLocalUpdate = false; }, 500);
            }
        }

        async function deleteDayPlan(idx, btn) {
            if (btn.textContent === 'Delete') {
                btn.textContent = 'Confirm?';
                btn.style.background = '#dc2626';
                setTimeout(() => { if (btn.textContent === 'Confirm?') { btn.textContent = 'Delete'; btn.style.background = ''; } }, 3000);
            } else {
                isLocalUpdate = true;
                tripData.dayPlans.splice(idx, 1);
                tripData.dayPlans.forEach((p, i) => p.day = i + 1);
                renderDayPlans();
                await saveData();
                setTimeout(() => { isLocalUpdate = false; }, 500);
            }
        }

        // Map Functions
        let map = null;
        window.mapInitialized = false;

        let routeLines = [];
        let distanceSelectionMode = false;
        let selectedPoints = [];
        let distanceMarkers = [];
        let selectionOverlay = null;

        function initMap() {
            if (typeof L === 'undefined') {
                setTimeout(initMap, 100);
                return;
            }

            if (!map) {
                map = L.map('tripMap').setView([51.1657, 10.4515], 6);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap',
                    maxZoom: 19
                }).addTo(map);

                window.mapInitialized = true;
            }
            
            // Populate selectors
            populateCountrySelector();
            populateDaySelector();
            
            // Plot destinations after map loads
            updateMapView();
        }

        function populateCountrySelector() {
            const countries = new Set();
            ['main', 'optional', 'other', 'restaurants'].forEach(type => {
                (tripData.destinations[type] || []).forEach(dest => {
                    if (dest.country) countries.add(dest.country);
                });
            });
            
            const select = document.getElementById('mapCountryFilter');
            const currentValue = select.value;
            select.innerHTML = '<option value="all">All Countries</option>';
            
            Array.from(countries).sort().forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                select.appendChild(option);
            });
            
            select.value = currentValue;
        }
        
        function populateDaySelector() {
            const select = document.getElementById('mapDayFilter');
            const currentValue = select.value;
            select.innerHTML = '<option value="all">All Days</option>';
            
            if (tripData.dayPlans && tripData.dayPlans.length > 0) {
                tripData.dayPlans.forEach((day, idx) => {
                    const option = document.createElement('option');
                    option.value = idx;
                    option.textContent = `Day ${day.day} - ${day.date || 'No date'}`;
                    select.appendChild(option);
                });
            }
            
            select.value = currentValue;
        }

        function refreshMap() {
            if (map) {
                map.invalidateSize();
                populateCountrySelector();
                populateDaySelector();
                updateMapView();
            }
        }
        
        function centerMapOnDestinations() {
            if (!map) return;
            const markers = [];
            
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    markers.push(layer.getLatLng());
                }
            });
            
            if (markers.length > 0) {
                map.fitBounds(markers);
            }
        }
        
        function selectTwoPoints() {
            distanceSelectionMode = true;
            selectedPoints = [];
            clearDistanceMarkers();
            
            // Show overlay
            if (!selectionOverlay) {
                selectionOverlay = document.createElement('div');
                selectionOverlay.style.cssText = `
                    position: fixed;
                    top: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                    color: white;
                    padding: 20px 30px;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    z-index: 10000;
                    font-size: 16px;
                    font-weight: 600;
                    text-align: center;
                    animation: slideDown 0.3s ease;
                `;
                document.body.appendChild(selectionOverlay);
            }
            selectionOverlay.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="font-size: 32px;">📍</div>
                    <div>
                        <div id="selectionMessage" style="font-size: 18px; margin-bottom: 4px;">Click to select FIRST point</div>
                        <div style="font-size: 14px; opacity: 0.9;">Select 2 markers to calculate distance</div>
                    </div>
                    <button onclick="clearDistanceSelection()" 
                            style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; 
                                   border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">
                        Cancel
                    </button>
                </div>
            `;
            selectionOverlay.style.display = 'block';
        }
        
        function clearDistanceSelection() {
            distanceSelectionMode = false;
            selectedPoints = [];
            clearDistanceMarkers();
            document.getElementById('distanceResult').style.display = 'none';
            if (selectionOverlay) {
                selectionOverlay.style.display = 'none';
            }
        }
        
        function clearDistanceMarkers() {
            distanceMarkers.forEach(m => map.removeLayer(m));
            distanceMarkers = [];
        }
        
        function calculateDistance(latlng1, latlng2) {
            // Haversine formula
            const R = 6371; // Earth radius in km
            const dLat = (latlng2[0] - latlng1[0]) * Math.PI / 180;
            const dLon = (latlng2[1] - latlng1[1]) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(latlng1[0] * Math.PI / 180) * Math.cos(latlng2[0] * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }
        
        async function showDistanceInfo(point1, point2) {
            const distance = calculateDistance(point1.coords, point2.coords);
            const distanceDiv = document.getElementById('distanceResult');
            const contentDiv = document.getElementById('distanceContent');
            
            // Clear numbered markers first
            distanceMarkers.forEach(m => map.removeLayer(m));
            distanceMarkers = [];
            
            // Draw temporary line between points
            const tempLine = L.polyline([point1.coords, point2.coords], {
                color: '#6366f1',
                weight: 4,
                opacity: 0.8,
                dashArray: '10, 5'
            }).addTo(map);
            distanceMarkers.push(tempLine);
            
            // Show loading state
            contentDiv.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                    <div style="color: var(--text-secondary);">Fetching real route data...</div>
                </div>
            `;
            distanceDiv.style.display = 'block';
            
            // Fetch real route data from OSRM (no CORS issues!)
            try {
                const routes = await Promise.all([
                    fetchRealRoute(point1.coords, point2.coords, 'driving'),
                    fetchRealRoute(point1.coords, point2.coords, 'foot'),
                    fetchRealRoute(point1.coords, point2.coords, 'bike')
                ]);
                
                const [drivingRoute, walkingRoute, cyclingRoute] = routes;
                
                // Remove temporary line
                distanceMarkers.forEach(m => map.removeLayer(m));
                distanceMarkers = [];
                
                // Draw real route if available
                if (drivingRoute && drivingRoute.geometry) {
                    const latlngs = drivingRoute.geometry.map(coord => [coord[1], coord[0]]);
                    const routeLine = L.polyline(latlngs, {
                        color: '#6366f1',
                        weight: 4,
                        opacity: 0.8
                    }).addTo(map);
                    distanceMarkers.push(routeLine);
                } else {
                    // Keep temporary line
                    distanceMarkers.push(tempLine);
                }
                
                // Use real data if available, otherwise fall back to estimates
                const travelTime = {
                    walking: walkingRoute ? Math.round(walkingRoute.duration / 60) : Math.round(distance / 5 * 60),
                    driving: drivingRoute ? Math.round(drivingRoute.duration / 60) : Math.round(distance / 60 * 60),
                    cycling: cyclingRoute ? Math.round(cyclingRoute.duration / 60) : Math.round(distance / 15 * 60)
                };
                
                const actualDistance = drivingRoute ? (drivingRoute.distance / 1000).toFixed(2) : distance.toFixed(2);
                
                const estimatedCost = {
                    taxi: (actualDistance * 1.5).toFixed(2),
                    uber: (actualDistance * 1.2).toFixed(2),
                    transit: '2-5'
                };
                
                // Transportation recommendations based on distance
                let recommendations = [];
                if (actualDistance < 2) {
                    recommendations = [
                        {icon: '🚶', name: 'Walking', reason: 'Short distance, enjoy the scenery', time: travelTime.walking},
                        {icon: '🚴', name: 'Bike/Scooter', reason: 'Quick and eco-friendly', time: travelTime.cycling},
                        {icon: '🚕', name: 'Taxi', reason: 'If carrying luggage', time: travelTime.driving}
                    ];
                } else if (actualDistance < 10) {
                    recommendations = [
                        {icon: '🚇', name: 'Public Transit', reason: 'Most economical option', time: Math.round(actualDistance / 40 * 60)},
                        {icon: '🚗', name: 'Uber/Grab', reason: 'Door-to-door convenience', time: travelTime.driving},
                        {icon: '🚴', name: 'Bike', reason: 'Healthy and flexible', time: travelTime.cycling}
                    ];
                } else {
                    recommendations = [
                        {icon: '🚗', name: 'Car/Taxi', reason: 'Fastest option', time: travelTime.driving},
                        {icon: '🚇', name: 'Train/Bus', reason: 'Most affordable', time: Math.round(actualDistance / 40 * 60)},
                        {icon: '✈️', name: 'Flight', reason: 'Consider if >200km', time: '~2 hrs'}
                    ];
                }
                
                contentDiv.innerHTML = `
                    <div style="display: grid; gap: 20px;">
                        <div>
                            <h3 style="margin: 0 0 8px 0; color: var(--primary); font-size: 15px;">From: ${point1.name}</h3>
                            <h3 style="margin: 0 0 16px 0; color: var(--secondary); font-size: 15px;">To: ${point2.name}</h3>
                            <div style="font-size: 32px; font-weight: 700; color: var(--text-primary); 
                                        background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1));
                                        padding: 20px; border-radius: 12px; text-align: center;
                                        border: 2px solid var(--primary);">
                                📏 ${actualDistance} km
                            </div>
                            ${drivingRoute ? '<div style="text-align: center; margin-top: 8px; font-size: 12px; color: var(--success);">✓ Real route data</div>' : '<div style="text-align: center; margin-top: 8px; font-size: 12px; color: var(--text-tertiary);">⚠️ Estimated (straight line)</div>'}
                        </div>
                        
                        <div style="background: var(--bg-hover); padding: 16px; border-radius: 8px;">
                            <h4 style="margin: 0 0 12px 0; color: var(--text-secondary); font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                🎯 Recommended Transport
                            </h4>
                            <div style="display: grid; gap: 10px;">
                                ${recommendations.map((rec, idx) => `
                                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px; 
                                                background: ${idx === 0 ? 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))' : 'var(--bg-main)'}; 
                                                border-radius: 6px; border-left: 3px solid ${idx === 0 ? 'var(--primary)' : 'transparent'};">
                                        <div style="font-size: 28px;">${rec.icon}</div>
                                        <div style="flex: 1;">
                                            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 2px;">${rec.name}</div>
                                            <div style="font-size: 12px; color: var(--text-secondary);">${rec.reason}</div>
                                        </div>
                                        <div style="text-align: right;">
                                            <div style="font-weight: 600; color: var(--primary);">${rec.time} min</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div style="background: var(--bg-hover); padding: 16px; border-radius: 8px;">
                            <h4 style="margin: 0 0 12px 0; color: var(--text-secondary); font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                ⏱️ Travel Time Details
                            </h4>
                            <div style="display: grid; gap: 10px;">
                                <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--bg-main); border-radius: 6px;">
                                    <span style="color: var(--text-secondary);">🚶 Walking:</span>
                                    <strong style="color: var(--text-primary);">${travelTime.walking} min</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--bg-main); border-radius: 6px;">
                                    <span style="color: var(--text-secondary);">🚴 Cycling:</span>
                                    <strong style="color: var(--text-primary);">${travelTime.cycling} min</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--bg-main); border-radius: 6px;">
                                    <span style="color: var(--text-secondary);">🚗 Driving:</span>
                                    <strong style="color: var(--text-primary);">${travelTime.driving} min</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: var(--bg-hover); padding: 16px; border-radius: 8px;">
                            <h4 style="margin: 0 0 12px 0; color: var(--text-secondary); font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                💰 Estimated Costs
                            </h4>
                            <div style="display: grid; gap: 10px;">
                                <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--bg-main); border-radius: 6px;">
                                    <span style="color: var(--text-secondary);">🚕 Taxi:</span>
                                    <strong style="color: var(--warning);">$${estimatedCost.taxi}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--bg-main); border-radius: 6px;">
                                    <span style="color: var(--text-secondary);">🚗 Uber/Grab:</span>
                                    <strong style="color: var(--success);">$${estimatedCost.uber}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--bg-main); border-radius: 6px;">
                                    <span style="color: var(--text-secondary);">🚇 Public Transit:</span>
                                    <strong style="color: var(--primary);">$${estimatedCost.transit}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div style="font-size: 12px; color: var(--text-tertiary); font-style: italic; padding: 12px; background: rgba(255,193,7,0.1); border-radius: 6px; border-left: 3px solid var(--warning);">
                            💡 <strong>Tip:</strong> ${actualDistance < 5 ? 'Consider walking or cycling to experience local culture!' : 'Book transport in advance during peak hours for better rates.'}
                        </div>
                    </div>
                `;
                
            } catch (error) {
                console.error('Error fetching route data:', error);
                // Fall back to estimates if API fails
                displayEstimatedRoute(point1, point2, distance, contentDiv);
            }
            
            distanceDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Remove selection banner
            if (selectionOverlay) selectionOverlay.style.display = 'none';
        }
        
        async function fetchRealRoute(start, end, profile) {
            // Use OSRM (OpenStreetMap Routing Machine) - no API key needed, no CORS issues
            const url = `https://router.project-osrm.org/route/v1/${profile}/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
            
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('API request failed');
                
                const data = await response.json();
                if (data.routes && data.routes[0]) {
                    const route = data.routes[0];
                    return {
                        distance: route.distance, // in meters
                        duration: route.duration, // in seconds
                        geometry: route.geometry.coordinates // [[lng, lat], [lng, lat], ...]
                    };
                }
            } catch (error) {
                console.warn(`Failed to fetch ${profile} route:`, error);
                return null;
            }
        }
        
        async function drawRealRoutes(accommodationCoords, allCoords) {
            if (!accommodationCoords || accommodationCoords.length === 0) return;
            
            console.log('🗺️ Drawing real routes from accommodation...');
            const startPoint = accommodationCoords[0].coords;
            let routesDrawn = 0;
            
            // Draw routes to all non-hotel destinations
            for (const [key, location] of Object.entries(allCoords)) {
                if (key.startsWith('hotel-')) continue;
                
                // Skip if same location
                if (Math.abs(location.coords[0] - startPoint[0]) < 0.0001 && 
                    Math.abs(location.coords[1] - startPoint[1]) < 0.0001) continue;
                
                // Fetch real driving route
                const route = await fetchRealRoute(startPoint, location.coords, 'driving');
                
                if (route && route.geometry) {
                    // Convert geometry to Leaflet format [lat, lng]
                    const latlngs = route.geometry.map(coord => [coord[1], coord[0]]);
                    
                    const polyline = L.polyline(latlngs, {
                        color: '#6366f1',
                        weight: 3,
                        opacity: 0.6,
                        dashArray: '8, 12'
                    }).addTo(map);
                    
                    // Add popup showing distance
                    const distanceKm = (route.distance / 1000).toFixed(1);
                    const durationMin = Math.round(route.duration / 60);
                    polyline.bindPopup(`
                        <div style="text-align: center;">
                            <strong>${accommodationCoords[0].name}</strong><br>
                            ↓<br>
                            <strong>${location.name}</strong><br>
                            <div style="margin-top: 8px; padding: 8px; background: var(--bg-hover); border-radius: 6px;">
                                📏 ${distanceKm} km<br>
                                ⏱️ ${durationMin} min drive
                            </div>
                        </div>
                    `);
                    
                    routeLines.push(polyline);
                    routesDrawn++;
                } else {
                    // Fallback to straight line if API fails
                    const line = L.polyline([startPoint, location.coords], {
                        color: '#94a3b8',
                        weight: 2,
                        opacity: 0.4,
                        dashArray: '4, 8'
                    }).addTo(map);
                    routeLines.push(line);
                }
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            console.log(`✅ Drew ${routesDrawn} real routes from accommodation`);
        }
        
        function displayEstimatedRoute(point1, point2, distance, contentDiv) {
            const travelTime = {
                walking: Math.round(distance / 5 * 60),
                driving: Math.round(distance / 60 * 60),
                cycling: Math.round(distance / 15 * 60)
            };
            
            const estimatedCost = {
                taxi: (distance * 1.5).toFixed(2),
                uber: (distance * 1.2).toFixed(2),
                transit: '2-5'
            };
            
            contentDiv.innerHTML = `
                <div style="display: grid; gap: 20px;">
                    <div>
                        <h3 style="margin: 0 0 8px 0; color: var(--primary); font-size: 15px;">From: ${point1.name}</h3>
                        <h3 style="margin: 0 0 16px 0; color: var(--secondary); font-size: 15px;">To: ${point2.name}</h3>
                        <div style="font-size: 32px; font-weight: 700; color: var(--text-primary); 
                                    background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1));
                                    padding: 20px; border-radius: 12px; text-align: center;
                                    border: 2px solid var(--primary);">
                            📏 ${distance.toFixed(2)} km
                        </div>
                        <div style="text-align: center; margin-top: 8px; font-size: 12px; color: var(--warning);">⚠️ Estimated (straight line distance)</div>
                    </div>
                    
                    <div style="background: var(--bg-hover); padding: 16px; border-radius: 8px;">
                        <h4 style="margin: 0 0 12px 0; color: var(--text-secondary);">⏱️ Estimated Travel Times</h4>
                        <div style="display: grid; gap: 8px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span>🚶 Walking:</span>
                                <strong>${travelTime.walking} min</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>🚴 Cycling:</span>
                                <strong>${travelTime.cycling} min</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>🚗 Driving:</span>
                                <strong>${travelTime.driving} min</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div style="font-size: 12px; color: var(--text-tertiary); font-style: italic;">
                        ⚠️ These are rough estimates. Actual travel times vary by traffic and route.
                    </div>
                </div>
            `;
        }
        
        function updateMapView() {
            if (!map) return;
            
            const selectedCountry = document.getElementById('mapCountryFilter').value;
            const selectedDay = document.getElementById('mapDayFilter').value;
            const showDestinations = document.getElementById('showDestinations').checked;
            const showRestaurants = document.getElementById('showRestaurants').checked;
            const showAccommodation = document.getElementById('showAccommodation').checked;
            const showRouteLines = document.getElementById('showRouteLines')?.checked || false;
            
            // Clear existing markers and lines
            map.eachLayer(layer => {
                if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                    map.removeLayer(layer);
                }
            });
            
            // Clear route lines
            routeLines.forEach(line => map.removeLayer(line));
            routeLines = [];
            
            const markers = [];
            const allCoords = {};
            let visibleCount = 0;
            
            // Get locations from selected day if filtering by day
            let dayLocations = new Set();
            if (selectedDay !== 'all' && tripData.dayPlans && tripData.dayPlans[selectedDay]) {
                tripData.dayPlans[selectedDay].activities.forEach(act => {
                    if (act.location) {
                        dayLocations.add(act.location.toLowerCase());
                    }
                });
            }
            
            // Collect accommodation coordinates from destinations (not bookings)
            const accommodationCoords = [];
            if (showAccommodation) {
                // Just use accommodation destinations directly
                ['main', 'optional', 'other'].forEach(type => {
                    (tripData.destinations[type] || []).forEach(dest => {
                        // Check if it's a hotel/accommodation based on emoji or name
                        const isHotel = (dest.emoji && ['🏨', '🏩', '🛏️'].includes(dest.emoji)) || 
                                       dest.placeName?.toLowerCase().includes('hotel') ||
                                       dest.placeName?.toLowerCase().includes('hostel') ||
                                       dest.placeName?.toLowerCase().includes('accommodation');
                        
                        if (isHotel && dest.mapsLink) {
                            const coords = extractCoordsFromMapsLink(dest.mapsLink);
                            if (coords) {
                                accommodationCoords.push({
                                    coords, 
                                    name: dest.placeName || dest.city || 'Accommodation',
                                    dest
                                });
                            }
                        }
                    });
                });
                
                console.log(`Found ${accommodationCoords.length} accommodations from destinations`);
            }
            
            // Plot main/optional/other destinations
            if (showDestinations) {
                ['main', 'optional', 'other'].forEach(type => {
                    (tripData.destinations[type] || []).forEach(dest => {
                        if (selectedCountry !== 'all' && dest.country !== selectedCountry) return;
                        
                        // Filter by day if selected
                        if (selectedDay !== 'all') {
                            const matchDay = dayLocations.has(dest.city?.toLowerCase()) || 
                                           dayLocations.has(dest.placeName?.toLowerCase());
                            if (!matchDay) return;
                        }
                        
                        if (dest.mapsLink) {
                            const coords = extractCoordsFromMapsLink(dest.mapsLink);
                            if (coords) {
                                const emoji = dest.emoji || '📍';
                                const marker = L.marker(coords, {
                                    icon: L.divIcon({
                                        html: `<div style="font-size: 28px;">${emoji}</div>`,
                                        className: 'custom-marker',
                                        iconSize: [35, 35]
                                    })
                                }).addTo(map);
                                
                                const locationKey = `${type}-${dest.city}-${dest.placeName}`;
                                const displayName = dest.placeName || dest.city || 'Location';
                                const subTitle = dest.placeName ? dest.city : ''; // Show city only if place name exists
                                allCoords[locationKey] = {coords, name: `${emoji} ${displayName}`};
                                
                                marker.bindPopup(`
                                    <div style="min-width: 200px;">
                                        <strong style="font-size: 16px; color: var(--primary);">${emoji} ${dest.placeName || dest.city || 'Location'}</strong><br>
                                        ${subTitle ? `<div style="margin: 8px 0; color: var(--text-secondary);">${subTitle}</div>` : ''}
                                        ${dest.highlights ? `<div style="font-size: 13px; margin: 8px 0; padding: 8px; background: rgba(99,102,241,0.1); border-radius: 4px;">${dest.highlights}</div>` : ''}
                                        <a href="${dest.mapsLink}" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 600;">📍 Open in Maps →</a>
                                    </div>
                                `);
                                
                                // ALWAYS add click handler, not just in selection mode
                                marker.on('click', () => handleMarkerClick({coords, name: `${emoji} ${displayName}`}));
                                
                                markers.push(coords);
                                visibleCount++;
                            }
                        }
                    });
                });
            }
            
            // Plot restaurants
            if (showRestaurants) {
                (tripData.destinations.restaurants || []).forEach(dest => {
                    if (selectedCountry !== 'all' && dest.country !== selectedCountry) return;
                    
                    if (selectedDay !== 'all') {
                        const matchDay = dayLocations.has(dest.city?.toLowerCase()) || 
                                       dayLocations.has(dest.placeName?.toLowerCase());
                        if (!matchDay) return;
                    }
                    
                    if (dest.mapsLink) {
                        const coords = extractCoordsFromMapsLink(dest.mapsLink);
                        if (coords) {
                            const emoji = dest.emoji || '🍽️';
                            const marker = L.marker(coords, {
                                icon: L.divIcon({
                                    html: `<div style="font-size: 28px;">${emoji}</div>`,
                                    className: 'custom-marker',
                                    iconSize: [35, 35]
                                })
                            }).addTo(map);
                            
                            const locationKey = `restaurant-${dest.placeName}`;
                            const displayName = dest.placeName || dest.city || 'Restaurant';
                            allCoords[locationKey] = {coords, name: `${emoji} ${displayName}`};
                            
                            marker.bindPopup(`
                                <div style="min-width: 200px;">
                                    <strong style="font-size: 16px; color: var(--secondary);">${emoji} ${displayName}</strong><br>
                                    <div style="margin: 8px 0; color: var(--text-secondary);">${dest.city || ''}</div>
                                    ${dest.highlights ? `<div style="font-size: 13px; margin: 8px 0;">${dest.highlights}</div>` : ''}
                                    <a href="${dest.mapsLink}" target="_blank" style="color: var(--secondary); text-decoration: none; font-weight: 600;">📍 Open in Maps →</a>
                                </div>
                            `);
                            
                            // ALWAYS add click handler
                            marker.on('click', () => handleMarkerClick({coords, name: `${emoji} ${displayName}`}));
                            
                            markers.push(coords);
                            visibleCount++;
                        }
                    }
                });
            }
            
            // Plot accommodation
            if (showAccommodation) {
                accommodationCoords.forEach(({coords, name, dest}) => {
                    const emoji = dest.emoji || '🏨';
                    const marker = L.marker(coords, {
                        icon: L.divIcon({
                            html: `<div style="font-size: 28px;">${emoji}</div>`,
                            className: 'custom-marker',
                            iconSize: [35, 35]
                        })
                    }).addTo(map);
                    
                    const locationKey = `hotel-${name}`;
                    allCoords[locationKey] = {coords, name: `${emoji} ${name}`};
                    
                    const booking = tripData.bookings.find(b => b.name === name);
                    marker.bindPopup(`
                        <div style="min-width: 200px;">
                            <strong style="font-size: 16px; color: var(--success);">${emoji} ${name}</strong><br>
                            <div style="margin: 8px 0; color: var(--text-secondary);">Confirmation: ${booking?.confirmation || ''}</div>
                            <div style="font-size: 13px; margin: 4px 0;">Check-in: ${booking?.datetime?.split('T')[0] || 'TBD'}</div>
                            ${dest.mapsLink ? `<a href="${dest.mapsLink}" target="_blank" style="color: var(--success); text-decoration: none; font-weight: 600;">📍 Open in Maps →</a>` : ''}
                        </div>
                    `);
                    
                    // ALWAYS add click handler
                    marker.on('click', () => handleMarkerClick({coords, name: `${emoji} ${name}`}));
                    
                    markers.push(coords);
                    visibleCount++;
                });
            }
            
            // Draw route lines from accommodations to all other locations
            if (showRouteLines && accommodationCoords.length > 0) {
                // Draw real routes asynchronously
                drawRealRoutes(accommodationCoords, allCoords);
            } else if (showRouteLines) {
                console.log('⚠️ Route lines requested but no accommodations found');
                console.log('  Make sure you have:');
                console.log('  1. A destination with 🏨 emoji OR "hotel" in name');
                console.log('  2. Google Maps link for that destination');
                console.log('  3. Other destinations with Maps links');
            }
            
            // Update stats
            document.getElementById('visibleMarkers').textContent = visibleCount;
            
            // Fit bounds to show all markers
            if (markers.length > 0) {
                map.fitBounds(markers);
            }
        }
        
        function handleMarkerClick(point) {
            if (!distanceSelectionMode) return;
            
            selectedPoints.push(point);
            
            // Update message
            const messageEl = document.getElementById('selectionMessage');
            if (messageEl) {
                if (selectedPoints.length === 1) {
                    messageEl.textContent = 'Click to select SECOND point';
                    messageEl.style.color = '#fbbf24'; // Yellow/amber color
                }
            }
            
            // Add temporary marker with number
            const tempMarker = L.circleMarker(point.coords, {
                radius: 12,
                fillColor: selectedPoints.length === 1 ? '#6366f1' : '#10b981',
                color: '#fff',
                weight: 3,
                fillOpacity: 0.9
            }).addTo(map);
            
            // Add number label
            const numberMarker = L.marker(point.coords, {
                icon: L.divIcon({
                    html: `<div style="background: ${selectedPoints.length === 1 ? '#6366f1' : '#10b981'}; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 12px rgba(0,0,0,0.4); font-size: 16px;">${selectedPoints.length}</div>`,
                    className: 'custom-marker',
                    iconSize: [28, 28]
                })
            }).addTo(map);
            
            distanceMarkers.push(tempMarker);
            distanceMarkers.push(numberMarker);
            
            if (selectedPoints.length === 2) {
                distanceSelectionMode = false;
                showDistanceInfo(selectedPoints[0], selectedPoints[1]);
            }
        }
        
        function findDestinationByName(name) {
            const types = ['main', 'optional', 'other', 'restaurants'];
            for (const type of types) {
                const found = (tripData.destinations[type] || []).find(d => 
                    d.placeName?.toLowerCase().includes(name.toLowerCase()) ||
                    d.city?.toLowerCase().includes(name.toLowerCase())
                );
                if (found) return found;
            }
            return null;
        }
        
        function extractCoordsFromMapsLink(url) {
            // Extract lat/lng from various Google Maps URL formats
            // Format 1: @lat,lng
            let match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (match) return [parseFloat(match[1]), parseFloat(match[2])];
            
            // Format 2: !3d and !4d
            match = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
            if (match) return [parseFloat(match[1]), parseFloat(match[2])];
            
            // Format 3: q=lat,lng
            match = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (match) return [parseFloat(match[1]), parseFloat(match[2])];
            
            return null;
        }

        // Stats & Updates
        function updateAllStats() {
            // Budget stats
            let must = 0, flex = 0, opt = 0;
            let mustEur = 0, flexEur = 0, optEur = 0;
            
            tripData.budget.forEach(item => {
                const amt = item.amount || 0;
                const amtEur = item.amountEur || 0;
                if (item.priority === 'MUST') {
                    must += amt;
                    mustEur += amtEur;
                } else if (item.priority === 'Flexible') {
                    flex += amt;
                    flexEur += amtEur;
                } else if (item.priority === 'Optional') {
                    opt += amt;
                    optEur += amtEur;
                }
            });

            const total = must + flex + opt;
            const totalEur = mustEur + flexEur + optEur;
            const saved = tripData.savings.reduce((sum, s) => sum + (s.actual || 0), 0);
            const savedEur = saved / exchangeRate;
            const progress = total > 0 ? Math.min(100, (saved / total) * 100) : 0;

            // Budget page stats
            document.getElementById('mustTotal').textContent = formatEur(mustEur);
            document.getElementById('mustTotalIdr').textContent = formatCurrency(must);
            document.getElementById('flexibleTotal').textContent = formatEur(flexEur);
            document.getElementById('flexibleTotalIdr').textContent = formatCurrency(flex);
            document.getElementById('optionalTotal').textContent = formatEur(optEur);
            document.getElementById('optionalTotalIdr').textContent = formatCurrency(opt);
            
            // Overview stats
            document.getElementById('totalBudgetStat').textContent = formatEur(totalEur);
            document.getElementById('totalBudgetIdr').textContent = formatCurrency(total);
            document.getElementById('savedStat').textContent = formatEur(savedEur);
            document.getElementById('savedIdr').textContent = formatCurrency(saved);
            document.getElementById('budgetSaved').textContent = Math.round(progress) + '%';
            document.getElementById('budgetQuick').textContent = formatEur(totalEur);
            document.getElementById('overviewProgress').style.width = progress + '%';

            // Days until
            const dep = new Date(document.getElementById('departureDate').value);
            const today = new Date();
            const days = Math.ceil((dep - today) / (1000 * 60 * 60 * 24));
            document.getElementById('daysUntil').textContent = days > 0 ? days : '0';
            document.getElementById('daysRemainingStat').textContent = days > 0 ? days : 'Started!';

            // Duration
            const ret = new Date(document.getElementById('returnDate').value);
            const duration = Math.ceil((ret - dep) / (1000 * 60 * 60 * 24)) + 1;
            document.getElementById('durationStat').textContent = duration + ' Days';

            // Tasks
            const totalTasks = tripData.logistics.length;
            const doneTasks = tripData.logistics.filter(t => t.status).length;
            document.getElementById('tasksComplete').textContent = doneTasks + '/' + totalTasks;
            
            // Date range
            const depStr = dep.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const retStr = ret.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            document.getElementById('tripDateRange').textContent = depStr + ' - ' + retStr;

            // Update overview summary
            updateOverviewSummary();
            
            // Update Timeline Stats
            updateTimelineStats(days, progress, totalTasks, doneTasks);
        }

        function updateTimelineStats(daysUntil, budgetProgress, totalTasks, doneTasks) {
            const countdownEl = document.getElementById('timelineCountdown');
            const budgetProgressEl = document.getElementById('timelineBudgetProgress');
            const taskProgressEl = document.getElementById('timelineTaskProgress');
            const bookingProgressEl = document.getElementById('timelineBookingProgress');
            const overallProgressEl = document.getElementById('timelineOverallProgress');
            
            if (countdownEl) countdownEl.textContent = daysUntil > 0 ? daysUntil : '🎉';
            if (budgetProgressEl) budgetProgressEl.textContent = Math.round(budgetProgress) + '%';
            if (taskProgressEl) taskProgressEl.textContent = totalTasks > 0 ? Math.round((doneTasks/totalTasks)*100) + '%' : '0%';
            if (bookingProgressEl) bookingProgressEl.textContent = tripData.bookings.length;
            
            // Overall progress = average of budget, tasks, bookings
            const bookingProgress = tripData.bookings.length > 0 ? 100 : 0;
            const taskProgress = totalTasks > 0 ? (doneTasks/totalTasks)*100 : 0;
            const overall = (budgetProgress + taskProgress + (bookingProgress > 0 ? 50 : 0)) / 3;
            if (overallProgressEl) overallProgressEl.style.width = Math.round(overall) + '%';
            
            renderTimeline();
        }

        function renderTimeline() {
            const container = document.getElementById('timelineDaysContainer');
            if (!container) return;
            
            if (!tripData.dayPlans || tripData.dayPlans.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No days planned yet. Go to Itinerary to add days.</p>';
                return;
            }
            
            container.innerHTML = '';
            
            tripData.dayPlans.forEach((day, idx) => {
                const card = document.createElement('div');
                card.style.cssText = `
                    background: var(--bg-hover);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.2s;
                `;
                
                const activities = day.activities?.length || 0;
                const budget = day.budget || 0;
                
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div>
                            <div style="font-size: 18px; font-weight: 700; color: var(--primary);">Day ${idx + 1}</div>
                            <div style="font-size: 14px; color: var(--text-secondary);">${day.date || 'No date set'}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 16px; font-weight: 600; color: var(--success);">${formatEur(budget / exchangeRate)}</div>
                            <div style="font-size: 12px; color: var(--text-tertiary);">${activities} activities</div>
                        </div>
                    </div>
                    <div style="font-size: 13px; color: var(--text-secondary); margin-top: 8px;">
                        ${day.title || 'Untitled day'}
                    </div>
                    <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
                        ${(day.activities || []).slice(0, 3).map(act => 
                            `<span style="padding: 4px 10px; background: var(--bg-main); border-radius: 6px; font-size: 11px; color: var(--text-secondary);">
                                ${act.time || ''} ${act.activity || 'Activity'}
                            </span>`
                        ).join('')}
                        ${activities > 3 ? `<span style="padding: 4px 10px; background: var(--bg-main); border-radius: 6px; font-size: 11px; color: var(--text-tertiary);">+${activities - 3} more</span>` : ''}
                    </div>
                `;
                
                card.onclick = () => {
                    showPage('itinerary');
                    // Scroll to day
                    setTimeout(() => {
                        const dayCard = document.querySelector(`[data-day-idx="${idx}"]`);
                        if (dayCard) dayCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                };
                
                container.appendChild(card);
            });
        }

        function updateOverviewSummary() {
            // Destinations Summary
            const mainCount = (tripData.destinations.main || []).length;
            const optionalCount = (tripData.destinations.optional || []).length;
            const accomCount = (tripData.destinations.other || []).length;
            const restCount = (tripData.destinations.restaurants || []).length;

            const destSummary = document.getElementById('destinationsSummary');
            if (destSummary) {
                destSummary.innerHTML = `
                    <div>🎯 Must-Visit: <strong>${mainCount}</strong></div>
                    <div>⏰ Optional: <strong>${optionalCount}</strong></div>
                    <div>🏨 Accommodation: <strong>${accomCount}</strong></div>
                    <div>🍽️ Restaurants: <strong>${restCount}</strong></div>
                `;
            }

            // Budget Breakdown
            let must = 0, flex = 0, opt = 0;
            let mustEur = 0, flexEur = 0, optEur = 0;
            
            tripData.budget.forEach(item => {
                const amt = item.amount || 0;
                const amtEur = item.amountEur || 0;
                if (item.priority === 'MUST') {
                    must += amt;
                    mustEur += amtEur;
                } else if (item.priority === 'Flexible') {
                    flex += amt;
                    flexEur += amtEur;
                } else if (item.priority === 'Optional') {
                    opt += amt;
                    optEur += amtEur;
                }
            });

            const budgetBreakdown = document.getElementById('budgetBreakdown');
            if (budgetBreakdown) {
                budgetBreakdown.innerHTML = `
                    <div>Essential: <strong style="color: var(--danger);">${formatEur(mustEur)}</strong></div>
                    <div>Flexible: <strong style="color: var(--warning);">${formatEur(flexEur)}</strong></div>
                    <div>Optional: <strong style="color: var(--success);">${formatEur(optEur)}</strong></div>
                    <div style="border-top: 1px solid var(--border); margin-top: 8px; padding-top: 8px;">
                        Total: <strong>${formatEur(mustEur + flexEur + optEur)}</strong>
                    </div>
                    <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 4px;">
                        ${formatCurrency(must + flex + opt)}
                    </div>
                `;
            }

            // Tasks Summary
            const totalTasks = tripData.logistics.length;
            const doneTasks = tripData.logistics.filter(t => t.status).length;
            const pendingTasks = totalTasks - doneTasks;

            const tasksSummary = document.getElementById('tasksSummary');
            if (tasksSummary) {
                tasksSummary.innerHTML = `
                    <div>✅ Completed: <strong>${doneTasks}</strong></div>
                    <div>⏳ Pending: <strong>${pendingTasks}</strong></div>
                    <div style="border-top: 1px solid var(--border); margin-top: 8px; padding-top: 8px;">
                        Total: <strong>${totalTasks}</strong>
                    </div>
                `;
            }

            // Itinerary Summary
            const totalDays = tripData.dayPlans.length;
            const totalActivities = tripData.dayPlans.reduce((sum, day) => sum + (day.activities ? day.activities.length : 0), 0);
            const cities = new Set(tripData.dayPlans.filter(d => d.city).map(d => d.city));

            const itinerarySummary = document.getElementById('itinerarySummary');
            if (itinerarySummary) {
                itinerarySummary.innerHTML = `
                    <div>📅 Days Planned: <strong>${totalDays}</strong></div>
                    <div>🎯 Activities: <strong>${totalActivities}</strong></div>
                    <div>🌆 Cities: <strong>${cities.size}</strong></div>
                    ${cities.size > 0 ? `<div style="font-size: 13px; color: var(--text-tertiary); margin-top: 4px;">${Array.from(cities).join(', ')}</div>` : ''}
                `;
            }
        }

        // Utility Functions
        function formatCurrency(amount) {
            return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
        }

        function formatEur(amount) {
            return '€' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        function formatNumberInput(value) {
            return parseInt(value || 0).toLocaleString('id-ID');
        }

        function parseNumber(value) {
            return parseInt(value.toString().replace(/[.,]/g, '')) || 0;
        }

        function autoResize(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }

        function renderAll() {
            // Update trip details inputs (with safety checks)
            if (tripData.overview) {
                document.getElementById('destination').value = tripData.overview.destination || '';
                document.getElementById('departureDate').value = tripData.overview.departureDate || '';
                document.getElementById('returnDate').value = tripData.overview.returnDate || '';
            }
            
            renderBudgetTable();
            renderSavingsTable();
            renderLogisticsTable();
            renderGroupMembers();
            renderPendingInvitations();
            updateGroupStats();
            renderPackingList();
            renderTodos();
            renderSharedChecklist();
            renderBookings();
            renderSharedExpenses();
            renderDestinations();
            renderDayPlans();
            renderDocuments(); // CRITICAL: Added this to render documents on load!
            updateOverviewSummary();
            renderEmergencyContacts();
            renderImportantInfo();
            
            // Fetch weather for current destination
            fetchWeather();
            
            // Set share link
            if (currentTrip) {
                const shareLink = document.getElementById('shareLink');
                if (shareLink) {
                    shareLink.value = window.location.origin + '/join/' + currentTrip.slice(0, 8);
                }
            }
        }

        // Event Listeners
        document.getElementById('destination').addEventListener('change', saveDataSync);
        document.getElementById('departureDate').addEventListener('change', () => { saveDataSync(); updateAllStats(); });
        document.getElementById('returnDate').addEventListener('change', () => { saveDataSync(); updateAllStats(); });

        // Initialize
        window.addEventListener('load', async () => {
            console.log('🎬 Window loaded, starting initialization...');
            
            try {
                // Check authentication
                console.log('🔐 Checking authentication...');
                const { data: { session }, error: sessionError } = await sb.auth.getSession();
                
                if (sessionError) {
                    console.error('❌ Session error:', sessionError);
                    alert('Session error: ' + sessionError.message);
                    return;
                }
                
                if (!session) {
                    console.log('❌ No session - redirecting to login');
                    window.location.href = 'index.html';
                    return;
                }
                
                console.log('✅ Session found:', session.user.email);
                user = session.user;
            
            // Load user profile with username
            const { data: profile } = await sb
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .maybeSingle();
            
            if (profile) {
                user.username = profile.username;
            }
            
            // Add user info to sidebar with edit button
            const userInfo = document.createElement('div');
            userInfo.style.cssText = 'font-size: 12px; color: var(--text-tertiary); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;';
            userInfo.innerHTML = `
                <span id="usernameDisplay">👤 ${user.username || user.email}</span>
                <button onclick="editUsername()" style="background: transparent; border: 1px solid var(--border); padding: 4px 8px; font-size: 11px; border-radius: 6px; cursor: pointer; color: var(--text-secondary);">Edit</button>
            `;
            document.querySelector('.trip-dates').parentNode.appendChild(userInfo);
            
            // Get or create trip
            // First check if user is member of any trip (accepted invitation)
            const { data: memberships } = await sb
                .from('trip_members')
                .select('trip_id, joined_at')
                .eq('user_id', user.id)
                .order('joined_at', { ascending: false })
                .limit(1);
            
            if (memberships && memberships.length > 0) {
                // Use trip they're a member of
                currentTrip = memberships[0].trip_id;
            } else {
                // Not a member of any trip - create fresh trip
                const { data: newTrip, error } = await sb.from('trips').insert([{
                    owner_id: user.id,
                    name: 'My Trip'
                }]).select().single();
                
                if (error) {
                    console.error('Create trip error:', error);
                    alert('Error creating trip: ' + error.message);
                    return;
                }
                currentTrip = newTrip.id;
                
                // Add as trip member with owner role
                await sb.from('trip_members').insert([{
                    trip_id: newTrip.id,
                    user_id: user.id,
                    role: 'owner'
                }]);
            }
            
            console.log('Current trip:', currentTrip);
            
            // Load data
            loadExchangeRate();
            await loadData();
            updateRateDisplay();
            
            // Load notifications
            loadNotifications();
            
            // Setup real-time subscriptions (replaces polling)
            setupRealtime();
            
            console.log('✅ App initialized with real-time updates');
            
            } catch (initError) {
                console.error('❌ Initialization error:', initError);
                alert('Failed to initialize app: ' + initError.message);
            }
        });

        // Edit Username
        function editUsername() {
            showModal(`
                <div class="modal-header">
                    <div class="modal-title">✏️ Edit Username</div>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="modal-input-group">
                        <label class="modal-label">New Username</label>
                        <input type="text" id="usernameInput" class="modal-input" value="${user.username || ''}" placeholder="johndoe" pattern="[a-zA-Z0-9_]{3,20}" autofocus>
                        <div class="modal-hint">3-20 characters, letters, numbers, and underscore only</div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn-secondary" onclick="closeModal()">Cancel</button>
                    <button class="modal-btn modal-btn-primary" onclick="submitUsernameChange()">Save Changes</button>
                </div>
            `);
        }

        async function submitUsernameChange() {
            const newUsername = document.getElementById('usernameInput').value.trim();
            if (!newUsername) return;
            
            // Validate
            if (!/^[a-zA-Z0-9_]{3,20}$/.test(newUsername)) {
                alert('Invalid username. Use 3-20 characters: letters, numbers, underscore only.');
                return;
            }
            
            try {
                // Check if username exists
                const { data: existing } = await sb
                    .from('profiles')
                    .select('username')
                    .eq('username', newUsername)
                    .neq('id', user.id)
                    .maybeSingle();
                
                if (existing) {
                    alert('Username already taken. Choose another.');
                    return;
                }
                
                // Update profile
                const { error } = await sb
                    .from('profiles')
                    .update({ username: newUsername })
                    .eq('id', user.id);
                
                if (error) throw error;
                
                // Update local
                user.username = newUsername;
                document.getElementById('usernameDisplay').textContent = '👤 ' + newUsername;
                
                // Update in group if exists
                const ownerMember = tripData.group.find(m => m.email === user.email);
                if (ownerMember) {
                    ownerMember.name = newUsername;
                    renderGroupMembers();
                    saveData();
                }
                
                closeModal();
                showSuccessToast('Username updated!');
            } catch (e) {
                alert('Error: ' + e.message);
            }
        }

        // Notification System
        async function loadNotifications() {
            // Load invitations
            const { data: invites } = await sb
                .from('trip_invitations')
                .select('*')
                .eq('invitee_email', user.email)
                .eq('status', 'pending')
                .order('invited_at', { ascending: false });
            
            // Load general notifications (reminders, updates, etc.)
            const { data: notifications } = await sb
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .eq('read', false)
                .order('created_at', { ascending: false })
                .limit(20);
            
            const totalCount = (invites?.length || 0) + (notifications?.length || 0);
            
            if (totalCount === 0) {
                document.getElementById('notificationBadge').style.display = 'none';
                document.getElementById('notificationList').innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-secondary);">No notifications</div>';
                return;
            }
            
            // Show badge
            document.getElementById('notificationBadge').textContent = totalCount;
            document.getElementById('notificationBadge').style.display = 'block';
            
            let html = '';
            
            // Render invitations
            if (invites && invites.length > 0) {
                const invitesWithDetails = await Promise.all(invites.map(async (inv) => {
                    const { data: trip } = await sb.from('trips').select('name, destination').eq('id', inv.trip_id).maybeSingle();
                    const { data: inviter } = await sb.from('profiles').select('username').eq('id', inv.inviter_id).maybeSingle();
                    return { ...inv, trip, inviter };
                }));
                
                html += invitesWithDetails.map(inv => {
                    const timeAgo = getTimeAgo(new Date(inv.invited_at));
                    const tripName = inv.trip?.name || 'Trip';
                    const destination = inv.trip?.destination || 'an amazing destination';
                    const inviterName = inv.inviter?.username || 'Someone';
                    
                    return `
                        <div class="notification-item" style="border-left: 3px solid var(--primary);">
                            <div style="display: flex; gap: 8px; align-items: start;">
                                <div style="font-size: 20px;">✉️</div>
                                <div style="flex: 1;">
                                    <div class="notification-trip">${tripName}</div>
                                    <div class="notification-message">
                                        ${inviterName} invited you to join their trip to ${destination}
                                    </div>
                                    <div class="notification-time">${timeAgo}</div>
                                    <div class="notification-actions">
                                        <button class="notification-btn notification-btn-accept" onclick="acceptInvite('${inv.id}', '${inv.trip_id}')">Accept</button>
                                        <button class="notification-btn notification-btn-decline" onclick="declineInvite('${inv.id}')">Decline</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
            
            // Render general notifications
            if (notifications && notifications.length > 0) {
                html += notifications.map(notif => {
                    const timeAgo = getTimeAgo(new Date(notif.created_at));
                    const icon = {
                        'reminder': '⏰',
                        'trip_update': '📝',
                        'member_joined': '👋',
                        'budget_alert': '💰',
                        'booking_added': '🎫'
                    }[notif.type] || '🔔';
                    
                    const borderColor = {
                        'reminder': 'var(--warning)',
                        'trip_update': 'var(--primary)',
                        'member_joined': 'var(--success)',
                        'budget_alert': 'var(--danger)',
                        'booking_added': 'var(--secondary)'
                    }[notif.type] || 'var(--border)';
                    
                    return `
                        <div class="notification-item" style="border-left: 3px solid ${borderColor};">
                            <div style="display: flex; gap: 8px; align-items: start;">
                                <div style="font-size: 20px;">${icon}</div>
                                <div style="flex: 1;">
                                    <div class="notification-trip">${notif.title}</div>
                                    <div class="notification-message">${notif.message}</div>
                                    <div class="notification-time">${timeAgo}</div>
                                    <button class="notification-btn notification-btn-decline" onclick="markNotificationRead('${notif.id}')" style="margin-top: 8px;">Dismiss</button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
            
            document.getElementById('notificationList').innerHTML = html;
        }
        
        async function markNotificationRead(notifId) {
            await sb.from('notifications').update({ read: true }).eq('id', notifId);
            loadNotifications();
        }
        
        async function markAllAsRead() {
            await sb.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
            loadNotifications();
        }
        
        // Helper function to create notifications
        async function createNotification(tripId, userIds, type, title, message) {
            const notifications = userIds.map(userId => ({
                trip_id: tripId,
                user_id: userId,
                type: type,
                title: title,
                message: message,
                created_by: user.id
            }));
            
            await sb.from('notifications').insert(notifications);
        }
        
        async function sendReminder(memberId, memberName) {
            // If called with specific member, pre-select them
            showNotificationModal(memberId);
        }
        
        function showNotificationModal(preSelectedId = null) {
            const members = tripData.group.filter(m => m.user_id !== user.id); // Exclude self
            
            if (members.length === 0) {
                showErrorToast('No other members to notify');
                return;
            }
            
            const modalContent = `
                <div style="max-width: 600px; width: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <h2 style="font-size: 24px; font-weight: 700; color: var(--text-primary);">📨 Send Notification</h2>
                        <button onclick="closeModal()" style="background: transparent; border: none; font-size: 24px; cursor: pointer; color: var(--text-secondary);">×</button>
                    </div>
                    
                    <div style="margin-bottom: 24px;">
                        <label style="display: block; margin-bottom: 12px; font-weight: 600; color: var(--text-primary);">Select Recipients</label>
                        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                            <button onclick="selectAllMembers()" class="btn btn-secondary btn-sm">Select All</button>
                            <button onclick="deselectAllMembers()" class="btn btn-secondary btn-sm">Deselect All</button>
                        </div>
                        <div style="max-height: 200px; overflow-y: auto; background: var(--bg-main); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border);">
                            ${members.map(m => `
                                <label style="display: flex; align-items: center; gap: 12px; padding: 8px; cursor: pointer; border-radius: 8px; transition: background 0.2s;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='transparent'">
                                    <input type="checkbox" class="member-checkbox" data-user-id="${m.user_id}" ${m.user_id === preSelectedId ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
                                    <div>
                                        <div style="font-weight: 600; color: var(--text-primary);">${m.name || 'Unnamed'}</div>
                                        <div style="font-size: 12px; color: var(--text-secondary);">${m.email || ''}</div>
                                    </div>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 24px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-primary);">Notification Type</label>
                        <select id="notifType" style="width: 100%; padding: 12px; background: var(--bg-main); border: 2px solid var(--border); border-radius: var(--radius-md); color: var(--text-primary); font-size: 14px;">
                            <option value="reminder">⏰ Reminder</option>
                            <option value="trip_update">📝 Trip Update</option>
                            <option value="budget_alert">💰 Budget Alert</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 24px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-primary);">Message</label>
                        <textarea id="notifMessage" placeholder="Type your message here..." style="width: 100%; min-height: 120px; padding: 12px; background: var(--bg-main); border: 2px solid var(--border); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit; font-size: 14px; resize: vertical;"></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button onclick="closeModal()" class="btn btn-secondary">Cancel</button>
                        <button onclick="sendNotificationFromModal()" class="btn btn-primary">
                            📨 Send Notification
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('modalContent').innerHTML = modalContent;
            document.getElementById('modalOverlay').style.display = 'flex';
        }
        
        function selectAllMembers() {
            document.querySelectorAll('.member-checkbox').forEach(cb => cb.checked = true);
        }
        
        function deselectAllMembers() {
            document.querySelectorAll('.member-checkbox').forEach(cb => cb.checked = false);
        }
        
        async function sendNotificationFromModal() {
            const selectedMembers = Array.from(document.querySelectorAll('.member-checkbox:checked'))
                .map(cb => cb.dataset.userId);
            
            if (selectedMembers.length === 0) {
                showErrorToast('Please select at least one recipient');
                return;
            }
            
            const type = document.getElementById('notifType').value;
            const message = document.getElementById('notifMessage').value.trim();
            
            if (!message) {
                showErrorToast('Please enter a message');
                return;
            }
            
            const titles = {
                'reminder': '⏰ Reminder',
                'trip_update': '📝 Trip Update',
                'budget_alert': '💰 Budget Alert'
            };
            
            await createNotification(currentTrip, selectedMembers, type, titles[type], message);
            
            closeModal();
            showSuccessToast(`Notification sent to ${selectedMembers.length} member${selectedMembers.length > 1 ? 's' : ''}!`);
        }
        
        // Auto-notify members about important changes
        async function notifyMembersAboutChange(changeType, details) {
            // Get all members except current user
            const { data: members } = await sb
                .from('trip_members')
                .select('user_id')
                .eq('trip_id', currentTrip)
                .neq('user_id', user.id);
            
            if (!members || members.length === 0) return;
            
            const { data: profile } = await sb.from('profiles').select('username').eq('id', user.id).maybeSingle();
            const userName = profile?.username || 'Someone';
            
            const notifications = {
                'trip_dates_changed': {
                    type: 'trip_update',
                    title: '📅 Trip Dates Changed',
                    message: `${userName} updated the trip dates. New departure: ${details.departure || 'Not set'}, Return: ${details.return || 'Not set'}`
                },
                'destination_changed': {
                    type: 'trip_update',
                    title: '📍 Destination Changed',
                    message: `${userName} changed the destination to: ${details.destination}`
                },
                'destination_added': {
                    type: 'trip_update',
                    title: '✨ New Destination Added',
                    message: `${userName} added a new destination: ${details.city}, ${details.country}`
                },
                'itinerary_updated': {
                    type: 'trip_update',
                    title: '🗓️ Itinerary Updated',
                    message: `${userName} updated the itinerary for Day ${details.day}`
                },
                'booking_added': {
                    type: 'booking_added',
                    title: '🎫 New Booking Added',
                    message: `${userName} added a new booking: ${details.type} - ${details.name}`
                },
                'shared_expense_added': {
                    type: 'trip_update',
                    title: '💸 New Shared Expense',
                    message: `${userName} added a shared expense: ${details.item} (€${details.amount})`
                }
            };
            
            const notif = notifications[changeType];
            if (!notif) return;
            
            await createNotification(
                currentTrip,
                members.map(m => m.user_id),
                notif.type,
                notif.title,
                notif.message
            );
        }

        function toggleNotifications() {
            const panel = document.getElementById('notificationPanel');
            panel.classList.toggle('active');
            if (panel.classList.contains('active')) {
                loadNotifications();
            }
        }

        async function acceptInvite(inviteId, tripId) {
            try {
                // Check if already a member
                const { data: existing } = await sb
                    .from('trip_members')
                    .select('id')
                    .eq('trip_id', tripId)
                    .eq('user_id', user.id)
                    .maybeSingle();
                
                if (existing) {
                    showSuccessToast('Already a member! Reloading...');
                    setTimeout(() => window.location.reload(), 1000);
                    return;
                }
                
                // Update invitation status
                await sb
                    .from('trip_invitations')
                    .update({ 
                        status: 'accepted',
                        responded_at: new Date().toISOString(),
                        invitee_id: user.id
                    })
                    .eq('id', inviteId);
                
                // Add to trip members
                const { error } = await sb
                    .from('trip_members')
                    .insert([{
                        trip_id: tripId,
                        user_id: user.id,
                        role: 'member'
                    }]);
                
                if (error) {
                    console.error('Insert member error:', error);
                    showErrorToast('Error: ' + error.message);
                    return;
                }
                
                // Notify all other members that someone joined
                const { data: members } = await sb
                    .from('trip_members')
                    .select('user_id')
                    .eq('trip_id', tripId)
                    .neq('user_id', user.id);
                
                if (members && members.length > 0) {
                    const { data: profile } = await sb.from('profiles').select('username').eq('id', user.id).maybeSingle();
                    const memberName = profile?.username || 'A new member';
                    await createNotification(
                        tripId, 
                        members.map(m => m.user_id), 
                        'member_joined', 
                        'New Member Joined! 👋', 
                        `${memberName} has joined your trip!`
                    );
                }
                
                showSuccessToast('Invitation accepted! Reloading...');
                setTimeout(() => window.location.reload(), 1000);
            } catch (e) {
                console.error('Accept error:', e);
                showErrorToast('Error: ' + e.message);
            }
        }

        async function declineInvite(inviteId) {
            await sb
                .from('trip_invitations')
                .update({ 
                    status: 'declined',
                    responded_at: new Date().toISOString()
                })
                .eq('id', inviteId);
            
            showSuccessToast('Invitation declined');
            loadNotifications();
        }

        // Close notification panel when clicking outside
        document.addEventListener('click', (e) => {
            const bell = document.getElementById('notificationBell');
            const panel = document.getElementById('notificationPanel');
            if (!bell.contains(e.target) && !panel.contains(e.target)) {
                panel.classList.remove('active');
            }
        });

        // Logout
        async function logout() {
            await sb.auth.signOut();
            window.location.href = 'index.html';
        }

        // Auto-save every 30 seconds
        setInterval(saveDataSync, 30000);
        
        // Attach event listeners for toggle functions (must be after DOM loads)
        
        // PWA Service Worker Registration
        async function registerServiceWorker() {
            // Service workers require separate .js files and can't work in single-file HTML apps
            // Offline detection still works via online/offline events
            console.log('ℹ️ Service Worker skipped (single-file app). Offline detection active.');
        }

        // Offline/Online Handlers
        function handleOffline() {
            document.getElementById('offlineBar').classList.add('active');
            showSyncStatus('⚠️', 'Offline', 'var(--warning)');
            console.log('📵 Offline mode activated');
        }

        function handleOnline() {
            document.getElementById('offlineBar').classList.remove('active');
            showSyncStatus('☁️', 'Syncing...', 'var(--primary)');
            
            // Trigger data sync
            setTimeout(() => {
                saveData().then(() => {
                    showSyncStatus('✓', 'Synced', 'var(--success)');
                    setTimeout(() => {
                        document.getElementById('syncStatus').classList.remove('active');
                    }, 2000);
                });
            }, 500);
            
            console.log('📶 Back online, syncing data...');
        }

        function showSyncStatus(icon, text, color) {
            const statusEl = document.getElementById('syncStatus');
            const iconEl = document.getElementById('syncStatusIcon');
            const textEl = document.getElementById('syncStatusText');
            
            iconEl.textContent = icon;
            textEl.textContent = text;
            statusEl.style.borderColor = color;
            statusEl.classList.add('active');
        }

        // Swipe Gestures for Itinerary Days
        let touchStartX = 0;
        let touchEndX = 0;

        function setupSwipeGestures() {
            const itineraryPage = document.getElementById('itinerary');
            if (!itineraryPage) return;

            itineraryPage.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });

            itineraryPage.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }

        function handleSwipe() {
            const swipeThreshold = 100;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) < swipeThreshold) return;

            if (diff > 0) {
                // Swipe left - next day
                console.log('👈 Swiped left');
            } else {
                // Swipe right - previous day
                console.log('👉 Swiped right');
            }
        }

        // Haptic Feedback
        function setupHapticFeedback() {
            // Add haptic to all buttons
            document.addEventListener('click', e => {
                if (e.target.closest('button, .btn, .nav-item, .bottom-nav-item, .quick-action')) {
                    triggerHaptic('light');
                }
            });
        }

        function triggerHaptic(type = 'light') {
            if ('vibrate' in navigator) {
                switch(type) {
                    case 'light': navigator.vibrate(10); break;
                    case 'medium': navigator.vibrate(20); break;
                    case 'heavy': navigator.vibrate(50); break;
                }
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            // Mobile sidebar toggle
            const mobileToggle = document.getElementById('mobileMenuToggle');
            const mobileOverlay = document.getElementById('mobileOverlay');
            if (mobileToggle) mobileToggle.addEventListener('click', toggleSidebar);
            if (mobileOverlay) mobileOverlay.addEventListener('click', toggleSidebar);
            
            // Notification bell
            const notifBell = document.getElementById('notificationBell');
            if (notifBell) notifBell.addEventListener('click', toggleNotifications);
            
            // Quick actions FAB
            const quickFab = document.getElementById('quickActionsFab');
            if (quickFab) quickFab.addEventListener('click', toggleQuickActions);
            
            // PWA Service Worker Registration
            if ('serviceWorker' in navigator) {
                registerServiceWorker();
            }
            
            // Offline/Online Detection
            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);
            
            // Check initial online status
            if (!navigator.onLine) {
                handleOffline();
            }
            
            // Swipe gestures for mobile (itinerary days)
            setupSwipeGestures();
            
            // Haptic feedback setup
            setupHapticFeedback();
            
            console.log('✅ Event listeners attached');
            console.log('✅ PWA features initialized');
        });
