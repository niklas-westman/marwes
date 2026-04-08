import { describe, expect, it } from "vitest"

export type RichTextFieldContractHarness = {
  renderRichTextField(args: {
    label: string
    helperText?: string
    error?: string
    ariaDescribedBy?: string
  }): Promise<void> | void
  getByRole(role: "textbox", options: { name: RegExp }): HTMLDivElement
  getByText(text: string): HTMLElement
  queryHelperRegion(): HTMLElement | null
  queryErrorRegion(): HTMLElement | null
}

export function runRichTextFieldContract(
  adapterName: string,
  h: RichTextFieldContractHarness,
): void {
  describe(`RichTextField contract: ${adapterName}`, () => {
    it("wires the label to the editor via the accessible name", async () => {
      await h.renderRichTextField({ label: "Project description" })
      const editor = h.getByRole("textbox", { name: /project description/i })
      expect(editor.tagName).toBe("DIV")
    })

    it("connects helper text via aria-describedby", async () => {
      await h.renderRichTextField({
        label: "Project details",
        helperText: "Describe your use case in a few sentences",
      })

      const editor = h.getByRole("textbox", { name: /project details/i })
      const helperTextNode = h.getByText("Describe your use case in a few sentences")
      const helper = h.queryHelperRegion()
      const describedBy = editor.getAttribute("aria-describedby") ?? ""

      expect(helperTextNode).toBeInTheDocument()
      expect(helper).not.toBeNull()
      expect(helper?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(helper?.id ?? "")
      expect(editor).not.toHaveAttribute("aria-invalid", "true")
    })

    it("marks invalid and links error text", async () => {
      await h.renderRichTextField({
        label: "Description",
        error: "Description is required",
      })

      const editor = h.getByRole("textbox", { name: /description/i })
      const errorTextNode = h.getByText("Description is required")
      const error = h.queryErrorRegion()
      const describedBy = editor.getAttribute("aria-describedby") ?? ""

      expect(editor).toHaveAttribute("aria-invalid", "true")
      expect(errorTextNode).toBeInTheDocument()
      expect(error).not.toBeNull()
      expect(error?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(error?.id ?? "")
    })

    it("treats empty helper/error strings as absent", async () => {
      await h.renderRichTextField({
        label: "Notes",
        helperText: "",
        error: "",
        ariaDescribedBy: "external-help",
      })

      const editor = h.getByRole("textbox", { name: /notes/i })

      expect(editor).not.toHaveAttribute("aria-invalid", "true")
      expect(editor).toHaveAttribute("aria-describedby", "external-help")
      expect(h.queryHelperRegion()).toBeNull()
      expect(h.queryErrorRegion()).toBeNull()
    })
  })
}
