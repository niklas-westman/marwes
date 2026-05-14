/**
 * React adapter: Verifies that the Spinner barrel re-exports all public symbols
 * from both the component directory and the package root.
 */
import { describe, expect, it } from "vitest"
import * as spinnerComponents from ".."
import * as publicApi from "../../../index"

describe("spinner barrel exports", () => {
  it("exports the spinner atom and purpose wrappers", () => {
    expect(spinnerComponents.Spinner).toBeDefined()
    expect(spinnerComponents.ButtonSpinner).toBeDefined()
    expect(spinnerComponents.EmptyStateSpinner).toBeDefined()
  })

  it("re-exports the spinner symbols from the package root", () => {
    expect(publicApi.Spinner).toBe(spinnerComponents.Spinner)
    expect(publicApi.ButtonSpinner).toBe(spinnerComponents.ButtonSpinner)
    expect(publicApi.EmptyStateSpinner).toBe(spinnerComponents.EmptyStateSpinner)
  })
})
