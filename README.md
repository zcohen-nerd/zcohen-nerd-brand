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
| `src/components/Navbar/` | Swizzled Navbar — ZN wordmark + **Projects ▾** ecosystem switcher + docs sidebar toggle. Project-aware via `customFields.brand`. |
| `src/components/Footer/` | Swizzled Footer — navy `#0c1a33`, mono wordmark, ecosystem links, "documented in public" amber dot. |
| `src/data/projects.js` | **Canonical project registry.** Drives the switcher, footer column, and landing grid. |
| `src/data/defaultBrand.js` | Shared `DEFAULT_BRAND` fallback object. Imported by Navbar and Footer; consumer sites override via `customFields.brand`. |
| `assets/` | `zcohen-nerd-logo.png` (wordmark, light surfaces) + `zcohen-nerd-icon.png` (ZN monogram, favicon/avatar). |

---

## How to consume (Docusaurus site)

### 1. Install

```bash
npm install @zcohen-nerd/brand
```

**Local workspace (before publication):** install via file path instead:
```json
"dependencies": { "@zcohen-nerd/brand": "file:../../brand/zcohen-nerd-brand" }
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

## Docs sidebar toggle (project/docs sites)

On docs pages the brand Navbar renders a sidebar toggle button **left of the logo** at mobile width. It opens and closes Docusaurus's standard docs navigation sidebar. The brand hamburger (right side) still opens the project drawer — these two are independent.

### How it works

The toggle uses `useNavbarMobileSidebar()` from `@docusaurus/theme-common/internal`. The context is provided by `NavbarProvider` inside `@theme/Layout/Provider`, which is above the Navbar in the React tree, so the hook is always safe to call.

Key properties returned by the hook:

| Property | Meaning |
|---|---|
| `disabled` | `true` when there is no sidebar content (hub/landing pages, non-docs routes). The toggle button is not rendered when `disabled` is `true`. |
| `shown` | `true` when the sidebar panel is currently open. |
| `toggle` | Callback to open/close the sidebar. |

The sidebar panel itself is `<NavbarMobileSidebar />` from `@theme/Navbar/MobileSidebar`, rendered at the end of `<header>`. The parent `<header>` receives the `navbar-sidebar--show` class when `shown` is `true`, which activates the classic theme's sidebar transition CSS.

### Minimum `docusaurus.config.ts` for a docs site

No Navbar or Footer config in `themeConfig` is needed or desired — the brand package provides both. Omitting them is intentional:

```ts
// docusaurus.config.ts
themes: ['@zcohen-nerd/brand'],

customFields: {
  brand: {
    isHub: false,
    projectBadge: 'A zcohen-nerd technical guide',
    projectUrl: 'https://example.github.io/my-guide/',
    // ... see full schema below
  },
},

themeConfig: {
  // DO NOT add themeConfig.navbar or themeConfig.footer — they are unused.
  // DO NOT add themeConfig.navbar.items — the brand Navbar ignores them.
  colorMode: { respectPrefersColorScheme: true },
},
```

### Current-project highlighting

The `projectUrl` field in `customFields.brand` marks the current site as active in the Projects ▾ dropdown and the mobile drawer. When a project's registry `href` matches `brand.projectUrl`, the link receives `aria-current="page"` and is visually highlighted (cyan, semibold).

**The match is exact string equality.** Your `projectUrl` must match the `href` in `src/data/projects.js` exactly, including the trailing slash.

### Limitations

- The sidebar toggle is hidden on desktop (`display: none` in CSS). On desktop, users access the sidebar via the left sidebar panel provided by the docs preset — not via a toggle button.
- The brand Navbar does not use `themeConfig.navbar.items`, so Docusaurus-standard navbar items (search bar, external links, dropdowns) are not supported. Use `customFields.brand.navLinks` for hub nav links, or accept the project badge for docs sites.
- Both the brand drawer and the Docusaurus sidebar can be open simultaneously. They are independent React state. This is accepted behavior.

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

---

## Publishing (maintainers only)

> **This section is for package maintainers, not consumers.**

The package is scoped to `@zcohen-nerd`. Publication requires an npm account with access to that scope.

**Dry-run inspection (no publish):**
```bash
npm run pack:dry
# or
npm pack --dry-run
```

**Local tarball (no publish — for local install testing):**
```bash
npm pack
# Creates zcohen-nerd-brand-1.0.0.tgz
# Install into a consumer with: npm install /path/to/zcohen-nerd-brand-1.0.0.tgz
# Delete the .tgz file when done — it is .gitignored
```

**Publish (when ready):**
```bash
npm publish --access public
```

`--access public` is required because the package is scoped (`@zcohen-nerd/brand`) and scoped packages default to private.

**Before publishing:**
1. Confirm the npm scope `@zcohen-nerd` exists and you are logged in (`npm whoami`).
2. Bump the version in `package.json` if this is not the initial release (`npm version patch|minor|major`).
3. Run `npm run pack:dry` and verify the file list is correct.
4. Tag the release commit in git.
