/**
 * Shared contract for the Radio atom — defaultChecked state,
 * onCheckedChange callback, and disabled suppression.
 */
import type { RadioOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export type RadioContractHarness = {
  renderRadio(args?: {
    ariaLabel?: string
    disabled?: boolean
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean) => void
  }): Promise<void> | void
  getByRole(role: "radio", options: { name: RegExp }): HTMLInputElement
  click(element: HTMLElement): Promise<void>
  /** Renders the base Radio with raw core options. */
  renderRadioOptions(options: RadioOptions): Promise<void> | void
  getRadioElement(): HTMLInputElement
}

type RadioOptionCase = {
  options: RadioOptions
  expectRendered: (radio: HTMLInputElement) => void
}

// Exhaustive on purpose: a new core RadioOptions field fails to compile until every adapter's
// handling of it is described by a case.
const radioOptionCases: Record<keyof RadioOptions, RadioOptionCase> = {
  checked: { options: { checked: true }, expectRendered: (el) => expect(el).toBeChecked() },
  defaultChecked: {
    options: { defaultChecked: true },
    expectRendered: (el) => expect(el).toBeChecked(),
  },
  disabled: { options: { disabled: true }, expectRendered: (el) => expect(el).toBeDisabled() },
  required: { options: { required: true }, expectRendered: (el) => expect(el).toBeRequired() },
  invalid: {
    options: { invalid: true },
    expectRendered: (el) => {
      expect(el).toHaveClass("mw-radio--invalid")
      expect(el).toHaveAttribute("aria-invalid", "true")
    },
  },
  id: {
    options: { id: "field-id" },
    expectRendered: (el) => expect(el).toHaveAttribute("id", "field-id"),
  },
  name: {
    options: { name: "plan" },
    expectRendered: (el) => expect(el).toHaveAttribute("name", "plan"),
  },
  value: {
    options: { value: "pro" },
    expectRendered: (el) => expect(el).toHaveAttribute("value", "pro"),
  },
  ariaLabel: {
    options: { ariaLabel: "Pro plan" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-label", "Pro plan"),
  },
  label: {
    options: { label: "Pro plan" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-label", "Pro plan"),
  },
  ariaLabelledBy: {
    options: { ariaLabelledBy: "label-id" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-labelledby", "label-id"),
  },
  ariaDescribedBy: {
    options: { ariaDescribedBy: "hint-id" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-describedby", "hint-id"),
  },
}

export function runRadioContract(adapterName: string, h: RadioContractHarness): void {
  describe(`Radio contract: ${adapterName}`, () => {
    it("renders defaultChecked state", async () => {
      await h.renderRadio({ ariaLabel: "Option A", defaultChecked: true })
      const radio = h.getByRole("radio", { name: /option a/i })
      expect(radio).toBeChecked()
    })

    it("calls onCheckedChange with true when clicked", async () => {
      const values: boolean[] = []
      await h.renderRadio({
        ariaLabel: "Option A",
        onCheckedChange: (checked) => values.push(checked),
      })

      const radio = h.getByRole("radio", { name: /option a/i })
      await h.click(radio)

      expect(values).toEqual([true])
      expect(radio).toBeChecked()
    })

    it("disabled radio does not trigger callbacks", async () => {
      let calls = 0
      await h.renderRadio({
        ariaLabel: "Disabled radio",
        disabled: true,
        onCheckedChange: () => {
          calls += 1
        },
      })

      const radio = h.getByRole("radio", { name: /disabled radio/i })
      expect(radio).toBeDisabled()
      await h.click(radio)
      expect(calls).toBe(0)
      expect(radio).not.toBeChecked()
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(radioOptionCases))("%s", async (_optionName, optionCase) => {
        await h.renderRadioOptions(optionCase.options)

        const element = h.getRadioElement()
        expect(element).toBeInTheDocument()
        optionCase.expectRendered?.(element)
      })
    })
  })
}
