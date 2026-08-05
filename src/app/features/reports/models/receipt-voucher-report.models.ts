export interface ReceiptVoucherLogRow {
  readonly voucherNo: string;
  readonly date: string;
  readonly paymentMethod: string;
  readonly receivedBy: string;
  readonly notes: string;
  readonly amount: string;
}

export interface ReceiptVoucherCollectedAmount {
  readonly amount: string;
  readonly currency: string;
}

export interface ReceiptVouchersLogData {
  readonly logNo: string;
  readonly shipmentNo: string;
  readonly waybillNo: string;
  readonly customerName: string;
  readonly customerPhone: string;
  readonly vouchers: readonly ReceiptVoucherLogRow[];
  readonly collectedByCurrency: readonly ReceiptVoucherCollectedAmount[];
  readonly priceBeforeDiscount: string;
  readonly finalValue: string;
  readonly paid: string;
  readonly remaining: string;
}

export interface ReceiptVoucherPrintData {
  readonly voucherNo: string;
  readonly shipmentNo: string;
  readonly date: string;
  readonly customerName: string;
  readonly customerPhone: string;
  readonly paymentMethod: string;
  readonly receivedBy: string;
  readonly amount: string;
  readonly finalValue: string;
  readonly remaining: string;
}
