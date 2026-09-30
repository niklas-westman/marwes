import { Icon, IconName } from "@marwes-ui/react"
import type { ComponentType } from "react"
import styled from "styled-components"

import { ComponentCard } from "./component-card"
import type { ComponentDocsPageModel, DocsResource } from "./component-docs-model"
import {
  Eyebrow,
  Hero,
  Lead,
  PageTitle,
  Section,
  SectionDescription,
  SectionHeading,
} from "./docs-page-typography"
import { siteHref } from "./docs-shell"
import { FrameworkCodeExample } from "./framework-code-example"

const IntentGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sp12};

  ${({ theme }) => theme.media.mobileAndBelow} {
    grid-template-columns: 1fr;
  }
`

const IntentCard = styled.article`
  padding: ${({ theme }) => theme.spacing.sp16};
  border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  border-radius: ${({ theme }) => theme.spacing.sp12};
  background: ${({ theme }) => theme.color.surfaceElevated};

  h2,
  h3 {
    margin: ${({ theme }) => theme.spacing.sp12} 0
      ${({ theme }) => theme.spacing.sp8};
    font-size: 0.875rem;
  }

  p,
  li {
    color: ${({ theme }) => theme.color.textMuted};
    font-size: 0.75rem;
    line-height: 1.55;
  }

  p,
  ul {
    margin: 0;
  }

  ul {
    padding-left: ${({ theme }) => theme.spacing.sp16};
  }
`

const IntentIcon = styled.span<{ $tone: "primary" | "success" | "danger" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing.sp32};
  height: ${({ theme }) => theme.spacing.sp32};
  border-radius: 999px;
  background: ${({ $tone, theme }) =>
    $tone === "success"
      ? theme.color.status.success.background
      : $tone === "danger"
        ? theme.color.status.error.background
        : theme.color.surfaceBrand};
  color: ${({ $tone, theme }) =>
    $tone === "success"
      ? theme.color.status.success.icon
      : $tone === "danger"
        ? theme.color.status.error.icon
        : theme.color.textBrand};
`

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sp8};

  ${({ theme }) => theme.media.mobileAndBelow} {
    grid-template-columns: 1fr;
  }
`

const RequirementsPanel = styled.section`
  margin-top: ${({ theme }) => theme.spacing.sp40};
  padding: ${({ theme }) => theme.spacing.sp24};
  border-radius: ${({ theme }) => theme.spacing.sp12};
  background: ${({ theme }) => theme.color.surfaceBrand};
`

const RequirementsHeading = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sp12};

  span {
    color: ${({ theme }) => theme.color.textBrand};
  }

  h2 {
    margin: 0;
    font-size: 1rem;
  }
`

const RequirementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sp12} ${({ theme }) => theme.spacing.sp24};
  margin-top: ${({ theme }) => theme.spacing.sp16};

  ${({ theme }) => theme.media.mobileAndBelow} {
    grid-template-columns: 1fr;
  }
`

const Requirement = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.spacing.sp8};

  > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${({ theme }) => theme.spacing.sp24};
    height: ${({ theme }) => theme.spacing.sp24};
    border-radius: 999px;
    background: ${({ theme }) => theme.color.status.success.background};
    color: ${({ theme }) => theme.color.status.success.icon};
  }

  strong,
  p {
    font-size: 0.75rem;
  }

  p {
    margin: ${({ theme }) => theme.spacing.sp2} 0 0;
    color: ${({ theme }) => theme.color.textMuted};
  }
`

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sp8};

  ${({ theme }) => theme.media.desktopAndBelow} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${({ theme }) => theme.media.mobileAndBelow} {
    grid-template-columns: 1fr;
  }
`

const ResourceLink = styled.a`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sp8};
  padding: ${({ theme }) => theme.spacing.sp12};
  border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  border-radius: ${({ theme }) => theme.spacing.sp8};
  color: ${({ theme }) => theme.color.text};
  text-decoration: none;

  strong,
  small {
    display: block;
  }

  strong {
    font-size: 0.75rem;
  }

  small {
    margin-top: ${({ theme }) => theme.spacing.sp2};
    color: ${({ theme }) => theme.color.textMuted};
    font-size: 0.625rem;
  }

  &:hover {
    background: ${({ theme }) => theme.color.surfaceSubtle};
  }
