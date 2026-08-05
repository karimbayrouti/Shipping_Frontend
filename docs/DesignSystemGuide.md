# Design System Guide (+ UI Guidelines)

> **Standard:** the Shipping Prototype is the design-system source of truth.
> Angular preserves its tokens, components, layouts and responsive behavior.

## Token architecture _(Phase 2 — done)_

Three layers, strictly one-directional:

1. **Primitives** — `styles/tokens/_primitives.scss`. Raw scales, no meaning.
   Off-limits to components.
2. **Semantic** — `styles/themes/_light.scss` / `_dark.scss`. The only names a
   component may use (`--color-primary`, `--surface-1`, `--text-2`,
   `--status-danger`, …). Themes switch via `data-theme` on `<html>`.
3. **Component tokens** — defined per `ui-*` component in Phase 4, mapped to
   semantic tokens.

Never hardcode a color or spacing. Never use a primitive in a component.

## RTL & LTR rules _(Phase 2 — in force)_

Logical properties only (`margin-inline-start`, `inset-inline-end`,
`text-align: start`). Direction is `dir` on `<html>`. Every component and page
is tested in both directions.

## Breakpoints _(Phase 2 — done)_

sm 600 · md 900 · lg 1280 · xl 1600 — consumed via the `respond-to()` mixin only.

## Component specs _(Phase 4)_

## Page anatomy — `ui-page` / `ui-page-header` / `ui-page-states` _(Phase 4–5)_

## Accessibility rules _(Phase 4)_
