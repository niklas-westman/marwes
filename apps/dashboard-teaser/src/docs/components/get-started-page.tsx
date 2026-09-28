import styled from "styled-components"

import {
  Eyebrow,
  Hero,
  Lead,
  PageFooter,
  PageTitle,
  Section,
  SectionDescription,
  SectionHeading,
} from "./docs-page-typography"
import { DocsShell, siteHref } from "./docs-shell"
import { GetStartedCodeBlock } from "./get-started-code-block"
import type { GetStartedPageModel } from "./get-started-model"

const Callout = styled.aside`
  margin-top: ${({ theme }) => theme.spacing.sp40};
  padding: ${({ theme }) => theme.spacing.sp24};
  border-radius: ${({ theme }) => theme.spacing.sp12};
  background: ${({ theme }) => theme.color.surfaceBrand};
  color: ${({ theme }) => theme.color.textBrand};
  font-size: 0.8125rem;
  line-height: 1.55;

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.sp4};
  }
`

const frameworkTitleByFramework: Record<GetStartedPageModel["framework"], string> = {
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
}

function GetStartedPage({ model }: { model: GetStartedPageModel }): JSX.Element {
  return (
    <DocsShell currentPath={`/docs/get-started/${model.framework}/`} sections={model.sections}>
      <Hero>
        <Eyebrow>Marwes documentation</Eyebrow>
        <PageTitle>{model.title}</PageTitle>
        <Lead>{model.summary}</Lead>
      </Hero>

      {model.steps.map((step, index) => (
        <Section key={step.id} id={step.id} data-docs-section>
          <SectionHeading>
            {index + 1}. {step.title}
          </SectionHeading>
          <SectionDescription>{step.description}</SectionDescription>
          {step.code ? (
            <GetStartedCodeBlock
              code={step.code.content}
              label={`${frameworkTitleByFramework[model.framework]} ${step.title} example`}
            />
          ) : null}
        </Section>
      ))}

      <Callout>
        <strong>Manual fallback</strong>
        Install <code>{model.packageName}</code>, render <code>MarwesProvider</code> once at the
        application boundary, and import components only from the package root.
      </Callout>

      <PageFooter>
        <span>Marwes — /mɑːr.wɛz/</span>
        <a href={siteHref("/docs/components/")}>Browse all components</a>
      </PageFooter>
    </DocsShell>
  )
}

export { GetStartedPage }
