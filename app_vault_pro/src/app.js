/* ============================================
 * App Vault - Iteration 2
 * 2025-08-18 23:11:16
 * 
 * Purpose: Project implementation
 * ============================================ */


document.addEventListener('DOMContentLoaded', () => {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        });
    }

    // Accessibility improvement: Close menu when focus leaves the menu
    navbarMenu.addEventListener('focusout', (event) => {
        if (!navbarMenu.contains(event.relatedTarget)) {
            navbarMenu.classList.remove('active');
        }
    });

    // Accessibility improvement: Close menu on Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navbarMenu.classList.contains('active')) {
            navbarMenu.classList.remove('active');
        }
    });
});

/* Implementation complete */

