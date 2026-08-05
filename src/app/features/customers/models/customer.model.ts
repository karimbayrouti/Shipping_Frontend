export interface Customer {
  readonly id: number;
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly city: string;
  readonly governorate: string;
  readonly country: string;
  readonly notes: string;
  readonly shipmentCount: number;
  readonly revenue: number;
  readonly balance: number;
}

export type CustomerDraft = Pick<
  Customer,
  'name' | 'phone' | 'email' | 'city' | 'governorate' | 'country' | 'notes'
>;

export type CustomerSortKey =
  'name' | 'phone' | 'email' | 'city' | 'shipmentCount' | 'revenue' | 'balance';

export interface CustomerSort {
  readonly key: CustomerSortKey | null;
  readonly direction: 'asc' | 'desc';
}
