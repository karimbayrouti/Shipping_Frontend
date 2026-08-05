# Reports Feature — Print Document Dialogs

Standalone print dialogs for El Ramah official paper forms.
Each dialog appends itself to `document.body` so it renders above every other layer.

## Usage

```typescript
import {
  LoadingManifestDialog,
  WaybillBatchDialog,
  ReceiptBatchDialog,
  ReceiptVouchersLogDialog,
  ReceiptVoucherDialog,
  ReceivingReceiptDialog,
  PackingListDialog,
  WaybillDialog,
  DeliveryReceiptDialog,
  ShippingInvoiceDialog,
  AdvanceReceiptDialog,
  TripManifestData,
  WaybillBatchData,
  ReceiptBatchData,
  ReceiptVouchersLogData,
  ReceiptVoucherPrintData,
  ReceiptShipmentRow,
  WaybillShipmentRow,
  PackingListPrintData,
  DeliveryReceiptPrintData,
  ShippingInvoicePrintData,
  AdvanceReceiptPrintData,
} from '@features/reports';
```

## Dialogs

| Selector                          | Input                            | Description                                                                                          |
| --------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `app-loading-manifest-dialog`     | `data: TripManifestData`         | بيان تحميل الشاحنة                                                                                   |
| `app-waybill-batch-dialog`        | `data: WaybillBatchData`         | طباعة كل البوالص (one page per waybill)                                                              |
| `app-receipt-batch-dialog`        | `data: ReceiptBatchData`         | طباعة إيصالات الاستلام (one page per receipt)                                                        |
| `app-receipt-vouchers-log-dialog` | `data: ReceiptVouchersLogData`   | سجل سندات القبض (statement, all vouchers of a shipment on one page)                                  |
| `app-receipt-voucher-dialog`      | `data: ReceiptVoucherPrintData`  | سند قبض (a single receipt voucher)                                                                   |
| `app-receiving-receipt-dialog`    | `data: ReceiptShipmentRow`       | إذن استلام (a single shipment's receiving receipt)                                                   |
| `app-packing-list-dialog`         | `data: PackingListPrintData`     | قائمة التعبئة (a single shipment's packing list)                                                     |
| `app-waybill-dialog`              | `data: WaybillShipmentRow`       | بوليصة شحن (a single shipment's waybill)                                                             |
| `app-delivery-receipt-dialog`     | `data: DeliveryReceiptPrintData` | إقرار استلام (consignee's delivery acknowledgment, opened from the `deliveryReceipt` doc-chain node) |
| `app-shipping-invoice-dialog`     | `data: ShippingInvoicePrintData` | فاتورة شحن (the shipment's tax invoice, opened from the `invoice` doc-chain node)                    |
| `app-advance-receipt-dialog`      | `data: AdvanceReceiptPrintData`  | إيصال سلفة سائق (a trip's driver cash-advance receipt, opened from the trip-details "المستندات" tab) |

All dialogs emit `(closed)` when the user clicks the backdrop or the close button.

Unlike the first three dialogs (whose canonical implementations live in
`shared/ui/print-dialogs` and are re-exported here), `ReceiptVouchersLogDialog`,
`ReceiptVoucherDialog`, `ReceivingReceiptDialog`, `PackingListDialog`,
`WaybillDialog`, `DeliveryReceiptDialog` and `ShippingInvoiceDialog` are
implemented directly in this feature — they are only ever opened from the
shipments feature (shipment-details dialog), so there is no cross-feature
reuse need that would justify promoting them to `shared/`.
`ReceivingReceiptDialog` and `WaybillDialog` reuse the `ReceiptShipmentRow` /
`WaybillShipmentRow` contracts already owned by `shared/ui/print-dialogs`
instead of duplicating them, since they render one entry of the same paper
layout used by the batch dialogs.

`AdvanceReceiptDialog` is likewise implemented directly in this feature, but
is only ever opened from the trips feature's trip-details dialog (the
"المستندات" tab) — its `AdvanceReceiptPrintData` is built straight from a
live `Trip` (see `features/trips/utils/trip-print.util.ts`), the same way
`TripManifestData` and `WaybillBatchData` are.

`ReceiptVouchersLogData`, `ReceiptVoucherPrintData` and the five single-
shipment reports above are all built from the live `ShipmentDetails` of the
shipment being viewed (see `features/shipments/utils/receipt-voucher-report.util.ts`
and `features/shipments/utils/shipment-print-report.util.ts`), not from a
static fixture — so once `ShipmentDetails` is fetched from the API instead of
the local fixtures, these reports stay correct with no further changes. Fields
not yet tracked on `ShipmentDetails` (e.g. street addresses, truck/driver
profile details, freight-fee breakdown, a dedicated invoice issue/due date)
render as `—` or use a documented fallback rule until the backend model
carries them; these spots are marked with `TODO` comments in the mapping util.

`DeliveryReceiptPrintData` is built from the shipment's own `packageLines`
(sent/delivered/shortage quantities) and its `تم التسليم` timeline event.
`ShippingInvoicePrintData` derives its subtotal from `financial.finalValue`,
computes VAT at a fixed 14% rate, and maps `financial.collectionStatus` to the
invoice's paid/partial/unpaid badge — so the badge always reflects the
shipment's real payment state instead of a hardcoded value.

## Print Styles

All print CSS lives in `src/styles/prints.scss`, imported globally via `styles.scss`.
The `.print-overlay` class handles the fullscreen overlay (z-index 1500).
`@media print` rules ensure only the `.doc-viewer` content is printed on A4.

## Data vs. Backend

Data inputs currently accept raw objects. Once the backend is ready, create a
service in this folder (e.g. `reports.service.ts`) that fetches and maps the
API response to these interfaces.
