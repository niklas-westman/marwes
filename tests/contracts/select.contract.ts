/**
 * Shared contract for the Select atom — defaultValue rendering,
 * placeholder option, onValueChange callback, disabled blocking, and native appearance mode.
 */
import type { SelectOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export type SelectContractOption = {
  value: string
  label: string
  disabled?: boolean
}

export type SelectContractHarness = {
  renderSelect(args?: {
    ariaLabel?: string
    defaultValue?: string
    disabled?: boolean
    required?: boolean
    placeholder?: string
    onValueChange?: (value: string) => void
    options?: SelectContractOption[]
  }): Promise<void> | void
  getByRole(role: "combobox", options: { name: RegExp }): HTMLSelectElement
  getByText(text: string): HTMLElement
  selectOptions(element: HTMLElement, value: string): Promise<void>
  /** Renders the base Select with raw core options. */
  renderSelectOptions(options: SelectOptions): Promise<void> | void
  getSelectElement(): HTMLSelectElement
}

const defaultOptions: SelectContractOption[] = [
  { value: "starter", label: "Starter" },
  { value: "growth", label: "Growth" },
]

type SelectOptionCase = {
  options: SelectOptions
  /** Why the option has no observable DOM effect on the base Select atom. */
  noDomEffect?: string
  expectRendered?: (select: HTMLSelectElement) => void
}

const selectChoices = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
]

// Exhaustive on purpose: a new core SelectOptions field fails to compile until every adapter's
// handling of it is described by a case.
const selectOptionCases: Record<keyof SelectOptions, SelectOptionCase> = {
  id: {
    options: { options: selectChoices, id: "field-id" },
    expectRendered: (el) => expect(el).toHaveAttribute("id", "field-id"),
  },
  name: {
    options: { options: selectChoices, name: "plan" },
    expectRendered: (el) => expect(el).toHaveAttribute("name", "plan"),
  },
  value: {
    options: { options: selectChoices, value: "b" },
    expectRendered: (el) => expect(el).toHaveValue("b"),
  },
  defaultValue: {
    options: { options: selectChoices, defaultValue: "b" },
    expectRendered: (el) => expect(el).toHaveValue("b"),
  },
  options: {
    options: { options: selectChoices },
    expectRendered: (el) =>
      expect([...el.options].map((option) => option.value)).toEqual(["a", "b"]),
  },
  placeholder: {
    options: { options: selectChoices, placeholder: "Choose" },
    expectRendered: (el) => expect(el.options[0]).toHaveTextContent("Choose"),
  },
  disabled: {
    options: { options: selectChoices, disabled: true },
    expectRendered: (el) => expect(el).toBeDisabled(),
  },
  required: {
    options: { options: selectChoices, required: true },
    expectRendered: (el) => expect(el).toBeRequired(),
  },
  native: {
    options: { options: selectChoices, native: true },
    noDomEffect:
      "only picks between native and custom mode in SelectField; the atom is always a native select",
  },
  tone: {
    options: { options: selectChoices, tone: "danger" },
    expectRendered: (el) => expect(el).toHaveClass("mw-select--danger"),
  },
  appearance: {
    options: { options: selectChoices, appearance: "native" },
    expectRendered: (el) => expect(el).toHaveClass("mw-select--native"),
  },
  invalid: {
    options: { options: selectChoices, invalid: true },
    expectRendered: (el) => {
      expect(el).toHaveClass("is-invalid")
      expect(el).toHaveAttribute("aria-invalid", "true")
    },
  },
  describedBy: {
    options: { options: selectChoices, describedBy: "hint-id" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-describedby", "hint-id"),
  },
  ariaLabel: {
    options: { options: selectChoices, ariaLabel: "Plan" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-label", "Plan"),
  },
  ariaLabelledBy: {
    options: { options: selectChoices, ariaLabelledBy: "label-id" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-labelledby", "label-id"),
  },
  label: {
    options: { options: selectChoices, label: "Plan" },
    expectRendered: (el) => expect(el).toHaveAttribute("aria-label", "Plan"),
  },
}

export function runSelectContract(adapterName: string, h: SelectContractHarness): void {
  describe(`Select contract: ${adapterName}`, () => {
    it("renders a combobox with the supplied defaultValue", async () => {
      await h.renderSelect({ ariaLabel: "Plan", defaultValue: "growth" })

      const select = h.getByRole("combobox", { name: /plan/i })
      expect(select).toHaveValue("growth")
    })

    it("renders a placeholder option when provided", async () => {
      await h.renderSelect({ ariaLabel: "Country", placeholder: "Choose a country" })

      const select = h.getByRole("combobox", { name: /country/i })
      expect(h.getByText("Choose a country")).toBeInTheDocument()
      expect(select).toHaveValue("")
    })

    it("calls onValueChange when selecting another option", async () => {
      const values: string[] = []
      await h.renderSelect({
        ariaLabel: "Team size",
        options: [
          { value: "1-10", label: "1-10" },
          { value: "11-50", label: "11-50" },
        ],
        onValueChange: (value) => values.push(value),
      })

      const select = h.getByRole("combobox", { name: /team size/i })
      await h.selectOptions(select, "11-50")

      expect(select).toHaveValue("11-50")
      expect(values).toEqual(["11-50"])
    })

    it("applies disabled and blocks selection callbacks", async () => {
      let calls = 0
      await h.renderSelect({
        ariaLabel: "Workspace",
        disabled: true,
        options: defaultOptions,
        onValueChange: () => {
          calls += 1
        },
      })

      const select = h.getByRole("combobox", { name: /workspace/i })
      expect(select).toBeDisabled()
      await h.selectOptions(select, "growth")
      expect(calls).toBe(0)
      expect(select).not.toHaveValue("growth")
    })

    it("applies required semantics", async () => {
      await h.renderSelect({
        ariaLabel: "Country",
        required: true,
        placeholder: "Choose a country",
      })

      const select = h.getByRole("combobox", { name: /country/i })
      expect(select).toBeRequired()
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(selectOptionCases))("%s", async (_optionName, optionCase) => {
        await h.renderSelectOptions(optionCase.options)

        const element = h.getSelectElement()
        expect(element).toBeInTheDocument()
        optionCase.expectRendered?.(element)
      })
    })
  })
}
