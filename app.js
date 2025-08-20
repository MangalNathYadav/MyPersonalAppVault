// ...all JS from the <script> block in index.html...
// DOM Elements
const appsContainer = document.getElementById('appsContainer');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const githubUsernameInput = document.getElementById('githubUsername');
const fetchReposButton = document.getElementById('fetchRepos');

// Sample data as fallback
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

// Initialize the app
function initApp() {
    // Try to fetch GitHub repos on load with the default username
    fetchGitHubRepos('MangalNathYadav');
    setupEventListeners();
}

// Fetch GitHub repositories
async function fetchGitHubRepos(username) {
    appsContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
    
    try {
        // Try to fetch from GitHub API
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error('GitHub API request failed');
        }
        
        const repos = await response.json();
        
        // Filter out forks and empty repos
        const filteredRepos = repos.filter(repo => !repo.fork && repo.description);
        
        if (filteredRepos.length === 0) {
            throw new Error('No repositories found');
        }
        
        renderApps(filteredRepos);
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        
        // Show error message but use fallback data
        appsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Unable to Load GitHub Projects</h2>
                <p>We encountered an issue loading projects from GitHub. Showing sample projects instead.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
        
        // Use fallback data
        renderApps(fallbackData);
    }
}

// Render apps to the DOM
function renderApps(apps) {
    appsContainer.innerHTML = '';
    
    if (apps.length === 0) {
        appsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h2>No Projects Found</h2>
                <p>Try adjusting your search or filter to find what you're looking for.</p>
            </div>
        `;
        return;
    }
    
    apps.forEach(app => {
        const appCard = document.createElement('div');
        appCard.className = 'app-card';
        
        // Use a default image if none is provided
        const imageUrl = app.image || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80`;
        
        // Format the date
        const date = formatDate(app.created_at);
        
        appCard.innerHTML = `
            <div class="app-image">
                <img src="${imageUrl}" alt="${app.name}">
                ${app.language ? `<span class="app-badge">${app.language}</span>` : ''}
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
}

// Format date to readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Filter apps based on search and category
function filterApps() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    
    // This is a simplified version - in a real app, you would filter the actual data
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const language = card.querySelector('.app-badge')?.textContent.toLowerCase() || '';
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesCategory = activeFilter === 'all' || language.includes(activeFilter);
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Check if all cards are hidden
    const visibleCards = Array.from(appCards).filter(card => card.style.display !== 'none');
    if (visibleCards.length === 0) {
        appsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h2>No Projects Found</h2>
                <p>Try adjusting your search or filter to find what you're looking for.</p>
            </div>
        `;
    }
}

// Set up event listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', filterApps);
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterApps();
        });
    });
    
    // Fetch GitHub repos button
    fetchReposButton.addEventListener('click', () => {
        const username = githubUsernameInput.value.trim();
        if (username) {
            fetchGitHubRepos(username);
        }
    });
    
    // Allow pressing Enter in the username field
    githubUsernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const username = githubUsernameInput.value.trim();
            if (username) {
                fetchGitHubRepos(username);
            }
        }
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
