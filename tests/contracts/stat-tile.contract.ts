import { describe, expect, it } from "vitest"

export type StatTileContractHarness = {
  renderStatTile(args?: {
    label?: string
    value?: string
    subtitle?: string
    tone?: "neutral" | "brand" | "success" | "warning" | "danger"
    trendValue?: string
    trendDirection?: "positive" | "negative"
  }): Promise<void> | void
  getStatTileElement(): HTMLElement
  getByText(text: string): HTMLElement
}

export function runStatTileContract(adapterName: string, harness: StatTileContractHarness): void {
  describe(`StatTile contract: ${adapterName}`, () => {
    it("renders the Figma baseline stat tile", async () => {
      await harness.renderStatTile()

      const tile = harness.getStatTileElement()
      expect(tile.tagName).toBe("ARTICLE")
      expect(tile.className).toContain("mw-stat-tile")
      expect(tile.className).toContain("mw-stat-tile--neutral")
      expect(tile).toHaveAttribute("data-component", "stat-tile")
      expect(tile).toHaveAttribute("data-tone", "neutral")
      expect(harness.getByText("Monthly Revenue")).toBeTruthy()
      expect(harness.getByText("$48,200")).toBeTruthy()
      expect(harness.getByText("vs $42,900 last month")).toBeTruthy()
    })

    it("renders tone and trend metadata", async () => {
      await harness.renderStatTile({
        tone: "success",
        trendDirection: "positive",
        trendValue: "12%",
      })

      const tile = harness.getStatTileElement()
      expect(tile.className).toContain("mw-stat-tile--success")
      expect(tile).toHaveAttribute("data-tone", "success")
      expect(tile).toHaveAttribute("data-trend", "positive")
      const trend = harness.getByText("12%").closest("[data-component='stat-tile-trend']")
      expect(trend).toHaveAttribute("aria-label", "Increased by 12%")
      expect(trend).toHaveAttribute("data-trend", "positive")
    })
  })
}
