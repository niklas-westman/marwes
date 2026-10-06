/**
 * Vue adapter: wires the shared SkipLink contract.
 */
import { render } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runSkipLinkContract } from "../../../../../../tests/contracts/skip-link.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { SkipLink } from "../skip-link"

runSkipLinkContract("vue", {
  renderSkipLinkOptions(options) {
    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () =>
                h(SkipLink as never, { ...options }, { default: () => "Skip to content" }),
            })
        },
      }),
    )
  },
  getSkipLinkRoot() {
    return document.querySelector("a.mw-skip-link") as HTMLElement
  },
})
