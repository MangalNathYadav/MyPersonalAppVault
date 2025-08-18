/* ============================================
 * App Vault - Iteration 1
 * 2025-08-18 22:46:40
 * 
 * Purpose: Project implementation
 * ============================================ */


/**
 * AppVault Showcase Application
 *
 * This script dynamically populates the app list, implements search functionality,
 * and ensures a responsive user experience.  It adheres to modern JavaScript
 * best practices and WCAG accessibility guidelines.
 */

document.addEventListener('DOMContentLoaded', () => {
    const appListContainer = document.getElementById('app-list');
    const searchInput = document.getElementById('search-input');

    /**
     * App Data:  An array of app objects.  Each object contains the app's
     * name, description, and a link to the app's page.
     *
     * @type {Array<Object>}
     */
    const apps = [
        {
            name: 'Awesome App 1',
            description: 'A fantastic app for doing amazing things.',
            link: 'https://example.com/app1'
        },
        {
            name: 'Super App 2',
            description: 'An incredible app that will change your life.',
            link: 'https://example.com/app2'
        },
        {
            name: 'Mega App 3',
            description: 'The ultimate app for all your needs.',
            link: 'https://example.com/app3'
        },
        {
            name: 'Cool App 4',
            description: 'A neat app to make your life easier.',
            link: 'https://example.com/app4'
        },
        {
            name: 'Great App 5',
            description: 'A really great app for everyday use.',
            link: 'https://example.com/app5'
        },
        {
            name: 'Fantastic App 6',
            description: 'An app that is truly fantastic and amazing.',
            link: 'https://example.com/app6'
        }
    ];

    /**
     * Renders a single app item to the DOM.
     *
     * @param {Object} app - The app object to render.
     */
    const renderApp = (app) => {
        const appItem = document.createElement('div');
        appItem.classList.add('app-item');

        const heading = document.createElement('h2');
        heading.textContent = app.name;
        appItem.appendChild(heading);

        const description = document.createElement('p');
        description.textContent = app.description;
        appItem.appendChild(description);

        const link = document.createElement('a');
        link.href = app.link;
        link.textContent = 'Learn More';
        link.target = '_blank'; // Open in new tab
        link.rel = 'noopener noreferrer'; // Security best practice
        appItem.appendChild(link);

        appListContainer.appendChild(appItem);
    };

    /**
     * Renders all apps to the DOM.
     *
     * @param {Array<Object>} appsToRender - The array of app objects to render.
     */
    const renderApps = (appsToRender) => {
        appListContainer.innerHTML = ''; // Clear existing content
        appsToRender.forEach(renderApp);
    };

    /**
     * Filters apps based on the search input.
     *
     * @param {string} searchTerm - The search term to filter by.
     * @returns {Array<Object>} - The filtered array of app objects.
     */
    const filterApps = (searchTerm) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return apps.filter(app =>
            app.name.toLowerCase().includes(lowerSearchTerm) ||
            app.description.toLowerCase().includes(lowerSearchTerm)
        );
    };

    /**
     * Handles the search input event.
     */
    const handleSearchInput = () => {
        const searchTerm = searchInput.value;
        const filteredApps = filterApps(searchTerm);
        renderApps(filteredApps);
    };

    // Initial render of all apps
    renderApps(apps);

    // Event listener for search input
    searchInput.addEventListener('input', handleSearchInput);
});

/* Implementation complete */

