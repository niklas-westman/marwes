/**
 * Vue adapter: wires the shared ContextMenu contract.
 */
import { render } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runContextMenuContract } from "../../../../../../tests/contracts/context-menu.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ContextMenu } from "../context-menu"

runContextMenuContract("vue", {
  renderContextMenuOptions(options) {
    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, { default: () => h(ContextMenu as never, { ...options }) })
        },
      }),
    )
  },
  getContextMenuRoot() {
    return document.querySelector('[role="menu"]') as HTMLElement
  },
})
