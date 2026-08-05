# Architecture Decision Records — Index

Decisions were consolidated as the **Frontend Engineering Charter v1.0**
(approved 2026-07-11). Each ADR records one pillar; full ADR bodies are
authored in the phase that implements the subject (status column tracks that).

| ADR | Title                             | Decision (one line)                                                                                  | Status                      |
| --- | --------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------- |
| 001 | Frontend architecture             | Feature-based layers (core/shared/layout/features), lint-enforced boundaries                         | Accepted · body Phase 2 ✔   |
| 002 | State management                  | Signals-first feature stores; RxJS at async boundaries; NgRx-compatible shape                        | Accepted · body Phase 3     |
| 003 | API layer                         | Component→Store→Repository→ApiService; typed envelopes                                               | Accepted · body Phase 3     |
| 004 | Security                          | JWT in memory + httpOnly refresh cookie; permission strings `module.action`                          | Accepted · body Phase 3     |
| 005 | Styling & design system           | 3-layer tokens (primitive→semantic→component), CSS variables, `data-theme`                           | Accepted · body Phase 2 ✔   |
| 006 | Feature structure                 | Identical skeleton; folders created on first use (no placeholder trees)                              | Accepted · body Phase 7     |
| 007 | Folder structure & platform split | Platform (core/shared/layout/styles) vs product (features); documented extraction path               | Accepted · body Phase 2 ✔   |
| 008 | Translation strategy              | Runtime JSON dictionaries (AR/EN live switch); logical CSS for RTL                                   | Accepted · body Phase 3     |
| 009 | Permission model                  | Flat permissions in the user payload; roles resolved server-side                                     | Accepted · body Phase 3     |
| 010 | Repository pattern                | Generic BaseRepository per feature; HttpClient isolated in ApiService                                | Accepted · body Phase 3     |
| 011 | Platform extraction               | Single repo now; extract platform to a workspace library when ERP #2 is real                         | Accepted · deferred trigger |
| 012 | Angular version pin               | Angular 21 (team Node 22.16 caps CLI 22, which requires Node ≥ 22.22); `ng update` after a Node bump | Accepted · Phase 2 ✔        |

New decisions: copy `adr-template.md`, number sequentially, link from
`project-playbook/DecisionLog.md`.
