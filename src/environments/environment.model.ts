/**
 * Shape of every environment file. Lives in its OWN file because
 * `environment.ts` is swapped by fileReplacements in dev builds — a type
 * exported from a replaced file cannot be imported by its replacement.
 */
export interface AppEnvironment {
  production: boolean;
  /** Base URL prefix for every API call (Phase 3: ApiService prepends it). */
  apiUrl: string;
  /** True → HTTP answered by the in-app mock engine (Phase 6) instead of a backend. */
  useMockApi: boolean;
  /** Feature flags (Charter AD-16). Gate routes, nav items and templates. */
  features: {
    developerPlayground: boolean;
  };
}
