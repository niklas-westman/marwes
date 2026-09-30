import { MarwesProvider, useThemeMode } from "@marwes-ui/react"
import type { ReactNode } from "react"
import { useEffect, useLayoutEffect } from "react"
import { ThemeProvider as StyledThemeProvider } from "styled-components"

import { GlobalStyle } from "../../theme/global-style"
import { getInitialThemeMode, siteThemeStorageKey } from "../../theme/site-theme"

function SiteThemeMetadata(): null {
  const { mode } = useThemeMode()
  useEffect(() => {
    document.documentElement.dataset.marwesMode = mode
    document.documentElement.style.colorScheme = mode
  }, [mode])
  return null
}

function StaticFallbackHandoff(): null {
  useLayoutEffect(() => {
    document.getElementById("root")?.removeAttribute("data-static-docs")
    let targetId = ""
    try {
      targetId = decodeURIComponent(window.location.hash.replace(/^#/, ""))
    } catch {
      return
    }
    const target = targetId ? document.getElementById(targetId) : null
    if (!target?.scrollIntoView) return

    const previousScrollBehavior = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = "auto"
    target.scrollIntoView()
    document.documentElement.style.scrollBehavior = previousScrollBehavior
  }, [])
  return null
}

function DocsPageShellRoot({ children }: { children: ReactNode }): JSX.Element {
  return (
    <MarwesProvider
      defaultMode={getInitialThemeMode()}
      storageKey={siteThemeStorageKey}
      target="html"
      disableTransitionOnChange
    >
      {(theme) => (
        <StyledThemeProvider theme={theme}>
          <StaticFallbackHandoff />
          <SiteThemeMetadata />
          <GlobalStyle />
          {children}
        </StyledThemeProvider>
      )}
    </MarwesProvider>
  )
}

export { DocsPageShellRoot, getInitialThemeMode }
