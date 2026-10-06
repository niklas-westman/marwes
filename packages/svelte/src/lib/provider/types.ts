import type {
  MarwesProviderOptions,
  MwTheme,
  ResolvedTheme,
  ThemeMode,
  ThemePreference,
} from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface MarwesProviderSnippetProps {
  mwTheme: MwTheme
}

export interface MarwesProviderProps extends MarwesProviderOptions {
  children?: Snippet<[MarwesProviderSnippetProps?]>
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
