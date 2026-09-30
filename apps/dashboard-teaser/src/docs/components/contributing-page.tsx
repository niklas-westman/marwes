import type { ContributingPageModel } from "./contributing-model"
import { DocsCodeBlock } from "./docs-code-block"
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
import { siteHref } from "./docs-shell"

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

      <PageFooter>
        <span>Marwes — /mɑːr.wɛz/</span>
        <a href={siteHref("/docs/components/")} data-docs-soft-nav>
          Browse all components
        </a>
      </PageFooter>
    </>
  )
}

export { ContributingPage }
