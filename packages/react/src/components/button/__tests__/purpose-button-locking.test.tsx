import type * as React from "react"

import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import {
  CancelButton,
  ConfirmButton,
  CreateButton,
  DestructiveButton,
  LinkButton,
  SubmitButton,
} from ".."
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("React purpose button locking", () => {
  it("ignores illegal variant and action overrides for inherited-mode purpose buttons", () => {
    const illegalCreateProps = {
      variant: "success",
      action: "cancel",
    } as unknown as React.ComponentProps<typeof CreateButton>

    const illegalCancelProps = {
      variant: "primary",
      action: "create",
    } as unknown as React.ComponentProps<typeof CancelButton>

    renderWithProvider(
      <>
        <CreateButton {...illegalCreateProps}>Create</CreateButton>
        <CancelButton {...illegalCancelProps}>Cancel</CancelButton>
      </>,
    )

    const createButton = screen.getByRole("button", { name: /create/i })
    expect(createButton).toHaveAttribute("data-action", "create")
    expect(createButton).toHaveAttribute("data-variant", "primary")
    expect(createButton).toHaveClass("mw-btn--primary")

    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    expect(cancelButton).toHaveAttribute("data-action", "cancel")
    expect(cancelButton).toHaveAttribute("data-variant", "neutral")
    expect(cancelButton).toHaveClass("mw-btn--neutral")
  })

  it("ignores illegal as, action, and variant overrides for fixed-mode purpose buttons", () => {
    const illegalDangerProps = {
      as: "a",
      href: "/delete",
      variant: "secondary",
      action: "navigate",
    } as unknown as React.ComponentProps<typeof DestructiveButton>

    const illegalSubmitProps = {
      as: "a",
      href: "/submit",
      variant: "neutral",
      action: "cancel",
    } as unknown as React.ComponentProps<typeof SubmitButton>

    const illegalLinkProps = {
      as: "button",
      variant: "primary",
      action: "delete",
      href: "/dashboard",
    } as unknown as React.ComponentProps<typeof LinkButton>

    const illegalConfirmProps = {
      as: "a",
      href: "/confirm",
      variant: "primary",
      action: "delete",
    } as unknown as React.ComponentProps<typeof ConfirmButton>

    renderWithProvider(
      <>
        <DestructiveButton {...illegalDangerProps}>Delete</DestructiveButton>
        <SubmitButton {...illegalSubmitProps}>Submit</SubmitButton>
        <LinkButton {...illegalLinkProps}>Go to dashboard</LinkButton>
        <ConfirmButton {...illegalConfirmProps}>Confirm</ConfirmButton>
      </>,
    )

    const destructiveButton = screen.getByRole("button", { name: /delete/i })
    expect(destructiveButton.tagName).toBe("BUTTON")
    expect(destructiveButton).toHaveAttribute("data-action", "delete")
    expect(destructiveButton).toHaveAttribute("data-variant", "primary")
    expect(destructiveButton).toHaveClass("mw-btn--error")

    const submitButton = screen.getByRole("button", { name: /submit/i })
    expect(submitButton.tagName).toBe("BUTTON")
    expect(submitButton).toHaveAttribute("type", "submit")
    expect(submitButton).toHaveAttribute("data-action", "submit")
    expect(submitButton).toHaveAttribute("data-variant", "primary")

    const linkButton = screen.getByRole("button", { name: /go to dashboard/i })
    expect(linkButton.tagName).toBe("A")
    expect(linkButton).toHaveAttribute("href", "/dashboard")
    expect(linkButton).toHaveAttribute("data-action", "navigate")
    expect(linkButton).toHaveAttribute("data-variant", "text")

    const confirmButton = screen.getByRole("button", { name: /confirm/i })
    expect(confirmButton.tagName).toBe("BUTTON")
    expect(confirmButton).toHaveAttribute("data-action", "button")
    expect(confirmButton).toHaveAttribute("data-variant", "success")
  })

  it("warns in development when forbidden props are supplied", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    const illegalCancelProps = {
      variant: "success",
      action: "create",
    } as unknown as React.ComponentProps<typeof CancelButton>

    const illegalLinkProps = {
      as: "button",
      variant: "primary",
      action: "delete",
      href: "/dashboard",
    } as unknown as React.ComponentProps<typeof LinkButton>

    renderWithProvider(
      <>
        <CancelButton {...illegalCancelProps}>Cancel</CancelButton>
        <LinkButton {...illegalLinkProps}>Go to dashboard</LinkButton>
      </>,
    )

    const warningMessages = warnSpy.mock.calls.map(([message]) => String(message))

    expect(warningMessages).toContain(
      "[marwes] CancelButton does not support `variant`. Use Button if you need a custom visual treatment.",
    )
    expect(warningMessages).toContain(
      "[marwes] CancelButton does not support `action`. Use Button if you need a custom semantic action.",
    )
    expect(warningMessages).toContain(
      "[marwes] LinkButton does not support `as`. Use Button if you need a custom element mode.",
    )
    expect(warningMessages).toContain(
      "[marwes] LinkButton does not support `variant`. Use Button if you need a custom visual treatment.",
    )
    expect(warningMessages).toContain(
      "[marwes] LinkButton does not support `action`. Use Button if you need a custom semantic action.",
    )

    warnSpy.mockRestore()
  })
})
