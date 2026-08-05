import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '@core/i18n/language.service';
import { TripsViewTranslations } from '@core/i18n';
import { TruckFormDialog } from '../components/truck-form-dialog/truck-form-dialog';
import { InsurancePolicyFormDialog } from '../components/insurance-policy-form-dialog/insurance-policy-form-dialog';
import { VehicleHistoryDialog } from '../components/vehicle-history-dialog/vehicle-history-dialog';
import { VehicleRecordFormDialog } from '../components/vehicle-record-form-dialog/vehicle-record-form-dialog';
import { TruckTable } from '../components/truck-table/truck-table';
import { TRUCK_FIXTURES } from '../trucks.data';
import {
  Truck,
  TruckDraft,
  TruckStatus,
  InsurancePolicyDraft,
  VehicleRecordDraft,
} from '../models/truck.model';
/**
 * Scoped, deliberate exception to the feature-isolation rule (Charter AD-03).
 * The truck history dialog's "print selected waybills" action opens the
 * trip-details view that already exists in the trips feature; duplicating
 * it here would violate the "reuse, don't recreate" requirement instead.
 * If this pairing grows, promote TripDetailsDialog (and its Trip model)
 * into `shared/`.
 */
// eslint-disable-next-line boundaries/element-types -- see comment above
import { Trip, TripShipmentRow } from '@features/trips/models/trip.model';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { TRIP_FIXTURES } from '@features/trips/trips.data';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { TripDetailsDialog } from '@features/trips/components/trip-details-dialog/trip-details-dialog';
import {
  toTripAdvanceReceiptData,
  toTripManifestData,
  toTripReceiptBatchData,
  toTripSingleWaybillData,
  toTripWaybillBatchData,
  // eslint-disable-next-line boundaries/element-types -- see comment above
} from '@features/trips/utils/trip-print.util';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { WAREHOUSE_CITY_LABEL } from '@features/trips/utils/trip-route.util';
/**
 * Scoped, deliberate exception to the feature-isolation rule (Charter AD-03).
 * A trip's shipments are shipments — reusing ShipmentDetailsDialog for the
 * trip-details "shipment clicked" action avoids duplicating a second copy
 * of the shipment-details view here.
 */
// eslint-disable-next-line boundaries/element-types -- see comment above
import { ShipmentDetailsDialog } from '@features/shipments/components/shipment-details-dialog/shipment-details-dialog';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { SHIPMENT_FIXTURES } from '@features/shipments/shipments.data';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { SHIPMENT_DETAILS_FIXTURES } from '@features/shipments/shipment-details.data';
import type {
  ShipmentDocumentKind,
  // eslint-disable-next-line boundaries/element-types -- see comment above
} from '@features/shipments/models/shipment-details.model';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { resolveCurrencySymbol } from '@features/shipments/utils/currency.util';
import {
  toDeliveryReceiptPrintData,
  toPackingListPrintData,
  toReceivingReceiptPrintData,
  // eslint-disable-next-line boundaries/element-types -- see comment above
} from '@features/shipments/utils/shipment-print-report.util';
/**
 * Scoped, deliberate exception to the feature-isolation rule (Charter AD-03).
 * Trip/shipment printing reuses the print-report dialogs owned by the
 * reports feature instead of duplicating them here.
 */
import {
  AdvanceReceiptDialog,
  AdvanceReceiptPrintData,
  DeliveryReceiptDialog,
  DeliveryReceiptPrintData,
  LoadingManifestDialog,
  PackingListDialog,
  PackingListPrintData,
  ReceiptBatchData,
  ReceiptBatchDialog,
  ReceiptShipmentRow,
  ReceivingReceiptDialog,
  TripManifestData,
  WaybillBatchData,
  WaybillBatchDialog,
  WaybillDialog,
  WaybillShipmentRow,
  // eslint-disable-next-line boundaries/element-types -- see comment above
} from '@features/reports';

/** Maps a shipment status to its translation key — used to label trip-details shipment rows. */
const SHIPMENT_STATUS_KEYS = {
  draft: 'statusDraft',
  ready: 'statusReady',
  assigned: 'statusAssigned',
  loaded: 'statusLoaded',
  inTransit: 'statusInTransit',
  delivered: 'statusDelivered',
  returned: 'statusReturned',
  cancelled: 'statusCancelled',
  closed: 'statusClosed',
} as const;

