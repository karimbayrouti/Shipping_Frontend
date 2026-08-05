import type { CommonActionTranslations } from './common';

export const EMPLOYEES_EN = {
  pageTitle: 'Employees',
  add: 'Add Employee',
  employees: 'Employees',
  drivers: 'Drivers',
  available: 'Available',
  onRoad: 'On Road',
  search: 'Search...',
  name: 'Name',
  position: 'Position',
  department: 'Department',
  phone: 'Phone',
  netSalary: 'Net Salary',
  status: 'Status',
  workStatus: 'Work Status',
  assignedWork: 'Assigned Trip',
  actions: 'Actions',
  of: 'of',
  noResults: 'No results found',
  noResultsHint: 'Try adjusting your search or filters',
  details: 'Employee Details',
  employeeCode: 'Employee Code',
  required: 'This field is required',
  editEmployee: 'Edit Employee',
  addEmployee: 'Add Employee',
} as const;

export type EmployeesTranslations = Record<keyof typeof EMPLOYEES_EN, string>;

export const EMPLOYEES_AR: EmployeesTranslations = {
  pageTitle: 'الموظفون',
  add: 'إضافة موظف',
  employees: 'الموظفون',
  drivers: 'السائقون',
  available: 'متاح',
  onRoad: 'في الطريق',
  search: 'بحث...',
  name: 'الاسم',
  position: 'المنصب',
  department: 'القسم',
  phone: 'الهاتف',
  netSalary: 'صافي الراتب',
  status: 'الحالة',
  workStatus: 'حالة العمل',
  assignedWork: 'العمل المُسند',
  actions: 'إجراءات',
  of: 'من',
  noResults: 'لا توجد نتائج',
  noResultsHint: 'جرّب تعديل البحث أو التصفية',
  details: 'تفاصيل الموظف',
  employeeCode: 'كود الموظف',
  required: 'هذا الحقل مطلوب',
  editEmployee: 'تعديل الموظف',
  addEmployee: 'إضافة موظف',
};

export type EmployeeViewTranslations = EmployeesTranslations & CommonActionTranslations;
