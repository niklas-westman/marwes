/**
 * Svelte adapter: wires the shared Pagination contract.
 */
import "@testing-library/jest-dom/vitest"
import { render } from "@testing-library/svelte"
import { runPaginationContract } from "../../../../tests/contracts/pagination.contract"
import Pagination from "../lib/components/pagination/Pagination.svelte"
import WithProviderFixture from "./type-fixtures/WithProviderFixture.svelte"

runPaginationContract("svelte", {
  renderPaginationOptions(options) {
    render(WithProviderFixture, {
      props: { Component: Pagination, props: { ...options, adaptive: false } },
    })
  },
  getPaginationRoot() {
    return document.querySelector('nav[data-component="pagination"]') as HTMLElement
  },
})
