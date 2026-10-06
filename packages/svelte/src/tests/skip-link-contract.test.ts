/**
 * Svelte adapter: wires the shared SkipLink contract.
 */
import "@testing-library/jest-dom/vitest"
import { render } from "@testing-library/svelte"
import { runSkipLinkContract } from "../../../../tests/contracts/skip-link.contract"
import SkipLink from "../lib/components/skip-link/SkipLink.svelte"
import WithProviderFixture from "./type-fixtures/WithProviderFixture.svelte"

runSkipLinkContract("svelte", {
  renderSkipLinkOptions(options) {
    render(WithProviderFixture, {
      props: {
        Component: SkipLink,
        props: {
          ...options,
          ...(options.className !== undefined ? { class: options.className } : {}),
        },
      },
    })
  },
  getSkipLinkRoot() {
    return document.querySelector("a.mw-skip-link") as HTMLElement
  },
})
