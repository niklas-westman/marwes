import { describe, expect, it } from "vitest"

export type RichTextContractHarness = {
  renderRichText(args?: {
    ariaLabel?: string
    disabled?: boolean
    readOnly?: boolean
    defaultValue?: string
    onValueChange?: (value: string) => void
  }): Promise<void> | void
  getByRole(role: "textbox", options: { name: RegExp }): HTMLDivElement
  type(element: HTMLElement, text: string): Promise<void>
}

export function runRichTextContract(adapterName: string, h: RichTextContractHarness): void {
  describe(`RichText contract: ${adapterName}`, () => {
    it("renders a multiline textbox with defaultValue", async () => {
      await h.renderRichText({ ariaLabel: "About", defaultValue: "Tell us about yourself" })

      const editor = h.getByRole("textbox", { name: /about/i })
      expect(editor).toHaveTextContent("Tell us about yourself")
      expect(editor).toHaveAttribute("aria-multiline", "true")
    })

    it("normalizes unsafe default HTML to the supported rich-text subset", async () => {
      await h.renderRichText({
        ariaLabel: "Secure details",
        defaultValue:
          '<p onclick="alert(1)"><strong onmouseover="alert(1)">Safe</strong><img src=x onerror="alert(1)"><script>alert(1)</script><a href="javascript:alert(1)">link</a><svg onload="alert(1)"></svg></p>',
      })

      const editor = h.getByRole("textbox", { name: /secure details/i })

      expect(editor.innerHTML).toBe("<p><strong>Safe</strong>alert(1)link</p>")
      expect(editor.querySelector("img")).toBeNull()
      expect(editor.querySelector("script")).toBeNull()
      expect(editor.querySelector("svg")).toBeNull()
      expect(editor.querySelector("a")).toBeNull()
      expect(editor.innerHTML).not.toContain("onerror")
      expect(editor.innerHTML).not.toContain("onclick")
      expect(editor.innerHTML).not.toContain("javascript:")
    })

    it("calls onValueChange when typing", async () => {
      const values: string[] = []

      await h.renderRichText({
        ariaLabel: "Details",
        onValueChange: (value) => values.push(value),
      })

      const editor = h.getByRole("textbox", { name: /details/i })
      await h.type(editor, "ab")

      expect(values.at(-1)).toContain("ab")
    })

    it("applies disabled semantics", async () => {
      let calls = 0

      await h.renderRichText({
        ariaLabel: "Disabled details",
        disabled: true,
        onValueChange: () => {
          calls += 1
        },
      })

      const editor = h.getByRole("textbox", { name: /disabled details/i })
      expect(editor).toHaveAttribute("aria-disabled", "true")
      expect(editor).toHaveAttribute("contenteditable", "false")
      await h.type(editor, "abc")
      expect(calls).toBe(0)
    })

    it("applies readonly semantics", async () => {
      await h.renderRichText({ ariaLabel: "Read only details", readOnly: true, defaultValue: "x" })
      const editor = h.getByRole("textbox", { name: /read only details/i })
      expect(editor).toHaveAttribute("aria-readonly", "true")
      expect(editor).toHaveAttribute("contenteditable", "false")
    })
  })
}
