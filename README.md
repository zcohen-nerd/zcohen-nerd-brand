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
| `src/components/Navbar/` | Swizzled Navbar — ZN wordmark + **Projects ▾** ecosystem switcher. Project-aware via `customFields.brand`. |
| `src/components/Footer/` | Swizzled Footer — navy `#0c1a33`, mono wordmark, ecosystem links, "documented in public" amber dot. |
| `src/data/projects.js` | **Canonical project registry.** Drives the switcher, footer column, and landing grid. |
| `assets/` | `zcohen-nerd-logo.png` (wordmark, light surfaces) + `zcohen-nerd-icon.png` (ZN monogram, favicon/avatar). |

---

## How to consume (Docusaurus site)

### 1. Add the dependency

Local workspace (until the package is published):
```json
"dependencies": { "@zcohen-nerd/brand": "file:../../brand/zcohen-nerd-brand" }
```

Once published:
```json
"dependencies": { "@zcohen-nerd/brand": "^1.0.0" }
```

### 2. Register the theme plugin

In `docusaurus.config.ts`:
```ts
themes: ['@zcohen-nerd/brand'],
```

This replaces `@theme/Navbar` and `@theme/Footer` with the shared brand components.

### 3. Import the tokens + bridge

At the top of `src/css/custom.css`:
```css
@import '@zcohen-nerd/brand/tokens/zcohen-nerd-tokens.css';
@import '@zcohen-nerd/brand/src/infima-bridge.css';
```

If the package is not yet installed (e.g., standalone CI build), copy both files
locally into `src/css/` and import them as relative paths:
```css
@import './zcohen-nerd-tokens.css';
@import './infima-bridge.css';
```
Add a `SOURCE:` comment to each copied file noting the upstream path so they can
be synced when the token file changes.

### 4. Copy the logo asset

The Navbar renders the ZN wordmark from `static/img/zcohen-nerd-logo.png`. Copy
`assets/zcohen-nerd-logo.png` from this package into the consuming site's
`static/img/` directory:

```
cp node_modules/@zcohen-nerd/brand/assets/zcohen-nerd-logo.png static/img/
```

### 5. Configure `customFields.brand`

In `docusaurus.config.ts`, add a `customFields.brand` block. This is how the
Navbar and Footer know which site they are on. See the schema and examples below.

---

## `customFields.brand` schema

```ts
type BrandConfig = {
  /** Display name for the site or project. */
  projectName: string;

  /** Token-file family key: 'hub' | 'technical-guide' | 'literacy' | 'engineering' | 'teaching' */
  projectFamily: string;

  /** Short badge text rendered in the Navbar in project mode. */
  projectBadge: string;

  /** Absolute URL of the zcohen-nerd hub. Used for the logo link on all sites. */
  hubUrl: string;

  /** Absolute URL of this site's root. Used for "current project" detection. */
  projectUrl: string;

  /** Absolute URL of the GitHub repo for this site. */
  repoUrl: string;

  /** Plain-text attribution shown in the Footer brand column.
      Hub: the hub tagline. Projects: author + license note. */
  attribution: string;

  /** true = hub mode (show navLinks); false = project mode (show projectBadge). */
  isHub: boolean;

  /** Nav links rendered in the Navbar when isHub: true. */
  navLinks: Array<{ label: string; href: string }>;

  /** Links rendered in the Footer Connect column. No RSS unless the site has a blog. */
  connectLinks: Array<{ label: string; href: string }>;
};
```

If `customFields.brand` is absent or partially set, the components fall back
to hub-style defaults (equivalent to the hub site config below).

---

## Example configs

### Hub site (`zcohen-nerd.github.io`)

```ts
// docusaurus.config.ts
customFields: {
  brand: {
    projectName: 'zcohen-nerd',
    projectFamily: 'hub',
    projectBadge: 'zcohen-nerd',
    hubUrl: 'https://zcohen-nerd.github.io/',
    projectUrl: 'https://zcohen-nerd.github.io/',
    repoUrl: 'https://github.com/zcohen-nerd',
    attribution: 'Practical engineering, systems thinking, and modern literacy — documented in public.',
    isHub: true,
    navLinks: [
      { label: 'Work', href: '#' },
      { label: 'Writing', href: '#' },
      { label: 'About', href: '#' },
    ],
    connectLinks: [
      { label: 'GitHub', href: 'https://github.com/zcohen-nerd' },
      { label: 'Email', href: 'mailto:hello@zcohen-nerd.com' },
    ],
  },
},
```

