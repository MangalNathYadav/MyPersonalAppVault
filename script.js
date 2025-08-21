// ============================================
// GITHUB PORTFOLIO APP WITH SHAREABLE URLS
// ============================================

class GitHubPortfolioApp {
    constructor() {
        this.repos = [];
        this.filteredRepos = [];
        this.currentFilter = 'all';
        this.lastScrollY = 0;
        this.userData = null;
        this.currentUsername = '';
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.createParticles();
        this.hidePreloader();
        this.initializeTheme();
        this.checkUrlForUsername();
        // Hide navbar by default
        this.elements.navbar.style.display = 'none';
    }

    setupElements() {
        this.elements = {
            preloader: document.getElementById('preloader'),
            projectsGrid: document.getElementById('projectsGrid'),
            githubUsername: document.getElementById('githubUsername'),
            loadBtn: document.getElementById('loadBtn'),
            searchInput: document.getElementById('searchInput'),
            filterPills: document.getElementById('filterPills'),
            sortSelect: document.getElementById('sortSelect'),
            themeToggle: document.getElementById('themeToggle'),
            themeIcon: document.getElementById('themeIcon'),
            toast: document.getElementById('toast'),
            scrollTop: document.getElementById('scrollTop'),
            statsContainer: document.getElementById('statsContainer'),
            controlsSection: document.getElementById('controlsSection'),
            totalRepos: document.getElementById('totalRepos'),
            totalStars: document.getElementById('totalStars'),
            totalForks: document.getElementById('totalForks'),
            totalLanguages: document.getElementById('totalLanguages'),
            navbar: document.getElementById('navbar'),
            particles: document.getElementById('particles'),
            profileSection: document.getElementById('profileSection'),
            profileImage: document.getElementById('profileImage'),
            profileName: document.getElementById('profileName'),
            profileUsername: document.getElementById('profileUsername'),
            profileBio: document.getElementById('profileBio'),
            profileLocation: document.getElementById('profileLocation'),
            profileWebsite: document.getElementById('profileWebsite'),
            profileWebsiteLink: document.getElementById('profileWebsiteLink'),
            profileTwitter: document.getElementById('profileTwitter'),
            profileTwitterLink: document.getElementById('profileTwitterLink'),
            profileJoinDate: document.getElementById('profileJoinDate'),
            profileReposCount: document.getElementById('profileReposCount'),
            profileFollowers: document.getElementById('profileFollowers'),
            profileFollowing: document.getElementById('profileFollowing'),
            readmeContent: document.getElementById('readmeContent'),
            shareProfileBtn: document.getElementById('shareProfileBtn'),
            shareModal: document.getElementById('shareModal'),
            closeShareModal: document.getElementById('closeShareModal'),
            shareUrl: document.getElementById('shareUrl'),
            copyUrlBtn: document.getElementById('copyUrlBtn'),
            heroSection: document.getElementById('heroSection'),
            inputSection: document.getElementById('inputSection'),
            backToCreateBtn: document.getElementById('backToCreateBtn'),
            homeLink: document.getElementById('homeLink'),
            createOwnBtn: document.getElementById('createOwnBtn')
        };
    }

