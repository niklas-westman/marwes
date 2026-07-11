/**
 * Shared contract for DateOfBirthField — label wiring to
 * native date input, helper text via aria-describedby, and invalid/error state.
 */
import { describe, expect, it } from "vitest"

export type DateOfBirthFieldContractHarness = {
  renderDateOfBirthField(args: {
    label: string
    helperText?: string
    error?: string
    ariaDescribedBy?: string
  }): Promise<void> | void
  getByLabelText(text: RegExp): HTMLInputElement
  getByText(text: string): HTMLElement
  queryHelperRegion(): HTMLElement | null
  queryErrorRegion(): HTMLElement | null
  queryPurposeRegion(): HTMLElement | null
}

export function runDateOfBirthFieldContract(
  adapterName: string,
  h: DateOfBirthFieldContractHarness,
): void {
  describe(`DateOfBirthField contract: ${adapterName}`, () => {
    it("wires the label to the native date input", async () => {
      await h.renderDateOfBirthField({ label: "Date of birth" })

      const input = h.getByLabelText(/date of birth/i)
      const labelTextNode = h.getByText("Date of birth")

      expect(input.tagName).toBe("INPUT")
      expect(input).toHaveAttribute("type", "date")
      expect(input).toHaveAttribute("autocomplete", "bday")
      expect(labelTextNode).toHaveClass("mw-text", "mw-text--label")
    })

    it("connects helper text via aria-describedby", async () => {
      await h.renderDateOfBirthField({
        label: "Date of birth",
        helperText: "Used for age verification and onboarding.",
      })

      const input = h.getByLabelText(/date of birth/i)
      const helperTextNode = h.getByText("Used for age verification and onboarding.")
      const helper = h.queryHelperRegion()
      const describedBy = input.getAttribute("aria-describedby") ?? ""

      expect(helperTextNode).toBeInTheDocument()
      expect(helper).not.toBeNull()
      expect(helper?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(helper?.id ?? "")
      expect(helperTextNode).toHaveClass("mw-text", "mw-text--caption")
      expect(input).not.toHaveAttribute("aria-invalid", "true")
    })

    it("marks invalid and links error text", async () => {
      await h.renderDateOfBirthField({
        label: "Date of birth",
        error: "Date of birth cannot be in the future",
      })

      const input = h.getByLabelText(/date of birth/i)
      const errorTextNode = h.getByText("Date of birth cannot be in the future")
      const error = h.queryErrorRegion()
      const describedBy = input.getAttribute("aria-describedby") ?? ""

      expect(input).toHaveAttribute("aria-invalid", "true")
      expect(errorTextNode).toBeInTheDocument()
      expect(error).not.toBeNull()
      expect(error?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(error?.id ?? "")
      expect(errorTextNode).toHaveClass("mw-text", "mw-text--caption")
    })

    it("treats empty helper and error strings as absent", async () => {
      await h.renderDateOfBirthField({
        label: "Date of birth",
        helperText: "",
        error: "",
        ariaDescribedBy: "external-help",
      })

      const input = h.getByLabelText(/date of birth/i)

      expect(input).not.toHaveAttribute("aria-invalid", "true")
      expect(input).toHaveAttribute("aria-describedby", "external-help")
      expect(h.queryHelperRegion()).toBeNull()
      expect(h.queryErrorRegion()).toBeNull()
    })

    it("marks the wrapper with date-of-birth purpose metadata", async () => {
      await h.renderDateOfBirthField({ label: "Date of birth" })

      expect(h.queryPurposeRegion()).toHaveAttribute("data-purpose", "date-of-birth")
    })
  })
}
