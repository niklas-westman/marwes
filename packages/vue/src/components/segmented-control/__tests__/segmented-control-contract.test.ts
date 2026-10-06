/**
 * Vue adapter: wires the shared SegmentedControl contract.
 */
import type { SegmentedControlOptions } from "@marwes-ui/core"
import { render } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runSegmentedControlContract } from "../../../../../../tests/contracts/segmented-control.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { SegmentedControl } from "../segmented-control"

const switcherItems = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
]

function toVueProps({ value, ...rest }: SegmentedControlOptions) {
  return { ...rest, ...(value !== undefined ? { modelValue: value } : {}), items: switcherItems }
}

runSegmentedControlContract("vue", {
  renderSegmentedControlOptions(options) {
    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () => h(SegmentedControl as never, toVueProps(options)),
            })
        },
      }),
    )
  },
  renderSegmentedControlItems(items) {
    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () => h(SegmentedControl as never, { items: [...items] }),
            })
        },
      }),
    )
  },
  getSegmentedControlRoot() {
    return document.querySelector('[role="radiogroup"]') as HTMLElement
  },
})
