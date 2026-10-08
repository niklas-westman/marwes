/**
 * Svelte adapter: sanity checks for the server-render + hydrate harness itself, so a harness
 * regression (for example server and client compiling differently) is distinguishable from a
 * component regression in the shared hydration contracts.
 */
import "@testing-library/jest-dom/vitest"
import { afterEach, describe, expect, it } from "vitest"
import { hydrateFromServerMarkup, unmountHydratedApps } from "./support/hydrate-from-server"
import ProviderHost from "./type-fixtures/ProviderHost.svelte"
import SnippetChildrenHost from "./type-fixtures/SnippetChildrenHost.svelte"

afterEach(async () => {
  await unmountHydratedApps()
  document.body.innerHTML = ""
})

describe("Svelte hydration harness", () => {
  it("hydrates a component that renders snippet children", async () => {
    const issues = await hydrateFromServerMarkup({
      componentPath: "/src/tests/type-fixtures/SnippetChildrenHost.svelte",
      component: SnippetChildrenHost as never,
      serverProps: {},
      clientProps: {},
    })

    expect(issues).toEqual([])
    expect(document.querySelector(".snippet-children p")).toHaveTextContent("hello")
  })

  it("hydrates MarwesProvider around a child without mismatches", async () => {
    const issues = await hydrateFromServerMarkup({
      componentPath: "/src/tests/type-fixtures/ProviderHost.svelte",
      component: ProviderHost as never,
      serverProps: {},
      clientProps: {},
    })

    expect(issues).toEqual([])
    expect(document.querySelector("[data-marwes-theme] p")).toHaveTextContent("inside provider")
  })
})
