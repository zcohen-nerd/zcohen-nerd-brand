# zcohen-nerd Brand Package Audit

**Date:** 2026-06-19
**Audited repo:** `brand/zcohen-nerd-brand`
**Scope:** Shared Navbar, Footer, project registry, CSS tokens, and config strategy for multi-site Docusaurus deployment

---

## Executive Summary

The brand package has solid foundations: a clean token system, a well-structured Infima bridge, and a functional Docusaurus theme plugin. The visual design (Navbar, Footer, CSS) is production-quality for the hub.

**It is not yet safely consumable by subpath Docusaurus sites.**

The two concrete blockers are:

1. **Relative project registry URLs.** All three project `href` values (`/portfolio`, `/literacy`, `/connectors`) are relative paths. Docusaurus's `Link` component prepends `siteConfig.baseUrl` to them. On the connector guide (baseUrl = `/connector-engineering-field-guide/`), `Link to="/connectors"` resolves to `https://zcohen-nerd.github.io/connector-engineering-field-guide/connectors` — a 404. Cross-site links must be absolute.

2. **Hub-only static content.** `NAV_LINKS` hardcodes `Work`, `Writing`, and `About` pointing at `#`. `CONNECT_LINKS` hardcodes `/blog/rss.xml`. Both are hub-page-only content; they cannot appear on the connector guide or a Literacy for Kids site without being wrong or broken.

Neither of these blockers is a major refactor. Phase 1 (absolute URLs in the registry) can be done in one file. Phase 2 (configurable nav content) requires adding a config-reading pattern.

---

## Package Structure

| Property | Value |
|---|---|
| Package name | `@zcohen-nerd/brand` |
| Version | `1.0.0` |
| Package type | CommonJS (`"main": "index.js"`) |
| Build system | None — raw source, no bundler, no compile step |
| Framework | Docusaurus 3 (peer dependency `@docusaurus/core >= 3.0.0`) |
| Framework assumption | Assumes consumer is a Docusaurus site |
| React peer dep | `>= 18.0.0` |
| TypeScript | None |
| Published | No — consumed via workspace `file:` path locally |

**Exported components:**
- `@theme/Navbar` → `src/components/Navbar/index.js` (via `getThemePath()`)
- `@theme/Footer` → `src/components/Footer/index.js` (via `getThemePath()`)

**Exported CSS:**
- `@zcohen-nerd/brand/tokens/zcohen-nerd-tokens.css`
- `@zcohen-nerd/brand/src/infima-bridge.css`

**Exported data:**
- `@zcohen-nerd/brand/src/data/projects` → `src/data/projects.js`

**Assets:**
- `assets/zcohen-nerd-logo.png` (wordmark, for light backgrounds)
- `assets/zcohen-nerd-icon.png` (ZN monogram)

**Plugin mechanism:** `index.js` exports a Docusaurus theme plugin function. Consumers register it via `themes: ['@zcohen-nerd/brand']` in their config. This causes Docusaurus to resolve `@theme/Navbar` and `@theme/Footer` through the package's `src/components/` directory, overriding the defaults from `@docusaurus/preset-classic`.

**No build/test commands** are defined in `package.json`. No scripts entry at all.

---

## Navbar Audit

**File:** `src/components/Navbar/index.js`

### Current content

```js
const NAV_LINKS = [
  {label: 'Work', href: '#'},
  {label: 'Writing', href: '#'},
  {label: 'About', href: '#'},
];
```

The Navbar renders:
- Left: `zcohen-nerd-logo.png` via `useBaseUrl('/img/zcohen-nerd-logo.png')`, wrapped in `Link to="/"`
- Center/right nav: `Work #`, `Writing #`, `About #` as plain `<a>` tags
- `Projects ▾` pill opening a dropdown of all entries from `projects.js` via `Link to={p.href}`
- Mobile hamburger → drawer with same links

### Specific problems

