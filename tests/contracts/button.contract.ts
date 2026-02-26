import { describe, expect, it } from "vitest"

export type ButtonContractHarness = {
  renderPrimary(args?: {
    text?: string
    disabled?: boolean
    onClick?: () => void
  }): Promise<void> | void
  renderLink(args: {
    text: string
    href: string
    disabled?: boolean
    onClick?: () => void
  }): Promise<void> | void
  getByRole(role: "button" | "link", options: { name: RegExp }): HTMLElement
  click(element: HTMLElement): Promise<void>
}

export function runButtonContract(adapterName: string, h: ButtonContractHarness): void {
  describe(`Button contract: ${adapterName}`, () => {
    it("PrimaryButton renders a button and calls onClick", async () => {
      let clicks = 0

      await h.renderPrimary({
        text: "Save",
        onClick: () => {
          clicks += 1
        },
      })

      const button = h.getByRole("button", { name: /save/i })
      await h.click(button)

      expect(clicks).toBe(1)
    })

    it("LinkButton renders a navigation button element backed by an anchor href", async () => {
      await h.renderLink({
        text: "Dashboard",
        href: "/dashboard",
      })

      const linkButton = h.getByRole("button", { name: /dashboard/i })
      expect(linkButton.tagName).toBe("A")
      expect(linkButton).toHaveAttribute("href", "/dashboard")
    })

    it("disabled LinkButton is aria-disabled and blocks click handler", async () => {
      let clicks = 0

      await h.renderLink({
        text: "Disabled link",
        href: "/dashboard",
        disabled: true,
        onClick: () => {
          clicks += 1
        },
      })

      const linkButton = h.getByRole("button", { name: /disabled link/i })
      expect(linkButton).toHaveAttribute("aria-disabled", "true")

      await h.click(linkButton)
      expect(clicks).toBe(0)
    })
  })
}
