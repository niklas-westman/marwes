import { describe, expect, it } from "vitest"
import {
  buildCheckboxFieldA11yIds,
  buildCurrencyHelperText,
  buildInputFieldA11yIds,
  mergeIdRefs,
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
})
