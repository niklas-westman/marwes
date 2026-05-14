import type {
  FontLoadingConfig,
  ResolvedTheme,
  ThemeInput,
  ThemeMode,
  ThemePreference,
  ThemeVariableStrategy,
} from "@marwes-ui/core"
import type { Snippet } from "svelte"
import type { ThemeAttribute, ThemeTarget } from "./theme-mode-runtime.js"

export interface MarwesProviderProps {
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
  children?: Snippet
}

export interface MarwesContextState {
  theme: ResolvedTheme
  mode: ThemeMode
  preference: ThemePreference
  systemMode: ThemeMode
}

export interface MarwesContextValue {
  readonly state: MarwesContextState
  setMode: (mode: ThemeMode) => void
  setPreference: (preference: ThemePreference) => void
  toggleMode: () => void
}
