import { TextVariant } from "@marwes-ui/core"
/**
 * React adapter: Tests the Text component — wires the shared cross-adapter contract.
 */
import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { expect, it } from "vitest"
import { Text, type TextComponent, type TextProps, TypographyText } from ".."
import { runTextContract } from "../../../../../../tests/contracts/text.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runTextContract("react", {
  async renderText(args) {
    const textProps = {
      ...(args.variant !== undefined ? { variant: args.variant } : {}),
      ...(args.as !== undefined ? { as: args.as } : {}),
      ...(args.id !== undefined ? { id: args.id } : {}),
    }

    renderWithProvider(<Text {...textProps}>{args.text}</Text>)
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
