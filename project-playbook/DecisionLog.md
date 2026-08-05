# Decision Log

Amendments and additions to the Frontend Engineering Charter v1.0.
Format: date · decision · why · link to ADR if one was written.

| Date       | Decision                                            | Why                                                                                              | Ref                      |
| ---------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------ |
| 2026-07-11 | Charter v1.0 frozen (AD-01…AD-31 + YAGNI amendment) | Stop scope churn; give the team a stable target                                                  | ADR index                |
| 2026-07-11 | Pin Angular 21 instead of 22                        | Team Node 22.16 < CLI 22 requirement (Node ≥ 22.22); revisit after Node bump                     | ADR-012                  |
| 2026-07-14 | Development Baseline inserted before Phase 3        | Owner decision: a runnable app (shell + dashboard + theme/RTL switches) before more architecture | docs/reviews/baseline.md |
| 2026-07-14 | ThemeService placed in core (not layout)            | Features must read the theme; features may never import layout (boundaries)                      | baseline review §3       |