| Problem | Location | Impact on subpath sites |
|---|---|---|
| `NAV_LINKS` are hub-only (`Work`, `Writing`, `About`) with `#` hrefs | Line 16–20 | Appears on every consumer site; labels and `#` are wrong for project sites |
| `Link to="/"` for logo | Line 85 | On connector guide: resolves to `/connector-engineering-field-guide/`, not the hub. The logo clicks back to the connector guide home, not `zcohen-nerd.github.io`. |
| `useBaseUrl('/img/zcohen-nerd-logo.png')` | Line 81 | Resolves to consumer's `<baseUrl>/img/zcohen-nerd-logo.png`. Consumer must copy the logo asset manually into `static/img/`. Not documented in README. |
| `Link to={p.href}` in dropdown (where `p.href` = `/portfolio`, `/literacy`, `/connectors`) | Lines 63, 132 | Docusaurus prepends baseUrl. On connector guide: `/portfolio` → `/connector-engineering-field-guide/portfolio` (404). |
| No props accepted | Function signature | Cannot configure which links to show, what the logo links to, or project identity |
| No `useDocusaurusContext()` call | Entire component | Cannot read `siteConfig.customFields` for project configuration |
| No current-site indicator in dropdown | ProjectSwitcher | No visual distinction between "you are here" and other projects |

### Why it didn't fit the connector guide

The Navbar cannot distinguish hub mode from project mode. It always renders hub links with `#` hrefs and resolves all project links relative to the current site's `baseUrl`. There is no mechanism to inject project context (name, family, hub URL) without modifying the shared component.

### What needs to change

1. Replace `Link to={p.href}` with `<a href={p.href}>` for all cross-site project links (after URLs become absolute)
2. Replace `Link to="/"` logo link with `<a href={hubUrl}>` (absolute, from config)
3. Make `NAV_LINKS` configurable or mode-aware (hub mode vs project mode)
4. Read project context from `useDocusaurusContext().siteConfig.customFields.brand`
5. Add project badge rendering (`A zcohen-nerd technical guide`) as optional element
6. Remove or make optional the hub-specific `Work`/`Writing`/`About` links for project sites

---

## Footer Audit

**File:** `src/components/Footer/index.js`

### Current content

```js
const CONNECT_LINKS = [
  {label: 'GitHub', href: 'https://github.com/zcohen-nerd'},
  {label: 'Email', href: 'mailto:hello@zcohen-nerd.com'},
  {label: 'RSS', href: '/blog/rss.xml'},
];
```

The Footer renders:
- Brand column: mono text wordmark (`zcohen-nerd`) + hub tagline
- Ecosystem column: all entries from `projects.js` via `Link to={p.href}`
- Connect column: `CONNECT_LINKS` hardcoded (GitHub, Email, RSS)
- Bottom bar: `© 2026 zcohen-nerd` (hardcoded year and owner) + amber signal dot

### Specific problems

| Problem | Location | Impact on subpath sites |
|---|---|---|
| `Link to={p.href}` for all project links (relative paths) | Line 41 | Same as Navbar: all ecosystem links resolve under consumer's `baseUrl` (broken on connector guide) |
| `/blog/rss.xml` in CONNECT_LINKS | Line 18 | Plain `<a href>` (not Link), so resolves from domain root — but connector guide has no blog; the link 404s |
| Hardcoded hub tagline ("Practical engineering, systems thinking…") | Line 32–34 | Hub-specific copy visible on every consumer site |
| Hardcoded copyright "© 2026 zcohen-nerd" | Line 62 | Not appropriate as-is for project sites where authorship may differ |
| CONNECT_LINKS not configurable | Lines 15–19 | Hardcoded GitHub org, email, RSS — wrong org/path for external sites (e.g., literacy-for-kids.github.io) |
| No props accepted | Function signature | Cannot configure project-specific attribution, copyright, or link columns |
| No `useDocusaurusContext()` call | Entire component | Cannot read customFields |

### Why it didn't fit the connector guide

The connector guide has no blog (no RSS), a different author attribution (`Zac Cohen` not just `zcohen-nerd`), and all ecosystem cross-links break under its `baseUrl`. The footer tagline is the hub's hub-specific description, not the connector guide's.

