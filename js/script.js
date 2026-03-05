/**
 * Ravi Rathod - Developer Portfolio
 * Main Script File
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       0. Theme Toggle (Light / Dark)
       ========================================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Default to dark theme unless user explicitly chose light
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme !== 'light') {
        document.body.classList.add('dark-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        document.body.classList.remove('dark-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            let theme = 'light';
            if (document.body.classList.contains('dark-theme')) {
                theme = 'dark';
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            localStorage.setItem('theme', theme);
        });
    }

    /* =========================================
       1. Custom Cursor
       ========================================= */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Only apply if custom cursor elements exist (desktop mostly)
    if (cursorDot && cursorOutline && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows exactly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay using animate
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect to interactive elements
        const hoverElements = document.querySelectorAll('a, button, .glass-card, input, textarea');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover');
            });
        });
    }

    /* =========================================
       2. Scroll Progress Indicator
       ========================================= */
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if(progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    });

    /* =========================================
       3. Intersection Observer (Scroll Reveals)
       ========================================= */
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .timeline-item');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    /* =========================================
       4. Navbar Background on Scroll & Mobile Menu
       ========================================= */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    /* =========================================
       5. Parallax Effect (Anti-Gravity feel)
       ========================================= */
    document.addEventListener("mousemove", parallax);
    function parallax(e) {
        // Apply slight movement to timeline and about section on mouse move
        const cards = document.querySelectorAll('.glass-card');
        
        cards.forEach(card => {
            const speed = card.getAttribute('data-speed') || 2;
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;
            
            // Only apply on desktop to prevent weird mobile issues
            if(window.innerWidth > 768) {
                // We use CSS variables for smooth interaction with CSS hover states
                card.style.setProperty('--parallax-x', `${x}px`);
                card.style.setProperty('--parallax-y', `${y}px`);
            }
        });
    }

    /* =========================================
       6. Github Contribution Graph Visualizer
       ========================================= */
    const graphContainer = document.getElementById('contribution-graph');
    if (graphContainer) {
        // Generate dummy squares to mimic github
        const totalNodes = 365; // roughly a year
        const frag = document.createDocumentFragment();
        
        for(let i=0; i<totalNodes; i++) {
            const node = document.createElement('div');
            node.classList.add('contrib-node');
            
            // Assign random contribution level (biased towards lower levels for realism)
            const rand = Math.random();
            if (rand > 0.9) {
                node.classList.add('contrib-lvl-4');
            } else if (rand > 0.75) {
                node.classList.add('contrib-lvl-3');
            } else if (rand > 0.5) {
                node.classList.add('contrib-lvl-2');
            } else if (rand > 0.3) {
                node.classList.add('contrib-lvl-1');
            }
            // else remains base block

            // Add slight animation delay to load beautifully
            node.style.transitionDelay = `${Math.random() * 0.5}s`;
            
            frag.appendChild(node);
        }
        graphContainer.appendChild(frag);
        
        // Ensure they fade in when scrolled into view
        const graphObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                document.querySelectorAll('.contrib-node').forEach((node, idx) => {
                    setTimeout(() => {
                        node.style.opacity = '1';
                        node.style.transform = 'scale(1)';
                    }, idx * 2); // 2ms stagger
                });
                graphObserver.disconnect();
            }
        });
        
        // initialize them hidden
        document.querySelectorAll('.contrib-node').forEach(node => {
            node.style.opacity = '0';
            node.style.transform = 'scale(0)';
        });
        
        graphObserver.observe(graphContainer);
    }
    
    /* =========================================
       7. Form Submission (AJAX via FormSubmit)
       ========================================= */
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-submit');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending... <span class="glow"></span>';

            fetch('https://formsubmit.co/ajax/rathodravi018@gmail.com', {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json'
                },
                body: new FormData(form)
            })
            .then(response => response.json())
            .then(data => {
                btn.innerHTML = 'Message Sent! <span class="glow"></span>';
                btn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 4000);
            })
            .catch(error => {
                btn.innerHTML = 'Error! Try Again <span class="glow"></span>';
                btn.style.background = 'linear-gradient(135deg, #ef4444, #f87171)';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 4000);
            });
        });
    }

});