### Professional Connector Guide

```ts
// docusaurus.config.ts
customFields: {
  brand: {
    projectName: 'Professional Connector Guide',
    projectFamily: 'technical-guide',
    projectBadge: 'A zcohen-nerd technical guide',
    hubUrl: 'https://zcohen-nerd.github.io/',
    projectUrl: 'https://zcohen-nerd.github.io/connector-engineering-field-guide/',
    repoUrl: 'https://github.com/zcohen-nerd/connector-engineering-field-guide',
    attribution: 'A zcohen-nerd technical guide by Zac Cohen. Licensed CC BY 4.0.',
    isHub: false,
    navLinks: [],
    connectLinks: [
      { label: 'GitHub', href: 'https://github.com/zcohen-nerd/connector-engineering-field-guide' },
    ],
  },
},
```

### Literacy for Kids (education project)

```ts
// docusaurus.config.ts
customFields: {
  brand: {
    projectName: 'Literacy for Kids',
    projectFamily: 'literacy',
    projectBadge: 'A zcohen-nerd education project',
    hubUrl: 'https://zcohen-nerd.github.io/',
    projectUrl: 'https://literacy-for-kids.github.io/literacy_for_kids/',
    repoUrl: 'https://github.com/literacy-for-kids/literacy_for_kids',
    attribution: 'A zcohen-nerd education project. Free and open for educators.',
    isHub: false,
    navLinks: [],
    connectLinks: [
      { label: 'GitHub', href: 'https://github.com/literacy-for-kids' },
    ],
  },
},
```

---

## Link strategy

| Scenario | Correct element | Reason |
|---|---|---|
| Within-site navigation (docs pages, guide sections) | `<Link to="/path">` | Docusaurus handles baseUrl — correct |
| Hub link (from any site) | `<a href="https://zcohen-nerd.github.io/">` | Absolute — baseUrl irrelevant |
| Sibling project link | `<a href="https://...absolute...">` | Cross-site — must be absolute |
| GitHub / email | `<a href="https://...">` | External — always absolute |

**Never use `<Link to="/path">` for links that cross site boundaries.** Docusaurus
prepends `siteConfig.baseUrl` to the `to` prop. On a subpath site like
`/connector-engineering-field-guide/`, `<Link to="/portfolio">` resolves to
`/connector-engineering-field-guide/portfolio` (a 404), not the hub.

---

## Theming system

The token file defines per-family re-skins via `data-theme` on `<html>`:

- *(no attribute)* → parent zcohen-nerd (navy `#102040` / cyan `#10b8d8`)
- `data-theme="literacy"` → green/blue
- `data-theme="connectors"` → navy/safety-orange
- `data-theme="engineering"` → navy/cyan intensified
- `data-theme="teaching"` → indigo/cyan

Without a Root swizzle, consumers apply the family overrides directly in `:root`
of their `custom.css` (the connector guide uses this approach). A future Phase 3
improvement may add a Root swizzle that reads `customFields.brand.projectFamily`
and sets `data-theme` automatically.

---

## Conventions — don't relitigate

- All tokens are `--zc-*` prefixed — safe to layer over Infima without collisions.
- Shadows are always cool/blue-tinted (`rgba(22,48,87,…)`), never neutral gray.
- Don't use raw hex in component files — reference tokens.
- System-ui font stack, no webfonts. Emoji as project icons (not an icon font).
- The project list is **data, not markup** — everything that lists projects reads from `src/data/projects.js`.
- Project registry `href` values are **absolute URLs** — never relative paths.
- Cross-site links use plain `<a href>` — never Docusaurus `Link`.

---

## Design reference

The full design handoff (finalized landing page HTML, per-component specs, and
the token file) lives in `design_handoff_zcohen_nerd_landing/README.md`.
