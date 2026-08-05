# Routing Guide

> **Status:** base shape live (Phase 2); guards Phase 3; shells Phase 5.

- Every feature = lazy `loadChildren` → `<feature>.routes.ts` _(live)_
- Route `title` drives the browser tab _(live)_ · breadcrumb metadata _(Phase 5)_
- `/forbidden` (403) and `**` (404) _(live)_
- Feature-flag gating via `canMatch` _(live in minimal form; `featureFlagGuard`
  replaces the inline arrow in Phase 3)_
- Layout shells: auth layout + app shell as parent routes _(Phase 5)_
- Guards: `authGuard`, `permissionGuard` _(Phase 3)_
