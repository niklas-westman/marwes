import type { ResolvedTheme, ThemeInput, ThemeMode } from "@marwes-ui/core"
import {
  applyTheme,
  extractFontFamilyName,
  extractUsedWeights,
  isSystemFont,
  loadGoogleFont,
  resolveThemeInput,
} from "@marwes-ui/core"
import * as React from "react"
import { MarwesContext } from "./marwes-context"

export type MarwesProviderProps = {
  theme?: ThemeInput
  onModeChange?: (mode: ThemeMode) => void
  children: React.ReactNode
}

export function MarwesProvider({ theme, onModeChange, children }: MarwesProviderProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)

  const resolved: ResolvedTheme = React.useMemo(() => resolveThemeInput(theme ?? {}), [theme])

  React.useEffect(() => {
    if (rootRef.current) {
      applyTheme(rootRef.current, resolved)
    }
  }, [resolved])

  React.useEffect(() => {
    loadNonSystemFonts(resolved)
  }, [resolved])

  return (
    <MarwesContext.Provider value={{ theme: resolved, onModeChange }}>
      <div ref={rootRef} className={`mw-theme--${theme?.mode ?? "light"}`}>
        {children}
      </div>
    </MarwesContext.Provider>
  )
}

function loadNonSystemFonts(resolved: ResolvedTheme): void {
  const weights = extractUsedWeights(resolved.typography)
  const fontStacks = [resolved.font.primary, resolved.font.secondary]

  for (const stack of fontStacks) {
    const familyName = extractFontFamilyName(stack)
    if (familyName && !isSystemFont(familyName)) {
      loadGoogleFont({ family: familyName, weights })
    }
  }
}
