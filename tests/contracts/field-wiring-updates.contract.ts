/**
 * Shared contract for single-control field wrappers (InputField, TextareaField, CheckboxField,
 * SwitchField, SliderField) — label-to-control naming, aria-describedby targets, error toggling and
 * generated ids surviving hydration.
 */
import { describe, expect, it } from "vitest"

export interface FieldWiringProps {
  label: string
  helper?: string
  error?: string
}

export interface FieldWiringHarness {
  render(props: FieldWiringProps): Promise<void> | void
  /** Re-renders the already mounted field with new props and flushes updates. */
  rerender(props: FieldWiringProps): Promise<void> | void
  /**
   * Server-renders the props, mounts that markup into the document, hydrates it on the client and
   * resolves with every warning or error the framework reported while doing so.
   */
  hydrate(props: FieldWiringProps): Promise<string[]>
  /** Finds the control by role and accessible name, which proves the label is wired to it. */
  getControl(label: string): HTMLElement
}

function describedByIds(control: HTMLElement): string[] {
  return (control.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean)
}

function describedByText(control: HTMLElement): string {
  return describedByIds(control)
    .map((id) => document.getElementById(id)?.textContent ?? "")
    .join(" ")
}

function expectGeneratedIdsAreUnique(): void {
  const ids = Array.from(document.querySelectorAll("[id]")).map((element) => element.id)

  expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([])
}

function expectWiring(h: FieldWiringHarness, props: FieldWiringProps): void {
  const control = h.getControl(props.label)

  for (const id of describedByIds(control)) {
    expect(document.getElementById(id), `aria-describedby target #${id}`).not.toBeNull()
  }

  if (props.error) {
    expect(describedByText(control)).toContain(props.error)

    expect(control).toHaveAttribute("aria-invalid", "true")
  } else {
    // Some fields show the error instead of the helper text, so helper is only required without one.
    if (props.helper) {
      expect(describedByText(control)).toContain(props.helper)
    }

    expect(control).not.toHaveAttribute("aria-invalid", "true")
  }

  expectGeneratedIdsAreUnique()
}

export function runFieldWiringUpdatesContract(
  adapterName: string,
  fieldName: string,
  h: FieldWiringHarness,
): void {
  describe(`${fieldName} wiring updates contract: ${adapterName}`, () => {
    it("names the control from the label and describes it with helper text", async () => {
      const props = { label: "Billing contact", helper: "We only use this for invoices" }

      await h.render(props)

      expectWiring(h, props)
    })

    it("follows the error as it is added and removed", async () => {
      const base = { label: "Billing contact", helper: "We only use this for invoices" }

      await h.render(base)
      expectWiring(h, base)

      const withError = { ...base, error: "Enter a billing contact" }
      await h.rerender(withError)
      expectWiring(h, withError)

      await h.rerender(base)
      expectWiring(h, base)
      expect(describedByText(h.getControl(base.label))).not.toContain("Enter a billing contact")
    })

    it("keeps the wiring and generated ids intact after hydration", async () => {
      const props = {
        label: "Billing contact",
        helper: "We only use this for invoices",
        error: "Enter a billing contact",
      }

      const issues = await h.hydrate(props)

      expect(issues).toEqual([])
      expectWiring(h, props)
    })
  })
}
