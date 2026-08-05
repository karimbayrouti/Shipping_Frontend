import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CustomerViewTranslations } from '@core/i18n';
import { Dialog } from '@shared/ui/dialog/dialog';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-details-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog],
  templateUrl: './customer-details-dialog.html',
})
export class CustomerDetailsDialog {
  readonly customer = input.required<Customer>();
  readonly text = input.required<CustomerViewTranslations>();
  readonly closed = output<void>();
  readonly editRequested = output<Customer>();

  protected customerCode(): string {
    return `CUST-${String(this.customer().id).padStart(4, '0')}`;
  }
}
