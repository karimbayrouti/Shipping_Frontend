import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrucksViewTranslations } from '@core/i18n';
import { Dialog } from '@shared/ui/dialog/dialog';
import { Truck, VehicleRecordDraft, VehicleRecordType, Currency } from '../../models/truck.model';

interface RecordTypeOption {
  readonly value: VehicleRecordType;
  readonly label: (t: TrucksViewTranslations) => string;
}

const RECORD_TYPE_OPTIONS: readonly RecordTypeOption[] = [
  { value: 'oilChange', label: (t) => t.vehicleRecordTypeOilChange },
  { value: 'engineMaint', label: (t) => t.vehicleRecordTypeEngineMaint },
  { value: 'brakeService', label: (t) => t.vehicleRecordTypeBrakeService },
  { value: 'tires', label: (t) => t.vehicleRecordTypeTires },
  { value: 'battery', label: (t) => t.vehicleRecordTypeBattery },
  { value: 'insurance', label: (t) => t.vehicleRecordTypeInsurance },
  { value: 'licenseRenewal', label: (t) => t.vehicleRecordTypeLicenseRenewal },
  { value: 'registration', label: (t) => t.vehicleRecordTypeRegistration },
  { value: 'inspection', label: (t) => t.vehicleRecordTypeInspection },
  { value: 'accident', label: (t) => t.vehicleRecordTypeAccident },
  { value: 'repair', label: (t) => t.vehicleRecordTypeRepair },
  { value: 'unexpectedFailure', label: (t) => t.vehicleRecordTypeUnexpectedFailure },
  { value: 'cleaning', label: (t) => t.vehicleRecordTypeCleaning },
  { value: 'fuel', label: (t) => t.vehicleRecordTypeFuel },
  { value: 'transmission', label: (t) => t.vehicleRecordTypeTransmission },
  { value: 'trafficViolation', label: (t) => t.vehicleRecordTypeTrafficViolation },
  { value: 'fine', label: (t) => t.vehicleRecordTypeFine },
  { value: 'govFees', label: (t) => t.vehicleRecordTypeGovFees },
  { value: 'accessories', label: (t) => t.vehicleRecordTypeAccessories },
  { value: 'otherExpense', label: (t) => t.vehicleRecordTypeOtherExpense },
];

@Component({
  selector: 'app-vehicle-record-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, ReactiveFormsModule],
  templateUrl: './vehicle-record-form-dialog.html',
  styleUrl: './vehicle-record-form-dialog.scss',
})
export class VehicleRecordFormDialog implements OnInit, AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly fb = inject(FormBuilder);

  readonly trucks = input.required<readonly Truck[]>();
  readonly text = input.required<TrucksViewTranslations>();
  /** Pre-selected truck id — passed when opening from the history dialog */
  readonly preselectedTruckId = input<number | null>(null);
  readonly closed = output<void>();
  readonly saved = output<VehicleRecordDraft>();

  protected readonly recordTypeOptions = RECORD_TYPE_OPTIONS;

  protected readonly currencies: readonly {
    value: Currency;
    label: (t: TrucksViewTranslations) => string;
  }[] = [
    { value: 'EGP', label: (t) => t.vehicleRecordCurrencyEGP },
    { value: 'USD', label: (t) => t.vehicleRecordCurrencyUSD },
    { value: 'SAR', label: (t) => t.vehicleRecordCurrencySAR },
    { value: 'QAR', label: (t) => t.vehicleRecordCurrencyQAR },
    { value: 'AED', label: (t) => t.vehicleRecordCurrencyAED },
  ];

  protected readonly form = this.fb.nonNullable.group({
    truckId: [null as number | null],
    recordType: ['oilChange' as VehicleRecordType, Validators.required],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    mileageKm: [null as number | null],
    cost: [null as number | null],
    currency: ['EGP' as Currency],
    supplier: [''],
    invoiceNo: [''],
    attachment: [''],
    nextServiceDate: [''],
    reminderDate: [''],
    status: ['done'],
    notes: [''],
  });

  ngOnInit(): void {
    const preId = this.preselectedTruckId();
    if (preId !== null) {
      this.form.patchValue({ truckId: preId });
    }
  }

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected resolvedLabel(opt: RecordTypeOption): string {
    return opt.label(this.text());
  }

  protected resolvedCurrencyLabel(c: (typeof this.currencies)[number]): string {
    return c.label(this.text());
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.saved.emit({
      truckId: raw.truckId,
      recordType: raw.recordType as VehicleRecordType,
      date: raw.date ?? '',
      mileageKm: raw.mileageKm,
      cost: raw.cost,
      currency: raw.currency as Currency,
      supplier: raw.supplier,
      invoiceNo: raw.invoiceNo,
      attachment: raw.attachment,
      nextServiceDate: raw.nextServiceDate,
      reminderDate: raw.reminderDate,
      status: raw.status as 'done' | 'scheduled' | 'pending',
      notes: raw.notes,
    });
  }
}
