/**
 * Scoped, deliberate exception to the feature-isolation rule (Charter AD-03).
 * Receipt-voucher printing reuses the print-report contracts owned by the
 * reports feature instead of duplicating them here; duplicating them would
 * violate the "reuse, don't recreate" requirement instead. If this pairing
 * grows, promote these contracts into `shared/`.
 */
import {
  ReceiptVoucherCollectedAmount,
  ReceiptVoucherPrintData,
  ReceiptVouchersLogData,
  // eslint-disable-next-line boundaries/element-types -- see comment above
} from '@features/reports';
import { ShipmentCurrency } from '../models/shipment.model';
import {
  ShipmentDetails,
  ShipmentPaymentMethod,
  ShipmentReceiptVoucher,
} from '../models/shipment-details.model';
import { resolveCurrencySymbol } from './currency.util';

/** Print documents are fixed Arabic paper forms and never theme with the UI language. */
const PAYMENT_METHOD_LABEL_AR: Record<ShipmentPaymentMethod, string> = {
  cash: 'نقدي',
  transfer: 'تحويل',
  bankDeposit: 'إيداع بنكي',
  check: 'شيك',
  card: 'بطاقة',
};

export function formatShipmentNo(shipmentId: number): string {
  return `SH-${String(shipmentId).padStart(3, '0')}`;
}

export function formatMoney(amount: number, currency: ShipmentCurrency): string {
  return `${amount.toLocaleString('en-US')} ${resolveCurrencySymbol(currency, 'ar')}`;
}

function collectedByCurrency(
  vouchers: readonly ShipmentReceiptVoucher[],
): readonly ReceiptVoucherCollectedAmount[] {
  const totals = new Map<ShipmentCurrency, number>();
  for (const voucher of vouchers) {
    totals.set(voucher.currency, (totals.get(voucher.currency) ?? 0) + voucher.amount);
  }
  return Array.from(totals, ([currency, amount]) => ({
    amount: amount.toLocaleString('en-US'),
    currency,
  }));
}

/** Builds the "سجل سندات القبض" statement data from a shipment's own receipt vouchers. */
export function toReceiptVouchersLogData(details: ShipmentDetails): ReceiptVouchersLogData {
  const { summary, financial, stages } = details;
  const waybillNo = stages.find((stage) => stage.key === 'waybill')?.reference ?? '—';

  return {
    logNo: `PR-${String(details.id).padStart(3, '0')}`,
    shipmentNo: formatShipmentNo(details.id),
    waybillNo,
    customerName: summary.senderName,
    customerPhone: summary.senderPhone,
    vouchers: financial.receiptVouchers.map((voucher) => ({
      voucherNo: voucher.voucherNo,
      date: voucher.date,
      paymentMethod: PAYMENT_METHOD_LABEL_AR[voucher.method],
      receivedBy: voucher.receivedBy,
      notes: '',
      amount: formatMoney(voucher.amount, voucher.currency),
    })),
    collectedByCurrency: collectedByCurrency(financial.receiptVouchers),
    priceBeforeDiscount: formatMoney(financial.priceBeforeDiscount, financial.currency),
    finalValue: formatMoney(financial.finalValue, financial.currency),
    paid: formatMoney(financial.paid, financial.currency),
    remaining: formatMoney(financial.remaining, financial.currency),
  };
}

/** Builds the single "سند قبض" print data for one voucher of the given shipment. */
export function toReceiptVoucherPrintData(
  details: ShipmentDetails,
  voucher: ShipmentReceiptVoucher,
): ReceiptVoucherPrintData {
  const { summary, financial } = details;

  return {
    voucherNo: voucher.voucherNo,
    shipmentNo: formatShipmentNo(details.id),
    date: voucher.date,
    customerName: summary.senderName,
    customerPhone: summary.senderPhone,
    paymentMethod: PAYMENT_METHOD_LABEL_AR[voucher.method],
    receivedBy: voucher.receivedBy,
    amount: formatMoney(voucher.amount, voucher.currency),
    finalValue: formatMoney(financial.finalValue, financial.currency),
    remaining: formatMoney(financial.remaining, financial.currency),
  };
}
