// Add smooth scrolling and navigation effects
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.info-card, .character-card, .location-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add animation to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroSection.style.transition = 'opacity 1s ease, transform 1s ease';
            heroSection.style.opacity = '1';
            heroSection.style.transform = 'translateY(0)';
        }, 100);
    }

    // Add staggered animation to info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });

    // Character card click to expand (optional feature)
    const characterCards = document.querySelectorAll('.character-card');
    characterCards.forEach(card => {
        card.addEventListener('click', function() {
            const description = this.querySelector('.character-description');
            if (description) {
                description.classList.toggle('expanded');
            }
        });
    });

    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Easter egg: Konami code for special effect
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateEasterEgg();
        }
    });
});

function activateEasterEgg() {
    // Create celestial particles effect
    const colors = ['#d4af37', '#4a90e2', '#8b5cf6'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createParticle(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 50);
    }
    
    // Show message
    const message = document.createElement('div');
    message.textContent = 'May Celestria bless your journey, Fallen Sentinel';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(139, 92, 246, 0.9);
        color: white;
        padding: 30px 50px;
        border-radius: 8px;
        font-family: 'Cinzel', serif;
        font-size: 1.2rem;
        z-index: 10000;
        text-align: center;
        box-shadow: 0 0 40px rgba(139, 92, 246, 0.8);
        animation: fadeInOut 3s ease;
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

function createParticle(color) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 10px ${color};
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        opacity: 1;
        animation: particleFade 2s ease-out forwards;
    `;
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        10%, 90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes particleFade {
        0% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-100px) scale(0); }
    }
    
    .character-description.expanded {
        max-height: none !important;
    }
`;
document.head.appendChild(style);

// Add loading screen fade out
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Meteor Shower Page Transitions
function initializeMeteorTransitions() {
    document.querySelectorAll('a[href]').forEach(link => {
        if (link.href.startsWith(window.location.origin) && !link.href.includes('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetUrl = this.href;
                triggerMeteorShower(() => {
                    window.location.href = targetUrl;
                });
            });
        }
    });
}

function triggerMeteorShower(callback) {
    const transition = document.getElementById('pageTransition');
    if (!transition) return callback(); // Fallback if div missing
    
    transition.classList.add('active');
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createMeteor();
        }, i * 50);
    }
    
    setTimeout(() => {
        if (callback) callback();
    }, 1500);
}

function createMeteor() {
    const transition = document.getElementById('pageTransition');
    if (!transition) return;
    
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    
    meteor.style.top = `${Math.random() * 50}%`;
    meteor.style.left = `${Math.random() * 100}%`;
    
    transition.appendChild(meteor);
    
    setTimeout(() => {
        meteor.remove();
    }, 1500);
}

// Initialize meteor transitions
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMeteorTransitions);
} else {
    initializeMeteorTransitions();
}

// Celestial Star Chart Page Transition
function triggerMeteorShower(callback) {
    const transition = document.getElementById('pageTransition');
    if (!transition) return callback();
    
    transition.classList.add('active');
    createCelestialConstellation();
    
    setTimeout(() => {
        if (callback) callback();
    }, 1500);
}

function createCelestialConstellation() {
    const transition = document.getElementById('pageTransition');
    if (!transition) return;
    
    const stars = [
        { x: 20, y: 20 }, { x: 35, y: 15 }, { x: 50, y: 25 },
        { x: 65, y: 20 }, { x: 80, y: 30 }, { x: 30, y: 50 },
        { x: 45, y: 55 }, { x: 60, y: 48 }, { x: 75, y: 60 }
    ];
    
    stars.forEach((pos, index) => {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'celestial-star';
            star.style.left = `${pos.x}%`;
            star.style.top = `${pos.y}%`;
            transition.appendChild(star);
            setTimeout(() => star.remove(), 1500);
        }, index * 80);
    });
    
    setTimeout(() => {
        for (let i = 0; i < stars.length - 1; i++) {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = 'constellation-line';
                
                const x1 = stars[i].x;
                const y1 = stars[i].y;
                const x2 = stars[i + 1].x;
                const y2 = stars[i + 1].y;
                
                const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                
                line.style.left = `${x1}%`;
                line.style.top = `${y1}%`;
                line.style.width = `${length}%`;
                line.style.transform = `rotate(${angle}deg)`;
                
                transition.appendChild(line);
                setTimeout(() => line.remove(), 1200);
            }, i * 100);
        }
    }, 400);
}
