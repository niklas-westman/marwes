import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import TypographyFixture from "./type-fixtures/TypographyFixture.svelte"

describe("H1", () => {
  it("renders an h1 element", () => {
    const { container } = render(TypographyFixture, { props: { component: "h1" } })
    expect(container.querySelector("h1")).not.toBeNull()
  })

  it("includes mw-heading class", () => {
    const { container } = render(TypographyFixture, { props: { component: "h1" } })
    expect(container.querySelector("h1")?.className).toContain("mw-heading")
  })
})

describe("H2", () => {
  it("renders an h2 element", () => {
    const { container } = render(TypographyFixture, { props: { component: "h2" } })
    expect(container.querySelector("h2")).not.toBeNull()
  })

  it("includes mw-heading class", () => {
    const { container } = render(TypographyFixture, { props: { component: "h2" } })
    expect(container.querySelector("h2")?.className).toContain("mw-heading")
  })
})

describe("H3", () => {
  it("renders an h3 element", () => {
    const { container } = render(TypographyFixture, { props: { component: "h3" } })
    expect(container.querySelector("h3")).not.toBeNull()
  })

  it("includes mw-heading class", () => {
    const { container } = render(TypographyFixture, { props: { component: "h3" } })
    expect(container.querySelector("h3")?.className).toContain("mw-heading")
  })
})

describe("Paragraph", () => {
  it("renders a p element", () => {
    const { container } = render(TypographyFixture, { props: { component: "p" } })
    expect(container.querySelector("p")).not.toBeNull()
  })

  it("includes mw-p class", () => {
    const { container } = render(TypographyFixture, { props: { component: "p" } })
    expect(container.querySelector("p")?.className).toContain("mw-p")
  })

  it("applies size modifier class", () => {
    const { container } = render(TypographyFixture, { props: { component: "p", size: "sm" } })
    expect(container.querySelector("p")?.className).toContain("mw-p--sm")
  })
})
