/**
 * Shared contract for SelectField molecule — label-to-combobox
 * wiring, helper text via aria-describedby, and invalid/error state.
 */
import { describe, expect, it } from "vitest"

export type SelectFieldContractHarness = {
  renderSelectField(args: {
    label: string
    helperText?: string
    error?: string
    ariaDescribedBy?: string
    select?: {
      native?: boolean
    }
  }): Promise<void> | void
  getByRole(role: "combobox", options: { name: RegExp }): HTMLElement
  getByText(text: string): HTMLElement
  queryHelperRegion(): HTMLElement | null
  queryErrorRegion(): HTMLElement | null
}

export function runSelectFieldContract(adapterName: string, h: SelectFieldContractHarness): void {
  describe(`SelectField contract: ${adapterName}`, () => {
    it("wires the label to the combobox control", async () => {
      await h.renderSelectField({ label: "Country" })
      const control = h.getByRole("combobox", { name: /country/i })
      const labelTextNode = h.getByText("Country")

      expect(control).toBeInTheDocument()
      expect(labelTextNode).toHaveClass("mw-text", "mw-text--label")
    })

    it("connects helper text via aria-describedby", async () => {
      await h.renderSelectField({
        label: "Plan",
        helperText: "Pick the plan that matches your team size",
      })

      const control = h.getByRole("combobox", { name: /plan/i })
      const helperTextNode = h.getByText("Pick the plan that matches your team size")
      const helper = h.queryHelperRegion()
      const describedBy = control.getAttribute("aria-describedby") ?? ""

      expect(helperTextNode).toBeInTheDocument()
      expect(helper).not.toBeNull()
      expect(helper?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(helper?.id ?? "")
      expect(helperTextNode).toHaveClass("mw-text", "mw-text--caption")
      expect(control).not.toHaveAttribute("aria-invalid", "true")
    })

    it("marks invalid and links error text", async () => {
      await h.renderSelectField({
        label: "Country",
        error: "Country is required",
      })

      const control = h.getByRole("combobox", { name: /country/i })
      const errorTextNode = h.getByText("Country is required")
      const error = h.queryErrorRegion()
      const describedBy = control.getAttribute("aria-describedby") ?? ""

      expect(control).toHaveAttribute("aria-invalid", "true")
      expect(errorTextNode).toBeInTheDocument()
      expect(error).not.toBeNull()
      expect(error?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(error?.id ?? "")
      expect(errorTextNode).toHaveClass("mw-text", "mw-text--caption")
    })

    it("treats empty helper/error strings as absent", async () => {
      await h.renderSelectField({
        label: "Department",
        helperText: "",
        error: "",
        ariaDescribedBy: "external-help",
      })

      const control = h.getByRole("combobox", { name: /department/i })

      expect(control).not.toHaveAttribute("aria-invalid", "true")
      expect(control).toHaveAttribute("aria-describedby", "external-help")
      expect(h.queryHelperRegion()).toBeNull()
      expect(h.queryErrorRegion()).toBeNull()
    })
  })
}
