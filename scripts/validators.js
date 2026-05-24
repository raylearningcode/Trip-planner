// Data Validation & Sanitization Module
// 100% independent, no dependencies

const Validators = {
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    phone: (phone) => {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
    },
    
    url: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    positiveNumber: (num) => {
        const n = parseFloat(num);
        return !isNaN(n) && n >= 0;
    },
    
    dateRange: (start, end) => {
        if (!start || !end) return true;
        return new Date(end) >= new Date(start);
    },
    
    notEmpty: (str) => {
        return str && str.trim().length > 0;
    },
    
    maxLength: (str, max) => {
        return !str || str.length <= max;
    }
};

const Sanitizers = {
    text: (str) => {
        if (!str) return '';
        return str.replace(/<[^>]*>/g, '').trim();
    },
    
    number: (num) => {
        const n = parseFloat(num);
        return isNaN(n) ? 0 : n;
    },
    
    positiveNumber: (num) => {
        const n = parseFloat(num);
        return isNaN(n) || n < 0 ? 0 : n;
    },
    
    email: (email) => {
        return email.toLowerCase().trim();
    },
    
    phone: (phone) => {
        return phone.replace(/[^\d\s\+\-\(\)]/g, '');
    }
};

// Export to window
window.Validators = Validators;
window.Sanitizers = Sanitizers;

console.log('✅ Validators loaded');
if (typeof window.onValidatorsLoaded === 'function') window.onValidatorsLoaded();
