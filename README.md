# zcohen-nerd-brand

The **shared brand package** for the zcohen-nerd ecosystem. Every property
(landing page, portfolio, literacy-for-kids, connector-guide) imports this
package so the header, footer, tokens, and project list never drift across
sites.

## What's in here

| Path | Purpose |
|---|---|
| `index.js` | Docusaurus theme plugin — aliases the swizzled components over the classic theme. |
| `tokens/zcohen-nerd-tokens.css` | Single source of truth for design tokens (`--zc-*`). Don't edit values without a deliberate decision. |
| `src/infima-bridge.css` | Maps Docusaurus/Infima `--ifm-*` vars to `--zc-*` tokens. Consumers import this, not raw hex. |
| `src/components/Navbar/` | Swizzled Navbar — ZN wordmark + **Projects ▾** ecosystem switcher. |
| `src/components/Footer/` | Swizzled Footer — navy `#0c1a33`, mono wordmark, ecosystem links, "documented in public" amber dot. |
| `src/data/projects.js` | **Canonical project registry.** Drives the switcher, footer column, and landing grid. |
| `assets/` | `zcohen-nerd-logo.png` (wordmark, light surfaces) + `zcohen-nerd-icon.png` (ZN monogram, favicon/avatar). |

## How to consume this package (in another Docusaurus repo)

1. Add the dependency (npm, or `"file:../zcohen-nerd-brand"` locally):

   ```json
   "dependencies": { "@zcohen-nerd/brand": "^1.0.0" }
   ```

2. Register the theme in `docusaurus.config.js` so the shared Navbar/Footer
   render automatically:

   ```js
   themes: ['@zcohen-nerd/brand'],
   ```

3. Import the tokens + bridge at the top of `src/css/custom.css`:

   ```css
   @import '@zcohen-nerd/brand/tokens/zcohen-nerd-tokens.css';
   @import '@zcohen-nerd/brand/src/infima-bridge.css';
   ```

4. Copy the logo assets into the site's `static/img/` (the Navbar references
   `/img/zcohen-nerd-logo.png` via `useBaseUrl`).

5. Read the project list from the registry instead of hardcoding it:

   ```js
   import projects from '@zcohen-nerd/brand/src/data/projects';
   ```

## Theming system

The token file defines per-family re-skins via `data-theme` on `<html>`:

- *(no attribute)* → parent zcohen-nerd (navy `#102040` / cyan `#10b8d8`) — the landing page uses this
- `data-theme="literacy"` → green/blue
- `data-theme="connectors"` → navy/safety-orange
- `data-theme="engineering"` → navy/cyan intensified
- `data-theme="teaching"` → indigo/cyan

Each consuming site sets its family in `docusaurus.config.js`
(`themeConfig.colorMode` / a wrapper attribute); the shared Navbar/Footer stay
identical across all of them.

## Conventions — don't relitigate

- All tokens are `--zc-*` prefixed — safe to layer over Infima without collisions.
- Shadows are always cool/blue-tinted (`rgba(22,48,87,…)`), never neutral gray.
- Don't use raw hex in component files — reference tokens.
- System-ui font stack, no webfonts. Emoji as project icons (not an icon font).
- The project list is **data, not markup** — everything that lists projects reads from `src/data/projects.js`.

## Design reference

The full design handoff (finalized landing page HTML, per-component specs, and
the token file) lives in `design_handoff_zcohen_nerd_landing/README.md`.
