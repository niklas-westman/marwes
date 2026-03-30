import { describe, expect, it } from "vitest"

export type ZipCodeFieldContractHarness = {
  renderZipCodeField(args: {
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

export function runZipCodeFieldContract(adapterName: string, h: ZipCodeFieldContractHarness): void {
  describe(`ZipCodeField contract: ${adapterName}`, () => {
    it("wires the label to a text input with postal semantics", async () => {
      await h.renderZipCodeField({ label: "ZIP code" })

      const input = h.getByLabelText(/zip code/i)

      expect(input.tagName).toBe("INPUT")
      expect(input).toHaveAttribute("type", "text")
      expect(input).toHaveAttribute("inputmode", "numeric")
      expect(input).toHaveAttribute("autocomplete", "postal-code")
    })

    it("connects helper text via aria-describedby", async () => {
      await h.renderZipCodeField({
        label: "ZIP code",
        helperText: "Used for shipping and tax estimates.",
      })

      const input = h.getByLabelText(/zip code/i)
      const helperTextNode = h.getByText("Used for shipping and tax estimates.")
      const helper = h.queryHelperRegion()
      const describedBy = input.getAttribute("aria-describedby") ?? ""

      expect(helperTextNode).toBeInTheDocument()
      expect(helper).not.toBeNull()
      expect(helper?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(helper?.id ?? "")
      expect(input).not.toHaveAttribute("aria-invalid", "true")
    })

    it("marks invalid and links error text", async () => {
      await h.renderZipCodeField({
        label: "ZIP code",
        error: "Enter a valid postal code",
      })

      const input = h.getByLabelText(/zip code/i)
      const errorTextNode = h.getByText("Enter a valid postal code")
      const error = h.queryErrorRegion()
      const describedBy = input.getAttribute("aria-describedby") ?? ""

      expect(input).toHaveAttribute("aria-invalid", "true")
      expect(errorTextNode).toBeInTheDocument()
      expect(error).not.toBeNull()
      expect(error?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(error?.id ?? "")
    })

    it("treats empty helper and error strings as absent", async () => {
      await h.renderZipCodeField({
        label: "ZIP code",
        helperText: "",
        error: "",
        ariaDescribedBy: "external-help",
      })

      const input = h.getByLabelText(/zip code/i)

      expect(input).not.toHaveAttribute("aria-invalid", "true")
      expect(input).toHaveAttribute("aria-describedby", "external-help")
      expect(h.queryHelperRegion()).toBeNull()
      expect(h.queryErrorRegion()).toBeNull()
    })

    it("marks the wrapper with zip-code purpose metadata", async () => {
      await h.renderZipCodeField({ label: "ZIP code" })

      expect(h.queryPurposeRegion()).toHaveAttribute("data-purpose", "zip-code")
    })
  })
}
