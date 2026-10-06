/**
 * Shared contract for the RichText atom — multiline textbox with
 * defaultValue, HTML sanitization, onValueChange callback, and disabled semantics.
 */
import type { RichTextOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export type RichTextContractHarness = {
  renderRichText(args?: {
    ariaLabel?: string
    disabled?: boolean
    readOnly?: boolean
    defaultValue?: string
    formatLabels?: Partial<Record<"bold" | "italic" | "underline", string>>
    onValueChange?: (value: string) => void
  }): Promise<void> | void
  getByRole(role: "textbox", options: { name: RegExp }): HTMLDivElement
  type(element: HTMLElement, text: string): Promise<void>
  /** Renders the base RichText with raw core options. */
  renderRichTextOptions(options: RichTextOptions): Promise<void> | void
  getRichTextParts(): { root: HTMLElement; editor: HTMLElement }
}

type RichTextOptionCase = {
  options: RichTextOptions
  expectRendered: (parts: { root: HTMLElement; editor: HTMLElement }) => void
}

// Exhaustive on purpose: a new core RichTextOptions field fails to compile until every adapter's
// handling of it is described by a case.
const richTextOptionCases: Record<keyof RichTextOptions, RichTextOptionCase> = {
  id: {
    options: { id: "bio" },
    expectRendered: ({ editor }) => expect(editor).toHaveAttribute("id", "bio"),
  },
  name: {
    options: { name: "bio" },
    expectRendered: ({ root }) =>
      expect(root.querySelector('input[type="hidden"]')).toHaveAttribute("name", "bio"),
  },
  value: {
    options: { value: "Hello" },
    expectRendered: ({ editor }) => expect(editor).toHaveTextContent("Hello"),
  },
  defaultValue: {
    options: { defaultValue: "Seed" },
    expectRendered: ({ editor }) => expect(editor).toHaveTextContent("Seed"),
  },
  placeholder: {
    options: { placeholder: "Write here" },
    expectRendered: ({ editor }) =>
      expect(editor).toHaveAttribute("data-placeholder", "Write here"),
  },
  disabled: {
    options: { disabled: true },
    expectRendered: ({ root, editor }) => {
      expect(root).toHaveAttribute("data-disabled", "true")
      expect(editor).toHaveAttribute("aria-disabled", "true")
    },
  },
  readOnly: {
    options: { readOnly: true },
    expectRendered: ({ root, editor }) => {
      expect(root).toHaveAttribute("data-readonly", "true")
      expect(editor).toHaveAttribute("aria-readonly", "true")
    },
  },
  required: {
    options: { required: true },
    expectRendered: ({ editor }) => expect(editor).toHaveAttribute("aria-required", "true"),
  },
  tone: {
    options: { tone: "danger" },
    expectRendered: ({ root }) => expect(root).toHaveClass("mw-rich-text--danger"),
  },
  invalid: {
    options: { invalid: true },
    expectRendered: ({ root, editor }) => {
      expect(root).toHaveClass("is-invalid")
      expect(root).toHaveAttribute("data-invalid", "true")
      expect(editor).toHaveAttribute("aria-invalid", "true")
    },
  },
  describedBy: {
    options: { describedBy: "hint-id" },
    expectRendered: ({ editor }) => expect(editor).toHaveAttribute("aria-describedby", "hint-id"),
  },
  labelledBy: {
    options: { labelledBy: "label-id" },
    expectRendered: ({ editor }) => expect(editor).toHaveAttribute("aria-labelledby", "label-id"),
  },
  ariaLabel: {
    options: { ariaLabel: "Biography" },
    expectRendered: ({ editor }) => expect(editor).toHaveAttribute("aria-label", "Biography"),
  },
  label: {
    options: { label: "Biography" },
    expectRendered: ({ editor }) => expect(editor).toHaveAttribute("aria-label", "Biography"),
  },
  allowedFormats: {
    options: { allowedFormats: ["bold"] },
    expectRendered: ({ root }) => {
      expect(root).toHaveAttribute("data-formats", "bold")
      expect(root.querySelectorAll(".mw-rich-text__toolbar-button")).toHaveLength(1)
    },
  },
  formatLabels: {
    options: { formatLabels: { bold: "Fet" } },
    expectRendered: ({ root }) =>
      expect(root.querySelector('[data-format="bold"]')).toHaveAttribute("aria-label", "Fet"),
  },
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

    it("names the formatting toolbar buttons and exposes them as toggle buttons", async () => {
      await h.renderRichText({ ariaLabel: "About" })

      const buttons = [...document.querySelectorAll<HTMLElement>(".mw-rich-text__toolbar-button")]
      expect(buttons.map((button) => button.getAttribute("aria-label"))).toEqual([
        "Bold",
        "Italic",
        "Underline",
      ])
      for (const button of buttons) {
        expect(button).toHaveAttribute("aria-pressed", "false")
      }
    })

    it("uses custom formatting button labels", async () => {
      await h.renderRichText({
        ariaLabel: "About",
        formatLabels: { bold: "Fet", italic: "Kursiv", underline: "Understruken" },
      })

      const labels = [...document.querySelectorAll(".mw-rich-text__toolbar-button")].map((button) =>
        button.getAttribute("aria-label"),
      )
      expect(labels).toEqual(["Fet", "Kursiv", "Understruken"])
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(richTextOptionCases))("%s", async (_optionName, optionCase) => {
        await h.renderRichTextOptions(optionCase.options)

        const parts = h.getRichTextParts()
        expect(parts.root).toBeInTheDocument()
        optionCase.expectRendered(parts)
      })
    })
  })
}
