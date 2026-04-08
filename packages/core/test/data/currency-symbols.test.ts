import { describe, expect, it } from "vitest"
import type { CurrencyCode } from "../../src/data/currency-symbols"
import {
  currencyCodes,
  currencySymbolMap,
  getCurrencySymbol,
} from "../../src/data/currency-symbols"

describe("currencySymbolMap", () => {
  it("contains at least 170 currency entries", () => {
    const entryCount = Object.keys(currencySymbolMap).length
    expect(entryCount).toBeGreaterThanOrEqual(170)
  })

  it("maps well-known fiat currencies to their symbols", () => {
    expect(currencySymbolMap.USD).toBe("$")
    expect(currencySymbolMap.EUR).toBe("\u20ac")
    expect(currencySymbolMap.GBP).toBe("\u00a3")
    expect(currencySymbolMap.JPY).toBe("\u00a5")
  })

  it("maps multi-character symbols correctly", () => {
    expect(currencySymbolMap.SEK).toBe("kr")
  })

  it("maps crypto currencies", () => {
    expect(currencySymbolMap.BTC).toBe("\u20bf")
  })

  it("has a non-empty string symbol for every entry", () => {
    for (const [code, symbol] of Object.entries(currencySymbolMap)) {
      expect(symbol, `symbol for ${code} should be a non-empty string`).toBeTruthy()
      expect(typeof symbol, `symbol for ${code} should be a string`).toBe("string")
    }
  })
})

describe("getCurrencySymbol", () => {
  it("returns the symbol for a known uppercase code", () => {
    expect(getCurrencySymbol("USD")).toBe("$")
    expect(getCurrencySymbol("EUR")).toBe("\u20ac")
    expect(getCurrencySymbol("GBP")).toBe("\u00a3")
    expect(getCurrencySymbol("JPY")).toBe("\u00a5")
  })

  it("handles multi-character symbols", () => {
    expect(getCurrencySymbol("SEK")).toBe("kr")
  })

  it("handles crypto currencies", () => {
    expect(getCurrencySymbol("BTC")).toBe("\u20bf")
  })

  it("is case-insensitive", () => {
    expect(getCurrencySymbol("usd")).toBe("$")
    expect(getCurrencySymbol("eur")).toBe("\u20ac")
  })

  it("returns undefined for unknown currency codes", () => {
    expect(getCurrencySymbol("DOESNOTEXIST")).toBeUndefined()
  })

  it("returns undefined when code is undefined", () => {
    expect(getCurrencySymbol(undefined)).toBeUndefined()
  })
})

describe("currencyCodes", () => {
  it("contains all entries from the data source", () => {
    const symbolMapKeys = Object.keys(currencySymbolMap)
    expect(currencyCodes).toHaveLength(symbolMapKeys.length)
  })

  it("includes representative codes from each category (fiat, crypto, commodity)", () => {
    expect(currencyCodes).toContain("USD")
    expect(currencyCodes).toContain("EUR")
    expect(currencyCodes).toContain("SEK")
    expect(currencyCodes).toContain("BTC")
    expect(currencyCodes).toContain("XAU")
  })

  it("has a corresponding symbol for every code", () => {
    for (const code of currencyCodes) {
      expect(
        currencySymbolMap[code],
        `${code} should have a symbol in currencySymbolMap`,
      ).toBeTruthy()
    }
  })

  it("CurrencyCode type accepts known codes", () => {
    // Compile-time check — if this compiles, the type is correct
    const usd: CurrencyCode = "USD"
    const sek: CurrencyCode = "SEK"
    const btc: CurrencyCode = "BTC"
    const xau: CurrencyCode = "XAU"
    expect(usd).toBe("USD")
    expect(sek).toBe("SEK")
    expect(btc).toBe("BTC")
    expect(xau).toBe("XAU")
  })
})
