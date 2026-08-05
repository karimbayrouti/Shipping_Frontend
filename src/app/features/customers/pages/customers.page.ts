import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '@core/i18n/language.service';
import { CustomerDetailsDialog } from '../components/customer-details-dialog/customer-details-dialog';
import { CustomerFormDialog } from '../components/customer-form-dialog/customer-form-dialog';
import { CustomerTable } from '../components/customer-table/customer-table';
import { CUSTOMER_FIXTURES } from '../customers.data';
import { Customer, CustomerDraft, CustomerSort, CustomerSortKey } from '../models/customer.model';

const PAGE_SIZE = 8;

type DialogState =
  | { readonly kind: 'closed' }
  | { readonly kind: 'details'; readonly customer: Customer }
  | { readonly kind: 'form'; readonly customer: Customer | null };

@Component({
  selector: 'app-customers-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CustomerTable, CustomerDetailsDialog, CustomerFormDialog],
  templateUrl: './customers.page.html',
  styleUrl: './customers.page.scss',
})
export class CustomersPage {
  private readonly language = inject(LanguageService);

  protected readonly text = computed(() => ({
    ...this.language.translations().customers,
    ...this.language.translations().common.actions,
  }));
  protected readonly locale = this.language.language;
  protected readonly customers = signal<readonly Customer[]>(CUSTOMER_FIXTURES);
  protected readonly query = signal('');
  protected readonly page = signal(0);
  protected readonly sort = signal<CustomerSort>({ key: null, direction: 'asc' });
  protected readonly dialog = signal<DialogState>({ kind: 'closed' });
  protected readonly detailsCustomer = computed(() => {
    const dialog = this.dialog();
    return dialog.kind === 'details' ? dialog.customer : null;
  });
  protected readonly formCustomer = computed(() => {
    const dialog = this.dialog();
    return dialog.kind === 'form' ? dialog.customer : null;
  });
  protected readonly isFormOpen = computed(() => this.dialog().kind === 'form');

  protected readonly totalShipments = computed(() =>
    this.customers().reduce((total, customer) => total + customer.shipmentCount, 0),
  );
  protected readonly totalReceivables = computed(() =>
    this.customers().reduce((total, customer) => total + customer.balance, 0),
  );
  protected readonly filteredCustomers = computed(() => {
    const query = this.query().trim().toLocaleLowerCase(this.locale());
    if (!query) return this.customers();
    return this.customers().filter((customer) =>
      [customer.name, customer.phone, customer.email, customer.city].some((value) =>
        value.toLocaleLowerCase(this.locale()).includes(query),
      ),
    );
  });
  protected readonly sortedCustomers = computed(() => {
    const sort = this.sort();
    const key = sort.key;
    if (!key) return this.filteredCustomers();
    return [...this.filteredCustomers()].sort((left, right) => {
      const result = this.compare(left[key], right[key]);
      return sort.direction === 'asc' ? result : -result;
    });
  });
  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.sortedCustomers().length / PAGE_SIZE)),
  );
  protected readonly visibleCustomers = computed(() => {
    const validPage = Math.min(this.page(), this.pageCount() - 1);
    const start = validPage * PAGE_SIZE;
    return this.sortedCustomers().slice(start, start + PAGE_SIZE);
  });

  protected readonly pageSize = PAGE_SIZE;

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.page.set(0);
  }

  protected changeSort(key: CustomerSortKey): void {
    this.sort.update((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
    this.page.set(0);
  }

  protected changePage(page: number): void {
    this.page.set(Math.max(0, Math.min(page, this.pageCount() - 1)));
  }

  protected openDetails(customer: Customer): void {
    this.dialog.set({ kind: 'details', customer });
  }

  protected openForm(customer: Customer | null = null): void {
    this.dialog.set({ kind: 'form', customer });
  }

  protected editFromDetails(customer: Customer): void {
    this.openForm(customer);
  }

  protected closeDialog(): void {
    this.dialog.set({ kind: 'closed' });
  }

  protected saveCustomer(draft: CustomerDraft): void {
    const dialog = this.dialog();
    if (dialog.kind !== 'form') return;

    if (dialog.customer) {
      this.customers.update((customers) =>
        customers.map((customer) =>
          customer.id === dialog.customer?.id ? { ...customer, ...draft } : customer,
        ),
      );
    } else {
      const id = Math.max(0, ...this.customers().map((customer) => customer.id)) + 1;
      this.customers.update((customers) => [
        ...customers,
        { ...draft, id, shipmentCount: 0, revenue: 0, balance: 0 },
      ]);
    }
    this.closeDialog();
  }

  protected formatNumber(value: number): string {
    return value.toLocaleString('en-US');
  }

  private compare(left: string | number, right: string | number): number {
    if (typeof left === 'number' && typeof right === 'number') return left - right;
    return String(left).localeCompare(String(right), this.locale());
  }
}
