import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerViewTranslations } from '@core/i18n';
import { Dialog } from '@shared/ui/dialog/dialog';
import { Customer, CustomerDraft } from '../../models/customer.model';

@Component({
  selector: 'app-customer-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Dialog],
  templateUrl: './customer-form-dialog.html',
  styleUrl: './customer-form-dialog.scss',
})
export class CustomerFormDialog implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly customer = input<Customer | null>(null);
  readonly text = input.required<CustomerViewTranslations>();
  readonly closed = output<void>();
  readonly saved = output<CustomerDraft>();

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.email],
    city: ['', Validators.required],
    governorate: ['', Validators.required],
    country: ['مصر', Validators.required],
    notes: [''],
  });

  ngOnInit(): void {
    const customer = this.customer();
    if (customer) this.form.reset(customer);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saved.emit(this.form.getRawValue());
  }
}
