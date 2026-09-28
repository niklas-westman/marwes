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
import type { IntroductionPageModel } from "./introduction-model"

const LinkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sp8};

  ${({ theme }) => theme.media.mobileAndBelow} {
    grid-template-columns: 1fr;
  }
`

const LinkCard = styled.a`
  display: block;
  padding: ${({ theme }) => theme.spacing.sp16};
  border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  border-radius: ${({ theme }) => theme.spacing.sp8};
  color: ${({ theme }) => theme.color.text};
  text-decoration: none;

  strong {
    display: block;
    font-size: 0.8125rem;
  }

  span {
    display: block;
    margin-top: ${({ theme }) => theme.spacing.sp2};
    color: ${({ theme }) => theme.color.textMuted};
    font-size: 0.75rem;
  }

  &:hover {
    background: ${({ theme }) => theme.color.surfaceSubtle};
  }
`

function IntroductionPage({ model }: { model: IntroductionPageModel }): JSX.Element {
  return (
    <DocsShell currentPath="/docs/introduction/" sections={model.sections}>
      <Hero>
        <Eyebrow>Marwes documentation</Eyebrow>
        <PageTitle>{model.title}</PageTitle>
        <Lead>{model.summary}</Lead>
      </Hero>

      {model.topics.map((topic) => (
        <Section key={topic.id} id={topic.id} data-docs-section>
          <SectionHeading>{topic.title}</SectionHeading>
          <SectionDescription>{topic.description}</SectionDescription>
        </Section>
      ))}

      <Section id="where-to-go-next" data-docs-section>
        <SectionHeading>Where to go next</SectionHeading>
        <SectionDescription>Pick a framework and render the first component.</SectionDescription>
        <LinkGrid>
          {model.links.map((link) => (
            <LinkCard key={link.href} href={siteHref(link.href)}>
              <strong>{link.label}</strong>
              <span>{link.description}</span>
            </LinkCard>
          ))}
        </LinkGrid>
      </Section>

      <PageFooter>
        <span>Marwes — /mɑːr.wɛz/</span>
        <a href={siteHref("/docs/components/")}>Browse all components</a>
      </PageFooter>
    </DocsShell>
  )
}

export { IntroductionPage }
