// DOM Elements
const appsContainer = document.getElementById('appsContainer');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const githubUsernameInput = document.getElementById('githubUsername');
const fetchReposButton = document.getElementById('fetchRepos');
const themeToggle = document.getElementById('themeToggle');

// Sample fallback data
const fallbackData = [
    {
        id: 1,
        name: "Finance Dashboard",
        description: "A comprehensive financial analytics dashboard with real-time data visualization.",
        language: "JavaScript",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        created_at: "2023-10-15",
        stargazers_count: 15,
        forks_count: 7,
        html_url: "#",
        homepage: "#"
    },
    {
        id: 2,
        name: "E-Commerce Platform",
        description: "Full-featured online shopping platform with payment processing and inventory management.",
        language: "Vue",
        image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        created_at: "2023-08-22",
        stargazers_count: 23,
        forks_count: 12,
        html_url: "#",
        homepage: "#"
    },
    {
        id: 3,
        name: "Health Tracker",
        description: "Mobile-first application for tracking fitness goals, nutrition, and health metrics.",
        language: "React",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        created_at: "2023-09-05",
        stargazers_count: 18,
        forks_count: 5,
        html_url: "#",
        homepage: "#"
    }
];

// Initialize app
function initApp() {
    // Check system theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Load default repos
    fetchGitHubRepos('MangalNathYadav');

    setupEventListeners();
}

// Toggle Dark/Light Mode
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    localStorage.setItem('theme', newTheme);
}

// Fetch GitHub Repos
async function fetchGitHubRepos(username) {
    appsContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error('API failed');

        const repos = await response.json();
        const filteredRepos = repos.filter(r => !r.fork && r.description);

        if (filteredRepos.length === 0) throw new Error('No valid repos found');

        renderApps(filteredRepos);
    } catch (error) {
        console.error('Error fetching:', error);
        appsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Failed to Load Projects</h2>
                <p>We couldn't connect to GitHub. Showing sample projects instead.</p>
                <small>${error.message}</small>
            </div>
        `;
        renderApps(fallbackData);
    }
}

// Render apps with dynamic styling
function renderApps(apps) {
    appsContainer.innerHTML = '';

    if (apps.length === 0) {
        appsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h2>No Projects Found</h2>
                <p>Try adjusting your search or filter.</p>
            </div>
        `;
        return;
    }

    apps.forEach((app, idx) => {
        const appCard = document.createElement('div');
        appCard.className = 'app-card';
        appCard.style.animationDelay = `${idx * 0.08}s`;

        const date = formatDate(app.created_at);
        const imageUrl = app.image || `https://picsum.photos/seed/${app.id}/800/400`;

        // Language-based gradient color
        let bgColor = '#4361ee';
        switch (app.language.toLowerCase()) {
            case 'javascript': bgColor = '#f0db4f'; break;
            case 'html': bgColor = '#e34f26'; break;
            case 'css': bgColor = '#1572b6'; break;
            case 'python': bgColor = '#3776ab'; break;
            case 'java': bgColor = '#b07219'; break;
            case 'react': bgColor = '#61dafb'; break;
            case 'vue': bgColor = '#42b983'; break;
            default: bgColor = '#4361ee';
        }

        appCard.innerHTML = `
            <div class="app-image">
                <img src="${imageUrl}" alt="${app.name}" loading="lazy">
                ${app.language ? `<span class="app-badge" style="background: ${bgColor};">${app.language}</span>` : ''}
            </div>
            <div class="app-content">
                <h3>${app.name}</h3>
                <p>${app.description || 'No description available.'}</p>
                <div class="app-stats">
                    <div class="app-stat">
                        <i class="fas fa-calendar"></i> ${date}
                    </div>
                    <div class="app-stat">
                        <i class="fas fa-star"></i> ${app.stargazers_count || 0}
                    </div>
                    <div class="app-stat">
                        <i class="fas fa-code-branch"></i> ${app.forks_count || 0}
                    </div>
                </div>
                <div class="app-links">
                    <a href="${app.homepage || app.html_url}" target="_blank" class="app-link primary">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                    <a href="${app.html_url}" target="_blank" class="app-link secondary">
                        <i class="fab fa-github"></i> Source Code
                    </a>
                </div>
            </div>
        `;

        appsContainer.appendChild(appCard);
    });

    appsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Debounced search/filter
let debounceTimer;
function filterApps() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

        const appCards = document.querySelectorAll('.app-card');
        let visibleCount = 0;

        appCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            const lang = card.querySelector('.app-badge')?.textContent.toLowerCase() || '';

            const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
            const matchesCategory = activeFilter === 'all' || lang.includes(activeFilter);

            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            appsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h2>No Matching Projects</h2>
                    <p>Try changing your search or filter.</p>
                </div>
            `;
        }
    }, 300);
}

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', filterApps);
    themeToggle.addEventListener('click', toggleTheme);

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterApps();
        });
    });

    fetchReposButton.addEventListener('click', () => {
        const username = githubUsernameInput.value.trim();
        if (username) fetchGitHubRepos(username);
    });

    githubUsernameInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            const username = githubUsernameInput.value.trim();
            if (username) fetchGitHubRepos(username);
        }
    });
}

// On DOM Load
document.addEventListener('DOMContentLoaded', initApp);