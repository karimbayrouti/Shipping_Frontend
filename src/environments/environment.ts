import type { AppEnvironment } from './environment.model';

/**
 * PRODUCTION environment — the build default (`ng build`).
 * Development values live in `environment.development.ts`, swapped in by the
 * CLI's fileReplacements. Import ONLY via the `@env` alias so the swap works.
 *
 * This object is the single compile-time configuration surface of the app
 * (Charter: config is data, not code). Keep it flat, typed and boring.
 */
export const environment: AppEnvironment = {
  production: true,
  apiUrl: 'https://your-backend-api.example.com/api',
  useMockApi: false,
  features: {
    developerPlayground: false,
  },
};

