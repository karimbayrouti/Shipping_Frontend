export interface TripAssignmentOption {
  readonly truckPlate: string;
  readonly capacityKg: number;
}

/**
 * Trucks available for the "شاحنة داخلية" (internal truck) assignment
 * select. Kept local to the trips feature — the trucks feature's fixture
 * list is smaller than the fleet referenced across trip history, and
 * duplicating a handful of display rows here is simpler than widening a
 * cross-feature dependency (Charter AD-03: reuse only when it removes real
 * duplication).
 */
export const TRIP_ASSIGNMENT_OPTIONS: readonly TripAssignmentOption[] = [
  { truckPlate: 'ق ط ر ١٢٣٤', capacityKg: 20000 },
  { truckPlate: 'ص ع د ٥٦٧٨', capacityKg: 18000 },
  { truckPlate: 'ر س ط ٣٤٥٦', capacityKg: 22000 },
  { truckPlate: 'ل م ن ٩٠١٢', capacityKg: 22000 },
];

/**
 * Driver-name pool for the trip form's independent "Responsible Driver" and
 * "Driver Assistant" selects. Assignment is no longer derived from the
 * selected truck, so both selects share this same list.
 */
export const DRIVER_NAMES: readonly string[] = [
  'يوسف الحناوي',
  'حسن المغربي',
  'إبراهيم سعيد',
  'طارق سليمان',
  'عبد الله رشاد',
];
