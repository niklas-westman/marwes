/**
 * Shared contract for Tab/TabGroup — tablist naming from visible label,
 * aria-label fallback, selected tab/panel wiring, and automatic Arrow activation
 * with disabled tab skipping.
 */
import { describe, expect, it } from "vitest"

export type TabContractItem = {
  value: string
  label: string
  panel: string
  disabled?: boolean
  ariaLabel?: string
}

export type TabContractHarness = {
  renderTabGroup(args?: {
    label?: string
    ariaLabel?: string
    defaultActiveTab?: string
    activeTab?: string
    onActiveTabChange?: (value: string) => void
    tabs?: TabContractItem[]
  }): Promise<void> | void
  getByRole(role: "tablist" | "tab" | "tabpanel", options?: { name?: RegExp | string }): HTMLElement
  click(element: HTMLElement): Promise<void>
  keyboard(text: string): Promise<void>
}

function getControlledPanelElement(tab: HTMLElement): HTMLElement | null {
  const panelId = tab.getAttribute("aria-controls")

  if (!panelId) {
    return null
  }

  const panel = document.getElementById(panelId)
  return panel instanceof HTMLElement ? panel : null
}

export function runTabContract(adapterName: string, harness: TabContractHarness): void {
  describe(`Tab contract: ${adapterName}`, () => {
    it("names the tablist from a visible label", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        defaultActiveTab: "overview",
      })

      const tablist = harness.getByRole("tablist", { name: /account sections/i })
      const labelId = tablist.getAttribute("aria-labelledby")
      const labelElement = labelId ? document.getElementById(labelId) : null

      expect(tablist).toBeInTheDocument()
      expect(tablist).toHaveAttribute("aria-labelledby")
      expect(tablist).not.toHaveAttribute("aria-label")
      expect(labelElement).toHaveClass("mw-text", "mw-text--label")
    })

    it("falls back to aria-label when no visible label is provided", async () => {
      await harness.renderTabGroup({
        ariaLabel: "Profile sections",
        defaultActiveTab: "overview",
      })

      const tablist = harness.getByRole("tablist", { name: /profile sections/i })

      expect(tablist).toBeInTheDocument()
      expect(tablist).toHaveAttribute("aria-label", "Profile sections")
      expect(tablist).not.toHaveAttribute("aria-labelledby")
    })

    it("wires each selected tab to its tabpanel", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        defaultActiveTab: "overview",
      })

      const overviewTab = harness.getByRole("tab", { name: /overview/i })
      const overviewPanel = getControlledPanelElement(overviewTab)

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(overviewTab.id).toBeTruthy()
      expect(overviewPanel).not.toBeNull()
      expect(overviewPanel).toHaveAttribute("role", "tabpanel")
      expect(overviewPanel).toHaveAttribute("aria-labelledby", overviewTab.id)
      expect(overviewPanel).toHaveTextContent("Overview panel")
      expect(overviewPanel).toHaveAttribute("tabindex", "0")
    })

    it("uses automatic activation on Arrow navigation and skips disabled tabs", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        defaultActiveTab: "overview",
      })

      const overviewTab = harness.getByRole("tab", { name: /overview/i })
      overviewTab.focus()

      await harness.keyboard("{ArrowRight}")

      const settingsTab = harness.getByRole("tab", { name: /settings/i })
      expect(settingsTab).toHaveAttribute("aria-selected", "true")
      expect(document.activeElement).toBe(settingsTab)
      expect(getControlledPanelElement(settingsTab)).toHaveTextContent("Settings panel")

      await harness.keyboard("{ArrowLeft}")

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(document.activeElement).toBe(overviewTab)
      expect(getControlledPanelElement(overviewTab)).toHaveTextContent("Overview panel")
    })

    it("wraps across enabled tabs and supports Home and End", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        defaultActiveTab: "overview",
      })

      const overviewTab = harness.getByRole("tab", { name: /overview/i })
      overviewTab.focus()

      await harness.keyboard("{End}")

      const settingsTab = harness.getByRole("tab", { name: /settings/i })
      expect(settingsTab).toHaveAttribute("aria-selected", "true")
      expect(document.activeElement).toBe(settingsTab)

      await harness.keyboard("{ArrowRight}")

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(document.activeElement).toBe(overviewTab)

      await harness.keyboard("{Home}")

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(document.activeElement).toBe(overviewTab)
    })

    it("falls back to the first enabled tab when defaultActiveTab points to a disabled tab", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        defaultActiveTab: "analytics",
      })

      const overviewTab = harness.getByRole("tab", { name: /overview/i })

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(getControlledPanelElement(overviewTab)).toHaveTextContent("Overview panel")
    })

    it("falls back to the first enabled tab when activeTab points to a disabled tab", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        activeTab: "analytics",
      })

      const overviewTab = harness.getByRole("tab", { name: /overview/i })

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(getControlledPanelElement(overviewTab)).toHaveTextContent("Overview panel")
    })

    it("does not activate disabled tabs when clicked", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        defaultActiveTab: "overview",
      })

      const overviewTab = harness.getByRole("tab", { name: /overview/i })
      const analyticsTab = harness.getByRole("tab", { name: /analytics/i })

      expect(analyticsTab).toBeDisabled()
      expect(analyticsTab).toHaveAttribute("aria-disabled", "true")

      await harness.click(analyticsTab)

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(getControlledPanelElement(overviewTab)).toHaveTextContent("Overview panel")
    })

    it("keeps selection controlled while still emitting the next tab value", async () => {
      const emittedValues: string[] = []

      await harness.renderTabGroup({
        label: "Account sections",
        activeTab: "overview",
        onActiveTabChange: (value) => {
          emittedValues.push(value)
        },
      })

      const settingsTab = harness.getByRole("tab", { name: /settings/i })
      await harness.click(settingsTab)

      const overviewTab = harness.getByRole("tab", { name: /overview/i })

      expect(emittedValues).toEqual(["settings"])
      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(getControlledPanelElement(overviewTab)).toHaveTextContent("Overview panel")
    })
  })
}
