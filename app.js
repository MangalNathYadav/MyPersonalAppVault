// Advanced GitHub Portfolio App with Modern Features

class GitHubPortfolio {
    constructor() {
        this.repos = [];
        this.filteredRepos = [];
        this.currentView = 'grid';
        this.isDarkTheme = localStorage.getItem('darkTheme') === 'true';
        this.username = '';
        
        this.initializeElements();
        this.initializeTheme();
        this.setupEventListeners();
        this.createParticles();
        this.setupCustomCursor();
        this.initializeApp();
    }

    initializeElements() {
        // Core elements
        this.elements = {
            projectsContainer: document.getElementById('projectsContainer'),
            searchInput: document.getElementById('searchInput'),
            githubUsername: document.getElementById('githubUsername'),
            fetchReposBtn: document.getElementById('fetchRepos'),
            themeToggle: document.getElementById('themeToggle'),
            themeIcon: document.getElementById('themeIcon'),
            toast: document.getElementById('toast'),
            sortSelect: document.getElementById('sortSelect'),
            fabButton: document.getElementById('fabButton'),
            analyticsSection: document.getElementById('analyticsSection'),
            
            // Stats elements
            headerStats: document.getElementById('headerStats'),
            projectCount: document.getElementById('projectCount'),
            lastUpdated: document.getElementById('lastUpdated'),
            
            // Filter elements
            filterChips: document.querySelectorAll('.chip'),
            viewButtons: document.querySelectorAll('.view-btn'),
            
            // FAB options
            exportBtn: document.getElementById('exportBtn'),
            refreshBtn: document.getElementById('refreshBtn'),
            scrollTopBtn: document.getElementById('scrollTopBtn'),
        };
    }

    initializeTheme() {
        if (this.isDarkTheme) {
            document.body.classList.add('dark-theme');
            this.elements.themeIcon.className = 'fas fa-sun';
        }
    }

