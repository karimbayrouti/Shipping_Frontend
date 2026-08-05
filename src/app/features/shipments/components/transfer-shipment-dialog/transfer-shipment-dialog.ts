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
import { Shipment, ShipmentWarehouse } from '../../models/shipment.model';
import { ShipmentTransferDraft } from '../../models/shipment-details.model';

interface WarehouseOption {
  readonly value: ShipmentWarehouse;
  readonly label: (t: ShipmentsViewTranslations) => string;
}

const WAREHOUSE_OPTIONS: readonly WarehouseOption[] = [
  { value: 'cairo', label: (t) => t.warehouseCairo },
  { value: 'alexandria', label: (t) => t.warehouseAlexandria },
  { value: 'kuwait', label: (t) => t.warehouseKuwait },
  { value: 'doha', label: (t) => t.warehouseDoha },
];

@Component({
  selector: 'app-transfer-shipment-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, ReactiveFormsModule],
  templateUrl: './transfer-shipment-dialog.html',
  styleUrl: './transfer-shipment-dialog.scss',
})
export class TransferShipmentDialog implements OnInit, AfterViewInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly shipment = input.required<Shipment>();
  readonly text = input.required<ShipmentsViewTranslations>();

  readonly closed = output<void>();
  readonly transferred = output<ShipmentTransferDraft>();

  protected readonly shipmentCode = computed(
    () => `SH-${String(this.shipment().id).padStart(3, '0')}`,
  );

  /** Destination list excludes the shipment's current warehouse. */
  protected readonly destinationOptions = computed(() =>
    WAREHOUSE_OPTIONS.filter((option) => option.value !== this.shipment().warehouse),
  );

  protected readonly form = this.formBuilder.nonNullable.group({
    targetWarehouse: ['alexandria' as ShipmentWarehouse, Validators.required],
  });

  ngOnInit(): void {
    const firstDestination = this.destinationOptions()[0]?.value;
    if (firstDestination) {
      this.form.patchValue({ targetWarehouse: firstDestination });
    }
  }

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected resolvedLabel(option: WarehouseOption): string {
    return option.label(this.text());
  }

  protected warehouseLabel(warehouse: ShipmentWarehouse): string {
    const map: Record<ShipmentWarehouse, string> = {
      cairo: this.text().warehouseCairo,
      alexandria: this.text().warehouseAlexandria,
      kuwait: this.text().warehouseKuwait,
      doha: this.text().warehouseDoha,
    };
    return map[warehouse];
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.transferred.emit({
      shipmentId: this.shipment().id,
      targetWarehouse: this.form.getRawValue().targetWarehouse,
    });
  }
}
