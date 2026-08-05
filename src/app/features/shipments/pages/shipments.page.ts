/* eslint-disable max-lines, complexity */
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '@core/i18n/language.service';
import { TripsViewTranslations, TrucksViewTranslations } from '@core/i18n';
/**
 * Scoped, deliberate exception to the feature-isolation rule (Charter AD-03).
 * The shipment doc-chain's "truck" node must open the truck-details view
 * that already exists in the trucks feature; duplicating it here would
 * violate the "reuse, don't recreate" requirement instead. If this pairing
 * grows, promote VehicleHistoryDialog (and its Truck model) into `shared/`.
 */
// eslint-disable-next-line boundaries/element-types -- see comment above
import { Truck } from '@features/trucks/models/truck.model';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { TRUCK_FIXTURES } from '@features/trucks/trucks.data';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { VehicleHistoryDialog } from '@features/trucks/components/vehicle-history-dialog/vehicle-history-dialog';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { TruckFormDialog } from '@features/trucks/components/truck-form-dialog/truck-form-dialog';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { InsurancePolicyFormDialog } from '@features/trucks/components/insurance-policy-form-dialog/insurance-policy-form-dialog';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { VehicleRecordFormDialog } from '@features/trucks/components/vehicle-record-form-dialog/vehicle-record-form-dialog';
import type {
  InsurancePolicyDraft,
  TruckDraft,
  VehicleRecordDraft,
  // eslint-disable-next-line boundaries/element-types -- see comment above
} from '@features/trucks/models/truck.model';
/**
 * Scoped, deliberate exception to the feature-isolation rule (Charter AD-03).
 * The shipment doc-chain's "trip" node must open the trip-details view that
 * already exists in the trips feature; duplicating it here would violate
 * the "reuse, don't recreate" requirement instead. If this pairing grows,
 * promote TripDetailsDialog (and its Trip model) into `shared/`.
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
 * Receipt-voucher printing reuses the print-report dialogs owned by the
 * reports feature instead of duplicating them here; duplicating them would
 * violate the "reuse, don't recreate" requirement instead. If this pairing
 * grows, promote these dialogs into `shared/`.
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
  ReceiptVoucherDialog,
  ReceiptVoucherPrintData,
  ReceiptVouchersLogData,
  ReceiptVouchersLogDialog,
  ReceivingReceiptDialog,
  ShippingInvoiceDialog,
  ShippingInvoicePrintData,
  TripManifestData,
  WaybillBatchData,
  WaybillBatchDialog,
  WaybillDialog,
  WaybillShipmentRow,
  // eslint-disable-next-line boundaries/element-types -- see comment above
} from '@features/reports';
import { ShipmentTable } from '../components/shipment-table/shipment-table';
import { ShipmentFormDialog } from '../components/shipment-form-dialog/shipment-form-dialog';
import { ShipmentDetailsDialog } from '../components/shipment-details-dialog/shipment-details-dialog';
import { ReceiptVoucherFormDialog } from '../components/receipt-voucher-form-dialog/receipt-voucher-form-dialog';
import { TransferShipmentDialog } from '../components/transfer-shipment-dialog/transfer-shipment-dialog';
import { ApplyDiscountDialog } from '../components/apply-discount-dialog/apply-discount-dialog';
import { SHIPMENT_FIXTURES } from '../shipments.data';
import { SHIPMENT_CUSTOMER_FIXTURES } from '../shipment-customers.data';
import { SHIPMENT_DETAILS_FIXTURES } from '../shipment-details.data';
import {
  Shipment,
  ShipmentCustomerOption,
  ShipmentDraft,
  ShipmentStatus,
  ShipmentStatusFilter,
  ShipmentWarehouse,
  ShipmentWarehouseFilter,
} from '../models/shipment.model';
import {
  ShipmentDetails,
  ShipmentDocChainNode,
  ShipmentDocumentKind,
  ShipmentDiscountDraft,
  ShipmentReceiptVoucher,
  ShipmentReceiptVoucherDraft,
  ShipmentTransferDraft,
} from '../models/shipment-details.model';
import { calculateDiscountAmount } from '../utils/discount.util';
import { resolveCurrencySymbol } from '../utils/currency.util';
import {
  toReceiptVoucherPrintData,
  toReceiptVouchersLogData,
} from '../utils/receipt-voucher-report.util';
import {
  toDeliveryReceiptPrintData,
  toPackingListPrintData,
  toReceivingReceiptPrintData,
  toShippingInvoicePrintData,
  toWaybillPrintData,
} from '../utils/shipment-print-report.util';

const PAGE_SIZE = 8;
const STATUS_ORDER: readonly ShipmentStatus[] = [
  'ready',
  'assigned',
  'inTransit',
  'delivered',
  'closed',
  'loaded',
  'returned',
  'cancelled',
  'draft',
];

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

@Component({
  selector: 'app-shipments-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ShipmentTable,
    ShipmentFormDialog,
    ShipmentDetailsDialog,
    ReceiptVoucherFormDialog,
    TransferShipmentDialog,
    ApplyDiscountDialog,
    VehicleHistoryDialog,
    TruckFormDialog,
    InsurancePolicyFormDialog,
    VehicleRecordFormDialog,
    ReceiptVouchersLogDialog,
    ReceiptVoucherDialog,
    ReceivingReceiptDialog,
    PackingListDialog,
    WaybillDialog,
    DeliveryReceiptDialog,
    ShippingInvoiceDialog,
    TripDetailsDialog,
    LoadingManifestDialog,
    WaybillBatchDialog,
    ReceiptBatchDialog,
    AdvanceReceiptDialog,
  ],
  templateUrl: './shipments.page.html',
  styleUrl: './shipments.page.scss',
})
export class ShipmentsPage {
  private readonly language = inject(LanguageService);

  protected readonly text = computed(() => ({
    ...this.language.translations().shipments,
    ...this.language.translations().common.actions,
  }));
  protected readonly truckText = computed<TrucksViewTranslations>(() => ({
    ...this.language.translations().trucks,
    ...this.language.translations().common.actions,
  }));
  protected readonly tripText = computed<TripsViewTranslations>(() => ({
    ...this.language.translations().trips,
    ...this.language.translations().common.actions,
  }));
  protected readonly locale = this.language.language;

  protected readonly shipments = signal<readonly Shipment[]>(SHIPMENT_FIXTURES);
  protected readonly shipmentDetailsRecords =
    signal<readonly ShipmentDetails[]>(SHIPMENT_DETAILS_FIXTURES);
  protected readonly customers = signal<readonly ShipmentCustomerOption[]>(
    SHIPMENT_CUSTOMER_FIXTURES,
  );
  protected readonly query = signal('');
  protected readonly statusFilter = signal<ShipmentStatusFilter>('all');
  protected readonly warehouseFilter = signal<ShipmentWarehouseFilter>('all');
  protected readonly page = signal(0);
  protected readonly isFormOpen = signal(false);
  protected readonly editingShipmentId = signal<number | null>(null);
  protected readonly selectedShipmentId = signal<number | null>(null);
  protected readonly receiptVoucherShipmentId = signal<number | null>(null);
  protected readonly transferShipmentId = signal<number | null>(null);
  protected readonly showApplyDiscount = signal(false);
  protected readonly truckDetailsNode = signal<ShipmentDocChainNode | null>(null);
  protected readonly truckFixtures = TRUCK_FIXTURES;
  protected readonly editTruckFromHistory = signal<Truck | null>(null);
  protected readonly showInsurancePolicyForm = signal(false);
  protected readonly vehicleRecordTruckId = signal<number | null>(null);
  protected readonly showReceiptVouchersLogPrint = signal(false);
  protected readonly voucherPrintTarget = signal<ShipmentReceiptVoucher | null>(null);
  protected readonly showReceivingReceiptPrint = signal(false);
  protected readonly showPackingListPrint = signal(false);
  protected readonly showWaybillPrint = signal(false);
  protected readonly showDeliveryReceiptPrint = signal(false);
  protected readonly showShippingInvoicePrint = signal(false);
  protected readonly tripDetailsTripNo = signal<string | null>(null);
  protected readonly tripManifestPrintData = signal<TripManifestData | null>(null);
  protected readonly tripWaybillBatchPrintData = signal<WaybillBatchData | null>(null);
  protected readonly tripReceiptBatchPrintData = signal<ReceiptBatchData | null>(null);
  protected readonly tripWaybillPrintData = signal<WaybillShipmentRow | null>(null);
  protected readonly tripAdvanceReceiptPrintData = signal<AdvanceReceiptPrintData | null>(null);

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
    const id = this.selectedShipmentId();
    if (id === null) return null;
    return this.shipmentDetailsRecords().find((details) => details.id === id) ?? null;
  });

  protected readonly selectedShipment = computed<Shipment | null>(() => {
    const id = this.selectedShipmentId();
    if (id === null) return null;
    return this.shipments().find((shipment) => shipment.id === id) ?? null;
  });

  protected readonly receiptVouchersLogPrintData = computed<ReceiptVouchersLogData | null>(() => {
    if (!this.showReceiptVouchersLogPrint()) return null;
    const details = this.selectedShipmentDetails();
    return details ? toReceiptVouchersLogData(details) : null;
  });

  protected readonly voucherPrintData = computed<ReceiptVoucherPrintData | null>(() => {
    const voucher = this.voucherPrintTarget();
    const details = this.selectedShipmentDetails();
    return voucher && details ? toReceiptVoucherPrintData(details, voucher) : null;
  });

  private readonly selectedShipmentWarehouse = computed<ShipmentWarehouse>(() => {
    const id = this.selectedShipmentId();
    return this.shipments().find((shipment) => shipment.id === id)?.warehouse ?? 'cairo';
  });

  protected readonly receivingReceiptPrintData = computed<ReceiptShipmentRow | null>(() => {
    if (!this.showReceivingReceiptPrint()) return null;
    const details = this.selectedShipmentDetails();
    return details ? toReceivingReceiptPrintData(details, this.selectedShipmentWarehouse()) : null;
  });

  protected readonly packingListPrintData = computed<PackingListPrintData | null>(() => {
    if (!this.showPackingListPrint()) return null;
    const details = this.selectedShipmentDetails();
    return details ? toPackingListPrintData(details) : null;
  });

  protected readonly waybillPrintData = computed<WaybillShipmentRow | null>(() => {
    if (!this.showWaybillPrint()) return null;
    const details = this.selectedShipmentDetails();
    return details ? toWaybillPrintData(details, this.selectedShipmentWarehouse()) : null;
  });

  protected readonly deliveryReceiptPrintData = computed<DeliveryReceiptPrintData | null>(() => {
    if (!this.showDeliveryReceiptPrint()) return null;
    const details = this.selectedShipmentDetails();
    return details ? toDeliveryReceiptPrintData(details) : null;
  });

  protected readonly shippingInvoicePrintData = computed<ShippingInvoicePrintData | null>(() => {
    if (!this.showShippingInvoicePrint()) return null;
    const details = this.selectedShipmentDetails();
    return details ? toShippingInvoicePrintData(details) : null;
  });

  protected readonly formMode = computed<'create' | 'edit'>(() =>
    this.editingShipmentId() === null ? 'create' : 'edit',
  );

  protected readonly editingShipmentDraft = computed<ShipmentDraft | null>(() => {
    const id = this.editingShipmentId();
    if (id === null) return null;
    return this.buildEditDraft(id);
  });

  protected readonly receiptVoucherShipment = computed(() => {
    const id = this.receiptVoucherShipmentId();
    if (id === null) return null;
    return this.shipments().find((shipment) => shipment.id === id) ?? null;
  });

  protected readonly transferShipmentTarget = computed(() => {
    const id = this.transferShipmentId();
    if (id === null) return null;
    return this.shipments().find((shipment) => shipment.id === id) ?? null;
  });

  protected readonly truckDetailsTruck = computed<Truck | null>(() => {
    const node = this.truckDetailsNode();
    if (!node) return null;
    const matched = TRUCK_FIXTURES.find((truck) => truck.plateNumber === node.referenceNo);
    return matched ?? this.buildFallbackTruck(node);
  });

  protected readonly nextShipmentNumber = computed(
    () => `SH-${String(this.shipments().length + 1).padStart(3, '0')}`,
  );
  protected readonly nextReceiptNumber = computed(
    () => `RR-${new Date().getFullYear()}-${String(this.shipments().length + 1).padStart(5, '0')}`,
  );

  protected readonly shortageCount = computed(
    () => this.shipments().filter((shipment) => shipment.hasShortage).length,
  );

  protected readonly statusBreakdown = computed(() => {
    const shipments = this.shipments();
    return STATUS_ORDER.map((status) => {
      const count = shipments.filter((shipment) => shipment.status === status).length;
      return {
        status,
        label: this.statusLabel(status),
        count,
        percent: shipments.length === 0 ? 0 : Math.round((count / shipments.length) * 100),
      };
    });
  });

  protected readonly filteredShipments = computed(() => {
    const query = this.query().trim().toLocaleLowerCase(this.locale());
    const status = this.statusFilter();
    const warehouse = this.warehouseFilter();

    return this.shipments().filter((shipment) => {
      const matchesQuery =
        !query ||
        [shipment.customerName, shipment.destinationCity, shipment.destinationCountry].some(
          (value) => value.toLocaleLowerCase(this.locale()).includes(query),
        );
      const matchesStatus =
        status === 'all' ||
        (status === 'shortage' ? shipment.hasShortage : shipment.status === status);
      const matchesWarehouse = warehouse === 'all' || shipment.warehouse === warehouse;
      return matchesQuery && matchesStatus && matchesWarehouse;
    });
  });

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredShipments().length / PAGE_SIZE)),
  );
  protected readonly visibleShipments = computed(() => {
    const validPage = Math.min(this.page(), this.pageCount() - 1);
    const start = validPage * PAGE_SIZE;
    return this.filteredShipments().slice(start, start + PAGE_SIZE);
  });

  protected readonly pageSize = PAGE_SIZE;
  protected readonly warehouseOptions: readonly ShipmentWarehouse[] = [
    'cairo',
    'alexandria',
    'kuwait',
    'doha',
  ];
  protected readonly statusOptions: readonly ShipmentStatus[] = [
    'draft',
    'ready',
    'assigned',
    'loaded',
    'inTransit',
    'delivered',
    'returned',
    'cancelled',
    'closed',
  ];

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.page.set(0);
  }

  protected onStatusFilterChange(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as ShipmentStatusFilter);
    this.page.set(0);
  }

  protected onWarehouseFilterChange(event: Event): void {
    this.warehouseFilter.set((event.target as HTMLSelectElement).value as ShipmentWarehouseFilter);
    this.page.set(0);
  }

  protected showShortageOnly(): void {
    this.statusFilter.set('shortage');
    this.page.set(0);
  }

  protected changePage(page: number): void {
    this.page.set(Math.max(0, Math.min(page, this.pageCount() - 1)));
  }

  protected openCreateReceiptModal(): void {
    this.editingShipmentId.set(null);
    this.isFormOpen.set(true);
  }

  protected closeFormDialog(): void {
    this.isFormOpen.set(false);
    this.editingShipmentId.set(null);
  }

  protected onViewShipment(shipment: Shipment): void {
    this.selectedShipmentId.set(shipment.id);
  }

  protected onRecordPayment(shipment: Shipment): void {
    this.receiptVoucherShipmentId.set(shipment.id);
  }

  protected onReceiveShipment(shipment: Shipment): void {
    // TODO: replace the local status transition with the receiving endpoint once available
    this.shipments.update((list) =>
      list.map((item) => (item.id === shipment.id ? { ...item, status: 'ready' } : item)),
    );
  }

  protected onTransferShipment(shipment: Shipment): void {
    this.transferShipmentId.set(shipment.id);
  }

  protected closeReceiptVoucherDialog(): void {
    this.receiptVoucherShipmentId.set(null);
  }

  protected closeTransferDialog(): void {
    this.transferShipmentId.set(null);
  }

  protected saveReceiptVoucher(draft: ShipmentReceiptVoucherDraft): void {
    this.shipments.update((list) =>
      list.map((shipment) => {
        if (shipment.id !== draft.shipmentId) return shipment;
        const remaining = Math.max(
          0,
          (shipment.remainingBalance ?? shipment.finalValue) - draft.amount,
        );
        return {
          ...shipment,
          remainingBalance: remaining,
          collectionStatus: remaining === 0 ? 'collected' : 'partialCollected',
        };
      }),
    );
    this.closeReceiptVoucherDialog();
  }

  protected saveTransfer(draft: ShipmentTransferDraft): void {
    this.shipments.update((list) =>
      list.map((shipment) =>
        shipment.id === draft.shipmentId
          ? { ...shipment, warehouse: draft.targetWarehouse }
          : shipment,
      ),
    );
    this.closeTransferDialog();
  }

  protected closeDetailsDialog(): void {
    this.selectedShipmentId.set(null);
    this.truckDetailsNode.set(null);
    this.editTruckFromHistory.set(null);
    this.showInsurancePolicyForm.set(false);
    this.vehicleRecordTruckId.set(null);
    this.showReceiptVouchersLogPrint.set(false);
    this.voucherPrintTarget.set(null);
    this.showReceivingReceiptPrint.set(false);
    this.showPackingListPrint.set(false);
    this.showWaybillPrint.set(false);
    this.showDeliveryReceiptPrint.set(false);
    this.showShippingInvoicePrint.set(false);
    this.showApplyDiscount.set(false);
    this.closeTripDetailsDialog();
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
   * ones relevant when the trip is reached from a shipment's doc chain.
   * Trip status transitions (arrival confirmation, settlement) stay owned
   * by the Trips page's own workflow.
   */
  protected onTripConfirmArrivalRequested(): void {
    // TODO: wire to backend once the trip-arrival endpoint is available
  }

  protected onTripSettleRequested(): void {
    // TODO: wire to backend once the trip-settlement endpoint is available
  }

  protected onTripShipmentClicked(shipmentId: number): void {
    this.selectedShipmentId.set(shipmentId);
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

  protected onEditShipmentRequested(): void {
    const id = this.selectedShipmentId();
    if (id === null) return;
    this.editingShipmentId.set(id);
    this.isFormOpen.set(true);
    this.closeDetailsDialog();
  }

  protected onCancelShipmentRequested(): void {
    // TODO: replace the local status transition with the cancel-shipment endpoint once available
    const id = this.selectedShipmentId();
    if (id === null) return;
    this.shipments.update((list) =>
      list.map((item) => (item.id === id ? { ...item, status: 'cancelled' } : item)),
    );
    this.closeDetailsDialog();
  }

  protected onMarkShipmentReturnedRequested(): void {
    // TODO: replace the local status transition with the mark-as-returned endpoint once available
    const id = this.selectedShipmentId();
    if (id === null) return;
    this.shipments.update((list) =>
      list.map((item) => (item.id === id ? { ...item, status: 'returned' } : item)),
    );
    this.closeDetailsDialog();
  }

  protected onApplyDiscountRequested(): void {
    this.showApplyDiscount.set(true);
  }

  protected closeApplyDiscountDialog(): void {
    this.showApplyDiscount.set(false);
  }

  protected saveDiscount(draft: ShipmentDiscountDraft): void {
    const details = this.shipmentDetailsRecords().find((item) => item.id === draft.shipmentId);
    if (!details) return;

    const discountAmount = calculateDiscountAmount(
      draft.discountType,
      draft.value,
      details.financial.priceBeforeDiscount,
    );
    const finalValue = Math.max(0, details.financial.priceBeforeDiscount - discountAmount);
    const remaining = Math.max(0, finalValue - details.financial.paid);

    this.shipmentDetailsRecords.update((list) =>
      list.map((item) =>
        item.id === draft.shipmentId
          ? {
              ...item,
              financial: { ...item.financial, discounts: discountAmount, finalValue, remaining },
            }
          : item,
      ),
    );
    this.shipments.update((list) =>
      list.map((shipment) =>
        shipment.id === draft.shipmentId
          ? {
              ...shipment,
              finalValue,
              remainingBalance: shipment.remainingBalance === null ? null : remaining,
              collectionStatus: remaining === 0 ? 'collected' : shipment.collectionStatus,
            }
          : shipment,
      ),
    );
    this.closeApplyDiscountDialog();
  }

  protected onCreatePaymentVoucherRequested(): void {
    const id = this.selectedShipmentId();
    if (id === null) return;
    this.receiptVoucherShipmentId.set(id);
  }

  protected onReceiptVouchersLogPrintRequested(): void {
    this.showReceiptVouchersLogPrint.set(true);
  }

  protected closeReceiptVouchersLogPrint(): void {
    this.showReceiptVouchersLogPrint.set(false);
  }

  protected onVoucherPrintRequested(voucher: ShipmentReceiptVoucher): void {
    this.voucherPrintTarget.set(voucher);
  }

  protected closeVoucherPrint(): void {
    this.voucherPrintTarget.set(null);
  }

  protected onVoucherDeleteRequested(voucher: ShipmentReceiptVoucher): void {
    // TODO: wire to backend delete endpoint
    const id = this.selectedShipmentId();
    if (id === null) return;

    this.shipmentDetailsRecords.update((list) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              financial: {
                ...item.financial,
                collectionStatus: 'uncollected',
                receiptVouchers: item.financial.receiptVouchers.filter(
                  (entry) => entry.voucherNo !== voucher.voucherNo,
                ),
              },
            }
          : item,
      ),
    );
    this.shipments.update((list) =>
      list.map((item) => (item.id === id ? { ...item, collectionStatus: 'uncollected' } : item)),
    );
  }

  protected onDocumentRequested(kind: ShipmentDocumentKind): void {
    switch (kind) {
      case 'receivingReceipt':
        this.showReceivingReceiptPrint.set(true);
        return;
      case 'packingList':
        this.showPackingListPrint.set(true);
        return;
      case 'paymentReceipt': {
        const voucher = this.selectedShipmentDetails()?.financial.receiptVouchers.at(-1);
        if (voucher) this.voucherPrintTarget.set(voucher);
        return;
      }
      case 'deliveryAcknowledgment':
        // TODO: wire once the delivery-acknowledgment report is available
        return;
    }
  }

  protected onDocChainNodeSelected(node: ShipmentDocChainNode): void {
    switch (node.kind) {
      case 'truck':
        this.truckDetailsNode.set(node);
        return;
      case 'trip':
        this.tripDetailsTripNo.set(node.referenceNo);
        return;
      case 'receivingReceipt':
        this.showReceivingReceiptPrint.set(true);
        return;
      case 'waybill':
        this.showWaybillPrint.set(true);
        return;
      case 'paymentReceipt':
        this.showReceiptVouchersLogPrint.set(true);
        return;
      case 'deliveryReceipt':
        this.showDeliveryReceiptPrint.set(true);
        return;
      case 'invoice':
        this.showShippingInvoicePrint.set(true);
        return;
      default:
        // TODO: wire remaining doc-chain node kinds to backend navigation once available
        return;
    }
  }

  protected closeTruckDetailsDialog(): void {
    this.truckDetailsNode.set(null);
  }

  /** Called when the user clicks "Edit" inside the truck history dialog */
  protected onEditTruckRequestedFromHistory(truck: Truck): void {
    this.editTruckFromHistory.set(truck);
  }

  protected closeEditTruckForm(): void {
    this.editTruckFromHistory.set(null);
  }

  protected saveEditedTruckFromHistory(draft: TruckDraft): void {
    // TODO: wire to backend once the truck update endpoint is available
    void draft;
    this.closeEditTruckForm();
  }

  /** Called when the user clicks "Add Insurance Policy" inside the truck history dialog */
  protected onInsurancePolicyRequestedFromTruckHistory(): void {
    this.showInsurancePolicyForm.set(true);
  }

  protected closeInsurancePolicyForm(): void {
    this.showInsurancePolicyForm.set(false);
  }

  protected saveInsurancePolicyFromTruckHistory(draft: InsurancePolicyDraft): void {
    // TODO: wire to backend once the insurance policy endpoint is available
    void draft;
    this.closeInsurancePolicyForm();
  }

  /** Called when the user clicks "Add Vehicle Record" inside the truck history dialog */
  protected onVehicleRecordRequestedFromTruckHistory(truck: Truck): void {
    this.vehicleRecordTruckId.set(truck.id);
  }

  protected closeVehicleRecordForm(): void {
    this.vehicleRecordTruckId.set(null);
  }

  protected saveVehicleRecordFromTruckHistory(draft: VehicleRecordDraft): void {
    // TODO: wire to backend once the vehicle record endpoint is available
    void draft;
    this.closeVehicleRecordForm();
  }

  protected closeReceivingReceiptPrint(): void {
    this.showReceivingReceiptPrint.set(false);
  }

  protected closePackingListPrint(): void {
    this.showPackingListPrint.set(false);
  }

  protected closeWaybillPrint(): void {
    this.showWaybillPrint.set(false);
  }

  protected closeDeliveryReceiptPrint(): void {
    this.showDeliveryReceiptPrint.set(false);
  }

  protected closeShippingInvoicePrint(): void {
    this.showShippingInvoicePrint.set(false);
  }

  /**
   * Builds a display-only Truck record from the shipment's own doc-chain and
   * summary data when the referenced plate isn't found among the trucks
   * fixtures yet. Keeps the shared VehicleHistoryDialog fully functional
   * without inventing a new truck-details component.
   */
  private buildFallbackTruck(node: ShipmentDocChainNode): Truck {
    const driverName = this.selectedShipmentDetails()?.summary.driverName ?? null;
    return {
      id: 0,
      plateNumber: node.referenceNo,
      vehicleType: '—',
      vehicleModel: '—',
      vehicleColor: '—',
      capacityKg: 0,
      transportType: 'owned',
      vehicleLicenseNo: '—',
      licenseExpiry: '—',
      driverName,
      insurance: null,
      maintenanceCostEgp: 0,
      status: 'onRoad',
      ownerName: '—',
      ownerPhone: '—',
      ownerAddress: '—',
      stats: {
        currentDriver: driverName ?? '—',
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
        currentTripShipments: null,
        currentTripNo: null,
      },
      vehicleRecords: [],
      insuranceRecords: [],
      trips: [],
      timeline: [],
    };
  }

  /** Builds the trip-details "شحنات الرحلة" rows from this page's own shipment state. */
  private buildTripShipmentRows(trip: Trip): readonly TripShipmentRow[] {
    return trip.shipmentIds
      .map((id) => {
        const shipment = this.shipments().find((item) => item.id === id);
        const details = this.shipmentDetailsRecords().find((item) => item.id === id);
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
          chargeLabel: `${shipment.finalValue.toLocaleString('en-US')} ${resolveCurrencySymbol(shipment.currency, this.locale())}`,
          statusKey: shipment.status,
          statusLabel: this.text()[SHIPMENT_STATUS_KEYS[shipment.status]],
          direction: details.summary.direction,
        };
        return row;
      })
      .filter((row): row is TripShipmentRow => row !== null);
  }

  protected onCustomerCreated(customer: ShipmentCustomerOption): void {
    this.customers.update((list) => [...list, customer]);
  }

  protected saveShipment(draft: ShipmentDraft): void {
    const editingId = this.editingShipmentId();
    const customer = this.customers().find((c) => c.id === draft.customerId);
    const packageCount = draft.packageLines.reduce(
      (total, line) => total + (line.packageCount ?? 0),
      0,
    );

    if (editingId !== null) {
      // TODO: replace the local field merge with the update-shipment endpoint once available
      this.shipments.update((list) =>
        list.map((item) =>
          item.id === editingId
            ? {
                ...item,
                customerName: customer?.name ?? item.customerName,
                destinationCountry: draft.destinationCountry,
                destinationCity: draft.destinationCity,
                warehouse: draft.warehouse,
                packageCount,
                finalValue: draft.finalValue ?? item.finalValue,
                currency: draft.currency,
              }
            : item,
        ),
      );
      this.closeFormDialog();
      return;
    }

    const id = Math.max(0, ...this.shipments().map((s) => s.id)) + 1;
    this.shipments.update((list) => [
      ...list,
      {
        id,
        customerName: customer?.name ?? '',
        destinationCountry: draft.destinationCountry,
        destinationCity: draft.destinationCity,
        warehouse: draft.warehouse,
        packageCount,
        finalValue: draft.finalValue ?? 0,
        remainingBalance: draft.finalValue ?? 0,
        currency: draft.currency,
        tripNumber: null,
        collectionStatus: 'uncollected',
        status: 'draft',
        hasShortage: false,
      },
    ]);
    this.closeFormDialog();
  }

  /**
   * Builds the edit-form draft for a shipment from the fixture data sources.
   * TODO: once the backend is wired up, replace this with a single GET
   * request that returns the shipment in this exact ShipmentDraft shape —
   * matching by customer name and leaving package dimensions/notes blank is
   * a fixture-data limitation only, not something to carry into the API.
   */
  private buildEditDraft(id: number): ShipmentDraft | null {
    const details = this.shipmentDetailsRecords().find((item) => item.id === id);
    const shipment = this.shipments().find((item) => item.id === id);
    if (!details || !shipment) return null;

    const customer = this.customers().find((c) => c.name === shipment.customerName) ?? null;
    const senderDiffers = details.summary.senderName !== (customer?.name ?? '');

    return {
      customerId: customer?.id ?? null,
      currency: details.financial.currency,
      senderDiffersFromCustomer: senderDiffers,
      senderName: details.summary.senderName,
      senderPhone: details.summary.senderPhone,
      senderAddress: customer?.city ?? '',
      receiverName: details.summary.receiverName,
      receiverPhone: details.summary.receiverPhone ?? '',
      receiverAddress: '',
      originCity: customer?.city ?? '',
      transportMode: details.summary.transportMode,
      destinationCountry: shipment.destinationCountry,
      destinationCity: shipment.destinationCity,
      direction: details.summary.direction,
      packageType: details.summary.packageType,
      goodsCategory: details.summary.goodsCategory,
      packageLines: details.packageLines.map((line) => ({
        itemName: line.itemName,
        pieceCount: line.pieceCount,
        packageCount: line.packageCount,
        netWeightKg: line.netWeightKg,
        grossWeightKg: line.grossWeightKg,
        lengthCm: null,
        widthCm: null,
        heightCm: null,
        stackable: line.stackable ?? true,
        fragile: line.fragile ?? false,
        notes: '',
      })),
      price: details.financial.priceBeforeDiscount,
      finalValue: details.financial.finalValue,
      warehouse: shipment.warehouse,
      warehouseKeeper: details.summary.warehouseKeeper,
      warehouseNotes: '',
    };
  }

  protected statusLabel(status: ShipmentStatus): string {
    const map: Record<ShipmentStatus, string> = {
      draft: this.text().statusDraft,
      ready: this.text().statusReady,
      assigned: this.text().statusAssigned,
      loaded: this.text().statusLoaded,
      inTransit: this.text().statusInTransit,
      delivered: this.text().statusDelivered,
      returned: this.text().statusReturned,
      cancelled: this.text().statusCancelled,
      closed: this.text().statusClosed,
    };
    return map[status];
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
}
