// Initialize Lenis
try {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
} catch (e) { console.warn("Lenis error", e); }


// Ensure search-content is visible immediately (before GSAP loads)
document.addEventListener('DOMContentLoaded', () => {
    const searchContent = document.querySelector('.search-content');
    if (searchContent) {
        const children = searchContent.children;
        Array.from(children).forEach(child => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
            child.style.visibility = 'visible';
        });
    }
});

// GSAP Animations
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Parallax & Text Reveal
    // 1. Navbar Animation (Global)
    // 1. Navbar Animation (Global)
    // Only animate on desktop to prevent conflict with mobile menu "transform: none" fix
    if (window.innerWidth > 768) {
        const navbarTl = gsap.timeline();
        gsap.set('.navbar', { y: -100, opacity: 0 });

        navbarTl.to('.navbar', {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.5
        });
    }

    // 2. Hero Parallax & Text Reveal (Index Only)
    if (document.querySelector('.hero-v2')) {
        const heroTl = gsap.timeline();
        gsap.set('.hero-video-bg', { scale: 0.8, borderRadius: '100px', filter: 'blur(10px)' });

        heroTl
            .to('.hero-video-bg', {
                scale: 1,
                borderRadius: '12px',
                filter: 'blur(0px)',
                duration: 2,
                ease: 'expo.out'
            })
            .set('.hero-content-v2', { perspective: 1000 }) // Add perspective for 3D effect
            .from('.display-text', {
                y: 100,
                scale: 1.1,
                rotationX: -30,
                transformOrigin: "50% 50% -50px",
                opacity: 0,
                duration: 1.5,
                ease: 'power4.out',
                skewY: 2
            }, '-=1.5')
            .from('.hero-subtitle', {
                y: 20,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=1')
            .from('.hero-actions', {
                y: 20,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.8');
    }

    // Hero Background Parallax
    gsap.to('.hero-video-bg img', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-v2',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // 2. Image Reveal Parallax (About & Menu Images)
    const parallaxImages = document.querySelectorAll('.search-image img, .menu-image img, .about-image img');
    parallaxImages.forEach(img => {
        gsap.to(img, {
            scale: 1.1,
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // 3. Staggered Text Reveals for Sections
    const sections = document.querySelectorAll('.search-content, .menu-info, .about-content');
    sections.forEach(section => {
        // Ensure content is visible by default FIRST
        gsap.set(section.children, { opacity: 1, y: 0, clearProps: "all" });

        // Only animate if section is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.from(entry.target.children, {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'power2.out',
                        onComplete: () => {
                            gsap.set(entry.target.children, { opacity: 1, y: 0 });
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(section);
    });

    // 4. Gallery Stagger Animation
    // Assuming gallery images are in a grid or flex container
    const galleryImages = document.querySelectorAll('section[style*="d: grid"] img'); // Targeting the inline style gallery
    if (galleryImages.length > 0) {
        gsap.from(galleryImages, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: galleryImages[0].parentElement,
                start: 'top 85%'
            }
        });
    }

    // 5. Favorites Grid Stagger
    gsap.set('.fav-card', { opacity: 1, y: 0 }); // Ensure visibility
    gsap.from('.fav-card', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.favorites-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });

    // 6. Video Gallery Animation
    // 6. Video Gallery Animation - Simpler Fade In to avoid black screen issues
    // Using fromTo ensures we have control over the starting state
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    if (videoWrappers.length > 0) {
        gsap.fromTo(videoWrappers,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.video-gallery',
                    start: 'top 85%'
                }
            }
        );
    }

    // 7. Section Title Animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: title,
                start: 'top 85%'
            }
        });
    });

    // 8. Marquee Pause on Hover
    const marquee = document.querySelector('.marquee-content');
    if (marquee) {
        marquee.addEventListener('mouseenter', () => {
            gsap.to(marquee, { animationPlayState: 'paused', duration: 0.3 });
        });
        marquee.addEventListener('mouseleave', () => {
            gsap.to(marquee, { animationPlayState: 'running', duration: 0.3 });
        });
    }

    // 9. Navbar Scroll Effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // 10. Button Magnetic Effect (disabled for search-content buttons to prevent unwanted shift)
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    magneticButtons.forEach(btn => {
        // Skip magnetic effect for buttons in search-content
        if (btn.closest('.search-content')) {
            return;
        }
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// Set Active Nav Link Based on Current Page
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    // Get current page filename
    let currentPage = window.location.pathname.split('/').pop();
    
    // Handle root/index case
    if (!currentPage || currentPage === '' || currentPage === 'index.html') {
        currentPage = 'index.html';
    }
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Remove active class from all links first
        link.classList.remove('active');
        
        // Check if current page matches the link
        // Normalize both to handle cases like 'index.html' vs './index.html'
        const normalizedLink = linkHref.replace('./', '').replace('/', '');
        const normalizedCurrent = currentPage.replace('./', '').replace('/', '');
        
        if (normalizedLink === normalizedCurrent) {
            link.classList.add('active');
        }
    });
}

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Initialize active link on page load
document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
});

