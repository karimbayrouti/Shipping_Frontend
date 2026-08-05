import type { AppEnvironment } from './environment.model';

/**
 * DEVELOPMENT environment (`ng serve`). Mirrors the production shape exactly —
 * the shared `AppEnvironment` interface makes a drifted key a compile error.
 */
export const environment: AppEnvironment = {
  production: false,
  apiUrl: '/api',
  useMockApi: true,
  features: {
    developerPlayground: true,
  },
};
