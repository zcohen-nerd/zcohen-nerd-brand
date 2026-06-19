# zcohen-nerd-brand

This repo is the **shared brand package** for the zcohen-nerd ecosystem. Every property (landing page, portfolio, literacy-for-kids, connector-guide) imports this package so the header, footer, and tokens never drift across sites.

## What lives here
- `tokens/zcohen-nerd-tokens.css` — single source of truth for all design tokens (`--zc-*` prefix). Do not edit color/type/spacing values without a deliberate decision.
- `src/infima-bridge.css` — maps Docusaurus/Infima `--ifm-*` vars to `--zc-*` tokens. Consumers import this, not raw hex.
- `src/components/Navbar/` — swizzled Docusaurus Navbar; includes the **Projects ▾ dropdown** (ecosystem switcher) and ZN wordmark logo.
- `src/components/Footer/` — swizzled Docusaurus Footer; navy `#0c1a33` background, wordmark, ecosystem links, "documented in public" amber dot.
- `src/data/projects.js` — **canonical project registry** (`name, href, emoji, accent, status, blurb`). Drives the dropdown, footer ecosystem column, and the landing page grid. Adding a project = one entry here.
- `assets/` — `zcohen-nerd-logo.png` (wordmark, for light surfaces) and `zcohen-nerd-icon.png` (ZN monogram, favicon/avatar). The navy logo is invisible on dark backgrounds — use the CSS text wordmark ("zcohen" `#fff` + "-nerd" `var(--zc-cyan-500)`) for the footer instead.

## Theming system
The token file defines per-family re-skins via `data-theme` on `<html>`:
- *(no attribute)* → parent zcohen-nerd (navy `#102040` / cyan `#10b8d8`) — the landing page uses this
- `data-theme="literacy"` → green/blue
- `data-theme="connectors"` → navy/safety-orange
- `data-theme="engineering"` → navy/cyan intensified
- `data-theme="teaching"` → indigo/cyan

Each consuming site sets its family in its Docusaurus config; the shared Navbar/Footer stay identical across all of them.

## Token conventions
- All tokens are `--zc-*` prefixed — safe to layer over Docusaurus/Infima without collisions.
- Shadows are always cool/blue-tinted (`rgba(22,48,87,…)`) — never neutral gray.
- Map `--ifm-color-primary` → `--zc-color-primary`, `--ifm-color-primary-dark` → `--zc-color-primary-hover`, etc. in `infima-bridge.css`. Do not use raw hex in component files — reference tokens.
- Transitions use `--zc-ease` (`cubic-bezier(.4,0,.2,1)`) at `150ms` (fast) or `200ms` (standard).

## How to consume this package (in another repo)
```js
// docusaurus.config.js
plugins: ['@zcohen-nerd/brand'],
// or as a preset — exports Navbar + Footer swizzles automatically
```
Then in the site's `custom.css`:
```css
@import '@zcohen-nerd/brand/tokens/zcohen-nerd-tokens.css';
@import '@zcohen-nerd/brand/src/infima-bridge.css';
```

## Design reference
The full design handoff (including the finalized landing page HTML, per-component specs, and this token file) lives in `design_handoff_zcohen_nerd_landing/README.md` — check the zcohen-nerd-landing-page repo if you need it.

## Key decisions already made — don't relitigate
- System-ui font stack, no webfonts (fast, offline-friendly, matches the live Docusaurus sites)
- Emoji as project icons (not an icon font)
- Project list as data, not hardcoded markup — everything that lists projects reads from `src/data/projects.js`
