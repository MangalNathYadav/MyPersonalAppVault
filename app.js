// ============================================
// ULTRA MODERN 3D PORTFOLIO APP
// ============================================

class Portfolio3D {
    constructor() {
        this.repos = [];
        this.filteredRepos = [];
        this.currentView = 'cards';
        this.currentFilter = 'all';
        this.currentSort = 'stars';
        this.isLoading = false;
        this.username = '';
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupAnimations();
        this.setup3DEffects();
        this.setupCursor();
        this.hidePreloader();
        
        // Initialize with sample data
        setTimeout(() => {
            this.loadSampleUser();
        }, 1000);
    }

    setupElements() {
        this.elements = {
            // Core elements
            preloader: document.getElementById('preloader'),
            projectsContainer: document.getElementById('projectsContainer'),
            projectCount: document.getElementById('projectCount'),
            searchInput: document.getElementById('searchInput'),
            githubUsername: document.getElementById('githubUsername'),
            loadReposBtn: document.getElementById('loadReposBtn'),
            connectionStatus: document.getElementById('connectionStatus'),
            
            // Controls
            filterPills: document.querySelectorAll('.pill-3d'),
            viewModes: document.querySelectorAll('.view-mode'),
            sortSelect: document.getElementById('sortSelect'),
            
            // Theme
            themeSwitch: document.getElementById('themeSwitch'),
            
            // FAB
            floatingMenu: document.getElementById('floatingMenu'),
            fabToggle: document.getElementById('fabToggle'),
            fabOptions: document.querySelectorAll('.fab-option'),
            
            // Modal
            projectModal: document.getElementById('projectModal'),
            modalClose: document.getElementById('modalClose'),
            modalBody: document.getElementById('modalBody'),
            
            // Quick links
            quickLinks: document.querySelectorAll('.quick-link'),
            
            // Analytics
            analyticsSection: document.getElementById('analyticsSection'),
            
            // Notification container
            notificationContainer: document.getElementById('notificationContainer')
        };
    }

