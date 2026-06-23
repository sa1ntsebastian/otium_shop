# Otium — Dawn restyling layer

A brand restyling + restrained motion layer on top of **Shopify Dawn v15.5.0**.
All of Dawn's commerce logic (cart, checkout, product/collection templates,
Liquid objects, sync hooks) is left **untouched**. Only presentation files were
added or edited.

## What changed

### New files (additive — the brand layer)

| File | Purpose |
|------|---------|
| `assets/otium-tokens.css` | Brand design tokens (`--otm-*` palette), self-hosted `@font-face` (Etoile + Hanken Grotesk), typography re-pointing, "old money" calm overrides (no gradients/shadows/frames), `.otium-motto`, accent helpers (`.otium-rule`, `.otium-label`). |
| `assets/otium-motion.css` | Restrained motion: scroll-reveal, hover-lift, image-hover-scale, link-underline grow, button fill. Re-tunes Dawn's native reveal to the brand spec. Full `prefers-reduced-motion` off-switch. |
| `assets/otium-motion.js` | `IntersectionObserver` scroll-reveal for `.otium-reveal` elements (fade + 10px rise, 600ms ease-out, once, ≤80ms stagger). Self-disables on reduced-motion / no-JS. |
| `assets/otium-hanken-latin.woff2` | Hanken Grotesk (Google Fonts, OFL), variable weight 100–900, latin subset. Self-hosted. |
| `assets/otium-hanken-latin-ext.woff2` | Hanken Grotesk, latin-ext subset. |
| `assets/otium-etoile-regular.woff2` | Etoile Regular — display serif for headlines / word-mark. |
| `assets/otium-etoile-italic.woff2` | Etoile Italic — **only** for the motto (`.otium-motto`). |

### Edited Dawn files (minimal, presentation-only)

| File | Edit |
|------|------|
| `layout/theme.liquid` | Link `otium-tokens.css` + `otium-motion.css` after `base.css`; replace the unused Shopify-font preloads with preloads of the two render-critical brand fonts; load `otium-motion.js` before `</body>`. |
| `config/settings_data.json` | Re-color Dawn's 5 color schemes to the Otium palette (creme surface, ink text, green anchor; scheme-4 = small green badge). Section spacing raised to 56 for generous whitespace. |
| `snippets/card-product.liquid` | Add `otium-lift` (hover-lift) to the card wrapper and `otium-zoom` (≤1.03 image scale) to the media wrapper. No markup/logic removed. |

## Design system

**Palette** (CSS variables in `otium-tokens.css`, also wired through Dawn's color
schemes): creme `#F3ECE0` surface (~75%), green `#1E5A3C` anchor (~20%, never
flooded), ink `#2D2016` text; accents corpus `#C99A98` (Kosmetik), vinum
`#6E3B47` (Wein), vestis `#A98C66` (Mode) — used only as a thin line/small label
on creme, never as a green/coloured fill.

**Type** (exactly two families): **Etoile** (display serif) for the word-mark and
large headlines; **Hanken Grotesk** for everything else. Both self-hosted with
`preload` + `font-display: swap`. **Etoile Italic is reserved exclusively for the
motto** via `.otium-motto` and is excluded from all animation.

## Motion (the rules, enforced)

Allowed: scroll-reveal (fade + 10px rise, 600ms ease-out, once, ≤80ms stagger),
hover-lift cards (`translateY(-4px)`, 500ms), image-hover-scale (≤1.03, 600ms,
clipped container), link underline grow (`::after`, 350ms), button fill/colour
(350ms / 300ms). Forbidden (and absent): bounce, parallax, rotation, autoplay
carousels, scale > 1.05, sub-300ms, blinking. **`prefers-reduced-motion: reduce`
turns everything off.** Reveals animate opacity/transform only → no CLS; images
stay lazy-loaded.

### Reusable classes (add in the theme editor / custom Liquid blocks)
- `.otium-motto` — the motto "in otio esse." (Etoile Italic, min ~28px, static).
- `.otium-reveal` (+ wrap siblings in `.otium-reveal-group` for stagger).
- `.otium-lift`, `.otium-zoom`, `.otium-underline`.
- `.otium-rule`, `.otium-label`, and `.otium-accent--kosmetik|wein|mode` to set the
  per-page accent (drives `--otm-accent`).

## Preview with the Shopify CLI

```bash
# 1. Install the CLI (once)
npm install -g @shopify/cli @shopify/theme

# 2. From the theme root, start a live preview against your dev store
shopify theme dev --store your-store.myshopify.com
# -> opens http://127.0.0.1:9292 with hot reload

# Optional checks / push
shopify theme check        # lint the theme
shopify theme push --unpublished   # upload as an unpublished theme to review
```

Baseline is committed separately ("Vendor Shopify Dawn theme v15.5.0") so the
brand layer is reviewable as a single diff against vanilla Dawn.
