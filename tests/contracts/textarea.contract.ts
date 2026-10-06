/**
 * Shared contract for the Textarea atom — defaultValue rendering,
 * onValueChange callback, disabled blocking, readonly semantics, and invalid state.
 */
import type { TextareaOptions } from "@marwes-ui/core"
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
  /** Renders the base Textarea with raw core options. */
  renderTextareaOptions(options: TextareaOptions): Promise<void> | void
  getTextareaElement(): HTMLTextAreaElement
}

type TextareaOptionCase = {
  options: TextareaOptions
  expectRendered: (textarea: HTMLTextAreaElement) => void
}

// Exhaustive on purpose: a new core TextareaOptions field fails to compile until every adapter's
// handling of it is described by a case.
const textareaOptionCases: Record<keyof TextareaOptions, TextareaOptionCase> = {
  id: {
    options: { id: "field-id" },
    expectRendered: (el) => expect(el).toHaveAttribute("id", "field-id"),
  },
  name: {
    options: { name: "bio" },
    expectRendered: (el) => expect(el).toHaveAttribute("name", "bio"),
  },
  value: { options: { value: "hello" }, expectRendered: (el) => expect(el).toHaveValue("hello") },
  defaultValue: {
    options: { defaultValue: "seed" },
    expectRendered: (el) => expect(el).toHaveValue("seed"),
  },
  placeholder: {
    options: { placeholder: "Tell us" },
    expectRendered: (el) => expect(el).toHaveAttribute("placeholder", "Tell us"),
  },
  disabled: { options: { disabled: true }, expectRendered: (el) => expect(el).toBeDisabled() },
  readOnly: {
    options: { readOnly: true },
    expectRendered: (el) => expect(el).toHaveAttribute("readonly"),
  },
  required: { options: { required: true }, expectRendered: (el) => expect(el).toBeRequired() },
  inputMode: {
    options: { inputMode: "numeric" },
    expectRendered: (el) => expect(el).toHaveAttribute("inputmode", "numeric"),
  },
  autoComplete: {
    options: { autoComplete: "off" },
    expectRendered: (el) => expect(el).toHaveAttribute("autocomplete", "off"),
  },
  rows: { options: { rows: 6 }, expectRendered: (el) => expect(el).toHaveAttribute("rows", "6") },
  cols: { options: { cols: 40 }, expectRendered: (el) => expect(el).toHaveAttribute("cols", "40") },
  resize: {
    options: { resize: "none" },
    expectRendered: (el) => expect(el.style.getPropertyValue("--mw-textarea-resize")).toBe("none"),
  },
  tone: {
    options: { tone: "danger" },
    expectRendered: (el) => expect(el).toHaveClass("mw-textarea--danger"),
  },
  invalid: {
    options: { invalid: true },
    expectRendered: (el) => {
      expect(el).toHaveClass("is-invalid")
      expect(el).toHaveAttribute("aria-invalid", "true")
    },
  },
  describedBy: {
    options: { describedBy: "hint-id" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-describedby", "hint-id"),
  },
  ariaLabel: {
    options: { ariaLabel: "Biography" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-label", "Biography"),
  },
  ariaLabelledBy: {
    options: { ariaLabelledBy: "label-id" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-labelledby", "label-id"),
  },
  label: {
    options: { label: "Biography" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-label", "Biography"),
  },
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

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(textareaOptionCases))("%s", async (_optionName, optionCase) => {
        await h.renderTextareaOptions(optionCase.options)

        const element = h.getTextareaElement()
        expect(element).toBeInTheDocument()
        optionCase.expectRendered?.(element)
      })
    })
  })
}
