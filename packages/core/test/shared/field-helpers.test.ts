import { describe, expect, it } from "vitest"
import {
  buildAccordionFieldA11yIds,
  buildCheckboxFieldA11yIds,
  buildCurrencyHelperText,
  buildInputFieldA11yIds,
  buildRadioGroupFieldA11yIds,
  getCurrencySymbol,
  mergeIdRefs,
  sanitizeCurrencyValue,
} from "../../src/shared/field-helpers"

describe("field helpers", () => {
  it("mergeIdRefs joins truthy ids only", () => {
    expect(mergeIdRefs(undefined, "a", false, "b", null)).toBe("a b")
    expect(mergeIdRefs(undefined, null, false)).toBeUndefined()
  })

  it("buildInputFieldA11yIds merges external and internal ids", () => {
    expect(
      buildInputFieldA11yIds({
        id: "email",
        hasHelperText: true,
        hasError: true,
        externalDescribedBy: "external",
      }),
    ).toEqual({
      helperTextId: "email-helper",
      errorId: "email-error",
      describedBy: "external email-helper email-error",
    })
  })

  it("buildCheckboxFieldA11yIds omits absent ids", () => {
    expect(
      buildCheckboxFieldA11yIds({
        id: "terms",
        hasDescription: false,
        hasError: true,
      }),
    ).toEqual({
      errorId: "terms-error",
      describedBy: "terms-error",
    })
  })

  it("buildCurrencyHelperText adds currency context", () => {
    expect(buildCurrencyHelperText(undefined, "USD")).toBe("Amount in USD")
    expect(buildCurrencyHelperText("Enter total", "USD")).toBe("Enter total (USD)")
    expect(buildCurrencyHelperText("Enter total", undefined)).toBe("Enter total")
  })

  describe("buildRadioGroupFieldA11yIds", () => {
    it("returns all ids when description and error are present", () => {
      expect(
        buildRadioGroupFieldA11yIds({
          id: "rg-1",
          hasDescription: true,
          hasError: true,
        }),
      ).toEqual({
        labelId: "rg-1-label",
        descriptionId: "rg-1-desc",
        errorId: "rg-1-error",
        describedBy: "rg-1-desc rg-1-error",
      })
    })

    it("returns only labelId when description and error are absent", () => {
      expect(
        buildRadioGroupFieldA11yIds({
          id: "rg-2",
          hasDescription: false,
          hasError: false,
        }),
      ).toEqual({
        labelId: "rg-2-label",
      })
    })

    it("merges external describedBy with internal ids", () => {
      expect(
        buildRadioGroupFieldA11yIds({
          id: "rg-3",
          hasDescription: false,
          hasError: true,
          externalDescribedBy: "ext-1",
        }),
      ).toEqual({
        labelId: "rg-3-label",
        errorId: "rg-3-error",
        describedBy: "ext-1 rg-3-error",
      })
    })

    it("includes description without error", () => {
      expect(
        buildRadioGroupFieldA11yIds({
          id: "rg-4",
          hasDescription: true,
          hasError: false,
        }),
      ).toEqual({
        labelId: "rg-4-label",
        descriptionId: "rg-4-desc",
        describedBy: "rg-4-desc",
      })
    })
  })

  describe("buildAccordionFieldA11yIds", () => {
    it("returns all ids when description and error are present", () => {
      expect(
        buildAccordionFieldA11yIds({
          id: "acc-1",
          hasDescription: true,
          hasError: true,
        }),
      ).toEqual({
        labelId: "acc-1-label",
        descriptionId: "acc-1-desc",
        errorId: "acc-1-error",
        describedBy: "acc-1-desc acc-1-error",
      })
    })

    it("returns only labelId when description and error are absent", () => {
      expect(
        buildAccordionFieldA11yIds({
          id: "acc-2",
          hasDescription: false,
          hasError: false,
        }),
      ).toEqual({
        labelId: "acc-2-label",
      })
    })

    it("merges external describedBy with internal ids", () => {
      expect(
        buildAccordionFieldA11yIds({
          id: "acc-3",
          hasDescription: false,
          hasError: true,
          externalDescribedBy: "external-id",
        }),
      ).toEqual({
        labelId: "acc-3-label",
        errorId: "acc-3-error",
        describedBy: "external-id acc-3-error",
      })
    })

    it("includes description without error", () => {
      expect(
        buildAccordionFieldA11yIds({
          id: "acc-4",
          hasDescription: true,
          hasError: false,
        }),
      ).toEqual({
        labelId: "acc-4-label",
        descriptionId: "acc-4-desc",
        describedBy: "acc-4-desc",
      })
    })
  })

  describe("getCurrencySymbol", () => {
    it("returns symbols for well-known fiat currencies", () => {
      expect(getCurrencySymbol("USD")).toBe("$")
      expect(getCurrencySymbol("EUR")).toBe("€")
      expect(getCurrencySymbol("GBP")).toBe("£")
      expect(getCurrencySymbol("JPY")).toBe("¥")
    })

    it("returns multi-character symbols", () => {
      expect(getCurrencySymbol("SEK")).toBe("kr")
    })

    it("returns symbols for crypto currencies", () => {
      expect(getCurrencySymbol("BTC")).toBe("₿")
    })

    it("is case-insensitive", () => {
      expect(getCurrencySymbol("usd")).toBe("$")
      expect(getCurrencySymbol("eur")).toBe("€")
    })

    it("returns undefined for unknown currency codes", () => {
      expect(getCurrencySymbol("DOESNOTEXIST")).toBeUndefined()
    })

    it("returns undefined when code is undefined", () => {
      expect(getCurrencySymbol(undefined)).toBeUndefined()
    })
  })

  describe("sanitizeCurrencyValue", () => {
    it("passes through valid numeric strings", () => {
      expect(sanitizeCurrencyValue("123.45")).toBe("123.45")
    })

    it("strips letters completely", () => {
      expect(sanitizeCurrencyValue("abc")).toBe("")
    })

    it("strips letters mixed with digits", () => {
      expect(sanitizeCurrencyValue("12abc34")).toBe("1234")
    })

    it("keeps only the first decimal point", () => {
      expect(sanitizeCurrencyValue("12.34.56")).toBe("12.3456")
    })

    it("allows a leading minus sign", () => {
      expect(sanitizeCurrencyValue("-5.00")).toBe("-5.00")
    })

    it("strips duplicate minus signs", () => {
      expect(sanitizeCurrencyValue("--5")).toBe("-5")
    })

    it("strips commas", () => {
      expect(sanitizeCurrencyValue("1,234")).toBe("1234")
    })

    it("passes through empty string", () => {
      expect(sanitizeCurrencyValue("")).toBe("")
    })

    it("allows a lone decimal point", () => {
      expect(sanitizeCurrencyValue(".")).toBe(".")
    })

    it("allows a lone minus sign", () => {
      expect(sanitizeCurrencyValue("-")).toBe("-")
    })

    it("allows negative decimal without leading zero", () => {
      expect(sanitizeCurrencyValue("-.5")).toBe("-.5")
    })

    it("strips minus signs that are not at the start", () => {
      expect(sanitizeCurrencyValue("5-3")).toBe("53")
    })
  })
})