type DialogState =
  | { readonly kind: 'closed' }
  | { readonly kind: 'form'; readonly truck: Truck | null }
  | { readonly kind: 'insurance'; readonly truckId: number | null }
  | { readonly kind: 'history'; readonly truck: Truck }
  | { readonly kind: 'vehicleRecord'; readonly truckId: number | null };

@Component({
  selector: 'app-trucks-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TruckTable,
    TruckFormDialog,
    InsurancePolicyFormDialog,
    VehicleHistoryDialog,
    VehicleRecordFormDialog,
    TripDetailsDialog,
    ShipmentDetailsDialog,
    LoadingManifestDialog,
    WaybillBatchDialog,
    ReceiptBatchDialog,
    WaybillDialog,
    AdvanceReceiptDialog,
    ReceivingReceiptDialog,
    PackingListDialog,
    DeliveryReceiptDialog,
  ],
  templateUrl: './trucks.page.html',
  styleUrl: './trucks.page.scss',
})
export class TrucksPage {
  private readonly language = inject(LanguageService);

  protected readonly text = computed(() => ({
    ...this.language.translations().trucks,
    ...this.language.translations().common.actions,
  }));
  protected readonly tripText = computed<TripsViewTranslations>(() => ({
    ...this.language.translations().trips,
    ...this.language.translations().common.actions,
  }));
  protected readonly shipmentsText = computed(() => ({
    ...this.language.translations().shipments,
    ...this.language.translations().common.actions,
  }));

  protected readonly trucks = signal<readonly Truck[]>(TRUCK_FIXTURES);
  protected readonly query = signal('');
  protected readonly dialog = signal<DialogState>({ kind: 'closed' });

  protected readonly isFormOpen = computed(() => this.dialog().kind === 'form');
  protected readonly isInsuranceOpen = computed(() => this.dialog().kind === 'insurance');
  protected readonly isHistoryOpen = computed(() => this.dialog().kind === 'history');
  protected readonly isVehicleRecordOpen = computed(() => this.dialog().kind === 'vehicleRecord');

  protected readonly formTruck = computed(() => {
    const d = this.dialog();
    return d.kind === 'form' ? d.truck : null;
  });

  protected readonly historyTruck = computed(() => {
    const d = this.dialog();
    return d.kind === 'history' ? d.truck : null;
  });

  protected readonly insuranceTruckId = computed(() => {
    const d = this.dialog();
    return d.kind === 'insurance' ? d.truckId : null;
  });

  protected readonly vehicleRecordTruckId = computed(() => {
    const d = this.dialog();
    return d.kind === 'vehicleRecord' ? d.truckId : null;
  });

  protected readonly tripDetailsTripNo = signal<string | null>(null);
  protected readonly selectedShipmentDetailsId = signal<number | null>(null);
  protected readonly tripManifestPrintData = signal<TripManifestData | null>(null);
  protected readonly tripWaybillBatchPrintData = signal<WaybillBatchData | null>(null);
  protected readonly tripReceiptBatchPrintData = signal<ReceiptBatchData | null>(null);
  protected readonly tripWaybillPrintData = signal<WaybillShipmentRow | null>(null);
  protected readonly tripAdvanceReceiptPrintData = signal<AdvanceReceiptPrintData | null>(null);
  protected readonly receivingReceiptPrintData = signal<ReceiptShipmentRow | null>(null);
  protected readonly packingListPrintData = signal<PackingListPrintData | null>(null);
  protected readonly deliveryReceiptPrintData = signal<DeliveryReceiptPrintData | null>(null);

  protected readonly tripDetailsTrip = computed<Trip | null>(() => {
    const tripNo = this.tripDetailsTripNo();
    if (!tripNo) return null;
    return TRIP_FIXTURES.find((trip) => trip.tripNo === tripNo) ?? null;
  });

  protected readonly tripDetailsRows = computed<readonly TripShipmentRow[]>(() => {
    const trip = this.tripDetailsTrip();
    return trip ? this.buildTripShipmentRows(trip) : [];
  });

  protected readonly selectedShipmentDetails = computed(() => {
    const id = this.selectedShipmentDetailsId();
    return id === null ? null : (SHIPMENT_DETAILS_FIXTURES.find((d) => d.id === id) ?? null);
  });

