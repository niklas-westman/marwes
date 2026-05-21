import { MarwesProvider, ThemeMode } from "@marwes-ui/react"
import { useState } from "react"

import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { MainContent, PageWrapper } from "./components/PageLayout"
import { ComponentsShowcase } from "./sections/ComponentsShowcase"
import { HeroSection } from "./sections/HeroSection"
import { GlobalStyle } from "./styles/global-style"

function App(): JSX.Element {
  const [mode, setMode] = useState<ThemeMode>(ThemeMode.light)

  const toggleTheme = (): void => {
    setMode((prev) => (prev === ThemeMode.light ? ThemeMode.dark : ThemeMode.light))
  }

  const isDark = mode === ThemeMode.dark

  return (
    <>
      <GlobalStyle />
      <MarwesProvider theme={{ mode }}>
        <PageWrapper>
          <Header isDark={isDark} onToggleTheme={toggleTheme} />
          <MainContent>
            <HeroSection />
            <ComponentsShowcase />
          </MainContent>
          <Footer />
        </PageWrapper>
      </MarwesProvider>
    </>
  )
}

export { App }
