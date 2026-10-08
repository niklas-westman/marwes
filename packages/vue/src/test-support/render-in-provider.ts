import { render } from "@testing-library/vue"
import { type Component, defineComponent, h } from "vue"
import { MarwesProvider } from "../provider/marwes-provider"

export function renderInProvider(component: Component, props: Record<string, unknown>): void {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(component as never, props) })
      },
    }),
  )
}
