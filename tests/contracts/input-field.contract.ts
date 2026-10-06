/**
 * Shared contract for InputField molecule — label-to-input wiring,
 * helper text via aria-describedby, and invalid/error state.
 */
import { describe, expect, it } from "vitest"

export type InputFieldContractHarness = {
  renderInputField(args: {
    label: string
    helperText?: string
    error?: string
    ariaDescribedBy?: string
    inputType?: "text" | "password" | "search"
    defaultValue?: string
    leadingSymbol?: string
    showPasswordLabel?: string
    hidePasswordLabel?: string
    clearLabel?: string
  }): Promise<void> | void
  getButtonByName(name: RegExp): HTMLElement
  click(element: HTMLElement): Promise<void> | void
  getByLabelText(text: RegExp): HTMLInputElement
  getByText(text: string): HTMLElement
  queryHelperRegion(): HTMLElement | null
  queryErrorRegion(): HTMLElement | null
}

export function runInputFieldContract(adapterName: string, h: InputFieldContractHarness): void {
  describe(`InputField contract: ${adapterName}`, () => {
    it("wires the label to the input", async () => {
      await h.renderInputField({ label: "Email address" })
      const input = h.getByLabelText(/email address/i)
      const labelTextNode = h.getByText("Email address")

      expect(input.tagName).toBe("INPUT")
      expect(labelTextNode).toHaveClass("mw-text", "mw-text--label")
    })

    it("connects helper text via aria-describedby", async () => {
      await h.renderInputField({ label: "Username", helperText: "Choose a unique username" })

      const input = h.getByLabelText(/username/i)
      const helperTextNode = h.getByText("Choose a unique username")
      const helper = h.queryHelperRegion()
      const describedBy = input.getAttribute("aria-describedby") ?? ""

      expect(helperTextNode).toBeInTheDocument()
      expect(helper).not.toBeNull()
      expect(helper?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(helper?.id ?? "")
      expect(helperTextNode).toHaveClass("mw-text", "mw-text--caption")
      expect(input).not.toHaveAttribute("aria-invalid", "true")
    })

    it("marks invalid and links error text", async () => {
      await h.renderInputField({ label: "Password", error: "Password is required" })

      const input = h.getByLabelText(/password/i)
      const errorTextNode = h.getByText("Password is required")
      const error = h.queryErrorRegion()
      const describedBy = input.getAttribute("aria-describedby") ?? ""

      expect(input).toHaveAttribute("aria-invalid", "true")
      expect(errorTextNode).toBeInTheDocument()
      expect(error).not.toBeNull()
      expect(error?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(error?.id ?? "")
      expect(errorTextNode).toHaveClass("mw-text", "mw-text--caption")
    })

    it("treats empty helper/error strings as absent", async () => {
      await h.renderInputField({
        label: "API key",
        helperText: "",
        error: "",
        ariaDescribedBy: "external-help",
      })

      const input = h.getByLabelText(/api key/i)

      expect(input).not.toHaveAttribute("aria-invalid", "true")
      expect(input).toHaveAttribute("aria-describedby", "external-help")
      expect(h.queryHelperRegion()).toBeNull()
      expect(h.queryErrorRegion()).toBeNull()
    })

    it("never references hidden helper text from aria-describedby when an error replaces it", async () => {
      await h.renderInputField({
        label: "Email address",
        helperText: "A helpful hint",
        error: "Something is wrong",
      })

      const control = h.getByLabelText(/email address/i)
      const referencedIds = (control.getAttribute("aria-describedby") ?? "")
        .split(/\s+/)
        .filter(Boolean)

      expect(h.queryHelperRegion()).toBeNull()
      expect(referencedIds.length).toBeGreaterThan(0)
      for (const id of referencedIds) {
        expect(document.getElementById(id)).not.toBeNull()
      }
    })

    it("names the password toggle and flips its name with the visibility state", async () => {
      await h.renderInputField({ label: "Password", inputType: "password" })

      await h.click(h.getButtonByName(/^show password$/i))
      expect(h.getButtonByName(/^hide password$/i)).toBeInTheDocument()
    })

    it("uses custom password toggle labels", async () => {
      await h.renderInputField({
        label: "Password",
        inputType: "password",
        showPasswordLabel: "Visa lösenord",
        hidePasswordLabel: "Dölj lösenord",
      })

      await h.click(h.getButtonByName(/visa lösenord/i))
      expect(h.getButtonByName(/dölj lösenord/i)).toBeInTheDocument()
    })

    it("names the search clear button and accepts a custom label", async () => {
      await h.renderInputField({ label: "Search", inputType: "search", defaultValue: "abc" })
      expect(h.getButtonByName(/^clear search$/i)).toBeInTheDocument()
    })

    it("uses a custom clear label", async () => {
      await h.renderInputField({
        label: "Search",
        inputType: "search",
        defaultValue: "abc",
        clearLabel: "Rensa sökning",
      })
      expect(h.getButtonByName(/rensa sökning/i)).toBeInTheDocument()
    })

    it("renders a leading symbol inside the field", async () => {
      await h.renderInputField({ label: "Amount", leadingSymbol: "kr" })
      expect(document.querySelector(".mw-input-field__leading-symbol")).toHaveTextContent("kr")
    })
  })
}
