import { Routes } from '@angular/router';

export const trucksRoutes: Routes = [
  {
    path: '',
    title: 'الشاحنات · نظام إدارة الشحن',
    loadComponent: () => import('./pages/trucks.page').then((m) => m.TrucksPage),
  },
];
