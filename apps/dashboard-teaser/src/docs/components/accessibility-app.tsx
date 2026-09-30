import type { AccessibilityPageModel } from "./accessibility-model"
import { AccessibilityPage } from "./accessibility-page"
import { DocsPageShellRoot } from "./docs-page-shell-root"
import { DocsShell } from "./docs-shell"

function parseAccessibilityPageModel(source: unknown): AccessibilityPageModel {
  if (!source || typeof source !== "object") {
    throw new TypeError("Accessibility page model must be an object")
  }
  const candidate = source as Record<string, unknown>
  if (
    candidate.schemaVersion !== 1 ||
    typeof candidate.title !== "string" ||
    !Array.isArray(candidate.requirements) ||
    !Array.isArray(candidate.sections)
  ) {
    throw new TypeError("Accessibility page model does not match schema version 1")
  }
  return source as AccessibilityPageModel
}

function readEmbeddedAccessibilityPageModel(
  documentRoot: Document = document,
): AccessibilityPageModel {
  const source = documentRoot.getElementById("accessibility-model")
  if (!source?.textContent) {
    throw new Error("Missing #accessibility-model JSON")
  }

  try {
    return parseAccessibilityPageModel(JSON.parse(source.textContent))
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new TypeError("Accessibility page model contains invalid JSON", { cause: error })
    }
    throw error
  }
}

function AccessibilityApp({ model }: { model: AccessibilityPageModel }): JSX.Element {
  return (
    <DocsPageShellRoot>
      <DocsShell currentPath="/docs/accessibility/" sections={model.sections}>
        <AccessibilityPage model={model} />
      </DocsShell>
    </DocsPageShellRoot>
  )
}

export { AccessibilityApp, parseAccessibilityPageModel, readEmbeddedAccessibilityPageModel }
