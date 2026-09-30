import { Spacing } from "@marwes-ui/react"
import styled from "styled-components"

import { ShowcaseCard, ShowcaseGrid } from "./showcase-layout"

const RulerBlock = styled.div`
  padding: ${({ theme }) => theme.spacing.sp8} ${({ theme }) => theme.spacing.sp12};
  border-radius: ${({ theme }) => theme.spacing.sp4};
  background: ${({ theme }) => theme.color.surfaceBrand};
  color: ${({ theme }) => theme.color.textBrand};
  font-size: 0.6875rem;
  font-weight: 600;
  text-align: center;
`

const RulerLabel = styled.p`
  margin: ${({ theme }) => theme.spacing.sp4} 0 0;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.625rem;
  text-align: center;
`

function SpacingShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Small gap</h3>
        <p>Tight rhythm between closely related content.</p>
        <RulerBlock>Block A</RulerBlock>
        <Spacing size="sp-8" />
        <RulerBlock>Block B</RulerBlock>
        <RulerLabel>sp-8 · 8px</RulerLabel>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Default gap</h3>
        <p>The default token used between most stacked sections.</p>
        <RulerBlock>Block A</RulerBlock>
        <Spacing size="sp-24" />
        <RulerBlock>Block B</RulerBlock>
        <RulerLabel>sp-24 · 24px (default)</RulerLabel>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Large gap</h3>
        <p>A deliberate break between clearly distinct regions.</p>
        <RulerBlock>Block A</RulerBlock>
        <Spacing size="sp-64" />
        <RulerBlock>Block B</RulerBlock>
        <RulerLabel>sp-64 · 64px</RulerLabel>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default SpacingShowcase
