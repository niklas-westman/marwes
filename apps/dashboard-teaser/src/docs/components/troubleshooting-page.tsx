import styled from "styled-components"

import { DocsCodeBlock } from "./docs-code-block"
import { Eyebrow, Hero, Lead, PageTitle, Section, SectionHeading } from "./docs-page-typography"
import type { TroubleshootingPageModel } from "./troubleshooting-model"

const IssueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sp12};
  margin: ${({ theme }) => theme.spacing.sp16} 0 ${({ theme }) => theme.spacing.sp24};

  ${({ theme }) => theme.media.mobileAndBelow} {
    grid-template-columns: 1fr;
  }
`

const IssueCard = styled.article`
  padding: ${({ theme }) => theme.spacing.sp16};
  border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  border-radius: ${({ theme }) => theme.spacing.sp8};
  background: ${({ theme }) => theme.color.surfaceElevated};

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sp4};
    font-size: 0.8125rem;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.color.textMuted};
    font-size: 0.75rem;
    line-height: 1.5;
  }
`

function TroubleshootingPage({ model }: { model: TroubleshootingPageModel }): JSX.Element {
  return (
    <>
      <Hero>
        <Eyebrow>Marwes documentation</Eyebrow>
        <PageTitle>{model.title}</PageTitle>
        <Lead>{model.summary}</Lead>
      </Hero>

      <Section id="troubleshooting" data-docs-section>
        <SectionHeading>{model.heading}</SectionHeading>
        <IssueGrid>
          {model.issues.map((issue) => (
            <IssueCard key={issue.title}>
              <h3>{issue.title}</h3>
              <p>{issue.description}</p>
            </IssueCard>
          ))}
        </IssueGrid>
        <DocsCodeBlock code={model.code.content} label="Doctor build check" />
      </Section>
    </>
  )
}

export { TroubleshootingPage }
