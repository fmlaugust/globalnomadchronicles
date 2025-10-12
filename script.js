// ===========================================
// GLOBAL NOMAD CHRONICLES - FRONTEND JAVASCRIPT
// ===========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Global Nomad Chronicles - Frontend Loaded');
    
    // Initialize all functionality
    initNavigation();
    initNewsletterForm();
    initContactForm();
    initImageGallery();
    initSmoothScrolling();
    initMobileMenu();
    initSearchFunctionality();
    initAnimations();
    initFormValidation();
    initTooltips();
    initBackToTop();
});

// ===========================================
// NAVIGATION FUNCTIONALITY
// ===========================================
function initNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const currentPath = window.location.pathname;
    
    // Highlight current page in navigation
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop() || 
            (currentPath.includes('index') && link.getAttribute('href') === 'index.html')) {
            link.setAttribute('aria-current', 'page');
            link.classList.add('current-page');
        }
    });
    
    // Add hover effects and analytics
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        link.addEventListener('click', function(e) {
            // Analytics tracking (when backend is ready)
            trackNavigation(this.textContent, this.href);
        });
    });
}

// ===========================================
// NEWSLETTER FORM FUNCTIONALITY
// ===========================================
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const emailInput = document.querySelector('#newsletter-email');
    const submitBtn = document.querySelector('.newsletter-btn');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        // Simulate API call (replace with actual backend call)
        setTimeout(() => {
            // For now, just show success message
            showNotification('Thank you for subscribing! Welcome to the journey.', 'success');
            emailInput.value = '';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Track subscription (analytics)
            trackEvent('newsletter_signup', { email: email });
        }, 1500);
    });
    
    // Real-time email validation
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            this.style.borderColor = '#e74c3c';
            this.setAttribute('aria-invalid', 'true');
        } else {
            this.style.borderColor = '';
            this.setAttribute('aria-invalid', 'false');
        }
    });
}

// ===========================================
// CONTACT FORM FUNCTIONALITY
// ===========================================
function initContactForm() {
    const contactForms = document.querySelectorAll('form[action="#"]');
    
    contactForms.forEach(form => {
        if (form.classList.contains('newsletter-form')) return; // Skip newsletter form
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form data
            if (!validateContactForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call (replace with actual backend call)
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Track form submission
                trackEvent('contact_form_submit', data);
            }, 2000);
        });
    });
}

// ===========================================
// IMAGE GALLERY FUNCTIONALITY
// ===========================================
function initImageGallery() {
    // Gallery filter functionality
    const filterBtns = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Track filter usage
            trackEvent('gallery_filter', { filter: filter });
        });
    });
    
    // Lightbox functionality for images
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
    });
    
    // Initialize masonry-style layout if needed
    initMasonryLayout();
}

// ===========================================
// LIGHTBOX FUNCTIONALITY
// ===========================================
function openLightbox(src, alt) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
            <img src="${src}" alt="${alt}" class="lightbox-image">
            <div class="lightbox-caption">${alt}</div>
        </div>
    `;
    
    // Add styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(lightbox);
    
    // Trigger fade in
    setTimeout(() => lightbox.style.opacity = '1', 10);
    
    // Close functionality
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const closeLightbox = () => {
        lightbox.style.opacity = '0';
        setTimeout(() => document.body.removeChild(lightbox), 300);
        document.body.style.overflow = '';
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// ===========================================
// SMOOTH SCROLLING
// ===========================================
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// ===========================================
// MOBILE MENU FUNCTIONALITY
// ===========================================
function initMobileMenu() {
    // Create mobile menu toggle if navigation exists
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = '☰';
    mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
    mobileToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        position: absolute;
        top: 1rem;
        right: 1rem;
    `;
    
    // Insert toggle button
    nav.parentNode.insertBefore(mobileToggle, nav);
    
    // Mobile menu functionality
    mobileToggle.addEventListener('click', function() {
        const navUl = nav.querySelector('ul');
        navUl.classList.toggle('mobile-menu-open');
        
        // Update aria attributes
        const isOpen = navUl.classList.contains('mobile-menu-open');
        this.setAttribute('aria-expanded', isOpen);
        this.innerHTML = isOpen ? '✕' : '☰';
    });
    
    // Show/hide mobile toggle based on screen size
    function checkMobileMenu() {
        if (window.innerWidth <= 768) {
            mobileToggle.style.display = 'block';
        } else {
            mobileToggle.style.display = 'none';
            nav.querySelector('ul').classList.remove('mobile-menu-open');
        }
    }
    
    window.addEventListener('resize', checkMobileMenu);
    checkMobileMenu();
}

