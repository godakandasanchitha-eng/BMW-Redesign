/* ============================================================
   BMW.LK — MAIN JAVASCRIPT
   Hero slider · Scroll reveals · Smooth scroll
   ============================================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1. HERO SLIDER
     ══════════════════════════════════════════════════════════ */

  const slides      = document.querySelectorAll('.hero__slide');
  const dots        = document.querySelectorAll('.hero__dot');
  const counterEl   = document.getElementById('heroCounterCurrent');
  const eyebrowEl   = document.getElementById('heroEyebrow');
  const titleEl     = document.getElementById('heroTitle');
  const subEl       = document.getElementById('heroSub');

  const slideData = [
    {
      eyebrow: 'The BMW i7',
      title:   'Sheer<br>Driving<br>Pleasure',
      sub:     'The first fully electric BMW i7 Sedan — where cinematic luxury meets zero emissions.',
    },
    {
      eyebrow: 'BMW X Series',
      title:   'Born For<br>Every<br>Road',
      sub:     'Command every terrain with confidence. The BMW X Series redefines luxury SUV performance.',
    },
    {
      eyebrow: 'BMW 5 Series',
      title:   'Precision<br>Crafted<br>Excellence',
      sub:     'An icon reimagined — the new BMW 5 Series sets the standard for executive sedans.',
    },
  ];

  let currentSlide = 0;
  let autoTimer    = null;
  const INTERVAL   = 6000;

  function goToSlide(index) {
    /* Remove active from current */
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    /* Reset dot fill animation */
    const oldFill = dots[currentSlide].querySelector('.hero__dot-fill');
    if (oldFill) { oldFill.style.animation = 'none'; oldFill.offsetHeight; }

    currentSlide = index;

    /* Activate new */
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    /* Restart dot fill */
    const newFill = dots[currentSlide].querySelector('.hero__dot-fill');
    if (newFill) { newFill.style.animation = ''; }

    /* Update counter */
    if (counterEl) {
      counterEl.textContent = String(currentSlide + 1).padStart(2, '0');
    }

    /* Crossfade text */
    if (eyebrowEl && titleEl && subEl) {
      const d = slideData[currentSlide];
      [eyebrowEl, titleEl, subEl].forEach(function (el) {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(10px)';
      });
      setTimeout(function () {
        eyebrowEl.textContent = d.eyebrow;
        titleEl.innerHTML     = d.title;
        subEl.textContent     = d.sub;
        [eyebrowEl, titleEl, subEl].forEach(function (el) {
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        });
      }, 350);
    }
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  /* Dot click */
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      stopAuto();
      goToSlide(i);
      startAuto();
    });
  });

  /* Init */
  if (slides.length > 0) startAuto();


  /* ══════════════════════════════════════════════════════════
     2. INTERSECTION OBSERVER — scroll reveals
     ══════════════════════════════════════════════════════════ */

  const revealEls = document.querySelectorAll('.reveal, .stagger-children');

  if ('IntersectionObserver' in window && revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* Fallback: show everything */
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  /* ══════════════════════════════════════════════════════════
     3. SMOOTH SCROLL for anchor links
     ══════════════════════════════════════════════════════════ */

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH   = parseInt(getComputedStyle(document.documentElement)
                       .getPropertyValue('--nav-h'), 10) || 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ══════════════════════════════════════════════════════════
     4. MODELS PAGE — filter (used on models.html)
     ══════════════════════════════════════════════════════════ */

  const filterBtns  = document.querySelectorAll('[data-filter]');
  const vehicleCards = document.querySelectorAll('[data-type]');

  if (filterBtns.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = this.dataset.filter;

        /* Active state */
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        /* Show / hide cards */
        vehicleCards.forEach(function (card) {
          if (filter === 'all' || card.dataset.type === filter) {
            card.style.display = '';
            setTimeout(function () { card.style.opacity = '1'; }, 10);
          } else {
            card.style.opacity = '0';
            setTimeout(function () { card.style.display = 'none'; }, 350);
          }
        });
      });
    });

    /* Honour ?filter= query param */
    const params     = new URLSearchParams(window.location.search);
    const initFilter = params.get('filter');
    if (initFilter) {
      const matchBtn = document.querySelector('[data-filter="' + initFilter + '"]');
      if (matchBtn) matchBtn.click();
    }
  }


  /* ══════════════════════════════════════════════════════════
     5. GALLERY — lightbox-style expand (detail page)
     ══════════════════════════════════════════════════════════ */

  const galleryThumbs = document.querySelectorAll('.detail-gallery__thumb');
  const galleryMain   = document.querySelector('.detail-gallery__main img');

  if (galleryThumbs.length > 0 && galleryMain) {
    galleryThumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        const src = this.querySelector('img').src;
        galleryMain.style.opacity = '0';
        setTimeout(function () {
          galleryMain.src = src;
          galleryMain.style.opacity = '1';
        }, 250);
        galleryThumbs.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
      });
    });
  }

})();