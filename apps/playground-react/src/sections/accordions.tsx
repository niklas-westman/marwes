import { useState } from "react"
// Atom is no longer publicly exported; deep-import for playground demo.
import { Accordion } from "../../../../packages/react/src/components/accordion/accordion"
import { PreviewSection, SectionDescription, SectionTitle } from "./section.styles"

const FAQ = [
  {
    title: "What is Marwes?",
    body: "Marwes is a design system for building accessible, themeable UI components in React and Vue.",
  },
  {
    title: "How do I customise the theme?",
    body: "Pass a ThemeInput object to MarwesProvider. You can override primary colour, radius, density, and more.",
  },
  {
    title: "Does it support dark mode?",
    body: "Yes. Set mode to ThemeMode.dark in ThemeInput or use useThemeMode under MarwesProvider. The provider applies the dark theme class and variables.",
  },
] as const

function AccordionsSection(): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <PreviewSection>
      <SectionTitle>Accordion</SectionTitle>
      <SectionDescription>Click a header to expand / collapse</SectionDescription>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 560 }}>
        {FAQ.map((item, i) => (
          <Accordion
            key={item.title}
            id={`playground-faq-${i}`}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            title={item.title}
          >
            {item.body}
          </Accordion>
        ))}
      </div>
    </PreviewSection>
  )
}

export { AccordionsSection }
