import { SkipLink, ThemeMode, useThemeMode } from "@marwes-ui/react"
import type { ReactNode } from "react"
import { useMemo } from "react"
import { createGlobalStyle } from "styled-components"
import styled from "styled-components"

import { Header } from "../../components/Header"
import type { DocsSection } from "./component-docs-model"
import { DocsInlineNavigationContext } from "./docs-inline-navigation"
import navigation from "./docs-navigation.json"
import { PageFooter } from "./docs-page-typography"
import { docsScrollOffset, useDocsScrollspy } from "./use-docs-scrollspy"

const { componentGroups, documentationLinks } = navigation
const getStartedBasePath = "/docs/get-started/"
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

const BrowseNavigation = styled.details`
  display: none;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  background: ${({ theme }) => theme.color.surface};

  summary {
    padding: ${({ theme }) => theme.spacing.sp12} ${({ theme }) => theme.spacing.sp24};
    font-size: 0.8125rem;
    line-height: 1.0625rem;
    font-weight: 600;
    cursor: pointer;
  }

  nav {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: ${({ theme }) => theme.spacing.sp16};
    padding: ${({ theme }) => theme.spacing.sp16} ${({ theme }) => theme.spacing.sp24};
  }

  ${({ theme }) => theme.media.desktopAndBelow} {
    display: block;
  }
`

const DocsGrid = styled.div`
  display: grid;
  grid-template-columns: 15.5rem minmax(0, 1fr) 11.5rem;
  width: 100%;
  max-width: ${({ theme }) => theme.breakpoint.wideDesktop}px;
  margin: ${({ theme }) => theme.spacing.sp16} auto;

  ${({ theme }) => theme.media.desktopAndBelow} {
    grid-template-columns: minmax(0, 1fr);
    padding: 0 ${({ theme }) => theme.spacing.sp16};
  }
`

const LeftRail = styled.aside`
  min-height: calc(100vh - 4.25rem);
  padding: ${({ theme }) => theme.spacing.sp16}
    ${({ theme }) => theme.spacing.sp16}
    ${({ theme }) => theme.spacing.sp16}
    ${({ theme }) => theme.spacing.sp80};

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
  background: ${({ theme }) => theme.color.surface};
  border-radius: 2rem;
  padding: ${({ theme }) => `clamp(${theme.spacing.sp16}, 3vw, ${theme.spacing.sp32})`};
`

const Content = styled.div`
  width: 100%;
  max-width: 62rem;
  margin: 0 auto;
  animation: docs-content-enter 180ms ease-out both;

  @keyframes docs-content-enter {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const RightRail = styled.aside`
  padding: ${({ theme }) => theme.spacing.sp16};

  ${({ theme }) => theme.media.desktopAndBelow} {
    display: none;
  }
`

const FooterContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.breakpoint.wideDesktop}px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.sp80}
    ${({ theme }) => theme.spacing.sp24};

  ${({ theme }) => theme.media.mobileAndBelow} {
    padding: 0 ${({ theme }) => `calc(${theme.spacing.sp16} + ${theme.spacing.sp4})`}
      ${({ theme }) => theme.spacing.sp24};
  }
`

