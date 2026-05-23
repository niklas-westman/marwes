import { Badge, Icon, IconName } from "@marwes-ui/react"
import styled from "styled-components"

import { InstallationPanel } from "./InstallationPanel"

const HeroContainer = styled.section`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sp80} ${({ theme }) => theme.spacing.sp80}
    ${({ theme }) => theme.spacing.sp48};
  display: flex;
  gap: ${({ theme }) => `calc(${theme.spacing.sp4} + ${theme.spacing.sp2})`};
  justify-content: space-between;
  align-items: center;

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

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.font.primary};
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ theme }) => theme.color.text};
  letter-spacing: 0;

  ${({ theme }) => theme.media.mobileAndBelow} {
    font-size: 1.75rem;
  }
`

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.font.primary};
  font-size: ${({ theme }) => theme.typography.paragraph.md.fontSize};
  font-weight: 400;
  line-height: ${({ theme }) => theme.typography.paragraph.md.lineHeight};
  color: ${({ theme }) => theme.color.text};
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

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sp4};
  height: ${({ theme }) => theme.spacing.sp24};
  padding: 0;
  background: none;
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.font.primary};
  font-size: ${({ theme }) => theme.typography.paragraph.sm.fontSize};
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`

function HeroSection(): JSX.Element {
  return (
    <HeroContainer>
      <TextColumn>
        <TextBox>
          <TopSection>
            <Badge variant="warning">Work in progress</Badge>
            <Headline>Design with intention</Headline>
          </TopSection>
          <Subtitle>Designed and developed with care. Built by craft. Open to all.</Subtitle>
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
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
            <Icon name={IconName.ArrowUpRight} decorative size={14} />
          </LinkButton>
          <LinkButton href="#" target="_blank" rel="noopener noreferrer">
            Storybook
            <Icon name={IconName.ArrowUpRight} decorative size={14} />
          </LinkButton>
          <LinkButton
            href="https://github.com/niklas-westman/marwes"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <Icon name={IconName.ArrowUpRight} decorative size={14} />
          </LinkButton>
        </LinkRow>
      </TextColumn>
      <InstallationPanel />
    </HeroContainer>
  )
}

export { HeroSection }
