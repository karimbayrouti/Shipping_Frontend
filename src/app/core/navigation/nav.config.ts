export interface NavItem {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly icon: string;
  readonly route: string;
  readonly badge?: number;
  readonly danger?: boolean;
}

export interface NavGroup {
  readonly titleAr: string;
  readonly titleEn: string;
  readonly items: readonly NavItem[];
}

/** Exact administrative-portal navigation structure from the Shipping Prototype. */
export const APP_NAV: readonly NavGroup[] = [
  {
    titleAr: 'نظرة عامة',
    titleEn: 'Overview',
    items: [
      {
        key: 'dashboard',
        labelAr: 'العمليات',
        labelEn: 'Operations',
        icon: '▦',
        route: '/portal/dashboard',
      },
    ],
  },
  {
    titleAr: 'العمليات',
    titleEn: 'Operations',
    items: [
      {
        key: 'shipments',
        labelAr: 'الشحنات',
        labelEn: 'Shipments',
        icon: '📦',
        route: '/portal/shipments',
        badge: 5,
      },
      {
        key: 'warehouses',
        labelAr: 'المستودعات',
        labelEn: 'Warehouses',
        icon: '🏬',
        route: '/portal/warehouses',
      },
      {
        key: 'loading',
        labelAr: 'تحميل الشاحنات',
        labelEn: 'Warehouse Loading',
        icon: '🏗️',
        route: '/portal/loading',
        badge: 2,
      },
      {
        key: 'trips',
        labelAr: 'بوالص الشحن',
        labelEn: 'Waybills',
        icon: '🚛',
        route: '/portal/trips',
      },
      {
        key: 'driverops',
        labelAr: 'عمليات السائقين',
        labelEn: 'Driver Operations',
        icon: '🛰️',
        route: '/portal/driver-operations',
      },
      {
        key: 'expenses',
        labelAr: 'المصروفات',
        labelEn: 'Expenses',
        icon: '⛽',
        route: '/portal/expenses',
      },
    ],
  },
  {
    titleAr: 'المالية',
    titleEn: 'Finance',
    items: [
      {
        key: 'invoices',
        labelAr: 'الفواتير',
        labelEn: 'Invoices',
        icon: '🧾',
        route: '/portal/invoices',
        badge: 1,
        danger: true,
      },
      {
        key: 'settlement',
        labelAr: 'تسوية السائق',
        labelEn: 'Driver Settlement',
        icon: '💳',
        route: '/portal/settlement',
        badge: 1,
        danger: true,
      },
    ],
  },
  {
    titleAr: 'الأسطول',
    titleEn: 'Fleet',
    items: [
      {
        key: 'trucks',
        labelAr: 'الشاحنات',
        labelEn: 'Trucks',
        icon: '🚚',
        route: '/portal/trucks',
      },
    ],
  },
  {
    titleAr: 'السجلّات',
    titleEn: 'Directory',
    items: [
      {
        key: 'customers',
        labelAr: 'العملاء',
        labelEn: 'Customers',
        icon: '👥',
        route: '/portal/customers',
      },
      {
        key: 'employees',
        labelAr: 'الموظفون',
        labelEn: 'Employees',
        icon: '🧑‍💼',
        route: '/portal/employees',
      },
      {
        key: 'ad-directory',
        labelAr: 'دليل الموظفين (AD)',
        labelEn: 'AD Directory',
        icon: '🗂️',
        route: '/portal/ad-directory',
      },
    ],
  },
  {
    titleAr: 'التحليلات',
    titleEn: 'Insights',
    items: [
      {
        key: 'reports',
        labelAr: 'التقارير',
        labelEn: 'Reports',
        icon: '📊',
        route: '/portal/reports',
      },
    ],
  },
];
