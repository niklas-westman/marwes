import { MarwesProvider, SkipLink, ThemeMode } from "@marwes-ui/react"
import { useState } from "react"
import { ThemeProvider as StyledThemeProvider } from "styled-components"

import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { MainContent, PageWrapper } from "./components/PageLayout"
import { ComponentsShowcase } from "./sections/ComponentsShowcase"
import { HeroSection } from "./sections/HeroSection"
import {
  createDashboardShellThemeInput,
  defaultPlaygroundSettings,
} from "./sections/playground-settings"
import { GlobalStyle } from "./styles/global-style"

function App(): JSX.Element {
  const [playgroundSettings, setPlaygroundSettings] = useState(defaultPlaygroundSettings)

  const toggleTheme = (): void => {
    setPlaygroundSettings((current) => ({
      ...current,
      mode: current.mode === ThemeMode.light ? ThemeMode.dark : ThemeMode.light,
    }))
  }

  const isDark = playgroundSettings.mode === ThemeMode.dark
  const shellThemeInput = createDashboardShellThemeInput(playgroundSettings)

  return (
    <>
      <MarwesProvider theme={shellThemeInput}>
        {(mwTheme) => (
          <StyledThemeProvider theme={mwTheme}>
            <>
              <GlobalStyle />
              <PageWrapper
                data-dashboard-reduce-motion={
                  playgroundSettings.accessibility.reduceMotion ? "true" : undefined
                }
                data-dashboard-loose-spacing={
                  playgroundSettings.accessibility.looseSpacing ? "true" : undefined
                }
              >
                <SkipLink href="#main">Skip to main content</SkipLink>
                <Header isDark={isDark} onToggleTheme={toggleTheme} />
                <MainContent id="main">
                  <HeroSection />
                  <ComponentsShowcase
                    settings={playgroundSettings}
                    onSettingsChange={setPlaygroundSettings}
                  />
                </MainContent>
                <Footer />
              </PageWrapper>
            </>
          </StyledThemeProvider>
        )}
      </MarwesProvider>
    </>
  )
}

export { App }
