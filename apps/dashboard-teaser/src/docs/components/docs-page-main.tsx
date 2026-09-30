import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { AccessibilityPage } from "./accessibility-page"
import { AiPage } from "./ai-page"
import { CatalogPage } from "./catalog-page"
import { CompatibilityPage } from "./compatibility-page"
import { ComponentDocsPage } from "./component-docs-page"
import { ContributingPage } from "./contributing-page"
import { attachDocsClientRouter, readPageFrom } from "./docs-client-router"
import type { DocsPage } from "./docs-client-router"
import { DocsPageShellRoot } from "./docs-page-shell-root"
import { DocsShell } from "./docs-shell"
import { getFamilyShowcase } from "./family-showcases"
import { GetStartedPage } from "./get-started-page"
import { IntroductionPage } from "./introduction-page"
import { ThemingPage } from "./theming-page"
import { TroubleshootingPage } from "./troubleshooting-page"

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Missing #root element")

const root = createRoot(rootElement)

function currentPathFor(page: DocsPage): string {
  switch (page.kind) {
    case "component":
      return `/docs/components/${page.model.family}/`
    case "get-started":
      return `/docs/get-started/${page.model.framework}/`
    case "introduction":
      return "/docs/introduction/"
    case "catalog":
      return "/docs/components/"
    case "theming":
      return "/docs/theming/"
    case "accessibility":
      return "/docs/accessibility/"
    case "troubleshooting":
      return "/docs/troubleshooting/"
    case "compatibility":
      return "/docs/compatibility/"
    case "ai":
      return "/docs/ai/"
    case "contributing":
      return "/docs/contributing/"
  }
}

function pageBody(page: DocsPage): JSX.Element {
  switch (page.kind) {
    case "component":
      return (
        <ComponentDocsPage model={page.model} Showcase={getFamilyShowcase(page.model.family)} />
      )
    case "get-started":
      return <GetStartedPage model={page.model} />
    case "introduction":
      return <IntroductionPage model={page.model} />
    case "catalog":
      return <CatalogPage model={page.model} />
    case "theming":
      return <ThemingPage model={page.model} />
    case "accessibility":
      return <AccessibilityPage model={page.model} />
    case "troubleshooting":
      return <TroubleshootingPage model={page.model} />
    case "compatibility":
      return <CompatibilityPage model={page.model} />
    case "ai":
      return <AiPage model={page.model} />
    case "contributing":
      return <ContributingPage model={page.model} />
  }
}

function renderPage(page: DocsPage): void {
  root.render(
    <StrictMode>
      <DocsPageShellRoot>
        <DocsShell currentPath={currentPathFor(page)} sections={page.model.sections}>
          {pageBody(page)}
        </DocsShell>
      </DocsPageShellRoot>
    </StrictMode>,
  )
}

const initialPage = readPageFrom(document)
if (!initialPage) throw new Error("Missing an embedded docs page model")

renderPage(initialPage)
attachDocsClientRouter({ renderPage })
