# Step 2 Ecosystem Navigation Report

## Scope

Shared navigation-label clarification and Fusion System Blocks status correction. No npm publication; no consumer dependency migration.

## Package Version State

### Local Version

1.0.3

### Latest Verified npm Version

1.0.2 (verified via `npm view` at execution time)

### Version Prepared for Future Publication

**1.0.3** — Case 1: the local 1.0.3 has never been published, so this Step 2 work (plus Batches C and D) rolls into the first 1.0.3 publication. No bump to 1.0.4.

## Navigation Change

### Previous Label

`Projects ▾` (shared disclosure trigger)

### New Label

`Ecosystem ▾` — accessible name "Ecosystem". Internal component renamed `ProjectSwitcher` → `EcosystemSwitcher`; comments and README updated to "Ecosystem disclosure" terminology. The stable DOM id `zc-project-disclosure` was deliberately kept — both consumers' validators and no runtime behavior depend on the label, so renaming the id would add risk for cosmetics.

### Internal Portfolio Projects Link

Untouched — the portfolio's `customFields.brand.navLinks` still renders `Projects → /projects/`. Desktop nav verified as: Projects · FIRST Robotics · Teaching · Writing & Research · **Ecosystem ▾**.

## Accessibility Preservation

Disclosure semantics (button, aria-expanded, aria-controls, hidden state, server-rendered links), Escape/outside-click closing, focus return, grouped labels, external indicators, current-item highlighting, and the mobile drawer (dialog, trap, scroll lock, Open/Close menu labels) are all unchanged code paths — only the visible trigger text changed. Browser-verified open/close/groups/highlighting; the focus-return assertion could not be measured this session (undisplayed automation pane cannot move `activeElement` at all — even plain `link.focus()` no-ops), and the code path is identical to what passed Batch C's full keyboard validation.

## Registry Change

Fusion System Blocks: `STATUS_LIVE` → `STATUS_PUBLIC_BETA` (v0.1.x release with expected rough edges). Name, URL, emoji, category, featured, order, colors, and blurb untouched. No other status changed.

## Registry Validation

`validate-registry.js` gained: FSB must be "Public Beta" (fails loudly if reverted to Live), both navigation groups non-empty, Navbar carries the two group labels, and the disclosure is labeled Ecosystem. All pass.

## Brand Build / Pack Dry-Run

Babel build clean (5 files); compiled `lib/` carries the Ecosystem label and Public Beta status. Pack dry-run: 22 files, version 1.0.3, no junk.

## Consumer Validation

| Consumer | Build | Validation | Browser check |
|---|---:|---:|---:|
| Hub | ✅ strict | ✅ (incl. 4 new structural checks) | ✅ trigger/groups/8 links/FSB pill |
| Portfolio | ✅ strict | ✅ (incl. 5 new structural checks) | ✅ distinct Projects + Ecosystem, highlighting |
| Connector Guide | — | — | repo not in workspace; deferred compatibility check (it consumes npm 1.0.2 and is unaffected until publication) |

## npm Publication

Not performed in this step.

## Deferred Dependency Migration

Consumers stay on `file:../zcohen-nerd-brand`; CI brand-clone steps stay. See the deferred procedure in the final Step 2 report.

## Files Changed

`src/components/Navbar/index.js`, `src/data/projects.js`, `scripts/validate-registry.js`, `README.md`, this report.

## Remaining Manual Steps

1. Merge order: brand PR → hub PR → portfolio PR (consumer CI validates against brand main).
2. From the machine with npm credentials: publish 1.0.3, then migrate consumers (documented procedure in the final report).
3. Human visual glance at the renamed trigger post-deploy (automation pane could not render pixels).
