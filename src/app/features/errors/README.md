# Feature: errors

Platform error pages — **404 Not Found** (wildcard route) and **403 Forbidden**
(redirect target of permission guards from Phase 3 onward).

- No store, no services, no data: these pages must render even when the rest of
  the app is broken, so they stay dependency-free.
- Registered directly in `app.routes.ts` (no `errors.routes.ts` — two static
  routes don't justify an extra indirection).

| Route        | Page            |
| ------------ | --------------- |
| `/forbidden` | `ForbiddenPage` |
| `**`         | `NotFoundPage`  |
