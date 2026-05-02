import { describe, expect, it } from "vitest"

export type SelectComboboxContractOption = {
  value: string
  label: string
  disabled?: boolean
}

export type SelectComboboxContractHarness = {
  renderCustomSelectField(args?: {
    label?: string
    defaultValue?: string
    options?: SelectComboboxContractOption[]
  }): Promise<void> | void
  getByRole(
    role: "combobox" | "listbox" | "option",
    options: { name?: RegExp | string },
  ): HTMLElement
  queryByRole(
    role: "combobox" | "listbox" | "option",
    options?: { name?: RegExp | string },
  ): HTMLElement | null
  keyboard(text: string): Promise<void>
}

const defaultOptions: SelectComboboxContractOption[] = [
  { value: "se", label: "Sweden" },
  { value: "us", label: "United States" },
  { value: "no", label: "Norway" },
]

const disabledTraversalOptions: SelectComboboxContractOption[] = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta", disabled: true },
  { value: "gamma", label: "Gamma" },
]

export function runSelectComboboxContract(
  adapterName: string,
  harness: SelectComboboxContractHarness,
): void {
  describe(`Select combobox contract: ${adapterName}`, () => {
    it("opens on ArrowDown and exposes aria-activedescendant", async () => {
      await harness.renderCustomSelectField({ label: "Country" })

      const control = harness.getByRole("combobox", { name: /country/i })
      control.focus()

      await harness.keyboard("{ArrowDown}")

      const activeDescendantId = control.getAttribute("aria-activedescendant")
      const activeOption = activeDescendantId ? document.getElementById(activeDescendantId) : null

      expect(control).toHaveAttribute("aria-expanded", "true")
      expect(harness.getByRole("listbox", {})).toBeInTheDocument()
      expect(activeDescendantId).toBeTruthy()
      expect(activeOption).not.toBeNull()
      expect(activeOption).toHaveTextContent("Sweden")
    })

    it("skips disabled options during Arrow navigation", async () => {
      await harness.renderCustomSelectField({
        label: "Country",
        options: disabledTraversalOptions,
      })

      const control = harness.getByRole("combobox", { name: /country/i })
      control.focus()

      await harness.keyboard("{ArrowDown}")
      await harness.keyboard("{ArrowDown}")

      const activeDescendantId = control.getAttribute("aria-activedescendant")
      const activeOption = activeDescendantId ? document.getElementById(activeDescendantId) : null

      expect(activeOption).not.toBeNull()
      expect(activeOption).toHaveTextContent("Gamma")
      expect(activeOption).not.toHaveAttribute("aria-disabled")
    })

    it("supports Home and End navigation when open", async () => {
      await harness.renderCustomSelectField({
        label: "Country",
        options: defaultOptions,
      })

      const control = harness.getByRole("combobox", { name: /country/i })
      control.focus()

      await harness.keyboard("{ArrowDown}")
      await harness.keyboard("{End}")

      let activeDescendantId = control.getAttribute("aria-activedescendant")
      let activeOption = activeDescendantId ? document.getElementById(activeDescendantId) : null

      expect(activeOption).not.toBeNull()
      expect(activeOption).toHaveTextContent("Norway")

      await harness.keyboard("{Home}")

      activeDescendantId = control.getAttribute("aria-activedescendant")
      activeOption = activeDescendantId ? document.getElementById(activeDescendantId) : null

      expect(activeOption).not.toBeNull()
      expect(activeOption).toHaveTextContent("Sweden")
    })

    it("selects the active option on Enter and closes the listbox", async () => {
      await harness.renderCustomSelectField({
        label: "Country",
        options: defaultOptions,
      })

      const control = harness.getByRole("combobox", { name: /country/i })
      control.focus()

      await harness.keyboard("{ArrowDown}")
      await harness.keyboard("{ArrowDown}")
      await harness.keyboard("{Enter}")

      expect(control).toHaveAttribute("aria-expanded", "false")
      expect(control).toHaveTextContent("United States")
      expect(harness.queryByRole("listbox")).toBeNull()
      expect(control).not.toHaveAttribute("aria-activedescendant")
    })

    it("closes on Escape without keeping aria-activedescendant", async () => {
      await harness.renderCustomSelectField({
        label: "Country",
        options: defaultOptions,
      })

      const control = harness.getByRole("combobox", { name: /country/i })
      control.focus()

      await harness.keyboard("{ArrowDown}")
      await harness.keyboard("{Escape}")

      expect(control).toHaveAttribute("aria-expanded", "false")
      expect(harness.queryByRole("listbox")).toBeNull()
      expect(control).not.toHaveAttribute("aria-activedescendant")
    })
  })
}
