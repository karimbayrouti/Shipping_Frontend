import type { AuthTranslations } from '@core/i18n';

/**
 * Demo/display data for the login screen, copied verbatim from the prototype
 * (App.tsx: COMPANY, APP_VERSION, ROLES, WAREHOUSES). Pure UI fixtures — no
 * authentication behind them; real data arrives with the API phases.
 */
export const COMPANY = {
  nameAr: 'مؤسسة الرماح للشحن',
  nameEn: 'El Ramah Shipping',
} as const;

export const APP_VERSION = 'v2.0.0';

export type RoleKey = 'administrator' | 'operations' | 'warehouse' | 'driver';

export interface LoginRole {
  readonly key: RoleKey;
  readonly icon: string;
  readonly labelKey: keyof AuthTranslations;
  readonly descKey: keyof AuthTranslations;
  /** Demo username pre-filled in the form. */
  readonly user: string;
}

export const ROLES: readonly LoginRole[] = [
  {
    key: 'administrator',
    icon: '🛡️',
    labelKey: 'roleAdministrator',
    descKey: 'roleAdminDesc',
    user: 'محمود عبد الحليم',
  },
  {
    key: 'operations',
    icon: '🧭',
    labelKey: 'roleOperations',
    descKey: 'roleOpsDesc',
    user: 'طارق منصور',
  },
  {
    key: 'warehouse',
    icon: '🏬',
    labelKey: 'roleWarehouse',
    descKey: 'roleWhDesc',
    user: 'سلمى عبد الله',
  },
  {
    key: 'driver',
    icon: '🧑‍✈️',
    labelKey: 'roleDriver',
    descKey: 'roleDriverDesc',
    user: 'يوسف الحناوي',
  },
];

export interface LoginWarehouse {
  readonly id: number;
  readonly nameAr: string;
  readonly nameEn: string;
}

/** Warehouses a warehouse officer can be bound to (prototype demo fixtures). */
export const WAREHOUSES: readonly LoginWarehouse[] = [
  { id: 1, nameAr: 'مستودع القاهرة', nameEn: 'Cairo Warehouse' },
  { id: 2, nameAr: 'مستودع الإسكندرية', nameEn: 'Alexandria Warehouse' },
  { id: 3, nameAr: 'مستودع الكويت', nameEn: 'Kuwait Warehouse' },
  { id: 4, nameAr: 'مستودع الدوحة', nameEn: 'Doha Warehouse' },
];

/** Feature glyphs on the brand panel — labels hardcoded in English, as in the prototype. */
export const BRAND_FEATURES: readonly { icon: string; label: string }[] = [
  { icon: '🚚', label: 'Fleet' },
  { icon: '📦', label: 'Shipments' },
  { icon: '🌍', label: 'Cross-border' },
  { icon: '📊', label: 'Analytics' },
];

/**
 * The one seeded portal account of the prototype. Used only to reproduce the
 * demo behavior of the forgot-password flow (known email → reset code, any
 * other email → "no account" message). Not authentication.
 */
export const DEMO_PORTAL_EMAIL = 'ahmed@example.com';
export const DEMO_PORTAL_PASSWORD = '123456';
