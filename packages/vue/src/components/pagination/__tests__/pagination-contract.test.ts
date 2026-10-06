/**
 * Vue adapter: wires the shared Pagination contract.
 */
import type { PaginationOptions } from "@marwes-ui/core"
import { render } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runPaginationContract } from "../../../../../../tests/contracts/pagination.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Pagination } from "../pagination"

function toVueProps({ page, ...rest }: PaginationOptions) {
  return { ...rest, adaptive: false, ...(page !== undefined ? { modelValue: page } : {}) }
}

runPaginationContract("vue", {
  renderPaginationOptions(options) {
    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, { default: () => h(Pagination as never, toVueProps(options)) })
        },
      }),
    )
  },
  getPaginationRoot() {
    return document.querySelector('nav[data-component="pagination"]') as HTMLElement
  },
})
