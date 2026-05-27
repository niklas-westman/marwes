import { TextVariant } from "@marwes-ui/core"
/**
 * Vue adapter: Tests the Text component — wires the shared cross-adapter contract.
 */
import { render, screen } from "@testing-library/vue"
import { expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { Text, type TextComponent, type TextProps, TypographyText } from ".."
import { runTextContract } from "../../../../../../tests/contracts/text.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(props: Record<string, unknown> = {}, text?: string) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(Text, props, {
                default: text ? () => text : undefined,
              }),
          })
      },
    }),
  )
}

runTextContract("vue", {
  async renderText(args) {
    const textProps = {
      ...(args.variant !== undefined ? { variant: args.variant } : {}),
      ...(args.as !== undefined ? { as: args.as } : {}),
      ...(args.id !== undefined ? { id: args.id } : {}),
    }

    renderWithProvider(textProps, args.text)
  },
  getByText(text) {
    return screen.getByText(text)
  },
})

it("exports safe Text component aliases without a plain Text type", () => {
  const Component: TextComponent = Text
  const props: TextProps = { variant: TextVariant.label }

  expect(Component).toBe(Text)
  expect(TypographyText).toBe(Text)
  expect(props.variant).toBe("label")
})