    setupEventListeners() {
        // Load repos
        this.elements.loadReposBtn.addEventListener('click', () => this.loadRepos());
        this.elements.githubUsername.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadRepos();
        });

        // Quick links
        this.elements.quickLinks.forEach(link => {
            link.addEventListener('click', () => {
                const username = link.dataset.username;
                this.elements.githubUsername.value = username;
                this.loadRepos();
            });
        });

        // Search
        let searchTimeout;
        this.elements.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });

        // Filters
        this.elements.filterPills.forEach(pill => {
            pill.addEventListener('click', () => this.handleFilter(pill));
        });

        // View modes
        this.elements.viewModes.forEach(mode => {
            mode.addEventListener('click', () => this.changeView(mode));
        });

        // Sort
        this.elements.sortSelect.addEventListener('change', () => this.sortRepos());

        // Theme
        this.elements.themeSwitch.addEventListener('click', () => this.toggleTheme());

        // FAB
        this.elements.fabToggle.addEventListener('click', () => this.toggleFAB());
        this.elements.fabOptions.forEach(option => {
            option.addEventListener('click', () => this.handleFABAction(option.dataset.action));
        });

        // Modal
        this.elements.modalClose.addEventListener('click', () => this.closeModal());
        this.elements.projectModal.addEventListener('click', (e) => {
            if (e.target === this.elements.projectModal) this.closeModal();
        });

        // Scroll animations
        window.addEventListener('scroll', () => this.handleScroll());
    }

    setupAnimations() {
        // GSAP-like animations using Web Animations API
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        // Observe sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    setup3DEffects() {
        // Tilt effect for 3D elements
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });

        // 3D Canvas background
        this.setup3DCanvas();
    }

    setup3DCanvas() {
        const canvas = document.getElementById('canvas3d');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 50;
        
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * 1000;
                this.size = Math.random() * 2;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.speedZ = Math.random() * 1;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.z -= this.speedZ;
                
                if (this.z <= 0) this.reset();
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            
            draw() {
                const scale = 1000 / (1000 + this.z);
                const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
                const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
                const size = this.size * scale;
                
                ctx.beginPath();
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${scale * 0.5})`;
                ctx.fill();
            }
        }
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Connect nearby particles
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const distance = Math.sqrt(
                        Math.pow(p1.x - p2.x, 2) + 
                        Math.pow(p1.y - p2.y, 2) + 
                        Math.pow(p1.z - p2.z, 2)
                    );
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 150)})`;
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    setupCursor() {
        const cursor = {
            ball: document.querySelector('.cursor-ball'),
            ring: document.querySelector('.cursor-ring')
        };
        
        if (!cursor.ball || !cursor.ring) return;
        
        let mouseX = 0, mouseY = 0;
        let ballX = 0, ballY = 0;
        let ringX = 0, ringY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animateCursor = () => {
            // Smooth follow animation
            ballX += (mouseX - ballX) * 0.2;
            ballY += (mouseY - ballY) * 0.2;
            ringX += (mouseX - ringX) * 0.1;
            ringY += (mouseY - ringY) * 0.1;
            
            cursor.ball.style.left = ballX - 7.5 + 'px';
            cursor.ball.style.top = ballY - 7.5 + 'px';
            cursor.ring.style.left = ringX - 20 + 'px';
            cursor.ring.style.top = ringY - 20 + 'px';
            
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();
        
        // Hover effects
        const hoverElements = document.querySelectorAll('button, a, .project-card-3d');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.ring.style.transform = 'scale(1.5)';
                cursor.ball.style.transform = 'scale(0.5)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.ring.style.transform = 'scale(1)';
                cursor.ball.style.transform = 'scale(1)';
            });
        });
    }

    hidePreloader() {
        setTimeout(() => {
            this.elements.preloader.classList.add('hidden');
        }, 1500);
    }

    async loadRepos() {
        const username = this.elements.githubUsername.value.trim();
        if (!username) {
            this.showNotification('Please enter a GitHub username', 'warning');
            return;
        }
        
        this.username = username;
        this.isLoading = true;
        this.showLoading();
        this.updateConnectionStatus('loading');
        
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const repos = await response.json();
            
            // Process repos
            this.repos = repos.map((repo, index) => ({
                ...repo,
                index: index,
                imageUrl: this.generateImageUrl(repo.name, index)
            }));
            
            this.filteredRepos = [...this.repos];
            this.sortRepos();
            this.renderProjects();
            this.updateStats();
            this.showAnalytics();
            this.updateConnectionStatus('connected');
            
            this.showNotification(`Successfully loaded ${repos.length} repositories`, 'success');
            
        } catch (error) {
            console.error('Error loading repos:', error);
            this.showNotification('Failed to load repositories', 'error');
            this.updateConnectionStatus('error');
            this.loadSampleData();
        } finally {
            this.isLoading = false;
        }
    }

    generateImageUrl(name, index) {
        const images = [
            'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8',
            'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2',
            'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
            'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2',
            'https://images.unsplash.com/photo-1605379399642-870262d3d051',
            'https://images.unsplash.com/photo-1607706189992-eae578626c86',
            'https://images.unsplash.com/photo-1504639725590-34d0984388bd',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
        ];
        
        return `${images[index % images.length]}?w=800&h=600&fit=crop`;
    }

    updateConnectionStatus(status) {
        const statusElement = this.elements.connectionStatus;
        const statusDot = statusElement.querySelector('.status-dot');
        const statusText = statusElement.querySelector('span:last-child');
        
        switch(status) {
            case 'loading':
                statusDot.style.background = 'var(--warning)';
                statusText.textContent = 'Connecting...';
                break;
            case 'connected':
                statusDot.style.background = 'var(--success)';
                statusText.textContent = `Connected to ${this.username}`;
                break;
            case 'error':
                statusDot.style.background = 'var(--danger)';
                statusText.textContent = 'Connection failed';
                break;
            default:
                statusDot.style.background = 'var(--text-tertiary)';
                statusText.textContent = 'Ready to connect';
        }
    }

    showLoading() {
        this.elements.projectsContainer.innerHTML = `
            <div class="loading-container">
                <div class="dna-loader">
                    <div class="dna-strand"></div>
                    <div class="dna-strand"></div>
                </div>
                <p>Loading repositories...</p>
            </div>
        `;
    }

    renderProjects() {
        const container = this.elements.projectsContainer;
        container.innerHTML = '';
        
        if (this.filteredRepos.length === 0) {
            container.innerHTML = `
                <div class="loading-container">
                    <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--text-tertiary); margin-bottom: 1rem;"></i>
                    <p>No repositories found</p>
                </div>
            `;
            this.elements.projectCount.textContent = '0';
            return;
        }
        
        // Update count
        this.elements.projectCount.textContent = this.filteredRepos.length;
        
        // Set view class
        container.className = `projects-container ${this.currentView}-view`;
        
        // Render cards
        this.filteredRepos.forEach((repo, index) => {
            const card = this.createProjectCard(repo, index);
            container.appendChild(card);
        });
        
        // Re-setup 3D effects for new cards
        this.setup3DEffects();
    }

    createProjectCard(repo, index) {
        const card = document.createElement('div');
        card.className = 'project-card-3d';
        card.style.setProperty('--i', index);
        
        const language = repo.language || 'Code';
        const stars = repo.stargazers_count || 0;
        const forks = repo.forks_count || 0;
        const description = repo.description || 'No description available';
        const updatedAt = new Date(repo.updated_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        card.innerHTML = `
            <div class="card-image-3d">
                <img src="${repo.imageUrl}" alt="${repo.name}" loading="lazy">
                <span class="card-badge">${language}</span>
            </div>
            <div class="card-content-3d">
                <div class="card-title">
                    <div class="card-title-icon">
                        <i class="fas fa-folder"></i>
                    </div>
                    <span>${repo.name}</span>
                </div>
                <p class="card-description">${description}</p>
                <div class="card-stats">
                    <div class="stat-item">
                        <i class="fas fa-star"></i>
                        <span>${stars}</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-code-branch"></i>
                        <span>${forks}</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-calendar"></i>
                        <span>${updatedAt}</span>
                    </div>
                </div>
                <div class="card-actions">
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" class="card-btn">
                            <span><i class="fas fa-external-link-alt"></i> Demo</span>
                        </a>
                    ` : ''}
                    <a href="${repo.html_url}" target="_blank" class="card-btn">
                        <span><i class="fab fa-github"></i> Code</span>
                    </a>
                </div>
            </div>
        `;
        
        // Add click event for modal
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-btn')) {
                this.showProjectModal(repo);
            }
        });
        
        return card;
    }

    showProjectModal(repo) {
        const modal = this.elements.projectModal;
        const modalBody = this.elements.modalBody;
        
        modalBody.innerHTML = `
            <div style="padding: 2rem;">
                <h2 style="margin-bottom: 1rem;">${repo.name}</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                    ${repo.description || 'No description available'}
                </p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="background: var(--surface); padding: 1rem; border-radius: 12px;">
                        <i class="fas fa-star" style="color: var(--warning);"></i>
                        <strong style="margin-left: 0.5rem;">${repo.stargazers_count}</strong> Stars
                    </div>
                    <div style="background: var(--surface); padding: 1rem; border-radius: 12px;">
                        <i class="fas fa-code-branch" style="color: var(--primary);"></i>
                        <strong style="margin-left: 0.5rem;">${repo.forks_count}</strong> Forks
                    </div>
                    <div style="background: var(--surface); padding: 1rem; border-radius: 12px;">
                        <i class="fas fa-eye" style="color: var(--accent);"></i>
                        <strong style="margin-left: 0.5rem;">${repo.watchers_count}</strong> Watchers
                    </div>
                    <div style="background: var(--surface); padding: 1rem; border-radius: 12px;">
                        <i class="fas fa-exclamation-circle" style="color: var(--danger);"></i>
                        <strong style="margin-left: 0.5rem;">${repo.open_issues_count}</strong> Issues
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem;">
                    <a href="${repo.html_url}" target="_blank" class="btn-3d" style="text-decoration: none;">
                        <span class="btn-text">View on GitHub</span>
                    </a>
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" class="btn-3d" style="text-decoration: none;">
                            <span class="btn-text">Live Demo</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }

    closeModal() {
        this.elements.projectModal.classList.remove('active');
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
        
        this.applyCurrentFilter();
        this.sortRepos();
        this.renderProjects();
    }

    handleFilter(pill) {
        // Update active state
        this.elements.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        this.currentFilter = pill.dataset.filter;
        this.applyCurrentFilter();
        this.sortRepos();
        this.renderProjects();
    }

    applyCurrentFilter() {
        if (this.currentFilter === 'all') return;
        
        this.filteredRepos = this.filteredRepos.filter(repo => {
            const language = (repo.language || '').toLowerCase();
            return language === this.currentFilter.toLowerCase();
        });
    }

    changeView(mode) {
        // Update active state
        this.elements.viewModes.forEach(m => m.classList.remove('active'));
        mode.classList.add('active');
        
        this.currentView = mode.dataset.view;
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
    }

    updateStats() {
        const stats = {
            projects: this.repos.length,
            stars: this.repos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
            forks: this.repos.reduce((acc, repo) => acc + repo.forks_count, 0),
            contributors: Math.floor(this.repos.length * 2.5) // Estimate
        };
        
        // Animate counters
        const statElements = document.querySelectorAll('.stat-value[data-count]');
        statElements[0]?.setAttribute('data-count', stats.projects);
        statElements[1]?.setAttribute('data-count', stats.stars);
        statElements[2]?.setAttribute('data-count', stats.forks);
        statElements[3]?.setAttribute('data-count', stats.contributors);
        
        statElements.forEach(element => {
            this.animateCounter(element, parseInt(element.getAttribute('data-count')));
        });
    }

    animateCounter(element, target) {
        const duration = 2000;
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

    showAnalytics() {
        const section = this.elements.analyticsSection;
        if (!section) return;
        
        section.style.display = 'block';
        
        // Language distribution
        const languages = {};
        this.repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });
        
        // Top projects
        const topProjects = [...this.repos]
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 5);
        
        const topProjectsContainer = document.getElementById('topProjects');
        if (topProjectsContainer) {
            topProjectsContainer.innerHTML = topProjects.map((repo, index) => `
                <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--surface); border-radius: 12px; margin-bottom: 0.5rem;">
                    <div style="width: 30px; height: 30px; background: var(--gradient-${(index % 3) + 1}); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                        ${index + 1}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600;">${repo.name}</div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary);">
                            <i class="fas fa-star"></i> ${repo.stargazers_count}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        this.showNotification(`Switched to ${isLight ? 'light' : 'dark'} theme`, 'success');
    }

    toggleFAB() {
        this.elements.floatingMenu.classList.toggle('active');
        this.elements.fabToggle.classList.toggle('active');
    }

    handleFABAction(action) {
        switch(action) {
            case 'export':
                this.exportData();
                break;
            case 'share':
                this.sharePortfolio();
                break;
            case 'refresh':
                this.loadRepos();
                break;
            case 'top':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
        }
        
        this.toggleFAB();
    }

    exportData() {
        const data = this.repos.map(repo => ({
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
        a.download = `github-portfolio-${this.username || 'data'}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Portfolio data exported successfully', 'success');
    }

    sharePortfolio() {
        const url = window.location.href;
        const text = `Check out ${this.username}'s GitHub Portfolio!`;
        
        if (navigator.share) {
            navigator.share({ title: 'GitHub Portfolio', text, url })
                .then(() => this.showNotification('Shared successfully', 'success'))
                .catch(() => this.showNotification('Share cancelled', 'warning'));
        } else {
            navigator.clipboard.writeText(url)
                .then(() => this.showNotification('Link copied to clipboard', 'success'))
                .catch(() => this.showNotification('Failed to copy link', 'error'));
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <i class="fas ${icons[type]} notification-icon"></i>
            <div class="notification-content">
                <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        this.elements.notificationContainer.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slide-out 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    loadSampleUser() {
        this.elements.githubUsername.value = 'torvalds';
        this.loadRepos();
    }

    loadSampleData() {
        this.repos = [
            {
                name: 'linux',
                description: 'Linux kernel source tree',
                html_url: 'https://github.com/torvalds/linux',
                homepage: 'https://kernel.org',
                language: 'C',
                stargazers_count: 150000,
                forks_count: 45000,
                watchers_count: 150000,
                open_issues_count: 500,
                created_at: '2011-09-04',
                updated_at: '2024-01-15',
                imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800'
            },
            {
                name: 'react',
                description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces',
                html_url: 'https://github.com/facebook/react',
                homepage: 'https://reactjs.org',
                language: 'JavaScript',
                stargazers_count: 200000,
                forks_count: 42000,
                watchers_count: 200000,
                open_issues_count: 1200,
                created_at: '2013-05-24',
                updated_at: '2024-01-15',
                imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800'
            },
            {
                name: 'tensorflow',
                description: 'An Open Source Machine Learning Framework for Everyone',
                html_url: 'https://github.com/tensorflow/tensorflow',
                homepage: 'https://tensorflow.org',
                language: 'Python',
                stargazers_count: 175000,
                forks_count: 88000,
                watchers_count: 175000,
                open_issues_count: 2000,
                created_at: '2015-11-07',
                updated_at: '2024-01-15',
                imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800'
            }
        ];
        
        this.filteredRepos = [...this.repos];
        this.renderProjects();
        this.updateStats();
        this.showAnalytics();
    }
}

// DOM Elements (moved inside function for safety)
let appsContainer, searchInput, filterButtons, githubUsernameInput, fetchReposButton;

// Initialize the app
function initApp() {
    // Query DOM elements after DOMContentLoaded
    appsContainer = document.getElementById('appsContainer');
    searchInput = document.getElementById('searchInput');
    filterButtons = document.querySelectorAll('.filter-btn');
    githubUsernameInput = document.getElementById('githubUsername');
    fetchReposButton = document.getElementById('fetchRepos');

    // Only proceed if all required elements exist
    if (
        appsContainer &&
        searchInput &&
        filterButtons.length > 0 &&
        githubUsernameInput &&
        fetchReposButton
    ) {
        fetchGitHubRepos('MangalNathYadav');
        setupEventListeners();
    }
}

// Fetch GitHub repositories
async function fetchGitHubRepos(username) {
    if (!appsContainer) return;
    appsContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error('GitHub API request failed');
        const repos = await response.json();
        const filteredRepos = repos.filter(repo => !repo.fork && repo.description);
        if (filteredRepos.length === 0) throw new Error('No repositories found');
        renderApps(filteredRepos);
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        if (!appsContainer) return;
        appsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Unable to Load GitHub Projects</h2>
                <p>We encountered an issue loading projects from GitHub. Showing sample projects instead.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
        renderApps(fallbackData);
    }
}

// Render apps to the DOM with staggered animation
function renderApps(apps) {
    if (!appsContainer) return;
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
    apps.forEach((app, idx) => {
        const appCard = document.createElement('div');
        appCard.className = 'app-card';
        appCard.style.animationDelay = `${idx * 0.08}s`;
        // ...existing code...
        const imageUrl = app.image || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80`;
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
    appsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Filter apps based on search and category
function filterApps() {
    if (!searchInput || !appsContainer) return;
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
    const appCards = document.querySelectorAll('.app-card');
    appCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const language = card.querySelector('.app-badge')?.textContent.toLowerCase() || '';
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesCategory = activeFilter === 'all' || language.includes(activeFilter);
        card.style.display = (matchesSearch && matchesCategory) ? 'flex' : 'none';
    });
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
    if (!searchInput || !filterButtons || !githubUsernameInput || !fetchReposButton) return;
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
        if (username) fetchGitHubRepos(username);
    });
    // Allow pressing Enter in the username field
    githubUsernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const username = githubUsernameInput.value.trim();
            if (username) fetchGitHubRepos(username);
        }
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', initApp);

// Add smooth page visibility handling
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.querySelectorAll('.floating, .orb, .particle').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page is visible
        document.querySelectorAll('.floating, .orb, .particle').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});