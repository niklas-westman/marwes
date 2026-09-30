import styled from "styled-components"

import type { AiPageModel } from "./ai-model"
import {
  Eyebrow,
  Hero,
  Lead,
  PageTitle,
  Section,
  SectionDescription,
  SectionHeading,
} from "./docs-page-typography"

const ResourceList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sp4};
  margin: ${({ theme }) => theme.spacing.sp16} 0;
  padding: 0;
  list-style: none;

  li {
    padding: ${({ theme }) => theme.spacing.sp8} ${({ theme }) => theme.spacing.sp12};
    border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
    border-radius: ${({ theme }) => theme.spacing.sp8};
    background: ${({ theme }) => theme.color.surfaceElevated};
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 0.75rem;
  }
`

function AiPage({ model }: { model: AiPageModel }): JSX.Element {
  return (
    <>
      <Hero>
        <Eyebrow>Marwes documentation</Eyebrow>
        <PageTitle>{model.title}</PageTitle>
        <Lead>{model.summary}</Lead>
      </Hero>

      <Section id="ai" data-docs-section>
        <SectionHeading>{model.heading}</SectionHeading>
        <SectionDescription>
          Start agents at <a href={model.entrypoint}>{model.entrypoint}</a>, then choose the
          framework guide and public API inventory.
        </SectionDescription>
        <ResourceList>
          {model.resources.map((resource) => (
            <li key={resource}>{resource}</li>
          ))}
        </ResourceList>
        <SectionDescription>{model.footnote}</SectionDescription>
      </Section>
    </>
  )
}

export { AiPage }
