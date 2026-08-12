import { Routes } from '@angular/router';
import { ShellLayout } from '@layout/shell/shell-layout';

const comingSoon = () =>
  import('@features/coming-soon/pages/coming-soon.page').then((m) => m.ComingSoonPage);

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'portal' },
  {
    path: 'portal',
    children: [
      {
        path: '',
        title: 'تسجيل الدخول · نظام إدارة الشحن',
        loadComponent: () =>
          import('@features/auth/pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: '',
        component: ShellLayout,
        children: [
          {
            path: 'dashboard',
            title: 'العمليات · نظام إدارة الشحن',
            loadComponent: () =>
              import('@features/operations-dashboard/pages/operations-dashboard.page').then(
                (m) => m.OperationsDashboardPage,
              ),
          },
          {
            path: 'customers',
            loadChildren: () =>
              import('@features/customers/customers.routes').then((m) => m.customersRoutes),
          },
          {

            path: 'shipments',
            loadChildren: () =>
              import('@features/shipments/shipments.routes').then((m) => m.shipmentsRoutes),
},{
            path: 'employees',
            title: 'الموظٝون · نظام إدارة الشحن',
            loadChildren: () =>
              import('@features/employees/employees.routes').then((m) => m.employeesRoutes),

          },
          {
            path: 'ad-directory',
            title: 'دليل الموظفين · نظام إدارة الشحن',
            loadChildren: () =>
              import('@features/ad-directory/ad-directory.routes').then(
                (m) => m.adDirectoryRoutes,
              ),
          },
          {
            path: 'warehouses',
            title: 'المستودعات · نظام إدارة الشحن',
            loadComponent: () => comingSoon(),
            data: { pageKey: 'warehouses' },
          },
          {
            path: 'loading',
            title: 'تحميل الشاحنات · نظام إدارة الشحن',
            loadComponent: () => comingSoon(),
            data: { pageKey: 'loading' },
          },
          {
            path: 'trips',
            loadChildren: () => import('@features/trips/trips.routes').then((m) => m.tripsRoutes),
          },
          {
            path: 'driver-operations',
            title: 'عمليات السائقين · نظام إدارة الشحن',
            loadComponent: () => comingSoon(),
            data: { pageKey: 'driverops' },
          },
          {
            path: 'expenses',
            title: 'المصروٝات · نظام إدارة الشحن',
            loadComponent: () => comingSoon(),
            data: { pageKey: 'expenses' },
          },
          {
            path: 'invoices',
            title: 'الٝواتير · نظام إدارة الشحن',
            loadComponent: () => comingSoon(),
            data: { pageKey: 'invoices' },
          },
          {
            path: 'settlement',
            title: 'تسوية السائق · نظام إدارة الشحن',
            loadComponent: () => comingSoon(),
            data: { pageKey: 'settlement' },
          },
          {
            path: 'trucks',
            loadChildren: () =>
              import('@features/trucks/trucks.routes').then((m) => m.trucksRoutes),
          },
   {
            path: 'employees',
            title: 'الموظٝون · نظام إدارة الشحن',
            loadComponent: () => comingSoon(),
            data: { pageKey: 'employees' },
          },
          {
            path: 'reports',
            title: 'التقارير · نظام إدارة الشحن',
            loadComponent: () => comingSoon(),
            data: { pageKey: 'reports' },
          },
          {
            path: 'driver',
            title: 'بوابة السائق · نظام إدارة الشحن',
            loadComponent: () => comingSoon(),
            data: { pageKey: 'driverops' },
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'portal' },
];
