import { MarwesProvider, SkipLink, ThemeMode } from "@marwes-ui/react"
import { ThemeProvider as StyledThemeProvider } from "styled-components"

import { Footer } from "./components/Footer"
import { FrameworkPreferenceProvider } from "./components/FrameworkPreference"
import { Header } from "./components/Header"
import { MainContent, PageWrapper } from "./components/PageLayout"
import { usePlaygroundSettings } from "./hooks/use-playground-settings"
import { ComponentsShowcase } from "./sections/ComponentsShowcase"
import { HandoffCta } from "./sections/HandoffCta"
import { HeroSection } from "./sections/HeroSection"
import { createDashboardThemeInput } from "./sections/playground-settings"
import { GlobalStyle } from "./theme/global-style"

function App(): JSX.Element {
  const { settings, setSettings, activePreset, toggleTheme, openCustomBuilder } =
    usePlaygroundSettings()

  const isDark = settings.mode === ThemeMode.dark
  const shellThemeInput = createDashboardThemeInput(settings)

  return (
    <FrameworkPreferenceProvider>
      <MarwesProvider theme={shellThemeInput} fontLoading={{ googleFamilies: [settings.font] }}>
        {(mwTheme) => (
          <StyledThemeProvider theme={mwTheme}>
            <>
              <GlobalStyle />
              <PageWrapper
                data-dashboard-reduce-motion={
                  settings.accessibility.reduceMotion ? "true" : undefined
                }
                data-dashboard-loose-spacing={
                  settings.accessibility.looseSpacing ? "true" : undefined
                }
              >
                <SkipLink href="#main">Skip to main content</SkipLink>
                <Header isDark={isDark} onToggleTheme={toggleTheme} />
                <MainContent id="main">
                  <HeroSection />
                  <ComponentsShowcase settings={settings} onSettingsChange={setSettings} />
                  <HandoffCta
                    settings={settings}
                    preset={activePreset}
                    onOpenCustomBuilder={openCustomBuilder}
                  />
                </MainContent>
                <Footer />
              </PageWrapper>
            </>
          </StyledThemeProvider>
        )}
      </MarwesProvider>
    </FrameworkPreferenceProvider>
  )
}

export { App }
