import { Accordion } from "@marwes-ui/react"
import { useState } from "react"
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
    body: 'Yes. Set mode: "dark" in your ThemeInput and wrap your root with the mw-theme--dark class.',
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
