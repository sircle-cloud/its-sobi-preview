// ============================================
// ITS SOBI v3.0 - Awwwards Level Animations
// GSAP + Lenis + Premium Interactions
// ============================================

gsap.registerPlugin(ScrollTrigger, Flip);

// ============================================
// Device Detection
// ============================================
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isMobile = isTouchDevice && window.innerWidth <= 1024;

// ============================================
// Lenis Smooth Scroll (desktop only)
// ============================================
if (!isTouchDevice) {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
}

// ============================================
// Custom Cursor
// ============================================
function initCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor || window.matchMedia('(hover: none)').matches) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        const ease = 0.15;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        gsap.set(cursor, { x: cursorX, y: cursorY });
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover states
    const hoverElements = document.querySelectorAll('a, button, [data-magnetic]');
    const viewElements = document.querySelectorAll('[data-work-item], .bento-item, .service-item');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    
    viewElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-view');
            document.body.classList.remove('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-view');
        });
    });
}

// ============================================
// Magnetic Elements
// ============================================
function initMagnetic() {
    const elements = document.querySelectorAll('[data-magnetic]');
    
    elements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// ============================================
// Page Transitions
// ============================================
function initPageTransitions() {
    const transitionLinks = document.querySelectorAll('a[data-transition]');
    const panel = document.querySelector('.page-transition-panel');
    const logo = document.querySelector('.page-transition-logo');
    
    if (!panel) return;
    
    transitionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
            
            e.preventDefault();
            
            const tl = gsap.timeline();
            
            tl.to(panel, {
                scaleY: 1,
                duration: 0.6,
                ease: 'power3.inOut',
                transformOrigin: 'bottom'
            })
            .to(logo, {
                opacity: 1,
                duration: 0.3
            }, '-=0.2')
            .add(() => {
                window.location.href = href;
            }, '+=0.1');
        });
    });
    
    // Animate in on load
    window.addEventListener('load', () => {
        const tl = gsap.timeline();
        
        tl.set(panel, { scaleY: 1 })
        .to(logo, { opacity: 0, duration: 0.2 })
        .to(panel, {
            scaleY: 0,
            duration: 0.8,
            ease: 'power3.inOut',
            transformOrigin: 'top'
        });
    });
}

// ============================================
// Hero Animations
// ============================================
function initHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const heroImage = hero.querySelector('.hero-image-wrapper img');
    const heroTitle = hero.querySelector('.hero-title');
    const heroSubtitle = hero.querySelector('.hero-subtitle');
    
    // Initial hero image animation
    gsap.fromTo(heroImage,
        { scale: 1.3 },
        { scale: 1, duration: 2, ease: 'power2.out', delay: 0.5 }
    );
    
    // Title animation
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        
        const lines = text.split('<br>');
        lines.forEach((line, i) => {
            const lineWrapper = document.createElement('div');
            lineWrapper.className = 'line';
            
            const lineInner = document.createElement('span');
            lineInner.className = 'line-inner';
            lineInner.innerHTML = line;
            
            lineWrapper.appendChild(lineInner);
            heroTitle.appendChild(lineWrapper);
            
            if (i < lines.length - 1) {
                heroTitle.appendChild(document.createElement('br'));
            }
        });
        
        gsap.to(heroTitle.querySelectorAll('.line-inner'), {
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.8
        });
    }
    
    // Subtitle
    gsap.fromTo(heroSubtitle,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 1.4, ease: 'power3.out' }
    );
    
    // Parallax on scroll (desktop only)
    if (!isMobile) {
        gsap.to(heroImage, {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
    
    // Fade elements
    hero.querySelectorAll('[data-fade-up]').forEach(el => {
        const delay = parseFloat(el.dataset.delay) || 0;
        gsap.fromTo(el,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, delay: 0.8 + delay, ease: 'power3.out' }
        );
    });
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    // Fade up elements
    gsap.utils.toArray('[data-fade-up]').forEach(el => {
        if (el.closest('.hero')) return; // Skip hero elements
        
        const delay = parseFloat(el.dataset.delay) || 0;
        
        gsap.fromTo(el,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true
                }
            }
        );
    });
    
    // Split text lines
    gsap.utils.toArray('[data-split-lines]').forEach(el => {
        if (el.closest('.hero')) return;
        
        const text = el.innerHTML;
        el.innerHTML = '';
        
        // Simple line split by <br> or wrap in single line
        const lines = text.includes('<br>') ? text.split('<br>') : [text];
        
        lines.forEach((line, i) => {
            const lineWrapper = document.createElement('div');
            lineWrapper.className = 'line';
            lineWrapper.style.overflow = 'hidden';
            
            const lineInner = document.createElement('span');
            lineInner.className = 'line-inner';
            lineInner.style.display = 'block';
            lineInner.innerHTML = line;
            
            lineWrapper.appendChild(lineInner);
            el.appendChild(lineWrapper);
        });
        
        gsap.set(el.querySelectorAll('.line-inner'), { y: '100%' });
        
        ScrollTrigger.create({
            trigger: el,
            start: "top 95%",
            once: true,
            onEnter: () => {
                gsap.to(el.querySelectorAll('.line-inner'), {
                    y: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: 'power3.out'
                });
            }
        });
    });
}

