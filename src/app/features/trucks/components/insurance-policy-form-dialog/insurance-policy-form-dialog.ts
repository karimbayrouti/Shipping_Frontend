import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrucksViewTranslations } from '@core/i18n';
import { Dialog } from '@shared/ui/dialog/dialog';
import { Truck, InsurancePolicyDraft, Currency } from '../../models/truck.model';

@Component({
  selector: 'app-insurance-policy-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Dialog],
  templateUrl: './insurance-policy-form-dialog.html',
  styleUrl: './insurance-policy-form-dialog.scss',
})
export class InsurancePolicyFormDialog implements AfterViewInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly trucks = input.required<readonly Truck[]>();
  readonly text = input.required<TrucksViewTranslations>();
  readonly closed = output<void>();
  readonly saved = output<InsurancePolicyDraft>();

  protected readonly currencies: readonly Currency[] = ['EGP', 'USD', 'SAR', 'QAR', 'AED'];

  protected readonly form = this.formBuilder.nonNullable.group({
    truckId: [null as number | null, Validators.required],
    insuranceCompany: ['', Validators.required],
    country: [''],
    policyNo: [''],
    coverageType: [''],
    issueDate: [new Date().toISOString().slice(0, 10)],
    expiryDate: [''],
    policyCost: [null as number | null],
    currency: ['EGP' as Currency],
    attachment: [''],
    notes: [''],
  });

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected currencyLabel(currency: Currency): string {
    const t = this.text();
    const map: Record<Currency, string> = {
      EGP: t.insuranceCurrencyEGP,
      USD: t.insuranceCurrencyUSD,
      SAR: t.insuranceCurrencySAR,
      QAR: t.insuranceCurrencyQAR,
      AED: t.insuranceCurrencyAED,
    };
    return map[currency];
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.saved.emit({
      ...raw,
      policyCost: raw.policyCost ?? null,
    });
  }
}
