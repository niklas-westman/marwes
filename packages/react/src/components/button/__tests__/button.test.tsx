import type * as React from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button, LinkButton, PrimaryButton } from ".."
import { runButtonContract } from "../../../../../../tests/contracts/button.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runButtonContract("react", {
  async renderPrimary(args = {}) {
    const buttonProps = {
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.onClick ? { onClick: args.onClick } : {}),
    }

    renderWithProvider(<PrimaryButton {...buttonProps}>{args.text ?? "Primary"}</PrimaryButton>)
  },
  async renderLink(args) {
    const linkProps = {
      href: args.href,
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.onClick ? { onClick: args.onClick } : {}),
    }

    renderWithProvider(<LinkButton {...linkProps}>{args.text}</LinkButton>)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
})

describe("React adapter specifics: Button", () => {
  it("passes a React synthetic event to onClick", async () => {
    const onClick = vi.fn()

    renderWithProvider(<PrimaryButton onClick={onClick}>Save</PrimaryButton>)
    await userEvent.setup().click(screen.getByRole("button", { name: /save/i }))

    expect(onClick).toHaveBeenCalledTimes(1)

    const eventArg = onClick.mock.calls[0]?.[0]
    expect(eventArg).toBeDefined()
    expect(typeof eventArg.preventDefault).toBe("function")
    expect(eventArg.nativeEvent).toBeInstanceOf(MouseEvent)
  })

  it("merges className with recipe output", () => {
    renderWithProvider(
      <Button as="button" className="custom-class">
        Styled
      </Button>,
    )

    const button = screen.getByRole("button", { name: /styled/i })
    expect(button).toHaveClass("custom-class")
    expect(button.className).toContain("mw-btn")
  })
})
