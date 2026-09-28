import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ComponentDocsApp, readEmbeddedComponentDocsPageModel } from "./component-docs-app"
import type { ComponentDocsPageModel } from "./component-docs-model"
import { attachDocsClientRouter } from "./docs-client-router"

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Missing #root element")

const root = createRoot(rootElement)

function renderModel(model: ComponentDocsPageModel): void {
  root.render(
    <StrictMode>
      <ComponentDocsApp model={model} />
    </StrictMode>,
  )
}

renderModel(readEmbeddedComponentDocsPageModel())
attachDocsClientRouter({ renderModel })
