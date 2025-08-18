/* ============================================
 * App Vault - Iteration 1
 * 2025-08-18 21:05:52
 * ============================================ */


document.addEventListener('DOMContentLoaded', () => {
    const appGrid = document.querySelector('.app-grid');
    const appDetailsSection = document.getElementById('app-details');
    const appDetailsContent = document.getElementById('app-details-content');
    const closeDetailsButton = document.getElementById('close-details');
    const browseButton = document.getElementById('browse-button');

    const apps = [
        {
            id: 1,
            name: 'Awesome App 1',
            description: 'This is the first awesome app.',
            imageUrl: 'https://via.placeholder.com/150',
            details: 'More detailed information about Awesome App 1.'
        },
        {
            id: 2,
            name: 'Cool App 2',
            description: 'This is the second cool app.',
            imageUrl: 'https://via.placeholder.com/150',
            details: 'More detailed information about Cool App 2.'
        },
        {
            id: 3,
            name: 'Amazing App 3',
            description: 'This is the third amazing app.',
            imageUrl: 'https://via.placeholder.com/150',
            details: 'More detailed information about Amazing App 3.'
        }
    ];

    function createAppCard(app) {
        const card = document.createElement('div');
        card.classList.add('app-card');
        card.innerHTML = `
            <img src="${app.imageUrl}" alt="${app.name}">
            <h3>${app.name}</h3>
            <p>${app.description}</p>
        `;
        card.addEventListener('click', () => showAppDetails(app));
        return card;
    }

    function showAppDetails(app) {
        appDetailsContent.innerHTML = `
            <h2>${app.name}</h2>
            <img src="${app.imageUrl}" alt="${app.name}" style="max-width: 200px;">
            <p>${app.details}</p>
        `;
        appDetailsSection.style.display = 'block';
    }

    function hideAppDetails() {
        appDetailsSection.style.display = 'none';
    }

    apps.forEach(app => {
        const card = createAppCard(app);
        appGrid.appendChild(card);
    });

    closeDetailsButton.addEventListener('click', hideAppDetails);

    browseButton.addEventListener('click', () => {
        alert('Browsing Apps!'); // Placeholder action
    });
});

/* End of update */

