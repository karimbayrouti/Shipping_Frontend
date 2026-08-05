import { AUTH_EN } from './modules/auth';
import { COMMON_EN } from './modules/common';
import { CUSTOMERS_EN } from './modules/customers';
import { EMPLOYEES_EN } from './modules/employees';
import { TRUCKS_EN } from './modules/trucks';
import { SHIPMENTS_EN } from './modules/shipments';
import { TRIPS_EN } from './modules/trips';
import type { TranslationCatalog } from './index';

export const EN_TRANSLATIONS: TranslationCatalog = {
  common: COMMON_EN,
  auth: AUTH_EN,
  customers: CUSTOMERS_EN,
  employees: EMPLOYEES_EN,
  trucks: TRUCKS_EN,
  shipments: SHIPMENTS_EN,
  trips: TRIPS_EN,
};
