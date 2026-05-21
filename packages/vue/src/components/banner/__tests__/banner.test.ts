/**
 * Vue adapter: Tests the Banner component — verifies rendering,
 * variant classes, a11y attributes, slots, and events.
 */
import { BannerVariant } from "@marwes-ui/core"
import { fireEvent, render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Banner } from "../banner"

function renderWithProvider(
  component: unknown,
  props: Record<string, unknown>,
  slots?: Record<string, () => unknown>,
) {
  const { children, ...componentProps } = props

  render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(component as never, componentProps, {
                default: () => children,
                ...slots,
              }),
          })
      },
    }),
  )
}

describe("Vue Banner (Atom)", () => {
  it("renders with default neutral variant", () => {
    renderWithProvider(Banner, { children: "Hello" })

    const message = screen.getByText("Hello")
    const root = message.closest("[data-mw-component='banner']")
    expect(root).not.toBeNull()
    expect(root?.className).toContain("mw-banner--neutral")
  })

  it("applies variant class for each variant", () => {
    for (const variant of Object.values(BannerVariant)) {
      const { unmount } = render(
        defineComponent({
          setup() {
            return () =>
              h(MarwesProvider, null, {
                default: () => h(Banner, { variant }, { default: () => variant }),
              })
          },
        }),
      )
      const message = screen.getByText(variant)
      const root = message.closest("[data-mw-component='banner']")
      expect(root?.className).toContain(`mw-banner--${variant}`)
      unmount()
    }
  })

  it("uses role=status for info variant", () => {
    renderWithProvider(Banner, { variant: "info", children: "Info msg" })

    const root = screen.getByRole("status")
    expect(root.getAttribute("aria-live")).toBe("polite")
  })

  it("uses role=alert for error variant", () => {
    renderWithProvider(Banner, { variant: "error", children: "Error msg" })

    const root = screen.getByRole("alert")
    expect(root.getAttribute("aria-live")).toBe("assertive")
  })

  it("shows icon by default", () => {
    renderWithProvider(Banner, { children: "With icon" })

    const root = screen.getByText("With icon").closest("[data-mw-component='banner']")
    const icon = root?.querySelector(".mw-banner__icon")
    expect(icon).not.toBeNull()
  })

  it("hides icon when showIcon is false", () => {
    renderWithProvider(Banner, { showIcon: false, children: "No icon" })

    const root = screen.getByText("No icon").closest("[data-mw-component='banner']")
    const icon = root?.querySelector(".mw-banner__icon")
    expect(icon).toBeNull()
  })

  it("shows dismiss button by default", () => {
    renderWithProvider(Banner, { children: "Dismissible" })

    const dismiss = screen.getByLabelText("Dismiss banner")
    expect(dismiss).not.toBeNull()
  })

  it("hides dismiss button when dismissible is false", () => {
    renderWithProvider(Banner, { dismissible: false, children: "Persistent" })

    const dismiss = screen.queryByLabelText("Dismiss banner")
    expect(dismiss).toBeNull()
  })

  it("emits dismiss event on close click", async () => {
    const onDismiss = vi.fn()
    renderWithProvider(Banner, { onDismiss, children: "Click close" })

    const dismiss = screen.getByLabelText("Dismiss banner")
    await fireEvent.click(dismiss)
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it("renders action slot", () => {
    renderWithProvider(
      Banner,
      { showAction: true, children: "With CTA" },
      {
        action: () => h("button", { type: "button" }, "Learn more"),
      },
    )

    expect(screen.getByText("Learn more")).not.toBeNull()
  })

  it("merges custom className", () => {
    renderWithProvider(Banner, { className: "custom", children: "Msg" })

    const root = screen.getByText("Msg").closest("[data-mw-component='banner']")
    expect(root?.className).toContain("mw-banner")
    expect(root?.className).toContain("custom")
  })
})
