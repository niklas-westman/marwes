/**
 * Shared contract for the Checkbox atom — defaultChecked state,
 * onCheckedChange callback, indeterminate DOM state, and disabled suppression.
 */
import type { CheckboxProps } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export type CheckboxContractHarness = {
  renderCheckbox(args?: {
    ariaLabel?: string
    disabled?: boolean
    defaultChecked?: boolean
    indeterminate?: boolean
    onCheckedChange?: (checked: boolean) => void
  }): Promise<void> | void
  getByRole(role: "checkbox", options: { name: RegExp }): HTMLInputElement
  click(element: HTMLElement): Promise<void>
  /** Renders the base Checkbox with raw core options. */
  renderCheckboxOptions(options: CheckboxProps): Promise<void> | void
  getCheckboxElement(): HTMLInputElement
}

type CheckboxOptionCase = {
  options: CheckboxProps
  expectRendered: (checkbox: HTMLInputElement) => void
}

// Exhaustive on purpose: a new core CheckboxProps field fails to compile until every adapter's
// handling of it is described by a case.
const checkboxOptionCases: Record<keyof CheckboxProps, CheckboxOptionCase> = {
  size: {
    options: { size: "lg" },
    expectRendered: (el) => expect(el).toHaveClass("mw-checkbox--lg"),
  },
  checked: { options: { checked: true }, expectRendered: (el) => expect(el).toBeChecked() },
  defaultChecked: {
    options: { defaultChecked: true },
    expectRendered: (el) => expect(el).toBeChecked(),
  },
  indeterminate: {
    options: { indeterminate: true },
    expectRendered: (el) => {
      expect(el.indeterminate).toBe(true)
      expect(el).toHaveAttribute("aria-checked", "mixed")
    },
  },
  disabled: { options: { disabled: true }, expectRendered: (el) => expect(el).toBeDisabled() },
  required: { options: { required: true }, expectRendered: (el) => expect(el).toBeRequired() },
  invalid: {
    options: { invalid: true },
    expectRendered: (el) => {
      expect(el).toHaveClass("mw-checkbox--invalid")
      expect(el).toHaveAttribute("aria-invalid", "true")
    },
  },
  id: {
    options: { id: "field-id" },
    expectRendered: (el) => expect(el).toHaveAttribute("id", "field-id"),
  },
  name: {
    options: { name: "terms" },
    expectRendered: (el) => expect(el).toHaveAttribute("name", "terms"),
  },
  value: {
    options: { value: "yes" },
    expectRendered: (el) => expect(el).toHaveAttribute("value", "yes"),
  },
  ariaLabel: {
    options: { ariaLabel: "Accept terms" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-label", "Accept terms"),
  },
  label: {
    options: { label: "Accept terms" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-label", "Accept terms"),
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

export function runCheckboxContract(adapterName: string, h: CheckboxContractHarness): void {
  describe(`Checkbox contract: ${adapterName}`, () => {
    it("renders defaultChecked state", async () => {
      await h.renderCheckbox({ ariaLabel: "Subscribe", defaultChecked: true })
      const checkbox = h.getByRole("checkbox", { name: /subscribe/i })
      expect(checkbox).toBeChecked()
    })

    it("calls onCheckedChange with next state", async () => {
      const values: boolean[] = []
      await h.renderCheckbox({
        ariaLabel: "Accept terms",
        onCheckedChange: (checked) => values.push(checked),
      })

      const checkbox = h.getByRole("checkbox", { name: /accept terms/i })
      await h.click(checkbox)

      expect(values).toEqual([true])
      expect(checkbox).toBeChecked()
    })

    it("supports indeterminate DOM state", async () => {
      await h.renderCheckbox({ ariaLabel: "Select all", indeterminate: true })
      const checkbox = h.getByRole("checkbox", { name: /select all/i })
      expect(checkbox.indeterminate).toBe(true)
    })

    it("disabled checkbox does not trigger callbacks", async () => {
      let calls = 0
      await h.renderCheckbox({
        ariaLabel: "Disabled checkbox",
        disabled: true,
        onCheckedChange: () => {
          calls += 1
        },
      })

      const checkbox = h.getByRole("checkbox", { name: /disabled checkbox/i })
      expect(checkbox).toBeDisabled()
      await h.click(checkbox)
      expect(calls).toBe(0)
      expect(checkbox).not.toBeChecked()
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(checkboxOptionCases))("%s", async (_optionName, optionCase) => {
        await h.renderCheckboxOptions(optionCase.options)

        const element = h.getCheckboxElement()
        expect(element).toBeInTheDocument()
        optionCase.expectRendered?.(element)
      })
    })
  })
}
