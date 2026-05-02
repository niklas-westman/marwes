import { describe, expect, it } from "vitest"

export type ButtonContractHarness = {
  renderPrimary(args?: {
    text?: string
    disabled?: boolean
    loading?: boolean
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

    it("loading PrimaryButton is busy and disabled", async () => {
      await h.renderPrimary({
        text: "Saving",
        loading: true,
      })

      const button = h.getByRole("button", { name: /saving/i })
      expect(button).toHaveAttribute("aria-busy", "true")
      expect(button).toHaveAttribute("aria-disabled", "true")
      expect(button).toBeDisabled()
    })

    it("LinkButton renders a navigation link element backed by an anchor href", async () => {
      await h.renderLink({
        text: "Dashboard",
        href: "/dashboard",
      })

      const linkButton = h.getByRole("link", { name: /dashboard/i })
      expect(linkButton.tagName).toBe("A")
      expect(linkButton).toHaveAttribute("href", "/dashboard")
      expect(linkButton).not.toHaveAttribute("role")
    })

    it("disabled LinkButton keeps link intent through aria-disabled and blocks click handler", async () => {
      let clicks = 0

      await h.renderLink({
        text: "Disabled link",
        href: "/dashboard",
        disabled: true,
        onClick: () => {
          clicks += 1
        },
      })

      const linkButton = h.getByRole("link", { name: /disabled link/i })
      expect(linkButton).toHaveAttribute("aria-disabled", "true")
      expect(linkButton).toHaveAttribute("role", "link")
      expect(linkButton).toHaveAttribute("tabindex", "-1")
      expect(linkButton).not.toHaveAttribute("href")

      await h.click(linkButton)
      expect(clicks).toBe(0)
    })
  })
}
