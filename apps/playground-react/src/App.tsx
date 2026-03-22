import type { ThemeInput } from "@marwes-ui/react"
import { MarwesProvider } from "@marwes-ui/react"
import { useState } from "react"

import "@marwes-ui/presets/firstEdition/styles.css"

import { GlobalStyle } from "./global-style"
import { PlaygroundLayout } from "./layout/playground-layout"
import { PreviewArea, PreviewHeader, PreviewSubtitle, PreviewTitle } from "./layout/preview"
import { Sidebar } from "./layout/sidebar"
import { AccordionsSection } from "./sections/accordions"
import { BadgesSection } from "./sections/badges"
import { ButtonsSection } from "./sections/buttons"
import { CardsSection } from "./sections/cards"
import { CheckboxesSection } from "./sections/checkboxes"
import { ColorPaletteSection } from "./sections/color-palette"
import { ComponentSummary } from "./sections/component-summary"
import { DividersSection } from "./sections/dividers"
import { IconsSection } from "./sections/icons"
import { InputFieldsSection } from "./sections/input-fields"
import { RadiosSection } from "./sections/radios"
import { SectionDivider } from "./sections/section.styles"
import { SwitchesSection } from "./sections/switches"
import { TabsSection } from "./sections/tabs"
import { ToastsSection } from "./sections/toasts"
import { TypographySection } from "./sections/typography"

const DEFAULT_THEME: ThemeInput = {
  mode: "light",
  tone: "default",
  color: {
    primary: "#5B8CFF",
    danger: "#D90429",
    success: "#006633",
    warning: "#FFB703",
  },
  ui: { radius: 4, density: "comfortable" },
}

function App(): JSX.Element {
  const [theme, setTheme] = useState<ThemeInput>(DEFAULT_THEME)

  return (
    <>
      <GlobalStyle />
      <PlaygroundLayout>
        <Sidebar onThemeChange={setTheme} />
        <MarwesProvider theme={theme}>
          <PreviewArea>
            <PreviewHeader>
              <PreviewTitle>Component Preview</PreviewTitle>
              <PreviewSubtitle>
                Live preview of the Marwes design system. Adjust theme controls to see every
                component respond in real time.
              </PreviewSubtitle>
            </PreviewHeader>

            <ComponentSummary />
            <SectionDivider />
            <TypographySection />
            <SectionDivider />
            <ButtonsSection />
            <SectionDivider />
            <TabsSection />
            <SectionDivider />
            <AccordionsSection />
            <SectionDivider />
            <CardsSection />
            <SectionDivider />
            <ToastsSection />
            <SectionDivider />
            <BadgesSection />
            <SectionDivider />
            <SwitchesSection />
            <SectionDivider />
            <RadiosSection />
            <SectionDivider />
            <InputFieldsSection />
            <SectionDivider />
            <CheckboxesSection />
            <SectionDivider />
            <DividersSection />
            <SectionDivider />
            <IconsSection />
            <SectionDivider />
            <ColorPaletteSection />
          </PreviewArea>
        </MarwesProvider>
      </PlaygroundLayout>
    </>
  )
}

export { App }
