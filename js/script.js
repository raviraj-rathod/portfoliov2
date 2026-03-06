document.addEventListener('DOMContentLoaded', () => {

    // 1. Lenis Smooth Scroll Setup
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Hash Links Smooth Scroll (Lenis Intercept)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { offset: -50, duration: 1.5 });
            }
        });
    });

    // 3. Theme Toggler
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    
    // Check saved theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) { themeIcon.classList.replace('fa-moon', 'fa-sun'); }
    }
    
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            let isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            if (isLight) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

    // 4. Custom Cursor (Neo-Brutalist Ring)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    if (window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        gsap.ticker.add(() => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
        });

        document.querySelectorAll('a, button, input, textarea, .skill-row, .project-card, .theme-toggle').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    } else {
        if(cursorDot) cursorDot.style.display = 'none';
        if(cursorRing) cursorRing.style.display = 'none';
    }

    // 5. GSAP Initialization
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0, 0);

    // 6. Loader & Initial Split Animations
    const tl = gsap.timeline();
    
    tl.to(".progress", { width: "100%", duration: 1.5, ease: "power2.inOut" })
      .to(".loader-content", { y: -50, opacity: 0, duration: 0.5, ease: "power2.in" })
      .to(".loader", { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "-=0.2")
      .from(".hero-badge", { y: -20, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".hero-huge-text", { y: 100, opacity: 0, duration: 1, stagger: 0.15, ease: "power4.out" }, "-=0.6")
      .from(".hero-subtext", { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
      .from(".hero-btns", { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
      .from(".hero-img-box", { scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.5)", rotation: -5 }, "-=1")
      .from(".floating-nav", { y: -50, opacity: 0, duration: 0.8 }, "-=0.8");

    // Smooth background shape movement
    gsap.to(".shape-1", { x: '10vw', y: '5vh', duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".shape-2", { x: '-10vw', y: '-5vh', duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1 });

    // 5. Scroll Reveals
    // About Section
    gsap.from(".about-left", {
        scrollTrigger: { trigger: "#about", start: "top 80%" },
        x: -50, opacity: 0, duration: 1
    });
    gsap.from(".big-text", {
        scrollTrigger: { trigger: "#about", start: "top 80%" },
        y: 30, opacity: 0, duration: 1, delay: 0.2
    });

    // Skills Row Stagger
    gsap.from(".skill-row", {
        scrollTrigger: { trigger: "#skills", start: "top 75%" },
        y: 30, opacity: 0, duration: 0.8, stagger: 0.1
    });

    // 6. Horizontal Scroll for Projects (GSAP MatchMedia for Desktop vs Mobile)
    let mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
        const projectsContainer = document.querySelector('.projects-container');
        const projectsWrapper = document.querySelector('.projects-wrapper');
        
        let getTotalWidth = () => projectsContainer.offsetWidth - window.innerWidth + window.innerWidth * 0.1; 
        
        gsap.to(projectsContainer, {
            x: () => -getTotalWidth(),
            ease: "none",
            scrollTrigger: {
                trigger: projectsWrapper,
                pin: true,
                scrub: 1,
                end: () => "+=" + getTotalWidth(),
                invalidateOnRefresh: true
            }
        });
    });

    mm.add("(max-width: 900px)", () => {
        gsap.from(".project-card", {
            scrollTrigger: { trigger: "#work", start: "top 80%" },
            y: 50, opacity: 0, duration: 0.8, stagger: 0.15
        });
    });

    // Experience Timeline
    gsap.utils.toArray('.timeline-row').forEach((row, i) => {
        gsap.from(row, {
            scrollTrigger: { trigger: row, start: "top 85%" },
            x: -50, opacity: 0, duration: 0.8
        });
    });

    // Contact Form AJAX
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending...';

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            })
            .then(res => res.json())
            .then(() => {
                btn.innerHTML = 'Message Sent!';
                btn.style.background = '#10b981';
                form.reset();
                setTimeout(() => { btn.innerHTML = originalText; btn.style.background = ''; }, 4000);
            })
            .catch(() => {
                btn.innerHTML = 'Error!';
                btn.style.background = '#ef4444';
                setTimeout(() => { btn.innerHTML = originalText; btn.style.background = ''; }, 4000);
            });
        });
    }

});
