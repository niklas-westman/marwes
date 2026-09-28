import {
  Icon,
  IconButton,
  IconName,
  SegmentedControlField,
  SkipLink,
  ThemeMode,
  useThemeMode,
} from "@marwes-ui/react"
import type { SegmentedControlItem } from "@marwes-ui/react"
import type { ReactNode } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { createGlobalStyle } from "styled-components"
import styled from "styled-components"

import { MarwesLogo } from "../../components/Header"
import type { DocsSection } from "./component-docs-model"
import { docsScrollOffset, useDocsScrollspy } from "./use-docs-scrollspy"

const componentGroups = [
  { label: "Foundations", items: ["Icon"] },
  { label: "Actions", items: ["Button"] },
  {
    label: "Data display",
    items: ["Avatar", "Badge", "Card", "Progress bar", "Skeleton", "Stat tile"],
  },
  {
    label: "Data entry",
    items: ["Checkbox", "Date picker", "Input", "Radio", "Segmented control", "Slider", "Switch"],
  },
  { label: "Layout", items: ["Accordion", "Divider", "Spacing", "Tab"] },
  { label: "Navigation", items: ["Breadcrumb", "Pagination"] },
  { label: "Feedback", items: ["Banner", "Spinner", "Toast"] },
  { label: "Overlays", items: ["Context menu", "Dialog", "Drawer", "Tooltip"] },
  { label: "Typography", items: ["Heading", "Paragraph", "Text"] },
] as const

const themeItems: SegmentedControlItem[] = [
  {
    value: ThemeMode.light,
    icon: <Icon name={IconName.Sun} decorative size={14} />,
    ariaLabel: "Light mode",
  },
  {
    value: ThemeMode.dark,
    icon: <Icon name={IconName.Moon} decorative size={14} />,
    ariaLabel: "Dark mode",
  },
]

function siteHref(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`
}

const DocsMotionStyle = createGlobalStyle`
  html {
    scroll-behavior: smooth;
  }

  [data-docs-section] {
    scroll-margin-top: ${docsScrollOffset}px;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
`

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.color.background};
  color: ${({ theme }) => theme.color.text};
`

const SiteHeader = styled.header`
  position: sticky;
  z-index: 20;
  top: 0;
  display: grid;
  grid-template-columns: minmax(9rem, 1fr) auto minmax(9rem, 1fr);
  align-items: center;
  min-height: ${({ theme }) => `calc(${theme.spacing.sp64} + ${theme.spacing.sp4})`};
  padding: 0 ${({ theme }) => theme.spacing.sp32};
  border-bottom: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  background: color-mix(in srgb, ${({ theme }) => theme.color.background} 92%, transparent);
  backdrop-filter: blur(1rem);

  ${({ theme }) => theme.media.desktopAndBelow} {
    grid-template-columns: 1fr auto;
    padding: 0 ${({ theme }) => theme.spacing.sp24};
  }
`

const LogoLink = styled.a`
  display: inline-flex;
  width: fit-content;
  color: ${({ theme }) => theme.color.text};
`

const MainNavigation = styled.nav`
  display: flex;
  align-items: stretch;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.sp24};

  a {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-height: ${({ theme }) => `calc(${theme.spacing.sp64} + ${theme.spacing.sp4})`};
    color: ${({ theme }) => theme.color.textMuted};
    font-size: 0.8125rem;
    font-weight: 500;
    text-decoration: none;
  }

  a:hover,
  a[aria-current="page"] {
    color: ${({ theme }) => theme.color.text};
  }

  a[aria-current="page"]::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.125rem;
    background: ${({ theme }) => theme.color.primary.base};
    content: "";
  }

  ${({ theme }) => theme.media.desktopAndBelow} {
    display: none;
  }
`

const HeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sp8};

  .mw-segmented-control-field__label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`

const MobileMenuButton = styled(IconButton)`
  display: none;

  ${({ theme }) => theme.media.desktopAndBelow} {
    display: inline-flex;
  }
`

const MobileNavigation = styled.nav<{ $open: boolean }>`
  display: none;

  ${({ theme }) => theme.media.desktopAndBelow} {
    position: fixed;
    z-index: 19;
    top: ${({ theme }) => `calc(${theme.spacing.sp64} + ${theme.spacing.sp4})`};
    right: 0;
    left: 0;
    display: ${({ $open }) => ($open ? "grid" : "none")};
    gap: ${({ theme }) => theme.spacing.sp4};
    padding: ${({ theme }) => theme.spacing.sp16} ${({ theme }) => theme.spacing.sp24};
    border-bottom: 0.0625rem solid ${({ theme }) => theme.color.border};
    background: ${({ theme }) => theme.color.surfaceElevated};

    a {
      padding: ${({ theme }) => theme.spacing.sp12};
      border-radius: ${({ theme }) => theme.spacing.sp8};
      color: ${({ theme }) => theme.color.text};
      text-decoration: none;
    }

    a[aria-current="page"] {
      background: ${({ theme }) => theme.color.surfaceBrand};
      color: ${({ theme }) => theme.color.textBrand};
      font-weight: 600;
    }
  }
`

const DocsGrid = styled.div`
  display: grid;
  grid-template-columns: 15.5rem minmax(0, 1fr) 11.5rem;
  width: 100%;
  max-width: 100rem;
  margin: 0 auto;

  ${({ theme }) => theme.media.desktopAndBelow} {
    grid-template-columns: minmax(0, 1fr);
  }
`

const LeftRail = styled.aside`
  min-height: calc(100vh - 4.25rem);
  padding: ${({ theme }) => theme.spacing.sp24};
  border-right: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  background: ${({ theme }) => theme.color.surface};

  ${({ theme }) => theme.media.desktopAndBelow} {
    display: none;
  }
`

const RailInner = styled.div`
  position: sticky;
  top: ${({ theme }) => `calc(${theme.spacing.sp64} + ${theme.spacing.sp32})`};
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing.sp4};
`

const RailTitle = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sp12};
  font-size: 0.75rem;
  font-weight: 700;
`

