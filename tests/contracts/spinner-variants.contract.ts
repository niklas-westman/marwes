/**
 * Shared contract for spinner purpose components (ButtonSpinner, EmptyStateSpinner).
 *
 * Verifies that each purpose wrapper applies the correct metadata, variant, and size
 * defaults. These come from the core recipe layer and should be identical across adapters.
 */
import { describe, expect, it } from "vitest"

export type SpinnerVariantsContractHarness = {
  renderButtonSpinner(): Promise<void> | void
  renderEmptyStateSpinner(): Promise<void> | void
  getByRole(role: "status", options: { name: RegExp }): HTMLElement
}

export function runSpinnerVariantsContract(
  adapterName: string,
  h: SpinnerVariantsContractHarness,
): void {
  describe(`Spinner variants contract: ${adapterName}`, () => {
    // ButtonSpinner: xs classic spinner used inside loading buttons
    it("ButtonSpinner adds button-loading metadata and classic loading defaults", async () => {
      await h.renderButtonSpinner()

      const spinnerElement = h.getByRole("status", { name: /loading action/i })
      expect(spinnerElement.getAttribute("data-purpose")).toBe("button-loading")
      expect(spinnerElement.getAttribute("data-context")).toBe("button-loading")
      expect(spinnerElement.getAttribute("data-variant")).toBe("classic")
      expect(spinnerElement.getAttribute("data-size")).toBe("xs")
    })

    // EmptyStateSpinner: large dots-round spinner for empty/loading pages
    it("EmptyStateSpinner adds empty-state metadata and dots-round large defaults", async () => {
      await h.renderEmptyStateSpinner()

      const spinnerElement = h.getByRole("status", { name: /loading dashboard/i })
      expect(spinnerElement.getAttribute("data-purpose")).toBe("empty-state")
      expect(spinnerElement.getAttribute("data-context")).toBe("empty-state")
      expect(spinnerElement.getAttribute("data-variant")).toBe("dots-round")
      expect(spinnerElement.getAttribute("data-size")).toBe("lg")
    })
  })
}
