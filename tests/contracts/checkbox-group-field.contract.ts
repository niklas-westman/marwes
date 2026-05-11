/**
 * Shared contract for CheckboxGroupField — labeled group
 * with checkboxes, uncontrolled/controlled value arrays, description wiring, and error state.
 */
import { describe, expect, it } from "vitest"

export type CheckboxGroupFieldOptionContract = {
  value: string
  label: string
  disabled?: boolean
  indeterminate?: boolean
}

export type CheckboxGroupFieldContractHarness = {
  renderCheckboxGroup(args?: {
    label?: string
    description?: string
    error?: string
    defaultValue?: string[]
    value?: string[]
    onChange?: (value: string[]) => void
    disabled?: boolean
    options?: CheckboxGroupFieldOptionContract[]
  }): Promise<void> | void
  getByRole(role: "group" | "checkbox", options: { name: RegExp }): HTMLElement
  getAllByRole(role: "checkbox"): HTMLInputElement[]
  click(element: HTMLElement): Promise<void>
}

const defaultOptions: CheckboxGroupFieldOptionContract[] = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
]

export function runCheckboxGroupFieldContract(
  adapterName: string,
  h: CheckboxGroupFieldContractHarness,
): void {
  describe(`CheckboxGroupField contract: ${adapterName}`, () => {
    it("renders a labeled group with checkbox options", async () => {
      await h.renderCheckboxGroup({
        label: "Communication preferences",
        options: defaultOptions,
      })

      expect(h.getByRole("group", { name: /communication preferences/i })).toBeTruthy()
      expect(h.getAllByRole("checkbox")).toHaveLength(3)
    })

    it("uncontrolled: applies defaultValue and toggles selections", async () => {
      await h.renderCheckboxGroup({
        label: "Communication preferences",
        options: defaultOptions,
        defaultValue: ["email"],
      })

      const email = h.getByRole("checkbox", { name: /email/i }) as HTMLInputElement
      const sms = h.getByRole("checkbox", { name: /sms/i }) as HTMLInputElement

      expect(email).toBeChecked()
      expect(sms).not.toBeChecked()

      await h.click(sms)
      await h.click(email)

      expect(email).not.toBeChecked()
      expect(sms).toBeChecked()
    })

    it("controlled: emits next ordered value array when toggled", async () => {
      const changes: string[][] = []

      await h.renderCheckboxGroup({
        label: "Communication preferences",
        options: defaultOptions,
        value: ["sms"],
        onChange: (nextValue) => changes.push(nextValue),
      })

      await h.click(h.getByRole("checkbox", { name: /email/i }))

      expect(changes).toEqual([["email", "sms"]])
    })

    it("wires description into the group aria-describedby", async () => {
      await h.renderCheckboxGroup({
        label: "Communication preferences",
        description: "Choose every channel you want us to use.",
        options: defaultOptions,
      })

      const group = h.getByRole("group", { name: /communication preferences/i })
      const describedBy = group.getAttribute("aria-describedby") ?? ""
      const descriptionId = describedBy.split(/\s+/)[0] ?? ""
      const description = descriptionId ? document.getElementById(descriptionId) : null

      expect(descriptionId).toBeTruthy()
      expect(description?.textContent).toContain("Choose every channel you want us to use.")
    })

    it("shows group errors as a live region and marks child checkboxes invalid", async () => {
      await h.renderCheckboxGroup({
        label: "Communication preferences",
        error: "Pick at least one option.",
        options: defaultOptions,
      })

      const group = h.getByRole("group", { name: /communication preferences/i })
      expect(group.getAttribute("aria-invalid")).toBe("true")

      const invalidCheckboxes = h
        .getAllByRole("checkbox")
        .map((checkbox) => checkbox.getAttribute("aria-invalid"))
      expect(invalidCheckboxes).toEqual(["true", "true", "true"])

      const liveRegion = Array.from(document.querySelectorAll('[aria-live="polite"]')).find(
        (node) => node.textContent?.includes("Pick at least one option."),
      )
      expect(liveRegion).toBeTruthy()
    })

    it("disables all options when the group is disabled", async () => {
      await h.renderCheckboxGroup({
        label: "Communication preferences",
        options: defaultOptions,
        disabled: true,
      })

      for (const checkbox of h.getAllByRole("checkbox")) {
        expect(checkbox).toBeDisabled()
      }
    })

    it("supports indeterminate checkbox options", async () => {
      await h.renderCheckboxGroup({
        label: "Bulk actions",
        options: [
          { value: "all", label: "Select all", indeterminate: true },
          { value: "drafts", label: "Drafts" },
        ],
      })

      const selectAll = h.getByRole("checkbox", { name: /select all/i }) as HTMLInputElement
      expect(selectAll.indeterminate).toBe(true)
    })
  })
}