### What needs to change

1. Replace `Link to={p.href}` with `<a href={p.href}>` for all ecosystem links (after URLs become absolute)
2. Remove `/blog/rss.xml` from `CONNECT_LINKS` or make it configurable/optional per site
3. Make hub tagline configurable (or conditional on project mode)
4. Make copyright line accept a project-specific attribution string
5. Read project context from `customFields.brand`
6. Add optional "project attribution" line (e.g., `A zcohen-nerd technical guide by Zac Cohen. Licensed CC BY 4.0.`)

---

## Project Registry Audit

**File:** `src/data/projects.js`

### Current entries

| Name | href | Status | Notes |
|---|---|---|---|
| Portfolio | `/portfolio` | Live | Relative path — hub-only |
| Literacy for Kids | `/literacy` | Live | Relative path — does not point to `literacy-for-kids.github.io` |
| Connector Guide | `/connectors` | In progress | Relative path — does not match actual URL `/connector-engineering-field-guide/` |

### Critical problems

**All three `href` values are relative paths.** These work on the hub (baseUrl `/`) because Docusaurus `Link to="/portfolio"` → `https://zcohen-nerd.github.io/portfolio`. They break on every non-hub consumer site.

**The Connector Guide URL is wrong.** The actual deployed URL of the connector guide is `https://zcohen-nerd.github.io/connector-engineering-field-guide/`, not `https://zcohen-nerd.github.io/connectors`.

**Literacy for Kids is likely at a different domain.** If it lives at `https://literacy-for-kids.github.io/literacy_for_kids/`, this is a different GitHub org and `Link to="/literacy"` can never resolve correctly regardless of baseUrl.

**No project type/family field.** There is no `type`, `family`, or `orgId` field. Cannot distinguish hub projects from external-org projects, or indicate which site the consumer is on.

**No absolute URL field.** No `absoluteHref` or `externalUrl` distinction from the relative `href`.

### What the registry schema should eventually look like

```js
{
  name: 'Connector Guide',
  href: 'https://zcohen-nerd.github.io/connector-engineering-field-guide/',  // absolute
  family: 'technical-guide',
  org: 'zcohen-nerd',
  emoji: '🔌',
  blurb: 'A field guide for professional electrical connectors.',
  status: STATUS_IN_PROGRESS,
  accent: '#c2410c',
  accentTint: 'rgba(194,65,12,.1)',
  accentSoft: '#e9b894',
  enterColor: '#b8460a',
}
```

Key changes:
- `href` → absolute URL for all cross-site links
- Add `family` (matches the `data-theme` values: `technical-guide`, `literacy`, `engineering`, `teaching`)
- Add `org` (e.g., `zcohen-nerd` vs `literacy-for-kids`) — needed to identify links to external orgs
- Remove `accentTint`/`accentSoft`/`enterColor` from nav/footer usage (they are card-grid display values only, not needed for the dropdown or footer column)

---

## Base URL and Link Strategy

### The core problem

Docusaurus's `Link` component resolves paths relative to the current site's `baseUrl`. This is by design for within-site navigation. For cross-site navigation (hub → project, project → hub, project → sibling), `Link` is the wrong tool.

| Scenario | Correct tool | Rationale |
|---|---|---|
| Within the current site (e.g., connector guide page → connector guide page) | `Link to="/04-connector-selection-workflow"` | Let Docusaurus handle baseUrl — correct behavior |
| Link back to hub (`zcohen-nerd.github.io/`) | `<a href="https://zcohen-nerd.github.io/">` | Absolute URL; baseUrl irrelevant |
| Link to sibling project (`/connector-engineering-field-guide/`) | `<a href="https://zcohen-nerd.github.io/connector-engineering-field-guide/">` | Absolute URL; avoids baseUrl resolution |
| Link to GitHub repo | `<a href="https://github.com/...">` | External, always absolute |
| Link to Literacy for Kids (different org) | `<a href="https://literacy-for-kids.github.io/...">` | External domain; must be absolute |
| Logo link on project site | `<a href="https://zcohen-nerd.github.io/">` | Should navigate to hub, not current site root |

