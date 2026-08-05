# Standards (Coding · Naming · Component DoD)

> **Status:** rules below are in force now; the component DoD completes in Phase 4.

## Enforced by the linter (do not re-litigate in review)

- Layer boundaries (see `Architecture.md` §1)
- `any` forbidden · `console.*` forbidden (use the Logger from Phase 3)
- Max 400 lines/file · cyclomatic complexity ≤ 10
- Selector prefixes: `ui-` (shared platform) / `app-` (features & layout)

## Size targets (review-enforced)

Component ≤ 200 · template ≤ 150 · service/repository ≤ 300 · store ≤ 300 ·
function ≤ 40 lines. Hitting a limit means extract or split — never "just this once".

## Naming

- Files: kebab-case + role suffix — `customer-list.page.ts`, `.store.ts`,
  `.repository.ts`, `.model.ts`, `.guard.ts`, `.routes.ts`
- Permissions: `module.action` · i18n keys: `feature.screen.element`
- Branches: `feat|fix|chore/<scope>-<desc>` · commits: Conventional Commits

## Signals

State = private `signal` exposed `readonly` · derivation = `computed` (never a
method call in a template for derived data) · async at the boundary
(`toSignal` / `resource`) · no `BehaviorSubject`-as-state · `effect()` rare and
justified by a comment.

## Styling

Semantic design tokens only (never primitives, never raw hex/px) ·
CSS logical properties only (no left/right) · media queries via `respond-to()`.

## Comments & errors

Comments explain _why_ · public shared-component inputs get JSDoc · TODOs carry
an owner or don't merge · errors reach the global funnel or become a visible UI
state — never swallowed.

## Component Definition of Done _(Phase 4)_

Tokens-only · RTL · dark theme · keyboard + ARIA · responsive · documented ·
Playground page demonstrating LTR/RTL × light/dark.
