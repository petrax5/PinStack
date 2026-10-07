# Pinstack Design: one-page studio site

A complete static website for **Pinstack Design**, a one-person web design studio
in Orange County, California, run by Jesus Verduzco. Brand tokens, copy, and voice
follow `../brand/tokens.md` and `../brand-board.html`.

## Files

```
site/
├── index.html        # Page structure and all copy (single page, semantic HTML)
├── styles.css        # All styling: brand tokens, type scale, layouts, motion
├── script.js         # Progressive enhancement only: scroll reveal, mobile menu
├── assets/
│   ├── logo.svg          # Full lockup, for light backgrounds (nav)
│   ├── logo-reversed.svg # Cream lockup, for dark backgrounds (footer)
│   ├── logo-mark.svg     # Pin mark alone (favicon, trust items)
│   ├── hero-storefront.jpg # Hero photo, 1920x1280, generated
│   └── craft-desk.jpg      # About section photo, 1920x1280, generated
└── README.md         # This file
```

## How it works

- **No build step, no JavaScript libraries.** Only Google Fonts is loaded
  externally (Fraunces + Karla, per the brand).
- **Works with JavaScript disabled.** `script.js` only enhances: nav anchors,
  the mobile menu (native `<details>`), all copy, and the mailto links work
  without it. The scroll-reveal hides content only when the `js` class is
  present, which is added by the script itself.
- **Motion:** reveal-on-scroll (220ms ease-out), hover micro-interactions,
  CSS smooth anchor scrolling, mobile menu open/close. Everything collapses
  to static under `prefers-reduced-motion: reduce`.
- **Accessibility:** skip link, semantic landmarks, visible focus rings,
  44px+ tap targets, keyboard-operable mobile menu (native `<details>` +
  Escape-to-close), AA contrast (body copy is Ink/Bark on Paper; Clay is
  used only for large type, buttons, and graphics per the token rules).

## Copy rules enforced

- Voice is first person ("I"), never "we".
- **No em-dashes anywhere** (house rule).
- The only case study is the real one: Oasis Detailing Supplies, Orange, CA,
  $800, live at https://oasisdetailingsupplies.com. No invented clients,
  testimonials, reviews, or stats.
- Contact email is `hello@pinstack.design`.

## Deploy

Any static host works. Examples:

**Option A: drag and drop (Netlify, Cloudflare Pages, Vercel, GitHub Pages)**

1. Upload the contents of `site/` (not the `site` folder itself) so
   `index.html` is at the root.
2. Done. There is nothing to build.

**Option B: Netlify CLI**

```bash
cd site
npx netlify-cli deploy --prod --dir .
```

**Option C: GitHub Pages**

Push the `site/` contents to the repo root (or a `docs/` folder, then select it
under Settings > Pages).

## New pages checklist

When adding a page to this site:

- Link the shared `styles.css` (cache-busted as `styles.css?v=N` — bump `N`
  every time the stylesheet changes so returning visitors get the new CSS).
- Copy the `<head>` pre-paint theme script so dark mode doesn't flash on load.
- Copy the header/footer block so the nav, theme toggle, and mobile menu
  stay identical on every page.
- **Rubber banding:** `styles.css` sets `overscroll-behavior-y: none` on
  `html`, which kills the overscroll bounce at the top and bottom of the
  page. Every page using this stylesheet gets it automatically — if a page
  ever stops using `styles.css`, re-add that rule to its own CSS.
  The footer also carries `box-shadow: 0 50vh 0 50vh var(--band)` so any
  bounce the browser still allows at the bottom reveals the footer color,
  not the page background. Keep that shadow on `.site-footer`.

## Local preview

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```