  protected readonly filteredTrucks = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.trucks();
    return this.trucks().filter((truck) =>
      [truck.plateNumber, truck.vehicleType, truck.driverName ?? '', truck.vehicleColor].some(
        (field) => field.toLowerCase().includes(q),
      ),
    );
  });

  protected readonly onRoadCount = computed(
    () => this.trucks().filter((t) => t.status === 'onRoad').length,
  );
  protected readonly availableCount = computed(
    () => this.trucks().filter((t) => t.status === 'available').length,
  );
  protected readonly offDutyCount = computed(
    () => this.trucks().filter((t) => t.status === 'offDuty').length,
  );
  protected readonly totalCapacityKg = computed(() =>
    this.trucks().reduce((sum, t) => sum + t.capacityKg, 0),
  );
  protected readonly onRoadPercent = computed(() =>
    Math.round((this.onRoadCount() / this.trucks().length) * 100),
  );
  protected readonly availablePercent = computed(() =>
    Math.round((this.availableCount() / this.trucks().length) * 100),
  );

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected openAddTruckModal(): void {
    this.dialog.set({ kind: 'form', truck: null });
  }

  protected openEditTruckModal(truck: Truck): void {
    this.dialog.set({ kind: 'form', truck });
  }

  protected closeDialog(): void {
    this.dialog.set({ kind: 'closed' });
  }

  protected saveTruck(draft: TruckDraft): void {
    const d = this.dialog();
    if (d.kind !== 'form') return;

    if (d.truck) {
      this.trucks.update((list) =>
        list.map((t) => (t.id === d.truck?.id ? { ...t, ...draft } : t)),
      );
    } else {
      const id = Math.max(0, ...this.trucks().map((t) => t.id)) + 1;
      this.trucks.update((list) => [
        ...list,
        {
          ...draft,
          id,
          insurance: null,
          maintenanceCostEgp: 0,
          stats: {
            currentDriver: draft.driverName ?? '—',
            currentTrip: null,
            totalTrips: 0,
            tripsThisMonth: 0,
            distanceKm: '—',
            revenue: '—',
            expenses: '—',
            maintenanceCost: '—',
            fuelCost: '—',
            fines: 0,
            thisMonthCost: '—',
            thisYearCost: '—',
            currentMileageKm: '—',
            openReminders: 0,
            renewalCount: 0,
            renewalBannerText: '',
            renewalBannerTextEn: '',
            currentTripNo: null,
            currentTripShipments: null,
          },
          vehicleRecords: [],
          insuranceRecords: [],
          trips: [],
          timeline: [],
        },
      ]);
    }
    this.closeDialog();
  }

  protected openAddInsurancePolicyModal(): void {
    this.dialog.set({ kind: 'insurance', truckId: null });
  }

  protected saveInsurancePolicy(draft: InsurancePolicyDraft): void {
    void draft;
    this.closeDialog();
  }

  protected openAddVehicleRecordModal(): void {
    this.dialog.set({ kind: 'vehicleRecord', truckId: null });
  }

  protected saveVehicleRecord(draft: VehicleRecordDraft): void {
    void draft;
    this.closeDialog();
  }

  protected openVehicleHistoryModal(truck: Truck): void {
    this.dialog.set({ kind: 'history', truck });
  }

  protected openEditFromHistory(truck: Truck): void {
    this.dialog.set({ kind: 'form', truck });
  }

  /** Called when the user clicks "Add Insurance Policy" inside the history dialog */
  protected openInsuranceFromHistory(truck: Truck): void {
    this.dialog.set({ kind: 'insurance', truckId: truck.id });
  }

  /** Called when the user clicks "Add Vehicle Record" inside the history dialog */
  protected openVehicleRecordFromHistory(truck: Truck): void {
    this.dialog.set({ kind: 'vehicleRecord', truckId: truck.id });
  }

  /** Called when the user clicks "Print Selected Waybills" inside the history dialog */
  protected openTripDetailsFromHistory(tripNo: string): void {
    this.tripDetailsTripNo.set(tripNo);
  }

  protected closeTripDetailsDialog(): void {
    this.tripDetailsTripNo.set(null);
    this.tripManifestPrintData.set(null);
    this.tripWaybillBatchPrintData.set(null);
    this.tripReceiptBatchPrintData.set(null);
    this.tripWaybillPrintData.set(null);
    this.tripAdvanceReceiptPrintData.set(null);
  }

  /**
   * Deliberate, documented scope boundary: this trip-details reuse only
   * wires the document/print actions and the shipment click-through — the
   * ones relevant when the trip is reached from a truck's history. Trip
   * status transitions (arrival confirmation, settlement) stay owned by
   * the Trips page's own workflow.
   */
  protected onTripConfirmArrivalRequested(): void {
    // TODO: wire to backend once the trip-arrival endpoint is available
  }

  protected onTripSettleRequested(): void {
    // TODO: wire to backend once the trip-settlement endpoint is available
  }

  protected printTripManifest(trip: Trip): void {
    this.tripManifestPrintData.set(toTripManifestData(trip));
  }

  protected printTripWaybill(trip: Trip): void {
    this.tripWaybillPrintData.set(toTripSingleWaybillData(trip));
  }

  protected printAllTripWaybills(trip: Trip): void {
    this.tripWaybillBatchPrintData.set(toTripWaybillBatchData(trip));
  }

  protected printSelectedTripWaybills(trip: Trip, ids: readonly number[]): void {
    if (ids.length > 0) this.tripWaybillBatchPrintData.set(toTripWaybillBatchData(trip, ids));
  }

  protected printTripReceipts(trip: Trip): void {
    this.tripReceiptBatchPrintData.set(toTripReceiptBatchData(trip));
  }

  protected printTripAdvanceReceipt(trip: Trip): void {
    this.tripAdvanceReceiptPrintData.set(toTripAdvanceReceiptData(trip));
  }

  protected openShipmentDetailsFromTrip(shipmentId: number): void {
    this.selectedShipmentDetailsId.set(shipmentId);
  }

  protected closeShipmentDetailsFromTrip(): void {
    this.selectedShipmentDetailsId.set(null);
  }

  /**
   * Deliberate, documented scope boundary: only the document/print actions
   * relevant when a shipment is reached from a trip are wired here.
   * Shipment-editing actions stay owned by the Shipments page's own workflow.
   */
  protected onShipmentDocumentRequestedFromTrip(kind: ShipmentDocumentKind): void {
    const details = this.selectedShipmentDetails();
    if (!details) return;
    const shipment = SHIPMENT_FIXTURES.find((s) => s.id === details.id);
    if (!shipment) return;

    if (kind === 'receivingReceipt') {
      this.receivingReceiptPrintData.set(toReceivingReceiptPrintData(details, shipment.warehouse));
    } else if (kind === 'packingList') {
      this.packingListPrintData.set(toPackingListPrintData(details));
    } else if (kind === 'deliveryAcknowledgment') {
      this.deliveryReceiptPrintData.set(toDeliveryReceiptPrintData(details));
    }
  }

  /** Builds the trip-details "شحنات الرحلة" rows from the shipment fixtures. */
  private buildTripShipmentRows(trip: Trip): readonly TripShipmentRow[] {
    return trip.shipmentIds
      .map((id) => {
        const shipment = SHIPMENT_FIXTURES.find((item) => item.id === id);
        const details = SHIPMENT_DETAILS_FIXTURES.find((item) => item.id === id);
        if (!shipment || !details) return null;
        const row: TripShipmentRow = {
          id: shipment.id,
          shipmentNo: `SH-${String(shipment.id).padStart(3, '0')}`,
          customerName: shipment.customerName,
          counterpartyName:
            details.summary.direction === 'outbound'
              ? details.summary.receiverName
              : details.summary.senderName,
          originCity: WAREHOUSE_CITY_LABEL[shipment.warehouse],
          destinationCity: shipment.destinationCity,
          packageCount: shipment.packageCount,
          chargeLabel: `${shipment.finalValue.toLocaleString('en-US')} ${resolveCurrencySymbol(shipment.currency, this.language.language())}`,
          statusKey: shipment.status,
          statusLabel: this.shipmentsText()[SHIPMENT_STATUS_KEYS[shipment.status]],
          direction: details.summary.direction,
        };
        return row;
      })
      .filter((row): row is TripShipmentRow => row !== null);
  }

  protected statusLabel(status: TruckStatus): string {
    const map: Record<TruckStatus, string> = {
      onRoad: this.text().statusOnRoad,
      available: this.text().statusAvailable,
      offDuty: this.text().statusOffDuty,
    };
    return map[status];
  }

  protected formatCapacity(kg: number): string {
    return `${kg.toLocaleString('en-US')} ${this.text().unitKg}`;
  }
}
