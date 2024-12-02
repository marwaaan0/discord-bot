// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true
});

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        // Even smoother follower movement
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

        requestAnimationFrame(updateCursor);
    }

    updateCursor();

    // Hover effect for links and buttons
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.5)';
        });
        
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
}

// Particle background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('.particles').appendChild(renderer.domElement);

// Create particles
const particles = new THREE.Group();
scene.add(particles);

const geometry = new THREE.SphereGeometry(0.1, 8, 8);
const material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.3
});

for (let i = 0; i < 100; i++) {
    const particle = new THREE.Mesh(geometry, material);
    particle.position.x = (Math.random() - 0.5) * 10;
    particle.position.y = (Math.random() - 0.5) * 10;
    particle.position.z = (Math.random() - 0.5) * 10;
    particle.scale.setScalar(Math.random() * 0.5 + 0.5);
    particles.add(particle);
}

camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.001;
    
    particles.children.forEach(particle => {
        particle.rotation.x += 0.005;
        particle.rotation.y += 0.005;
    });
    
    renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mobile menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 70
                },
                ease: 'power2.inOut'
            });
        }
    });
});

// Parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(el => {
        const speed = el.dataset.speed || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Stats counter animation
const stats = document.querySelectorAll('.stat-number');
const animateStats = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                current = target;
            }
            stat.textContent = Math.round(current).toLocaleString() + '+';
        }, 20);
    });
};

// Trigger stats animation when in view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Feature cards hover effect
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -10,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Premium plans hover effect
const planCards = document.querySelectorAll('.plan-card');
planCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('featured')) {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    });
    
    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('featured')) {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    });
});

// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
        });
    });

    // Server selection functionality
    const serverSelector = document.querySelector('.server-selector');
    const serverDropdown = document.querySelector('.server-dropdown');
    const searchInput = document.querySelector('.search-server input');
    let servers = [];

    // Fetch servers from API
    async function fetchServers() {
        try {
            const response = await fetch('/api/servers');
            if (!response.ok) throw new Error('Failed to fetch servers');
            servers = await response.json();
            populateServers();
            
            // Select first server if available
            if (servers.length > 0) {
                selectServer(servers[0]);
            }
        } catch (error) {
            console.error('Error fetching servers:', error);
            const managedServers = document.querySelector('.server-category:first-child .server-items');
            managedServers.innerHTML = '<div class="error-message">Failed to load servers. Please try again later.</div>';
        }
    }

    // Populate server lists
    function populateServers(searchTerm = '') {
        const managedServers = document.querySelector('.server-category:first-child .server-items');
        const availableServers = document.querySelector('.server-category:last-child .server-items');
        
        managedServers.innerHTML = '';
        availableServers.innerHTML = '';

        const filteredServers = servers.filter(server => 
            server.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredServers.length === 0) {
            managedServers.innerHTML = '<div class="no-results">No servers found</div>';
            return;
        }

        filteredServers.forEach(server => {
            const serverElement = createServerElement(server);
            if (server.managed) {
                managedServers.appendChild(serverElement);
            } else {
                availableServers.appendChild(serverElement);
            }
        });
    }

    function createServerElement(server) {
        const div = document.createElement('div');
        div.className = 'server-item';
        div.dataset.serverId = server.id;
        div.innerHTML = `
            <img src="${server.icon}" alt="${server.name}" onerror="this.src='/assets/images/default-server.png'">
            <div class="server-details">
                <span class="server-name">${server.name}</span>
                <span class="member-count">${server.memberCount} members</span>
            </div>
        `;
        div.addEventListener('click', () => {
            selectServer(server);
        });
        return div;
    }

    function selectServer(server) {
        const serverInfo = document.querySelector('.server-info');
        const serverIcon = serverInfo.querySelector('img');
        const serverName = serverInfo.querySelector('span');
        
        serverIcon.src = server.icon;
        serverIcon.onerror = () => serverIcon.src = '/assets/images/default-server.png';
        serverName.textContent = server.name;
        serverInfo.dataset.serverId = server.id;
        
        serverDropdown.style.display = 'none';
        
        // Dispatch custom event for server selection
        const event = new CustomEvent('serverSelected', { detail: server });
        document.dispatchEvent(event);
    }

    // Toggle server dropdown
    serverSelector.addEventListener('click', (e) => {
        if (!serverDropdown.contains(e.target)) {
            const isVisible = serverDropdown.style.display === 'block';
            serverDropdown.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                searchInput.value = '';
                searchInput.focus();
                populateServers();
            }
        }
    });

    // Search functionality with debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            populateServers(e.target.value);
        }, 300);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!serverSelector.contains(e.target)) {
            serverDropdown.style.display = 'none';
        }
    });

    // Initial server fetch
    fetchServers();

    // User menu functionality
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.querySelector('.user-dropdown');

    userMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target)) {
            userDropdown.style.display = 'none';
        }
    });

    // More tabs dropdown
    const moreTabsBtn = document.querySelector('.more-btn');
    const tabsDropdown = document.querySelector('.tabs-dropdown');

    moreTabsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        tabsDropdown.style.display = tabsDropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (!moreTabsBtn.contains(e.target)) {
            tabsDropdown.style.display = 'none';
        }
    });
});

