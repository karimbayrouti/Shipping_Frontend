# Shipping Prototype Migration Guide

## Contract

`D:\Taimaa-NTX\source\Shipping` is the UI source of truth. This project is an
Angular transcription of that prototype, not a redesign. Preserve markup
boundaries, wording, visual values, responsive behavior, RTL/LTR behavior,
dark mode, icons, and assets unless the prototype itself changes.

Use the sources in this order:

1. `Shipping/src/App.tsx` — authoritative behavior and current UI.
2. `Shipping/prototype-html/pages/<screen>/index.html` — framework-neutral
   page markup with migration boundaries already marked.
3. `Shipping/prototype-html/css` — canonical shared style contract.

If the static HTML kit differs from `App.tsx`, follow `App.tsx` and report the
kit drift. Do not silently improve either version during migration.

## Product identity and routes

The only application identity is El Ramah Shipping Management. Do not add
project, framework, or platform branding to product UI. The prototype portal
flow is binding: `/portal` is Login and administrative screens live under
`/portal/<prototype-page-key>`. The login is outside the routed application
shell. Unmigrated prototype destinations retain their exact navigation item
and temporarily render the shared Coming Soon page.

## Where a screen belongs

Create one lazy feature under `src/app/features/<feature>/`:

```text
<feature>/
  <feature>.routes.ts
  pages/
    <feature>.page.ts
    <feature>.page.html
    <feature>.page.scss
  components/        # only when the prototype page has a real local boundary
  README.md
```

Copy `templates/feature` as the starting point. Keep modal components inside
the owning feature until the same prototype modal is genuinely shared by
multiple features.

## Migration procedure

1. Find the React page function in `Shipping/src/App.tsx` and the matching
   static page under `Shipping/prototype-html/pages`.
2. Copy only the content inside `<main class="app-main">`; the Angular routed
   shell already owns the sidebar, header, and main content slot.
3. Keep the prototype class names. The canonical prototype CSS is loaded from
   `src/styles/prototype`; do not recreate those rules in page SCSS.
4. Replace React rendering with Angular control flow (`@if`, `@for`, `@switch`)
   and event/property bindings without changing the rendered structure.
5. Put only page-specific rules in the page SCSS. Copy a page-specific
   `style.css` from the kit when one exists, preserving values and source notes.
6. Add the feature route in `<feature>.routes.ts`, then add one lazy
   `loadChildren` entry in `app.routes.ts`. Add navigation only when the route
   exists; never leave dead menu entries.
7. Copy required assets to `public/assets/<feature>/`. Reuse
   `public/assets/branding/logo-el-ramah.png` for the official logo; it is
   byte-identical to the prototype asset.
8. Verify behavior against the running prototype. Record any intentional
   difference in the feature README before review.

## Shared UI rule

The prototype primitives (`.btn`, `.card`, `.page-hero`, `.data-table`,
`.status-badge`, `.search-bar`, `.modal`, fields, tabs, banners, and avatars)
are already shared through the canonical stylesheet. Use their exact markup.

Do not create an Angular wrapper merely to rename a prototype class. Extract a
shared Angular component only after at least two migrated screens need the same
Angular behavior or projected structure. `ui-brand-mark` is the existing
exception because the prototype logo crop is used by both shell and login.

## Naming

- Feature folders and files: kebab-case.
- Routed screens: `<name>.page.ts` with class `<Name>Page`.
- Feature-local parts: `<name>.component.ts` only when the role suffix adds clarity.
- Lazy routes: `<feature>.routes.ts` exporting `<feature>Routes`.
- Shared platform selectors: `ui-*`; product/layout selectors: `app-*`.

## Visual acceptance checklist

- Same content, hierarchy, classes, icons, and visible states as the prototype.
- Arabic/RTL and English/LTR both match.
- Light and dark modes both match.
- Desktop and the prototype's narrow/mobile breakpoint both match.
- No duplicated shell markup inside a routed page.
- No copied global primitive CSS inside feature styles.
- Lint, tests, production build, and formatting checks pass.
