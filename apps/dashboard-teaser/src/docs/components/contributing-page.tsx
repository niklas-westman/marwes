import type { ContributingPageModel } from "./contributing-model"
import { DocsCodeBlock } from "./docs-code-block"
import {
  Eyebrow,
  Hero,
  Lead,
  PageTitle,
  Section,
  SectionDescription,
  SectionHeading,
} from "./docs-page-typography"

function ContributingPage({ model }: { model: ContributingPageModel }): JSX.Element {
  return (
    <>
      <Hero>
        <Eyebrow>Marwes documentation</Eyebrow>
        <PageTitle>{model.title}</PageTitle>
        <Lead>{model.summary}</Lead>
      </Hero>

      <Section id="contributing" data-docs-section>
        <SectionHeading>{model.heading}</SectionHeading>
        <SectionDescription>{model.description}</SectionDescription>
        <SectionDescription>{model.secondaryDescription}</SectionDescription>
        <DocsCodeBlock code={model.code.content} label="Consumer docs check" />
        <SectionDescription>
          <a href={model.externalLink.href}>{model.externalLink.label}</a>
        </SectionDescription>
      </Section>
    </>
  )
}

export { ContributingPage }
