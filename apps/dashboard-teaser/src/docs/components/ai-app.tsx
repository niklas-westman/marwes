import type { AiPageModel } from "./ai-model"
import { AiPage } from "./ai-page"
import { DocsPageShellRoot } from "./docs-page-shell-root"
import { DocsShell } from "./docs-shell"

function parseAiPageModel(source: unknown): AiPageModel {
  if (!source || typeof source !== "object") {
    throw new TypeError("AI page model must be an object")
  }
  const candidate = source as Record<string, unknown>
  if (
    candidate.schemaVersion !== 1 ||
    typeof candidate.title !== "string" ||
    !Array.isArray(candidate.resources) ||
    !Array.isArray(candidate.sections)
  ) {
    throw new TypeError("AI page model does not match schema version 1")
  }
  return source as AiPageModel
}

function readEmbeddedAiPageModel(documentRoot: Document = document): AiPageModel {
  const source = documentRoot.getElementById("ai-model")
  if (!source?.textContent) {
    throw new Error("Missing #ai-model JSON")
  }

  try {
    return parseAiPageModel(JSON.parse(source.textContent))
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new TypeError("AI page model contains invalid JSON", { cause: error })
    }
    throw error
  }
}

function AiApp({ model }: { model: AiPageModel }): JSX.Element {
  return (
    <DocsPageShellRoot>
      <DocsShell currentPath="/docs/ai/" sections={model.sections}>
        <AiPage model={model} />
      </DocsShell>
    </DocsPageShellRoot>
  )
}

export { AiApp, parseAiPageModel, readEmbeddedAiPageModel }
