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
import type { GetStartedPageModel } from "./get-started-model"

const frameworkTitleByFramework: Record<GetStartedPageModel["framework"], string> = {
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
}

function GetStartedPage({ model }: { model: GetStartedPageModel }): JSX.Element {
  return (
    <>
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
