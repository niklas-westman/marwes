import { describe, expect, it } from "vitest"

export interface ComboboxFieldUpdatesProps {
  label: string
  value: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}

export interface ComboboxFieldUpdatesHarness {
  render(props: ComboboxFieldUpdatesProps): Promise<void> | void
  rerender(props: ComboboxFieldUpdatesProps): Promise<void> | void
  hydrate(props: ComboboxFieldUpdatesProps): Promise<string[]>
  getCombobox(label: string): HTMLElement
  getOption(label: string): HTMLElement
  click(element: HTMLElement): Promise<void>
}

function expectOpenWiring(combobox: HTMLElement): void {
  expect(combobox).toHaveAttribute("aria-expanded", "true")
  const listboxId = combobox.getAttribute("aria-controls")
  const activeId = combobox.getAttribute("aria-activedescendant")
  expect(listboxId).toBeTruthy()
  expect(activeId).toBeTruthy()
  const listbox = document.getElementById(listboxId ?? "")
  const activeOption = document.getElementById(activeId ?? "")
  expect(listbox).toHaveAttribute("role", "listbox")
  expect(activeOption).toHaveAttribute("role", "option")
  expect(listbox).toContainElement(activeOption)
}

function expectSelectedValue(h: ComboboxFieldUpdatesHarness, value: string): void {
  const combobox = h.getCombobox("Country")
  expect(combobox).toHaveTextContent(value === "se" ? "Sweden" : "Norway")
  expect(
    document.querySelector<HTMLInputElement>('input[type="hidden"][name="country"]')?.value,
  ).toBe(value)
}

export function runComboboxFieldUpdatesContract(
  adapter: string,
  field: string,
  h: ComboboxFieldUpdatesHarness,
): void {
  describe(`${field} combobox updates: ${adapter}`, () => {
    const base = { label: "Country", value: "no" }

    it("updates selection and the form proxy without reporting a change", async () => {
      const changes: string[] = []
      const props = { ...base, onValueChange: (value: string) => changes.push(value) }
      await h.render(props)
      expectSelectedValue(h, "no")
      await h.rerender({ ...props, value: "se" })
      expectSelectedValue(h, "se")
      await h.click(h.getCombobox(base.label))
      expectOpenWiring(h.getCombobox(base.label))
      expect(h.getOption("Sweden")).toHaveAttribute("aria-selected", "true")
      expect(changes).toEqual([])
      await h.click(h.getOption("Norway"))
      expect(changes).toEqual(["no"])
    })

    it("closes and blocks opening while disabled, then re-enables", async () => {
      await h.render(base)
      await h.click(h.getCombobox(base.label))
      await h.rerender({ ...base, disabled: true })
      expect(h.getCombobox(base.label)).toBeDisabled()
      expect(h.getCombobox(base.label)).toHaveAttribute("aria-expanded", "false")
      await h.click(h.getCombobox(base.label))
      expect(h.getCombobox(base.label)).toHaveAttribute("aria-expanded", "false")
      await h.rerender({ ...base, disabled: false })
      await h.click(h.getCombobox(base.label))
      expectOpenWiring(h.getCombobox(base.label))
    })

    it("keeps selection and creates valid listbox/active-option targets after hydration", async () => {
      const changes: string[] = []
      expect(await h.hydrate({ ...base, onValueChange: (value) => changes.push(value) })).toEqual(
        [],
      )
      expectSelectedValue(h, "no")
      expect(changes).toEqual([])
      await h.click(h.getCombobox(base.label))
      expectOpenWiring(h.getCombobox(base.label))
      expect(h.getOption("Norway")).toHaveAttribute("aria-selected", "true")
      await h.click(h.getOption("Sweden"))
      expect(changes).toEqual(["se"])
      expect(h.getCombobox(base.label)).toHaveAttribute("aria-expanded", "false")
    })
  })
}
