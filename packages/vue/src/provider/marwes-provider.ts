import type { FontLoadingConfig, ResolvedTheme, ThemeInput, ThemeMode } from "@marwes-ui/core"
import { ThemeMode as MwThemeMode, resolveThemeInput } from "@marwes-ui/core"
import { computed, defineComponent, h, onMounted, provide, ref, watch } from "vue"
import { marwesContextKey } from "./marwes-context"
import { applyThemeToElement, loadThemeFonts, themeToRootStyle } from "./runtime-theme"

export type MarwesProviderProps = {
  theme?: ThemeInput
  defaultMode?: ThemeMode
  mode?: ThemeMode
  fontLoading?: FontLoadingConfig
  onModeChange?: (mode: ThemeMode) => void
}

export const MarwesProvider = defineComponent({
  name: "MarwesProvider",
  props: ["theme", "defaultMode", "mode", "fontLoading", "onModeChange"],
  setup(rawProps, { slots }) {
    const props = rawProps as unknown as MarwesProviderProps

    const internalMode = ref<ThemeMode>(props.defaultMode ?? MwThemeMode.light)
    const activeMode = computed<ThemeMode>(
      () => props.mode ?? props.theme?.mode ?? internalMode.value,
    )
    const isModeControlled = computed(
      () => props.mode !== undefined || props.theme?.mode !== undefined,
    )
    const resolved = computed<ResolvedTheme>(() =>
      resolveThemeInput({ ...(props.theme ?? {}), mode: activeMode.value }),
    )

    const rootRef = ref<HTMLElement | null>(null)

    function setMode(nextMode: ThemeMode) {
      if (!isModeControlled.value) {
        internalMode.value = nextMode
      }

      props.onModeChange?.(nextMode)
    }

    function toggleMode() {
      setMode(activeMode.value === MwThemeMode.dark ? MwThemeMode.light : MwThemeMode.dark)
    }

    function syncThemeToRuntime() {
      if (rootRef.value) {
        applyThemeToElement(rootRef.value, resolved.value)
      }

      loadThemeFonts(resolved.value, props.fontLoading ?? "auto")
    }

    onMounted(syncThemeToRuntime)
    watch(resolved, syncThemeToRuntime)

    provide(marwesContextKey, {
      theme: resolved,
      mode: activeMode,
      setMode,
      toggleMode,
    })

    return () =>
      h(
        "div",
        {
          ref: rootRef,
          class: `mw-theme--${resolved.value.mode}`,
          "data-marwes-theme": "true",
          style: themeToRootStyle(resolved.value),
        },
        slots.default?.(),
      )
  },
})
