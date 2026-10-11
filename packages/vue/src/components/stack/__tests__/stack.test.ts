/**
 * Vue adapter: Tests the Stack family — wires the shared cross-adapter contract
 * and verifies that a string consumer style cannot override the token-backed vars.
 */
import { render } from "@testing-library/vue"
import { expect, it } from "vitest"
import { defineComponent, h } from "vue"
import type { VNodeChild } from "vue"
import { runStackContract } from "../../../../../../tests/contracts/stack.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Stack } from "../stack"
import { StackItem } from "../stack-item"

function renderWithProvider(renderTree: () => VNodeChild) {
  return render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: renderTree })
      },
    }),
  )
}

runStackContract("vue", {
  renderStack({ options = {}, attributes = {}, style, children }) {
    renderWithProvider(() =>
      h(
        Stack as never,
        { ...options, ...attributes, ...(style ? { style } : {}) },
        children !== undefined ? { default: () => children } : undefined,
      ),
    )
  },
  renderStackItem({ options = {}, attributes = {} }) {
    renderWithProvider(() => h(StackItem as never, { ...options, ...attributes }))
  },
  renderList() {
    renderWithProvider(() =>
      h(
        Stack as never,
        { as: "ul" },
        {
          default: () => [
            h(StackItem as never, { as: "li" }, { default: () => "First" }),
            h(StackItem as never, { as: "li" }, { default: () => "Second" }),
          ],
        },
      ),
    )
  },
  renderNested(sizing) {
    renderWithProvider(() =>
      h(
        Stack as never,
        { direction: "row" },
        {
          default: () => [
            h(Stack as never, { ...sizing }, { default: () => "Nested" }),
            h(StackItem as never, null, { default: () => "Item" }),
          ],
        },
      ),
    )
  },
  getStack() {
    return document.querySelector('[data-component="stack"]') as HTMLElement
  },
  getStackItem() {
    return document.querySelector('[data-component="stack-item"]') as HTMLElement
  },
})

it("keeps the token-backed var when the consumer style is a string", () => {
  renderWithProvider(() =>
    h(Stack as never, { gap: "sp-16", style: "color:red;--mw-stack-row-gap:3px" }),
  )

  const stack = document.querySelector('[data-component="stack"]') as HTMLElement
  expect(stack.style.color).toBe("red")
  expect(stack.style.getPropertyValue("--mw-stack-row-gap")).toBe("var(--mw-spacing-sp-16)")
})
