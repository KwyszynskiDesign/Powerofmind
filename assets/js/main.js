import { throttle } from './utils.js';

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', throttle((e) => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }, 100));
}

function initTestimonialsToggle() {
  const btn = document.getElementById('testimonials-toggle');
  const extra = document.querySelectorAll('.testimonials-grid__extra');
  if (!btn || !extra.length) return;

  btn.addEventListener('click', () => {
    const willShow = extra[0].classList.contains('is-hidden');
    extra.forEach(el => el.classList.toggle('is-hidden', !willShow));
    btn.textContent = willShow ? 'Pokaż mniej opinii' : 'Pokaż więcej opinii';
    btn.setAttribute('aria-expanded', String(willShow));
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initTestimonialsToggle();
  initSmoothScroll();
});
