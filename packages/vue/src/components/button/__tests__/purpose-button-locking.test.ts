/**
 * Vue adapter: Tests purpose button locking — verifies that forbidden prop overrides
 * (variant, action, as) are silently stripped and trigger dev warnings.
 */
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import {
  CancelButton,
  ConfirmButton,
  CreateButton,
  DestructiveButton,
  LinkButton,
  SubmitButton,
} from "../variants"

function renderWithProvider(
  component: unknown,
  props: Record<string, unknown> = {},
  children?: string,
) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(component as never, props, {
                default: children ? () => children : undefined,
              }),
          })
      },
    }),
  )
}

describe("Vue purpose button locking", () => {
  it("filters forbidden attrs and keeps canonical semantics for inherited-mode purpose buttons", () => {
    renderWithProvider(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () => [
                h(
                  CreateButton,
                  { variant: "success", action: "cancel" },
                  { default: () => "Create" },
                ),
                h(
                  CancelButton,
                  { variant: "primary", action: "create" },
                  { default: () => "Cancel" },
                ),
              ],
            })
        },
      }),
    )

    const createButton = screen.getByRole("button", { name: /create/i })
    expect(createButton).not.toHaveAttribute("variant")
    expect(createButton).not.toHaveAttribute("action")
    expect(createButton).toHaveAttribute("data-action", "create")
    expect(createButton).toHaveAttribute("data-variant", "primary")
    expect(createButton).toHaveClass("mw-btn--primary")

    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    expect(cancelButton).not.toHaveAttribute("variant")
    expect(cancelButton).not.toHaveAttribute("action")
    expect(cancelButton).toHaveAttribute("data-action", "cancel")
    expect(cancelButton).toHaveAttribute("data-variant", "neutral")
    expect(cancelButton).toHaveClass("mw-btn--neutral")
  })

  it("filters forbidden attrs and keeps canonical element mode for fixed purpose buttons", () => {
    renderWithProvider(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () => [
                h(
                  DestructiveButton,
                  { as: "a", href: "/delete", variant: "secondary", action: "navigate" },
                  { default: () => "Delete" },
                ),
                h(
                  SubmitButton,
                  { as: "a", href: "/submit", variant: "neutral", action: "cancel" },
                  { default: () => "Submit" },
                ),
                h(
                  LinkButton,
                  { as: "button", href: "/dashboard", variant: "primary", action: "delete" },
                  { default: () => "Go to dashboard" },
                ),
                h(
                  ConfirmButton,
                  { as: "a", href: "/confirm", variant: "primary", action: "delete" },
                  { default: () => "Confirm" },
                ),
              ],
            })
        },
      }),
    )

    const destructiveButton = screen.getByRole("button", { name: /delete/i })
    expect(destructiveButton.tagName).toBe("BUTTON")
    expect(destructiveButton).not.toHaveAttribute("as")
    expect(destructiveButton).not.toHaveAttribute("variant")
    expect(destructiveButton).not.toHaveAttribute("action")
    expect(destructiveButton).toHaveAttribute("data-action", "delete")
    expect(destructiveButton).toHaveAttribute("data-variant", "danger")
    expect(destructiveButton).toHaveClass("mw-btn--danger")
    expect(destructiveButton).not.toHaveClass("mw-btn--error")

    const submitButton = screen.getByRole("button", { name: /submit/i })
    expect(submitButton.tagName).toBe("BUTTON")
    expect(submitButton).not.toHaveAttribute("as")
    expect(submitButton).toHaveAttribute("type", "submit")
    expect(submitButton).toHaveAttribute("data-action", "submit")
    expect(submitButton).toHaveAttribute("data-variant", "primary")

    const linkButton = screen.getByRole("link", { name: /go to dashboard/i })
    expect(linkButton.tagName).toBe("A")
    expect(linkButton).not.toHaveAttribute("as")
    expect(linkButton).not.toHaveAttribute("variant")
    expect(linkButton).not.toHaveAttribute("action")
    expect(linkButton).toHaveAttribute("href", "/dashboard")
    expect(linkButton).not.toHaveAttribute("role")
    expect(linkButton).toHaveAttribute("data-action", "navigate")
    expect(linkButton).toHaveAttribute("data-variant", "text")

    const confirmButton = screen.getByRole("button", { name: /confirm/i })
    expect(confirmButton.tagName).toBe("BUTTON")
    expect(confirmButton).not.toHaveAttribute("as")
    expect(confirmButton).toHaveAttribute("data-action", "button")
    expect(confirmButton).toHaveAttribute("data-variant", "success")
  })

  it("warns in development when forbidden props are supplied through attrs", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    renderWithProvider(CancelButton, { variant: "success", action: "create" }, "Cancel")
    renderWithProvider(
      LinkButton,
      { as: "button", href: "/dashboard", variant: "primary", action: "delete" },
      "Go to dashboard",
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
