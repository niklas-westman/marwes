/**
 * Svelte adapter: Tests the Text component — wires the shared cross-adapter contract.
 */
import "@testing-library/jest-dom/vitest"
import { TextVariant } from "@marwes-ui/core"
import { render, screen } from "@testing-library/svelte"
import { expect, it } from "vitest"
import { runTextContract } from "../../../../tests/contracts/text.contract"
import {
  Text,
  type TextComponent,
  type TextProps,
  TypographyText,
} from "../lib/components/text/index.js"
import TextContractFixture from "./type-fixtures/TextContractFixture.svelte"

runTextContract("svelte", {
  async renderText(args) {
    render(TextContractFixture, { props: args })
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