// ============================================
// Bento Grid Animations
// ============================================
function initBentoGrid() {
    const items = document.querySelectorAll('.bento-item');
    
    items.forEach((item, index) => {
        // Initial state
        gsap.set(item, { opacity: 1 });
        
        // Animate on scroll into view
        ScrollTrigger.create({
            trigger: item,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                gsap.fromTo(item,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: 'power3.out'
                    }
                );
            }
        });
        
        // Image parallax on scroll (desktop only)
        if (!isMobile) {
            const img = item.querySelector('.bento-image img');
            if (img) {
                gsap.to(img, {
                    yPercent: -10,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            }
        }
    });
}

// ============================================
// Services Hover
// ============================================
function initServices() {
    const items = document.querySelectorAll('.service-item');
    
    items.forEach(item => {
        const image = item.querySelector('.service-image');
        
        if (image && window.innerWidth > 1024) {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                gsap.to(image, {
                    x: x - rect.width + 100,
                    y: y - 75,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
        }
    });
}

// ============================================
// Marquee
// ============================================
function initMarquee() {
    const marquees = document.querySelectorAll('[data-marquee]');
    
    marquees.forEach(marquee => {
        const content = marquee.querySelector('.marquee-content');
        if (!content) return;
        
        // Clone content for seamless loop
        const clone = content.cloneNode(true);
        marquee.appendChild(clone);
        
        // Speed from data attribute
        const speed = parseFloat(marquee.dataset.speed) || 1;
        const duration = 30 / speed;
        
        gsap.to([content, clone], {
            xPercent: -100,
            repeat: -1,
            duration,
            ease: 'none'
        });
    });
}

// ============================================
// Parallax Images (desktop only)
// ============================================
function initParallax() {
    if (isMobile) return;
    
    gsap.utils.toArray('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        
        gsap.to(el, {
            yPercent: speed * 100,
            ease: 'none',
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
}

// ============================================
// Horizontal Scroll Categories
// ============================================
function initHorizontalScroll() {
    if (isMobile) return;
    
    const wrap = document.querySelector('[data-horizontal-scroll-wrap]');
    if (!wrap) return;
    
    const panels = wrap.querySelectorAll('[data-horizontal-scroll-panel]');
    if (panels.length < 2) return;
    
    const panelsContainer = wrap.querySelector('.horizontal-scroll-panels');
    
    // Calculate total scroll width
    let totalWidth = 0;
    panels.forEach(panel => {
        totalWidth += panel.offsetWidth;
    });
    
    // Create horizontal scroll animation
    gsap.to(panelsContainer, {
        x: () => -(totalWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: () => '+=' + (totalWidth - window.innerWidth),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1
        }
    });
    
    // Content is always visible - no animation needed
}

// ============================================
// About Section
// ============================================
function initAbout() {
    const about = document.querySelector('.about');
    if (!about) return;
    
    const stats = about.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const endValue = parseInt(stat.textContent);
        stat.textContent = '0';
        
        ScrollTrigger.create({
            trigger: stat,
            start: "top 95%",
            once: true,
            onEnter: () => {
                gsap.to(stat, {
                    textContent: endValue,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    onUpdate: function() {
                        stat.textContent = Math.floor(this.targets()[0].textContent) + '+';
                    }
                });
            }
        });
    });
}

// ============================================
// Contact CTA (parallax desktop only)
// ============================================
function initContactCTA() {
    if (isMobile) return;
    
    const cta = document.querySelector('.contact-cta');
    if (!cta) return;
    
    const bg = cta.querySelector('.contact-cta-bg img');
    
    if (bg) {
        gsap.fromTo(bg,
            { scale: 1.2 },
            {
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: cta,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            }
        );
    }
}

// ============================================
// Preloader / Ready State
// ============================================
function initPreloader() {
    // Images loaded
    const images = document.querySelectorAll('img');
    let loaded = 0;
    
    const checkReady = () => {
        loaded++;
        if (loaded >= images.length) {
            document.body.classList.add('loaded');
        }
    };
    
    images.forEach(img => {
        if (img.complete) {
            checkReady();
        } else {
            img.addEventListener('load', checkReady);
            img.addEventListener('error', checkReady);
        }
    });
    
    // Fallback
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 3000);
}

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCursor();
    initMagnetic();
    initPageTransitions();
    initHero();
    initScrollAnimations();
    initBentoGrid();
    initServices();
    initMarquee();
    initHorizontalScroll();
    initParallax();
    initAbout();
    initContactCTA();
});

