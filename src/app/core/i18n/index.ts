import type { AuthTranslations } from './modules/auth';
import type { CommonTranslations } from './modules/common';
import type { CustomersTranslations } from './modules/customers';
import type { EmployeesTranslations } from './modules/employees';
import type { TrucksTranslations } from './modules/trucks';
import type { ShipmentsTranslations } from './modules/shipments';
import type { TripsTranslations } from './modules/trips';

export interface TranslationCatalog {
  common: CommonTranslations;
  auth: AuthTranslations;
  customers: CustomersTranslations;
  employees: EmployeesTranslations;
  trucks: TrucksTranslations;
  shipments: ShipmentsTranslations;
  trips: TripsTranslations;
}
export type TranslationModule = keyof TranslationCatalog;

export { AR_TRANSLATIONS } from './ar';
export { EN_TRANSLATIONS } from './en';
export type { AuthTranslations } from './modules/auth';
export type { CommonActionTranslations, CommonTranslations } from './modules/common';
export type { CustomersTranslations, CustomerViewTranslations } from './modules/customers';
export type { EmployeesTranslations, EmployeeViewTranslations } from './modules/employees';
export type { TrucksTranslations, TrucksViewTranslations } from './modules/trucks';
export type { ShipmentsTranslations, ShipmentsViewTranslations } from './modules/shipments';
export type { TripsTranslations, TripsViewTranslations } from './modules/trips';
