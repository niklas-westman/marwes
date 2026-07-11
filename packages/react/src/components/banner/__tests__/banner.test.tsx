/**
 * React adapter: Tests the Banner component — verifies rendering,
 * variant classes, a11y attributes, and slot visibility.
 */
import { BannerVariant } from "@marwes-ui/core"
import { fireEvent, render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Banner } from "../banner"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("Banner (Atom)", () => {
  it("renders with default neutral variant", () => {
    renderWithProvider(<Banner>Hello</Banner>)

    const message = screen.getByText("Hello")
    const root = message.closest("[data-component='banner']")
    expect(root).not.toBeNull()
    expect(root?.className).toContain("mw-banner--neutral")
  })

  it("applies variant class for each variant", () => {
    for (const variant of Object.values(BannerVariant)) {
      const { unmount } = renderWithProvider(<Banner variant={variant}>{variant}</Banner>)
      const message = screen.getByText(variant)
      const root = message.closest("[data-component='banner']")
      expect(root?.className).toContain(`mw-banner--${variant}`)
      unmount()
    }
  })

  it("uses role=status and aria-live=polite for info/success/neutral", () => {
    renderWithProvider(<Banner variant="info">Info msg</Banner>)

    const root = screen.getByRole("status")
    expect(root.getAttribute("aria-live")).toBe("polite")
  })

  it("uses role=alert and aria-live=assertive for error/warning", () => {
    renderWithProvider(<Banner variant="error">Error msg</Banner>)

    const root = screen.getByRole("alert")
    expect(root.getAttribute("aria-live")).toBe("assertive")
  })

  it("shows icon by default", () => {
    renderWithProvider(<Banner>With icon</Banner>)

    const root = screen.getByText("With icon").closest("[data-component='banner']")
    const icon = root?.querySelector(".mw-banner__icon")
    expect(icon).not.toBeNull()
  })

  it("hides icon when showIcon is false", () => {
    renderWithProvider(<Banner showIcon={false}>No icon</Banner>)

    const root = screen.getByText("No icon").closest("[data-component='banner']")
    const icon = root?.querySelector(".mw-banner__icon")
    expect(icon).toBeNull()
  })

  it("shows dismiss button by default", () => {
    renderWithProvider(<Banner>Dismissible</Banner>)

    const dismiss = screen.getByLabelText("Dismiss banner")
    expect(dismiss).not.toBeNull()
  })

  it("hides dismiss button when dismissible is false", () => {
    renderWithProvider(<Banner dismissible={false}>Persistent</Banner>)

    const dismiss = screen.queryByLabelText("Dismiss banner")
    expect(dismiss).toBeNull()
  })

  it("calls onDismiss when dismiss button is clicked", () => {
    const onDismiss = vi.fn()
    renderWithProvider(<Banner onDismiss={onDismiss}>Click close</Banner>)

    const dismiss = screen.getByLabelText("Dismiss banner")
    fireEvent.click(dismiss)
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it("shows action slot when action prop is provided", () => {
    renderWithProvider(<Banner action={<button type="button">Learn more</button>}>With CTA</Banner>)

    expect(screen.getByText("Learn more")).not.toBeNull()
  })

  it("hides action slot when no action is provided", () => {
    renderWithProvider(<Banner>No CTA</Banner>)

    const root = screen.getByText("No CTA").closest("[data-component='banner']")
    const action = root?.querySelector(".mw-banner__action")
    expect(action).toBeNull()
  })

  it("merges custom className", () => {
    renderWithProvider(<Banner className="custom">Msg</Banner>)

    const root = screen.getByText("Msg").closest("[data-component='banner']")
    expect(root?.className).toContain("mw-banner")
    expect(root?.className).toContain("custom")
  })

  it("passes id to the root element", () => {
    renderWithProvider(<Banner id="my-banner">Msg</Banner>)

    const root = screen.getByText("Msg").closest("[data-component='banner']")
    expect(root?.id).toBe("my-banner")
  })

  it("sets aria-label when provided", () => {
    renderWithProvider(<Banner ariaLabel="Important notice">Msg</Banner>)

    const root = screen.getByText("Msg").closest("[data-component='banner']")
    expect(root?.getAttribute("aria-label")).toBe("Important notice")
  })
})
