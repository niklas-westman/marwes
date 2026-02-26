import { describe, expect, it } from "vitest"

export type InputContractHarness = {
  renderInput(args?: {
    ariaLabel?: string
    disabled?: boolean
    readOnly?: boolean
    defaultValue?: string
    onValueChange?: (value: string) => void
  }): Promise<void> | void
  getByRole(role: "textbox", options: { name: RegExp }): HTMLInputElement
  type(element: HTMLElement, text: string): Promise<void>
}

export function runInputContract(adapterName: string, h: InputContractHarness): void {
  describe(`Input contract: ${adapterName}`, () => {
    it("renders a textbox with defaultValue", async () => {
      await h.renderInput({ ariaLabel: "Email", defaultValue: "hello@example.com" })

      const input = h.getByRole("textbox", { name: /email/i })
      expect(input).toHaveValue("hello@example.com")
    })

    it("calls onValueChange when typing", async () => {
      const values: string[] = []
      await h.renderInput({
        ariaLabel: "Search",
        onValueChange: (value) => values.push(value),
      })

      const input = h.getByRole("textbox", { name: /search/i })
      await h.type(input, "ab")

      expect(values).toEqual(["a", "ab"])
    })

    it("applies disabled and blocks typing callbacks", async () => {
      let calls = 0
      await h.renderInput({
        ariaLabel: "Disabled field",
        disabled: true,
        onValueChange: () => {
          calls += 1
        },
      })

      const input = h.getByRole("textbox", { name: /disabled field/i })
      expect(input).toBeDisabled()
      await h.type(input, "abc")
      expect(calls).toBe(0)
      expect(input).toHaveValue("")
    })

    it("applies readonly semantics", async () => {
      await h.renderInput({ ariaLabel: "Read only field", readOnly: true, defaultValue: "x" })
      const input = h.getByRole("textbox", { name: /read only field/i })
      expect(input).toHaveAttribute("readonly")
    })
  })
}
