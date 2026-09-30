import { DocsCodeBlock } from "./docs-code-block"
import {
  Callout,
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
import type { ThemingPageModel } from "./theming-model"

function ThemingPage({ model }: { model: ThemingPageModel }): JSX.Element {
  return (
    <>
      <Hero>
        <Eyebrow>Marwes documentation</Eyebrow>
        <PageTitle>{model.title}</PageTitle>
        <Lead>{model.summary}</Lead>
      </Hero>

      <Section id="theming" data-docs-section>
        <SectionHeading>{model.heading}</SectionHeading>
        <SectionDescription>{model.description}</SectionDescription>
        <DocsCodeBlock code={model.code.content} label="Theme provider example" />
      </Section>

      <Callout>
        <strong>{model.calloutTitle}</strong>
        {model.calloutBody}
      </Callout>

      <PageFooter>
        <span>Marwes — /mɑːr.wɛz/</span>
        <a href={siteHref("/docs/components/")} data-docs-soft-nav>
          Browse all components
        </a>
      </PageFooter>
    </>
  )
}

export { ThemingPage }
