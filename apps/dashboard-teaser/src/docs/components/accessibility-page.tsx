import styled from "styled-components"

import type { AccessibilityPageModel } from "./accessibility-model"
import {
  Eyebrow,
  Hero,
  Lead,
  PageTitle,
  Section,
  SectionDescription,
  SectionHeading,
} from "./docs-page-typography"

const RequirementList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sp8};
  margin: ${({ theme }) => theme.spacing.sp16} 0 0;
  padding: 0;
  list-style: none;
`

const RequirementItem = styled.li`
  padding: ${({ theme }) => theme.spacing.sp12} ${({ theme }) => theme.spacing.sp16};
  border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  border-radius: ${({ theme }) => theme.spacing.sp8};
  background: ${({ theme }) => theme.color.surfaceElevated};
  font-size: 0.8125rem;
  line-height: 1.55;
`

function AccessibilityPage({ model }: { model: AccessibilityPageModel }): JSX.Element {
  return (
    <>
      <Hero>
        <Eyebrow>Marwes documentation</Eyebrow>
        <PageTitle>{model.title}</PageTitle>
        <Lead>{model.summary}</Lead>
      </Hero>

      <Section id="accessibility" data-docs-section>
        <SectionHeading>{model.heading}</SectionHeading>
        <SectionDescription>{model.description}</SectionDescription>
        <RequirementList>
          {model.requirements.map((requirement) => (
            <RequirementItem key={requirement}>{requirement}</RequirementItem>
          ))}
        </RequirementList>
      </Section>
    </>
  )
}

export { AccessibilityPage }
