/**
 * Test support: renders Vue UI on the server and hydrates it, for the shared hydration contracts.
 */
import { render } from "@testing-library/vue"
import { afterEach } from "vitest"
import { type Component, createSSRApp, defineComponent, h, nextTick, shallowRef } from "vue"
import { renderToString } from "vue/server-renderer"
import { captureConsoleIssues } from "../../../../tests/contracts/support/console-issues"
import { MarwesProvider } from "../provider/marwes-provider"

afterEach(() => {
  document.body.innerHTML = ""
})

function rootComponent(component: Component, getProps: () => Record<string, unknown>): Component {
  return defineComponent({
    setup() {
      return () =>
        h(MarwesProvider, null, { default: () => h(component as never, { ...getProps() }) })
    },
  })
}

async function hydrateFromServerMarkup(
  component: Component,
  props: Record<string, unknown>,
): Promise<string[]> {
  const root = rootComponent(component, () => props)
  const container = document.createElement("div")
  container.innerHTML = await renderToString(createSSRApp(root))
  document.body.append(container)

  const capture = captureConsoleIssues()
  createSSRApp(root).mount(container)
  await nextTick()

  return capture.stop()
}

// Vue consumers listen through v-model; the onValueChange prop is also fired by the component's
// own value-change event, so the idiomatic listener is what the contracts drive.
export function toValueModelProps({
  onValueChange,
  ...props
}: { onValueChange?: (value: string) => void } & object): Record<string, unknown> {
  return { ...props, ...(onValueChange ? { "onUpdate:modelValue": onValueChange } : {}) }
}

export function createUpdateHydrationHarness<Props extends object>(
  component: Component,
  toVueProps: (props: Props) => Record<string, unknown> = (props) =>
    ({ ...props }) as Record<string, unknown>,
) {
  const currentProps = shallowRef<Props | undefined>(undefined)

  return {
    render(props: Props) {
      currentProps.value = props
      render(rootComponent(component, () => toVueProps(currentProps.value as Props)))
    },
    async rerender(props: Props) {
      currentProps.value = props
      await nextTick()
    },
    hydrate: (props: Props) => hydrateFromServerMarkup(component, toVueProps(props)),
  }
}