// 11. Global "Cinematic" Scroll Skew
function initCinematicSkew() {
    let proxy = { skew: 0 };
    let skewSetter = gsap.quickSetter(".hero-content-v2, .section-title, .fav-card, .video-wrapper", "skewY", "deg");
    let clamp = gsap.utils.clamp(-5, 5); // Don't skew too much

    ScrollTrigger.create({
        onUpdate: (self) => {
            let skew = clamp(self.getVelocity() / -300);
            if (Math.abs(skew) > 0.1) {
                gsap.to(proxy, {
                    skew: skew,
                    duration: 0.8,
                    ease: "power3",
                    overwrite: true,
                    onUpdate: () => skewSetter(proxy.skew)
                });
            } else {
                gsap.to(proxy, {
                    skew: 0,
                    duration: 0.8,
                    ease: "power3",
                    overwrite: true,
                    onUpdate: () => skewSetter(proxy.skew)
                }); // Settle back to 0
            }
        }
    });
}

// 12. Hero "Card Stack" Depth Effect
function initHeroDepth() {
    // Pin the hero section while the next section scrolls over it
    // And scale it down slightly to create depth
    ScrollTrigger.create({
        trigger: ".hero-v2",
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false, // Let content slide OVER
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const scale = 1 - (progress * 0.1); // Scale down to 0.9
            const opacity = 1 - (progress * 0.3); // Fade out slightly

            gsap.set(".hero-v2", {
                scale: scale,
                opacity: opacity,
                transformOrigin: "center center"
            });
        }
    });
}

// 13. Enhanced Image Perspective
function initPerspectiveImages() {
    const images = document.querySelectorAll('.search-image img, .fav-card img, .video-wrapper video');

    images.forEach(img => {
        // Parent needs perspective
        gsap.set(img.parentElement, { perspective: 1000, overflow: 'hidden' });

        gsap.fromTo(img,
            {
                rotationX: 10, // Tilted forward slightly
                scale: 1.1
            },
            {
                rotationX: 0,
                scale: 1, // Settle into place
                ease: "none",
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "center center",
                    scrub: 1
                }
            }
        );
    });
}

// 14. Subpage Header Animation (Big to Small + Content Slide Up)
function initPageHeaderAnimation() {
    // Only run if .page-header exists
    if (!document.querySelector('.page-header')) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Heading: Starts big and slightly lower, shrinks to normal and moves up
    tl.fromTo('.page-header .display-text',
        {
            scale: 2.0,
            y: 100,
            opacity: 0
        },
        {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 1.5,
            delay: 0.2, // Small delay after page load
            clearProps: 'all' // Critical: Removes inline styles after animation to fix rendering/layout issues
        }
    )
        // 2. Subtitle: Fades in and moves up
        // Delayed to start LATER so it doesn't overlap with the huge 2.5x text
        .from('.page-header .hero-subtitle', {
            y: 20,
            opacity: 0,
            duration: 1,
            clearProps: 'all'
        }, '-=0.5') // Starts when header is almost done shrinking

        // 3. Content below header: Slides up gently
        .from('.page-header + *', {
            y: 60,
            opacity: 0,
            duration: 1.2,
            clearProps: 'all'
        }, '-=0.8');
}

// Initialize new effects
document.addEventListener('DOMContentLoaded', () => {
    // initCinematicSkew(); // Optional: Can be intense, maybe enable if requested
    initHeroDepth();
    initPerspectiveImages();
    initPageHeaderAnimation(); // Start Subpage Animation

    // Ensure Marquee sits on top of pinned Hero
    const marquee = document.querySelector('.marquee-container');
    if (marquee) {
        marquee.style.position = 'relative';
        marquee.style.zIndex = '20';
        marquee.style.backgroundColor = 'var(--color-bg)';
    }
});
