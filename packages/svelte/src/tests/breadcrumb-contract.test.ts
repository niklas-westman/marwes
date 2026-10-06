/**
 * Svelte adapter: wires the shared Breadcrumb contract.
 */
import "@testing-library/jest-dom/vitest"
import { render } from "@testing-library/svelte"
import { runBreadcrumbContract } from "../../../../tests/contracts/breadcrumb.contract"
import Breadcrumb from "../lib/components/breadcrumb/Breadcrumb.svelte"
import WithProviderFixture from "./type-fixtures/WithProviderFixture.svelte"

runBreadcrumbContract("svelte", {
  renderBreadcrumbOptions(options) {
    render(WithProviderFixture, { props: { Component: Breadcrumb, props: { ...options } } })
  },
  getBreadcrumbRoot() {
    return document.querySelector('nav[data-component="breadcrumb"]') as HTMLElement
  },
})
