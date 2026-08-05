import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShipmentsViewTranslations } from '@core/i18n';
import { Dialog } from '@shared/ui/dialog/dialog';
import { Shipment, ShipmentCurrency } from '../../models/shipment.model';
import {
  ShipmentPaymentMethod,
  ShipmentReceiptVoucherDraft,
} from '../../models/shipment-details.model';

interface CurrencyOption {
  readonly value: ShipmentCurrency;
  readonly label: (t: ShipmentsViewTranslations) => string;
}

const CURRENCY_OPTIONS: readonly CurrencyOption[] = [
  { value: 'EGP', label: (t) => t.currencyEGP },
  { value: 'USD', label: (t) => t.currencyUSD },
  { value: 'KWD', label: (t) => t.currencyKWD },
  { value: 'SAR', label: (t) => t.currencySAR },
  { value: 'QAR', label: (t) => t.currencyQAR },
  { value: 'AED', label: (t) => t.currencyAED },
];

interface PaymentMethodOption {
  readonly value: ShipmentPaymentMethod;
  readonly label: (t: ShipmentsViewTranslations) => string;
}

const PAYMENT_METHOD_OPTIONS: readonly PaymentMethodOption[] = [
  { value: 'cash', label: (t) => t.paymentMethodCash },
  { value: 'transfer', label: (t) => t.paymentMethodTransfer },
  { value: 'bankDeposit', label: (t) => t.paymentMethodBankDeposit },
  { value: 'check', label: (t) => t.paymentMethodCheck },
  { value: 'card', label: (t) => t.paymentMethodCard },
];

@Component({
  selector: 'app-receipt-voucher-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, ReactiveFormsModule],
  templateUrl: './receipt-voucher-form-dialog.html',
  styleUrl: './receipt-voucher-form-dialog.scss',
})
export class ReceiptVoucherFormDialog implements OnInit, AfterViewInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly shipment = input.required<Shipment>();
  readonly text = input.required<ShipmentsViewTranslations>();

  readonly closed = output<void>();
  readonly saved = output<ShipmentReceiptVoucherDraft>();

  protected readonly currencyOptions = CURRENCY_OPTIONS;
  protected readonly paymentMethodOptions = PAYMENT_METHOD_OPTIONS;

  protected readonly shipmentCode = computed(
    () => `SH-${String(this.shipment().id).padStart(3, '0')}`,
  );

  protected readonly paidAmount = computed(
    () => this.shipment().finalValue - (this.shipment().remainingBalance ?? 0),
  );

  protected readonly form = this.formBuilder.nonNullable.group({
    currency: ['EGP' as ShipmentCurrency, Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    method: ['cash' as ShipmentPaymentMethod, Validators.required],
    referenceNo: [''],
    receivedBy: [''],
    notes: [''],
    printAfterSave: [true],
  });

  ngOnInit(): void {
    const shipment = this.shipment();
    this.form.patchValue({
      currency: shipment.currency,
      amount: shipment.remainingBalance ?? shipment.finalValue,
    });
  }

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected resolvedCurrencyLabel(option: CurrencyOption): string {
    return option.label(this.text());
  }

  protected resolvedMethodLabel(option: PaymentMethodOption): string {
    return option.label(this.text());
  }

  protected formatMoney(value: number): string {
    return `${value.toLocaleString('en-US')} ${this.shipment().currency}`;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.saved.emit({
      shipmentId: this.shipment().id,
      currency: raw.currency,
      amount: raw.amount,
      method: raw.method,
      referenceNo: raw.referenceNo,
      receivedBy: raw.receivedBy,
      notes: raw.notes,
      printAfterSave: raw.printAfterSave,
    });
  }
}
