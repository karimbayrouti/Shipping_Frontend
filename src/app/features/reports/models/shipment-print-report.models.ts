export interface PackingListRow {
  readonly itemName: string;
  readonly packageCount: number;
  readonly pieceCount: number;
  readonly netWeightKg: number;
  readonly grossWeightKg: number;
  readonly notes: string;
}

export interface PackingListTotals {
  readonly packages: number;
  readonly pieces: number;
  readonly net: number;
  readonly gross: number;
}

export interface PackingListPrintData {
  readonly shipmentNo: string;
  readonly customerName: string;
  readonly date: string;
  readonly lines: readonly PackingListRow[];
  readonly totals: PackingListTotals;
}

export interface DeliveryReceiptRow {
  readonly itemName: string;
  readonly sentQuantity: number;
  readonly deliveredQuantity: number;
  readonly shortageQuantity: number;
}

/** إقرار استلام — acknowledges the consignee's receipt of a delivered shipment. */
export interface DeliveryReceiptPrintData {
  readonly receiptNo: string;
  readonly shipmentNo: string;
  readonly waybillNo: string;
  readonly deliveryCity: string;
  readonly deliveryDate: string;
  readonly driverName: string;
  readonly lines: readonly DeliveryReceiptRow[];
  readonly totalShortage: number;
}

export type ShippingInvoiceStatus = 'paid' | 'partial' | 'unpaid';

/** فاتورة شحن — the tax invoice billed to the shipment's customer. */
export interface ShippingInvoicePrintData {
  readonly invoiceNo: string;
  readonly shipmentNo: string;
  readonly billedTo: string;
  readonly issueDate: string;
  readonly dueDate: string;
  readonly destinationCity: string;
  readonly description: string;
  readonly priceLabel: string;
  readonly subtotalLabel: string;
  readonly vatRatePercent: number;
  readonly vatLabel: string;
  readonly totalLabel: string;
  readonly statusLabel: string;
  readonly status: ShippingInvoiceStatus;
}
