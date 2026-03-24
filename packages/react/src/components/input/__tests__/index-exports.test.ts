import { describe, expect, it } from "vitest"
import * as inputComponents from ".."
import * as publicApi from "../../../index"

describe("input barrel exports", () => {
  it("exports the complete input domain surface", () => {
    expect(inputComponents.Input).toBeDefined()
    expect(inputComponents.InputField).toBeDefined()
    expect(inputComponents.SearchField).toBeDefined()
    expect(inputComponents.PasswordField).toBeDefined()
    expect(inputComponents.EmailField).toBeDefined()
    expect(inputComponents.PhoneField).toBeDefined()
    expect(inputComponents.URLField).toBeDefined()
    expect(inputComponents.CurrencyField).toBeDefined()
  })

  it("re-exports the same input symbols from package root", () => {
    expect(publicApi.Input).toBe(inputComponents.Input)
    expect(publicApi.InputField).toBe(inputComponents.InputField)
    expect(publicApi.SearchField).toBe(inputComponents.SearchField)
    expect(publicApi.PasswordField).toBe(inputComponents.PasswordField)
    expect(publicApi.EmailField).toBe(inputComponents.EmailField)
    expect(publicApi.PhoneField).toBe(inputComponents.PhoneField)
    expect(publicApi.URLField).toBe(inputComponents.URLField)
    expect(publicApi.CurrencyField).toBe(inputComponents.CurrencyField)
  })
})
