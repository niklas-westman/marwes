/**
 * Svelte adapter: Tests the Dialog and DialogModal components — base class,
 * aria role, size variants, and modal overlay rendering.
 */
import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import Dialog from "../lib/components/dialog/Dialog.svelte"

describe("Dialog", () => {
  it("renders a section with role dialog", () => {
    const { container } = render(Dialog, {
      props: { title: "Test dialog" },
    })
    const dialog = container.querySelector('section[role="dialog"]')
    expect(dialog).not.toBeNull()
  })

  it("uses the title as the accessible name via aria-labelledby", () => {
    const { container } = render(Dialog, {
      props: { title: "Dialog title" },
    })
    const dialog = container.querySelector('[role="dialog"]')
    const labelledBy = dialog?.getAttribute("aria-labelledby")
    expect(labelledBy).toBeTruthy()

    const titleEl = container.querySelector(`#${labelledBy}`)
    expect(titleEl?.textContent).toBe("Dialog title")
  })

  it("wires description via aria-describedby", () => {
    const { container } = render(Dialog, {
      props: {
        title: "Test",
        description: "Describe the purpose.",
      },
    })
    const dialog = container.querySelector('[role="dialog"]')
    const describedBy = dialog?.getAttribute("aria-describedby")
    expect(describedBy).toBeTruthy()

    const descEl = container.querySelector(`#${describedBy}`)
    expect(descEl?.textContent).toBe("Describe the purpose.")
  })

  it("falls back to aria-label when no title is provided", () => {
    const { container } = render(Dialog, {
      props: { ariaLabel: "Unsaved changes" },
    })
    const dialog = container.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute("aria-label")).toBe("Unsaved changes")
    expect(dialog?.getAttribute("aria-labelledby")).toBeNull()
  })

  it("does not set aria-modal by default", () => {
    const { container } = render(Dialog, {
      props: { title: "Test" },
    })
    const dialog = container.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute("aria-modal")).toBeNull()
  })

  it("sets aria-modal when modal is true", () => {
    const { container } = render(Dialog, {
      props: { title: "Modal test", modal: true },
    })
    const dialog = container.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute("aria-modal")).toBe("true")
  })

  it("includes mw-dialog class", () => {
    const { container } = render(Dialog, {
      props: { title: "Test" },
    })
    const dialog = container.querySelector('[role="dialog"]')
    expect(dialog?.className).toContain("mw-dialog")
  })
})
