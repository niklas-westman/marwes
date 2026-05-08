import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import Badge from "../lib/components/badge/Badge.svelte"
import Card from "../lib/components/card/Card.svelte"
import Divider from "../lib/components/divider/Divider.svelte"
import Skeleton from "../lib/components/skeleton/Skeleton.svelte"
import Spacing from "../lib/components/spacing/Spacing.svelte"

describe("Badge", () => {
  it("includes mw-badge class", () => {
    const { container } = render(Badge, { props: { variant: "info" } })
    const badge = container.querySelector("span")
    expect(badge?.className).toContain("mw-badge")
  })

  it("sets data-component attribute", () => {
    const { container } = render(Badge, { props: { variant: "neutral" } })
    const badge = container.querySelector('[data-component="badge"]')
    expect(badge).not.toBeNull()
  })
})

describe("Card", () => {
  it("includes mw-card class", () => {
    const { container } = render(Card)
    const card = container.querySelector("div")
    expect(card?.className).toContain("mw-card")
  })

  it("renders header when title is provided", () => {
    const { container } = render(Card, { props: { title: "Card title" } })
    const header = container.querySelector(".mw-card__header")
    expect(header).not.toBeNull()
    const title = container.querySelector(".mw-card__title")
    expect(title?.textContent).toBe("Card title")
  })

  it("renders body section", () => {
    const { container } = render(Card)
    const body = container.querySelector(".mw-card__body")
    expect(body).not.toBeNull()
  })
})

describe("Divider", () => {
  it("renders an hr element", () => {
    const { container } = render(Divider)
    const hr = container.querySelector("hr")
    expect(hr).not.toBeNull()
  })

  it("includes mw-divider class", () => {
    const { container } = render(Divider)
    const hr = container.querySelector("hr")
    expect(hr?.className).toContain("mw-divider")
  })
})

describe("Spacing", () => {
  it("renders a decorative div", () => {
    const { container } = render(Spacing)
    const div = container.querySelector("div")
    expect(div).not.toBeNull()
  })

  it("sets aria-hidden", () => {
    const { container } = render(Spacing)
    const div = container.querySelector("div")
    expect(div?.getAttribute("aria-hidden")).toBe("true")
  })

  it("includes mw-spacing class", () => {
    const { container } = render(Spacing)
    const div = container.querySelector("div")
    expect(div?.className).toContain("mw-spacing")
  })
})

describe("Skeleton", () => {
  it("renders a span element", () => {
    const { container } = render(Skeleton)
    const span = container.querySelector("span")
    expect(span).not.toBeNull()
  })

  it("includes mw-skeleton class", () => {
    const { container } = render(Skeleton)
    const span = container.querySelector("span")
    expect(span?.className).toContain("mw-skeleton")
  })

  it("sets data-component attribute", () => {
    const { container } = render(Skeleton)
    const el = container.querySelector('[data-component="skeleton"]')
    expect(el).not.toBeNull()
  })
})