const RailLink = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  min-height: 2rem;
  padding: ${({ theme }) => theme.spacing.sp4} ${({ theme }) => theme.spacing.sp8};
  border-left: 0.125rem solid
    ${({ $active, theme }) => ($active ? theme.color.primary.base : "transparent")};
  border-radius: 0 ${({ theme }) => theme.spacing.sp4} ${({ theme }) => theme.spacing.sp4} 0;
  background: ${({ $active, theme }) => ($active ? theme.color.surfaceBrand : "transparent")};
  color: ${({ $active, theme }) => ($active ? theme.color.textBrand : theme.color.textMuted)};
  font-size: 0.75rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  line-height: 1.35;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.color.text};
    background: ${({ theme }) => theme.color.surfaceElevated};
  }
`

const RailGroup = styled.div`
  margin: ${({ theme }) => theme.spacing.sp12} 0;
`

const RailGroupLabel = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sp2};
  font-size: 0.75rem;
  font-weight: 600;
`

const Main = styled.main`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.sp48};

  ${({ theme }) => theme.media.wideDesktopAndBelow} {
    padding: ${({ theme }) => theme.spacing.sp40} ${({ theme }) => theme.spacing.sp32};
  }

  ${({ theme }) => theme.media.mobileAndBelow} {
    padding: ${({ theme }) => theme.spacing.sp32} ${({ theme }) => theme.spacing.sp24};
  }
`

const Content = styled.div`
  width: 100%;
  max-width: 62rem;
  margin: 0 auto;
`

const RightRail = styled.aside`
  padding: ${({ theme }) => theme.spacing.sp32} ${({ theme }) => theme.spacing.sp16};
  border-left: 0.0625rem solid ${({ theme }) => theme.color.borderLow};

  ${({ theme }) => theme.media.desktopAndBelow} {
    display: none;
  }
`

const CompactPageNavigation = styled.details`
  display: none;
  margin-bottom: ${({ theme }) => theme.spacing.sp24};
  padding: ${({ theme }) => theme.spacing.sp12};
  border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  border-radius: ${({ theme }) => theme.spacing.sp8};
  background: ${({ theme }) => theme.color.surface};

  summary {
    color: ${({ theme }) => theme.color.text};
    font-size: 0.8125rem;
    font-weight: 700;
    cursor: pointer;
  }

  nav {
    display: grid;
    gap: ${({ theme }) => theme.spacing.sp4};
    margin-top: ${({ theme }) => theme.spacing.sp8};
  }

  ${({ theme }) => theme.media.desktopAndBelow} {
    display: block;
  }
`

const OnThisPage = styled.nav`
  position: sticky;
  top: ${({ theme }) => `calc(${theme.spacing.sp64} + ${theme.spacing.sp32})`};

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.sp8};
    font-size: 0.75rem;
    font-weight: 700;
  }
`

const PageLink = styled.a<{ $active: boolean }>`
  display: block;
  padding: ${({ theme }) => `${theme.spacing.sp4} 0 ${theme.spacing.sp4} ${theme.spacing.sp8}`};
  border-left: 0.125rem solid
    ${({ $active, theme }) => ($active ? theme.color.primary.base : theme.color.border)};
  color: ${({ $active, theme }) => ($active ? theme.color.primary.base : theme.color.textMuted)};
  font-size: 0.6875rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  line-height: 1.35;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }
`

function ThemeControl(): JSX.Element {
  const { mode, setMode } = useThemeMode()
  return (
    <SegmentedControlField
      label="Theme mode"
      segmentedControl={{
        items: themeItems,
        value: mode,
        onValueChange: (value) =>
          setMode(value === ThemeMode.dark ? ThemeMode.dark : ThemeMode.light),
        variant: "inverse",
        size: "sm",
      }}
    />
  )
}