// User authentication state management
function updateUserInterface(userData) {
    const loginButton = document.querySelector('.login-button');
    const userMenu = document.querySelector('.user-menu');
    const userAvatar = document.querySelector('.user-avatar');
    const dropdownAvatar = document.querySelector('.dropdown-avatar');
    const userName = document.querySelector('.user-name');
    const userId = document.querySelector('.user-id');

    if (userData && userData.authenticated && userData.user) {
        // User is logged in
        if (loginButton) loginButton.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        
        // Update user info
        if (userName) userName.textContent = userData.user.username;
        if (userId) userId.textContent = `#${userData.user.discriminator || '0000'}`;
        
        // Update both avatar images
        const avatarUrl = userData.user.avatar 
            ? `https://cdn.discordapp.com/avatars/${userData.user.id}/${userData.user.avatar}.png`
            : '/assets/images/default-avatar.png';
            
        if (userAvatar) userAvatar.src = avatarUrl;
        if (dropdownAvatar) dropdownAvatar.src = avatarUrl;
    } else {
        // User is logged out
        if (loginButton) loginButton.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Check auth status periodically
async function checkAuthStatus() {
    try {
        const response = await fetch('http://localhost:5000/auth/status', {
            credentials: 'include' // Important: include credentials for cookies
        });
        const data = await response.json();
        console.log('Auth check response:', data); // Debug log
        updateUserInterface(data);
    } catch (error) {
        console.error('Auth check failed:', error);
        updateUserInterface(null);
    }
}

// Check auth status when page loads and every 5 seconds
document.addEventListener('DOMContentLoaded', () => {
    console.log('Checking initial auth status...'); // Debug log
    checkAuthStatus();
    setInterval(checkAuthStatus, 5000);
});

// Bot API Integration
const API_URL = window.location.origin;

async function getBotStats() {
    try {
        const response = await fetch(`${API_URL}/api/stats`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch bot stats:', error);
        return null;
    }
}

async function getInviteLink() {
    try {
        const response = await fetch(`${API_URL}/api/invite`, {
            method: 'POST'
        });
        const data = await response.json();
        return data.invite;
    } catch (error) {
        console.error('Failed to generate invite link:', error);
        return null;
    }
}

// Bot statistics update
async function updateBotStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        // Update DOM elements with null checks
        const serverCount = document.getElementById('server-count');
        const userCount = document.getElementById('user-count');
        const commandCount = document.getElementById('command-count');
        
        if (serverCount) serverCount.textContent = stats.servers || 0;
        if (userCount) userCount.textContent = stats.users || 0;
        if (commandCount) commandCount.textContent = stats.commands || 0;
        
        console.log('Updated stats:', stats); // Debug log
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Update stats immediately and every 30 seconds
updateBotStats();
const statsInterval = setInterval(updateBotStats, 30000);

// Add invite button functionality
const inviteButton = document.getElementById('invite-button');
if (inviteButton) {
    inviteButton.addEventListener('click', async () => {
        const inviteLink = await getInviteLink();
        if (inviteLink) {
            window.open(inviteLink, '_blank');
        }
    });
}
