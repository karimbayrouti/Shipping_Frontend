# Auth feature

UI migration of the Shipping-prototype login screen (`LoginScreen` +
`CustomerAuth` in the prototype's `App.tsx`). The prototype is the design
specification — layout, colors, typography, spacing, RTL/LTR and dark-theme
behavior are reproduced 1:1.

**Scope (by design):** UI only. No authentication, API, guards, validation or
state management — sign-in actions are intentional no-ops until the auth
phase wires them up.

- `pages/login` — the full-viewport login screen (brand panel + form panel).
- `components/customer-auth` — the customer-portal card
  (login / register / forgot / reset / activate views).
- `core/i18n/modules/auth.ts` — centralized ar/en strings copied verbatim from the prototype.
- `login.data.ts` — display fixtures (company, roles, warehouses, version).
- `styles/_controls.scss` — the prototype's field/input/button primitives.

The screen renders with the **prototype's** design tokens, scoped to the page
`:host` — the platform token set is untouched.