const headerLinks = [
  ["Get started", "/docs/get-started/react/"],
  ["Components", "/docs/components/"],
  ["Theming", "/docs/theming/"],
  ["Accessibility", "/docs/accessibility/"],
  ["Troubleshoot", "/docs/troubleshooting/"],
] as const

function HeaderLinks({ onNavigate }: { onNavigate?: () => void }): JSX.Element {
  return (
    <>
      {headerLinks.map(([label, path]) => (
        <a
          key={label}
          href={siteHref(path)}
          aria-current={label === "Components" ? "page" : undefined}
          onClick={onNavigate}
        >
          {label}
        </a>
      ))}
    </>
  )
}

function DocumentationRail({ activeFamily }: { activeFamily: string }): JSX.Element {
  return (
    <LeftRail aria-label="Documentation navigation">
      <RailInner>
        <RailTitle>Documentation</RailTitle>
        <RailLink href={siteHref("/docs/get-started/react/")}>Introduction</RailLink>
        <RailLink href={siteHref("/docs/get-started/react/")}>Get started</RailLink>
        <RailLink href={siteHref("/docs/components/")}>Components</RailLink>
        {componentGroups.map((group) => (
          <RailGroup key={group.label}>
            <RailGroupLabel>{group.label}</RailGroupLabel>
            {group.items.map((item) => {
              const familySlug = item.toLowerCase().replaceAll(" ", "-")
              const active = familySlug === activeFamily.toLowerCase()
              return (
                <RailLink
                  key={item}
                  $active={active}
                  href={siteHref(`/docs/components/${familySlug}/`)}
                  aria-current={active ? "page" : undefined}
                  data-docs-family={familySlug}
                >
                  {item}
                </RailLink>
              )
            })}
          </RailGroup>
        ))}
        <RailLink href={siteHref("/docs/theming/")}>Theming</RailLink>
        <RailLink href={siteHref("/docs/accessibility/")}>Accessibility</RailLink>
        <RailLink href={siteHref("/docs/troubleshooting/")}>Troubleshoot</RailLink>
      </RailInner>
    </LeftRail>
  )
}

interface DocsShellProps {
  family: string
  sections: DocsSection[]
  children: ReactNode
}

function DocsShell({ family, sections, children }: DocsShellProps): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuControlRef = useRef<HTMLSpanElement>(null)
  const sectionIds = useMemo(() => sections.map(({ id }) => id), [sections])
  const { activeSection, selectSection } = useDocsScrollspy(sectionIds)

  useEffect(() => {
    if (!mobileMenuOpen) return
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return
      setMobileMenuOpen(false)
      window.requestAnimationFrame(() =>
        mobileMenuControlRef.current?.querySelector<HTMLButtonElement>("button")?.focus(),
      )
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [mobileMenuOpen])

  return (
    <Page>
      <DocsMotionStyle />
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SiteHeader data-docs-header>
        <LogoLink href={import.meta.env.BASE_URL} aria-label="Marwes homepage">
          <MarwesLogo />
        </LogoLink>
        <MainNavigation aria-label="Primary">
          <HeaderLinks />
        </MainNavigation>
        <HeaderActions>
          <ThemeControl />
          <span ref={mobileMenuControlRef}>
            <MobileMenuButton
              icon={mobileMenuOpen ? IconName.X : IconName.Menu}
              ariaLabel={mobileMenuOpen ? "Close documentation menu" : "Open documentation menu"}
              ariaExpanded={mobileMenuOpen}
              ariaControls="mobile-docs-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
            />
          </span>
        </HeaderActions>
      </SiteHeader>
      <MobileNavigation id="mobile-docs-navigation" $open={mobileMenuOpen} aria-label="Mobile">
        <HeaderLinks onNavigate={() => setMobileMenuOpen(false)} />
      </MobileNavigation>
      <DocsGrid>
        <DocumentationRail activeFamily={family} />
        <Main id="main-content">
          <Content>
            <CompactPageNavigation>
              <summary>On this page</summary>
              <nav aria-label="On this page (compact)">
                {sections.map((section) => {
                  const active = activeSection === section.id
                  return (
                    <PageLink
                      key={section.id}
                      href={`#${section.id}`}
                      $active={active}
                      aria-current={active ? "location" : undefined}
                      onClick={() => selectSection(section.id)}
                    >
                      {section.label}
                    </PageLink>
                  )
                })}
              </nav>
            </CompactPageNavigation>
            {children}
          </Content>
        </Main>
        <RightRail>
          <OnThisPage aria-label="On this page">
            <p>On this page</p>
            {sections.map((section) => {
              const active = activeSection === section.id
              return (
                <PageLink
                  key={section.id}
                  href={`#${section.id}`}
                  $active={active}
                  aria-current={active ? "location" : undefined}
                  onClick={() => selectSection(section.id)}
                >
                  {section.label}
                </PageLink>
              )
            })}
          </OnThisPage>
        </RightRail>
      </DocsGrid>
    </Page>
  )
}

export { DocsShell, siteHref }
