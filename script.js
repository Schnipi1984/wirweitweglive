// WirWeitWeg – script.js

// Countdown bis 30. Juni 2026
function initCountdown() {
  const els = document.querySelectorAll('.cd-num, .cd-num2');
  const diff = Math.ceil((new Date('2026-06-30') - new Date()) / 864e5);
  els.forEach(el => el.textContent = diff > 0 ? diff : '0');
}

// FAQ Accordion
function toggleFaq(el) {
  const a = el.nextElementSibling;
  const open = el.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(q => {
    q.classList.remove('open');
    q.nextElementSibling.classList.remove('open');
  });
  if (!open) { el.classList.add('open'); a.classList.add('open'); }
}

// Mobile Nav
function initMobileNav() {
  const burger = document.querySelector('.nav-burger');
  const mobile = document.querySelector('.nav-mobile');
  const close = document.querySelector('.nav-mobile-close');
  if (!burger) return;
  burger.addEventListener('click', () => mobile.classList.add('open'));
  if (close) close.addEventListener('click', () => mobile.classList.remove('open'));
}

// Link kopieren
function copyLink(btn) {
  navigator.clipboard.writeText(window.location.href);
  const orig = btn.textContent;
  btn.textContent = '✓ Kopiert!';
  setTimeout(() => btn.textContent = orig, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initMobileNav();
});
