import { ShipmentCurrency } from '../models/shipment.model';

/** Arabic currency abbreviations shown when the UI language is Arabic. */
const ARABIC_CURRENCY_SYMBOLS: Partial<Record<ShipmentCurrency, string>> = {
  EGP: 'ج.م',
  KWD: 'د.ك',
  SAR: 'ر.س',
  QAR: 'ر.ق',
  AED: 'د.إ',
};

/**
 * Resolves the currency label for money amounts: the Arabic abbreviation when
 * the UI language is Arabic, otherwise the ISO code. USD always renders as
 * `$` regardless of language.
 */
export function resolveCurrencySymbol(currency: ShipmentCurrency, language: 'ar' | 'en'): string {
  if (currency === 'USD') return '$';
  if (language !== 'ar') return currency;
  return ARABIC_CURRENCY_SYMBOLS[currency] ?? currency;
}
