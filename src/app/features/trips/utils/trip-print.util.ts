/**
 * Scoped, deliberate exception to the feature-isolation rule (Charter AD-03).
 * Trip documents are built from shipment data, and the shared print-dialog
 * contracts (TripManifestData / WaybillBatchData / ReceiptBatchData) are
 * re-exported for reuse via `@features/reports` — the same pairing the
 * shipments feature already relies on for its own single-shipment prints.
 */
import type {
  AdvanceReceiptPrintData,
  ManifestShipmentRow,
  ReceiptBatchData,
  ReceiptShipmentRow,
  TripManifestData,
  WaybillBatchData,
  WaybillShipmentRow,
  // eslint-disable-next-line boundaries/element-types -- see comment above
} from '@features/reports';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { MANIFEST_FIXTURE, WAYBILL_BATCH_FIXTURE, RECEIPT_BATCH_FIXTURE } from '@features/reports';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { SHIPMENT_FIXTURES } from '@features/shipments/shipments.data';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { SHIPMENT_DETAILS_FIXTURES } from '@features/shipments/shipment-details.data';
import type {
  Shipment,
  ShipmentGoodsCategory,
  ShipmentPackageType,
  // eslint-disable-next-line boundaries/element-types -- see comment above
} from '@features/shipments/models/shipment.model';
import type {
  ShipmentDetails,
  // eslint-disable-next-line boundaries/element-types -- see comment above
} from '@features/shipments/models/shipment-details.model';
// eslint-disable-next-line boundaries/element-types -- see comment above
import { toWaybillPrintData } from '@features/shipments/utils/shipment-print-report.util';
/* eslint-disable boundaries/element-types -- see file-level comment above */
import {
  formatMoney,
  formatShipmentNo,
} from '@features/shipments/utils/receipt-voucher-report.util';
/* eslint-enable boundaries/element-types */
import { Trip } from '../models/trip.model';
import { WAREHOUSE_CITY_LABEL } from './trip-route.util';

/** Print documents are fixed Arabic paper forms and never theme with the UI language. */
const PACKAGE_TYPE_LABEL_AR: Record<ShipmentPackageType, string> = {
  carton: 'كرتون',
  sack: 'شيكارة',
  bag: 'كيس',
  pallet: 'طبلية',
  woodenBox: 'صندوق خشبي',
  plasticBox: 'صندوق بلاستيك',
  roll: 'لفة',
  other: 'أخرى',
};

const GOODS_CATEGORY_LABEL_AR: Record<ShipmentGoodsCategory, string> = {
  clothing: 'ملابس',
  shoes: 'أحذية',
  books: 'كتب',
  foodstuff: 'مواد غذائية',
  furniture: 'أثاث',
  electronics: 'إلكترونيات',
  industrialEquipment: 'معدات صناعية',
  medicalEquipment: 'معدات طبية',
  buildingMaterials: 'مواد بناء',
  other: 'أخرى',
};

const TRIP_STATUS_LABEL_AR: Record<Trip['status'], string> = {
  planned: 'مخطط',
  inProgress: 'جارية',
  arrived: 'وصلت',
  completed: 'مكتملة',
  closed: 'مغلقة',
  cancelled: 'ملغاة',
};

interface TripShipmentPair {
  readonly shipment: Shipment;
  readonly details: ShipmentDetails;
}

/** Resolves the (Shipment, ShipmentDetails) pair for every shipment carried on a trip. */
function resolveTripShipments(
  trip: Trip,
  onlyIds?: readonly number[],
): readonly TripShipmentPair[] {
  const idFilter = onlyIds ? new Set(onlyIds) : null;
  return trip.shipmentIds
    .filter((id) => !idFilter || idFilter.has(id))
    .map((id) => {
      const shipment = SHIPMENT_FIXTURES.find((item) => item.id === id);
      const details = SHIPMENT_DETAILS_FIXTURES.find((item) => item.id === id);
      return shipment && details ? { shipment, details } : null;
    })
    .filter((pair): pair is TripShipmentPair => pair !== null);
}

function toManifestRow({ shipment, details }: TripShipmentPair): ManifestShipmentRow {
  const firstLine = details.packageLines[0];
  const totals = details.packageLines.reduce(
    (acc, line) => ({
      packages: acc.packages + line.packageCount,
      gross: acc.gross + line.grossWeightKg,
    }),
    { packages: 0, gross: 0 },
  );

  return {
    shipmentNo: formatShipmentNo(shipment.id),
    clientName: shipment.customerName,
    destinationCity: shipment.destinationCity,
    packages: totals.packages || shipment.packageCount,
    packageType: PACKAGE_TYPE_LABEL_AR[details.summary.packageType],
    goodsCategory: GOODS_CATEGORY_LABEL_AR[details.summary.goodsCategory],
    weightKg: totals.gross,
    volumeM3: firstLine?.volumeM3 ?? '—',
    dimensionsCm: firstLine?.dimensionsCm ?? '—',
    notes: shipment.hasShortage ? 'يوجد عجز مسجل' : '',
  };
}

