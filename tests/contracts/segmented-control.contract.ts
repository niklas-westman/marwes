import { describe, expect, it } from "vitest"

export type SegmentedControlContractHarness = {
  renderSegmentedControl(args?: {
    label?: string
    ariaLabel?: string
    options?: Array<{ value: string; label: string; disabled?: boolean }>
    value?: string
    defaultValue?: string
    disabled?: boolean
    onValueChange?: (value: string) => void
  }): Promise<void> | void
  getByRole(role: "radiogroup" | "radio", options: { name: RegExp }): HTMLElement
  getAllByRole(role: "radio"): HTMLElement[]
  click(element: HTMLElement): Promise<void>
  keyDown(element: HTMLElement, key: string): Promise<void> | void
}

export function runSegmentedControlContract(
  adapterName: string,
  harness: SegmentedControlContractHarness,
): void {
  describe(`SegmentedControl contract: ${adapterName}`, () => {
    it("renders a named radiogroup with one checked option", async () => {
      await harness.renderSegmentedControl({
        ariaLabel: "View mode",
        value: "grid",
      })

      const group = harness.getByRole("radiogroup", { name: /view mode/i })
      const grid = harness.getByRole("radio", { name: /grid/i })
      const radios = harness.getAllByRole("radio")

      expect(group).toBeInTheDocument()
      expect(radios).toHaveLength(3)
      expect(grid).toHaveAttribute("aria-checked", "true")
      expect(grid).toHaveAttribute("tabindex", "0")
    })

    it("uses the visible label as the group accessible name", async () => {
      await harness.renderSegmentedControl({ label: "View density" })

      expect(harness.getByRole("radiogroup", { name: /view density/i })).toBeInTheDocument()
    })

    it("selects the first enabled option by default", async () => {
      await harness.renderSegmentedControl({
        options: [
          { value: "compact", label: "Compact", disabled: true },
          { value: "comfortable", label: "Comfortable" },
        ],
      })

      expect(harness.getByRole("radio", { name: /comfortable/i })).toHaveAttribute(
        "aria-checked",
        "true",
      )
    })

    it("emits the next value when an enabled item is clicked", async () => {
      const values: string[] = []

      await harness.renderSegmentedControl({
        value: "list",
        onValueChange: (value) => values.push(value),
      })

      await harness.click(harness.getByRole("radio", { name: /grid/i }))

      expect(values).toEqual(["grid"])
    })

    it("skips disabled items during keyboard selection", async () => {
      const values: string[] = []

      await harness.renderSegmentedControl({
        value: "list",
        options: [
          { value: "list", label: "List" },
          { value: "grid", label: "Grid", disabled: true },
          { value: "cards", label: "Cards" },
        ],
        onValueChange: (value) => values.push(value),
      })

      await harness.keyDown(harness.getByRole("radiogroup", { name: /view mode/i }), "ArrowRight")

      expect(values).toEqual(["cards"])
    })

    it("does not emit changes when the group is disabled", async () => {
      const values: string[] = []

      await harness.renderSegmentedControl({
        disabled: true,
        onValueChange: (value) => values.push(value),
      })

      const grid = harness.getByRole("radio", { name: /grid/i })
      expect(grid).toBeDisabled()

      await harness.click(grid)

      expect(values).toEqual([])
    })
  })
}
