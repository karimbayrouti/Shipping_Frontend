/**
 * Scoped, deliberate exception to the feature-isolation rule (Charter AD-03).
 * These single-shipment print reports reuse the print-report contracts owned
 * by the reports feature instead of duplicating them here. If this pairing
 * grows, promote these contracts into `shared/`.
 */
import type {
  DeliveryReceiptPrintData,
  PackingListPrintData,
  ReceiptShipmentRow,
  ShippingInvoicePrintData,
  ShippingInvoiceStatus,
  WaybillShipmentRow,
  // eslint-disable-next-line boundaries/element-types -- see comment above
} from '@features/reports';
import {
  ShipmentCollectionStatus,
  ShipmentGoodsCategory,
  ShipmentPackageType,
  ShipmentWarehouse,
} from '../models/shipment.model';
import { ShipmentDetails, ShipmentDocChainKind } from '../models/shipment-details.model';
import { formatMoney, formatShipmentNo } from './receipt-voucher-report.util';

/** Egypt's standard VAT rate applied to shipping invoices. */
const INVOICE_VAT_RATE = 0.14;

/**
 * Net payment term applied when a dedicated due-date field isn't tracked yet
 * on ShipmentDetails. TODO: replace with a backend-configurable payment term
 * once the invoicing model is available.
 */
const INVOICE_PAYMENT_TERM_DAYS = 15;

/** Print documents are fixed Arabic paper forms and never theme with the UI language. */
const INVOICE_STATUS_LABEL_AR: Record<ShipmentCollectionStatus, string> = {
  collected: 'مدفوعة',
  partialCollected: 'مدفوعة جزئياً',
  uncollected: 'غير مدفوعة',
};

const INVOICE_STATUS_BADGE: Record<ShipmentCollectionStatus, ShippingInvoiceStatus> = {
  collected: 'paid',
  partialCollected: 'partial',
  uncollected: 'unpaid',
};

/** Print documents are fixed Arabic paper forms and never theme with the UI language. */
const WAREHOUSE_CITY_LABEL_AR: Record<ShipmentWarehouse, string> = {
  cairo: 'القاهرة',
  alexandria: 'الإسكندرية',
  kuwait: 'الكويت',
  doha: 'الدوحة',
};