`

const resourceIcons: Record<DocsResource["kind"], IconName> = {
  storybook: IconName.Bookmark,
  npm: IconName.Download,
  source: IconName.Code,
  issue: IconName.MessageCircle,
}

function ComponentDocsPage({
  model,
  Showcase,
}: {
  model: ComponentDocsPageModel
  Showcase?: ComponentType
}): JSX.Element {
  return (
    <>
      <Hero>
        <Eyebrow>Marwes documentation</Eyebrow>
        <PageTitle>{model.title}</PageTitle>
        <Lead>{model.summary}</Lead>
      </Hero>

      <IntentGrid id="what-this-family-solves" data-docs-section>
        <IntentCard>
          <IntentIcon $tone="primary">
            <Icon name={IconName.CheckCircle} decorative size="xs" />
          </IntentIcon>
          <h2>What this family solves</h2>
          <p>{model.summary}</p>
        </IntentCard>
        <IntentCard>
          <IntentIcon $tone="success">
            <Icon name={IconName.Check} decorative size="xs" />
          </IntentIcon>
          <h3>Use when</h3>
          <ul>
            {model.useWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </IntentCard>
        <IntentCard>
          <IntentIcon $tone="danger">
            <Icon name={IconName.X} decorative size="xs" />
          </IntentIcon>
          <h3>Avoid when</h3>
          <ul>
            {model.avoidWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </IntentCard>
      </IntentGrid>

      <Section id="recommended-components" data-docs-section>
        <SectionHeading>Recommended public components</SectionHeading>
        <SectionDescription>{model.recommendationDescription}</SectionDescription>
        <ComponentGrid>
          {model.recommendedComponents.map((component) => (
            <ComponentCard key={component.name} component={component} />
          ))}
        </ComponentGrid>
      </Section>

      <Section id="public-imports" data-docs-section>
        <SectionHeading>Public imports</SectionHeading>
        <SectionDescription>
          Choose your adapter below. The selected inventory reflects that framework’s actual public
          root exports.
        </SectionDescription>
        <FrameworkCodeExample family={model.family} frameworks={model.frameworks} />
      </Section>

      <Section id="examples" data-docs-section>
        <SectionHeading>Verified minimal examples</SectionHeading>
        <SectionDescription>
          Real Marwes components rendered inside the same provider and theme as this page.
        </SectionDescription>
        {Showcase ? (
          <Showcase />
        ) : (
          <SectionDescription>
            Use the verified framework example above or open Storybook for live variants and
            interaction states.
          </SectionDescription>
        )}
      </Section>

      <RequirementsPanel id="accessibility" data-docs-section>
        <RequirementsHeading>
          <span>
            <Icon name={IconName.CheckCircle} decorative size="sm" />
          </span>
          <h2>Accessibility requirements</h2>
        </RequirementsHeading>
        <SectionDescription>
          Consumers remain responsible for truthful labels, instructions and error messages.
        </SectionDescription>
        <RequirementsGrid>
          {model.accessibility.map((requirement) => (
            <Requirement key={requirement.title}>
              <span>
                <Icon name={IconName.Check} decorative size={12} />
              </span>
              <div>
                <strong>{requirement.title}</strong>
                <p>{requirement.description}</p>
              </div>
            </Requirement>
          ))}
        </RequirementsGrid>
      </RequirementsPanel>

      <Section id="theming" data-docs-section>
        <SectionHeading>Theming</SectionHeading>
        <SectionDescription>
          {model.theming} See the <a href={siteHref("/docs/theming/")}>theming guide</a> for
          configuration and token details.
        </SectionDescription>
      </Section>

      <Section id="resources" data-docs-section>
        <SectionHeading>Resources</SectionHeading>
        <SectionDescription>
          Explore live stories, package metadata, source and support.
        </SectionDescription>
        <ResourceGrid>
          {model.resources.map((resource) => (
            <ResourceLink
              key={resource.title}
              href={resource.href.startsWith("/") ? siteHref(resource.href) : resource.href}
            >
              <Icon name={resourceIcons[resource.kind]} decorative size="sm" />
              <span>
                <strong>{resource.title}</strong>
                <small>{resource.description}</small>
              </span>
              <Icon name={IconName.ExternalLink} decorative size="xs" />
            </ResourceLink>
          ))}
        </ResourceGrid>
      </Section>
    </>
  )
}

export { ComponentDocsPage }
