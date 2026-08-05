# Feature: customers

Official reference implementation for a migrated business list feature.

## Prototype sources

- Behavior: `Shipping/src/App.tsx` → `CustomersPage`
- Markup: `Shipping/prototype-html/pages/customers/index.html`
- Shared visuals: `Shipping/prototype-html/css`

Route: `/portal/customers`.

## Structure and responsibilities

```text
customers/
  components/
    customer-table/          # renders the feature-specific table and emits intent
    customer-details-dialog/ # read-only customer presentation
    customer-form-dialog/    # reactive form and field validation
  models/                    # customer contracts used inside this feature
  pages/                     # routed container and list orchestration
  customers.data.ts          # temporary typed UI fixtures
  customers.routes.ts        # lazy feature route
```

Translations are namespaced under `core/i18n/modules/customers.ts` and are
available only through `LanguageService`, following the project-wide i18n standard.

`CustomersPage` is the container. It owns transient list state, filtering,
sorting, pagination, dialog selection, and in-memory fixture updates. Child
components receive data and emit user intent; they do not own business data.

Both customer dialogs use the shared `ui-dialog` shell because this feature
demonstrates two actual consumers of the same overlay, focus trap, focus
restoration, Escape handling, and prototype modal structure. Dialog content
and form rules remain feature-local.

No store is used because there is one page consumer and no shared asynchronous
state. No repository or API layer is present. When backend integration begins,
replace the fixture signal at the page boundary without changing presentation
components.

The table remains feature-local. Future list features should copy the pattern,
not import `CustomerTable`. Extract a shared data-table component only after
multiple migrated pages demonstrate an identical Angular behavior contract.

## Visual contract

Prototype class names are retained so the canonical global styles provide the
same light/dark, RTL/LTR, responsive, typography, spacing, and color behavior.
Feature SCSS contains only customer-page layout hooks that were inline in the
prototype.

## Verification

- Compare Arabic/RTL and English/LTR against the running prototype.
- Check light and dark themes.
- Check desktop and narrow viewport table scrolling.
- Verify search, sorting, pagination, row keyboard activation, details, add,
  edit, validation, Escape-to-close, and backdrop close.
- Run lint, tests, production build, and formatting checks.
