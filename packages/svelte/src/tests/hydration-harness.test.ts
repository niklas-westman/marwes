/**
 * Svelte adapter: sanity checks for the server-render + hydrate harness itself, so a harness
 * regression (for example server and client compiling differently) is distinguishable from a
 * component regression in the shared hydration contracts.
 */
import "@testing-library/jest-dom/vitest"
import { afterEach, describe, expect, it } from "vitest"
import { hydrateFromServerMarkup, unmountHydratedApps } from "./support/hydrate-from-server"
import {
  type SvelteComponent,
  createUpdateHydrationHarness,
} from "./support/update-hydration-harness"
import OptionalNote from "./type-fixtures/OptionalNote.svelte"
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

  it("clears a prop that is dropped between renders", async () => {
    const harness = createUpdateHydrationHarness<{ note?: string }>({
      component: OptionalNote as SvelteComponent,
      componentPath: "/src/tests/type-fixtures/OptionalNote.svelte",
      toSvelteProps: (props) => ({ ...props }),
    })

    await harness.render({ note: "first" })
    expect(document.querySelector("[data-note]")).toHaveTextContent("first")

    // Svelte's own rerender() keeps props that are omitted; the harness must treat the new props
    // object as the complete set so contracts can model an error or helper going away.
    await harness.rerender({})
    expect(document.querySelector("[data-note]")).toBeNull()

    await harness.rerender({ note: "back" })
    expect(document.querySelector("[data-note]")).toHaveTextContent("back")
  })
})