### `useBaseUrl()` usage

- `useBaseUrl('/img/zcohen-nerd-logo.png')` in Navbar is **correct** for resolving a static asset that the consumer has placed in `static/img/`. This is a within-site asset path.
- `useBaseUrl()` must never be used for cross-site links.

### Recommended pattern for the project registry

**After the fix:** every `href` in `projects.js` should be an absolute HTTPS URL. Component code replaces `Link to={p.href}` with `<a href={p.href} target="_self">` (or `target="_blank"` for external sites). No `useBaseUrl()` needed.

**Do NOT use:**
- `useBaseUrl()` for cross-site URLs
- `Link to={relativeProjectPath}` in Navbar or Footer
- Environment variables (introduces CI/CD complexity)

---

## Recommended Configuration Strategy

### Problem

Currently, Navbar and Footer are 100% static. To support project sites, they need to know: what is this site? what is the hub URL? what attribution should appear?

### Options evaluated

| Option | Pros | Cons |
|---|---|---|
| Component props | Clean React pattern | Docusaurus swizzle doesn't pass props easily to `@theme/Navbar`/`@theme/Footer` from the outside |
| `docusaurus.config.ts` `customFields.brand` | Standard Docusaurus pattern; readable in any component via `useDocusaurusContext()` | Slightly verbose config; requires discipline across all consumers |
| Separate local config file per project | Flexible | Another file to maintain; not a Docusaurus convention |
| Environment variables | CI-friendly | Not appropriate for static site metadata |
| Central project registry import | Already partially exists | Registry knows projects but not "which project am I" |
| Combination: customFields + registry | Best of both | Slightly more setup, but clean and flexible |

### Recommendation: `customFields.brand` read via `useDocusaurusContext()`

In each consuming site's `docusaurus.config.ts`:

```ts
customFields: {
  brand: {
    projectName: 'Professional Connector Guide',
    projectFamily: 'technical-guide',
    projectBadge: 'A zcohen-nerd technical guide',
    hubUrl: 'https://zcohen-nerd.github.io/',
    projectUrl: 'https://zcohen-nerd.github.io/connector-engineering-field-guide/',
    repoUrl: 'https://github.com/zcohen-nerd/connector-engineering-field-guide',
    attribution: 'A <a href="https://zcohen-nerd.github.io/">zcohen-nerd</a> technical guide by Zac Cohen. Licensed <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.',
    isHub: false,
  },
},
```

In Navbar and Footer components:

```js
import {useDocusaurusContext} from '@docusaurus/core';

export default function Navbar() {
  const {siteConfig} = useDocusaurusContext();
  const brand = siteConfig.customFields?.brand ?? {};
  const hubUrl = brand.hubUrl ?? 'https://zcohen-nerd.github.io/';
  const isHub = brand.isHub ?? false;
  // ...
}
```

**The hub site** sets `isHub: true` and shows `Work`/`Writing`/`About` links. Project sites set `isHub: false` and show the project badge instead.

**Fallback defaults** ensure nothing breaks if a consumer doesn't set `customFields.brand` — the component falls back to hub behavior.

---

## CSS and Token Audit

**Files:** `tokens/zcohen-nerd-tokens.css`, `src/infima-bridge.css`

### Token file assessment

| Criterion | Status |
|---|---|
| Framework-agnostic (pure CSS custom properties) | ✓ |
| Safe to import on any HTML page | ✓ |
| No Docusaurus-specific syntax | ✓ |
| No baseUrl-relative references | ✓ |
| Project family themes present | ✓ (`literacy`, `connectors`, `engineering`, `teaching`) |
| Connectors theme | ✓ (instrument navy + safety orange) |
| Education/literacy theme | ✓ (`data-theme="literacy"` — green/blue) |
| Teaching theme | ✓ (`data-theme="teaching"` — indigo/cyan) |
| Engineering theme | ✓ (`data-theme="engineering"` — navy/cyan intensified) |
| Parent hub theme (no attribute) | ✓ (navy-700 / cyan-500) |
| Accessibility: reduced motion | ✓ |
| `--zc-*` prefix isolation | ✓ — no collisions with `--ifm-*` |

