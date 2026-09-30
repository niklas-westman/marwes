import type { CompatibilityPageModel } from "./compatibility-model"
import { CompatibilityPage } from "./compatibility-page"
import { DocsPageShellRoot } from "./docs-page-shell-root"
import { DocsShell } from "./docs-shell"

function parseCompatibilityPageModel(source: unknown): CompatibilityPageModel {
  if (!source || typeof source !== "object") {
    throw new TypeError("Compatibility page model must be an object")
  }
  const candidate = source as Record<string, unknown>
  if (
    candidate.schemaVersion !== 1 ||
    typeof candidate.title !== "string" ||
    !Array.isArray(candidate.requirements) ||
    !Array.isArray(candidate.sections)
  ) {
    throw new TypeError("Compatibility page model does not match schema version 1")
  }
  return source as CompatibilityPageModel
}

function readEmbeddedCompatibilityPageModel(
  documentRoot: Document = document,
): CompatibilityPageModel {
  const source = documentRoot.getElementById("compatibility-model")
  if (!source?.textContent) {
    throw new Error("Missing #compatibility-model JSON")
  }

  try {
    return parseCompatibilityPageModel(JSON.parse(source.textContent))
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new TypeError("Compatibility page model contains invalid JSON", { cause: error })
    }
    throw error
  }
}

function CompatibilityApp({ model }: { model: CompatibilityPageModel }): JSX.Element {
  return (
    <DocsPageShellRoot>
      <DocsShell currentPath="/docs/compatibility/" sections={model.sections}>
        <CompatibilityPage model={model} />
      </DocsShell>
    </DocsPageShellRoot>
  )
}

export { CompatibilityApp, parseCompatibilityPageModel, readEmbeddedCompatibilityPageModel }
