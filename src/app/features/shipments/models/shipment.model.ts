export type ShipmentStatus =
  | 'draft'
  | 'ready'
  | 'assigned'
  | 'loaded'
  | 'inTransit'
  | 'delivered'
  | 'returned'
  | 'cancelled'
  | 'closed';

export type ShipmentCollectionStatus = 'collected' | 'partialCollected' | 'uncollected';

export type ShipmentCurrency = 'EGP' | 'USD' | 'KWD' | 'SAR' | 'QAR' | 'AED';

export type ShipmentWarehouse = 'cairo' | 'alexandria' | 'kuwait' | 'doha';

export type ShipmentDirection = 'outbound' | 'inbound' | 'return';

export type ShipmentTransportMode = 'land' | 'sea' | 'air' | 'multimodal';

export type ShipmentPackageType =
  'carton' | 'sack' | 'bag' | 'pallet' | 'woodenBox' | 'plasticBox' | 'roll' | 'other';

export type ShipmentGoodsCategory =
  | 'clothing'
  | 'shoes'
  | 'books'
  | 'foodstuff'
  | 'furniture'
  | 'electronics'
  | 'industrialEquipment'
  | 'medicalEquipment'
  | 'buildingMaterials'
  | 'other';

export type ShipmentCustomerType = 'individual' | 'company';

export interface ShipmentCustomerOption {
  readonly id: number;
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly city: string;
  readonly balance: number;
  readonly customerType?: ShipmentCustomerType;
}

export interface ShipmentCustomerDraft {
  readonly name: string;
  readonly phone: string;
  readonly customerType: ShipmentCustomerType;
  readonly email: string;
  readonly address: string;
  readonly city: string;
  readonly country: string;
}

export interface PackageLineDraft {
  readonly itemName: string;
  readonly pieceCount: number | null;
  readonly packageCount: number | null;
  readonly netWeightKg: number | null;
  readonly grossWeightKg: number | null;
  readonly lengthCm: number | null;
  readonly widthCm: number | null;
  readonly heightCm: number | null;
  readonly stackable: boolean;
  readonly fragile: boolean;
  readonly notes: string;
}

export interface ShipmentDraft {
  readonly customerId: number | null;
  readonly currency: ShipmentCurrency;
  readonly senderDiffersFromCustomer: boolean;
  readonly senderName: string;
  readonly senderPhone: string;
  readonly senderAddress: string;
  readonly receiverName: string;
  readonly receiverPhone: string;
  readonly receiverAddress: string;
  readonly originCity: string;
  readonly transportMode: ShipmentTransportMode;
  readonly destinationCountry: string;
  readonly destinationCity: string;
  readonly direction: ShipmentDirection;
  readonly packageType: ShipmentPackageType;
  readonly goodsCategory: ShipmentGoodsCategory;
  readonly packageLines: readonly PackageLineDraft[];
  readonly price: number | null;
  readonly finalValue: number | null;
  readonly warehouse: ShipmentWarehouse;
  readonly warehouseKeeper: string;
  readonly warehouseNotes: string;
}

export interface Shipment {
  readonly id: number;
  readonly customerName: string;
  readonly destinationCountry: string;
  readonly destinationCity: string;
  readonly warehouse: ShipmentWarehouse;
  readonly packageCount: number;
  readonly finalValue: number;
  readonly remainingBalance: number | null;
  readonly currency: ShipmentCurrency;
  readonly tripNumber: string | null;
  readonly collectionStatus: ShipmentCollectionStatus | null;
  readonly status: ShipmentStatus;
  readonly hasShortage: boolean;
}

export type ShipmentStatusFilter = ShipmentStatus | 'all' | 'shortage';
export type ShipmentWarehouseFilter = ShipmentWarehouse | 'all';
