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
let isProgrammaticScroll = false;

// Function to calculate proper scroll offset
function getScrollOffset() {
    const isMobile = window.innerWidth <= 1024;
    // Account for mobile menu toggle button (approximately 60px from top + padding)
    if (isMobile) {
        return 80; // Larger offset for mobile to account for menu toggle
    }
    return 20; // Smaller offset for desktop
}

// Function to scroll to section with proper handling
function scrollToSection(targetSection) {
    if (!targetSection) return;
    
    isProgrammaticScroll = true;
    
    // Make section visible immediately (skip fade-in animation)
    targetSection.style.opacity = '1';
    targetSection.style.transform = 'translateY(0)';
    
    // Calculate proper offset
    const offset = getScrollOffset();
    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
    
    // Scroll to section
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Wait for scroll to complete, then reset flag
    // Use a combination of scroll event and timeout to ensure completion
    let scrollTimeout;
    const checkScrollComplete = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isProgrammaticScroll = false;
            // Update active nav after scroll completes
            updateActiveNav();
        }, 100);
    };
    
    // Check scroll completion
    window.addEventListener('scroll', checkScrollComplete, { once: true });
    setTimeout(() => {
        isProgrammaticScroll = false;
        updateActiveNav();
    }, 1000); // Fallback timeout
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Close mobile menu if open
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
            
            // Small delay to ensure menu closes before scrolling
            setTimeout(() => {
                scrollToSection(targetSection);
            }, 100);
        }
    });
});

// Active Navigation Highlighting
const sections = document.querySelectorAll('.section');

function updateActiveNav() {
    const offset = getScrollOffset();
    const scrollPosition = window.scrollY + offset + 50; // Add buffer for better detection
    
    let currentSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (currentSection && link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Throttle scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        updateActiveNav();
    }, 10);
});

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
    
    // Add fade-in animation to sections (only for natural scrolling, not programmatic)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Skip animation if this is a programmatic scroll
            if (isProgrammaticScroll) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                return;
            }
            
            // Only animate if naturally scrolling
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        // Only set initial opacity if not already visible (for programmatic scrolls)
        if (!section.hasAttribute('data-scrolled-to')) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        sectionObserver.observe(section);
    });
    
    // Handle hash navigation on page load
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            // Mark as scrolled to and make visible immediately
            targetSection.setAttribute('data-scrolled-to', 'true');
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
            
            // Scroll to section after a brief delay to ensure content is loaded
            setTimeout(() => {
                scrollToSection(targetSection);
            }, 100);
        }
    }
});