**Observation:** The token file activates family themes via `data-theme` attribute on an ancestor element. However, current consumers (including the connector guide) apply the family overrides directly in `:root` because they cannot set `data-theme` on `<html>` without swizzling `Root`. This is a known constraint noted in the connector guide's `custom.css`.

### Infima bridge assessment

| Criterion | Status |
|---|---|
| Docusaurus-specific (`--ifm-*` vars) | Yes — intentionally so |
| Uses raw hex | No — all values reference `--zc-*` tokens |
| Works correctly when family token overrides are in `:root` | ✓ — it reads whatever `--zc-color-primary` resolves to |
| Requires `data-theme` on `<html>` | No — the bridge is agnostic; the tokens provide the values |

### CSS consumption recommendation

| Method | Verdict | Reason |
|---|---|---|
| `npm install @zcohen-nerd/brand` (workspace file:) | ✓ for local dev | Works, but fails in CI if repo is cloned standalone (as discovered with connector guide) |
| Copied local files | ✓ for standalone CI | What the connector guide now does; requires sync discipline when upstream changes |
| Published npm package | ✓ best long-term | Solves CI problem cleanly; enables version pinning |
| Workspace `file:` + npm pack | ✓ alternative | `npm pack` produces a tarball that can be committed or distributed |
| CDN | ✗ | No existing CDN; overkill for current scale |

**Current state of connector guide:** Copies token file and infima-bridge locally (`src/css/zcohen-nerd-tokens.css`, `src/css/infima-bridge.css`). This works but diverges from the canonical source when the brand package is updated. Acceptable for now; revisit when the package is published or the Navbar/Footer are reintegrated.

---

## Connector Guide Integration Plan

### Current state

The connector guide is on `docusaurus-migration` branch, not yet merged. It:
- Has NO `@zcohen-nerd/brand` dependency
- Has local copies of `zcohen-nerd-tokens.css` and `infima-bridge.css` in `src/css/`
- Uses Docusaurus native Navbar and Footer (configured via `themeConfig`)
- Builds cleanly, zero errors

### Required changes in `zcohen-nerd-brand` before connector guide can consume it

1. **`src/data/projects.js`** — Change all `href` values to absolute URLs (1 file, 3 lines)
2. **`src/components/Footer/index.js`** — Replace `Link to={p.href}` with `<a href={p.href}>` for ecosystem links; make Connect column and copyright configurable via `customFields.brand`
3. **`src/components/Navbar/index.js`** — Replace `Link to={p.href}` with `<a href={p.href}>` for project switcher; make `NAV_LINKS` config-aware (hub mode vs project mode); fix logo link to use hub URL from config
4. Both Navbar and Footer — add `useDocusaurusContext()` call to read `customFields.brand`

### Required changes in `connector-engineering-field-guide` after brand changes

1. **`package.json`** — Add `@zcohen-nerd/brand` dependency (file: for local dev, published package for CI eventually)
2. **`docusaurus.config.ts`** — Add `customFields.brand` block; add `themes: ['@zcohen-nerd/brand']` to enable shared Navbar/Footer
3. **`src/css/custom.css`** — Restore imports from `@zcohen-nerd/brand/tokens/...` instead of local copies (once CI dependency is solved)
4. **`src/css/`** — Delete local copies `zcohen-nerd-tokens.css` and `infima-bridge.css` once package import works in CI
5. **`static/img/`** — Add `zcohen-nerd-logo.png` for Navbar logo rendering
6. **`themeConfig.navbar`** and **`themeConfig.footer`** — Remove (overridden by brand plugin)

### File changes summary

