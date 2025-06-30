// ===== DASHBOARD JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
    checkAuthentication();
});

// ===== DASHBOARD INITIALIZATION =====
function initDashboard() {
    initSidebar();
    initNavigation();
    initMobileMenu();
    initUserMenu();
    loadUserData();
}

// ===== AUTHENTICATION CHECK =====
function checkAuthentication() {
    const userSession = localStorage.getItem('userSession');
    
    if (!userSession) {
        showNotification('Please log in to access the dashboard', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    try {
        const userData = JSON.parse(userSession);
        updateUserInterface(userData);
    } catch (error) {
        console.error('Error parsing user session:', error);
        localStorage.removeItem('userSession');
        window.location.href = 'login.html';
    }
}

// ===== SIDEBAR FUNCTIONALITY =====
function initSidebar() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.dataset.section;
            if (sectionId) {
                showSection(sectionId);
                updateActiveNavLink(this);
                updatePageTitle(sectionId);
            }
        });
    });
}

function showSection(sectionId) {
    const contentSections = document.querySelectorAll('.content-section');
    const targetSection = document.getElementById(sectionId + '-section');
    
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update nav link
    const navLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (navLink) {
        updateActiveNavLink(navLink);
    }
    
    // Update page title
    updatePageTitle(sectionId);
    
    // Close mobile menu if open
    closeMobileMenu();
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    activeLink.classList.add('active');
}

function updatePageTitle(sectionId) {
    const pageTitle = document.querySelector('.page-title');
    const titles = {
        dashboard: 'Dashboard',
        internships: 'Browse Internships',
        applications: 'My Applications',
        reports: 'Progress Reports',
        profile: 'Profile Settings',
        notifications: 'Notifications'
    };
    
    if (pageTitle && titles[sectionId]) {
        pageTitle.textContent = titles[sectionId];
    }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 1024) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnMenuBtn && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.innerWidth <= 1024) {
        sidebar.classList.remove('active');
    }
}

// ===== USER MENU =====
function initUserMenu() {
    const userMenuBtn = document.querySelector('.user-menu-btn');
    
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function() {
            // Toggle user menu dropdown (to be implemented)
            showNotification('User menu functionality coming soon!', 'info');
        });
    }
}

// ===== USER DATA MANAGEMENT =====
function loadUserData() {
    const userSession = localStorage.getItem('userSession');
    
    if (userSession) {
        try {
            const userData = JSON.parse(userSession);
            updateUserInterface(userData);
            loadDashboardData(userData);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
}

function updateUserInterface(userData) {
    // Update user name in sidebar
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = userData.firstName ? 
            `${userData.firstName} ${userData.lastName}` : 
            userData.email.split('@')[0];
    });
    
    // Update user role
    const userRoleElements = document.querySelectorAll('.user-role');
    userRoleElements.forEach(element => {
        element.textContent = capitalizeFirst(userData.role);
    });
    
    // Update user avatar initials
    const userAvatars = document.querySelectorAll('.user-avatar i');
    if (userData.firstName && userData.lastName) {
        const initials = userData.firstName.charAt(0) + userData.lastName.charAt(0);
        userAvatars.forEach(avatar => {
            avatar.className = '';
            avatar.textContent = initials.toUpperCase();
        });
    }
}

function loadDashboardData(userData) {
    // Simulate loading dashboard data
    setTimeout(() => {
        updateStatistics();
        loadRecentActivity();
        loadRecommendedInternships();
    }, 1000);
}

// ===== DASHBOARD DATA =====
function updateStatistics() {
    // Mock statistics data
    const stats = {
        availableInternships: Math.floor(Math.random() * 20) + 10,
        applicationsSent: Math.floor(Math.random() * 5) + 1,
        pendingReviews: Math.floor(Math.random() * 3) + 1,
        approved: Math.floor(Math.random() * 2) + 1
    };
    
    // Update stat numbers with animation
    animateStatNumbers(stats);
}

function animateStatNumbers(stats) {
    const statCards = document.querySelectorAll('.stat-card');
    const statValues = Object.values(stats);
    
    statCards.forEach((card, index) => {
        const numberElement = card.querySelector('.stat-number');
        if (numberElement && statValues[index] !== undefined) {
            animateNumber(numberElement, 0, statValues[index], 1000);
        }
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function loadRecentActivity() {
    // Mock recent activity data
    const activities = [
        {
            type: 'success',
            icon: 'fas fa-check',
            title: 'Application Approved',
            description: 'Your application to TechCorp has been approved',
            time: '2 hours ago'
        },
        {
            type: 'info',
            icon: 'fas fa-paper-plane',
            title: 'Application Submitted',
            description: 'Applied for Software Developer Intern at StartupXYZ',
            time: '1 day ago'
        },
        {
            type: 'warning',
            icon: 'fas fa-exclamation',
            title: 'Document Required',
            description: 'Please upload your CV for the DataCorp application',
            time: '2 days ago'
        }
    ];
    
    // Update activity list (activities are already in HTML for demo)
    console.log('Recent activities loaded:', activities);
}

function loadRecommendedInternships() {
    // Mock recommended internships data
    const internships = [
        {
            title: 'Software Developer Intern',
            company: 'TechCorp Solutions',
            location: 'Addis Ababa',
            duration: '3 months',
            startDate: 'Jan 2024',
            logo: 'fas fa-building'
        },
        {
            title: 'Data Analyst Intern',
            company: 'DataCorp Analytics',
            location: 'Addis Ababa',
            duration: '4 months',
            startDate: 'Feb 2024',
            logo: 'fas fa-chart-line'
        }
    ];
    
    // Update internship cards (internships are already in HTML for demo)
    console.log('Recommended internships loaded:', internships);
}

// ===== NAVIGATION FUNCTIONS =====
function initNavigation() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.section) {
            showSection(event.state.section);
        }
    });
    
    // Set initial state
    const currentSection = 'dashboard';
    history.replaceState({ section: currentSection }, '', `#${currentSection}`);
}

// ===== LOGOUT FUNCTIONALITY =====
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear user session
        localStorage.removeItem('userSession');
        
        // Show logout message
        showNotification('Logged out successfully', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const query = e.target.value.trim();
            if (query.length > 2) {
                performSearch(query);
            }
        }, 300));
    }
}

function performSearch(query) {
    // Mock search functionality
    console.log('Searching for:', query);
    showNotification(`Searching for "${query}"...`, 'info');
}

// ===== UTILITY FUNCTIONS =====
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

// ===== RESPONSIVE HANDLING =====
function handleResize() {
    const sidebar = document.getElementById('sidebar');
    
    if (window.innerWidth > 1024) {
        sidebar.classList.remove('active');
    }
}

window.addEventListener('resize', debounce(handleResize, 250));

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.showSection = showSection;
window.logout = logout;
