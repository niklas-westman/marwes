import { Divider, Paragraph } from "@marwes-ui/react"

import { PreviewSection, SectionDescription, SectionTitle } from "./section.styles"

function DividersSection(): JSX.Element {
  return (
    <PreviewSection>
      <SectionTitle>Dividers</SectionTitle>
      <SectionDescription>Spacing dividers from xxs (1px) to xl (64px)</SectionDescription>
      <Divider size="xxs" />
      <Paragraph size="sm">xxs — 1px</Paragraph>
      <Divider size="xs" />
      <Paragraph size="sm">xs — 8px</Paragraph>
      <Divider size="sm" />
      <Paragraph size="sm">sm — 16px</Paragraph>
      <Divider size="md" />
      <Paragraph size="sm">md — 32px</Paragraph>
      <Divider size="lg" />
      <Paragraph size="sm">lg — 48px</Paragraph>
    </PreviewSection>
  )
}

export { DividersSection }