| File | Change type | Direction |
|---|---|---|
| `brand/src/data/projects.js` | Edit — absolute URLs | In brand package |
| `brand/src/components/Navbar/index.js` | Edit — config-aware, fix links | In brand package |
| `brand/src/components/Footer/index.js` | Edit — config-aware, fix links | In brand package |
| `connector-guide/package.json` | Add brand dependency | In guide |
| `connector-guide/docusaurus.config.ts` | Add customFields.brand + themes | In guide |
| `connector-guide/src/css/custom.css` | Restore package imports | In guide |
| `connector-guide/src/css/zcohen-nerd-tokens.css` | Delete (now from package) | In guide |
| `connector-guide/src/css/infima-bridge.css` | Delete (now from package) | In guide |
| `connector-guide/static/img/zcohen-nerd-logo.png` | Add (Navbar needs this) | In guide |

### Risks specific to this integration

| Risk | Mitigation |
|---|---|
| CI breaks when brand is `file:` dependency | Publish package or use `npm pack` tarball |
| Logo asset missing → 404 on logo | Explicitly document that consumers must copy `assets/zcohen-nerd-logo.png` to `static/img/` |
| Removing native Navbar breaks sidebar toggle (mobile) | The brand Navbar has its own mobile drawer but no sidebar toggle integration — test thoroughly |
| `themeConfig.navbar` items (like the sidebar toggle link) disappear | Sidebar is controlled by Docusaurus's Layout, not the Navbar; verify mobile sidebar still works |
| Brand Footer replaces custom attribution | Brand Footer must accept project attribution via customFields |

### Validation commands (after changes)

```bash
# In connector guide:
npm install
npm run build     # must pass with zero errors
npm run start     # verify Navbar renders project badge, not Work/Writing/About
                  # verify Footer ecosystem links navigate to correct absolute URLs
                  # verify logo clicks to hub, not connector guide home
```

---

## Recommended Implementation Phases

### Phase 1 — Make Links BaseUrl-Safe

**Scope:** `src/data/projects.js` only (1 file, ~3 line changes)

**Changes:**
- Change all three `href` values to absolute URLs:
  - `Portfolio`: `https://zcohen-nerd.github.io/portfolio` (or whatever the real URL is)
  - `Literacy for Kids`: `https://literacy-for-kids.github.io/literacy_for_kids/` (verify real URL)
  - `Connector Guide`: `https://zcohen-nerd.github.io/connector-engineering-field-guide/`
- In both `Navbar/index.js` and `Footer/index.js`, replace `Link to={p.href}` with `<a href={p.href}>`
- Replace `Link to="/"` on the Navbar logo with a hardcoded hub URL (`<a href="https://zcohen-nerd.github.io/">`)

**Effect:** The hub's Navbar/Footer continue to work. Any future consumer can now safely import the brand package without ecosystem links breaking.

