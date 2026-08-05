import {
  ShipmentCollectionStatus,
  ShipmentCurrency,
  ShipmentDirection,
  ShipmentGoodsCategory,
  ShipmentPackageType,
  ShipmentStatus,
  ShipmentTransportMode,
  ShipmentWarehouse,
} from './shipment.model';

export type ShipmentStageKey = 'receiving' | 'shipment' | 'waybill' | 'delivery' | 'settlement';
export type ShipmentStageState = 'done' | 'current' | 'pending';

export interface ShipmentStage {
  readonly key: ShipmentStageKey;
  readonly state: ShipmentStageState;
  readonly reference: string | null;
}

export interface ShipmentDetailsSummary {
  readonly senderName: string;
  readonly senderPhone: string;
  readonly warehouseKeeper: string;
  readonly receiverName: string;
  readonly receiverPhone: string | null;
  readonly destinationCountry: string;
  readonly destinationCity: string;
  readonly direction: ShipmentDirection;
  readonly transportMode: ShipmentTransportMode;
  readonly packageType: ShipmentPackageType;
  readonly goodsCategory: ShipmentGoodsCategory;
  readonly tripNumber: string | null;
  readonly driverName: string | null;
  readonly currentLocationApprox: string | null;
}

export interface ShipmentPackageLineDetail {
  readonly itemName: string;
  readonly packageCount: number;
  readonly pieceCount: number;
  readonly netWeightKg: number;
  readonly grossWeightKg: number;
  readonly dimensionsCm: string | null;
  readonly volumeM3: string | null;
  readonly stackable: boolean | null;
  readonly fragile: boolean | null;
  readonly deliveredCount: number;
  readonly shortageCount: number;
}

export interface ShipmentDriverConfirmation {
  readonly confirmed: boolean;
  readonly confirmedAt: string | null;
  readonly driverDisplayName: string;
}

export type ShipmentPaymentMethod = 'cash' | 'transfer' | 'bankDeposit' | 'check' | 'card';

export interface ShipmentReceiptVoucher {
  readonly voucherNo: string;
  readonly date: string;
  readonly method: ShipmentPaymentMethod;
  readonly receivedBy: string;
  readonly amount: number;
  readonly currency: ShipmentCurrency;
}

export interface ShipmentCollectedCurrencyAmount {
  readonly amount: number;
  readonly currency: ShipmentCurrency;
}

export interface ShipmentFinancialSummary {
  readonly currency: ShipmentCurrency;
  readonly priceBeforeDiscount: number;
  readonly discounts: number | null;
  readonly finalValue: number;
  readonly paid: number;
  readonly remaining: number;
  readonly collectedByDriver: number;
  readonly collectionStatus: ShipmentCollectionStatus;
  readonly collectedByCurrency: readonly ShipmentCollectedCurrencyAmount[];
  readonly receiptVouchers: readonly ShipmentReceiptVoucher[];
}

export interface ShipmentTimelineEvent {
  readonly label: string;
  readonly time: string | null;
  readonly done: boolean;
}

export interface ShipmentActivityLogEntry {
  readonly message: string;
  readonly actor: string;
  readonly time: string;
}

export type ShipmentDocumentKind =
  'receivingReceipt' | 'packingList' | 'deliveryAcknowledgment' | 'paymentReceipt';

export interface ShipmentDocumentLink {
  readonly kind: ShipmentDocumentKind;
}

export type ShipmentDocChainKind =
  | 'receivingReceipt'
  | 'waybill'
  | 'trip'
  | 'truck'
  | 'driver'
  | 'deliveryReceipt'
  | 'invoice'
  | 'paymentReceipt'
  | 'settlement';

export interface ShipmentDocChainNode {
  readonly kind: ShipmentDocChainKind;
  readonly referenceNo: string;
}

export interface ShipmentDetails {
  readonly id: number;
  readonly status: ShipmentStatus;
  readonly hasShortage: boolean;
  readonly stages: readonly ShipmentStage[];
  readonly summary: ShipmentDetailsSummary;
  readonly packageLines: readonly ShipmentPackageLineDetail[];
  readonly driverConfirmation: ShipmentDriverConfirmation;
  readonly financial: ShipmentFinancialSummary;
  readonly timeline: readonly ShipmentTimelineEvent[];
  readonly activityLog: readonly ShipmentActivityLogEntry[];
  readonly documents: readonly ShipmentDocumentLink[];
  readonly docChain: readonly ShipmentDocChainNode[];
}

export interface ShipmentReceiptVoucherDraft {
  readonly shipmentId: number;
  readonly currency: ShipmentCurrency;
  readonly amount: number;
  readonly method: ShipmentPaymentMethod;
  readonly referenceNo: string;
  readonly receivedBy: string;
  readonly notes: string;
  readonly printAfterSave: boolean;
}

export interface ShipmentTransferDraft {
  readonly shipmentId: number;
  readonly targetWarehouse: ShipmentWarehouse;
}

export type ShipmentDiscountType = 'percentage' | 'fixed';

export interface ShipmentDiscountDraft {
  readonly shipmentId: number;
  readonly discountType: ShipmentDiscountType;
  readonly value: number;
  readonly reason: string;
  readonly notes: string;
}
