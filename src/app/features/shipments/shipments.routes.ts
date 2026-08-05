import { Routes } from '@angular/router';

export const shipmentsRoutes: Routes = [
  {
    path: '',
    title: 'الشحنات · نظام إدارة الشحن',
    loadComponent: () => import('./pages/shipments.page').then((m) => m.ShipmentsPage),
  },
];
