import { Routes } from '@angular/router';

export const customersRoutes: Routes = [
  {
    path: '',
    title: 'العملاء · نظام إدارة الشحن',
    loadComponent: () => import('./pages/customers.page').then((m) => m.CustomersPage),
  },
];
