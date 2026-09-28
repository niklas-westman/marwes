import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ComponentDocsApp, readEmbeddedComponentDocsPageModel } from "./component-docs-app"

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Missing #root element")

const model = readEmbeddedComponentDocsPageModel()

createRoot(rootElement).render(
  <StrictMode>
    <ComponentDocsApp model={model} />
  </StrictMode>,
)
