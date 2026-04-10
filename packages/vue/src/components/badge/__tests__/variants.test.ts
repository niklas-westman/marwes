import { BadgeVariant } from "@marwes-ui/core"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { NotificationBadge, PriorityBadge, StatusBadge } from "../variants"

function renderWithProvider(component: unknown, props: Record<string, unknown>) {
  render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(component as never, props, { default: () => props.children }),
          })
      },
    }),
  )
}

describe("Vue StatusBadge (Context)", () => {
  it("renders with data-purpose=status", () => {
    renderWithProvider(StatusBadge, { variant: BadgeVariant.success, children: "Active" })

    const badge = screen.getByText("Active")
    const wrapper = badge.closest("[data-purpose]")
    expect(wrapper?.getAttribute("data-purpose")).toBe("status")
  })

  it("renders as a Badge atom with expected variant class", () => {
    renderWithProvider(StatusBadge, { variant: BadgeVariant.success, children: "Active" })

    const badge = screen.getByText("Active")
    expect(badge.className).toContain("mw-badge")
    expect(badge.className).toContain("mw-badge--success")
  })

  it("defaults to neutral variant when not specified", () => {
    renderWithProvider(StatusBadge, { children: "Unknown" })

    const badge = screen.getByText("Unknown")
    expect(badge.className).toContain("mw-badge--neutral")
  })
})

describe("Vue PriorityBadge (Context)", () => {
  it("renders with data-purpose=priority", () => {
    renderWithProvider(PriorityBadge, { variant: BadgeVariant.error, children: "Critical" })

    const badge = screen.getByText("Critical")
    const wrapper = badge.closest("[data-purpose]")
    expect(wrapper?.getAttribute("data-purpose")).toBe("priority")
  })

  it("renders as a Badge atom with expected variant class", () => {
    renderWithProvider(PriorityBadge, { variant: BadgeVariant.warning, children: "High" })

    const badge = screen.getByText("High")
    expect(badge.className).toContain("mw-badge--warning")
  })
})

describe("Vue NotificationBadge (Context)", () => {
  it("renders with data-purpose=notification", () => {
    renderWithProvider(NotificationBadge, { variant: BadgeVariant.info, children: "5" })

    const badge = screen.getByText("5")
    const wrapper = badge.closest("[data-purpose]")
    expect(wrapper?.getAttribute("data-purpose")).toBe("notification")
  })

  it("renders as a Badge atom with expected variant class", () => {
    renderWithProvider(NotificationBadge, {
      variant: BadgeVariant.error,
      ariaLabel: "99+ alerts",
      children: "99+",
    })

    const badge = screen.getByText("99+")
    expect(badge.className).toContain("mw-badge--error")
  })

  it("passes ariaLabel for accessibility", () => {
    renderWithProvider(NotificationBadge, {
      variant: BadgeVariant.info,
      ariaLabel: "5 unread messages",
      children: "5",
    })

    const badge = screen.getByText("5")
    expect(badge.getAttribute("aria-label")).toBe("5 unread messages")
  })
})