    setupEventListeners() {
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // GitHub username input
        this.elements.fetchReposBtn.addEventListener('click', () => this.fetchRepos());
        this.elements.githubUsername.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.fetchRepos();
        });
        
        // Search
        this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        // Filters
        this.elements.filterChips.forEach(chip => {
            chip.addEventListener('click', (e) => this.handleFilter(e));
        });
        
        // View toggles
        this.elements.viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.changeView(e));
        });
        
        // Sort
        this.elements.sortSelect.addEventListener('change', () => this.sortRepos());
        
        // FAB
        this.elements.fabButton.addEventListener('click', () => this.toggleFAB());
        this.elements.exportBtn?.addEventListener('click', () => this.exportData());
        this.elements.refreshBtn?.addEventListener('click', () => this.fetchRepos());
        this.elements.scrollTopBtn?.addEventListener('click', () => this.scrollToTop());
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('dark-theme');
        this.elements.themeIcon.className = this.isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('darkTheme', this.isDarkTheme);
        
        this.showToast('Theme changed successfully');
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = 15 + Math.random() * 10 + 's';
            particlesContainer.appendChild(particle);
        }
    }

    setupCustomCursor() {
        const cursor = {
            dot: document.querySelector('.cursor-dot'),
            outline: document.querySelector('.cursor-outline')
        };
        
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursor.dot.style.left = `${posX}px`;
            cursor.dot.style.top = `${posY}px`;
            
            cursor.outline.style.left = `${posX}px`;
            cursor.outline.style.top = `${posY}px`;
        });
    }

    async fetchRepos() {
        const username = this.elements.githubUsername.value.trim();
        if (!username) {
            this.showToast('Please enter a GitHub username', 'warning');
            return;
        }
        
        this.username = username;
        this.showLoading();
        
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const repos = await response.json();
            
            // Process and enhance repo data
            this.repos = repos.map(repo => ({
                ...repo,
                image: this.generateProjectImage(repo.name),
                languages: [] // Will be populated if needed
            }));
            
            this.filteredRepos = [...this.repos];
            this.updateStats();
            this.renderProjects();
            this.showAnalytics();
            
            this.showToast(`Successfully loaded ${repos.length} repositories`);
            this.elements.lastUpdated.textContent = new Date().toLocaleString();
            
        } catch (error) {
            console.error('Error fetching repos:', error);
            this.showToast('Failed to load repositories. Using sample data.', 'error');
            this.loadSampleData();
        }
    }

    generateProjectImage(name) {
        const images = [
            'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800',
            'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800',
            'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
            'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800',
            'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800'
        ];
        
        // Generate consistent image based on project name
        const index = name.length % images.length;
        return images[index];
    }

    updateStats() {
        const stats = {
            repos: this.repos.length,
            stars: this.repos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
            forks: this.repos.reduce((acc, repo) => acc + repo.forks_count, 0),
            languages: [...new Set(this.repos.map(repo => repo.language).filter(Boolean))].length
        };
        
        // Animate counter
        this.animateCounter(document.querySelector('[data-target="0"]'), stats.repos);
        this.animateCounter(document.querySelectorAll('[data-target="0"]')[1], stats.stars);
        this.animateCounter(document.querySelectorAll('[data-target="0"]')[2], stats.languages);
        this.animateCounter(document.querySelectorAll('[data-target="0"]')[3], stats.forks);
        
        this.elements.projectCount.textContent = stats.repos;
    }

    animateCounter(element, target) {
        if (!element) return;
        
        const duration = 1500;
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    renderProjects() {
        const container = this.elements.projectsContainer;
        container.innerHTML = '';
        
        if (this.filteredRepos.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--text-tertiary); margin-bottom: 1rem; display: block;"></i>
                    <h3>No Projects Found</h3>
                    <p style="color: var(--text-secondary);">Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }
        
        // Apply view class
        container.className = `projects-container ${this.currentView}-view`;
        
        this.filteredRepos.forEach((repo, index) => {
            const card = this.createProjectCard(repo, index);
            container.appendChild(card);
        });
    }

    createProjectCard(repo, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        const date = new Date(repo.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
        });
        
        card.innerHTML = `
            <div class="project-image">
                <img src="${repo.image}" alt="${repo.name}" loading="lazy">
                ${repo.language ? `<span class="project-badge">${repo.language}</span>` : ''}
            </div>
            <div class="project-content">
                <h3 class="project-title">${repo.name}</h3>
                <p class="project-description">${repo.description || 'No description available'}</p>
                <div class="project-meta">
                    <span class="meta-item">
                        <i class="fas fa-star"></i> ${repo.stargazers_count}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-code-branch"></i> ${repo.forks_count}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-calendar"></i> ${date}
                    </span>
                </div>
                <div class="project-actions">
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" class="project-link primary">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    ` : ''}
                    <a href="${repo.html_url}" target="_blank" class="project-link secondary">
                        <i class="fab fa-github"></i> Code
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredRepos = [...this.repos];
        } else {
            this.filteredRepos = this.repos.filter(repo => 
                repo.name.toLowerCase().includes(searchTerm) ||
                (repo.description && repo.description.toLowerCase().includes(searchTerm)) ||
                (repo.language && repo.language.toLowerCase().includes(searchTerm))
            );
        }
        
        this.renderProjects();
    }

    handleFilter(e) {
        const chip = e.currentTarget;
        const filter = chip.dataset.filter;
        
        // Update active state
        this.elements.filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        if (filter === 'all') {
            this.filteredRepos = [...this.repos];
        } else {
            this.filteredRepos = this.repos.filter(repo => {
                const lang = (repo.language || '').toLowerCase();
                return lang.includes(filter.toLowerCase());
            });
        }
        
        this.renderProjects();
    }

    changeView(e) {
        const btn = e.currentTarget;
        const view = btn.dataset.view;
        
        // Update active state
        this.elements.viewButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.currentView = view;
        this.renderProjects();
    }

    sortRepos() {
        const sortBy = this.elements.sortSelect.value;
        
        switch(sortBy) {
            case 'stars':
                this.filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
                break;
            case 'forks':
                this.filteredRepos.sort((a, b) => b.forks_count - a.forks_count);
                break;
            case 'updated':
                this.filteredRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                break;
            case 'created':
                this.filteredRepos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'name':
                this.filteredRepos.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        
        this.renderProjects();
    }

    showAnalytics() {
        const section = this.elements.analyticsSection;
        if (!section) return;
        
        section.style.display = 'block';
        
        // Calculate language distribution
        const languages = {};
        this.repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });
        
        // Create simple chart
        const chartContainer = document.getElementById('languageChart');
        const legendContainer = document.getElementById('chartLegend');
        
        if (!chartContainer || !legendContainer) return;
        
        const total = Object.values(languages).reduce((a, b) => a + b, 0);
        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
        
        chartContainer.innerHTML = '';
        legendContainer.innerHTML = '';
        
        Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .forEach(([lang, count], index) => {
                const percentage = ((count / total) * 100).toFixed(1);
                const color = colors[index % colors.length];
                
                // Add to legend
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                legendItem.innerHTML = `
                    <span class="legend-color" style="background: ${color}"></span>
                    <span>${lang}: ${percentage}%</span>
                `;
                legendContainer.appendChild(legendItem);
            });
    }

    toggleFAB() {
        const container = document.querySelector('.fab-container');
        container.classList.toggle('active');
    }

    exportData() {
        const data = this.filteredRepos.map(repo => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count
        }));
        
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `github-portfolio-${this.username}.json`;
        a.click();
        
        this.showToast('Data exported successfully');
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    showLoading() {
        this.elements.projectsContainer.innerHTML = `
            <div class="loading-skeleton">
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
            </div>
        `;
    }

    showToast(message, type = 'success') {
        const toast = this.elements.toast;
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('i');
        
        toastMessage.textContent = message;
        
        // Update icon based on type
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle'
        };
        
        toastIcon.className = icons[type] || icons.success;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    loadSampleData() {
        this.repos = [
            {
                name: 'awesome-react-app',
                description: 'A modern React application with Redux and TypeScript',
                html_url: '#',
                homepage: '#',
                language: 'TypeScript',
                stargazers_count: 42,
                forks_count: 12,
                created_at: '2023-01-15',
                updated_at: '2024-01-10',
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800'
            },
            {
                name: 'python-ml-toolkit',
                description: 'Machine learning toolkit with TensorFlow and scikit-learn',
                html_url: '#',
                homepage: '#',
                language: 'Python',
                stargazers_count: 128,
                forks_count: 45,
                created_at: '2023-03-20',
                updated_at: '2024-01-08',
                image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800'
            },
            {
                name: 'vue-dashboard',
                description: 'Beautiful admin dashboard built with Vue 3 and Tailwind CSS',
                html_url: '#',
                homepage: '#',
                language: 'Vue',
                stargazers_count: 89,
                forks_count: 23,
                created_at: '2023-06-10',
                updated_at: '2024-01-05',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
            }
        ];
        
        this.filteredRepos = [...this.repos];
        this.updateStats();
        this.renderProjects();
    }

    initializeApp() {
        // Check for saved username
        const savedUsername = localStorage.getItem('githubUsername');
        if (savedUsername) {
            this.elements.githubUsername.value = savedUsername;
            this.fetchRepos();
        } else {
            this.loadSampleData();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GitHubPortfolio();
});