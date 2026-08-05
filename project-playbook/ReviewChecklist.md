# Review Checklist

Check in this order — stop at the first failing level.

1. **Architecture** — right layer? No boundary bends? No business logic in
   shared/layout? HttpClient only in core/api?
2. **Correctness** — does it do what the requirement says (check the prototype
   when in doubt)? Errors handled or surfaced, never swallowed?
3. **Conventions** — naming, file placement, signals usage, tokens-only styles,
   logical CSS properties, i18n keys (no hardcoded user-facing strings once
   i18n lands in Phase 3).
4. **Quality** — sizes within targets, no duplication with existing shared
   code, tests for logic that can break.
5. **UX four-way check** (UI changes) — LTR/RTL × light/dark, keyboard path,
   loading/empty/error states present.

A PR that fails level 1 gets an architecture conversation, not 30 line comments.
