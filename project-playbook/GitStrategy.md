# Git Strategy

## Branching

- `main` is always releasable; direct pushes are for the lead only during
  platform phases, forbidden once the team joins.
- Work branches: `feat/<scope>-<desc>`, `fix/<scope>-<desc>`, `chore/<desc>`.
  Short-lived — target: merged within 2–3 days. Feature flags exist so work can
  merge dark instead of living on a long branch.

## Commits

Conventional Commits, enforced by commitlint at commit time:
`feat(core): add auth interceptor` · `fix(shared): table header RTL alignment`.
Scope = layer or feature name.

## Pull requests

- Small: ≤ ~400 changed lines. Bigger work is split (flags help).
- Description: what + why + screenshot for UI + checklist from
  `ReviewChecklist.md`.
- One approval required; the lead reviews everything that touches `core/`.
- CI (lint + test + build) must be green — no exceptions, including the lead.
