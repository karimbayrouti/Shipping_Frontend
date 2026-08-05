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
import { ShipmentsViewTranslations } from '@core/i18n';
import { LanguageService } from '@core/i18n/language.service';
import { StorageService } from '@core/storage/storage.service';
import { Dialog } from '@shared/ui/dialog/dialog';
import { Shipment } from '../../models/shipment.model';
import {
  ShipmentDetails,
  ShipmentDiscountDraft,
  ShipmentDiscountType,
} from '../../models/shipment-details.model';
import { resolveCurrencySymbol } from '../../utils/currency.util';
import { calculateDiscountAmount } from '../../utils/discount.util';

/** Mirrors the session shape written by the login page (Charter AD-26: StorageService only). */
interface PortalSession {
  readonly role: string;
  readonly user: string;
}

const DEFAULT_APPROVER_NAME = 'محمود عبد الحليم';

@Component({
  selector: 'app-apply-discount-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, ReactiveFormsModule],
  templateUrl: './apply-discount-dialog.html',
  styleUrl: './apply-discount-dialog.scss',
})
export class ApplyDiscountDialog implements AfterViewInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly language = inject(LanguageService);
  private readonly storage = inject(StorageService);

  readonly shipment = input.required<Shipment>();
  readonly details = input.required<ShipmentDetails>();
  readonly text = input.required<ShipmentsViewTranslations>();

  readonly closed = output<void>();
  readonly applied = output<ShipmentDiscountDraft>();

  protected readonly form = this.formBuilder.nonNullable.group({
    discountType: ['percentage' as ShipmentDiscountType, Validators.required],
    value: [0, [Validators.required, Validators.min(0.01)]],
    reason: [''],
    notes: [''],
  });

  protected readonly approvedByName = this.resolveApprovedByName();
  protected readonly approvedAtLabel = this.formatTimestamp(new Date());

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected shipmentCode(): string {
    return `SH-${String(this.shipment().id).padStart(3, '0')}`;
  }

  protected currencySymbol(): string {
    return resolveCurrencySymbol(this.details().financial.currency, this.language.language());
  }

  protected valueUnitLabel(): string {
    return this.form.controls.discountType.value === 'percentage' ? '%' : this.currencySymbol();
  }

  protected discountAmount(): number {
    const raw = this.form.getRawValue();
    return calculateDiscountAmount(
      raw.discountType,
      raw.value,
      this.details().financial.priceBeforeDiscount,
    );
  }

  protected priceAfterDiscount(): number {
    return this.details().financial.priceBeforeDiscount - this.discountAmount();
  }

  protected canApply(): boolean {
    return this.discountAmount() > 0;
  }

  protected formatMoney(value: number): string {
    return `${value.toLocaleString('en-US')} ${this.currencySymbol()}`;
  }

  protected submit(): void {
    if (!this.canApply()) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.applied.emit({
      shipmentId: this.shipment().id,
      discountType: raw.discountType,
      value: raw.value,
      reason: raw.reason,
      notes: raw.notes,
    });
  }

  private resolveApprovedByName(): string {
    const session = this.storage.get<PortalSession>('portal-session');
    return session?.user ?? DEFAULT_APPROVER_NAME;
  }

  private formatTimestamp(date: Date): string {
    const pad = (value: number) => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