const PACKAGE_TYPE_LABEL_AR: Record<ShipmentPackageType, string> = {
  carton: 'كرتون',
  sack: 'شكارة',
  bag: 'كيس',
  pallet: 'طبلية',
  woodenBox: 'صندوق خشب',
  plasticBox: 'صندوق بلاستيك',
  roll: 'رول',
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

interface PackageTotals {
  readonly packages: number;
  readonly pieces: number;
  readonly net: number;
  readonly gross: number;
}

function sumPackageLines(details: ShipmentDetails): PackageTotals {
  return details.packageLines.reduce<PackageTotals>(
    (totals, line) => ({
      packages: totals.packages + line.packageCount,
      pieces: totals.pieces + line.pieceCount,
      net: totals.net + line.netWeightKg,
      gross: totals.gross + line.grossWeightKg,
    }),
    { packages: 0, pieces: 0, net: 0, gross: 0 },
  );
}

function goodsDescription(details: ShipmentDetails): string {
  return details.packageLines.map((line) => line.itemName).join('، ') || '—';
}

function findDocChainRef(details: ShipmentDetails, kind: ShipmentDocChainKind): string {
  return details.docChain.find((node) => node.kind === kind)?.referenceNo ?? '—';
}

/** Extracts the receiving date and its Arabic day name from the shipment timeline. */
function resolveReceivingDate(details: ShipmentDetails): { date: string; dayOfWeek: string } {
  const receivedEvent = details.timeline.find(
    (event) => event.label === 'تم الاستلام' && event.time,
  );
  const fallbackEvent = details.timeline.find((event) => event.done && event.time);
  const raw = receivedEvent?.time ?? fallbackEvent?.time ?? null;
  if (!raw) {
    return { date: '—', dayOfWeek: '—' };
  }

  const date = raw.split(' ')[0] ?? raw;
  const dayOfWeek = new Date(raw.replace(' ', 'T')).toLocaleDateString('ar-EG', {
    weekday: 'long',
  });
  return { date, dayOfWeek };
}

/** Builds the single "إذن استلام" print data for one shipment. */
export function toReceivingReceiptPrintData(
  details: ShipmentDetails,
  warehouse: ShipmentWarehouse,
): ReceiptShipmentRow {
  const { summary, financial } = details;
  const totals = sumPackageLines(details);
  const { date, dayOfWeek } = resolveReceivingDate(details);
  const firstLine = details.packageLines[0];

  return {
    receiptNo: findDocChainRef(details, 'receivingReceipt'),
    shipmentNo: formatShipmentNo(details.id),
    date,
    dayOfWeek,
    senderName: summary.senderName,
    senderPhone: summary.senderPhone,
    // TODO: sender/consignee street addresses aren't tracked on ShipmentDetails yet.
    senderAddress: '—',
    consigneeName: summary.receiverName,
    consigneePhone: summary.receiverPhone ?? '',
    consigneeAddress: `${summary.destinationCountry} - ${summary.destinationCity}`,
    packages: totals.packages,
    weightKg: totals.gross,
    packageType: PACKAGE_TYPE_LABEL_AR[summary.packageType],
    quantity: totals.pieces,
    goodsCategory: GOODS_CATEGORY_LABEL_AR[summary.goodsCategory],
    volumeM3: firstLine?.volumeM3 ?? '—',
    dimensionsCm: firstLine?.dimensionsCm ?? '—',
    shippingPrice: formatMoney(financial.finalValue, financial.currency),
    goodsDescription: goodsDescription(details),
    notes: '',
    warehouse: WAREHOUSE_CITY_LABEL_AR[warehouse],
    warehousekeeper: summary.warehouseKeeper,
  };
}

/** Builds the "قائمة التعبئة" print data for one shipment. */
export function toPackingListPrintData(details: ShipmentDetails): PackingListPrintData {
  const { date } = resolveReceivingDate(details);
  const totals = sumPackageLines(details);

  return {
    shipmentNo: formatShipmentNo(details.id),
    customerName: details.summary.senderName,
    date,
    lines: details.packageLines.map((line) => ({
      itemName: line.itemName,
      packageCount: line.packageCount,
      pieceCount: line.pieceCount,
      netWeightKg: line.netWeightKg,
      grossWeightKg: line.grossWeightKg,
      notes: '',
    })),
    totals,
  };
}

/** Builds the single-shipment "بوليصة شحن" print data. */
export function toWaybillPrintData(
  details: ShipmentDetails,
  warehouse: ShipmentWarehouse,
): WaybillShipmentRow {
  const { summary } = details;
  const totals = sumPackageLines(details);
  const { date } = resolveReceivingDate(details);
  const firstLine = details.packageLines[0];

  return {
    waybillNo: findDocChainRef(details, 'waybill'),
    date,
    shipper: summary.senderName,
    consignee: summary.receiverName,
    originCity: WAREHOUSE_CITY_LABEL_AR[warehouse],
    destinationCity: `${summary.destinationCountry} - ${summary.destinationCity}`,
    packages: totals.packages,
    weightTon: Number((totals.gross / 1000).toFixed(3)),
    packageType: PACKAGE_TYPE_LABEL_AR[summary.packageType],
    goodsCategory: GOODS_CATEGORY_LABEL_AR[summary.goodsCategory],
    goodsDescription: goodsDescription(details),
    quantity: totals.pieces,
    volumeM3: firstLine?.volumeM3 ?? '—',
    dimensionsCm: firstLine?.dimensionsCm ?? '—',
    // TODO: freight fee/balance breakdown isn't tracked on ShipmentDetails yet.
    freightFee: '—',
    freightBalance: '—',
    driverAdvance: '—',
    notes: '',
    truckPlate: findDocChainRef(details, 'truck'),
    // TODO: truck and driver profile fields await a backend fleet/driver model.
    truckModel: '—',
    truckColor: '—',
    truckYear: '—',
    truckCapacity: '—',
    truckOwner: 'مؤسسة الرماح',
    driverName: summary.driverName ?? '—',
    driverPhone: '—',
    driverNationality: '—',
    driverNationalId: '—',
    driverPassport: '—',
    driverPassportIssue: '—',
    driverLicense: '—',
    driverLicenseExpiry: '—',
    driverAddress: '—',
    ownerAddress: '—',
    ownerNationality: '—',
    managerName: 'م/ رماح عبد الحليم',
  };
}

/** Extracts the delivery date from the shipment timeline's "تم التسليم" event. */
function resolveDeliveryDate(details: ShipmentDetails): string {
  const deliveredEvent = details.timeline.find(
    (event) => event.label === 'تم التسليم' && event.time,
  );
  const fallbackEvent = details.timeline.find((event) => event.done && event.time);
  const raw = deliveredEvent?.time ?? fallbackEvent?.time ?? null;
  return raw ? (raw.split(' ')[0] ?? raw) : '—';
}

/**
 * Invoice issue date, falling back to the shipment's creation date.
 * TODO: replace with a dedicated `invoiceIssueDate` field once the backend
 * invoicing model is available.
 */
function resolveInvoiceIssueDate(details: ShipmentDetails): string {
  const createdEvent = details.timeline.find((event) => event.label === 'تم الإنشاء' && event.time);
  const fallbackEvent = details.timeline.find((event) => event.done && event.time);
  const raw = createdEvent?.time ?? fallbackEvent?.time ?? null;
  return raw ? (raw.split(' ')[0] ?? raw) : '—';
}

function addDays(dateStr: string, days: number): string {
  if (dateStr === '—') return '—';
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0] ?? dateStr;
}

