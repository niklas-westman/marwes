import type {
  FontLoadingConfig,
  ResolvedTheme,
  ThemeInput,
  ThemeMode,
  ThemePreference,
  ThemeVariableStrategy,
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
  applyModeAttribute,
  getSystemThemeMode,
  readStoredThemePreference,
  subscribeToSystemThemeMode,
  withoutModeTransitions,
  writeStoredThemePreference,
} from "./theme-mode-runtime"
import type { ThemeAttribute, ThemeTarget } from "./theme-mode-runtime"

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
  target?: ThemeTarget
  attribute?: ThemeAttribute
  disableTransitionOnChange?: boolean
  variableStrategy?: ThemeVariableStrategy
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
    "target",
    "attribute",
    "disableTransitionOnChange",
    "variableStrategy",
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
    const target = computed<ThemeTarget>(() => props.target ?? "provider")
    const attribute = computed<ThemeAttribute>(() => props.attribute ?? "class")
    const disableTransitionOnChange = computed(() => props.disableTransitionOnChange === true)
    const variableStrategy = computed<ThemeVariableStrategy>(
      () => props.variableStrategy ?? "inline",
    )
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
      if (rootRef.value && variableStrategy.value === "inline") {
        applyThemeToElement(rootRef.value, resolved.value)
      }

      loadThemeFonts(resolved.value, props.fontLoading ?? "auto")
    }

    function syncTargetModeAttribute() {
      if (target.value === "provider") return

      const apply = () => {
        applyModeAttribute({
          target: target.value,
          providerElement: rootRef.value,
          mode: activeMode.value,
          attribute: attribute.value,
        })
      }

      if (disableTransitionOnChange.value) {
        withoutModeTransitions(apply)
        return
      }

      apply()
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
      syncTargetModeAttribute()
    })
    onUnmounted(() => {
      unsubscribeSystemThemeMode?.()
    })
    watch([resolved, variableStrategy], syncThemeToRuntime)
    watch([activeMode, target, attribute, disableTransitionOnChange], syncTargetModeAttribute)
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
          "data-marwes-mode": resolved.value.mode,
          style: variableStrategy.value === "inline" ? themeToRootStyle(resolved.value) : undefined,
        },
        slots.default?.(),
      )
  },
})
