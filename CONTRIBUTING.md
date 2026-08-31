# Contributing — @zcohen-nerd/brand

Shared Docusaurus brand system (design tokens, swizzled Navbar + Footer, the
canonical project registry) consumed by the landing page, Portfolio, and the
connector guide.

## Prerequisites

- **Node 22** (`.nvmrc`; `engines` enforces `>=22`).
- `npm ci` to install.

## Local checks

Run `npm run <script>`:

| Script                    | What it checks                                                                                                                                                                               | CI (`.github/workflows/ci.yml`) |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `format:check`            | Prettier, **only on files changed vs the PR base** (`scripts/changed-files.mjs`).                                                                                                            | `checks`                        |
| `format`                  | Prettier **write** over the whole repo — the one-time baseline (see below).                                                                                                                  | —                               |
| `lint`                    | ESLint (flat config, JS/JSX). `jsx-a11y` runs here; two container-interaction rules that fire on the legitimate focus-trap dialog are downgraded to warnings (see `eslint.config.mjs`).      | `checks`                        |
| `lint:md` / `lint:md:all` | markdownlint on changed Markdown / on everything.                                                                                                                                            | `checks` / —                    |
| `test:registry`           | `scripts/validate-registry.js` — registry invariants: unique names + order, `https` URLs, allowed categories, **status-vocabulary** (`ALLOWED_STATUS`), no legacy URLs, Navbar group wiring. | `checks`                        |
| `build`                   | Babel `src` → `lib` (the compiled components consumers load).                                                                                                                                | `checks`                        |
| `verify`                  | `format:check && lint && lint:md && test:registry`.                                                                                                                                          | —                               |

## The one-time Prettier baseline

`format:check` and the pre-commit hook only touch changed files. When the tree is
clean:

```bash
npm run format
git commit -am "chore: prettier baseline (no behaviour change)"
```

then record the SHA in `.git-blame-ignore-revs`.

## Pre-commit hook (opt-in)

```bash
git config core.hooksPath .githooks   # runs lint-staged on staged files
```

## Keyboard / accessibility coverage

The Navbar's **ecosystem disclosure** and **mobile drawer** are the highest-risk
interactive surfaces. They are covered in two layers:

- **Unit (this repo)** — a jsdom + Vitest 4 + Testing Library suite
  (`test/*.test.jsx`, `vitest.config.mjs`) exercising ARIA wiring, `Escape`,
  focus-trap/return, and scroll-lock. Runs via `npm test`; wired into `verify`,
  `prepublishOnly`, and `ci.yml`. The `.js` components are JSX-in-`.js` (a
  Docusaurus swizzle constraint) — a small `esbuild` pre-plugin in
  `vitest.config.mjs` transforms exactly `src/components/**/*.js`.
- **Integration** — `e2e/keyboard.spec.ts` in `zcohen-nerd-landing-page` runs the
  real compiled `lib/` components in a browser (`npm run test:keyboard` there).

## CI

`.github/workflows/ci.yml` runs the `verify` gates plus `build` on every push and
PR. This repo previously had **no** CI.

## Deferred / known backlog

- `lint:md:all` reports pre-existing `MD031/MD032` in `README.md`; `lint:md` is
  changed-scoped so it does not block.
- `@babel/*` devDependencies are pinned to an `^8.0.x` pre-release — a separate
  decision from this rollout.
