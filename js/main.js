// Glamour Beauty Parlour - Main JavaScript

// Cookie helper functions
const CookieHelper = {
    set: function (name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
    },

    get: function (name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    },

    remove: function (name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // Initialize theme from cookie
    initTheme();
    initDarkMode();

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Theme selector
    const themeBtn = document.getElementById('themeBtn');
    const themeMenu = document.getElementById('themeMenu');

    if (themeBtn && themeMenu) {
        themeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            themeMenu.classList.toggle('hidden');
        });

        // Theme options
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', function () {
                const theme = this.getAttribute('data-theme');
                setTheme(theme);
                themeMenu.classList.add('hidden');
            });
        });
    }

    // Dark mode toggle
    const darkModeBtn = document.getElementById('darkModeBtn');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', function () {
            toggleDarkMode();
        });
    }

    // Close menus when clicking outside
    document.addEventListener('click', function (e) {
        if (themeMenu && themeBtn && !themeBtn.contains(e.target)) {
            themeMenu.classList.add('hidden');
        }
    });

    // Gallery filter (if on gallery page)
    initGalleryFilter();

    // Booking form (if on booking page)
    initBookingForm();

    // Contact form (if on contact page)
    initContactForm();
});

// Theme functions using cookies
function initTheme() {
    const savedTheme = CookieHelper.get('theme') || 'rose';
    setTheme(savedTheme);
}

function setTheme(theme) {
    if (theme === 'rose') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    // Save to cookie (expires in 365 days)
    CookieHelper.set('theme', theme, 365);
}

// Dark mode functions using cookies
function initDarkMode() {
    const savedDarkMode = CookieHelper.get('darkMode');
    if (savedDarkMode === 'true') {
        document.documentElement.classList.add('dark');
    } else if (savedDarkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Only use system preference if no cookie is set
        document.documentElement.classList.add('dark');
    }
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    // Save to cookie (expires in 365 days)
    CookieHelper.set('darkMode', isDark ? 'true' : 'false', 365);
}

// Gallery filter
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                // Update active state
                filterBtns.forEach(b => {
                    b.classList.remove('bg-theme-500', 'text-white');
                    b.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
                });
                this.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
                this.classList.add('bg-theme-500', 'text-white');

                // Filter items
                const filter = this.getAttribute('data-filter');
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.3s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Booking form
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData);

            // Simple validation
            if (!data.name || !data.phone || !data.service || !data.date) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Thank you! Your appointment request has been received. We will contact you shortly to confirm.', 'success');
            bookingForm.reset();
        });
    }
}

// Contact form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Simple validation
            if (!data.name || !data.phone || !data.message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }
}

// Notification function
function showNotification(message, type) {
    type = type || 'success';
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification fixed bottom-4 right-4 px-6 py-4 rounded-xl shadow-lg z-50 transform transition-all duration-300 translate-y-full opacity-0 ' + (type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white');

    const iconPath = type === 'success'
        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>'
        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';

    notification.innerHTML = '<div class="flex items-center space-x-3"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">' + iconPath + '</svg><span>' + message + '</span></div>';

    document.body.appendChild(notification);

    // Animate in
    setTimeout(function () {
        notification.classList.remove('translate-y-full', 'opacity-0');
    }, 10);

    // Remove after 5 seconds
    setTimeout(function () {
        notification.classList.add('translate-y-full', 'opacity-0');
        setTimeout(function () { notification.remove(); }, 300);
    }, 5000);
}

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }';
document.head.appendChild(style);