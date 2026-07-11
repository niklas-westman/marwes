import { MarwesProvider, SkipLink, ThemeMode } from "@marwes-ui/react"
import { ThemeProvider as StyledThemeProvider } from "styled-components"

import { Footer } from "./components/Footer"
import { FrameworkPreferenceProvider } from "./components/FrameworkPreference"
import { Header } from "./components/Header"
import { MainContent, PageWrapper } from "./components/PageLayout"
import { Reveal } from "./components/Reveal"
import { usePlaygroundSettings } from "./hooks/use-playground-settings"
import { ComponentsShowcase } from "./sections/ComponentsShowcase"
import { HandoffCta } from "./sections/HandoffCta"
import { HeroSection } from "./sections/HeroSection"
import { resolveDashboardTheme } from "./sections/playground-theme-resolver"
import { GlobalStyle } from "./theme/global-style"

function App(): JSX.Element {
  const {
    settings,
    setSettings,
    activePreset,
    customBuilderOpen,
    toggleTheme,
    selectThemePreset,
    setCustomBuilderOpen,
    openCustomBuilder,
  } = usePlaygroundSettings()

  const isDark = settings.mode === ThemeMode.dark
  const resolvedTheme = resolveDashboardTheme(settings, settings.mode, activePreset.personality)

  return (
    <FrameworkPreferenceProvider>
      <MarwesProvider
        theme={resolvedTheme.themeInput}
        fontLoading={{
          googleFamilies:
            resolvedTheme.font.source === "google-fonts" ? [resolvedTheme.font.family] : [],
        }}
      >
        {(mwTheme) => (
          <StyledThemeProvider theme={mwTheme}>
            <>
              <GlobalStyle />
              <PageWrapper
                data-dashboard-page="true"
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
                  <Reveal>
                    <HeroSection />
                  </Reveal>
                  <Reveal>
                    <ComponentsShowcase
                      settings={settings}
                      onSettingsChange={setSettings}
                      customBuilderOpen={customBuilderOpen}
                      onCustomBuilderOpenChange={setCustomBuilderOpen}
                      onThemePresetSelect={selectThemePreset}
                    />
                  </Reveal>
                  <Reveal>
                    <HandoffCta
                      settings={settings}
                      preset={activePreset}
                      onOpenCustomBuilder={openCustomBuilder}
                    />
                  </Reveal>
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
