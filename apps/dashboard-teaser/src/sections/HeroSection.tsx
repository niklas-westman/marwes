import { Badge, Icon, IconName } from "@marwes-ui/react"
import styled from "styled-components"

import { InstallationPanel } from "./InstallationPanel"

const HeroContainer = styled.section`
  width: 100%;
  padding: 80px 80px 48px 80px;
  display: flex;
  gap: 6px;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 40px;
    padding: 60px 40px 40px 40px;
  }

  @media (max-width: 768px) {
    padding: 40px 20px 32px 20px;
    gap: 32px;
  }
`

const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 483px;

  @media (max-width: 1024px) {
    max-width: 100%;
  }
`

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`

const Headline = styled.h1`
  font-family: "Instrument Sans", sans-serif;
  font-size: 40px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--mw-color-text, #141414);
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`

const Subtitle = styled.p`
  font-family: "Instrument Sans", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--mw-color-text, #141414);
`

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const LinkRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0;
  background: none;
  color: var(--mw-color-text, #141414);
  font-family: "Instrument Sans", sans-serif;
  font-size: 14px;
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
          <LinkButton href="#">
            Documentation
            <Icon name={IconName.ArrowUpRight} decorative size={14} />
          </LinkButton>
          <LinkButton href="#">
            Storybook
            <Icon name={IconName.ArrowUpRight} decorative size={14} />
          </LinkButton>
          <LinkButton href="#">
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
