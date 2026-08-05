# Security

> **Status:** skeleton — implemented in Phase 3 (auth core) and Phase 6 (mock identity).

## Token lifecycle _(Phase 3)_

Access token held in memory · refresh via httpOnly cookie issued by ASP.NET ·
401 refresh flow with concurrent-request queueing.

## Permission model _(Phase 3)_

Flat `module.action` strings delivered in the user payload · enforced at route
(`permissionGuard`), template (`*appHasPermission`) and navigation config —
all reading one `PermissionManager`.

## Deferred (documented, not implemented — Charter YAGNI rule)

Idle timeout / session expiration: build when a security policy requires it.
The design slot is the auth core; expected effort ≈ 1 day.
