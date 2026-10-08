import {
  Badge,
  BadgeVariant,
  Icon,
  IconName,
  LinkButton,
  Paragraph,
  Text,
  TextVariant,
} from "@marwes-ui/react"
import { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"

import { version as latestCoreVersion } from "../../../../packages/core/package.json"

import { InstallationPanel } from "./InstallationPanel"
import type { Framework } from "./installation-recipes"

const HeroContainer = styled.section`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sp80}
    ${({ theme }) => theme.spacing.sp80} ${({ theme }) => theme.spacing.sp48};
  display: flex;
  gap: ${({ theme }) => `calc(${theme.spacing.sp4} + ${theme.spacing.sp2})`};
  justify-content: space-between;
  align-items: center;
  position: relative;

  ${({ theme }) => theme.media.desktopAndAbove} {
    min-height: ${({ theme }) => `calc(100svh - (${theme.spacing.sp64} + ${theme.spacing.sp4}))`};
  }

  ${({ theme }) => theme.media.desktopAndBelow} {
    align-items: flex-start;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sp40};
    padding: ${({ theme }) => `calc(${theme.spacing.sp56} + ${theme.spacing.sp4})`}
      ${({ theme }) => theme.spacing.sp40} ${({ theme }) => theme.spacing.sp40};
    min-height: ${({ theme }) => `calc(100svh - (${theme.spacing.sp64} + ${theme.spacing.sp4}))`};
  }

  ${({ theme }) => theme.media.mobileAndBelow} {
    padding: ${({ theme }) => theme.spacing.sp40}
      ${({ theme }) => `calc(${theme.spacing.sp16} + ${theme.spacing.sp4})`}
      ${({ theme }) => theme.spacing.sp32};
    gap: ${({ theme }) => theme.spacing.sp32};
    min-height: ${({ theme }) => `calc(100svh - (${theme.spacing.sp64} + ${theme.spacing.sp4}))`};
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

const nudgeDown = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(0.375rem); }
`

const ScrollIndicator = styled.a<{ $hidden: boolean }>`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.sp16};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sp4};
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.75rem;
  text-decoration: none;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  pointer-events: ${({ $hidden }) => ($hidden ? "none" : "auto")};
  transition: opacity 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }

  & > span:last-child {
    display: inline-flex;
    animation: ${nudgeDown} 1.6s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    & > span:last-child {
      animation: none;
    }
  }

  ${({ theme }) => theme.media.desktopAndBelow} {
    display: none;
  }
`

function useHasScrolled(thresholdPx: number): boolean {
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const update = (): void => setHasScrolled(window.scrollY > thresholdPx)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [thresholdPx])

  return hasScrolled
}

function HeroSection(): JSX.Element {
  const [framework, setFramework] = useState<Framework>("react")
  const hasScrolled = useHasScrolled(80)

  return (
    <HeroContainer id="hero" data-dashboard-section="hero">
      <TextColumn>
        <TextBox>
          <TopSection>
            <BadgeRow>
              <Badge variant={BadgeVariant.warning}>Work in progress</Badge>
              <Badge variant={BadgeVariant.info}>v{latestCoreVersion}</Badge>
            </BadgeRow>
            <Text variant={TextVariant.display} headingLevel={1}>
              One system, any brand.
            </Text>
          </TopSection>
          <Paragraph>
            Marwes UI is a themeable component library for React, Vue, and Svelte that adopts your
            brand. Every component is optimized for AI-assisted development and built with
            accessibility from the ground up.
          </Paragraph>
        </TextBox>
        <BadgeRow>
          <Badge>Framework-agnostic</Badge>
          <Badge>Static preset CSS</Badge>
          <Badge>Type-safe</Badge>
          <Badge>A11y-first</Badge>
          <Badge>Agent-readable</Badge>
        </BadgeRow>
        <LinkRow>
          <LinkButton href={`/docs/get-started/${framework}/`}>Get started</LinkButton>
          <LinkButton href="/docs/components/">Browse components</LinkButton>
          <LinkButton href="/docs/theming/">Theme your app</LinkButton>
          <LinkButton href="/docs/troubleshooting/">Troubleshoot</LinkButton>
          <LinkButton
            href="https://github.com/niklas-westman/marwes"
            iconRight={IconName.ArrowUpRight}
          >
            GitHub
          </LinkButton>
        </LinkRow>
      </TextColumn>
      <InstallationPanel activeTab={framework} onFrameworkChange={setFramework} />
      <ScrollIndicator href="#components" $hidden={hasScrolled} tabIndex={hasScrolled ? -1 : 0}>
        <span>Explore the components</span>
        <span>
          <Icon name={IconName.ArrowDown} decorative size={20} />
        </span>
      </ScrollIndicator>
    </HeroContainer>
  )
}

export { HeroSection }
