import { DocsPageShellRoot } from "./docs-page-shell-root"
import { DocsShell } from "./docs-shell"
import type { TroubleshootingPageModel } from "./troubleshooting-model"
import { TroubleshootingPage } from "./troubleshooting-page"

function parseTroubleshootingPageModel(source: unknown): TroubleshootingPageModel {
  if (!source || typeof source !== "object") {
    throw new TypeError("Troubleshooting page model must be an object")
  }
  const candidate = source as Record<string, unknown>
  if (
    candidate.schemaVersion !== 1 ||
    typeof candidate.title !== "string" ||
    !Array.isArray(candidate.issues) ||
    !Array.isArray(candidate.sections)
  ) {
    throw new TypeError("Troubleshooting page model does not match schema version 1")
  }
  return source as TroubleshootingPageModel
}

function readEmbeddedTroubleshootingPageModel(
  documentRoot: Document = document,
): TroubleshootingPageModel {
  const source = documentRoot.getElementById("troubleshooting-model")
  if (!source?.textContent) {
    throw new Error("Missing #troubleshooting-model JSON")
  }

  try {
    return parseTroubleshootingPageModel(JSON.parse(source.textContent))
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new TypeError("Troubleshooting page model contains invalid JSON", { cause: error })
    }
    throw error
  }
}

function TroubleshootingApp({ model }: { model: TroubleshootingPageModel }): JSX.Element {
  return (
    <DocsPageShellRoot>
      <DocsShell currentPath="/docs/troubleshooting/" sections={model.sections}>
        <TroubleshootingPage model={model} />
      </DocsShell>
    </DocsPageShellRoot>
  )
}

export { parseTroubleshootingPageModel, readEmbeddedTroubleshootingPageModel, TroubleshootingApp }
