import { describe, expect, it } from "vitest"

export type InputOtpContractHarness = {
  renderInputOtp(args?: {
    label?: string
    helperText?: string
    error?: string
    disabled?: boolean
    readOnly?: boolean
    defaultValue?: string
    onValueChange?: (value: string) => void
  }): Promise<void> | void
  getByRole(role: "textbox", options: { name: RegExp }): HTMLInputElement
  getByText(text: string | RegExp): HTMLElement
  queryHelperRegion(): HTMLElement | null
  queryErrorRegion(): HTMLElement | null
  queryOtpCells(): HTMLElement[]
  type(element: HTMLElement, text: string): Promise<void>
}

export function runInputOtpContract(adapterName: string, harness: InputOtpContractHarness): void {
  describe(`InputOtp contract: ${adapterName}`, () => {
    it("wires the visible label and one-time-code autocomplete to the textbox", async () => {
      await harness.renderInputOtp({
        label: "Verification code",
        helperText: "Enter the 6-digit code sent to your email",
      })

      const input = harness.getByRole("textbox", { name: /verification code/i })
      const helper = harness.queryHelperRegion()
      const describedBy = input.getAttribute("aria-describedby") ?? ""

      expect(input).toHaveAttribute("autocomplete", "one-time-code")
      expect(input).toHaveAttribute("inputmode", "numeric")
      expect(helper).not.toBeNull()
      expect(helper?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(helper?.id ?? "")
      expect(harness.queryOtpCells()).toHaveLength(6)
    })

    it("sanitizes typed content down to digits and updates the visible cells", async () => {
      const values: string[] = []

      await harness.renderInputOtp({
        label: "Verification code",
        onValueChange: (value) => values.push(value),
      })

      const input = harness.getByRole("textbox", { name: /verification code/i })
      await harness.type(input, "12a34")

      expect(values.at(-1)).toBe("1234")
      expect(input).toHaveValue("1234")
      expect(harness.queryOtpCells().map((cell) => cell.textContent)).toEqual([
        "1",
        "2",
        "3",
        "4",
        "·",
        "·",
      ])
    })

    it("marks invalid and links the error text through aria-describedby", async () => {
      await harness.renderInputOtp({
        label: "Verification code",
        error: "Code expired",
      })

      const input = harness.getByRole("textbox", { name: /verification code/i })
      const errorTextNode = harness.getByText("Code expired")
      const error = harness.queryErrorRegion()
      const describedBy = input.getAttribute("aria-describedby") ?? ""

      expect(errorTextNode).toBeInTheDocument()
      expect(error).not.toBeNull()
      expect(error?.id).toBeTruthy()
      expect(input).toHaveAttribute("aria-invalid", "true")
      expect(describedBy.split(/\s+/)).toContain(error?.id ?? "")
    })

    it("applies disabled semantics and blocks value-change callbacks", async () => {
      let calls = 0

      await harness.renderInputOtp({
        label: "Disabled verification code",
        disabled: true,
        onValueChange: () => {
          calls += 1
        },
      })

      const input = harness.getByRole("textbox", { name: /disabled verification code/i })
      expect(input).toBeDisabled()
      await harness.type(input, "1234")
      expect(calls).toBe(0)
      expect(input).toHaveValue("")
    })

    it("applies readonly semantics", async () => {
      await harness.renderInputOtp({
        label: "Read only verification code",
        readOnly: true,
        defaultValue: "1234",
      })

      const input = harness.getByRole("textbox", { name: /read only verification code/i })
      expect(input).toHaveAttribute("readonly")
      expect(input).toHaveValue("1234")
    })
  })
}
