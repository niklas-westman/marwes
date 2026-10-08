import { hydrate, unmount } from "svelte"
import { inject } from "vitest"
import { captureConsoleIssues } from "../../../../../tests/contracts/support/console-issues"

type HydratedApp = ReturnType<typeof hydrate>

const hydratedApps: HydratedApp[] = []

async function renderOnServer(
  componentPath: string,
  props: Record<string, unknown>,
): Promise<string> {
  const response = await fetch(`http://127.0.0.1:${inject("ssrRenderPort")}`, {
    method: "POST",
    body: JSON.stringify({ componentPath, props }),
  })
  const markup = await response.text()

  if (!response.ok) {
    throw new Error(`Server render of ${componentPath} failed: ${markup}`)
  }

  return markup
}

/**
 * Renders the component on the server with the serializable props, mounts that markup, then
 * hydrates it on the client with the full props. Resolves with warnings reported while hydrating.
 */
export async function hydrateFromServerMarkup(options: {
  componentPath: string
  component: Parameters<typeof hydrate>[0]
  serverProps: Record<string, unknown>
  clientProps: Record<string, unknown>
}): Promise<string[]> {
  const container = document.createElement("div")
  container.innerHTML = await renderOnServer(options.componentPath, options.serverProps)
  document.body.append(container)

  const capture = captureConsoleIssues()
  hydratedApps.push(
    hydrate(options.component, { target: container, props: options.clientProps } as never),
  )

  return capture.stop()
}

export async function unmountHydratedApps(): Promise<void> {
  for (const app of hydratedApps.splice(0)) {
    await unmount(app)
  }
}
