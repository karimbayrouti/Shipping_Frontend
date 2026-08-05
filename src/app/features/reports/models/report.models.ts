export interface ManifestShipmentRow {
  readonly shipmentNo: string;
  readonly clientName: string;
  readonly destinationCity: string;
  readonly packages: number;
  readonly packageType: string;
  readonly goodsCategory: string;
  readonly weightKg: number;
  readonly volumeM3: string;
  readonly dimensionsCm: string;
  readonly notes: string;
}

export interface TripManifestData {
  readonly manifestNo: string;
  readonly tripNo: string;
  readonly loadingDate: string;
  readonly warehouse: string;
  readonly destination: string;
  readonly status: string;
  readonly truckPlate: string;
  readonly truckModel: string;
  readonly truckOwner: string;
  readonly truckCapacityKg: number;
  readonly driverName: string;
  readonly driverPhone: string;
  readonly driverLicense: string;
  readonly driverPassport: string;
  readonly shipments: readonly ManifestShipmentRow[];
  readonly totalRevenue: string;
}

export interface WaybillShipmentRow {
  readonly waybillNo: string;
  readonly date: string;
  readonly shipper: string;
  readonly consignee: string;
  readonly originCity: string;
  readonly destinationCity: string;
  readonly packages: number;
  readonly weightTon: number;
  readonly packageType: string;
  readonly goodsCategory: string;
  readonly goodsDescription: string;
  readonly quantity: number;
  readonly volumeM3: string;
  readonly dimensionsCm: string;
  readonly freightFee: string;
  readonly freightBalance: string;
  readonly driverAdvance: string;
  readonly notes: string;
  readonly truckPlate: string;
  readonly truckModel: string;
  readonly truckColor: string;
  readonly truckYear: string;
  readonly truckCapacity: string;
  readonly truckOwner: string;
  readonly driverName: string;
  readonly driverPhone: string;
  readonly driverNationality: string;
  readonly driverNationalId: string;
  readonly driverPassport: string;
  readonly driverPassportIssue: string;
  readonly driverLicense: string;
  readonly driverLicenseExpiry: string;
  readonly driverAddress: string;
  readonly ownerAddress: string;
  readonly ownerNationality: string;
  readonly managerName: string;
}

export interface WaybillBatchData {
  readonly tripNo: string;
  readonly waybills: readonly WaybillShipmentRow[];
}

export interface ReceiptShipmentRow {
  readonly receiptNo: string;
  readonly shipmentNo: string;
  readonly date: string;
  readonly dayOfWeek: string;
  readonly senderName: string;
  readonly senderPhone: string;
  readonly senderAddress: string;
  readonly consigneeName: string;
  readonly consigneePhone: string;
  readonly consigneeAddress: string;
  readonly packages: number;
  readonly weightKg: number;
  readonly packageType: string;
  readonly quantity: number;
  readonly goodsCategory: string;
  readonly volumeM3: string;
  readonly dimensionsCm: string;
  readonly shippingPrice: string;
  readonly goodsDescription: string;
  readonly notes: string;
  readonly warehouse: string;
  readonly warehousekeeper: string;
}

export interface ReceiptBatchData {
  readonly tripNo: string;
  readonly receipts: readonly ReceiptShipmentRow[];
}
