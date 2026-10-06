/**
 * Vue adapter: wires the shared Breadcrumb contract.
 */
import { render } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runBreadcrumbContract } from "../../../../../../tests/contracts/breadcrumb.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Breadcrumb } from "../breadcrumb"

runBreadcrumbContract("vue", {
  renderBreadcrumbOptions(options) {
    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, { default: () => h(Breadcrumb as never, { ...options }) })
        },
      }),
    )
  },
  getBreadcrumbRoot() {
    return document.querySelector('nav[data-component="breadcrumb"]') as HTMLElement
  },
})
