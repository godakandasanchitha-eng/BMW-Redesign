/* ============================================================
   BMW.LK — NAVIGATION & MOBILE MENU
   ============================================================ */

(function () {
  'use strict';

  /* ── Elements ── */
  const navbar       = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu   = document.getElementById('mobileMenu');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const menuCloseBtn = document.getElementById('menuCloseBtn');

  /* ── Scroll-aware navbar ── */
  let lastScrollY = 0;
  let ticking     = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }

  function updateNavbar() {
    if (lastScrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile menu open ── */
  function openMenu() {
    mobileMenu.classList.add('open');
    hamburgerBtn.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  /* ── Mobile menu close ── */
  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
  if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);

  /* ── ESC key closes menu ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── Close menu on nav link click ── */
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

})();