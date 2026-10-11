/**
 * React adapter: Tests the Stack family — wires the shared cross-adapter contract
 * and verifies React-only ref forwarding to the polymorphic element.
 */
import { render } from "@testing-library/react"
import * as React from "react"
import { expect, it } from "vitest"
import { runStackContract } from "../../../../../../tests/contracts/stack.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Stack } from "../stack"
import { StackItem } from "../stack-item"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

function toReactStyle(style: Record<string, string> | undefined): React.CSSProperties | undefined {
  if (!style) return undefined

  return Object.fromEntries(
    Object.entries(style).map(([property, value]) => [
      property.startsWith("--")
        ? property
        : property.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase()),
      value,
    ]),
  ) as React.CSSProperties
}

runStackContract("react", {
  renderStack({ options = {}, attributes = {}, style, children }) {
    const styleProps = style ? { style: toReactStyle(style) } : {}
    renderWithProvider(
      <Stack {...options} {...attributes} {...styleProps}>
        {children}
      </Stack>,
    )
  },
  renderStackItem({ options = {}, attributes = {} }) {
    renderWithProvider(<StackItem {...options} {...attributes} />)
  },
  renderList() {
    renderWithProvider(
      <Stack as="ul">
        <StackItem as="li">First</StackItem>
        <StackItem as="li">Second</StackItem>
      </Stack>,
    )
  },
  renderNested(sizing) {
    renderWithProvider(
      <Stack direction="row">
        <Stack {...sizing}>Nested</Stack>
        <StackItem>Item</StackItem>
      </Stack>,
    )
  },
  getStack() {
    return document.querySelector('[data-component="stack"]') as HTMLElement
  },
  getStackItem() {
    return document.querySelector('[data-component="stack-item"]') as HTMLElement
  },
})

it("forwards refs to the polymorphic Stack and StackItem elements", () => {
  const stackRef = React.createRef<HTMLElement>()
  const itemRef = React.createRef<HTMLElement>()

  renderWithProvider(
    <Stack as="ul" ref={stackRef}>
      <StackItem as="li" ref={itemRef}>
        First
      </StackItem>
    </Stack>,
  )

  expect(stackRef.current?.tagName).toBe("UL")
  expect(itemRef.current?.tagName).toBe("LI")
})
