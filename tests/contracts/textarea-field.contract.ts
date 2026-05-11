/**
 * Shared contract for TextareaField molecule — label-to-textarea
 * wiring, helper text via aria-describedby, and invalid/error state.
 */
import { describe, expect, it } from "vitest"

export type TextareaFieldContractHarness = {
  renderTextareaField(args: {
    label: string
    helperText?: string
    error?: string
    ariaDescribedBy?: string
  }): Promise<void> | void
  getByLabelText(text: RegExp): HTMLTextAreaElement
  getByText(text: string): HTMLElement
  queryHelperRegion(): HTMLElement | null
  queryErrorRegion(): HTMLElement | null
}

export function runTextareaFieldContract(
  adapterName: string,
  h: TextareaFieldContractHarness,
): void {
  describe(`TextareaField contract: ${adapterName}`, () => {
    it("wires the label to the textarea", async () => {
      await h.renderTextareaField({ label: "About your company" })
      const textarea = h.getByLabelText(/about your company/i)
      expect(textarea.tagName).toBe("TEXTAREA")
    })

    it("connects helper text via aria-describedby", async () => {
      await h.renderTextareaField({
        label: "Project details",
        helperText: "Describe your use case in a few sentences",
      })

      const textarea = h.getByLabelText(/project details/i)
      const helperTextNode = h.getByText("Describe your use case in a few sentences")
      const helper = h.queryHelperRegion()
      const describedBy = textarea.getAttribute("aria-describedby") ?? ""

      expect(helperTextNode).toBeInTheDocument()
      expect(helper).not.toBeNull()
      expect(helper?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(helper?.id ?? "")
      expect(textarea).not.toHaveAttribute("aria-invalid", "true")
    })

    it("marks invalid and links error text", async () => {
      await h.renderTextareaField({
        label: "Description",
        error: "Description is required",
      })

      const textarea = h.getByLabelText(/description/i)
      const errorTextNode = h.getByText("Description is required")
      const error = h.queryErrorRegion()
      const describedBy = textarea.getAttribute("aria-describedby") ?? ""

      expect(textarea).toHaveAttribute("aria-invalid", "true")
      expect(errorTextNode).toBeInTheDocument()
      expect(error).not.toBeNull()
      expect(error?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(error?.id ?? "")
    })

    it("treats empty helper/error strings as absent", async () => {
      await h.renderTextareaField({
        label: "Notes",
        helperText: "",
        error: "",
        ariaDescribedBy: "external-help",
      })

      const textarea = h.getByLabelText(/notes/i)

      expect(textarea).not.toHaveAttribute("aria-invalid", "true")
      expect(textarea).toHaveAttribute("aria-describedby", "external-help")
      expect(h.queryHelperRegion()).toBeNull()
      expect(h.queryErrorRegion()).toBeNull()
    })
  })
}
