# `@zcohen-nerd/brand` release checklist

The brand package is consumed by every ecosystem site (Portfolio, the landing
page, the Connector Guide, …) as a hard version pin. A bad publish breaks all of
them at once, so releases run through this list in order. Do not skip ahead — a
later step assumes the earlier ones passed.

## 0. Pre-flight

- [ ] Working tree clean except the changes you intend to ship (`git status`).
- [ ] On an up-to-date branch off `main`; changes are in a PR, not pushed
      straight to `main`.
- [ ] Node and npm versions match what CI/consumers use (Node 20).

## 1. Registry validation

The canonical project registry (`src/data/projects.js`) drives the Navbar
switcher and Footer on every site. Validate it before anything else.

```bash
npm run test:registry
```

- [ ] All checks report `ok`; script exits `Registry validation passed.`
- [ ] If you changed the registry: every `href` is an absolute production URL,
      `category` is one of the allowed values, `status` is a known label, and no
      legacy URLs (`zcohen-nerd.github.io/Portfolio`, …) reappear.

## 2. Component / unit checks

```bash
npm test
```

Covers the accessibility contract that must not regress:

- [ ] Disclosure semantics — `aria-expanded` / `aria-controls`, no `role="menu"`,
      link list server-rendered even while `hidden`.
- [ ] Mobile drawer — labelled `role="dialog"` + `aria-modal`, opens/closes,
      Escape closes, focus enters on open and returns to the trigger on close,
      body scroll locks/unlocks, Tab is trapped (wraps both directions).
- [ ] Focus-trap helper — DOM order, skips `[disabled]`, wrap math.
- [ ] Rendered link inventory — Navbar drawer and Footer list exactly the
      registry entries, in order; external links carry the `↗` + SR-only
      "(opens external site)".

> Note: tests run against `src/` via an esbuild JSX-in-`.js` pre-transform
> (`vitest.config.mjs`). `@vitejs/plugin-react` is intentionally not used — the
> repo builds with a Babel 8 pre-release its Babel 7 path cannot load.

## 3. Package build

```bash
npm run build
```

- [ ] `Successfully compiled N files with Babel`, no warnings.
- [ ] `lib/` reflects the current `src/` (rebuilt, not stale).

## 4. Inspect what would ship

```bash
npm pack --dry-run     # or: npm run pack:dry  (build + dry pack)
```

- [ ] File list contains **only** what `package.json > files` intends:
      `index.js`, `tokens/`, `lib/**`, `src/components/**`, `src/data/**`,
      `src/utils/**`, `src/infima-bridge.css`, `assets/**`, `README.md`.
- [ ] No `test/`, `vitest.config.mjs`, `babel.config.json`, `scripts/`,
      `node_modules/`, `*.tgz`, or editor/OS cruft.
- [ ] `unpacked size` / `total files` are in the expected ballpark (a sudden
      jump means something leaked in).

## 5. Version + changelog decision

Semantic versioning, from the consumer's point of view (the swizzled Navbar/
Footer API surface and the registry contents):

| Change | Bump |
| --- | --- |
| Bug fix, CSS-only tweak, non-visible refactor, test-only changes | **patch** |
| New registry entry, new opt-in prop, additive a11y/markup improvement that consumers get for free | **minor** |
| Removed/renamed prop or export, changed `brand` config shape, markup change that breaks consumer CSS overrides, registry entry removed/re-slugged | **major** |

- [ ] `version` in `package.json` bumped accordingly.
- [ ] `CHANGELOG.md` updated (create it if absent) — one entry per release with
      the version, date, and a consumer-facing summary of what changed and any
      migration notes.
- [ ] Bump is called out explicitly in the PR description; **owner approves the
      version number before publish.**

## 6. Consuming-site local tarball test

Prove the real consumers build against the exact artifact before it goes public.

```bash
npm run build && npm pack        # -> zcohen-nerd-brand-<version>.tgz
```

Then, for **each** consumer (`hub/portfolio`, `hub/zcohen-nerd-landing-page`,
`guides/connector-engineering-field-guide`):

```bash
cd <consumer>
npm install /abs/path/to/zcohen-nerd-brand-<version>.tgz
npm run build
```

- [ ] Every consumer build succeeds (`Generated static files in "build"`).
- [ ] No new console warnings from Navbar/Footer swizzle resolution.
- [ ] Restore each consumer afterwards — the tarball test must not land in a
      commit:

```bash
git checkout -- package.json package-lock.json
npm install      # re-pin to the published/registry version
```

- [ ] `git status` in each consumer matches its pre-test state; `.tgz` deleted
      from the brand repo (it is gitignored, but don't leave it lying around).

## 7. Responsive smoke test

Run one consumer locally and eyeball the shared chrome:

```bash
cd <consumer> && npm run serve
```

- [ ] 320 / 360 / 768 / 1280 px: header does not overflow horizontally; the
      hamburger and (on docs pages) the sidebar toggle stay on one row with the
      logo.
- [ ] Discrete controls (toggles, Ecosystem pill, drawer/footer links, logo)
      are comfortably tappable (~44 px hit area); inline prose links unchanged.
- [ ] Open the mobile drawer: focus lands on the close control, Escape and the
      scrim close it, focus returns to the hamburger, background does not scroll.
- [ ] Keyboard-tab the header and footer: focus ring is visible on every control
      and reads clearly against its background (navbar: cyan-700 on white;
      footer: cyan-400 on navy).
- [ ] Footer Ecosystem/Connect columns list the expected links; external ones
      show the `↗`.

## 8. Publish + roll consumers

Only after 1–7 pass and the owner has approved the version:

```bash
npm publish            # runs prepublishOnly: test:registry + test + build
```

- [ ] `npm view @zcohen-nerd/brand version` shows the new version.
- [ ] In each consumer, bump the `@zcohen-nerd/brand` pin to the new version,
      `npm install`, rebuild, commit the `package.json` + `package-lock.json`
      change on its own branch/PR.
- [ ] Tag the brand release (`git tag brand-v<version>` / GitHub release) with
      the changelog entry.

---

### Quick command reference

| Purpose | Command |
| --- | --- |
| Registry check | `npm run test:registry` |
| Component tests | `npm test` |
| Build `lib/` | `npm run build` |
| Inspect tarball | `npm run pack:dry` |
| Real tarball | `npm run build && npm pack` |
| Full pre-publish gate | `npm run prepublishOnly` |
