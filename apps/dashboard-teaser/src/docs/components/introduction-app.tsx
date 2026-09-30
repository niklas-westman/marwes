import { DocsPageShellRoot } from "./docs-page-shell-root"
import { DocsShell } from "./docs-shell"
import type { IntroductionPageModel } from "./introduction-model"
import { IntroductionPage } from "./introduction-page"

function parseIntroductionPageModel(source: unknown): IntroductionPageModel {
  if (!source || typeof source !== "object") {
    throw new TypeError("Introduction page model must be an object")
  }
  const candidate = source as Record<string, unknown>
  if (
    candidate.schemaVersion !== 1 ||
    typeof candidate.title !== "string" ||
    !Array.isArray(candidate.topics) ||
    !Array.isArray(candidate.sections)
  ) {
    throw new TypeError("Introduction page model does not match schema version 1")
  }
  return source as IntroductionPageModel
}

function readEmbeddedIntroductionPageModel(
  documentRoot: Document = document,
): IntroductionPageModel {
  const source = documentRoot.getElementById("introduction-model")
  if (!source?.textContent) {
    throw new Error("Missing #introduction-model JSON")
  }

  try {
    return parseIntroductionPageModel(JSON.parse(source.textContent))
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new TypeError("Introduction page model contains invalid JSON", { cause: error })
    }
    throw error
  }
}

function IntroductionApp({ model }: { model: IntroductionPageModel }): JSX.Element {
  return (
    <DocsPageShellRoot>
      <DocsShell currentPath="/docs/introduction/" sections={model.sections}>
        <IntroductionPage model={model} />
      </DocsShell>
    </DocsPageShellRoot>
  )
}

export { IntroductionApp, parseIntroductionPageModel, readEmbeddedIntroductionPageModel }
