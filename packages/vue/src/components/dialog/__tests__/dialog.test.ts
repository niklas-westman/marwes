import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Dialog } from "../dialog"

function renderWithProvider(child: () => unknown) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: child,
          })
      },
    }),
  )
}

describe("Vue Dialog", () => {
  it("uses the visible title and description as the accessible name and description", () => {
    renderWithProvider(() =>
      h(
        Dialog,
        {
          title: "Dialog title",
          description: "Describe the purpose of the dialog.",
          footer: h("button", { type: "button" }, "Confirm"),
        },
        {
          default: () => [h("p", null, "Custom content goes here.")],
        },
      ),
    )

    const dialog = screen.getByRole("dialog", { name: /dialog title/i })

    expect(dialog.getAttribute("aria-describedby")).toContain("description")
    expect(dialog).not.toHaveAttribute("aria-modal")
  })

  it("falls back to aria-label when no visible title is provided", () => {
    renderWithProvider(() =>
      h(
        Dialog,
        {
          ariaLabel: "Unsaved changes",
          dismissible: false,
          showFooter: false,
        },
        {
          default: () => [h("p", null, "Review the pending changes before closing.")],
        },
      ),
    )

    const dialog = screen.getByRole("dialog", { name: /unsaved changes/i })

    expect(dialog).toHaveAttribute("aria-label", "Unsaved changes")
    expect(dialog).not.toHaveAttribute("aria-labelledby")
  })

  it("only applies aria-modal when modal is enabled explicitly", () => {
    renderWithProvider(() =>
      h(
        Dialog,
        {
          modal: true,
          title: "Managed modal shell",
          dismissible: false,
          showFooter: false,
        },
        {
          default: () => [h("p", null, "Parent overlay code owns the modal boundary.")],
        },
      ),
    )

    expect(screen.getByRole("dialog", { name: /managed modal shell/i })).toHaveAttribute(
      "aria-modal",
      "true",
    )
  })
})
