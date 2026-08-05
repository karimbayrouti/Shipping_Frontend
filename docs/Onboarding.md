# Onboarding Guide

## First day: screen migration

1. Use Node 22.16 and npm 11.11, then run `npm install` and `npm start`.
2. Run the Shipping Prototype from `D:\Taimaa-NTX\source\Shipping` with
   `npm install` and `npm run dev`.
3. Read `docs/MigrationGuide.md`. The prototype is the UI source of truth;
   do not redesign, normalize, or replace its visual decisions.
4. Copy `templates/feature` for the assigned screen and rename its placeholders.
5. Compare the Angular screen with the prototype in Arabic/RTL, English/LTR,
   light, dark, desktop, and narrow viewport modes.
6. Before review, run `npm run lint`, `npm test`, `npm run build`, and
   `npm run format:check`.

The first migration should be paired with the frontend lead. After that review,
the same folder, route, and style procedure applies to every screen.
