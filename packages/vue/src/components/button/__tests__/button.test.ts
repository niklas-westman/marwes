import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { runButtonContract } from "../../../../../../tests/contracts/button.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Button } from "../button"
import { LinkButton, PrimaryButton } from "../variants"

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

runButtonContract("vue", {
  async renderPrimary(args = {}) {
    const props = {
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.onClick ? { onClick: args.onClick } : {}),
    }
    renderWithProvider(PrimaryButton, props, args.text ?? "Primary")
  },
  async renderLink(args) {
    const props = {
      href: args.href,
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.onClick ? { onClick: args.onClick } : {}),
    }
    renderWithProvider(LinkButton, props, args.text)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
})

describe("Vue adapter specifics: Button", () => {
  it("forwards arbitrary attrs to the rendered element", () => {
    renderWithProvider(PrimaryButton, { "data-testid": "primary-btn" }, "Save")
    expect(screen.getByTestId("primary-btn")).toBeInTheDocument()
  })

  it("merges class attr with recipe output", () => {
    renderWithProvider(Button, { as: "button", class: "custom-class" }, "Styled")
    const button = screen.getByRole("button", { name: /styled/i })
    expect(button).toHaveClass("custom-class")
    expect(button.className).toContain("mw-btn")
  })
})