const CompactPageNavigation = styled.nav`
  display: none;
  margin-top: ${({ theme }) => theme.spacing.sp24};

  > p {
    margin: 0 0 ${({ theme }) => theme.spacing.sp8};
    color: ${({ theme }) => theme.color.text};
    font-size: 0.8125rem;
    font-weight: 700;
  }

  > div {
    display: grid;
    gap: ${({ theme }) => theme.spacing.sp4};
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

// Get started has one page per framework but a single navigation entry.
function isDocumentationLinkActive(currentPath: string, linkPath: string): boolean {
  if (linkPath.startsWith(getStartedBasePath)) return currentPath.startsWith(getStartedBasePath)
  return currentPath === linkPath
}

function DocumentationRail({ currentPath }: { currentPath: string }): JSX.Element {
  return (
    <LeftRail aria-label="Documentation navigation">
      <RailInner>
        <RailTitle>Documentation</RailTitle>
        {documentationLinks.map(({ label, path }) => (
          <RailLink
            key={path}
            href={siteHref(path)}
            aria-current={isDocumentationLinkActive(currentPath, path) ? "page" : undefined}
            $active={isDocumentationLinkActive(currentPath, path)}
            data-docs-soft-nav
          >
            {label}
          </RailLink>
        ))}
        {componentGroups.map((group) => (
          <RailGroup key={group.label}>
            <RailGroupLabel>{group.label}</RailGroupLabel>
            {group.items.map((item) => {
              const familySlug = item.toLowerCase().replaceAll(" ", "-")
              const familyPath = `/docs/components/${familySlug}/`
              const active = familyPath === currentPath
              return (
                <RailLink
                  key={item}
                  $active={active}
                  href={siteHref(familyPath)}
                  aria-current={active ? "page" : undefined}
                  data-docs-soft-nav
                >
                  {item}
                </RailLink>
              )
            })}
          </RailGroup>
        ))}
      </RailInner>
    </LeftRail>
  )
}

interface DocsShellProps {
  currentPath: string
  sections: DocsSection[]
  children: ReactNode
}

function DocsShell({ currentPath, sections, children }: DocsShellProps): JSX.Element {
  const { mode, setMode } = useThemeMode()
  const sectionIds = useMemo(() => sections.map(({ id }) => id), [sections])
  const { activeSection, selectSection } = useDocsScrollspy(sectionIds)

  return (
    <Page>
      <DocsMotionStyle />
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Header
        docs
        currentPath={currentPath}
        isDark={mode === ThemeMode.dark}
        onToggleTheme={() => setMode(mode === ThemeMode.dark ? ThemeMode.light : ThemeMode.dark)}
      />
      <BrowseNavigation key={currentPath}>
        <summary>Browse docs</summary>
        <nav aria-label="Browse documentation">
          <div>
            <RailGroupLabel>Documentation</RailGroupLabel>
            {documentationLinks.map(({ label, path }) => (
              <RailLink
                key={path}
                href={siteHref(path)}
                $active={isDocumentationLinkActive(currentPath, path)}
                aria-current={isDocumentationLinkActive(currentPath, path) ? "page" : undefined}
                data-docs-soft-nav
              >
                {label}
              </RailLink>
            ))}
          </div>
          {componentGroups.map((group) => (
            <div key={group.label}>
              <RailGroupLabel>{group.label}</RailGroupLabel>
              {group.items.map((item) => {
                const path = `/docs/components/${item.toLowerCase().replaceAll(" ", "-")}/`
                return (
                  <RailLink
                    key={path}
                    href={siteHref(path)}
                    $active={currentPath === path}
                    aria-current={currentPath === path ? "page" : undefined}
                    data-docs-soft-nav
                  >
                    {item}
                  </RailLink>
                )
              })}
            </div>
          ))}
        </nav>
      </BrowseNavigation>
      <DocsGrid>
        <DocumentationRail currentPath={currentPath} />
        <Main id="main-content">
          <Content key={currentPath}>
            <DocsInlineNavigationContext.Provider
              value={
                <CompactPageNavigation aria-label="On this page (compact)">
                  <p>On this page</p>
                  <div>
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
                  </div>
                </CompactPageNavigation>
              }
            >
              {children}
            </DocsInlineNavigationContext.Provider>
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
      <FooterContainer>
        <PageFooter>
          <span>Marwes — /mɑːr.wɛz/</span>
          <a href={siteHref("/docs/components/")} data-docs-soft-nav>
            Browse all components
          </a>
        </PageFooter>
      </FooterContainer>
    </Page>
  )
}

export { DocsShell, siteHref }