function toReceiptRow({ shipment, details }: TripShipmentPair): ReceiptShipmentRow {
  const firstLine = details.packageLines[0];
  const totals = details.packageLines.reduce(
    (acc, line) => ({
      packages: acc.packages + line.packageCount,
      pieces: acc.pieces + line.pieceCount,
      gross: acc.gross + line.grossWeightKg,
    }),
    { packages: 0, pieces: 0, gross: 0 },
  );

  return {
    receiptNo: `RR-${formatShipmentNo(shipment.id)}`,
    shipmentNo: formatShipmentNo(shipment.id),
    date: '—',
    dayOfWeek: '—',
    senderName: details.summary.senderName,
    senderPhone: details.summary.senderPhone,
    senderAddress: '—',
    consigneeName: details.summary.receiverName,
    consigneePhone: details.summary.receiverPhone ?? '—',
    consigneeAddress: '—',
    packages: totals.packages || shipment.packageCount,
    weightKg: totals.gross,
    packageType: PACKAGE_TYPE_LABEL_AR[details.summary.packageType],
    quantity: totals.pieces,
    goodsCategory: GOODS_CATEGORY_LABEL_AR[details.summary.goodsCategory],
    volumeM3: firstLine?.volumeM3 ?? '—',
    dimensionsCm: firstLine?.dimensionsCm ?? '—',
    shippingPrice: formatMoney(shipment.finalValue, shipment.currency),
    goodsDescription: details.packageLines.map((line) => line.itemName).join('، ') || '—',
    notes: '',
    warehouse: WAREHOUSE_CITY_LABEL[shipment.warehouse],
    warehousekeeper: '—',
  };
}

/** Builds the "بيان تحميل الشاحنة" print data for a trip. Reuses the exact TR-2024-001 fixture when it matches. */
export function toTripManifestData(trip: Trip): TripManifestData {
  if (trip.tripNo === MANIFEST_FIXTURE.tripNo) {
    return MANIFEST_FIXTURE;
  }

  const pairs = resolveTripShipments(trip);
  return {
    manifestNo: `MF-${trip.tripNo.replace('TR-', '')}`,
    tripNo: trip.tripNo,
    loadingDate: trip.tripStartDate,
    warehouse: trip.originCity,
    destination: `${trip.destinationCountry} — ${trip.destinationCity}`,
    status: TRIP_STATUS_LABEL_AR[trip.status],
    truckPlate: trip.truckPlate,
    truckModel: '—',
    truckOwner: 'مؤسسة الرماح',
    truckCapacityKg: 0,
    driverName: trip.driverName,
    driverPhone: '—',
    driverLicense: '—',
    driverPassport: '—',
    shipments: pairs.map(toManifestRow),
    totalRevenue: formatMoney(trip.totalRevenue, 'EGP'),
  };
}

/** Builds the "طباعة كل/المحددة البوالص" print data. Reuses the exact TR-2024-004 fixture when it matches. */
export function toTripWaybillBatchData(trip: Trip, onlyIds?: readonly number[]): WaybillBatchData {
  if (!onlyIds && trip.tripNo === WAYBILL_BATCH_FIXTURE.tripNo) {
    return WAYBILL_BATCH_FIXTURE;
  }

  const pairs = resolveTripShipments(trip, onlyIds);
  return {
    tripNo: trip.tripNo,
    waybills: pairs.map(({ shipment, details }) => toWaybillPrintData(details, shipment.warehouse)),
  };
}

/** Builds the "طباعة إيصالات الاستلام" print data. Reuses the exact TR-2024-004 fixture when it matches. */
export function toTripReceiptBatchData(trip: Trip): ReceiptBatchData {
  if (trip.tripNo === RECEIPT_BATCH_FIXTURE.tripNo) {
    return RECEIPT_BATCH_FIXTURE;
  }

  const pairs = resolveTripShipments(trip);
  return {
    tripNo: trip.tripNo,
    receipts: pairs.map(toReceiptRow),
  };
}

/**
 * Builds the single "بوليصة شحن" print data for the trip's documents-section quick link.
 * Unlike `toTripWaybillBatchData`, this always resolves exactly one waybill — the trip's
 * first loaded shipment — since the link opens one document, not a batch.
 */
export function toTripSingleWaybillData(trip: Trip): WaybillShipmentRow | null {
  const [pair] = resolveTripShipments(trip, trip.shipmentIds.slice(0, 1));
  return pair ? toWaybillPrintData(pair.details, pair.shipment.warehouse) : null;
}

/** Builds the "إيصال سلفة سائق" print data for a trip. */
export function toTripAdvanceReceiptData(trip: Trip): AdvanceReceiptPrintData {
  return {
    tripNo: trip.tripNo,
    driverName: trip.driverName,
    date: trip.tripStartDate,
    amount: formatMoney(trip.driverAdvance, 'EGP'),
    originCity: trip.originCity,
    destinationCountry: trip.destinationCountry,
  };
}
