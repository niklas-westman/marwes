/**
 * Shared contract for the CheckboxField molecule — label as
 * accessible name, description and error text via aria-describedby, and invalid marking.
 */
import { describe, expect, it } from "vitest"

export type CheckboxFieldContractHarness = {
  renderCheckboxField(args: {
    label: string
    description?: string
    error?: string
    ariaDescribedBy?: string
    disabled?: boolean
    checked?: boolean
    defaultChecked?: boolean
  }): Promise<void> | void
  getByRole(role: "checkbox", options: { name: RegExp }): HTMLInputElement
  getByText(text: string): HTMLElement
  queryDescriptionRegion(): HTMLElement | null
  queryErrorRegion(): HTMLElement | null
  click(element: HTMLElement): Promise<void>
}

export function runCheckboxFieldContract(
  adapterName: string,
  harness: CheckboxFieldContractHarness,
): void {
  describe(`CheckboxField contract: ${adapterName}`, () => {
    it("uses the visible field label as the checkbox accessible name", async () => {
      await harness.renderCheckboxField({
        label: "Accept terms",
      })

      const checkbox = harness.getByRole("checkbox", { name: /accept terms/i })

      expect(checkbox).toBeInTheDocument()
      expect(checkbox).not.toHaveAttribute("aria-label", "Accept terms")
    })

    it("connects description text through aria-describedby", async () => {
      await harness.renderCheckboxField({
        label: "Accept terms",
        description: "Required to continue",
      })

      const checkbox = harness.getByRole("checkbox", { name: /accept terms/i })
      const descriptionTextNode = harness.getByText("Required to continue")
      const description = harness.queryDescriptionRegion()
      const describedBy = checkbox.getAttribute("aria-describedby") ?? ""

      expect(descriptionTextNode).toBeInTheDocument()
      expect(description).not.toBeNull()
      expect(description?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(description?.id ?? "")
    })

    it("connects error text through aria-describedby and marks the checkbox invalid", async () => {
      await harness.renderCheckboxField({
        label: "Accept terms",
        error: "You must accept the terms",
      })

      const checkbox = harness.getByRole("checkbox", { name: /accept terms/i })
      const errorTextNode = harness.getByText("You must accept the terms")
      const error = harness.queryErrorRegion()
      const describedBy = checkbox.getAttribute("aria-describedby") ?? ""

      expect(errorTextNode).toBeInTheDocument()
      expect(error).not.toBeNull()
      expect(error?.id).toBeTruthy()
      expect(error).toHaveAttribute("aria-live", "polite")
      expect(checkbox).toHaveAttribute("aria-invalid", "true")
      expect(describedBy.split(/\s+/)).toContain(error?.id ?? "")
    })

    it("merges external describedBy with internal description and error ids", async () => {
      await harness.renderCheckboxField({
        label: "Accept terms",
        description: "Required to continue",
        error: "You must accept the terms",
        ariaDescribedBy: "external-help",
      })

      const checkbox = harness.getByRole("checkbox", { name: /accept terms/i })
      const description = harness.queryDescriptionRegion()
      const error = harness.queryErrorRegion()
      const describedBy = checkbox.getAttribute("aria-describedby") ?? ""
      const describedByIds = describedBy.split(/\s+/)

      expect(describedByIds).toContain("external-help")
      expect(describedByIds).toContain(description?.id ?? "")
      expect(describedByIds).toContain(error?.id ?? "")
    })

    it("treats empty description and error text as absent", async () => {
      await harness.renderCheckboxField({
        label: "Accept terms",
        description: "",
        error: "",
        ariaDescribedBy: "external-help",
      })

      const checkbox = harness.getByRole("checkbox", { name: /accept terms/i })

      expect(checkbox).toHaveAttribute("aria-describedby", "external-help")
      expect(checkbox).not.toHaveAttribute("aria-invalid", "true")
      expect(harness.queryDescriptionRegion()).toBeNull()
      expect(harness.queryErrorRegion()).toBeNull()
    })

    it("forwards disabled checkbox semantics from the field wrapper", async () => {
      await harness.renderCheckboxField({
        label: "Accept terms",
        disabled: true,
      })

      const checkbox = harness.getByRole("checkbox", { name: /accept terms/i })

      expect(checkbox).toBeDisabled()
    })
  })
}
