document.addEventListener('DOMContentLoaded', () => {

    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle-checkbox');

    // --------------- 1. Переключение темы ---------------
    const applyTheme = (theme) => {
        html.setAttribute('data-theme', theme);
        if (theme === 'light') {
            themeToggle.checked = true;
        } else {
            themeToggle.checked = false;
        }
    };

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --------------- 2. Анимация логотипа при скролле ---------------
    const header = document.getElementById('main-header');
    const heroSection = document.getElementById('hero');

    const logoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.boundingClientRect.y < 0) {
                header.classList.add('logo-in-header', 'scrolled');
            } else {
                header.classList.remove('logo-in-header');
                if (window.scrollY < 50) {
                     header.classList.remove('scrolled');
                }
            }
        });
    }, { threshold: [1] });
    
    if (heroSection) {
       logoObserver.observe(heroSection);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50 && !header.classList.contains('logo-in-header')) {
            header.classList.add('scrolled');
        } else if (window.scrollY < 50 && !header.classList.contains('logo-in-header')) {
            header.classList.remove('scrolled');
        }
    });


    // --------------- 3. Анимации при скролле ---------------
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --------------- 4. Типизированная анимация текста ---------------
    const typingSpan = document.getElementById('typing-span');
    if(typingSpan) {
        const words = ["один!", "уникальный!", "крутой!"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingSpan.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingSpan.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, 500);
            } else {
                const typingSpeed = isDeleting ? 75 : 150;
                setTimeout(type, typingSpeed);
            }
        }
        type();
    }
    
    // --- ИСПРАВЛЕНИЕ: 3D ЭФФЕКТ ДЛЯ ВСЕХ КАРТОЧЕК ---
    const interactiveCards = document.querySelectorAll('.feature-card, .dev-card, .link-block');
    
    interactiveCards.forEach(card => {
        // Находим внутренний вращающийся элемент или используем саму карточку
        const cardInner = card.querySelector('.feature-card-inner') || card.querySelector('.dev-card-inner') || card;
        
        if (cardInner) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const rotateX = -y / 25; 
                const rotateY = x / 25;
                
                cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                cardInner.style.transform = `rotateX(0deg) rotateY(0deg)`;
            });
        }
    });


    // --------------- 6. Мобильное меню ---------------
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
        mainNav.querySelectorAll('a').forEach(link => {
            if (!link.parentElement.classList.contains('dropdown')) {
                link.addEventListener('click', () => {
                    if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                    }
                });
            }
        });
    }
});