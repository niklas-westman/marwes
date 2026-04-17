import type { ResolvedTheme, ThemeInput, ThemeMode } from "@marwes-ui/core"
import { resolveThemeInput } from "@marwes-ui/core"
import { computed, defineComponent, h, onMounted, provide, ref, watch } from "vue"
import { marwesContextKey } from "./marwes-context"
import { applyThemeToElement, loadThemeFonts } from "./runtime-theme"

export type MarwesProviderProps = {
  theme?: ThemeInput
  onModeChange?: (mode: ThemeMode) => void
}

export const MarwesProvider = defineComponent({
  name: "MarwesProvider",
  props: ["theme", "onModeChange"],
  setup(rawProps, { slots }) {
    const props = rawProps as unknown as MarwesProviderProps

    const resolved = computed<ResolvedTheme>(() => resolveThemeInput(props.theme ?? {}))

    const rootRef = ref<HTMLElement | null>(null)

    function syncThemeToRuntime() {
      if (rootRef.value) {
        applyThemeToElement(rootRef.value, resolved.value)
      }

      loadThemeFonts(resolved.value)
    }

    onMounted(syncThemeToRuntime)
    watch(resolved, syncThemeToRuntime)

    provide(marwesContextKey, {
      theme: resolved,
      onModeChange: props.onModeChange,
    })

    return () =>
      h(
        "div",
        {
          ref: rootRef,
          class: `mw-theme--${props.theme?.mode ?? "light"}`,
        },
        slots.default?.(),
      )
  },
})
