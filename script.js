document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progressBar');
    const slideCounter = document.getElementById('slideCounter');
    const navPrev = document.getElementById('navPrev');
    const navNext = document.getElementById('navNext');
    const costCounter = document.getElementById('costCounter');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Initialization
    function updateUI() {
        // Update Slides classes
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update Progress Bar
        const progress = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;

        // Update Counter
        slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;

        // Handle specific slide animations
        handleSlideSpecifics(currentSlide);
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateUI();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateUI();
        }
    }

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            prevSlide();
        } else if (e.key === 'f' || e.key === 'F') {
            toggleFullScreen();
        }
    });

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Click Navigation
    navNext.addEventListener('click', nextSlide);
    navPrev.addEventListener('click', prevSlide);

    // Number counter animation function
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    let hasAnimatedCost = false;

    // Slide specific behaviors
    function handleSlideSpecifics(index) {
        const activeSlide = slides[index];
        const theme = activeSlide.getAttribute('data-theme');
        
        // Cost Counter Animation on Slide 6 (index 5)
        if (index === 5 && !hasAnimatedCost) {
            setTimeout(() => {
                animateValue(costCounter, 0, 47, 1500);
                hasAnimatedCost = true;
            }, 500); // delay to let slide transition finish
        } else if (index !== 5) {
            hasAnimatedCost = false; // reset so it animates again next time
        }
    }

    // Touch Support for mobile swiping
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            nextSlide();
        } else if (touchEndX > touchStartX + threshold) {
            prevSlide();
        }
    }

    // Init
    updateUI();
});
