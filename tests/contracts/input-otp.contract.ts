/**
 * Shared contract for InputOtp — label and one-time-code autocomplete
 * wiring, digit-only sanitization with visible cells, and invalid/error state.
 */
import type { InputOtpOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export type InputOtpContractHarness = {
  renderInputOtp(args?: {
    label?: string
    helperText?: string
    error?: string
    disabled?: boolean
    readOnly?: boolean
    defaultValue?: string
    placeholderCharacter?: string
    onValueChange?: (value: string) => void
  }): Promise<void> | void
  getByRole(role: "textbox", options: { name: RegExp }): HTMLInputElement
  getByText(text: string | RegExp): HTMLElement
  queryHelperRegion(): HTMLElement | null
  queryErrorRegion(): HTMLElement | null
  queryOtpCells(): HTMLElement[]
  type(element: HTMLElement, text: string): Promise<void>
  /** Renders the base InputOtp with raw core options. */
  renderInputOtpOptions(options: InputOtpOptions): Promise<void> | void
  getInputOtpParts(): { root: HTMLElement; input: HTMLInputElement }
}

type InputOtpOptionCase = {
  options: InputOtpOptions
  expectRendered: (parts: { root: HTMLElement; input: HTMLInputElement }) => void
}

// Exhaustive on purpose: a new core InputOtpOptions field fails to compile until every adapter's
// handling of it is described by a case.
const inputOtpOptionCases: Record<keyof InputOtpOptions, InputOtpOptionCase> = {
  id: {
    options: { id: "otp" },
    expectRendered: ({ input }) => expect(input).toHaveAttribute("id", "otp"),
  },
  name: {
    options: { name: "code" },
    expectRendered: ({ input }) => expect(input).toHaveAttribute("name", "code"),
  },
  value: {
    options: { value: "123" },
    expectRendered: ({ input }) => expect(input).toHaveValue("123"),
  },
  defaultValue: {
    options: { defaultValue: "45" },
    expectRendered: ({ input }) => expect(input).toHaveValue("45"),
  },
  length: {
    options: { length: 4 },
    expectRendered: ({ root, input }) => {
      expect(root.querySelectorAll(".mw-input-otp__cell")).toHaveLength(4)
      expect(input).toHaveAttribute("maxlength", "4")
    },
  },
  placeholderCharacter: {
    options: { length: 2, placeholderCharacter: "_" },
    expectRendered: ({ root }) =>
      expect(
        [...root.querySelectorAll(".mw-input-otp__cell")].map((cell) => cell.textContent),
      ).toEqual(["_", "_"]),
  },
  disabled: {
    options: { disabled: true },
    expectRendered: ({ root, input }) => {
      expect(input).toBeDisabled()
      expect(root).toHaveClass("mw-input-otp--disabled")
    },
  },
  readOnly: {
    options: { readOnly: true },
    expectRendered: ({ root, input }) => {
      expect(input).toHaveAttribute("readonly")
      expect(root).toHaveClass("mw-input-otp--readonly")
    },
  },
  required: {
    options: { required: true },
    expectRendered: ({ input }) => expect(input).toBeRequired(),
  },
  invalid: {
    options: { invalid: true },
    expectRendered: ({ root, input }) => {
      expect(root).toHaveClass("mw-input-otp--invalid")
      expect(input).toHaveAttribute("aria-invalid", "true")
    },
  },
  describedBy: {
    options: { describedBy: "hint-id" },
    expectRendered: ({ input }) => expect(input).toHaveAttribute("aria-describedby", "hint-id"),
  },
  ariaLabel: {
    options: { ariaLabel: "Verification code" },
    expectRendered: ({ input }) => expect(input).toHaveAttribute("aria-label", "Verification code"),
  },
  label: {
    options: { label: "Verification code" },
    expectRendered: ({ input }) => expect(input).toHaveAttribute("aria-label", "Verification code"),
  },
  ariaLabelledBy: {
    options: { ariaLabelledBy: "label-id" },
    expectRendered: ({ input }) => expect(input).toHaveAttribute("aria-labelledby", "label-id"),
  },
}

export function runInputOtpContract(adapterName: string, harness: InputOtpContractHarness): void {
  describe(`InputOtp contract: ${adapterName}`, () => {
    it("wires the visible label and one-time-code autocomplete to the textbox", async () => {
      await harness.renderInputOtp({
        label: "Verification code",
        helperText: "Enter the 6-digit code sent to your email",
      })

      const input = harness.getByRole("textbox", { name: /verification code/i })
      const labelTextNode = harness.getByText("Verification code")
      const helperTextNode = harness.getByText("Enter the 6-digit code sent to your email")
      const helper = harness.queryHelperRegion()
      const describedBy = input.getAttribute("aria-describedby") ?? ""

      expect(input).toHaveAttribute("autocomplete", "one-time-code")
      expect(input).toHaveAttribute("inputmode", "numeric")
      expect(labelTextNode).toHaveClass("mw-text", "mw-text--label")
      expect(helperTextNode).toHaveClass("mw-text", "mw-text--caption")
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
      expect(errorTextNode).toHaveClass("mw-text", "mw-text--caption")
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

    it("renders a custom placeholder character in empty cells", async () => {
      await harness.renderInputOtp({ placeholderCharacter: "_" })

      expect(harness.queryOtpCells().map((cell) => cell.textContent)).toEqual([
        "_",
        "_",
        "_",
        "_",
        "_",
        "_",
      ])
    })

    it("treats an empty placeholder character as a request for blank cells", async () => {
      await harness.renderInputOtp({ placeholderCharacter: "" })

      expect(harness.queryOtpCells().map((cell) => cell.textContent)).toEqual([
        "",
        "",
        "",
        "",
        "",
        "",
      ])
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(inputOtpOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderInputOtpOptions(optionCase.options)

        const parts = harness.getInputOtpParts()
        expect(parts.root).toBeInTheDocument()
        optionCase.expectRendered(parts)
      })
    })
  })
}
