import currencyData from "./currency-symbols-complete"

/**
 * Union of all known currency codes (fiat, crypto, commodity),
 * derived automatically from the data source.
 *
 * Adding a new entry to currency-symbols-complete.ts updates this type
 * at compile time — no manual maintenance required.
 */
export type CurrencyCode = (typeof currencyData)[number]["code"]

/**
 * Array of all known currency codes, useful for Storybook argTypes and validation.
 */
export const currencyCodes: CurrencyCode[] = currencyData.map((entry) => entry.code)

/**
 * Lookup map from uppercase ISO 4217 currency code to its text symbol.
 * Built at module load from the data source (~180 entries).
 *
 * Examples: `{ USD: "$", EUR: "€", SEK: "kr", BTC: "₿" }`
 */
export const currencySymbolMap: Record<string, string> = Object.fromEntries(
  currencyData.map((entry) => [entry.code, entry.symbol]),
)

/**
 * Returns the text symbol for a given currency code (e.g. "USD" → "$", "SEK" → "kr").
 * Case-insensitive. Returns undefined for unknown or missing codes.
 */
export function getCurrencySymbol(code: CurrencyCode | string | undefined): string | undefined {
  if (!code) {
    return undefined
  }
  return currencySymbolMap[code.toUpperCase()]
}
