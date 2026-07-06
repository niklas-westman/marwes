import { Badge, IconName, LinkButton, Paragraph, Text, TextVariant } from "@marwes-ui/react"
import styled from "styled-components"

import { InstallationPanel } from "./InstallationPanel"

const HeroContainer = styled.section`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sp80}
    ${({ theme }) => theme.spacing.sp80} ${({ theme }) => theme.spacing.sp48};
  display: flex;
  gap: ${({ theme }) => `calc(${theme.spacing.sp4} + ${theme.spacing.sp2})`};
  justify-content: space-between;
  align-items: center;

  ${({ theme }) => theme.media.desktopAndAbove} {
    height: 33rem;
  }

  ${({ theme }) => theme.media.desktopAndBelow} {
    align-items: flex-start;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sp40};
    padding: ${({ theme }) => `calc(${theme.spacing.sp56} + ${theme.spacing.sp4})`}
      ${({ theme }) => theme.spacing.sp40} ${({ theme }) => theme.spacing.sp40};
  }

  ${({ theme }) => theme.media.mobileAndBelow} {
    padding: ${({ theme }) => theme.spacing.sp40}
      ${({ theme }) => `calc(${theme.spacing.sp16} + ${theme.spacing.sp4})`}
      ${({ theme }) => theme.spacing.sp32};
    gap: ${({ theme }) => theme.spacing.sp32};
  }
`

const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp24};
  max-width: 30.1875rem;

  ${({ theme }) => theme.media.desktopAndBelow} {
    max-width: 100%;
  }
`

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp8};
`

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp8};
  align-items: flex-start;
`

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sp8};
`

const LinkRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sp8};
  flex-wrap: wrap;
`

function HeroSection(): JSX.Element {
  return (
    <HeroContainer id="hero" data-dashboard-section="hero">
      <TextColumn>
        <TextBox>
          <TopSection>
            <Badge variant="warning">Work in progress</Badge>
            <Text variant={TextVariant.display} headingLevel={1}>
              Design with intention
            </Text>
          </TopSection>
          <Paragraph>Designed and developed with care. Built by craft. Open to all.</Paragraph>
        </TextBox>
        <BadgeRow>
          <Badge>Framework-agnostic</Badge>
          <Badge>Static CSS</Badge>
          <Badge>Type-safe</Badge>
          <Badge>A11y-first</Badge>
          <Badge>Agent-readable</Badge>
        </BadgeRow>
        <LinkRow>
          <LinkButton
            href="https://github.com/niklas-westman/marwes/tree/main/docs"
            iconRight={IconName.ArrowUpRight}
          >
            Documentation
          </LinkButton>
          <LinkButton
            href="https://github.com/niklas-westman/marwes"
            iconRight={IconName.ArrowUpRight}
          >
            GitHub
          </LinkButton>
        </LinkRow>
      </TextColumn>
      <InstallationPanel />
    </HeroContainer>
  )
}

export { HeroSection }
