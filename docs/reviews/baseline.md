# Development Baseline Review

**Date:** 2026-07-14 · **Reviewer:** Tech Lead · **Charter:** v1.0
**Sequencing note:** inserted between Phase 2 and Phase 3 at the owner's
request (Decision Log) — pulls the _minimal_ runnable slice of Phases 3/5
forward so the team has a working application to develop on.

## 1. Delivered

Running application: shell layout (sidebar + header) wrapping lazy features ·
dashboard landing page (name, version, environment, live theme, live
language/direction, playground navigation card) · runtime **ThemeService**
(`data-theme`, persisted), **LanguageService** (lang + derived direction →
`dir`, persisted), **StorageService** (the only storage-touching code, `ntx.`
namespace) · `APP_CONFIG` facade (features never import `@env` directly) ·
navigation as data (`APP_NAV`, flag-filtered) · routes rewired around
`ShellLayout` (errors stay outside the shell so they survive shell failures).

Clone → `npm install` → `npm start` → dashboard renders → playground reachable.
No backend, no API, no mock data, no TODOs.

## 2. Fitness checks

| Check                              | Result                                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `ng lint` / `ng test` / `ng build` | ✔ clean · 6/6 · prod build (initial 31.5 kB dev-raw, all pages lazy)                                                |
| `/` → `/dashboard`, titles         | ✔                                                                                                                   |
| Theme toggle                       | ✔ `data-theme` flips, dark tokens render, dashboard tile updates LIVE (zoneless signal reactivity proven), persists |
| Language toggle                    | ✔ `lang`+`dir` flip, sidebar physically mirrors to the right (logical CSS), tile updates live, persists             |
| Playground card + sidebar nav      | ✔ lazy loads inside the shell, `routerLinkActive` correct                                                           |
| 404                                | ✔ outside the shell, correct title                                                                                  |

## 3. YAGNI review

Deliberately absent: translation service (labels are static English until
Phase 3), auth layout, breadcrumb/user menu/notifications panel, responsive
drawer (icon rail below `md` for now), separate DirectionService (direction is
`computed` from language — documented in the service).
One deviation from the charter text, for a boundary reason: **ThemeService is
core, not layout** — features must read the theme and may not import layout.
The final charter CORE list already includes Theme/Language services, so this
is an interpretation, not an amendment.

## 3b. Incident found & fixed during this phase

The Phase-2 commitlint "rejection test" commit (`bad message no type`) was
discovered **in the history** — at test time the hook printed the error but
the commit was not actually blocked, and the reviewer (me) read the error
output as proof of rejection without checking `git log`. Re-tested now: the
hook chain blocks correctly (exit 1, no commit created). The junk empty commit
was rebased out (local repo, no remote). Two lessons codified:
_an enforcement check passes only when you verify the state after it fires_,
and — reinforcing the existing debt item — **CI must re-run these checks
server-side**, because local hooks can fail open or be skipped.

## 4. Technical debt (carried + new)

| Debt                                            | Trigger                                                         |
| ----------------------------------------------- | --------------------------------------------------------------- |
| Inline `canMatch` flag gate (carried from P2)   | Phase 3 `featureFlagGuard`                                      |
| Static English UI strings                       | Phase 3 translation service (keys per `feature.screen.element`) |
| `APP_VERSION` manually synced with package.json | Build-time injection if release cadence demands it              |
| No CI (carried)                                 | Before the first junior's first PR                              |

## 5. Go / No-Go

**GO.** The baseline is a complete, verifiable development target: every
architectural mechanism a feature developer will touch (routing, layout slot,
tokens, core services, signals, boundaries) is demonstrably working.
Recommended next: Phase 3 (Core) — auth/API/i18n/error funnel — which replaces
the two carried debts above.
