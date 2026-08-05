export const SHIPMENTS_VOUCHERS_EN = {
  paymentMethodCash: 'Cash',
  paymentMethodTransfer: 'Transfer',
  paymentMethodBankDeposit: 'Bank Deposit',
  paymentMethodCheck: 'Check',
  paymentMethodCard: 'Card',
  voucherAmount: 'Amount',
  voucherPaymentMethod: 'Payment Method',
  voucherReferenceNo: 'Reference No.',
  voucherPrintAfterSave: '🖨 Open voucher for printing after saving',
  transferShipmentTitle: 'Transfer Shipment Between Warehouses',
  transferShipmentAction: 'Transfer Between Warehouses',
  currentWarehouseLabel: 'Current Warehouse',
  transferToLabel: 'Transfer To',
  transferConfirmAction: 'Transfer To Another Warehouse',
} as const;

export type ShipmentsVouchersTranslations = Record<keyof typeof SHIPMENTS_VOUCHERS_EN, string>;

export const SHIPMENTS_VOUCHERS_AR: ShipmentsVouchersTranslations = {
  paymentMethodCash: 'نقدي',
  paymentMethodTransfer: 'تحويل',
  paymentMethodBankDeposit: 'إيداع بنكي',
  paymentMethodCheck: 'شيك',
  paymentMethodCard: 'بطاقة',
  voucherAmount: 'المبلغ',
  voucherPaymentMethod: 'طريقة الدفع',
  voucherReferenceNo: 'رقم مرجعي',
  voucherPrintAfterSave: '🖨 فتح السند للطباعة بعد الحفظ',
  transferShipmentTitle: 'نقل شحنة بين المستودعات',
  transferShipmentAction: 'نقل بين المستودعات',
  currentWarehouseLabel: 'المستودع الحالي',
  transferToLabel: 'نقل إلى',
  transferConfirmAction: 'نقل لمستودع آخر',
};
