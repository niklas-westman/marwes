import { DocsPageShellRoot } from "./docs-page-shell-root"
import type { GetStartedPageModel } from "./get-started-model"
import { GetStartedPage } from "./get-started-page"

function parseGetStartedPageModel(source: unknown): GetStartedPageModel {
  if (!source || typeof source !== "object") {
    throw new TypeError("Get started page model must be an object")
  }
  const candidate = source as Record<string, unknown>
  if (
    candidate.schemaVersion !== 1 ||
    typeof candidate.framework !== "string" ||
    typeof candidate.title !== "string" ||
    !Array.isArray(candidate.steps) ||
    !Array.isArray(candidate.sections)
  ) {
    throw new TypeError("Get started page model does not match schema version 1")
  }
  return source as GetStartedPageModel
}

function readEmbeddedGetStartedPageModel(documentRoot: Document = document): GetStartedPageModel {
  const source = documentRoot.getElementById("get-started-model")
  if (!source?.textContent) {
    throw new Error("Missing #get-started-model JSON")
  }

  try {
    return parseGetStartedPageModel(JSON.parse(source.textContent))
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new TypeError("Get started page model contains invalid JSON", { cause: error })
    }
    throw error
  }
}

function GetStartedApp({ model }: { model: GetStartedPageModel }): JSX.Element {
  return (
    <DocsPageShellRoot>
      <GetStartedPage model={model} />
    </DocsPageShellRoot>
  )
}

export { GetStartedApp, parseGetStartedPageModel, readEmbeddedGetStartedPageModel }
