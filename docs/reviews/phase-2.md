# Phase 2 Review — Workspace Scaffold

**Date:** 2026-07-11 · **Reviewer:** Tech Lead · **Charter:** v1.0

## 1. Delivered

Angular 21.2 workspace (zoneless, standalone, strict, Vitest) · path aliases
(`@core` `@shared` `@layout` `@features` `@env`) · ESLint with **working**
layer-boundary enforcement + Prettier + EditorConfig · Husky (pre-commit
lint-staged, commit-msg commitlint/Conventional Commits) · `.gitattributes`
LF normalization · design-token bootstrap (primitives → light/dark semantic
themes, breakpoints + `respond-to()` mixin, reset/base with logical-properties
rule) · typed environments with `useMockApi` + feature flags · routing shell
(lazy playground behind the `developerPlayground` flag, `/forbidden`, `**`
404, route titles) · two real features (`developer-playground`, `errors`) ·
documentation skeletons (9 guides, ADR index ×12 + template, playbook ×5, AI
library index) · OnPush schematics default · budgets (initial 500 kB/1 MB).

## 2. Fitness checks

| Check                               | Result                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `ng build` (prod)                   | ✔ 204 kB initial; every page its own lazy chunk                                                        |
| `ng lint`                           | ✔ clean                                                                                                |
| **Deliberate cross-feature import** | ✔ FAILS lint (`feature may not import from feature`)                                                   |
| `ng test`                           | ✔ 2/2                                                                                                  |
| Runtime smoke (dev server)          | ✔ `/`→`/playground`, titles, 404; tokens resolve; `data-theme="dark"` and `dir="rtl"` switch correctly |

## 3. YAGNI review

Nothing shipped without a consumer. Notable _absences_ (intentional): no core
services, no shared components, no CDK dependency (arrives Phase 4), no empty
feature folders, no `errors.routes.ts` (two static routes registered directly).
Judgment call kept: `docs/` skeletons carry section stubs with owner phases —
that is documentation of deferral, which the charter explicitly prefers.

## 4. Issues found & fixed during the phase

1. **Boundary rules silently inert for aliased imports** — `eslint-plugin-boundaries`
   could not resolve `@features/...` without a TS resolver; a violation passed.
   Fixed with `eslint-import-resolver-typescript` and re-proven with a failing
   test import. _Lesson: an enforcement rule isn't done until you've watched it fail._
2. **`AppEnvironment` type exported from a file that fileReplacements swaps** —
   broke the test build. Type moved to `environment.model.ts` (never replaced).
3. **Node 22.16 caps the CLI at Angular 21** (v22 needs Node ≥ 22.22) → ADR-012;
   upgrade trigger: team Node bump, then `ng update`.

## 5. Technical debt introduced

| Debt                                               | Trigger to pay                                                          |
| -------------------------------------------------- | ----------------------------------------------------------------------- |
| Playground flag gate is an inline `canMatch` arrow | Phase 3 replaces it with `featureFlagGuard`                             |
| Doc guides are skeletons                           | Each fills in its owning phase (tracked per file)                       |
| No CI pipeline (hooks only run locally)            | Before the first junior joins — hooks are bypassable with `--no-verify` |

## 6. Simplification opportunities

None found — the scaffold is already minimal. Re-checked candidates: the token
ramp count (5 steps) and the doc count (9) both survived a second look.

## 7. Risks

- **`npm --prefix` quirk**: dev-server launcher runs from a sibling repo config;
  harmless, replaced by CI + local `npm start` for the team.
- **Windows dev on a full C: drive** — npm cache pinned to `D:\npm-cache-tmp`
  (documented in DeveloperGuide "Daily commands" — add explicitly in Phase 3).

## 8. Recommendations before Phase 3

1. Approve ADR-012 (Angular 21 pin) explicitly.
2. Decide the CI host (GitHub Actions/Azure DevOps) so Phase 3 can add the
   pipeline file alongside the core layer.

## 9. Go / No-Go

**GO for Phase 3 (Core layer).** The fence is proven, the pipeline is green,
and nothing speculative shipped.
