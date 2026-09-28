import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ComponentDocsApp } from "./component-docs-app"
import { attachDocsClientRouter, readPageFrom } from "./docs-client-router"
import type { DocsPage } from "./docs-client-router"
import { getFamilyShowcase } from "./family-showcases"
import { GetStartedApp } from "./get-started-app"
import { IntroductionApp } from "./introduction-app"

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Missing #root element")

const root = createRoot(rootElement)

function renderPage(page: DocsPage): void {
  const content =
    page.kind === "component" ? (
      <ComponentDocsApp model={page.model} Showcase={getFamilyShowcase(page.model.family)} />
    ) : page.kind === "get-started" ? (
      <GetStartedApp model={page.model} />
    ) : (
      <IntroductionApp model={page.model} />
    )

  root.render(<StrictMode>{content}</StrictMode>)
}

const initialPage = readPageFrom(document)
if (!initialPage) throw new Error("Missing an embedded docs page model")

renderPage(initialPage)
attachDocsClientRouter({ renderPage })
