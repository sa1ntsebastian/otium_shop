/* ============================================================================
   OTIUM — brand the word "otium" everywhere it appears in copy.
   Wraps the standalone word "otium" (any case) in <span class="otium-word">otium</span>
   so it is always lowercase, in the Otium font and green (styled in
   otium-tokens.css). Whole-word match (\botium\b) leaves "negotium" untouched.

   Skips: the header (word-mark is intentionally creme on the green band),
   scripts/styles/inputs, code, and anything already wrapped. Runs once on load
   and again when a section re-renders in the Customizer. SEO-safe (server HTML
   still says "otium"); attributes/aria-labels are never touched.
   ============================================================================ */
(function () {
  'use strict';

  var WORD = /\botium\b/gi;
  var SKIP_TAGS = {
    SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, INPUT: 1,
    SELECT: 1, OPTION: 1, CODE: 1, PRE: 1, SVG: 1
  };

  function skip(node) {
    var el = node.parentElement;
    while (el) {
      if (SKIP_TAGS[el.tagName]) return true;
      if (el.isContentEditable) return true;
      if (el.classList && (
        el.classList.contains('otium-word') ||
        el.classList.contains('header-wrapper') ||
        el.classList.contains('menu-drawer')
      )) return true;
      el = el.parentElement;
    }
    return false;
  }

  function process(root) {
    if (!root || !root.ownerDocument && root.nodeType !== 1 && root.nodeType !== 9) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var v = node.nodeValue;
        if (!v || v.indexOf('tium') === -1) return NodeFilter.FILTER_REJECT;
        if (skip(node)) return NodeFilter.FILTER_REJECT;
        WORD.lastIndex = 0;
        return WORD.test(v) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    var targets = [];
    var n;
    while ((n = walker.nextNode())) targets.push(n);

    targets.forEach(function (node) {
      var text = node.nodeValue;
      var frag = document.createDocumentFragment();
      var last = 0;
      var m;
      WORD.lastIndex = 0;
      while ((m = WORD.exec(text))) {
        if (m.index > last) {
          frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        }
        var span = document.createElement('span');
        span.className = 'otium-word';
        span.textContent = 'otium';
        frag.appendChild(span);
        last = m.index + m[0].length;
      }
      if (last < text.length) {
        frag.appendChild(document.createTextNode(text.slice(last)));
      }
      node.parentNode.replaceChild(frag, node);
    });
  }

  function init() {
    process(document.body);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Re-run for a section re-rendered in the Theme Customizer.
  document.addEventListener('shopify:section:load', function (e) {
    process(e.target);
  });
})();