/** Builds the single "إقرار استلام" print data for one delivered shipment. */
export function toDeliveryReceiptPrintData(details: ShipmentDetails): DeliveryReceiptPrintData {
  const { summary } = details;

  return {
    receiptNo: findDocChainRef(details, 'deliveryReceipt'),
    shipmentNo: formatShipmentNo(details.id),
    waybillNo: findDocChainRef(details, 'waybill'),
    deliveryCity: summary.destinationCity,
    deliveryDate: resolveDeliveryDate(details),
    driverName: summary.driverName ?? '—',
    lines: details.packageLines.map((line) => ({
      itemName: line.itemName,
      sentQuantity: line.pieceCount,
      deliveredQuantity: line.deliveredCount,
      shortageQuantity: line.shortageCount,
    })),
    totalShortage: details.packageLines.reduce((total, line) => total + line.shortageCount, 0),
  };
}

/** Builds the single "فاتورة شحن" print data for one shipment. */
export function toShippingInvoicePrintData(details: ShipmentDetails): ShippingInvoicePrintData {
  const { summary, financial } = details;
  const subtotal = financial.finalValue;
  const vatAmount = Math.round(subtotal * INVOICE_VAT_RATE);
  const total = subtotal + vatAmount;
  const issueDate = resolveInvoiceIssueDate(details);

  return {
    invoiceNo: findDocChainRef(details, 'invoice'),
    shipmentNo: formatShipmentNo(details.id),
    billedTo: summary.senderName,
    issueDate,
    dueDate: addDays(issueDate, INVOICE_PAYMENT_TERM_DAYS),
    destinationCity: summary.destinationCity,
    description: goodsDescription(details),
    priceLabel: subtotal.toLocaleString('en-US'),
    subtotalLabel: formatMoney(subtotal, financial.currency),
    vatRatePercent: Math.round(INVOICE_VAT_RATE * 100),
    vatLabel: formatMoney(vatAmount, financial.currency),
    totalLabel: formatMoney(total, financial.currency),
    statusLabel: INVOICE_STATUS_LABEL_AR[financial.collectionStatus],
    status: INVOICE_STATUS_BADGE[financial.collectionStatus],
  };
}
