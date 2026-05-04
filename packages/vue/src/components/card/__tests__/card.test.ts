import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { runCardContract } from "../../../../../../tests/contracts/card.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Card } from "../card"
import { ProductCard, ProfileCard, StatCard } from "../variants"

function renderWithProvider(
  component: unknown,
  props: Record<string, unknown>,
  slots?: Record<string, () => unknown>,
) {
  render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(component as never, props, slots),
          })
      },
    }),
  )
}

runCardContract("vue", {
  renderCard(args = {}) {
    renderWithProvider(
      Card,
      {},
      {
        ...(args.title !== undefined ? { title: () => args.title } : {}),
        default: () => args.body ?? "Card body.",
      },
    )
  },
  renderProductCard(args = {}) {
    renderWithProvider(ProductCard, {}, { default: () => args.body ?? "Product body." })
  },
  renderProfileCard(args = {}) {
    renderWithProvider(ProfileCard, {}, { default: () => args.body ?? "Profile body." })
  },
  renderStatCard(args = {}) {
    renderWithProvider(StatCard, {}, { default: () => args.body ?? "Stat body." })
  },
  getCardElement() {
    return document.querySelector(".mw-card")
  },
  getByText(text) {
    return screen.getByText(text)
  },
})

describe("Vue Card (Atom)", () => {
  it("renders the card shell with title and body content", () => {
    renderWithProvider(
      Card,
      {},
      {
        title: () => "Project status",
        default: () => "Build pipeline is healthy.",
      },
    )

    const title = screen.getByText("Project status")
    const body = screen.getByText("Build pipeline is healthy.")
    const bodyWrapper = body.closest(".mw-card__body")
    const card = body.closest(".mw-card")

    expect(title.className).toContain("mw-card__title")
    expect(bodyWrapper).not.toBeNull()
    expect(card?.tagName).toBe("DIV")
  })

  it("spreads recipe and custom dataAttributes onto the outer card element", () => {
    renderWithProvider(
      Card,
      { dataAttributes: { "data-purpose": "profile-card" } },
      { default: () => "Owner details" },
    )

    const body = screen.getByText("Owner details")
    const card = body.closest(".mw-card")

    expect(card?.getAttribute("data-component")).toBe("card")
    expect(card?.getAttribute("data-purpose")).toBe("profile-card")
  })

  it("merges a custom className and id onto the outer card element", () => {
    renderWithProvider(
      Card,
      { id: "team-card", className: "custom-card" },
      { default: () => "Team roster" },
    )

    const body = screen.getByText("Team roster")
    const card = body.closest(".mw-card")

    expect(card?.id).toBe("team-card")
    expect(card?.className).toContain("mw-card")
    expect(card?.className).toContain("custom-card")
  })
})