    setupEventListeners() {
        // Load button
        if (this.elements.loadBtn) {
            this.elements.loadBtn.addEventListener('click', () => this.loadRepos());
        }
        // Enter key on input
        if (this.elements.githubUsername) {
            this.elements.githubUsername.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.loadRepos();
            });
        }
        // Search
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        // Filter pills
        if (this.elements.filterPills) {
            this.elements.filterPills.addEventListener('click', (e) => {
                if (e.target.classList.contains('pill')) {
                    this.handleFilter(e.target);
                }
            });
        }
        // Sort
        if (this.elements.sortSelect) {
            this.elements.sortSelect.addEventListener('change', () => this.sortRepos());
        }
        // Theme toggle
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        // Scroll to top
        if (this.elements.scrollTop) {
            this.elements.scrollTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        // Profile tabs
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                // Tab switching logic would go here
            });
        });
        // Share profile
        if (this.elements.shareProfileBtn) {
            this.elements.shareProfileBtn.addEventListener('click', () => this.showShareModal());
        }
        // Close share modal
        if (this.elements.closeShareModal) {
            this.elements.closeShareModal.addEventListener('click', () => this.hideShareModal());
        }
        // Copy URL
        if (this.elements.copyUrlBtn) {
            this.elements.copyUrlBtn.addEventListener('click', () => this.copyUrlToClipboard());
        }
        // Close modal when clicking outside
        if (this.elements.shareModal) {
            this.elements.shareModal.addEventListener('click', (e) => {
                if (e.target === this.elements.shareModal) {
                    this.hideShareModal();
                }
            });
        }
        // Back to create button
        if (this.elements.backToCreateBtn) {
            this.elements.backToCreateBtn.addEventListener('click', () => this.showCreateSections());
        }
        // Home link
        if (this.elements.homeLink) {
            this.elements.homeLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCreateSections();
            });
        }
        // Create Own button
        if (this.elements.createOwnBtn) {
            this.elements.createOwnBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showInputSection();
            });
        }
        // Show/hide scroll button and navbar on scroll
        window.addEventListener('scroll', () => {
            if (this.elements.scrollTop) {
                if (window.scrollY > 300) {
                    this.elements.scrollTop.classList.add('visible');
                } else {
                    this.elements.scrollTop.classList.remove('visible');
                }
            }
            // Hide navbar on scroll down, show on scroll up
            if (this.elements.navbar) {
                if (window.scrollY > this.lastScrollY && window.scrollY > 100) {
                    this.elements.navbar.classList.add('hidden');
                } else {
                    this.elements.navbar.classList.remove('hidden');
                }
            }
            this.lastScrollY = window.scrollY;
        });
    }

    checkUrlForUsername() {
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('user');
        
        if (username) {
            this.elements.githubUsername.value = username;
            this.loadRepos();
            
            // Scroll to profile section
            setTimeout(() => {
                this.elements.profileSection.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        }
    }

    hideCreateSections() {
        this.elements.heroSection.classList.add('hidden');
        this.elements.inputSection.classList.add('hidden');
    }

    showInputSection() {
        // Reset to default state: show hero, hide input/profile, clear projects
        if (this.elements.heroSection) {
            this.elements.heroSection.classList.remove('hidden');
        }
        if (this.elements.inputSection) {
            this.elements.inputSection.classList.add('hidden');
        }
        if (this.elements.profileSection) {
            this.elements.profileSection.classList.remove('visible');
            this.elements.profileSection.style.display = 'none';
        }
        if (this.elements.projectsGrid) {
            this.elements.projectsGrid.innerHTML = '';
        }
    }
    
    showCreateSections() {
        this.elements.heroSection.classList.remove('hidden');
        this.elements.inputSection.classList.remove('hidden');
        this.elements.profileSection.classList.remove('visible');
        
        // Clear any existing profile data
        this.elements.profileSection.style.display = 'none';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Clear URL parameters
        window.history.pushState({}, document.title, window.location.pathname);
    }

    createParticles() {
        const particles = this.elements.particles;
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random properties
            const size = Math.random() * 5 + 2;
            const posX = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = Math.random() * 10 + 15;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            // Random color from gradients
            const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            
            particles.appendChild(particle);
        }
    }

    hidePreloader() {
        setTimeout(() => {
            this.elements.preloader.classList.add('hidden');
        }, 2000);
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            this.elements.themeIcon.className = 'fas fa-sun';
        }
    }

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        this.elements.themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        this.showToast(`Switched to ${isLight ? 'light' : 'dark'} theme`);
    }

    async loadRepos() {
        const username = this.elements.githubUsername.value.trim();
        if (!username) {
            this.showToast('Please enter a GitHub username');
            // Hide navbar if no profile
            this.elements.navbar.style.display = 'none';
            return;
        }

        this.currentUsername = username;
        this.showLoading();
        this.hideCreateSections();

        try {
            // Load user data first
            const userResponse = await fetch(`https://api.github.com/users/${username}`);
            
            if (userResponse.status === 404) {
                this.showToast('User not found');
                this.showCreateSections(); // Return to create section
                this.elements.navbar.style.display = 'none';
                return;
            }
            
            if (!userResponse.ok) {
                throw new Error(`GitHub API error: ${userResponse.status}`);
            }

            this.userData = await userResponse.json();
            this.displayUserProfile();
            // Show navbar when profile is loaded
            this.elements.navbar.style.display = '';

            // Load repositories
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
            
            if (reposResponse.status === 404) {
                this.showToast('User has no public repositories');
                this.repos = [];
            } else if (!reposResponse.ok) {
                throw new Error(`Failed to load repositories: ${reposResponse.status}`);
            } else {
                const repos = await reposResponse.json();
                this.repos = repos.map((repo, index) => ({
                    ...repo,
                    imageUrl: `https://opengraph.githubassets.com/1/${username}/${repo.name}`
                }));
            }

            // Handle case where user has no repos
            if (this.repos.length === 0) {
                this.showToast('No public repositories found');
                this.filteredRepos = [];
                this.renderProjects();
                this.updateStats();
                this.showControls();
                return;
            }

            this.filteredRepos = [...this.repos];
            this.sortRepos();
            this.renderProjects();
            this.updateStats();
            this.showControls();
            this.showToast(`Loaded ${this.repos.length} repositories`);

            // Load README
            await this.loadReadme(username);

            // Update URL with username parameter
            this.updateBrowserUrl(username);

        } catch (error) {
            console.error('Error:', error);
            this.showToast('Failed to load data: ' + error.message);
            this.loadSampleData();
        }
    }

    updateBrowserUrl(username) {
        const newUrl = `${window.location.origin}${window.location.pathname}?user=${username}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    async loadReadme(username) {
        try {
            // Try to get README from a repository named after the username
            const repoReadmeResponse = await fetch(`https://api.github.com/repos/${username}/${username}/readme`);
            
            if (repoReadmeResponse.ok) {
                const readmeData = await repoReadmeResponse.json();
                const readmeContent = atob(readmeData.content);
                this.elements.readmeContent.innerHTML = marked.parse(readmeContent);
                return;
            }
            
            // If that fails, try to find any README in their repositories
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
            
            if (reposResponse.ok) {
                const repos = await reposResponse.json();
                
                // Look for a README in each repo (starting with the most recent)
                for (const repo of repos) {
                    try {
                        const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`);
                        
                        if (readmeResponse.ok) {
                            const readmeData = await readmeResponse.json();
                            const readmeContent = atob(readmeData.content);
                            this.elements.readmeContent.innerHTML = marked.parse(readmeContent);
                            return;
                        }
                    } catch (e) {
                        // Continue to next repo if this one fails
                        console.log(`No README in ${repo.name}`);
                    }
                }
            }
            
            // If all else fails, show a message
            this.elements.readmeContent.innerHTML = `
                <p>No README found for this user.</p>
                <p>Users can add a README to their profile by creating a repository with the same name as their username 
                and adding a README.md file to it.</p>
            `;
        } catch (error) {
            console.error('Error loading README:', error);
            this.elements.readmeContent.innerHTML = `
                <p>Error loading README content.</p>
                <p>This might be due to rate limiting or network issues.</p>
            `;
        }
    }

    displayUserProfile() {
        if (!this.userData) return;
        
        this.elements.profileSection.style.display = 'block';
        setTimeout(() => {
            this.elements.profileSection.classList.add('visible');
        }, 50);
        
        // Set profile data
        this.elements.profileImage.src = this.userData.avatar_url;
        this.elements.profileName.textContent = this.userData.name || this.userData.login;
        this.elements.profileUsername.textContent = `@${this.userData.login}`;
        this.elements.profileBio.textContent = this.userData.bio || 'No bio available';
        
        // Set details
        if (this.userData.location) {
            this.elements.profileLocation.querySelector('span').textContent = this.userData.location;
            this.elements.profileLocation.style.display = 'flex';
        } else {
            this.elements.profileLocation.style.display = 'none';
        }
        
        if (this.userData.blog) {
            this.elements.profileWebsiteLink.href = this.userData.blog;
            this.elements.profileWebsiteLink.textContent = this.userData.blog;
            this.elements.profileWebsite.style.display = 'flex';
        } else {
            this.elements.profileWebsite.style.display = 'none';
        }
        
        if (this.userData.twitter_username) {
            this.elements.profileTwitterLink.href = `https://twitter.com/${this.userData.twitter_username}`;
            this.elements.profileTwitterLink.textContent = `@${this.userData.twitter_username}`;
            this.elements.profileTwitter.style.display = 'flex';
        } else {
            this.elements.profileTwitter.style.display = 'none';
        }
        
        // Format join date
        const joinDate = new Date(this.userData.created_at);
        this.elements.profileJoinDate.textContent = joinDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
        });
        
        // Set stats
        this.elements.profileReposCount.textContent = this.userData.public_repos;
        this.elements.profileFollowers.textContent = this.userData.followers;
        this.elements.profileFollowing.textContent = this.userData.following;
    }

    showShareModal() {
        if (!this.currentUsername) {
            this.showToast('Please generate a portfolio first');
            return;
        }
        
        const portfolioUrl = `${window.location.origin}${window.location.pathname}?user=${this.currentUsername}`;
        this.elements.shareUrl.value = portfolioUrl;
        
        this.elements.shareModal.classList.add('visible');
    }

    hideShareModal() {
        this.elements.shareModal.classList.remove('visible');
    }

    copyUrlToClipboard() {
        this.elements.shareUrl.select();
        document.execCommand('copy');
        this.showToast('URL copied to clipboard!');
    }

    loadSampleData() {
        this.userData = {
            login: 'sampleuser',
            avatar_url: 'https://via.placeholder.com/150/6366f1/ffffff?text=Sample+User',
            name: 'Sample User',
            bio: 'This is a sample user profile with demo data',
            location: 'Internet',
            blog: 'https://sampleuser.dev',
            twitter_username: 'sampleuser',
            created_at: '2020-01-01T00:00:00Z',
            public_repos: 3,
            followers: 100,
            following: 50
        };
        
        this.displayUserProfile();
        
        this.repos = [
            {
                name: 'awesome-project',
                description: 'An awesome project that does amazing things with modern web technologies',
                html_url: 'https://github.com/sample/awesome-project',
                homepage: 'https://awesome-project.com',
                language: 'JavaScript',
                stargazers_count: 1234,
                forks_count: 456,
                updated_at: '2024-01-15',
                imageUrl: 'https://via.placeholder.com/400x200/6366f1/ffffff?text=Awesome+Project'
            },
            {
                name: 'machine-learning-toolkit',
                description: 'A comprehensive toolkit for machine learning applications',
                html_url: 'https://github.com/sample/ml-toolkit',
                homepage: '',
                language: 'Python',
                stargazers_count: 5678,
                forks_count: 890,
                updated_at: '2024-01-14',
                imageUrl: 'https://via.placeholder.com/400x200/8b5cf6/ffffff?text=ML+Toolkit'
            },
            {
                name: 'react-components',
                description: 'Reusable React components for modern web applications',
                html_url: 'https://github.com/sample/react-components',
                homepage: 'https://react-components.dev',
                language: 'TypeScript',
                stargazers_count: 2345,
                forks_count: 234,
                updated_at: '2024-01-13',
                imageUrl: 'https://via.placeholder.com/400x200/06b6d4/ffffff?text=React+Components'
            }
        ];

        this.filteredRepos = [...this.repos];
        this.renderProjects();
        this.updateStats();
        this.showControls();
        
        // Set sample README
        this.elements.readmeContent.innerHTML = marked.parse(`
# Sample User

## 👋 About Me

I'm a sample user demonstrating the GitHub Portfolio 3D application.

## 🛠️ Technologies & Tools

- JavaScript
- React
- Node.js
- Python
- Machine Learning

## 📈 GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=sampleuser&show_icons=true&theme=radical)

## 📫 How to reach me

- Website: https://sampleuser.dev
- Twitter: @sampleuser
- Email: sample@user.com
        `);
    }

    showLoading() {
        this.elements.projectsGrid.innerHTML = `
            <div class="loading-container" style="grid-column: 1/-1;">
                <div class="spinner"></div>
                <p>Loading repositories...</p>
            </div>
        `;
    }

    renderProjects() {
        if (this.filteredRepos.length === 0) {
            this.elements.projectsGrid.innerHTML = `
                <div class="loading-container" style="grid-column: 1/-1;">
                    <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--text-tertiary);"></i>
                    <p>No projects found</p>
                </div>
            `;
            return;
        }

        this.elements.projectsGrid.innerHTML = this.filteredRepos.map((repo, index) => `
            <div class="project-card" style="animation-delay: ${index * 0.1}s">
                <div class="project-image">
                    <img src="${repo.imageUrl}" alt="${repo.name}" onerror="this.src='https://via.placeholder.com/400x200/6366f1/ffffff?text=${repo.name}'">
                    ${repo.language ? `<span class="project-badge">${repo.language}</span>` : ''}
                </div>
                <div class="project-content">
                    <h3 class="project-title">${repo.name}</h3>
                    <p class="project-description">${repo.description || 'No description available'}</p>
                    <div class="project-stats">
                        <span class="stat-item">
                            <i class="fas fa-star"></i> ${repo.stargazers_count || 0}
                        </span>
                        <span class="stat-item">
                            <i class="fas fa-code-branch"></i> ${repo.forks_count || 0}
                        </span>
                        <span class="stat-item">
                            <i class="fas fa-clock"></i> ${new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i> Code
                        </a>
                        ${repo.homepage ? `
                            <a href="${repo.homepage}" target="_blank" class="project-link">
                                <i class="fas fa-external-link-alt"></i> Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        
        // Animate project cards in
        setTimeout(() => {
            document.querySelectorAll('.project-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            });
        }, 50);
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase();
        
        if (!searchTerm) {
            this.filteredRepos = [...this.repos];
        } else {
            this.filteredRepos = this.repos.filter(repo => 
                repo.name.toLowerCase().includes(searchTerm) ||
                (repo.description && repo.description.toLowerCase().includes(searchTerm))
            );
        }
        
        this.applyFilter();
        this.sortRepos();
        this.renderProjects();
    }

    handleFilter(pill) {
        // Update active state
        this.elements.filterPills.querySelectorAll('.pill').forEach(p => {
            p.classList.remove('active');
        });
        pill.classList.add('active');
        
        this.currentFilter = pill.dataset.filter;
        this.applyFilter();
        this.renderProjects();
    }

    applyFilter() {
        if (this.currentFilter === 'all') {
            // Keep current filtered repos (from search)
            return;
        }
        
        this.filteredRepos = this.filteredRepos.filter(repo => {
            const language = (repo.language || '').toLowerCase();
            return language === this.currentFilter.toLowerCase();
        });
    }

    sortRepos() {
        const sortBy = this.elements.sortSelect?.value || 'stars';
        
        switch(sortBy) {
            case 'stars':
                this.filteredRepos.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
                break;
            case 'forks':
                this.filteredRepos.sort((a, b) => (b.forks_count || 0) - (a.forks_count || 0));
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
    }

    updateStats() {
        const stats = {
            repos: this.repos.length,
            stars: this.repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
            forks: this.repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
            languages: [...new Set(this.repos.map(repo => repo.language).filter(Boolean))].length
        };

        this.animateNumber(this.elements.totalRepos, stats.repos);
        this.animateNumber(this.elements.totalStars, stats.stars);
        this.animateNumber(this.elements.totalForks, stats.forks);
        this.animateNumber(this.elements.totalLanguages, stats.languages);
        
        this.elements.statsContainer.classList.add('visible');
    }

    animateNumber(element, target) {
        const duration = 1000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    showControls() {
        this.elements.controlsSection.classList.add('visible');
    }

    showToast(message) {
        this.elements.toast.textContent = message;
        this.elements.toast.classList.add('show');
        
        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, 3000);
    }
}

// Global function for quick links
function loadUser(username) {
    document.getElementById('githubUsername').value = username;
    portfolio.loadRepos();
}

// Initialize app
const portfolio = new GitHubPortfolioApp();