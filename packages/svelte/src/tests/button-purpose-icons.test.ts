import { IconName, createIconRecipe } from "@marwes-ui/core"
import { render } from "@testing-library/svelte"
import { createRawSnippet } from "svelte"
import { describe, expect, it } from "vitest"
import ConfirmButton from "../lib/components/button/ConfirmButton.svelte"
import DestructiveButton from "../lib/components/button/DestructiveButton.svelte"
import DownloadButton from "../lib/components/button/DownloadButton.svelte"
import EditButton from "../lib/components/button/EditButton.svelte"
import RefreshButton from "../lib/components/button/RefreshButton.svelte"
import SearchButton from "../lib/components/button/SearchButton.svelte"
import SuccessButton from "../lib/components/button/SuccessButton.svelte"
import UploadButton from "../lib/components/button/UploadButton.svelte"
import VerifyButton from "../lib/components/button/VerifyButton.svelte"

function assertIcon(button: Element | null, expected: IconName, side: "left" | "right") {
  if (!button) throw new Error("Expected a rendered button")
  const icons = button.querySelectorAll("svg.mw-icon")
  expect(icons).toHaveLength(1)
  const svg = icons[0]
  if (!svg) throw new Error("Expected the canonical purpose icon")
  const nodes = createIconRecipe({ name: expected, strokeWidth: "sm" }).svg.nodes
  expect(svg.children).toHaveLength(nodes.length)
  for (const [index, node] of nodes.entries()) {
    const child = svg.children[index]
    if (!child) throw new Error(`Expected icon child at index ${index}`)
    expect(child.tagName.toLowerCase()).toBe(node.tag)
    for (const [key, value] of Object.entries(node.attrs)) {
      expect(child.getAttribute(key)).toBe(String(value))
    }
  }
  expect(svg.getAttribute("aria-hidden")).toBe("true")
  expect(button.getAttribute("data-has-affordance")).toBe("true")
  const children = [...button.children]
  expect(
    children.indexOf(svg) <
      children.findIndex((child) => child.classList.contains("mw-btn__label")),
  ).toBe(side === "left")
}

const children = createRawSnippet(() => ({ render: () => "<span>Action</span>" }))
const selections = [
  [ConfirmButton, IconName.Check, "right"],
  [SuccessButton, IconName.Check, "right"],
  [DestructiveButton, IconName.X, "right"],
  [VerifyButton, IconName.CheckCircle, "left"],
  [EditButton, IconName.Edit, "left"],
  [UploadButton, IconName.Upload, "left"],
  [DownloadButton, IconName.Download, "left"],
  [SearchButton, IconName.Search, "left"],
  [RefreshButton, IconName.RefreshCw, "left"],
] as const

describe("Svelte purpose icon source selections", () => {
  it.each(selections)("renders canonical icon for %s", (Component, expected, side) => {
    const { container } = render(Component, { props: { children } })
    assertIcon(container.querySelector("button"), expected, side)
  })
  it.each(selections)("honors caller icons for %s without adding a default", (Component) => {
    const left = render(Component, { props: { children, iconLeft: IconName.ArrowLeft } })
    assertIcon(left.container.querySelector("button"), IconName.ArrowLeft, "left")
    left.unmount()
    const right = render(Component, { props: { children, iconRight: IconName.ArrowRight } })
    assertIcon(right.container.querySelector("button"), IconName.ArrowRight, "right")
  })
  it.each(selections)("suppresses canonical purpose icons while %s is loading", (Component) => {
    const { container } = render(Component, { props: { children, loading: true } })
    expect(container.querySelectorAll("svg.mw-icon")).toHaveLength(0)
    expect(container.querySelector("button")?.getAttribute("aria-busy")).toBe("true")
  })
})
