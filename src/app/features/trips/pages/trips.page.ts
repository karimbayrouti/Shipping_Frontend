/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '@core/i18n/language.service';
import { ToastService } from '@core/toast/toast.service';
import { Toast } from '@shared/ui/toast/toast';
import {
  LoadingManifestDialog,
  WaybillBatchDialog,
  ReceiptBatchDialog,
  ReceivingReceiptDialog,
  PackingListDialog,
  DeliveryReceiptDialog,
  WaybillDialog,
  AdvanceReceiptDialog,
  type TripManifestData,
  type WaybillBatchData,
  type ReceiptBatchData,
  // eslint-disable-next-line boundaries/element-types -- see comment in trip-print.util.ts
} from '@features/reports';
import type {
  ReceiptShipmentRow,
  PackingListPrintData,
  DeliveryReceiptPrintData,
  WaybillShipmentRow,
  AdvanceReceiptPrintData,
  // eslint-disable-next-line boundaries/element-types -- see comment in trip-print.util.ts
} from '@features/reports';
// eslint-disable-next-line boundaries/element-types -- see comment in trip-print.util.ts
import { ShipmentDetailsDialog } from '@features/shipments/components/shipment-details-dialog/shipment-details-dialog';
// eslint-disable-next-line boundaries/element-types -- see comment in trip-print.util.ts
import { SHIPMENT_FIXTURES } from '@features/shipments/shipments.data';
// eslint-disable-next-line boundaries/element-types -- see comment in trip-print.util.ts
import { SHIPMENT_DETAILS_FIXTURES } from '@features/shipments/shipment-details.data';
import type {
  Shipment,
  // eslint-disable-next-line boundaries/element-types -- see comment in trip-print.util.ts
} from '@features/shipments/models/shipment.model';
import type {
  ShipmentDocumentKind,
  // eslint-disable-next-line boundaries/element-types -- see comment in trip-print.util.ts
} from '@features/shipments/models/shipment-details.model';
// eslint-disable-next-line boundaries/element-types -- see comment in trip-print.util.ts
import { resolveCurrencySymbol } from '@features/shipments/utils/currency.util';
import {
  toReceivingReceiptPrintData,
  toPackingListPrintData,
  toDeliveryReceiptPrintData,
  // eslint-disable-next-line boundaries/element-types -- see comment in trip-print.util.ts
} from '@features/shipments/utils/shipment-print-report.util';

import { TRIP_FIXTURES } from '../trips.data';
import {
  Trip,
  TripDepartureSummary,
  TripDraft,
  TripPickableShipment,
  TripShipmentRow,
  TripStatusFilter,
} from '../models/trip.model';
import { TripDetailsDialog } from '../components/trip-details-dialog/trip-details-dialog';
import { DepartureSummaryDialog } from '../components/departure-summary-dialog/departure-summary-dialog';
import { TripFormDialog } from '../components/trip-form-dialog/trip-form-dialog';
import {
  toTripManifestData,
  toTripReceiptBatchData,
  toTripWaybillBatchData,
  toTripSingleWaybillData,
  toTripAdvanceReceiptData,
} from '../utils/trip-print.util';
import { toApproxEgp } from '../utils/trip-currency.util';

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

@Component({
  selector: 'app-trips-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Toast,
    TripDetailsDialog,
    DepartureSummaryDialog,
    TripFormDialog,
    ShipmentDetailsDialog,
    LoadingManifestDialog,
    WaybillBatchDialog,
    ReceiptBatchDialog,
    ReceivingReceiptDialog,
    PackingListDialog,
    DeliveryReceiptDialog,
    WaybillDialog,
    AdvanceReceiptDialog,
  ],
  templateUrl: './trips.page.html',
})
export class TripsPage {
  private readonly language = inject(LanguageService);
  private readonly toast = inject(ToastService);

  protected readonly text = computed(() => ({
    ...this.language.translations().trips,
    ...this.language.translations().common.actions,
  }));
  protected readonly shipmentsText = computed(() => ({
    ...this.language.translations().shipments,
    ...this.language.translations().common.actions,
  }));
  private readonly locale = computed(() => this.language.language());

