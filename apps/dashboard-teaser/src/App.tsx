import { MarwesProvider, ThemeMode } from "@marwes-ui/react"
import { useState } from "react"
import { ThemeProvider as StyledThemeProvider } from "styled-components"

import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { MainContent, PageWrapper } from "./components/PageLayout"
import { ComponentsShowcase } from "./sections/ComponentsShowcase"
import { HeroSection } from "./sections/HeroSection"
import { defaultPlaygroundSettings } from "./sections/playground-settings"
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

  return (
    <>
      <MarwesProvider theme={{ mode: playgroundSettings.mode }}>
        {(mwTheme) => (
          <StyledThemeProvider theme={mwTheme}>
            <>
              <GlobalStyle />
              <PageWrapper>
                <Header isDark={isDark} onToggleTheme={toggleTheme} />
                <MainContent>
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
