# Architecture

> **Status:** skeleton — sections are completed in the phase that builds their
> subject (owner phase noted per section). Governed by Charter v1.0.

## 1. Overview & layers _(Phase 2 — done)_

Four layers, one dependency law (lint-enforced in `eslint.config.js`):

| Layer        | May import           | Never imports                 |
| ------------ | -------------------- | ----------------------------- |
| `core`       | core, env            | shared, layout, features      |
| `shared`     | shared, core         | layout, features              |
| `layout`     | layout, shared, core | features                      |
| `features/X` | itself, shared, core | **any other feature**, layout |

- **Platform** = core + shared + layout + styles + templates (business-agnostic).
- **Product** = features + nav config + i18n dictionaries + theme values.

## 2. Folder structure _(Phase 2 — done)_

One sentence per folder: `core` singletons & cross-cutting services · `shared`
dumb reusable UI · `layout` app chrome · `features` isolated business domains ·
`styles` design tokens & global CSS · `mocks` (Phase 6) fixture-backed API ·
`docs`/`project-playbook`/`ai`/`templates` versioned knowledge, invisible to
the build.

## 3. Core services map _(Phase 3)_

## 4. Data flow: component → store → repository → ApiService _(Phase 3)_

## 5. Routing & layout shells _(Phase 5)_

## 6. Mock API architecture _(Phase 6)_

## 7. The feature anatomy _(Phase 7)_
