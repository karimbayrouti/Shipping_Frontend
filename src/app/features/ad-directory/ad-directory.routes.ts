import { Routes } from '@angular/router';

export const adDirectoryRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/ad-directory.page').then((m) => m.AdDirectoryPage),
  },
];
