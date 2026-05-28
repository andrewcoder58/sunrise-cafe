/* ============================================================
   SUNRISE CAFE & BAKERY — Production Website Scripts
   Artisan Bakery & Brunch Cafe | Austin, TX
   Optimized for Performance, Accessibility & UX
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==================== NAVBAR ==================== */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  if (navToggle && navLinks) {
    const closeMobileMenu = () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    const toggleMobileMenu = () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    navToggle.addEventListener('click', toggleMobileMenu);

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navbar.contains(e.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  /* ==================== SMOOTH SCROLL ==================== */
  const SCROLL_OFFSET = 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const top = targetEl.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ==================== ACTIVE NAV LINK ==================== */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  if (sections.length && navAnchors.length) {
    const highlightNav = () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navAnchors.forEach(a => {
        a.classList.toggle(
          'active',
          a.getAttribute('href') === `#${current}`
        );
      });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();
  }

  /* ==================== SCROLL ANIMATIONS ==================== */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length) {
    if (prefersReducedMotion) {
      animatedElements.forEach(el => el.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const parent = entry.target.parentElement;
            const siblings = Array.from(parent.querySelectorAll('.animate-on-scroll'));
            const index = siblings.indexOf(entry.target);
            const delay = index * 100;

            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);

            obs.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1,
      });

      animatedElements.forEach(el => observer.observe(el));
    }
  }

  /* ==================== MENU FILTER ==================== */
  const filterBtns = document.querySelectorAll('.menu-tab');
  const menuItems = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;

      menuItems.forEach((item, i) => {
        const show = category === 'all' || item.dataset.category === category;
        item.classList.toggle('hidden', !show);

        if (show && !prefersReducedMotion) {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, i * 50);
        }
      });
    });
  });

  /* ==================== NEWSLETTER ==================== */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterStatus = document.getElementById('newsletterStatus');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const btn = newsletterForm.querySelector('button');
      const email = input?.value.trim();
      const action = newsletterForm.getAttribute('action') || '';

      if (!email) {
        if (newsletterStatus) {
          newsletterStatus.textContent = 'Please enter a valid email address.';
          newsletterStatus.className = 'newsletter-status';
        }
        return;
      }

      if (action.includes('{form_id}') || !action.includes('formspree.io')) {
        if (newsletterStatus) {
          newsletterStatus.textContent = 'Thanks! Replace {form_id} in the form action to start collecting signups.';
          newsletterStatus.className = 'newsletter-status success';
        }
        input.value = '';
        return;
      }

      if (newsletterStatus) {
        newsletterStatus.textContent = 'Sending your signup…';
        newsletterStatus.className = 'newsletter-status';
      }

      btn.textContent = 'Subscribed!';
      btn.style.background = 'linear-gradient(135deg, #6aab73, #3d8b4f)';

      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
        input.placeholder = 'Thanks! Check your inbox.';
        if (newsletterStatus) {
          newsletterStatus.textContent = 'Thanks! Your email is on its way.';
          newsletterStatus.className = 'newsletter-status success';
        }
      }, 1000);

      newsletterForm.submit();
    });
  }

  const openStatus = document.getElementById('openStatus');
  if (openStatus) {
    const openingHours = {
      0: { open: 8, close: 14 },
      1: { open: 7, close: 15 },
      2: { open: 7, close: 15 },
      3: { open: 7, close: 15 },
      4: { open: 7, close: 15 },
      5: { open: 7, close: 16 },
      6: { open: 8, close: 16 },
    };

    const updateOpenStatus = () => {
      const now = new Date();
      const today = openingHours[now.getDay()];
      if (!today) return;
      const currentHour = now.getHours() + now.getMinutes() / 60;
      const isOpen = currentHour >= today.open && currentHour < today.close;
      openStatus.textContent = isOpen ? 'Open now — stop by!' : 'Closed now — see you soon.';
      openStatus.classList.toggle('status-open', isOpen);
      openStatus.classList.toggle('status-closed', !isOpen);
    };

    updateOpenStatus();
    setInterval(updateOpenStatus, 5 * 60 * 1000);
  }

  /* ==================== HERO PARALLAX ==================== */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && !prefersReducedMotion) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          if (scrollY < window.innerHeight) {
            const offset = scrollY * 0.3;
            heroContent.style.transform = `translateY(${offset}px)`;
            heroContent.style.opacity =
              1 - (scrollY / (window.innerHeight * 0.8));
          }

          ticking = false;
        });

        ticking = true;
      }
    }, { passive: true });
  }

  /* ==================== MENU CARD HOVER TILT ==================== */
  if (!prefersReducedMotion) {
    document.querySelectorAll('.menu-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform =
          `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ==================== TESTIMONIAL SLIDER ==================== */
  const track = document.getElementById('testimonialTrack');
  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testimonialDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentSlide = 0;
    let slidesPerView = window.innerWidth >= 768 ? 2 : 1;
    let totalSlides = Math.ceil(cards.length / slidesPerView);

    const createDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = `dot ${i === currentSlide ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    };

    const goToSlide = (index) => {
      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;

      dotsContainer?.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    };

    prevBtn?.addEventListener('click', () => {
      goToSlide(currentSlide > 0 ? currentSlide - 1 : totalSlides - 1);
    });

    nextBtn?.addEventListener('click', () => {
      goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0);
    });

    let autoPlay = setInterval(() => {
      goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0);
    }, 5000);

    document.getElementById('testimonialSlider')?.addEventListener('mouseenter', () => {
      clearInterval(autoPlay);
    });

    document.getElementById('testimonialSlider')?.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0);
      }, 5000);
    });

    window.addEventListener('resize', () => {
      const newPerView = window.innerWidth >= 768 ? 2 : 1;
      if (newPerView !== slidesPerView) {
        slidesPerView = newPerView;
        totalSlides = Math.ceil(cards.length / slidesPerView);
        currentSlide = 0;
        createDots();
        goToSlide(0);
      }
    });

    createDots();
  }
});