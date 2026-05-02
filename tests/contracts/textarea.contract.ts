import { describe, expect, it } from "vitest"

export type TextareaContractHarness = {
  renderTextarea(args?: {
    ariaLabel?: string
    disabled?: boolean
    readOnly?: boolean
    defaultValue?: string
    onValueChange?: (value: string) => void
  }): Promise<void> | void
  getByRole(role: "textbox", options: { name: RegExp }): HTMLTextAreaElement
  type(element: HTMLElement, text: string): Promise<void>
}

export function runTextareaContract(adapterName: string, h: TextareaContractHarness): void {
  describe(`Textarea contract: ${adapterName}`, () => {
    it("renders a textbox with defaultValue", async () => {
      await h.renderTextarea({ ariaLabel: "About", defaultValue: "Tell us about yourself" })

      const textarea = h.getByRole("textbox", { name: /about/i })
      expect(textarea).toHaveValue("Tell us about yourself")
    })

    it("calls onValueChange when typing", async () => {
      const values: string[] = []
      await h.renderTextarea({
        ariaLabel: "Details",
        onValueChange: (value) => values.push(value),
      })

      const textarea = h.getByRole("textbox", { name: /details/i })
      await h.type(textarea, "ab")

      expect(values).toEqual(["a", "ab"])
    })

    it("applies disabled and blocks typing callbacks", async () => {
      let calls = 0
      await h.renderTextarea({
        ariaLabel: "Disabled details",
        disabled: true,
        onValueChange: () => {
          calls += 1
        },
      })

      const textarea = h.getByRole("textbox", { name: /disabled details/i })
      expect(textarea).toBeDisabled()
      await h.type(textarea, "abc")
      expect(calls).toBe(0)
      expect(textarea).toHaveValue("")
    })

    it("applies readonly semantics", async () => {
      await h.renderTextarea({ ariaLabel: "Read only details", readOnly: true, defaultValue: "x" })
      const textarea = h.getByRole("textbox", { name: /read only details/i })
      expect(textarea).toHaveAttribute("readonly")
    })
  })
}
