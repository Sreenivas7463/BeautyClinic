// Theme initialization script - prevents flickering
// Must be loaded in <head> before any rendering
(function () {
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
        }
        return null;
    }

    // Apply dark mode immediately
    const darkMode = getCookie('darkMode');
    if (darkMode === 'true' || (darkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }

    // Apply theme color immediately
    const theme = getCookie('theme');
    if (theme && theme !== 'rose') {
        document.documentElement.setAttribute('data-theme', theme);
    }
})();