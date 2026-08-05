import { Routes } from '@angular/router';

export const tripsRoutes: Routes = [
  {
    path: '',
    title: 'بوالص الشحن · نظام إدارة الشحن',
    loadComponent: () => import('./pages/trips.page').then((m) => m.TripsPage),
  },
];
