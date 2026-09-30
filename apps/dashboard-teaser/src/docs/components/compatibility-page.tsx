import styled from "styled-components"

import type { CompatibilityPageModel } from "./compatibility-model"
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

const frameworkLabel: Record<CompatibilityPageModel["requirements"][number]["framework"], string> =
  {
    react: "React",
    vue: "Vue",
    svelte: "Svelte",
  }

const Table = styled.table`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.sp16};
  border-collapse: collapse;
  font-size: 0.8125rem;

  th,
  td {
    padding: ${({ theme }) => theme.spacing.sp8} ${({ theme }) => theme.spacing.sp12};
    border-bottom: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
    text-align: left;
  }

  th {
    color: ${({ theme }) => theme.color.textMuted};
    font-weight: 600;
  }

  td a {
    color: ${({ theme }) => theme.color.primary.base};
  }
`

const RuntimeRequirementsHeading = styled(SectionHeading)`
  margin-top: ${({ theme }) => theme.spacing.sp40};
`

const RequirementList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sp8};
  margin: ${({ theme }) => theme.spacing.sp16} 0 ${({ theme }) => theme.spacing.sp24};
  padding: 0;
  list-style: none;
`

const RequirementItem = styled.li`
  padding: ${({ theme }) => theme.spacing.sp12} ${({ theme }) => theme.spacing.sp16};
  border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  border-radius: ${({ theme }) => theme.spacing.sp8};
  background: ${({ theme }) => theme.color.surfaceElevated};
  font-size: 0.8125rem;
  line-height: 1.55;
`

function CompatibilityPage({ model }: { model: CompatibilityPageModel }): JSX.Element {
  return (
    <>
      <Hero>
        <Eyebrow>Marwes documentation</Eyebrow>
        <PageTitle>{model.title}</PageTitle>
        <Lead>{model.summary}</Lead>
      </Hero>

      <Section id="compatibility" data-docs-section>
        <SectionHeading>{model.heading}</SectionHeading>
        <SectionDescription>{model.description}</SectionDescription>
        <Table>
          <thead>
            <tr>
              <th>Framework</th>
              <th>Package</th>
              <th>Peer requirement</th>
              <th>Setup</th>
            </tr>
          </thead>
          <tbody>
            {model.requirements.map((requirement) => (
              <tr key={requirement.framework}>
                <td>{frameworkLabel[requirement.framework]}</td>
                <td>
                  <code>{requirement.packageName}</code>
                </td>
                <td>{requirement.peerRequirement}</td>
                <td>
                  <a href={siteHref(requirement.getStartedHref)} data-docs-soft-nav>
                    Get started
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <RuntimeRequirementsHeading as="h3">Runtime requirements</RuntimeRequirementsHeading>
        <RequirementList>
          {model.runtimeRequirements.map((requirement) => (
            <RequirementItem key={requirement}>{requirement}</RequirementItem>
          ))}
        </RequirementList>
        <SectionDescription>{model.footnote}</SectionDescription>
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

export { CompatibilityPage }
