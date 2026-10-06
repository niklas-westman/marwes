// @vitest-environment node
/**
 * Svelte adapter: initial selection must be present in server-rendered markup,
 * not only after client-side effects run.
 */
import { createRawSnippet } from "svelte"
import { render } from "svelte/server"
import { describe, expect, it } from "vitest"
import Pagination from "../lib/components/pagination/Pagination.svelte"
import SegmentedControl from "../lib/components/segmented-control/SegmentedControl.svelte"
import TabGroup from "../lib/components/tab/TabGroup.svelte"
import WithProviderFixture from "./type-fixtures/WithProviderFixture.svelte"

const panel = createRawSnippet(() => ({ render: () => "<p>Panel</p>" }))

function renderOnServer(Component: unknown, props: Record<string, unknown>): string {
  return render(WithProviderFixture as never, { props: { Component, props } }).body
}

describe("server-rendered initial selection", () => {
  it("TabGroup marks the default tab as selected", () => {
    const html = renderOnServer(TabGroup, {
      tabs: [
        { value: "one", label: "One", panel },
        { value: "two", label: "Two", panel },
      ],
      defaultActiveTab: "two",
    })

    expect(html.match(/aria-selected="true"/g)).toHaveLength(1)
    expect(html.indexOf('aria-selected="false"')).toBeLessThan(html.indexOf('aria-selected="true"'))
  })

  it("TabGroup selects the first enabled tab when no default is given", () => {
    const html = renderOnServer(TabGroup, {
      tabs: [
        { value: "one", label: "One", panel },
        { value: "two", label: "Two", panel },
      ],
    })

    expect(html).toContain('aria-selected="true"')
  })

  it("SegmentedControl checks the default item", () => {
    const html = renderOnServer(SegmentedControl, {
      items: [
        { value: "a", label: "Alpha" },
        { value: "b", label: "Beta" },
      ],
      defaultValue: "b",
    })

    expect(html).toContain('aria-checked="true"')
  })

  it("Pagination marks the default page as current", () => {
    const html = renderOnServer(Pagination, { pageCount: 10, defaultPage: 4, adaptive: false })

    expect(html).toMatch(/aria-current="page"[^>]*>\s*4\s*</)
  })
})