**Risk:** Low. These are navigation links; change is cosmetic (no `activeClassName` from Link, but that's fine for cross-site links).

**Dependency:** None. Can be done now.

---

### Phase 2 — Add Project-Aware Configuration

**Scope:** `Navbar/index.js`, `Footer/index.js`, documentation

**Changes:**
- Add `useDocusaurusContext()` to both components
- Read `siteConfig.customFields?.brand` (with fallback defaults for hub)
- Add `isHub` boolean: hub shows `Work`/`Writing`/`About`; non-hub shows project badge
- Make copyright string configurable
- Make RSS link conditional (omit if consumer doesn't set a `rssUrl`)
- Document `customFields.brand` shape in README

**Effect:** Each consuming site declares its identity in `docusaurus.config.ts`. Shared components adapt automatically.

**Risk:** Low. The hub site just needs to add `customFields.brand = { isHub: true }` to keep its current behavior.

**Dependency:** Phase 1 must be complete (links must be absolute before context-reading matters).

---

### Phase 3 — Make Navbar/Footer Reusable for Project Sites

**Scope:** Both components, possible new utility files

**Changes:**
- Navbar: add project badge element (e.g., `A zcohen-nerd technical guide` below or beside logo)
- Navbar: add "current project" highlight in Projects ▾ dropdown (compare `customFields.brand.projectUrl` against each project's `href`)
- Footer: add optional project attribution row (license, author)
- Footer: make Connect column configurable (different projects may have different social/github links)
- Footer: allow hub tagline to be overridden per project
- Add `family` field to project registry; read it to set `data-theme` on the appropriate element

**Effect:** The Navbar and Footer work correctly for both hub and project deployments.

**Risk:** Medium. Requires component logic changes and thorough testing on both hub and connector guide.

**Dependency:** Phases 1 and 2.

---

### Phase 4 — Improve Package Consumption

**Scope:** `package.json`, README, possibly a publish workflow

**Changes:**
- Add `scripts` to `package.json`: at minimum a validation script that runs a basic lint or checks exports
- Document the `customFields.brand` schema exhaustively in README
- Document the logo asset copy requirement
- Decide: publish to npm? Use `npm pack` tarball? Keep workspace `file:` with documented sync?
- If publishing: set up a GitHub Actions workflow in the brand repo for `npm publish`
- Clarify the import story for CSS: package import vs local copy

**Effect:** Any project in the ecosystem can add the brand in one session without undocumented steps.

**Risk:** Low to medium. Publishing to npm adds a release step but solves the CI standalone problem permanently.

**Dependency:** Phases 1–3 should be done first so the published package is already correct.

---

### Phase 5 — Reintegrate Connector Guide

**Scope:** `connector-engineering-field-guide` only (after brand package phases 1–4)

**Changes:**
- Add `@zcohen-nerd/brand` back to `package.json` (file: for local dev until published)
- Add `customFields.brand` block to `docusaurus.config.ts`
- Add `themes: ['@zcohen-nerd/brand']` to config
- Remove local CSS copies (`src/css/zcohen-nerd-tokens.css`, `src/css/infima-bridge.css`)
- Restore `@import '@zcohen-nerd/brand/...'` in `custom.css`
- Add `zcohen-nerd-logo.png` to `static/img/`
- Remove `themeConfig.navbar` and `themeConfig.footer` (overridden by brand plugin)
- Run `npm ci && npm run build`
- Verify Navbar shows project badge, not `Work`/`Writing`/`About`
- Verify Footer ecosystem links navigate to absolute project URLs
- Verify logo clicks to `https://zcohen-nerd.github.io/`
- Verify sidebar toggle and mobile drawer still work

**Risk:** Medium. The brand Navbar doesn't have Docusaurus's built-in sidebar toggle button or search integration. Verify that mobile UX (sidebar collapse) works correctly with the swizzled Navbar.

**Dependency:** Brand package phases 1–4.

---

## Risks and Constraints

| Risk | Severity | Notes |
|---|---|---|
| Breaking hub site when changing project registry URLs | Medium | Hub currently uses relative `href` values which work correctly at `/`. Switching to absolute URLs should be transparent, but test thoroughly. The `Link` component is replaced with `<a>` — verify no active-link highlighting is lost. |
| Literacy for Kids actual URLs unknown | Medium | The audit doesn't know the real deployed URL for LFK sites. Wrong absolute URLs in the registry are worse than relative ones. Verify before changing. |
| Brand Navbar doesn't include Docusaurus sidebar toggle | Medium | Docusaurus classic Navbar includes a sidebar-toggle button on mobile docs pages. The brand Navbar has its own mobile drawer but no sidebar toggle. On the connector guide, the sidebar may become inaccessible on mobile. Needs explicit testing. |
| `file:` dependency fails in standalone CI | High (already hit) | Connector guide has already worked around this by copying CSS locally. Full Navbar/Footer integration requires publishing the package or using `npm pack`. This is the gating constraint for Phase 5. |
| Literacy for Kids is a different GitHub org | Medium | `literacy-for-kids.github.io` is under a separate GitHub org. It cannot use a `file:` workspace dependency. It requires a published npm package or a vendored/copied approach. This is a separate but related constraint. |
| CSS token drift | Low-medium | Now that connector guide has local copies, they will drift when the upstream token file changes. Acceptable short-term; resolve in Phase 5. The `SOURCE:` comments in the local copies document where to sync from. |
| `data-theme` on `<html>` requires Root swizzle | Low | The family theme system uses `data-theme` on `<html>`. Without swizzling `Root`, consumers must apply family overrides to `:root` directly (as connector guide does). Documented but not ideal. |
| Docusaurus version mismatch | Low | Package declares `@docusaurus/core >= 3.0.0` as peer dep. Connector guide uses 3.10.1. Compatible. |
| No tests or CI in brand package | Medium | No `scripts` in `package.json`. Changes to the brand package have no automated validation. Consider adding a minimal test Docusaurus site in the repo, or at minimum a lint check. |
| `© 2026 zcohen-nerd` hardcoded year | Low | Will need a manual update each year. Trivial but worth noting — replace with `new Date().getFullYear()`. |

---

## Files Likely Touched First

Priority order for Phase 1:

1. `src/data/projects.js` — absolute URLs (the single most impactful one-file change)
2. `src/components/Navbar/index.js` — replace `Link to={p.href}` with `<a href>`, fix logo link
3. `src/components/Footer/index.js` — replace `Link to={p.href}` with `<a href>`, remove/guard RSS link

For Phase 2, same three files plus:

4. `README.md` — document `customFields.brand` schema

---

## Files to Avoid Touching Initially

- `tokens/zcohen-nerd-tokens.css` — stable and correct; no changes needed
- `src/infima-bridge.css` — stable and correct; no changes needed
- `assets/` — logos are correct; no changes needed
- `index.js` (plugin entry) — plugin mechanism is correct; no changes needed
- `package.json` — no changes until Phase 4 (publish decision)
- `src/components/Navbar/styles.module.css` — design is correct; no visual changes needed
- `src/components/Footer/styles.module.css` — design is correct; no visual changes needed

---

## Open Questions

1. **What is the real deployed URL for Literacy for Kids?** The registry has `/literacy` but LFK appears to be at `literacy-for-kids.github.io` under a different org. What are the real URLs for LFK projects?

2. **What is the real URL for Portfolio?** Is `https://zcohen-nerd.github.io/portfolio` correct, or does it live somewhere else?

3. **Will the brand package be published to npm?** This is the cleanest solution to the standalone CI problem. What is the timeline and preferred registry (public npm, GitHub Packages)?

4. **Does the hub site currently use the brand Navbar/Footer in production?** If yes, any change to the shared components needs to be validated against the live hub before being merged.

5. **Should the Navbar include a sidebar toggle for docs sites?** The brand Navbar replaces the Docusaurus classic Navbar entirely. On a docs site (connector guide), the classic Navbar includes a sidebar toggle button. The brand Navbar does not. Is this acceptable UX, or should the brand Navbar conditionally render a sidebar toggle when in docs mode?

6. **Should the brand package include a `docusaurus.config.ts` TypeScript type for `customFields.brand`?** This would let consumers get autocomplete and type-checking on the config schema.

7. **What is the `data-theme` strategy for project consumers?** Currently consumers set family overrides in `:root` directly. Should the brand package include a Root swizzle that reads `customFields.brand.projectFamily` and sets `data-theme` on `<html>` automatically?

---

## Final Recommendation

**Do Phase 1 now.** It is three files, low risk, and immediately unblocks any future consumer from safely importing the brand package. The connector guide already has working CSS — Phase 1 doesn't affect the connector guide at all. But it makes the registry correct and removes the blocker for Navbar/Footer reuse on any site.

**Do Phase 2 immediately after Phase 1.** Adding `useDocusaurusContext()` and reading `customFields.brand` is a small code addition to each component. It establishes the configuration pattern that all future phases build on.

**Phases 3–5 can be incremental.** The visual design already works. Each phase improves configurability and reuse without a hard deadline.

**The package publication decision (Phase 4) is the critical path item for LFK and standalone CI.** Until the package is published (or distributed as a tarball), any repo that doesn't live in the workspace cannot depend on it. For the connector guide specifically, the current local CSS copy workaround is acceptable until the package is published or a decision is made about distribution.
