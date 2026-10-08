import styled from "styled-components"
import { DocsCodeBlock } from "./docs-code-block"
import {
  Callout,
  Eyebrow,
  Hero,
  Lead,
  PageTitle,
  Section,
  SectionDescription,
  SectionHeading,
} from "./docs-page-typography"
import { siteHref } from "./docs-shell"
import type { GetStartedPageModel } from "./get-started-model"

const frameworkTitleByFramework: Record<GetStartedPageModel["framework"], string> = {
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
}

const FrameworkSwitcher = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sp8};
  margin-top: ${({ theme }) => theme.spacing.sp24};
`

const FrameworkLink = styled.a<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sp8} ${({ theme }) => theme.spacing.sp16};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.spacing.sp8};
  color: ${({ theme, $active }) => ($active ? theme.color.textBrand : theme.color.text)};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-decoration: none;
`

const frameworks = Object.keys(frameworkTitleByFramework) as GetStartedPageModel["framework"][]

function GetStartedPage({ model }: { model: GetStartedPageModel }): JSX.Element {
  return (
    <>
      <Hero>
        <Eyebrow>Marwes documentation</Eyebrow>
        <PageTitle>{model.title}</PageTitle>
        <Lead>{model.summary}</Lead>
        <FrameworkSwitcher aria-label="Choose your framework">
          {frameworks.map((framework) => (
            <FrameworkLink
              key={framework}
              href={siteHref(`/docs/get-started/${framework}/`)}
              aria-current={framework === model.framework ? "page" : undefined}
              $active={framework === model.framework}
              data-docs-soft-nav
            >
              {frameworkTitleByFramework[framework]}
            </FrameworkLink>
          ))}
        </FrameworkSwitcher>
      </Hero>

      {model.steps.map((step, index) => (
        <Section key={step.id} id={step.id} data-docs-section>
          <SectionHeading>
            {index + 1}. {step.title}
          </SectionHeading>
          <SectionDescription>{step.description}</SectionDescription>
          {step.code ? (
            <DocsCodeBlock
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
    </>
  )
}

export { GetStartedPage }
