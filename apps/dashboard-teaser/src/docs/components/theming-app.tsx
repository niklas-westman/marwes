import { DocsPageShellRoot } from "./docs-page-shell-root"
import { DocsShell } from "./docs-shell"
import type { ThemingPageModel } from "./theming-model"
import { ThemingPage } from "./theming-page"

function parseThemingPageModel(source: unknown): ThemingPageModel {
  if (!source || typeof source !== "object") {
    throw new TypeError("Theming page model must be an object")
  }
  const candidate = source as Record<string, unknown>
  if (
    candidate.schemaVersion !== 1 ||
    typeof candidate.title !== "string" ||
    typeof candidate.heading !== "string" ||
    !Array.isArray(candidate.sections)
  ) {
    throw new TypeError("Theming page model does not match schema version 1")
  }
  return source as ThemingPageModel
}

function readEmbeddedThemingPageModel(documentRoot: Document = document): ThemingPageModel {
  const source = documentRoot.getElementById("theming-model")
  if (!source?.textContent) {
    throw new Error("Missing #theming-model JSON")
  }

  try {
    return parseThemingPageModel(JSON.parse(source.textContent))
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new TypeError("Theming page model contains invalid JSON", { cause: error })
    }
    throw error
  }
}

function ThemingApp({ model }: { model: ThemingPageModel }): JSX.Element {
  return (
    <DocsPageShellRoot>
      <DocsShell currentPath="/docs/theming/" sections={model.sections}>
        <ThemingPage model={model} />
      </DocsShell>
    </DocsPageShellRoot>
  )
}

export { parseThemingPageModel, readEmbeddedThemingPageModel, ThemingApp }
