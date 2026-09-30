import type { CatalogPageModel } from "./catalog-model"
import { CatalogPage } from "./catalog-page"
import { DocsPageShellRoot } from "./docs-page-shell-root"
import { DocsShell } from "./docs-shell"

function parseCatalogPageModel(source: unknown): CatalogPageModel {
  if (!source || typeof source !== "object") {
    throw new TypeError("Catalog page model must be an object")
  }
  const candidate = source as Record<string, unknown>
  if (
    candidate.schemaVersion !== 1 ||
    typeof candidate.title !== "string" ||
    !Array.isArray(candidate.entries) ||
    !Array.isArray(candidate.sections)
  ) {
    throw new TypeError("Catalog page model does not match schema version 1")
  }
  return source as CatalogPageModel
}

function readEmbeddedCatalogPageModel(documentRoot: Document = document): CatalogPageModel {
  const source = documentRoot.getElementById("catalog-model")
  if (!source?.textContent) {
    throw new Error("Missing #catalog-model JSON")
  }

  try {
    return parseCatalogPageModel(JSON.parse(source.textContent))
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new TypeError("Catalog page model contains invalid JSON", { cause: error })
    }
    throw error
  }
}

function CatalogApp({ model }: { model: CatalogPageModel }): JSX.Element {
  return (
    <DocsPageShellRoot>
      <DocsShell currentPath="/docs/components/" sections={model.sections}>
        <CatalogPage model={model} />
      </DocsShell>
    </DocsPageShellRoot>
  )
}

export { CatalogApp, parseCatalogPageModel, readEmbeddedCatalogPageModel }
