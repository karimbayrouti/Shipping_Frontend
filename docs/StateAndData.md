# State & Data (State Management · API Conventions · Repository Pattern)

> **Status:** skeleton — implemented in Phase 3, exemplified in Phase 7.

## State: signal stores _(Phase 3)_

Store anatomy · `AsyncStatus` · when RxJS is appropriate · NgRx migration path
(stores are shape-compatible with `@ngrx/signals` by design).

## API conventions — the HTTP treaty _(Phase 3; binding for the ASP.NET team too)_

Envelopes (`ApiResponse<T>`, `PagedResult<T>`) · problem-details errors ·
paging/sorting/filtering query contract · dates ISO-8601 UTC · money
`{ amount, currency }` · JSON camelCase.

## Repository pattern _(Phase 3)_

Component → Store → Repository → ApiService → HttpClient. No exceptions:
`HttpClient` exists only inside `core/api`.
