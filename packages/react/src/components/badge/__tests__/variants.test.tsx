/**
 * React adapter: Tests Badge purpose/variant components — verifies that each
 * purpose wrapper renders with the correct semantic defaults and metadata.
 */
import { BadgeVariant } from "@marwes-ui/core"
import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { runBadgeContract } from "../../../../../../tests/contracts/badge.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Badge } from "../badge"
import { NotificationBadge, PriorityBadge, StatusBadge } from "../variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runBadgeContract("react", {
  renderStatus() {
    renderWithProvider(<StatusBadge variant={BadgeVariant.success}>Active</StatusBadge>)
  },
  renderPriority() {
    renderWithProvider(<PriorityBadge variant={BadgeVariant.error}>Critical</PriorityBadge>)
  },
  renderNotification() {
    renderWithProvider(<NotificationBadge variant={BadgeVariant.info}>5</NotificationBadge>)
  },
  renderBadgeWithAriaLabel() {
    renderWithProvider(
      <NotificationBadge variant={BadgeVariant.info} ariaLabel="5 unread messages">
        5
      </NotificationBadge>,
    )
  },
  getByText(text) {
    return screen.getByText(text)
  },
})

describe("StatusBadge (Purpose)", () => {
  it("renders with data-purpose=status", () => {
    renderWithProvider(<StatusBadge variant={BadgeVariant.success}>Active</StatusBadge>)

    const badge = screen.getByText("Active")
    const wrapper = badge.closest("[data-purpose]")
    expect(wrapper?.getAttribute("data-purpose")).toBe("status")
  })

  it("renders as a Badge atom with expected variant class", () => {
    renderWithProvider(<StatusBadge variant={BadgeVariant.success}>Active</StatusBadge>)

    const badge = screen.getByText("Active")
    expect(badge.className).toContain("mw-badge")
    expect(badge.className).toContain("mw-badge--success")
  })

  it("defaults to neutral variant when not specified", () => {
    renderWithProvider(<StatusBadge>Unknown</StatusBadge>)

    const badge = screen.getByText("Unknown")
    expect(badge.className).toContain("mw-badge--neutral")
  })
})

describe("PriorityBadge (Purpose)", () => {
  it("renders with data-purpose=priority", () => {
    renderWithProvider(<PriorityBadge variant={BadgeVariant.error}>Critical</PriorityBadge>)

    const badge = screen.getByText("Critical")
    const wrapper = badge.closest("[data-purpose]")
    expect(wrapper?.getAttribute("data-purpose")).toBe("priority")
  })

  it("renders as a Badge atom with expected variant class", () => {
    renderWithProvider(<PriorityBadge variant={BadgeVariant.warning}>High</PriorityBadge>)

    const badge = screen.getByText("High")
    expect(badge.className).toContain("mw-badge--warning")
  })
})

describe("NotificationBadge (Purpose)", () => {
  it("renders with data-purpose=notification", () => {
    renderWithProvider(<NotificationBadge variant={BadgeVariant.info}>5</NotificationBadge>)

    const badge = screen.getByText("5")
    const wrapper = badge.closest("[data-purpose]")
    expect(wrapper?.getAttribute("data-purpose")).toBe("notification")
  })

  it("renders as a Badge atom with expected variant class", () => {
    renderWithProvider(
      <NotificationBadge variant={BadgeVariant.error} ariaLabel="99+ alerts">
        99+
      </NotificationBadge>,
    )

    const badge = screen.getByText("99+")
    expect(badge.className).toContain("mw-badge--error")
  })

  it("passes ariaLabel for accessibility", () => {
    renderWithProvider(
      <NotificationBadge variant={BadgeVariant.info} ariaLabel="5 unread messages">
        5
      </NotificationBadge>,
    )

    const badge = screen.getByText("5")
    expect(badge.getAttribute("aria-label")).toBe("5 unread messages")
  })
})
