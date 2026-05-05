import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runSkeletonContract } from "../../../../../../tests/contracts/skeleton.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Skeleton } from "../skeleton"

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

runSkeletonContract("vue", {
  async renderSkeleton(args = {}) {
    renderWithProvider(Skeleton, args)
  },
  getSkeletonElement() {
    return document.body.querySelector('[data-component="skeleton"]') as HTMLElement
  },
  getByRole(role) {
    return screen.getByRole(role)
  },
})
