// ============================================
// Lightbox functionality
// ============================================

(function() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCurrent = lightbox.querySelector('.lightbox-current');
    const lightboxTotal = lightbox.querySelector('.lightbox-total');
    
    const galleryItems = document.querySelectorAll('[data-lightbox]');
    let currentIndex = 0;
    
    if (galleryItems.length === 0) return;
    
    // Update total count
    if (lightboxTotal) lightboxTotal.textContent = galleryItems.length;
    
    function openLightbox(index) {
        currentIndex = index;
        const img = galleryItems[index].querySelector('img');
        if (!img) return;
        
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        if (lightboxCurrent) lightboxCurrent.textContent = index + 1;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Preload adjacent images
        preloadImage((index - 1 + galleryItems.length) % galleryItems.length);
        preloadImage((index + 1) % galleryItems.length);
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showPrev() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightbox();
    }
    
    function showNext() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightbox();
    }
    
    function updateLightbox() {
        const img = galleryItems[currentIndex].querySelector('img');
        if (!img) return;
        
        // Fade out
        lightboxImage.style.opacity = '0';
        lightboxImage.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            if (lightboxCurrent) lightboxCurrent.textContent = currentIndex + 1;
            
            // Fade in
            lightboxImage.style.opacity = '1';
            lightboxImage.style.transform = 'scale(1)';
        }, 150);
        
        // Preload adjacent
        preloadImage((currentIndex + 1) % galleryItems.length);
    }
    
    function preloadImage(index) {
        const img = galleryItems[index]?.querySelector('img');
        if (img) {
            const preload = new Image();
            preload.src = img.src;
        }
    }
    
    // Event listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });
    
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
    
    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                showNext();
            } else {
                showPrev();
            }
        }
    }
    
    // Hero parallax for project pages
    const heroImage = document.querySelector('.project-hero-image img');
    if (heroImage && typeof gsap !== 'undefined') {
        gsap.to(heroImage, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: '.project-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
})();