  private readonly trips = signal<readonly Trip[]>(TRIP_FIXTURES);
  private readonly shipments = signal<readonly Shipment[]>(SHIPMENT_FIXTURES);

  protected readonly query = signal('');
  protected readonly statusFilter = signal<TripStatusFilter>('all');

  protected readonly isFormOpen = signal(false);
  protected readonly detailsTripId = signal<number | null>(null);
  protected readonly departureTripId = signal<number | null>(null);
  protected readonly selectedShipmentDetailsId = signal<number | null>(null);

  protected readonly manifestPrintData = signal<TripManifestData | null>(null);
  protected readonly waybillBatchPrintData = signal<WaybillBatchData | null>(null);
  protected readonly receiptBatchPrintData = signal<ReceiptBatchData | null>(null);
  protected readonly receivingReceiptPrintData = signal<ReceiptShipmentRow | null>(null);
  protected readonly packingListPrintData = signal<PackingListPrintData | null>(null);
  protected readonly deliveryReceiptPrintData = signal<DeliveryReceiptPrintData | null>(null);
  protected readonly waybillPrintData = signal<WaybillShipmentRow | null>(null);
  protected readonly advanceReceiptPrintData = signal<AdvanceReceiptPrintData | null>(null);

  protected readonly filteredTrips = computed(() => {
    const query = this.query().trim().toLowerCase();
    const status = this.statusFilter();
    return this.trips().filter((trip) => {
      const matchesStatus = status === 'all' || trip.status === status;
      const matchesQuery =
        !query ||
        trip.tripNo.toLowerCase().includes(query) ||
        trip.waybillNo.toLowerCase().includes(query) ||
        trip.driverName.toLowerCase().includes(query) ||
        trip.truckPlate.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  });

  protected readonly statCounts = computed(() => {
    const trips = this.trips();
    return {
      planned: trips.filter((t) => t.status === 'planned').length,
      inProgress: trips.filter((t) => t.status === 'inProgress').length,
      completed: trips.filter((t) => t.status === 'completed').length,
      closed: trips.filter((t) => t.status === 'closed').length,
    };
  });

  protected readonly activeTripsCount = computed(
    () => this.trips().filter((t) => t.status === 'inProgress' || t.status === 'planned').length,
  );
  protected readonly awaitingDepartureCount = computed(
    () => this.trips().filter((t) => t.status === 'planned').length,
  );
  protected readonly arrivedCount = computed(
    () => this.trips().filter((t) => t.status === 'arrived').length,
  );

  protected readonly nextTripNo = computed(() => this.formatTripSequence('TR'));
  protected readonly nextWaybillNo = computed(() => this.formatTripSequence('WB'));

  protected readonly readyPickableShipments = computed<readonly TripPickableShipment[]>(() =>
    this.shipments()
      .filter((shipment) => shipment.status === 'ready' && shipment.tripNumber === null)
      .map((shipment) => this.toPickableShipment(shipment))
      .filter((row): row is TripPickableShipment => row !== null),
  );

  protected readonly detailsTrip = computed<Trip | null>(
    () => this.trips().find((t) => t.id === this.detailsTripId()) ?? null,
  );
  protected readonly detailsRows = computed<readonly TripShipmentRow[]>(() => {
    const trip = this.detailsTrip();
    return trip ? this.buildShipmentRows(trip) : [];
  });

  protected readonly departureSummary = computed<TripDepartureSummary | null>(() => {
    const trip = this.trips().find((t) => t.id === this.departureTripId());
    return trip ? this.buildDepartureSummary(trip) : null;
  });

  /** Drivers currently on an in-progress trip — shown as "in transit" in the trip form's driver/helper selects. */
  protected readonly busyDriverNames = computed<ReadonlySet<string>>(
    () =>
      new Set(
        this.trips()
          .filter((t) => t.status === 'inProgress')
          .map((t) => t.driverName),
      ),
  );

  protected readonly selectedShipmentDetails = computed(() => {
    const id = this.selectedShipmentDetailsId();
    return id === null ? null : (SHIPMENT_DETAILS_FIXTURES.find((d) => d.id === id) ?? null);
  });

  protected statusLabel(status: Trip['status']): string {
    const t = this.text();
    const map: Record<Trip['status'], string> = {
      planned: t.statusPlanned,
      inProgress: t.statusInProgress,
      arrived: t.statusArrived,
      completed: t.statusCompleted,
      closed: t.statusClosed,
      cancelled: t.statusCancelled,
    };
    return map[status];
  }

  // --- List actions -------------------------------------------------------

  protected openForm(): void {
    this.isFormOpen.set(true);
  }

  protected closeForm(): void {
    this.isFormOpen.set(false);
  }

  protected onTripSaved(draft: TripDraft): void {
    const trip: Trip = {
      id: Math.max(0, ...this.trips().map((t) => t.id)) + 1,
      tripNo: this.nextTripNo(),
      waybillNo: this.nextWaybillNo(),
      status: 'planned',
      originCity: this.resolveDraftOriginCity(draft),
      destinationCountry: this.resolveDraftDestinationCity(draft),
      destinationCity: this.resolveDraftDestinationCity(draft),
      waybillCreatedDate: new Date().toISOString().slice(0, 10),
      tripStartDate: draft.tripStartDate,
      expectedDeparture: draft.expectedDeparture,
      actualDeparture: null,
      expectedArrival: draft.expectedArrival,
      actualArrival: null,
      assignmentMode: draft.assignmentMode,
      driverName: draft.driverName,
      truckPlate: draft.truckPlate,
      driverAdvance: draft.driverAdvance ?? 0,
      driverAdvanceIssued: false,
      shipmentIds: draft.shipmentIds,
      totalRevenue: this.sumDraftRevenueApproxEgp(draft),
      totalExpenses: 0,
      fieldOps: null,
      activityLog: [
        {
          message: 'الرحلة أُنشئت',
          detail: null,
          actor: 'مستخدم النظام',
          time: new Date().toLocaleString('ar-EG'),
          icon: '🗓',
        },
      ],
      collections: [],
      expenses: [],
    };

    this.trips.update((current) => [...current, trip]);
    this.shipments.update((current) =>
      current.map((shipment) =>
        draft.shipmentIds.includes(shipment.id)
          ? { ...shipment, status: 'assigned', tripNumber: trip.tripNo }
          : shipment,
      ),
    );
    this.isFormOpen.set(false);
    this.toast.show(this.text().toastTripCreated, 'success');
  }

  protected openDetails(tripId: number): void {
    this.detailsTripId.set(tripId);
  }

  protected closeDetails(): void {
    this.detailsTripId.set(null);
  }

  protected issueAdvance(tripId: number): void {
    this.updateTrip(tripId, (trip) => ({ ...trip, driverAdvanceIssued: true }));
    this.toast.show(this.text().toastAdvanceIssued, 'success');
  }

  protected confirmArrival(tripId: number): void {
    this.updateTrip(tripId, (trip) => ({ ...trip, status: 'arrived' }));
    this.toast.show(this.text().toastArrivalConfirmed, 'success');
  }

  protected settleTrip(): void {
    this.toast.show(this.text().toastSettlementSoon, 'success');
  }

  protected openDepartureSummary(tripId: number): void {
    this.departureTripId.set(tripId);
  }

  protected closeDepartureSummary(): void {
    this.departureTripId.set(null);
  }

  protected confirmDepart(tripId: number): void {
    this.updateTrip(tripId, (trip) => ({
      ...trip,
      status: 'inProgress',
      actualDeparture: new Date().toLocaleString('ar-EG'),
    }));
    this.departureTripId.set(null);
    this.toast.show(this.text().toastDeparted, 'success');
  }

  // --- Print dialogs --------------------------------------------------------

  protected printManifest(tripId: number): void {
    const trip = this.trips().find((t) => t.id === tripId);
    if (trip) this.manifestPrintData.set(toTripManifestData(trip));
  }

  protected printAllWaybills(tripId: number): void {
    const trip = this.trips().find((t) => t.id === tripId);
    if (trip) this.waybillBatchPrintData.set(toTripWaybillBatchData(trip));
  }

  protected printSelectedWaybills(tripId: number, ids: readonly number[]): void {
    const trip = this.trips().find((t) => t.id === tripId);
    if (trip && ids.length > 0) this.waybillBatchPrintData.set(toTripWaybillBatchData(trip, ids));
  }

  protected printReceipts(tripId: number): void {
    const trip = this.trips().find((t) => t.id === tripId);
    if (trip) this.receiptBatchPrintData.set(toTripReceiptBatchData(trip));
  }

  protected printWaybill(tripId: number): void {
    const trip = this.trips().find((t) => t.id === tripId);
    if (trip) this.waybillPrintData.set(toTripSingleWaybillData(trip));
  }

  protected printAdvanceReceipt(tripId: number): void {
    const trip = this.trips().find((t) => t.id === tripId);
    if (trip) this.advanceReceiptPrintData.set(toTripAdvanceReceiptData(trip));
  }

  // --- Reused shipment-details dialog --------------------------------------

  protected openShipmentDetails(shipmentId: number): void {
    this.selectedShipmentDetailsId.set(shipmentId);
  }

  protected closeShipmentDetails(): void {
    this.selectedShipmentDetailsId.set(null);
  }

  /**
   * Deliberate, documented scope boundary: this page wires the shipment
   * document/print actions that view or print existing records (the ones
   * relevant when reached from a trip). Shipment-editing actions (discount,
   * cancel, mark-returned, new payment voucher, …) belong to the Shipments
   * page's own workflow and stay out of scope here.
   */
  protected onShipmentDocumentRequested(kind: ShipmentDocumentKind): void {
    const details = this.selectedShipmentDetails();
    if (!details) return;
    const shipment = this.shipments().find((s) => s.id === details.id);
    if (!shipment) return;

    if (kind === 'receivingReceipt') {
      this.receivingReceiptPrintData.set(toReceivingReceiptPrintData(details, shipment.warehouse));
    } else if (kind === 'packingList') {
      this.packingListPrintData.set(toPackingListPrintData(details));
    } else if (kind === 'deliveryAcknowledgment') {
      this.deliveryReceiptPrintData.set(toDeliveryReceiptPrintData(details));
    } else {
      this.toast.show(this.shipmentsText().close, 'success');
    }
  }

  // --- Helpers --------------------------------------------------------------

  private updateTrip(tripId: number, updater: (trip: Trip) => Trip): void {
    this.trips.update((current) => current.map((t) => (t.id === tripId ? updater(t) : t)));
  }

  private formatTripSequence(prefix: 'TR' | 'WB'): string {
    const year = new Date().getFullYear();
    const index = this.trips().length + 1;
    return `${prefix}-${year}-${String(index).padStart(5, '0')}`;
  }

  private toPickableShipment(shipment: Shipment): TripPickableShipment | null {
    const details = SHIPMENT_DETAILS_FIXTURES.find((d) => d.id === shipment.id);
    if (!details) return null;
    const weightKg = details.packageLines.reduce((sum, line) => sum + line.grossWeightKg, 0);
    return {
      id: shipment.id,
      shipmentNo: `SH-${String(shipment.id).padStart(3, '0')}`,
      customerName: shipment.customerName,
      originCity: this.originCityLabel(shipment),
      destinationCity: shipment.destinationCity,
      direction: details.summary.direction,
      packageCount: shipment.packageCount,
      weightKg,
      valueLabel: `${shipment.finalValue.toLocaleString('en-US')} ${resolveCurrencySymbol(shipment.currency, this.locale())}`,
      rawValue: shipment.finalValue,
      currency: shipment.currency,
      statusLabel: this.shipmentsText()[SHIPMENT_STATUS_KEYS[shipment.status]],
    };
  }

  private originCityLabel(shipment: Shipment): string {
    const map: Record<Shipment['warehouse'], string> = {
      cairo: 'القاهرة',
      alexandria: 'الإسكندرية',
      kuwait: 'الكويت',
      doha: 'الدوحة',
    };
    return map[shipment.warehouse];
  }

  private buildShipmentRows(trip: Trip): readonly TripShipmentRow[] {
    return trip.shipmentIds
      .map((id) => {
        const shipment = this.shipments().find((s) => s.id === id);
        const details = SHIPMENT_DETAILS_FIXTURES.find((d) => d.id === id);
        if (!shipment || !details) return null;
        const row: TripShipmentRow = {
          id: shipment.id,
          shipmentNo: `SH-${String(shipment.id).padStart(3, '0')}`,
          customerName: shipment.customerName,
          counterpartyName:
            details.summary.direction === 'outbound'
              ? details.summary.receiverName
              : details.summary.senderName,
          originCity: this.originCityLabel(shipment),
          destinationCity: shipment.destinationCity,
          packageCount: shipment.packageCount,
          chargeLabel: `${shipment.finalValue.toLocaleString('en-US')} ${resolveCurrencySymbol(shipment.currency, this.locale())}`,
          statusKey: shipment.status,
          statusLabel: this.shipmentsText()[SHIPMENT_STATUS_KEYS[shipment.status]],
          direction: details.summary.direction,
        };
        return row;
      })
      .filter((row): row is TripShipmentRow => row !== null);
  }

  private buildDepartureSummary(trip: Trip): TripDepartureSummary {
    const rows = trip.shipmentIds
      .map((id) => ({
        shipment: this.shipments().find((s) => s.id === id),
        details: SHIPMENT_DETAILS_FIXTURES.find((d) => d.id === id),
      }))
      .filter(
        (
          pair,
        ): pair is { shipment: Shipment; details: (typeof SHIPMENT_DETAILS_FIXTURES)[number] } =>
          Boolean(pair.shipment && pair.details),
      );

    const loaded = trip.status === 'planned' ? 0 : trip.shipmentIds.length;
    const totalPackages = rows.reduce((sum, { shipment }) => sum + shipment.packageCount, 0);
    const totalWeightKg = rows.reduce(
      (sum, { details }) => sum + details.packageLines.reduce((s, l) => s + l.grossWeightKg, 0),
      0,
    );
    const customerCount = new Set(rows.map(({ shipment }) => shipment.customerName)).size;
    const destinationCities = [...new Set(rows.map(({ shipment }) => shipment.destinationCity))];

    const byCurrency = new Map<string, number>();
    for (const { shipment } of rows) {
      byCurrency.set(
        shipment.currency,
        (byCurrency.get(shipment.currency) ?? 0) + shipment.finalValue,
      );
    }

    return {
      trip,
      loadedCount: loaded,
      totalPackages,
      totalWeightKg,
      customerCount,
      destinationCities,
      dueCollections: [...byCurrency.entries()].map(([currency, amount]) => ({ amount, currency })),
      notLoadedShipmentNos:
        trip.status === 'planned'
          ? rows.map(({ shipment }) => `SH-${String(shipment.id).padStart(3, '0')}`)
          : [],
    };
  }

  private resolveDraftOriginCity(draft: TripDraft): string {
    const first = this.readyPickableShipments().find((s) => draft.shipmentIds.includes(s.id));
    return first?.originCity ?? '—';
  }

  private resolveDraftDestinationCity(draft: TripDraft): string {
    const first = this.readyPickableShipments().find((s) => draft.shipmentIds.includes(s.id));
    return first?.destinationCity ?? '—';
  }

  private sumDraftRevenueApproxEgp(draft: TripDraft): number {
    return this.readyPickableShipments()
      .filter((s) => draft.shipmentIds.includes(s.id))
      .reduce((sum, s) => sum + toApproxEgp(s.rawValue, s.currency), 0);
  }
}