// ===========================================
// SEARCH FUNCTIONALITY
// ===========================================
function initSearchFunctionality() {
    // Create search interface if needed
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return;
    
    const searchInput = searchContainer.querySelector('input[type="search"]');
    const searchResults = searchContainer.querySelector('.search-results');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        
        // Debounce search
        searchTimeout = setTimeout(() => {
            performSearch(query, searchResults);
        }, 300);
    });
}

function performSearch(query, resultsContainer) {
    // This is a simple client-side search
    // In production, this would make API calls to your backend
    
    const searchableContent = document.querySelectorAll('[data-searchable]');
    const results = [];
    
    searchableContent.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            results.push({
                title: element.querySelector('h2, h3')?.textContent || 'Untitled',
                snippet: text.substring(0, 150) + '...',
                url: element.closest('a')?.href || '#'
            });
        }
    });
    
    displaySearchResults(results, resultsContainer);
}

function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<p>No results found.</p>';
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-result">
            <h4><a href="${result.url}">${result.title}</a></h4>
            <p>${result.snippet}</p>
        </div>
    `).join('');
    
    container.innerHTML = resultsHTML;
}

// ===========================================
// ANIMATIONS AND SCROLL EFFECTS
// ===========================================
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('section, .destination-card, .gallery-item').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('#hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }
}

// ===========================================
// FORM VALIDATION
// ===========================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Clear error state on input
                this.classList.remove('error');
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    
    // Show/hide error
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    } else {
        field.classList.remove('error');
        hideFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    hideFieldError(field); // Remove existing error
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function hideFieldError(field) {
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
}

// ===========================================
// TOOLTIPS
// ===========================================
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            showTooltip(this, tooltipText);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) tooltip.remove();
}

// ===========================================
// BACK TO TOP BUTTON
// ===========================================
function initBackToTop() {
    // Create back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 100;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateContactForm(data) {
    let isValid = true;
    
    // Check required fields
    if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields', 'error');
        isValid = false;
    }
    
    // Validate email
    if (data.email && !isValidEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        isValid = false;
    }
    
    return isValid;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function trackEvent(eventName, data = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, data);
    
    // When you implement analytics (Google Analytics, etc.), add the code here
    // gtag('event', eventName, data);
}

function trackNavigation(linkText, url) {
    trackEvent('navigation_click', {
        link_text: linkText,
        destination_url: url
    });
}

function initMasonryLayout() {
    // Simple masonry-style layout for gallery
    const galleries = document.querySelectorAll('.gallery-grid');
    
    galleries.forEach(gallery => {
        const items = gallery.querySelectorAll('.gallery-item');
        
        function arrangeItems() {
            // This is a simplified masonry layout
            // For production, consider using a library like Masonry.js
            let columns = Math.floor(gallery.offsetWidth / 320);
            columns = Math.max(1, columns);
            
            const columnHeights = new Array(columns).fill(0);
            
            items.forEach(item => {
                const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
                item.style.position = 'absolute';
                item.style.left = `${(shortestColumn * 320)}px`;
                item.style.top = `${columnHeights[shortestColumn]}px`;
                columnHeights[shortestColumn] += item.offsetHeight + 20;
            });
            
            gallery.style.height = `${Math.max(...columnHeights)}px`;
        }
        
        // Arrange items after images load
        const images = gallery.querySelectorAll('img');
        let loadedImages = 0;
        
        if (images.length === 0) {
            arrangeItems();
        } else {
            images.forEach(img => {
                if (img.complete) {
                    loadedImages++;
                } else {
                    img.addEventListener('load', () => {
                        loadedImages++;
                        if (loadedImages === images.length) {
                            arrangeItems();
                        }
                    });
                }
            });
            
            if (loadedImages === images.length) {
                arrangeItems();
            }
        }
        
        // Rearrange on window resize
        window.addEventListener('resize', debounce(arrangeItems, 250));
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===========================================
// PERFORMANCE MONITORING
// ===========================================
function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            trackEvent('page_performance', {
                load_time: loadTime,
                dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart
            });
        }, 0);
    });
}

// Initialize performance monitoring
initPerformanceMonitoring();

// ===========================================
// EXPORT FOR MODULE USAGE (if needed)
// ===========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initNewsletterForm,
        initContactForm,
        initImageGallery,
        showNotification,
        trackEvent
    };
}