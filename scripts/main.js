// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// Smooth Scroll Navigation
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 20;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });
});

// Active Navigation Highlighting
const sections = document.querySelectorAll('.section');

function updateActiveNav() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// Color Copy Functionality
const copyButtons = document.querySelectorAll('.copy-btn');

copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const colorValue = button.getAttribute('data-copy');
        
        if (colorValue) {
            try {
                await navigator.clipboard.writeText(colorValue);
                
                // Visual feedback
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = colorValue;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }
        }
    });
});

// Color Swatch Click to Copy
const colorSwatches = document.querySelectorAll('.color-swatch');

colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', async () => {
        const colorValue = swatch.getAttribute('data-color');
        
        if (colorValue) {
            try {
                await navigator.clipboard.writeText(colorValue);
                
                // Show temporary notification
                showNotification(`Color ${colorValue} copied to clipboard!`);
            } catch (err) {
                // Fallback
                const textArea = document.createElement('textarea');
                textArea.value = colorValue;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                showNotification(`Color ${colorValue} copied to clipboard!`);
            }
        }
    });
});

// Notification Function
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00C8FF 0%, #FF6633 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Copy CSS Variables Function
function copyCSSVariables() {
    const cssVariables = `:root {
  --cyan: #00C8FF;
  --coral: #FF6633;
  --navy-blue: #275F98;
  --dark-navy: #020817;
  --slate: #64748B;
  --light-gray: #F1F5F9;
  --white: #FFFFFF;
  --brand-gradient: linear-gradient(135deg, #00C8FF 0%, #FF6633 100%);
}`;
    
    navigator.clipboard.writeText(cssVariables).then(() => {
        showNotification('CSS variables copied to clipboard!');
    }).catch(() => {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = cssVariables;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('CSS variables copied to clipboard!');
    });
}

// Make copyCSSVariables available globally
window.copyCSSVariables = copyCSSVariables;

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') && 
        !sidebar.contains(e.target) && 
        !mobileMenuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// Close mobile menu on window resize (if resizing to desktop)
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});

// Lazy load images for better performance
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15/dist/smooth-scroll.polyfills.min.js';
    document.head.appendChild(script);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav item
    updateActiveNav();
    
    // Add fade-in animation to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
});

