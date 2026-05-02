import { describe, expect, it } from "vitest"

export type InputFieldContractHarness = {
  renderInputField(args: {
    label: string
    helperText?: string
    error?: string
    ariaDescribedBy?: string
  }): Promise<void> | void
  getByLabelText(text: RegExp): HTMLInputElement
  getByText(text: string): HTMLElement
  queryHelperRegion(): HTMLElement | null
  queryErrorRegion(): HTMLElement | null
}

export function runInputFieldContract(adapterName: string, h: InputFieldContractHarness): void {
  describe(`InputField contract: ${adapterName}`, () => {
    it("wires the label to the input", async () => {
      await h.renderInputField({ label: "Email address" })
      const input = h.getByLabelText(/email address/i)
      expect(input.tagName).toBe("INPUT")
    })

    it("connects helper text via aria-describedby", async () => {
      await h.renderInputField({ label: "Username", helperText: "Choose a unique username" })

      const input = h.getByLabelText(/username/i)
      const helperTextNode = h.getByText("Choose a unique username")
      const helper = h.queryHelperRegion()
      const describedBy = input.getAttribute("aria-describedby") ?? ""

      expect(helperTextNode).toBeInTheDocument()
      expect(helper).not.toBeNull()
      expect(helper?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(helper?.id ?? "")
      expect(input).not.toHaveAttribute("aria-invalid", "true")
    })

    it("marks invalid and links error text", async () => {
      await h.renderInputField({ label: "Password", error: "Password is required" })

      const input = h.getByLabelText(/password/i)
      const errorTextNode = h.getByText("Password is required")
      const error = h.queryErrorRegion()
      const describedBy = input.getAttribute("aria-describedby") ?? ""

      expect(input).toHaveAttribute("aria-invalid", "true")
      expect(errorTextNode).toBeInTheDocument()
      expect(error).not.toBeNull()
      expect(error?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(error?.id ?? "")
    })

    it("treats empty helper/error strings as absent", async () => {
      await h.renderInputField({
        label: "API key",
        helperText: "",
        error: "",
        ariaDescribedBy: "external-help",
      })

      const input = h.getByLabelText(/api key/i)

      expect(input).not.toHaveAttribute("aria-invalid", "true")
      expect(input).toHaveAttribute("aria-describedby", "external-help")
      expect(h.queryHelperRegion()).toBeNull()
      expect(h.queryErrorRegion()).toBeNull()
    })
  })
}
