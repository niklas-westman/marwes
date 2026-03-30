import { Divider, H1, H2, H3, Paragraph } from "@marwes-ui/react"

import { PreviewSection, SectionTitle } from "./section.styles"

function TypographySection(): JSX.Element {
  return (
    <PreviewSection>
      <SectionTitle>Typography</SectionTitle>
      <H1>Heading Level 1</H1>
      <H2>Heading Level 2</H2>
      <H3>Heading Level 3</H3>
      <Divider size="sm" />
      <Paragraph size="lg">
        Large paragraph for intros and hero sections. The type scale is fluid and responds to the
        density setting.
      </Paragraph>
      <Paragraph>
        Default body text. Color roles are derived from a single hex value — hover, pressed,
        disabled, and label contrast are all computed automatically unless a preset or app
        explicitly overrides the label token for a brand color.
      </Paragraph>
      <Paragraph size="sm">
        Small paragraph for captions, helper text, and secondary information.
      </Paragraph>
    </PreviewSection>
  )
}

export { TypographySection }
