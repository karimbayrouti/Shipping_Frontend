/**
 * Scoped, deliberate exception to the feature-isolation rule (Charter AD-03).
 * A trip's shipments are shipments — reusing `ShipmentCurrency` avoids a
 * duplicate, driftable copy of the currency enum.
 */
// eslint-disable-next-line boundaries/element-types -- see comment above
import { ShipmentCurrency } from '@features/shipments/models/shipment.model';

export type TripStatus =
  'planned' | 'inProgress' | 'arrived' | 'completed' | 'closed' | 'cancelled';

export type TripAssignmentMode = 'internal' | 'external';

export interface TripExternalVehicle {
  readonly ownerName: string;
  readonly vehicleType: string;
  readonly model: string;
  readonly plateNumber: string;
  readonly capacityKg: number | null;
}

export interface TripExternalDriver {
  readonly name: string;
  readonly phone: string;
  readonly passportNo: string;
  readonly nationality: string;
  readonly license: string;
  readonly licenseExpiry: string;
}

export interface TripActivityLogEntry {
  readonly message: string;
  readonly detail: string | null;
  readonly actor: string;
  readonly time: string;
  readonly icon: string;
}

export interface TripFieldOps {
  readonly durationLabel: string;
  readonly drivingTimeLabel: string;
  readonly fuelTimeLabel: string;
  readonly stopsCount: number;
  readonly idleTimeLabel: string;
  readonly avgDeliveryTimeLabel: string;
  readonly arrivalPerformance: 'onTime' | 'late' | 'unknown';
  readonly distanceKmLabel: string;
}

export interface TripCollectionEntry {
  readonly time: string;
  readonly shipmentNo: string;
  readonly customerName: string;
  readonly amount: number;
  readonly currency: string;
  readonly paymentMethod: string;
  readonly location: string;
  readonly collectedBy: string;
}

export interface TripExpenseEntry {
  readonly category: string;
  readonly icon: string;
  readonly amount: number;
  readonly currency: string;
  readonly date: string;
  readonly driver: string;
  readonly note: string;
}

/**
 * A trip (waybill) groups one or more shipments under a single truck/driver
 * assignment. Financial totals are display-only mock aggregates until the
 * backend owns the calculation (same convention as `Shipment`).
 */
export interface Trip {
  readonly id: number;
  readonly tripNo: string;
  readonly waybillNo: string;
  readonly status: TripStatus;
  readonly originCity: string;
  readonly destinationCountry: string;
  readonly destinationCity: string;
  readonly waybillCreatedDate: string | null;
  readonly tripStartDate: string;
  readonly expectedDeparture: string;
  readonly actualDeparture: string | null;
  readonly expectedArrival: string;
  readonly actualArrival: string | null;
  readonly assignmentMode: TripAssignmentMode;
  readonly driverName: string;
  readonly truckPlate: string;
  readonly driverAdvance: number;
  readonly driverAdvanceIssued: boolean;
  readonly shipmentIds: readonly number[];
  readonly totalRevenue: number;
  readonly totalExpenses: number;
  readonly fieldOps: TripFieldOps | null;
  readonly activityLog: readonly TripActivityLogEntry[];
  readonly collections: readonly TripCollectionEntry[];
  readonly expenses: readonly TripExpenseEntry[];
}

/** Data captured while planning a new trip in the trip-form dialog. */
export interface TripDraft {
  readonly tripStartDate: string;
  readonly expectedDeparture: string;
  readonly expectedArrival: string;
  readonly expectedReturn: string;
  readonly assignmentMode: TripAssignmentMode;
  readonly truckPlate: string;
  readonly driverName: string;
  readonly helperName: string;
  readonly externalVehicle: TripExternalVehicle;
  readonly externalDriver: TripExternalDriver;
  readonly driverAdvance: number | null;
  readonly shipmentIds: readonly number[];
}

export type TripStatusFilter = TripStatus | 'all';

/** A ready-to-dispatch shipment row offered in the trip-form's shipment picker. */
export interface TripPickableShipment {
  readonly id: number;
  readonly shipmentNo: string;
  readonly customerName: string;
  readonly originCity: string;
  readonly destinationCity: string;
  readonly direction: 'outbound' | 'inbound' | 'return';
  readonly packageCount: number;
  readonly weightKg: number;
  readonly valueLabel: string;
  readonly rawValue: number;
  readonly currency: ShipmentCurrency;
  readonly statusLabel: string;
}

/** Aggregates shown in the pre-departure checklist modal for a trip. */
export interface TripDepartureSummary {
  readonly trip: Trip;
  readonly loadedCount: number;
  readonly totalPackages: number;
  readonly totalWeightKg: number;
  readonly customerCount: number;
  readonly destinationCities: readonly string[];
  readonly dueCollections: readonly { readonly amount: number; readonly currency: string }[];
  readonly notLoadedShipmentNos: readonly string[];
}

/** A shipment row as displayed inside the trip-details "شحنات الرحلة" tab. */
export interface TripShipmentRow {
  readonly id: number;
  readonly shipmentNo: string;
  readonly customerName: string;
  readonly counterpartyName: string;
  readonly originCity: string;
  readonly destinationCity: string;
  readonly packageCount: number;
  readonly chargeLabel: string;
  readonly statusKey: string;
  readonly statusLabel: string;
  readonly direction: 'outbound' | 'inbound' | 'return';
}
