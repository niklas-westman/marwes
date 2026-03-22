import { Badge } from "@marwes-ui/react"
import { ComponentRow, PreviewSection, SectionTitle } from "./section.styles"

const VARIANTS = ["neutral", "brand", "info", "success", "warning", "error"] as const

function BadgesSection(): JSX.Element {
  return (
    <PreviewSection>
      <SectionTitle>Badges</SectionTitle>
      <ComponentRow>
        {VARIANTS.map((v) => (
          <Badge key={v} variant={v}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Badge>
        ))}
      </ComponentRow>
    </PreviewSection>
  )
}

export { BadgesSection }
