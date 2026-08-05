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
import { Truck, TruckDraft, TransportType, TruckStatus } from '../../models/truck.model';

@Component({
  selector: 'app-truck-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Dialog],
  templateUrl: './truck-form-dialog.html',
  styleUrl: './truck-form-dialog.scss',
})
export class TruckFormDialog implements OnInit, AfterViewInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly truck = input<Truck | null>(null);
  readonly text = input.required<TrucksViewTranslations>();
  readonly closed = output<void>();
  readonly saved = output<TruckDraft>();

  protected readonly form = this.formBuilder.nonNullable.group({
    // Vehicle Information
    plateNumber: ['', Validators.required],
    vehicleType: ['', Validators.required],
    vehicleModel: ['', Validators.required],
    vehicleColor: ['', Validators.required],
    capacityKg: [0, [Validators.required, Validators.min(1)]],
    transportType: ['owned' as TransportType, Validators.required],
    vehicleLicenseNo: ['', Validators.required],
    licenseExpiry: ['', Validators.required],
    // Assignment
    status: ['available' as TruckStatus, Validators.required],
    driverName: [null as string | null],
    // Owner Information
    ownerName: ['مؤسسة الرماح', Validators.required],
    ownerPhone: [''],
    ownerAddress: [''],
  });

  ngOnInit(): void {
    const truck = this.truck();
    if (truck) {
      this.form.reset({
        plateNumber: truck.plateNumber,
        vehicleType: truck.vehicleType,
        vehicleModel: truck.vehicleModel,
        vehicleColor: truck.vehicleColor,
        capacityKg: truck.capacityKg,
        transportType: truck.transportType,
        vehicleLicenseNo: truck.vehicleLicenseNo,
        licenseExpiry: truck.licenseExpiry,
        status: truck.status,
        driverName: truck.driverName,
        ownerName: truck.ownerName,
        ownerPhone: truck.ownerPhone,
        ownerAddress: truck.ownerAddress,
      });
    }
  }

  ngAfterViewInit(): void {
    // Move host to <body> to escape .app-shell's stacking context.
    // Angular holds the ElementRef regardless of DOM position, so it will
    // correctly remove the element from <body> when @if destroys this view —
    // no manual restore needed (restoring caused a ghost "old modal" flash).
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saved.emit(this.form.getRawValue());
  }
}
