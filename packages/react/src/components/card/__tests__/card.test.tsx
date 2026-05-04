import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { runCardContract } from "../../../../../../tests/contracts/card.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Card } from "../card"
import { ProductCard, ProfileCard, StatCard } from "../variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runCardContract("react", {
  renderCard(args = {}) {
    renderWithProvider(
      <Card {...(args.title !== undefined ? { title: args.title } : {})}>
        {args.body ?? "Card body."}
      </Card>,
    )
  },
  renderProductCard(args = {}) {
    renderWithProvider(<ProductCard>{args.body ?? "Product body."}</ProductCard>)
  },
  renderProfileCard(args = {}) {
    renderWithProvider(<ProfileCard>{args.body ?? "Profile body."}</ProfileCard>)
  },
  renderStatCard(args = {}) {
    renderWithProvider(<StatCard>{args.body ?? "Stat body."}</StatCard>)
  },
  getCardElement() {
    return document.querySelector(".mw-card")
  },
  getByText(text) {
    return screen.getByText(text)
  },
})

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

  it("spreads recipe and custom data attributes onto the outer card element", () => {
    renderWithProvider(
      <Card dataAttributes={{ "data-purpose": "stat-card" }}>Monthly recurring revenue</Card>,
    )

    const body = screen.getByText("Monthly recurring revenue")
    const card = body.closest(".mw-card")

    expect(card?.getAttribute("data-component")).toBe("card")
    expect(card?.getAttribute("data-purpose")).toBe("stat-card")
  })

  it("passes through native div props while merging className", () => {
    renderWithProvider(
      <Card id="account-card" className="custom-card" tabIndex={0} aria-disabled="true">
        Account owner
      </Card>,
    )

    const body = screen.getByText("Account owner")
    const card = body.closest(".mw-card")

    expect(card?.id).toBe("account-card")
    expect(card?.className).toContain("mw-card")
    expect(card?.className).toContain("custom-card")
    expect(card?.getAttribute("tabindex")).toBe("0")
    expect(card?.getAttribute("aria-disabled")).toBe("true")
  })

  it("renders StatCard metric tile slots when value props are provided", () => {
    renderWithProvider(
      <StatCard
        title="Context reduction"
        value="42%"
        note="Estimated context-token reduction while preserving authority."
        meta="generation-6 candidate"
      />,
    )

    const value = screen.getByText("42%")
    const note = screen.getByText("Estimated context-token reduction while preserving authority.")
    const meta = screen.getByText("generation-6 candidate")
    const metric = value.closest(".mw-stat-card__metric")

    expect(metric).not.toBeNull()
    expect(metric).toHaveAttribute("data-slot", "metric-tile")
    expect(value.className).toContain("mw-stat-card__value")
    expect(note.className).toContain("mw-stat-card__note")
    expect(meta.className).toContain("mw-stat-card__meta")
  })
})
