# Developer Guide

## Daily commands _(Phase 2 — done)_

`npm start` (dev server, mock mode) · `npm run lint` · `npm test` ·
`npm run build` · `npm run format`. The pre-commit hook runs lint-staged on
staged files; commit messages are checked against Conventional Commits.

## Prototype screen migration _(live)_

Follow `MigrationGuide.md` and start from `templates/feature`. The Shipping
Prototype supplies the markup, styles, assets, states, and responsive behavior;
Angular supplies routed components, bindings, and maintainable feature-local
organization. A migration must not contain an unsolicited redesign.

## Feature development lifecycle _(Phase 7)_

Requirement → review → feature folder (from template) → mock data → UI →
store → repository → integration → tests → docs → PR → review → merge.

## Working with the Mock API _(Phase 6)_

## Using the API layer & repositories _(Phase 3)_

## Using stores & signals _(Phase 3, examples in Phase 7)_

## Using shared components

Reuse only components already proven by migrated prototype screens. The
Shipping Prototype remains the visual and behavior contract.
