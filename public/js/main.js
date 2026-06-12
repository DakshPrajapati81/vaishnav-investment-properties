/* ============================================
   VAISHNAV INVESTMENT & PROPERTIES
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initActiveNav();
  initHeroSlideshow();
  initScrollAnimations();
  initTestimonialSlider();
  initStatsCounter();
  initPropertySearch();
  initContactForm();
});

/* ---------- Sticky Navbar ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar || navbar.classList.contains('navbar-solid')) return;

  const scrollThreshold = 80;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    });
  }

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- Active Nav Link ---------- */
function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---------- Hero Slideshow ---------- */
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  const hero = document.getElementById('hero');

  if (!slides.length || slides.length < 2) return;

  let current = 0;
  let autoplayInterval;
  const SLIDE_DURATION = 2000; // 2.5 seconds per slide

  function goToSlide(index) {
    // Remove active from current
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');

    // Update index
    current = (index + slides.length) % slides.length;

    // Add active to new
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');

    // Restart progress bar animation
    if (hero) {
      hero.style.animation = 'none';
      hero.offsetHeight; // trigger reflow
      hero.style.animation = '';
    }
  }

  function nextSlide() {
    goToSlide(current + 1);
  }

  function prevSlide() {
    goToSlide(current - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, SLIDE_DURATION);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Arrow buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoplay();
      prevSlide();
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoplay();
      nextSlide();
      startAutoplay();
    });
  }

  // Dot buttons
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(i);
      startAutoplay();
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      stopAutoplay();
      prevSlide();
      startAutoplay();
    } else if (e.key === 'ArrowRight') {
      stopAutoplay();
      nextSlide();
      startAutoplay();
    }
  });

  // Touch swipe support
  let touchStartX = 0;
  let isSwiping = false;

  if (hero) {
    hero.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      isSwiping = true;
      stopAutoplay();
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      isSwiping = false;
      startAutoplay();
    }, { passive: true });
  }

  // Pause on hover
  if (hero) {
    hero.addEventListener('mouseenter', stopAutoplay);
    hero.addEventListener('mouseleave', startAutoplay);
  }

  // Start
  goToSlide(0);
  startAutoplay();
}

/* ---------- Scroll Animations ---------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- Testimonial Slider ---------- */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.slider-dots .dot');
  if (!track || !dots.length) return;

  const slides = track.querySelectorAll('.testimonial-slide');
  let current = 0;
  let interval;

  function goToSlide(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function startAutoplay() {
    interval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(interval);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(i);
      startAutoplay();
    });
  });

  // Touch swipe support
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide((current + 1) % slides.length);
      } else {
        goToSlide((current - 1 + slides.length) % slides.length);
      }
    }
    isDragging = false;
    startAutoplay();
  }, { passive: true });

  goToSlide(0);
  startAutoplay();
}

