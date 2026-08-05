/**
 * Scoped, deliberate exception to the feature-isolation rule (Charter AD-03).
 * Trip shipments are shipments — reusing the `ShipmentWarehouse` type here
 * avoids a duplicate, driftable copy of the warehouse-to-city mapping.
 */
// eslint-disable-next-line boundaries/element-types -- see comment above
import { ShipmentWarehouse } from '@features/shipments/models/shipment.model';

/** Arabic city label for each source warehouse, matching the shipments feature's own mapping. */
export const WAREHOUSE_CITY_LABEL: Record<ShipmentWarehouse, string> = {
  cairo: 'القاهرة',
  alexandria: 'الإسكندرية',
  kuwait: 'الكويت',
  doha: 'الدوحة',
};

export interface TripRouteInput {
  readonly originCity: string;
  readonly destinationCity: string;
}

/** A single stop chip in the trip route strip, tagged so the UI can pick the matching icon. */
export interface TripRouteStop {
  readonly city: string;
  readonly kind: 'origin' | 'destination';
}

/**
 * Builds the ordered, de-duplicated list of route stops (origin cities
 * first, then destination cities) shown as connected chips in the
 * trip-planning dialog. Recomputed live as the person selects shipments.
 */
export function buildTripRouteStops(
  shipments: readonly TripRouteInput[],
): readonly TripRouteStop[] {
  const origins: string[] = [];
  const destinations: string[] = [];

  for (const shipment of shipments) {
    if (!origins.includes(shipment.originCity)) {
      origins.push(shipment.originCity);
    }
    if (!destinations.includes(shipment.destinationCity)) {
      destinations.push(shipment.destinationCity);
    }
  }

  return [
    ...origins.map((city) => ({ city, kind: 'origin' as const })),
    ...destinations.map((city) => ({ city, kind: 'destination' as const })),
  ];
}

/** Distinct loading (origin) points among the selected shipments. */
export function countLoadingPoints(shipments: readonly TripRouteInput[]): number {
  return new Set(shipments.map((shipment) => shipment.originCity)).size;
}

/** Distinct delivery (destination) points among the selected shipments. */
export function countDeliveryPoints(shipments: readonly TripRouteInput[]): number {
  return new Set(shipments.map((shipment) => shipment.destinationCity)).size;
}
