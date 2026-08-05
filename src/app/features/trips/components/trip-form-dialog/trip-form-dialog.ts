import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from '@shared/ui/dialog/dialog';
import { TripsViewTranslations } from '@core/i18n';
import { TripAssignmentMode, TripDraft, TripPickableShipment } from '../../models/trip.model';
import { DRIVER_NAMES, TRIP_ASSIGNMENT_OPTIONS } from '../../trip-assignment-options.data';
import { buildTripRouteStops } from '../../utils/trip-route.util';
import { formatApproxEgp, toApproxEgp } from '../../utils/trip-currency.util';
import { renderDialogToBody } from '../../utils/render-dialog-to-body.util';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-trip-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Dialog],
  templateUrl: './trip-form-dialog.html',
  styleUrl: './trip-form-dialog.scss',
})
export class TripFormDialog {
  constructor() {
    renderDialogToBody();
  }

  readonly readyShipments = input.required<readonly TripPickableShipment[]>();
  readonly text = input.required<TripsViewTranslations>();
  readonly nextTripNo = input.required<string>();
  readonly nextWaybillNo = input.required<string>();
  /** Driver names currently on an in-progress trip — flagged as "in transit" in the driver/helper selects. */
  readonly busyDriverNames = input<ReadonlySet<string>>(new Set());

  readonly closed = output<void>();
  readonly saved = output<TripDraft>();

  protected readonly assignmentOptions = TRIP_ASSIGNMENT_OPTIONS;
  protected readonly driverNameOptions = DRIVER_NAMES;

  protected readonly tripStartDate = signal(todayIso());
  protected readonly expectedDeparture = signal(todayIso());
  protected readonly expectedArrival = signal('');
  protected readonly expectedReturn = signal('');
  protected readonly assignmentMode = signal<TripAssignmentMode>('internal');
  protected readonly selectedTruckPlate = signal('');
  protected readonly selectedDriverName = signal('');
  protected readonly selectedHelperName = signal('');
  protected readonly externalVehicleType = signal('');
  protected readonly externalModel = signal('');
  protected readonly externalPlateNumber = signal('');
  protected readonly externalCapacityKg = signal<number | null>(null);
  protected readonly externalOwnerName = signal('');
  protected readonly externalDriverName = signal('');
  protected readonly externalDriverPhone = signal('');
  protected readonly externalDriverPassport = signal('');
  protected readonly externalDriverNationality = signal('');
  protected readonly externalDriverLicense = signal('');
  protected readonly externalDriverLicenseExpiry = signal('');
  protected readonly driverAdvance = signal<number | null>(null);
  protected readonly shipmentSearch = signal('');
  protected readonly selectedShipmentIds = signal<ReadonlySet<number>>(new Set());
  protected readonly attemptedSave = signal(false);

  protected readonly filteredShipments = computed(() => {
    const query = this.shipmentSearch().trim().toLowerCase();
    const list = this.readyShipments();
    if (!query) return list;
    return list.filter(
      (shipment) =>
        shipment.shipmentNo.toLowerCase().includes(query) ||
        shipment.customerName.toLowerCase().includes(query) ||
        shipment.destinationCity.toLowerCase().includes(query),
    );
  });

  protected readonly selectedShipments = computed(() => {
    const ids = this.selectedShipmentIds();
    return this.readyShipments().filter((shipment) => ids.has(shipment.id));
  });

  protected readonly routeStops = computed(() => buildTripRouteStops(this.selectedShipments()));
  protected readonly stopsCount = computed(() => this.routeStops().length);
  protected readonly loadingLocationsCount = computed(
    () =>
      new Set(
        this.routeStops()
          .filter((stop) => stop.kind === 'origin')
          .map((stop) => stop.city),
      ).size,
  );
  protected readonly deliveryLocationsCount = computed(
    () =>
      new Set(
        this.routeStops()
          .filter((stop) => stop.kind === 'destination')
          .map((stop) => stop.city),
      ).size,
  );

  protected readonly totalPackages = computed(() =>
    this.selectedShipments().reduce((sum, shipment) => sum + shipment.packageCount, 0),
  );
  protected readonly totalWeightKg = computed(() =>
    this.selectedShipments().reduce((sum, shipment) => sum + shipment.weightKg, 0),
  );
  protected readonly totalRevenueLabel = computed(() => {
    const approxEgp = this.selectedShipments().reduce(
      (sum, shipment) => sum + toApproxEgp(shipment.rawValue, shipment.currency),
      0,
    );
    return formatApproxEgp(approxEgp);
  });

  protected readonly isInternalValid = computed(
    () => this.selectedTruckPlate() !== '' && this.selectedDriverName() !== '',
  );
  protected readonly isExternalValid = computed(
    () => this.externalPlateNumber().trim() !== '' && this.externalDriverName().trim() !== '',
  );
  protected readonly canSave = computed(() => {
    const assignmentValid =
      this.assignmentMode() === 'internal' ? this.isInternalValid() : this.isExternalValid();
    return assignmentValid && this.selectedShipmentIds().size > 0;
  });

  protected setAssignmentMode(mode: TripAssignmentMode): void {
    this.assignmentMode.set(mode);
  }

  protected toggleShipment(id: number, checked: boolean): void {
    this.selectedShipmentIds.update((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  protected isSelected(id: number): boolean {
    return this.selectedShipmentIds().has(id);
  }

  /** Appends the dynamic "in transit" suffix when the driver is on an in-progress trip. */
  protected driverOptionLabel(name: string): string {
    return this.busyDriverNames().has(name) ? `${name} ${this.text().formDriverBusyLabel}` : name;
  }

  protected submit(): void {
    this.attemptedSave.set(true);
    if (!this.canSave()) return;

    const draft: TripDraft = {
      tripStartDate: this.tripStartDate(),
      expectedDeparture: this.expectedDeparture(),
      expectedArrival: this.expectedArrival(),
      expectedReturn: this.expectedReturn(),
      assignmentMode: this.assignmentMode(),
      truckPlate:
        this.assignmentMode() === 'internal'
          ? this.selectedTruckPlate()
          : this.externalPlateNumber(),
      driverName:
        this.assignmentMode() === 'internal'
          ? this.selectedDriverName()
          : this.externalDriverName(),
      helperName: this.assignmentMode() === 'internal' ? this.selectedHelperName() : '',
      externalVehicle: {
        ownerName: this.externalOwnerName(),
        vehicleType: this.externalVehicleType(),
        model: this.externalModel(),
        plateNumber: this.externalPlateNumber(),
        capacityKg: this.externalCapacityKg(),
      },
      externalDriver: {
        name: this.externalDriverName(),
        phone: this.externalDriverPhone(),
        passportNo: this.externalDriverPassport(),
        nationality: this.externalDriverNationality(),
        license: this.externalDriverLicense(),
        licenseExpiry: this.externalDriverLicenseExpiry(),
      },
      driverAdvance: this.driverAdvance(),
      shipmentIds: [...this.selectedShipmentIds()],
    };
    this.saved.emit(draft);
  }
}