// Refresh on resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 200);
});

// ============================================
// Bento Grid Scroll Animation
// ============================================
function initBentoAnimation() {
    const bentoItems = document.querySelectorAll('.bento-item');
    
    if (!bentoItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    bentoItems.forEach(item => observer.observe(item));
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initBentoAnimation);

// Also run after GSAP animations
setTimeout(initBentoAnimation, 1000);

// ============================================
// Timeline Scroll Animation
// ============================================
function initTimelineAnimation() {
    // Observe the section itself for line draw
    const section = document.querySelector(".timeline-section");
    if (section) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                }
            });
        }, { threshold: 0.1 });
        sectionObserver.observe(section);
    }

    // Observe individual items with staggered delay
    const timelineItems = document.querySelectorAll("[data-timeline]");
    if (!timelineItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = Array.from(timelineItems).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add("is-visible");
                }, index * 300);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    });
    
    timelineItems.forEach(item => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", initTimelineAnimation);

// ============================================
// Mobile Hamburger Menu
// ============================================
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    if (!hamburger || !mobileMenu) return;
    
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.contains('is-active');
        
        hamburger.classList.toggle('is-active');
        mobileMenu.classList.toggle('is-active');
        body.classList.toggle('menu-open');
        hamburger.setAttribute('aria-expanded', !isOpen);
    });
    
    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('is-active');
            mobileMenu.classList.remove('is-active');
            body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// ============================================
// Stats Fallback - Ensure numbers show
// ============================================
function initStatsFallback() {
    const stats = document.querySelectorAll('.stat-number');
    
    // After 3 seconds, if stats still show 0, force update
    setTimeout(() => {
        stats.forEach(stat => {
            if (stat.textContent === '0' || stat.textContent === '0+') {
                const originalText = stat.getAttribute('data-original') || stat.textContent;
                // Get value from HTML or default
                const values = {'150+': 150, '50+': 50, '5+': 5};
                const statIndex = Array.from(stats).indexOf(stat);
                const defaultValues = [150, 50, 5];
                const endValue = defaultValues[statIndex] || 100;
                stat.textContent = endValue + '+';
            }
        });
    }, 3000);
}

document.addEventListener('DOMContentLoaded', initStatsFallback);

// ============================================
// Mobile Menu Close Button
// ============================================
function initMobileMenuClose() {
    const closeBtn = document.querySelector('.mobile-menu-close');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    if (!closeBtn || !mobileMenu) return;
    
    closeBtn.addEventListener('click', () => {
        hamburger.classList.remove('is-active');
        mobileMenu.classList.remove('is-active');
        body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
}

// ============================================
// IMMEDIATE INITIALIZATION
// ============================================
(function() {
    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const body = document.body;
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            const isOpen = hamburger.classList.contains('is-active');
            hamburger.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-active');
            body.classList.toggle('menu-open');
            hamburger.setAttribute('aria-expanded', !isOpen);
        });
        
        // Close menu when clicking links
        mobileMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('is-active');
                mobileMenu.classList.remove('is-active');
                body.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    if (closeBtn && mobileMenu && hamburger) {
        closeBtn.addEventListener('click', function() {
            hamburger.classList.remove('is-active');
            mobileMenu.classList.remove('is-active');
            body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    }
})();

// Mobile menu init handled by IIFE above
