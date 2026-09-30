import type { ContributingPageModel } from "./contributing-model"
import { ContributingPage } from "./contributing-page"
import { DocsPageShellRoot } from "./docs-page-shell-root"
import { DocsShell } from "./docs-shell"

function parseContributingPageModel(source: unknown): ContributingPageModel {
  if (!source || typeof source !== "object") {
    throw new TypeError("Contributing page model must be an object")
  }
  const candidate = source as Record<string, unknown>
  if (
    candidate.schemaVersion !== 1 ||
    typeof candidate.title !== "string" ||
    !Array.isArray(candidate.sections)
  ) {
    throw new TypeError("Contributing page model does not match schema version 1")
  }
  return source as ContributingPageModel
}

function readEmbeddedContributingPageModel(
  documentRoot: Document = document,
): ContributingPageModel {
  const source = documentRoot.getElementById("contributing-model")
  if (!source?.textContent) {
    throw new Error("Missing #contributing-model JSON")
  }

  try {
    return parseContributingPageModel(JSON.parse(source.textContent))
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new TypeError("Contributing page model contains invalid JSON", { cause: error })
    }
    throw error
  }
}

function ContributingApp({ model }: { model: ContributingPageModel }): JSX.Element {
  return (
    <DocsPageShellRoot>
      <DocsShell currentPath="/docs/contributing/" sections={model.sections}>
        <ContributingPage model={model} />
      </DocsShell>
    </DocsPageShellRoot>
  )
}

export { ContributingApp, parseContributingPageModel, readEmbeddedContributingPageModel }
