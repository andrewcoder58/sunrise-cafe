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

  /* ==================== CART MODULE ==================== */
  const cartButton = document.getElementById('cartButton');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartClose = document.getElementById('cartClose');
  const cartCount = document.getElementById('cartCount');
  const cartItemsList = document.getElementById('cartItems');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const clearCartBtn = document.getElementById('clearCart');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutForm = document.getElementById('checkoutForm');

  let cart = JSON.parse(localStorage.getItem('sunrise_cart') || '[]');
  let orderPlaced = false;

  function saveCart() {
    localStorage.setItem('sunrise_cart', JSON.stringify(cart));
    updateCartUI();
  }

  // Render per-card controls (Add button or qty/remove controls) between price and tag
  function renderCardControls() {
    menuItems.forEach((card, i) => {
      const title = card.querySelector('h3')?.textContent?.trim() || `Item ${i + 1}`;
      const priceEl = card.querySelector('.menu-price');
      const tagEl = card.querySelector('.menu-tag');
      let controls = card.querySelector('.card-controls');
      if (!controls) {
        controls = document.createElement('div');
        controls.className = 'card-controls';
      }

      const existing = cart.find(it => it.title === title);
      // build inner html for controls
      if (existing) {
        controls.innerHTML = `
          <div class="card-qty">
            <button class="card-decrease" aria-label="Decrease">−</button>
            <span class="card-qty-label">${existing.qty}</span>
            <button class="card-increase" aria-label="Increase">+</button>
            <button class="card-remove btn btn-outline">Remove</button>
          </div>
        `;
      } else {
        controls.innerHTML = `<button class="btn add-to-cart">Add to cart</button>`;
      }

      // insert controls between price and tag (or append to footer)
      const footer = card.querySelector('.menu-card-footer') || card;
      if (tagEl) {
        if (!footer.contains(controls)) footer.insertBefore(controls, tagEl);
      } else {
        if (!footer.contains(controls)) footer.appendChild(controls);
      }

      // wire control listeners (stopPropagation to avoid accidental close)
      const addBtn = controls.querySelector('.add-to-cart');
      addBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        // micro animation on the clicked button
        addBtn.classList.add('pulse');
        setTimeout(() => addBtn.classList.remove('pulse'), 350);
        addItem(title, parseFloat(priceEl?.textContent.replace(/[^0-9.]/g, '') || '0'));
      });

      const inc = controls.querySelector('.card-increase');
      inc?.addEventListener('click', (e) => { e.stopPropagation(); const it = cart.find(it => it.title === title); if (it) { it.qty++; saveCart(); } });
      const dec = controls.querySelector('.card-decrease');
      dec?.addEventListener('click', (e) => { e.stopPropagation(); const idx = cart.findIndex(it => it.title === title); if (idx > -1) { if (cart[idx].qty > 1) cart[idx].qty--; else cart.splice(idx,1); saveCart(); } });
      const rem = controls.querySelector('.card-remove');
      rem?.addEventListener('click', (e) => { e.stopPropagation(); const idx = cart.findIndex(it => it.title === title); if (idx > -1) { cart.splice(idx,1); saveCart(); } });
    });
  }

  function formatCurrency(n) { return '$' + Number(n || 0).toFixed(2); }

  function getSubtotal() { return cart.reduce((s, i) => s + (i.price * i.qty), 0); }

  function updateCartUI() {
    if (!cartCount) return;
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    cartCount.textContent = totalItems;

    if (cartItemsList) {
      cartItemsList.innerHTML = '';
      if (cart.length === 0) {
        cartItemsList.style.display = 'none';
        const empty = document.querySelector('#cartBody .cart-empty');
        if (empty) empty.style.display = '';
      } else {
        cartItemsList.style.display = '';
        const empty = document.querySelector('#cartBody .cart-empty');
        if (empty) empty.style.display = 'none';

        cart.forEach((it, idx) => {
          const li = document.createElement('li');
          li.className = 'cart-item';
          li.dataset.index = idx;

          li.innerHTML = `
            <div class="cart-item-info">
              <div class="cart-item-title">${it.title}</div>
              <div class="cart-item-meta">${formatCurrency(it.price)}</div>
            </div>
            <div class="qty-controls">
              <button class="qty-decrease" aria-label="Decrease">−</button>
              <span class="qty">${it.qty}</span>
              <button class="qty-increase" aria-label="Increase">+</button>
            </div>
            <div style="margin-left:8px;">
              <button class="btn btn-outline remove-item" aria-label="Remove">Remove</button>
            </div>
          `;

          cartItemsList.appendChild(li);
        });
      }
    }

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(getSubtotal());
    // announce cart changes for assistive tech
    const cartLive = document.getElementById('cartLive');
    if (cartLive) {
      cartLive.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''} — ${formatCurrency(getSubtotal())}`;
    }

    // wire up qty and remove listeners (stopPropagation to avoid closing)
    cartItemsList?.querySelectorAll('.qty-increase').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const li = btn.closest('.cart-item');
        const idx = Number(li.dataset.index);
        cart[idx].qty++;
        saveCart();
      });
    });

    cartItemsList?.querySelectorAll('.qty-decrease').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const li = btn.closest('.cart-item');
        const idx = Number(li.dataset.index);
        if (cart[idx].qty > 1) cart[idx].qty--; else cart.splice(idx, 1);
        saveCart();
      });
    });

    cartItemsList?.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const li = btn.closest('.cart-item');
        const idx = Number(li.dataset.index);
        cart.splice(idx, 1);
        saveCart();
      });
    });

    // update card-level controls to reflect cart state
    renderCardControls();
  }

  function addItem(title, price) {
    const existing = cart.find(i => i.title === title);
    if (existing) existing.qty += 1; else cart.push({ title, price: Number(price) || 0, qty: 1 });
    saveCart();
    if (cartButton) {
      cartButton.classList.add('bump');
      setTimeout(() => cartButton.classList.remove('bump'), 300);
    }
  }

  // focus trap helpers
  const focusableSelectors = 'a[href], area[href], input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let previousActiveElement = null;
  function handleCartKeydown(e) {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(cartSidebar.querySelectorAll(focusableSelectors)).filter(el => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  function openCart() {
    if (!cartSidebar) return;
    cartSidebar.setAttribute('aria-hidden', 'false');
    cartButton?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('cart-open');
    // hide checkout form initially
    if (checkoutForm) checkoutForm.style.display = 'none';
    // focus trap: save active element and move focus into cart
    previousActiveElement = document.activeElement;
    setTimeout(() => {
      const focusable = cartSidebar.querySelectorAll(focusableSelectors);
      if (focusable.length) focusable[0].focus();
    }, 50);
    document.addEventListener('keydown', handleCartKeydown);
  }

  function closeCart() {
    if (!cartSidebar) return;
    cartSidebar.setAttribute('aria-hidden', 'true');
    cartButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('cart-open');
    if (checkoutForm) checkoutForm.style.display = 'none';
    // remove focus trap and restore focus
    document.removeEventListener('keydown', handleCartKeydown);
    if (previousActiveElement && previousActiveElement.focus) previousActiveElement.focus();
  }

  cartButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    const hidden = cartSidebar?.getAttribute('aria-hidden') === 'true';
    if (hidden) { updateCartUI(); openCart(); } else { closeCart(); }
  });

  cartClose?.addEventListener('click', closeCart);
  clearCartBtn?.addEventListener('click', () => { cart = []; saveCart(); });
  checkoutBtn?.addEventListener('click', () => {
    if (orderPlaced || cart.length === 0) return;
    if (checkoutForm) checkoutForm.style.display = 'block';
    checkoutForm?.querySelector('input,select,textarea')?.focus();
  });

  document.addEventListener('click', (e) => {
    if (cartSidebar && cartSidebar.getAttribute('aria-hidden') === 'false' && !cartSidebar.contains(e.target) && e.target !== cartButton) {
      closeCart();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartSidebar && cartSidebar.getAttribute('aria-hidden') === 'false') closeCart();
  });

  // Initial render of card controls
  if (menuItems && menuItems.length) {
    renderCardControls();
  }

  // initialize cart UI on load
  saveCart();

  // Checkout submit (mock)
  checkoutForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('customerName')?.value.trim();
    const emailInput = document.getElementById('customerEmail');
    const email = emailInput?.value.trim();
    const type = document.getElementById('orderType')?.value;
    const notes = document.getElementById('orderNotes')?.value.trim();
    // basic email validation
    const emailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name) { alert('Please provide your name to place the order.'); return; }
    if (!emailValid) { alert('Please provide a valid email address.'); emailInput?.focus(); return; }
    if (orderPlaced || cart.length === 0) return;
    orderPlaced = true;

    const orderNumber = 'S' + Date.now().toString().slice(-6);
    const subtotal = getSubtotal();
    const summary = cart.map(i => `${i.qty}x ${i.title} (${formatCurrency(i.price)})`).join('\n');
    const cartBody = document.getElementById('cartBody');
    if (cartBody) {
      // lock checkout after successful order
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.display = 'none';
      }

      // hide totals / actions
      const cartTotals = document.querySelector('.cart-footer .cart-totals');
      if (cartTotals) cartTotals.style.display = 'none';

      // remove the "Your cart is empty." element from DOM while showing confirmation
      const emptyEl = cartBody.querySelector('.cart-empty');
      if (emptyEl) emptyEl.remove();

      const confirm = document.createElement('div');
      confirm.className = 'order-confirm';
      confirm.innerHTML = `<h3>Thanks, ${name}!</h3><p>Your order <strong>#${orderNumber}</strong> has been placed on Square Online.</p><pre style="white-space:pre-wrap;">${summary}</pre><p><strong>Total:</strong> ${formatCurrency(subtotal)}</p>`;

      // place 'Start another order' button in the cart footer (more visible)
      const cartFooter = document.querySelector('.cart-footer');
      const startBtn = document.createElement('button');
      startBtn.className = 'btn btn-outline';
      startBtn.id = 'startAnotherBtn';
      startBtn.textContent = 'Start another order';
      startBtn.addEventListener('click', () => {
        // remove confirmation and restore totals
        confirm.remove();
        if (cartTotals) cartTotals.style.display = '';
        // restore the empty element so updateCartUI has something to toggle
        if (!cartBody.querySelector('.cart-empty')) {
          const newEmpty = document.createElement('div');
          newEmpty.className = 'cart-empty';
          newEmpty.textContent = 'Your cart is empty.';
          cartBody.insertBefore(newEmpty, cartItemsList);
        }
        // reset ordering state
        orderPlaced = false;

        if (checkoutBtn) {
          checkoutBtn.disabled = false;
          checkoutBtn.style.display = '';
        }

        if (checkoutForm) {
          checkoutForm.reset();
          checkoutForm.style.display = 'none';
        }

        // remove start button from footer
        startBtn.remove();
        cart = [];
        saveCart();
      });

      // append confirm to body and button to footer
      cartBody.appendChild(confirm);
      if (cartFooter) cartFooter.appendChild(startBtn);
    }
    cart = [];
    saveCart();
  });
});