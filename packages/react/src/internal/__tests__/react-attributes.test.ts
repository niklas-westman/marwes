import { describe, expect, it } from "vitest"
import { toReactAttributes } from "../react-attributes"

describe("toReactAttributes", () => {
  it("renames HTML attribute names that React spells in camelCase", () => {
    expect(
      toReactAttributes({
        tabindex: -1,
        readonly: true,
        autocomplete: "email",
        inputmode: "numeric",
      }),
    ).toEqual({ tabIndex: -1, readOnly: true, autoComplete: "email", inputMode: "numeric" })
  })

  it("keeps aria and other names untouched", () => {
    expect(toReactAttributes({ "aria-label": "Save", id: "a", disabled: true })).toEqual({
      "aria-label": "Save",
      id: "a",
      disabled: true,
    })
  })
})