/* ---------- Stats Counter ---------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ---------- Property Search & Filter ---------- */
function initPropertySearch() {
  const grid = document.getElementById('properties-grid');
  const resultsInfo = document.getElementById('results-info');

  // Hero search bar (home page)
  const heroSearchBtn = document.getElementById('hero-search-btn');
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', () => {
      const location = document.getElementById('hero-location')?.value || 'all';
      const status = document.getElementById('hero-status')?.value || 'all';
      const type = document.getElementById('hero-type')?.value || 'all';
      window.location.href = `properties.html?location=${encodeURIComponent(location)}&status=${encodeURIComponent(status)}&type=${encodeURIComponent(type)}`;
    });
  }

  // Properties page
  if (!grid) return;

  let allProperties = [];

  async function loadProperties() {
    try {
      const response = await fetch('/api/properties');
      allProperties = await response.json();
      populateFilters(allProperties);
      applyURLFilters();
    } catch (err) {
      console.error('Failed to load properties:', err);
      grid.innerHTML = '<div class="no-results"><i class="fas fa-exclamation-circle"></i><h3>Error Loading Properties</h3><p>Please try refreshing the page.</p></div>';
    }
  }

  function populateFilters(properties) {
    const locationSelect = document.getElementById('filter-location');
    const typeSelect = document.getElementById('filter-type');

    if (locationSelect) {
      const locations = [...new Set(properties.map(p => p.location))].sort();
      locations.forEach(loc => {
        const opt = document.createElement('option');
        opt.value = loc;
        opt.textContent = loc;
        locationSelect.appendChild(opt);
      });
    }

    if (typeSelect) {
      const types = [...new Set(properties.map(p => p.type))].sort();
      types.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        typeSelect.appendChild(opt);
      });
    }
  }

  function applyURLFilters() {
    const params = new URLSearchParams(window.location.search);
    const locationParam = params.get('location');
    const statusParam = params.get('status');
    const typeParam = params.get('type');

    if (locationParam && locationParam !== 'all') {
      const el = document.getElementById('filter-location');
      if (el) el.value = locationParam;
    }
    if (statusParam && statusParam !== 'all') {
      const el = document.getElementById('filter-status');
      if (el) el.value = statusParam;
    }
    if (typeParam && typeParam !== 'all') {
      const el = document.getElementById('filter-type');
      if (el) el.value = typeParam;
    }

    filterProperties();
  }

  function filterProperties() {
    const location = document.getElementById('filter-location')?.value || 'all';
    const status = document.getElementById('filter-status')?.value || 'all';
    const type = document.getElementById('filter-type')?.value || 'all';

    let filtered = allProperties;

    if (location !== 'all') {
      filtered = filtered.filter(p => p.location === location);
    }
    if (status !== 'all') {
      filtered = filtered.filter(p => p.status === status);
    }
    if (type !== 'all') {
      filtered = filtered.filter(p => p.type === type);
    }

    renderProperties(filtered);
  }

  function getStatusBadgeClass(status) {
    if (status === 'For Sale') return 'badge-sale';
    if (status === 'Buy') return 'badge-buy';
    return 'badge-rent';
  }

  function renderProperties(properties) {
    if (resultsInfo) {
      resultsInfo.innerHTML = `Showing <strong>${properties.length}</strong> of <strong>${allProperties.length}</strong> properties`;
    }

    if (properties.length === 0) {
      grid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1;">
          <i class="fas fa-search"></i>
          <h3>No Properties Found</h3>
          <p>Try adjusting your search filters to find what you're looking for.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = properties.map(p => {
      const propId = p._id || p.id;
      return `
      <a href="property-detail.html?id=${propId}" class="property-card reveal visible" style="text-decoration:none;color:inherit;">
        <div class="card-image">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
          <div class="card-badges">
            <span class="badge-tag ${getStatusBadgeClass(p.status)}">${p.status}</span>
            ${p.featured ? '<span class="badge-tag badge-featured">Featured</span>' : ''}
          </div>
          <div class="card-price">${p.price}</div>
        </div>
        <div class="card-body">
          <h3 class="card-title">${p.title}</h3>
          <div class="card-location">
            <i class="fas fa-map-marker-alt"></i>
            <span>${p.location}, Delhi</span>
          </div>
          <div class="card-meta">
            ${p.bedrooms > 0 ? `<span class="meta-item"><i class="fas fa-bed"></i> ${p.bedrooms} Beds</span>` : ''}
            ${p.bathrooms > 0 ? `<span class="meta-item"><i class="fas fa-bath"></i> ${p.bathrooms} Baths</span>` : ''}
            <span class="meta-item"><i class="fas fa-ruler-combined"></i> ${p.area} sqft</span>
          </div>
        </div>
      </a>
    `}).join('');
  }

  // Event listeners for filter
  const searchBtn = document.getElementById('filter-search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', filterProperties);
  }

  // Also filter on select change for better UX
  ['filter-location', 'filter-status', 'filter-type'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', filterProperties);
  });

  loadProperties();
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = form.querySelector('#form-name');
    const email = form.querySelector('#form-email');
    const phone = form.querySelector('#form-phone');
    const message = form.querySelector('#form-message');
    let valid = true;

    [name, email, phone, message].forEach(field => {
      if (!field || !field.value.trim()) {
        field.style.borderColor = '#EF4444';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (email && email.value && !isValidEmail(email.value)) {
      email.style.borderColor = '#EF4444';
      valid = false;
    }

    if (!valid) return;

    // Show success
    form.style.display = 'none';
    const success = document.querySelector('.form-success');
    if (success) success.classList.add('show');
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
