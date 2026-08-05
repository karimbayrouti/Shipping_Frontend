import { AUTH_AR } from './modules/auth';
import { COMMON_AR } from './modules/common';
import { CUSTOMERS_AR } from './modules/customers';
import { EMPLOYEES_AR } from './modules/employees';
import { TRUCKS_AR } from './modules/trucks';
import { SHIPMENTS_AR } from './modules/shipments';
import { TRIPS_AR } from './modules/trips';
import type { TranslationCatalog } from './index';

export const AR_TRANSLATIONS: TranslationCatalog = {
  common: COMMON_AR,
  auth: AUTH_AR,
  customers: CUSTOMERS_AR,
  employees: EMPLOYEES_AR,
  trucks: TRUCKS_AR,
  shipments: SHIPMENTS_AR,
  trips: TRIPS_AR,
};
