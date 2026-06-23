/* ============================================================================
   OTIUM — Motion layer (JS)
   Scroll-reveal via IntersectionObserver: fade in + rise, ONCE, staggered
   (max 80ms between siblings). Respects prefers-reduced-motion. No layout
   shift — toggles a class that animates opacity/transform only.

   Usage: add class "otium-reveal" to any element you want revealed. Group
   siblings under a parent with "otium-reveal-group" to get the stagger.
   ============================================================================ */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

  function revealAllNow() {
    document.querySelectorAll('.otium-reveal').forEach(function (el) {
      el.classList.add('otium-in');
    });
  }

  // No motion wanted, or no observer support: show everything immediately.
  if (REDUCED.matches || !('IntersectionObserver' in window)) {
    revealAllNow();
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;

        // Stagger siblings within a group, capped at 80ms steps.
        var delay = 0;
        var group = el.closest('.otium-reveal-group');
        if (group) {
          var items = Array.prototype.slice.call(
            group.querySelectorAll('.otium-reveal')
          );
          var idx = items.indexOf(el);
          if (idx > 0) delay = Math.min(idx, 6) * 80;
        }

        el.style.transitionDelay = delay + 'ms';
        el.classList.add('otium-in');

        // Once only.
        obs.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  function init() {
    document.querySelectorAll('.otium-reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // If the user switches to reduced-motion mid-session, reveal the rest.
  if (REDUCED.addEventListener) {
    REDUCED.addEventListener('change', function (e) {
      if (e.matches) revealAllNow();
    });
  }
})();
