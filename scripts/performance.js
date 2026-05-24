// Performance Utilities Module
// 100% independent, no dependencies

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
        
        this.container.innerHTML = '';
        
        const topSpacer = document.createElement('div');
        topSpacer.style.height = `${startIndex * this.itemHeight}px`;
        this.container.appendChild(topSpacer);
        
        for (let i = startIndex; i < endIndex; i++) {
            const itemEl = this.renderItem(this.items[i], i);
            this.container.appendChild(itemEl);
        }
        
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

// Performance Monitor
const PerformanceMonitor = {
    marks: {},
    
    start(label) {
        this.marks[label] = performance.now();
    },
    
    end(label) {
        if (!this.marks[label]) return;
        const duration = performance.now() - this.marks[label];
        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
        delete this.marks[label];
        return duration;
    },
    
    measure(label, fn) {
        this.start(label);
        const result = fn();
        this.end(label);
        return result;
    },
    
    async measureAsync(label, fn) {
        this.start(label);
        const result = await fn();
        this.end(label);
        return result;
    }
};

// Export to window
window.VirtualScroller = VirtualScroller;
window.debounce = debounce;
window.throttle = throttle;
window.setupLazyLoading = setupLazyLoading;
window.requestFrame = requestFrame;
window.PerformanceMonitor = PerformanceMonitor;

console.log('✅ Performance utilities loaded');
if (typeof window.onPerformanceLoaded === 'function') window.onPerformanceLoaded();
