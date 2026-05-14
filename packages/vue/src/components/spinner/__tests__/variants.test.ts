/**
 * Vue spinner purpose variants — wires the shared spinner-variants contract.
 * Adapter-specific rendering concerns (if any) would be tested below the contract call.
 */
import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runSpinnerVariantsContract } from "../../../../../../tests/contracts/spinner-variants.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ButtonSpinner, EmptyStateSpinner } from "../variants"

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

runSpinnerVariantsContract("vue", {
  renderButtonSpinner() {
    renderWithProvider(ButtonSpinner, { ariaLabel: "Loading action", decorative: false })
  },
  renderEmptyStateSpinner() {
    renderWithProvider(EmptyStateSpinner, { ariaLabel: "Loading dashboard", decorative: false })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})
