import type { FontLoadingConfig } from "./font-loader"
import type { ThemeInput, ThemeMode, ThemePreference, ThemeVariableStrategy } from "./theme-types"

/** Element that receives the mode attribute. "provider" scopes it to the provider's own root. */
export type ThemeTarget = "provider" | "html" | "body"

/** How the active mode is written onto the target element. */
export type ThemeAttribute = "class" | "data-theme" | "data-mode"

/** Framework-independent provider options. Adapters add their own content prop. */
export interface MarwesProviderOptions {
  theme?: ThemeInput
  defaultPreference?: ThemePreference
  preference?: ThemePreference
  defaultMode?: ThemeMode
  mode?: ThemeMode
  fontLoading?: FontLoadingConfig
  onPreferenceChange?: (preference: ThemePreference) => void
  onModeChange?: (mode: ThemeMode) => void
  /** localStorage key for persisting the preference, or false to disable persistence. */
  storageKey?: string | false
  enableSystem?: boolean
  target?: ThemeTarget
  attribute?: ThemeAttribute
  disableTransitionOnChange?: boolean
  variableStrategy?: ThemeVariableStrategy
}
