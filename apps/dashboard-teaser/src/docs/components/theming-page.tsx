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
    </>
  )
}

export { ThemingPage }
