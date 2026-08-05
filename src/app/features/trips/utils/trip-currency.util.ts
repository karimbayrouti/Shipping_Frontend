/**
 * Scoped, deliberate exception to the feature-isolation rule (Charter AD-03) —
 * see trip-route.util.ts for the same reasoning.
 */
// eslint-disable-next-line boundaries/element-types -- see comment above
import { ShipmentCurrency } from '@features/shipments/models/shipment.model';

// Approximate display-only conversion rates to EGP. Mirrors the ratios the
// trips prototype itself uses when summing mixed-currency shipment charges
// into a single "≈" total. Not a live exchange rate — display data only
// until the backend owns currency conversion.
const APPROX_EGP_RATE: Record<ShipmentCurrency, number> = {
  EGP: 1,
  USD: 50,
  KWD: 163,
  SAR: 13,
  QAR: 13.7,
  AED: 13.6,
};

/** Converts a mixed-currency amount to an approximate EGP value for aggregate totals. */
export function toApproxEgp(amount: number, currency: ShipmentCurrency): number {
  return amount * APPROX_EGP_RATE[currency];
}

/** Formats an approximate EGP aggregate with the "≈" prefix used across the trips UI. */
export function formatApproxEgp(amount: number): string {
  return `≈ ${Math.round(amount).toLocaleString('en-US')}`;
}
