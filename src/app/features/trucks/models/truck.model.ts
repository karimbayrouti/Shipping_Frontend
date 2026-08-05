export type TruckStatus = 'onRoad' | 'available' | 'offDuty';

export interface InsurancePolicy {
  readonly count: number;
  readonly nearestExpiry: string;
  readonly state: 'active' | 'expiringSoon' | 'expired';
}

export type TransportType = 'owned' | 'rented' | 'leased';

export type Currency = 'EGP' | 'USD' | 'SAR' | 'QAR' | 'AED';

export interface InsurancePolicyDraft {
  readonly truckId: number | null;
  readonly insuranceCompany: string;
  readonly country: string;
  readonly policyNo: string;
  readonly coverageType: string;
  readonly issueDate: string;
  readonly expiryDate: string;
  readonly policyCost: number | null;
  readonly currency: Currency;
  readonly attachment: string;
  readonly notes: string;
}

export type VehicleRecordType =
  | 'oilChange'
  | 'engineMaint'
  | 'brakeService'
  | 'tires'
  | 'battery'
  | 'insurance'
  | 'licenseRenewal'
  | 'registration'
  | 'inspection'
  | 'accident'
  | 'repair'
  | 'unexpectedFailure'
  | 'cleaning'
  | 'fuel'
  | 'transmission'
  | 'trafficViolation'
  | 'fine'
  | 'govFees'
  | 'accessories'
  | 'otherExpense';

export type VehicleRecordStatus = 'done' | 'scheduled' | 'pending';

export interface VehicleRecordDraft {
  readonly truckId: number | null;
  readonly recordType: VehicleRecordType;
  readonly date: string;
  readonly mileageKm: number | null;
  readonly cost: number | null;
  readonly currency: Currency;
  readonly supplier: string;
  readonly invoiceNo: string;
  readonly attachment: string;
  readonly nextServiceDate: string;
  readonly reminderDate: string;
  readonly status: VehicleRecordStatus;
  readonly notes: string;
}

export interface VehicleRecord {
  readonly id: number;
  readonly date: string;
  readonly recordType: VehicleRecordType;
  readonly recordTypeLabel: string;
  readonly mileageKm: number | null;
  readonly costEgp: number;
  readonly costDisplay: string;
  readonly supplier: string;
  readonly invoiceNo: string;
  readonly nextServiceDate: string | null;
  readonly status: VehicleRecordStatus;
  readonly notes: string;
}

export interface InsurancePolicyRecord {
  readonly id: number;
  readonly insuranceCompany: string;
  readonly country: string;
  readonly policyNo: string;
  readonly coverageType: string;
  readonly issueDate: string;
  readonly expiryDate: string;
  readonly costDisplay: string;
  readonly state: 'active' | 'expiringSoon' | 'expired';
  readonly attachment: string;
  readonly notes: string;
}

export interface TruckTrip {
  readonly tripNo: string;
  readonly destination: string;
  readonly departure: string;
  readonly driver: string;
  readonly status: string;
}

export type TimelineEventKind = 'maintenance' | 'insurance' | 'trip';

export interface TimelineEvent {
  readonly date: string;
  readonly kind: TimelineEventKind;
  readonly icon: string;
  readonly title: string;
  readonly subtitle: string;
}

export interface TruckRenewal {
  readonly label: string;
  readonly daysLeft: number | null;
  readonly overdue: boolean;
}

export interface TruckStats {
  readonly currentDriver: string;
  readonly currentTrip: string | null;
  readonly totalTrips: number;
  readonly tripsThisMonth: number;
  readonly distanceKm: string;
  readonly revenue: string;
  readonly expenses: string;
  readonly maintenanceCost: string;
  readonly fuelCost: string;
  readonly fines: number;
  readonly thisMonthCost: string;
  readonly thisYearCost: string;
  readonly currentMileageKm: string;
  readonly openReminders: number;
  readonly renewalCount: number;
  readonly renewalBannerText: string;
  readonly renewalBannerTextEn: string;
  readonly currentTripShipments: number | null;
  readonly currentTripNo: string | null;
}

export interface Truck {
  readonly id: number;
  readonly plateNumber: string;
  readonly vehicleType: string;
  readonly vehicleModel: string;
  readonly vehicleColor: string;
  readonly capacityKg: number;
  readonly transportType: TransportType;
  readonly vehicleLicenseNo: string;
  readonly licenseExpiry: string;
  readonly driverName: string | null;
  readonly insurance: InsurancePolicy | null;
  readonly maintenanceCostEgp: number;
  readonly status: TruckStatus;
  readonly ownerName: string;
  readonly ownerPhone: string;
  readonly ownerAddress: string;
  readonly stats: TruckStats;
  readonly vehicleRecords: readonly VehicleRecord[];
  readonly insuranceRecords: readonly InsurancePolicyRecord[];
  readonly trips: readonly TruckTrip[];
  readonly timeline: readonly TimelineEvent[];
}

export type TruckDraft = Pick<
  Truck,
  | 'plateNumber'
  | 'vehicleType'
  | 'vehicleModel'
  | 'vehicleColor'
  | 'capacityKg'
  | 'transportType'
  | 'vehicleLicenseNo'
  | 'licenseExpiry'
  | 'driverName'
  | 'status'
  | 'ownerName'
  | 'ownerPhone'
  | 'ownerAddress'
>;
