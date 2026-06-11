/* SodCalc Core - navigation, analytics, localStorage checklists */
(function() {
  'use strict';

  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('open');
      navToggle.textContent = navMenu.classList.contains('open') ? '\u2715' : '\u2630';
    });
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.textContent = '\u2630';
      }
    });
  }

  // Language selector toggle
  var langBtn = document.querySelector('.lang-btn');
  var langDropdown = document.querySelector('.lang-dropdown');
  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var open = langDropdown.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function(e) {
      if (!langBtn.contains(e.target)) {
        langDropdown.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Wire up checklist inputs with id/for for accessibility
  document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(function(cb) {
    var id = cb.dataset.key;
    if (id) {
      cb.id = id;
      var label = cb.nextElementSibling;
      if (label && label.tagName === 'LABEL') {
        label.setAttribute('for', id);
      }
    }
  });

  // Checklist localStorage persistence
  document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(function(cb) {
    var key = 'sodcalc_' + (cb.dataset.key || cb.nextElementSibling.textContent.trim());
    // Restore state
    if (localStorage.getItem(key) === 'true') {
      cb.checked = true;
      cb.parentElement.classList.add('checked');
    }
    // Save state
    cb.addEventListener('change', function() {
      if (cb.checked) {
        localStorage.setItem(key, 'true');
        cb.parentElement.classList.add('checked');
      } else {
        localStorage.removeItem(key);
        cb.parentElement.classList.remove('checked');
      }
    });
  });

  // Tap entire row to toggle checkbox
  document.querySelectorAll('.checklist-item').forEach(function(row) {
    row.addEventListener('click', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'A') return;
      var cb = row.querySelector('input[type="checkbox"]');
      if (cb) {
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(q) {
    q.setAttribute('tabindex', '0');
    q.setAttribute('role', 'button');
    q.setAttribute('aria-expanded', 'false');
    function toggle() {
      var item = q.parentElement;
      var isOpen = item.classList.toggle('open');
      q.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    q.addEventListener('click', toggle);
    q.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // Unit toggle
  document.querySelectorAll('.unit-toggle').forEach(function(toggle) {
    var buttons = toggle.querySelectorAll('button');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        buttons.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        if (typeof onUnitChange === 'function') {
          onUnitChange(this.dataset.unit || (this.textContent.trim().toLowerCase().includes('sq ft') ? 'imperial' : 'metric'));
        }
      });
    });
  });
// Back to top button
  var btt = document.createElement('button');
  btt.className = 'back-to-top';
  btt.setAttribute('aria-label', 'Back to top');
  btt.textContent = '\u2191';
  btt.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(btt);

  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        if (window.scrollY > 400) {
          btt.classList.add('visible');
        } else {
          btt.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();