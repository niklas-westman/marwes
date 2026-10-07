/**
 * Vue adapter: MarwesProvider behavior shared contract harness — proves cross-adapter parity.
 */
import { render } from "@testing-library/vue"
import { type PropType, defineComponent, h, nextTick } from "vue"
import { runProviderBehaviorContract } from "../../../../../tests/contracts/provider-behavior.contract"
import type { ProviderBehaviorProps } from "../../../../../tests/contracts/provider-behavior.contract"
import { MarwesProvider } from "../marwes-provider"
import { useThemeMode } from "../use-theme-mode"

const ProviderStateConsumer = defineComponent({
  name: "ProviderStateConsumer",
  setup() {
    const { mode, preference, systemMode, isSystem, setPreference, setMode, toggleMode } =
      useThemeMode()

    return () => [
      h(
        "output",
        { "data-provider-state": "" },
        `${mode.value}:${preference.value}:${systemMode.value}:${isSystem.value ? "system" : "concrete"}`,
      ),
      h("button", {
        type: "button",
        "data-provider-action": "set-preference-system",
        onClick: () => setPreference("system"),
      }),
      h("button", {
        type: "button",
        "data-provider-action": "set-preference-dark",
        onClick: () => setPreference("dark"),
      }),
      h("button", {
        type: "button",
        "data-provider-action": "set-mode-dark",
        onClick: () => setMode("dark"),
      }),
      h("button", {
        type: "button",
        "data-provider-action": "toggle-mode",
        onClick: toggleMode,
      }),
    ]
  },
})

const ProviderRoot = defineComponent({
  name: "ProviderRoot",
  props: { providerProps: { type: Object as PropType<ProviderBehaviorProps>, required: true } },
  setup(props) {
    return () => h(MarwesProvider, props.providerProps, { default: () => h(ProviderStateConsumer) })
  },
})

let renderedProvider: ReturnType<typeof render> | undefined

runProviderBehaviorContract("vue", {
  async renderProvider(props) {
    renderedProvider = render(ProviderRoot, { props: { providerProps: props } })
    await nextTick()
  },
  async rerenderProvider(props) {
    await renderedProvider?.rerender({ providerProps: props })
    await nextTick()
  },
  unmountProvider() {
    renderedProvider?.unmount()
    renderedProvider = undefined
  },
  async applyChange(change) {
    change()
    await nextTick()
  },
})
