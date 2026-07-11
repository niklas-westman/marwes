/**
 * Vue adapter: tests Drawer a11y wiring, optional chrome, and close behavior.
 */
import { fireEvent, render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Drawer } from "../drawer"

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

describe("Vue Drawer", () => {
  it("uses the visible title and description as the accessible name and description", () => {
    renderWithProvider(() =>
      h(
        Drawer,
        {
          title: "Drawer title",
          description: "Drawer content supports secondary workflows.",
          footer: h("button", { type: "button" }, "Apply"),
        },
        {
          default: () => [h("p", null, "Custom content goes here.")],
        },
      ),
    )

    const drawer = screen.getByRole("dialog", { name: /drawer title/i })

    expect(drawer.getAttribute("aria-describedby")).toContain("description")
    expect(drawer).not.toHaveAttribute("aria-modal")
    expect(drawer).toHaveAttribute("data-component", "drawer")
    expect(drawer).toHaveAttribute("data-size", "medium")
    expect(drawer).toHaveAttribute("data-placement", "right")
  })

  it("falls back to aria-label when no visible title is provided", () => {
    renderWithProvider(() =>
      h(
        Drawer,
        {
          ariaLabel: "Filters",
          dismissible: false,
          showFooter: false,
        },
        {
          default: () => [h("p", null, "Choose filters before applying the table view.")],
        },
      ),
    )

    const drawer = screen.getByRole("dialog", { name: /filters/i })

    expect(drawer).toHaveAttribute("aria-label", "Filters")
    expect(drawer).not.toHaveAttribute("aria-labelledby")
  })

  it("renders size, placement, footer, and scrim state from the core recipe", () => {
    renderWithProvider(() =>
      h(
        Drawer,
        {
          title: "Panel",
          size: "large",
          placement: "left",
          showScrim: false,
          showFooter: false,
        },
        {
          default: () => [h("p", null, "Panel body")],
        },
      ),
    )

    const root = screen.getByRole("dialog", { name: /panel/i }).parentElement

    expect(root).toHaveClass("mw-drawer--large")
    expect(root).toHaveClass("mw-drawer--left")
    expect(root).toHaveClass("mw-drawer--without-footer")
    expect(root).toHaveAttribute("data-scrim", "false")
    expect(document.querySelector(".mw-drawer__scrim")).toBeNull()
  })

  it("calls onClose from the close button and dismissible scrim", async () => {
    const onClose = vi.fn()

    renderWithProvider(() =>
      h(
        Drawer,
        {
          title: "Close me",
          onClose,
        },
        {
          default: () => [h("p", null, "Closeable content.")],
        },
      ),
    )

    await fireEvent.click(screen.getByRole("button", { name: /close drawer/i }))
    await fireEvent.click(document.querySelector(".mw-drawer__scrim") as HTMLElement)

    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
