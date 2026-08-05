import { Routes } from '@angular/router';

export const employeesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/employees/employees.page').then((m) => m.EmployeesPage),
  },
];
