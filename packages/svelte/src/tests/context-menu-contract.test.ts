/**
 * Svelte adapter: wires the shared ContextMenu contract.
 */
import "@testing-library/jest-dom/vitest"
import { render } from "@testing-library/svelte"
import { runContextMenuContract } from "../../../../tests/contracts/context-menu.contract"
import ContextMenu from "../lib/components/context-menu/ContextMenu.svelte"
import WithProviderFixture from "./type-fixtures/WithProviderFixture.svelte"

runContextMenuContract("svelte", {
  renderContextMenuOptions(options) {
    render(WithProviderFixture, { props: { Component: ContextMenu, props: { ...options } } })
  },
  getContextMenuRoot() {
    return document.querySelector('[role="menu"]') as HTMLElement
  },
})
