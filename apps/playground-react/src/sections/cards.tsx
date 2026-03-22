import { Card } from "@marwes-ui/react"
import { ComponentRow, PreviewSection, SectionDescription, SectionTitle } from "./section.styles"

function CardsSection(): JSX.Element {
  return (
    <PreviewSection>
      <SectionTitle>Card</SectionTitle>

      <SectionDescription>With title and body-only</SectionDescription>
      <ComponentRow style={{ alignItems: "flex-start" }}>
        <div style={{ width: 260 }}>
          <Card title="Getting started">
            Install via pnpm and wrap your app with MarwesProvider to unlock theming.
          </Card>
        </div>
        <div style={{ width: 260 }}>
          <Card>Body-only card — no title. The body receives full top padding automatically.</Card>
        </div>
      </ComponentRow>
    </PreviewSection>
  )
}

export { CardsSection }
