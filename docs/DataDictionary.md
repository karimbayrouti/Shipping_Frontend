# Business Data Dictionary

> **Status:** skeleton — populated in Phase 6 alongside the mock fixtures.
> This is the frontend/backend treaty: ASP.NET DTOs and mock fixtures are both
> written against THIS document. Field inventory source: the React prototype
> (the executable spec).

## Conventions (binding for both teams)

JSON camelCase · identifiers `id` · dates ISO-8601 UTC · money
`{ amount, currency }` · enums as string codes · audit fields
`createdAt / createdBy / updatedAt / updatedBy`.

## Entities _(Phase 6)_

Customer · Shipment · Trip · Driver · Vehicle · Warehouse · Inventory ·
Expense · Settlement · Invoice · Payment · User · Role · Permission ·
Notification · AuditLog.
