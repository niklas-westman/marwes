import { render } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runProgressBarContract } from "../../../../../../tests/contracts/progress-bar.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ProgressBar } from "../progress-bar"

function renderWithProvider(component: unknown, props: Record<string, unknown> = {}) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(component as never, props),
          })
      },
    }),
  )
}

runProgressBarContract("vue", {
  async renderProgressBar(args = {}) {
    renderWithProvider(ProgressBar, args)
  },
  getProgressBarElement() {
    return document.body.querySelector('[data-component="progress-bar"]') as HTMLElement
  },
})
