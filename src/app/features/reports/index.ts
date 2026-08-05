// Re-export print dialog components and types from the shared layer.
// The canonical implementations live in shared/ui/print-dialogs so that
// any feature can import them without crossing layer boundaries (Charter AD-03).
export { LoadingManifestDialog } from '@shared/ui/print-dialogs';
export { WaybillBatchDialog } from '@shared/ui/print-dialogs';
export { ReceiptBatchDialog } from '@shared/ui/print-dialogs';
export type {
  TripManifestData,
  ManifestShipmentRow,
  WaybillBatchData,
  WaybillShipmentRow,
  ReceiptBatchData,
  ReceiptShipmentRow,
} from '@shared/ui/print-dialogs';
export {
  MANIFEST_FIXTURE,
  WAYBILL_BATCH_FIXTURE,
  RECEIPT_BATCH_FIXTURE,
} from './models/report.fixtures';

// Receipt-voucher print reports (canonical implementations live in this feature).
export { ReceiptVouchersLogDialog } from './receipt-vouchers-log-dialog/receipt-vouchers-log-dialog';
export { ReceiptVoucherDialog } from './receipt-voucher-dialog/receipt-voucher-dialog';
export type {
  ReceiptVoucherLogRow,
  ReceiptVoucherCollectedAmount,
  ReceiptVouchersLogData,
  ReceiptVoucherPrintData,
} from './models/receipt-voucher-report.models';

// Single-shipment print reports (canonical implementations live in this feature —
// only ever opened from the shipment-details dialog, same reasoning as above).
export { ReceivingReceiptDialog } from './receiving-receipt-dialog/receiving-receipt-dialog';
export { PackingListDialog } from './packing-list-dialog/packing-list-dialog';
export { WaybillDialog } from './waybill-dialog/waybill-dialog';
export { DeliveryReceiptDialog } from './delivery-receipt-dialog/delivery-receipt-dialog';
export { ShippingInvoiceDialog } from './shipping-invoice-dialog/shipping-invoice-dialog';
export type {
  PackingListRow,
  PackingListTotals,
  PackingListPrintData,
  DeliveryReceiptRow,
  DeliveryReceiptPrintData,
  ShippingInvoiceStatus,
  ShippingInvoicePrintData,
} from './models/shipment-print-report.models';

// Trip-level print report (canonical implementation lives in this feature —
// only ever opened from the trips feature's trip-details dialog).
export { AdvanceReceiptDialog } from './advance-receipt-dialog/advance-receipt-dialog';
export type { AdvanceReceiptPrintData } from './models/advance-receipt-report.models';
