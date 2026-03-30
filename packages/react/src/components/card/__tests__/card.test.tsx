import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Card } from "../card"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("Card (Atom)", () => {
  it("renders the card shell with title and body content", () => {
    renderWithProvider(<Card title="Project status">Build pipeline is healthy.</Card>)

    const title = screen.getByText("Project status")
    const body = screen.getByText("Build pipeline is healthy.")
    const bodyWrapper = body.closest(".mw-card__body")
    const card = body.closest(".mw-card")

    expect(title.className).toContain("mw-card__title")
    expect(bodyWrapper).not.toBeNull()
    expect(card?.tagName).toBe("DIV")
  })

  it("spreads dataAttributes onto the outer card element", () => {
    renderWithProvider(
      <Card dataAttributes={{ "data-purpose": "stat-card" }}>Monthly recurring revenue</Card>,
    )

    const body = screen.getByText("Monthly recurring revenue")
    const card = body.closest(".mw-card")

    expect(card?.getAttribute("data-purpose")).toBe("stat-card")
  })

  it("merges a custom className and id onto the outer card element", () => {
    renderWithProvider(
      <Card id="account-card" className="custom-card">
        Account owner
      </Card>,
    )

    const body = screen.getByText("Account owner")
    const card = body.closest(".mw-card")

    expect(card?.id).toBe("account-card")
    expect(card?.className).toContain("mw-card")
    expect(card?.className).toContain("custom-card")
  })
})
