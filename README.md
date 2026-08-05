# Shipping Management System

Angular implementation of the El Ramah Shipping Prototype. The prototype is
the source of truth for product identity, navigation, layouts and UX.

Built on Angular 21 · standalone components · Signals · strict TypeScript ·
SCSS design tokens · Arabic/English with runtime RTL/LTR.

## Quick start

```bash
npm install
npm start          # dev server → http://localhost:4200/portal
npm run lint       # ESLint (includes architecture boundary rules)
npm test           # unit tests (Vitest)
npm run build      # production build
npm run format     # Prettier
```

## Where to go next

| You want to…                | Read                                             |
| --------------------------- | ------------------------------------------------ |
| Understand the architecture | [docs/Architecture.md](docs/Architecture.md)     |
| Migrate a prototype screen  | [docs/MigrationGuide.md](docs/MigrationGuide.md) |
| Start as a new team member  | [docs/Onboarding.md](docs/Onboarding.md)         |
| Know the rules              | [docs/Standards.md](docs/Standards.md)           |
| See why decisions were made | [docs/adr/README.md](docs/adr/README.md)         |
| Team process                | [project-playbook/](project-playbook/)           |

## The one rule

A feature may import from `core`, `shared`, and itself — **never from another
feature**. The linter enforces this; `npm run lint` fails on violations.

## Governance

The architecture is defined by the **Frontend Engineering Charter v1.0**
(see `docs/adr/README.md`). Changes to it go through the Decision Log in
`project-playbook/DecisionLog.md` — not through ad-hoc refactors.
