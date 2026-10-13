import { hydrate, tick, unmount } from "svelte"
import { inject } from "vitest"
import { captureConsoleIssues } from "../../../../../tests/contracts/support/console-issues"
import { trackHydrationNodes } from "../../../../../tests/contracts/support/hydration-nodes"
import ReactiveHydrationHost from "../type-fixtures/ReactiveHydrationHost.svelte"

type HydratedApp = ReturnType<typeof hydrate>

const hydratedApps: HydratedApp[] = []

async function renderOnServer(
  componentPath: string,
  props: Record<string, unknown>,
  reactive = false,
): Promise<string> {
  const response = await fetch(`http://127.0.0.1:${inject("ssrRenderPort")}`, {
    method: "POST",
    body: JSON.stringify({ componentPath, props, reactive }),
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
  onHydrated?: (update: (props: Record<string, unknown>) => void) => void
}): Promise<string[]> {
  const container = document.createElement("div")
  container.innerHTML = await renderOnServer(
    options.componentPath,
    options.serverProps,
    !!options.onHydrated,
  )
  document.body.append(container)

  const checkNodes = trackHydrationNodes(container)
  const capture = captureConsoleIssues()
  try {
    if (options.onHydrated) {
      const app = hydrate(ReactiveHydrationHost, {
        target: container,
        props: { component: options.component as never, componentProps: options.clientProps },
      })
      hydratedApps.push(app)
      options.onHydrated((props) => app.updateProps(props))
    } else {
      hydratedApps.push(
        hydrate(options.component, { target: container, props: options.clientProps } as never),
      )
    }
    await tick()
    capture.issues.push(...checkNodes())
    return capture.issues
  } finally {
    capture.stop()
  }
}

export async function unmountHydratedApps(): Promise<void> {
  for (const app of hydratedApps.splice(0)) {
    await unmount(app)
  }
}
