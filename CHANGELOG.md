# Changelog — `@zcohen-nerd/brand`

Consumer-facing changes to the shared Navbar/Footer API surface and the canonical
project registry. Older releases (`1.0.x`) predate this file.

## 1.3.1 — 2026-09-01

**Patch — fixes a mobile-navbar regression in 1.3.0.**

- **Navbar wordmark** — `.logo` now sets `width: auto; max-width: 100%` alongside
  its `height: 26px`. In 1.3.0 the new intrinsic `width`/`height` attributes
  could force the wordmark to its full `347px` intrinsic width where CSS only
  constrained the height, overflowing the ~360 px mobile navbar
  (`document scrollWidth` exceeded the viewport at 360/390 px). The attributes
  still provide the aspect-ratio reservation for CLS; CSS is now authoritative
  for the rendered box. Consumers on 1.3.0 should move to 1.3.1.

## 1.3.0 — 2026-08-31

**Additive; no migration needed.**

- **Navbar wordmark** now carries intrinsic `width`/`height` (`347×55`, the
  source PNG's real dimensions). Rendered size is unchanged — CSS `.logo` still
  sets the height — but consumers get layout-shift reservation for free.
- **Registry / API surface** — no changes. `src/data/projects.js` and the
  Navbar/Footer props are identical to `1.2.0`.

### Internal (no consumer impact)

- Test stack migrated **Vitest 2 / Vite 5 → Vitest 4 / Vite 8**, clearing the
  `GHSA-5xrq-8626-4rwp` critical and three Vite advisories. The JSX-in-`.js`
  transform is unchanged; `esbuild` is now a direct devDependency so the config
  import is major-agnostic. All 26 component tests pass.
- Obsolete `vitest` / `vite` entries removed from `.github/audit-allowlist.json`.
  The three remaining entries (`image-size`, `serialize-javascript`, `uuid`) are
  Docusaurus build- / dev-server-only, each with a path, reachability rationale,
  upstream state, and `review_by` date.
- One-time Prettier baseline applied (`.git-blame-ignore-revs` updated). Lint is
  clean (0 warnings).

## 1.2.0 — 2026-08-31

- **WCAG AA contrast** — darkened palette values that fell below 4.5:1, same hue:
  `--zc-gray-600` `#8d949e → #6b7280`; `--zc-cyan-700` / `--zc-color-link`
  `#0b7e96 → #0a7184`; `--zc-color-success` / registry `STATUS_LIVE` +
  `STATUS_SOURCE_VERIFIED` `#2e8555 → #277048`; `--zc-color-warning` / registry
  `STATUS_IN_PROGRESS` + `STATUS_PUBLIC_REVIEW` `#b06f00 → #8a5600`; Portfolio
  registry `enterColor` `#0b7e96 → #0a7184`. No identity change.

## 1.1.0 — 2026-08-31

- **Registry** — Connector Guide status set to `STATUS_SOURCE_VERIFIED`
  ("v1.0 — Source-Verified Release"); blurb updated to name the two-track
  structure.
- **Navbar** — ecosystem disclosure + mobile drawer keyboard remediation
  consolidated onto `main` (focus-trap, focus-return, Escape, scroll-lock, an
  in-drawer "Close menu" button). Vitest component suite (26 tests) added.
- **Licensing** — split license added: `LICENSE.md` (umbrella), `LICENSE-CODE`
  (MIT), `TRADEMARKS.md`. `package.json` `license` → `"SEE LICENSE IN LICENSE.md"`.
