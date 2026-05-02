import { describe, expect, it } from "vitest"

export interface CardContractHarness {
  renderCard(args?: { title?: string; body?: string }): Promise<void> | void
  renderProductCard(args?: { body?: string }): Promise<void> | void
  renderProfileCard(args?: { body?: string }): Promise<void> | void
  renderStatCard(args?: { body?: string }): Promise<void> | void
  getCardElement(): HTMLElement | null
  getByText(text: string): HTMLElement
}

export function runCardContract(adapterName: string, harness: CardContractHarness): void {
  describe(`Card contract: ${adapterName}`, () => {
    it("renders data-component=card on the card shell", async () => {
      await harness.renderCard({ body: "Card content." })

      const card = harness.getCardElement()
      expect(card).not.toBeNull()
      expect(card).toHaveAttribute("data-component", "card")
      expect(card?.tagName).toBe("DIV")
    })

    it("renders the title in the card header and body in the card body", async () => {
      await harness.renderCard({ title: "Project status", body: "Build pipeline is healthy." })

      const title = harness.getByText("Project status")
      const body = harness.getByText("Build pipeline is healthy.")

      expect(title.closest(".mw-card__header")).not.toBeNull()
      expect(title.className).toContain("mw-card__title")
      expect(body.closest(".mw-card__body")).not.toBeNull()
    })

    it("renders the card body without a header when no title is provided", async () => {
      await harness.renderCard({ body: "Body only." })

      const body = harness.getByText("Body only.")
      const card = harness.getCardElement()

      expect(body.closest(".mw-card__body")).not.toBeNull()
      expect(card?.querySelector(".mw-card__header")).toBeNull()
    })

    it("ProductCard adds data-purpose=product-card", async () => {
      await harness.renderProductCard({ body: "Pro plan features." })

      const card = harness.getCardElement()
      expect(card).toHaveAttribute("data-component", "card")
      expect(card).toHaveAttribute("data-purpose", "product-card")
    })

    it("ProfileCard adds data-purpose=profile-card", async () => {
      await harness.renderProfileCard({ body: "Profile summary." })

      const card = harness.getCardElement()
      expect(card).toHaveAttribute("data-component", "card")
      expect(card).toHaveAttribute("data-purpose", "profile-card")
    })

    it("StatCard adds data-purpose=stat-card", async () => {
      await harness.renderStatCard({ body: "$128,400" })

      const card = harness.getCardElement()
      expect(card).toHaveAttribute("data-component", "card")
      expect(card).toHaveAttribute("data-purpose", "stat-card")
    })
  })
}
