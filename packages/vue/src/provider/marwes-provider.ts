import type {
  FontLoadingConfig,
  ResolvedTheme,
  ThemeInput,
  ThemeMode,
  ThemePreference,
} from "@marwes-ui/core"
import {
  ThemeMode as MwThemeMode,
  nextThemeMode,
  resolveThemeInput,
  resolveThemePreference,
} from "@marwes-ui/core"
import { computed, defineComponent, h, onMounted, onUnmounted, provide, ref, watch } from "vue"
import { marwesContextKey } from "./marwes-context"
import { applyThemeToElement, loadThemeFonts, themeToRootStyle } from "./runtime-theme"
import {
  getSystemThemeMode,
  readStoredThemePreference,
  subscribeToSystemThemeMode,
  writeStoredThemePreference,
} from "./theme-mode-runtime"

export type MarwesProviderProps = {
  theme?: ThemeInput
  defaultPreference?: ThemePreference
  preference?: ThemePreference
  defaultMode?: ThemeMode
  mode?: ThemeMode
  fontLoading?: FontLoadingConfig
  onPreferenceChange?: (preference: ThemePreference) => void
  onModeChange?: (mode: ThemeMode) => void
  storageKey?: string | false
  enableSystem?: boolean
}

export const MarwesProvider = defineComponent({
  name: "MarwesProvider",
  props: [
    "theme",
    "defaultPreference",
    "preference",
    "defaultMode",
    "mode",
    "fontLoading",
    "onPreferenceChange",
    "onModeChange",
    "storageKey",
    "enableSystem",
  ],
  setup(rawProps, { slots }) {
    const props = rawProps as unknown as MarwesProviderProps

    const internalPreference = ref<ThemePreference>(
      props.defaultPreference ?? props.defaultMode ?? MwThemeMode.light,
    )
    const systemMode = ref<ThemeMode>(
      props.enableSystem === false ? MwThemeMode.light : getSystemThemeMode(),
    )
    const enableSystem = computed(() => props.enableSystem !== false)
    const storageKey = computed(() => props.storageKey ?? false)
    const isPreferenceControlled = computed(
      () =>
        props.preference !== undefined ||
        props.mode !== undefined ||
        props.theme?.mode !== undefined,
    )
    const activePreference = computed<ThemePreference>(
      () => props.preference ?? props.mode ?? props.theme?.mode ?? internalPreference.value,
    )
    const activeMode = computed<ThemeMode>(() =>
      resolveThemePreference(activePreference.value, systemMode.value),
    )
    const resolved = computed<ResolvedTheme>(() =>
      resolveThemeInput({ ...(props.theme ?? {}), mode: activeMode.value }),
    )

    const rootRef = ref<HTMLElement | null>(null)

    function setPreference(nextPreference: ThemePreference) {
      if (!isPreferenceControlled.value) {
        internalPreference.value = nextPreference
      }

      writeStoredThemePreference(storageKey.value, nextPreference)
      props.onPreferenceChange?.(nextPreference)
    }

    function setMode(nextMode: ThemeMode) {
      setPreference(nextMode)
      props.onModeChange?.(nextMode)
    }

    function toggleMode() {
      setMode(nextThemeMode(activeMode.value))
    }

    function syncThemeToRuntime() {
      if (rootRef.value) {
        applyThemeToElement(rootRef.value, resolved.value)
      }

      loadThemeFonts(resolved.value, props.fontLoading ?? "auto")
    }

    let unsubscribeSystemThemeMode: (() => void) | undefined

    function syncSystemThemeSubscription() {
      unsubscribeSystemThemeMode?.()
      unsubscribeSystemThemeMode = undefined

      if (!enableSystem.value) {
        systemMode.value = MwThemeMode.light
        return
      }

      systemMode.value = getSystemThemeMode()

      if (activePreference.value === "system") {
        unsubscribeSystemThemeMode = subscribeToSystemThemeMode((nextMode) => {
          systemMode.value = nextMode
        })
      }
    }

    onMounted(() => {
      const storedPreference = readStoredThemePreference(storageKey.value)
      if (storedPreference !== undefined && !isPreferenceControlled.value) {
        internalPreference.value = storedPreference
      }

      syncSystemThemeSubscription()
      syncThemeToRuntime()
    })
    onUnmounted(() => {
      unsubscribeSystemThemeMode?.()
    })
    watch(resolved, syncThemeToRuntime)
    watch([activePreference, enableSystem], syncSystemThemeSubscription)

    provide(marwesContextKey, {
      theme: resolved,
      mode: activeMode,
      preference: activePreference,
      systemMode: computed(() => systemMode.value),
      setMode,
      setPreference,
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
