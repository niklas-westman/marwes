/**
 * React adapter: Tests the Badge Group component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { BadgeVariant } from "@marwes-ui/core"
import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { runBadgeGroupContract } from "../../../../../../tests/contracts/badge-group.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Badge } from "../badge"
import { BadgeGroup } from "../badge-group"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runBadgeGroupContract("react", {
  renderBadgeGroup(args = {}) {
    const label = args.label ?? "Tags"
    render(
      <MarwesProvider>
        <BadgeGroup label={label}>
          <Badge>A</Badge>
          <Badge>B</Badge>
        </BadgeGroup>
      </MarwesProvider>,
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})

describe("BadgeGroup (Molecule)", () => {
  it("renders a labeled group container with badge children", () => {
    renderWithProvider(
      <BadgeGroup label="Tags">
        <Badge variant={BadgeVariant.info}>Alpha</Badge>
        <Badge variant={BadgeVariant.success}>Beta</Badge>
      </BadgeGroup>,
    )

    const group = screen.getByRole("group", { name: /tags/i })
    expect(group).toBeTruthy()
    expect(screen.getByText("Alpha")).toBeTruthy()
    expect(screen.getByText("Beta")).toBeTruthy()
  })

  it("applies mw-badge-group class on the container", () => {
    renderWithProvider(
      <BadgeGroup label="Status">
        <Badge>Active</Badge>
      </BadgeGroup>,
    )

    const group = screen.getByRole("group", { name: /status/i })
    expect(group.className).toContain("mw-badge-group")
  })

  it("merges custom className onto the container", () => {
    renderWithProvider(
      <BadgeGroup label="Status" className="custom-group">
        <Badge>Active</Badge>
      </BadgeGroup>,
    )

    const group = screen.getByRole("group", { name: /status/i })
    expect(group.className).toContain("mw-badge-group")
    expect(group.className).toContain("custom-group")
  })

  it("spreads dataAttributes onto the wrapper", () => {
    renderWithProvider(
      <BadgeGroup label="Tags" dataAttributes={{ "data-purpose": "status" }}>
        <Badge>Active</Badge>
      </BadgeGroup>,
    )

    const group = screen.getByRole("group", { name: /tags/i })
    expect(group.getAttribute("data-purpose")).toBe("status")
  })

  it("wires label into aria-labelledby on the group", () => {
    renderWithProvider(
      <BadgeGroup label="Categories">
        <Badge>A</Badge>
      </BadgeGroup>,
    )

    const group = screen.getByRole("group")
    const labelledBy = group.getAttribute("aria-labelledby") ?? ""
    expect(labelledBy.length).toBeGreaterThan(0)

    const labelEl = document.getElementById(labelledBy)
    expect(labelEl).not.toBeNull()
    expect(labelEl?.textContent).toContain("Categories")
  })
})
