import { ShipmentDiscountType } from '../models/shipment-details.model';

/** Resolves the discount amount in the shipment's currency, clamped to the price range. */
export function calculateDiscountAmount(
  discountType: ShipmentDiscountType,
  value: number,
  priceBeforeDiscount: number,
): number {
  if (!value || value <= 0 || priceBeforeDiscount <= 0) return 0;
  const rawAmount = discountType === 'percentage' ? (priceBeforeDiscount * value) / 100 : value;
  return Math.min(Math.max(rawAmount, 0), priceBeforeDiscount);
}
