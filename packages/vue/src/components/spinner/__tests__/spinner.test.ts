/**
 * Vue adapter: Tests the Spinner component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runSpinnerContract } from "../../../../../../tests/contracts/spinner.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Spinner } from "../spinner"

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

runSpinnerContract("vue", {
  async renderSpinner(args = {}) {
    renderWithProvider(Spinner, args)
  },
  getSpinnerElement() {
    return document.body.querySelector('[data-component="spinner"]') as HTMLElement
  },
  getByRole(role) {
    return screen.getByRole(role)
  },
})
