import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Customer, CustomerSort, CustomerSortKey } from '../../models/customer.model';
import { CustomerViewTranslations } from '@core/i18n';

@Component({
  selector: 'app-customer-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './customer-table.html',
  styleUrl: './customer-table.scss',
})
export class CustomerTable {
  readonly rows = input.required<readonly Customer[]>();
  readonly total = input.required<number>();
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly pageCount = input.required<number>();
  readonly sort = input.required<CustomerSort>();
  readonly text = input.required<CustomerViewTranslations>();
  readonly locale = input.required<'ar' | 'en'>();

  readonly pageChange = output<number>();
  readonly sortChange = output<CustomerSortKey>();
  readonly viewCustomer = output<Customer>();
  readonly editCustomer = output<Customer>();

  protected customerCode(id: number): string {
    return `CUST-${String(id).padStart(4, '0')}`;
  }

  protected initials(name: string): string {
    return name.trim().charAt(0);
  }

  protected formatNumber(value: number): string {
    return value.toLocaleString('en-US');
  }

  protected startIndex(): number {
    return this.total() === 0 ? 0 : this.page() * this.pageSize() + 1;
  }

  protected endIndex(): number {
    return Math.min((this.page() + 1) * this.pageSize(), this.total());
  }

  protected previousSymbol(): string {
    return this.locale() === 'ar' ? '›' : '‹';
  }

  protected nextSymbol(): string {
    return this.locale() === 'ar' ? '‹' : '›';
  }

  protected sortSymbol(key: CustomerSortKey): string {
    if (this.sort().key !== key) return '';
    return this.sort().direction === 'asc' ? '▲' : '▼';
  }

  protected ariaSort(key: CustomerSortKey): 'ascending' | 'descending' | 'none' {
    if (this.sort().key !== key) return 'none';
    return this.sort().direction === 'asc' ? 'ascending' : 'descending';
  }

  protected openRow(customer: Customer): void {
    this.viewCustomer.emit(customer);
  }

  protected onRowKeydown(event: KeyboardEvent, customer: Customer): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.openRow(customer);
  }

  protected view(event: Event, customer: Customer): void {
    event.stopPropagation();
    this.viewCustomer.emit(customer);
  }

  protected edit(event: Event, customer: Customer): void {
    event.stopPropagation();
    this.editCustomer.emit(customer);
  }
}
