import { describe, expect, it } from "vitest"

export type DropdownFieldContractHarness = {
  renderDropdownField(args: {
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
  queryPurposeRegion(): HTMLElement | null
}

export function runDropdownFieldContract(
  adapterName: string,
  h: DropdownFieldContractHarness,
): void {
  describe(`DropdownField contract: ${adapterName}`, () => {
    it("wires the label to the combobox control", async () => {
      await h.renderDropdownField({ label: "Country" })
      const control = h.getByRole("combobox", { name: /country/i })
      expect(control).toBeInTheDocument()
    })

    it("connects helper text via aria-describedby", async () => {
      await h.renderDropdownField({
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
      expect(control).not.toHaveAttribute("aria-invalid", "true")
    })

    it("marks invalid and links error text", async () => {
      await h.renderDropdownField({
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
    })

    it("treats empty helper/error strings as absent", async () => {
      await h.renderDropdownField({
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

    it("marks the wrapper with dropdown purpose metadata", async () => {
      await h.renderDropdownField({ label: "Country" })

      expect(h.queryPurposeRegion()).toHaveAttribute("data-purpose", "dropdown")
    })

    it("defaults to the Marwes combobox trigger", async () => {
      await h.renderDropdownField({
        label: "Country",
      })

      const control = h.getByRole("combobox", { name: /country/i })

      expect(control.tagName).toBe("BUTTON")
    })

    it("supports opting back into the native select", async () => {
      await h.renderDropdownField({
        label: "Country",
        select: { native: true },
      })

      const control = h.getByRole("combobox", { name: /country/i })

      expect(control.tagName).toBe("SELECT")
    })
  })
}
