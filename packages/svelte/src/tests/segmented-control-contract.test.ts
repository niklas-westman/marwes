/**
 * Svelte adapter: wires the shared SegmentedControl contract.
 */
import "@testing-library/jest-dom/vitest"
import { render } from "@testing-library/svelte"
import { createRawSnippet } from "svelte"
import { runSegmentedControlContract } from "../../../../tests/contracts/segmented-control.contract"
import SegmentedControl from "../lib/components/segmented-control/SegmentedControl.svelte"
import WithProviderFixture from "./type-fixtures/WithProviderFixture.svelte"

runSegmentedControlContract("svelte", {
  renderSegmentedControlOptions(options) {
    render(WithProviderFixture, {
      props: {
        Component: SegmentedControl,
        props: {
          ...options,
          items: [
            { value: "a", label: "Alpha" },
            { value: "b", label: "Beta" },
          ],
        },
      },
    })
  },
  renderSegmentedControlIconOnlyItem() {
    const icon = createRawSnippet(() => ({
      render: () => '<svg aria-hidden="true" width="24" height="24"></svg>',
    }))
    render(WithProviderFixture, {
      props: {
        Component: SegmentedControl,
        props: { items: [{ value: "a", icon, ariaLabel: "Search" }] },
      },
    })
  },
  renderSegmentedControlItems(items) {
    render(WithProviderFixture, {
      props: { Component: SegmentedControl, props: { items: [...items] } },
    })
  },
  getSegmentedControlRoot() {
    return document.querySelector('[role="radiogroup"]') as HTMLElement
  },
})
