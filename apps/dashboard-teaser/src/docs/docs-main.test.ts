// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest"

describe("component catalog enhancement", () => {
  afterEach(() => {
    document.body.innerHTML = ""
    vi.resetModules()
  })

  it("filters by a human-readable public export name and announces the count", async () => {
    document.body.innerHTML = `
      <input data-component-search />
      <p data-component-count>2 component families</p>
      <article data-component-card data-search="input emailfield email field"></article>
      <article data-component-card data-search="pagination paginationfield pagination field"></article>
      <p data-component-empty hidden>No matches</p>
    `
    await import("./docs-main")

    const input = document.querySelector<HTMLInputElement>("[data-component-search]")
    if (!input) throw new Error("Missing search input")
    input.value = "email field"
    input.dispatchEvent(new Event("input"))

    const cards = [...document.querySelectorAll<HTMLElement>("[data-component-card]")]
    expect(cards[0]?.hidden).toBe(false)
    expect(cards[1]?.hidden).toBe(true)
    expect(document.querySelector("[data-component-count]")?.textContent).toBe("1 component family")
    expect(document.querySelector<HTMLElement>("[data-component-empty]")?.hidden).toBe(true)
  })
})
