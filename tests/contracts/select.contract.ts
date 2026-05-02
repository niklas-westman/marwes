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
}

const defaultOptions: SelectContractOption[] = [
  { value: "starter", label: "Starter" },
  { value: "growth", label: "Growth" },
]

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
  })
}
