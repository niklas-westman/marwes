import { IconName, createIconRecipe } from "@marwes-ui/core"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  ConfirmButton,
  DestructiveButton,
  DownloadButton,
  EditButton,
  RefreshButton,
  SearchButton,
  SuccessButton,
  UploadButton,
  VerifyButton,
} from ".."

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

describe("React purpose icon source selections", () => {
  it.each(selections)("renders canonical icon for %s", (Component, expected, side) => {
    const { container } = render(<Component>Action</Component>)
    assertIcon(container.querySelector("button"), expected, side)
  })
  it.each(selections)("honors caller icons for %s without adding a default", (Component) => {
    const left = render(<Component iconLeft={IconName.ArrowLeft}>Action</Component>)
    assertIcon(left.container.querySelector("button"), IconName.ArrowLeft, "left")
    left.unmount()
    const right = render(<Component iconRight={IconName.ArrowRight}>Action</Component>)
    assertIcon(right.container.querySelector("button"), IconName.ArrowRight, "right")
  })
  it.each(selections)("suppresses canonical purpose icons while %s is loading", (Component) => {
    const { container } = render(<Component loading>Action</Component>)
    expect(container.querySelectorAll("svg.mw-icon")).toHaveLength(0)
    const button = container.querySelector("button")
    expect(button).not.toBeNull()
    expect(button?.getAttribute("aria-busy")).toBe("true")
  })
})
