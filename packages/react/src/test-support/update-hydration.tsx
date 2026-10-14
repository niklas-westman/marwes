/**
 * Test support: renders React UI on the server and hydrates it, for the shared hydration contracts.
 */
import { act, render } from "@testing-library/react"
import type * as React from "react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach } from "vitest"
import { captureConsoleIssues } from "../../../../tests/contracts/support/console-issues"
import { trackHydrationNodes } from "../../../../tests/contracts/support/hydration-nodes"
import { MarwesProvider } from "../provider/marwes-provider"

type HydratedRoot = ReturnType<typeof hydrateRoot>

const hydratedRoots: HydratedRoot[] = []

export function unmountHydratedApps(): void {
  for (const root of hydratedRoots.splice(0)) {
    act(() => root.unmount())
  }
  document.body.innerHTML = ""
}

afterEach(unmountHydratedApps)

function withProvider(ui: React.ReactElement): React.ReactElement {
  return <MarwesProvider>{ui}</MarwesProvider>
}

async function hydrateFromServerMarkup(
  ui: React.ReactElement,
  onHydrated: (root: HydratedRoot) => void,
  onServerIssues: (issues: string[]) => void,
): Promise<string[]> {
  const element = withProvider(ui)
  const container = document.createElement("div")
  const serverCapture = captureConsoleIssues()
  try {
    container.innerHTML = renderToString(element)
  } finally {
    onServerIssues(serverCapture.stop())
  }
  document.body.append(container)
  const checkNodes = trackHydrationNodes(container)
  const capture = captureConsoleIssues()
  try {
    await act(async () => {
      const root = hydrateRoot(container, element, {
        onRecoverableError: (error) => capture.issues.push(String(error)),
      })
      hydratedRoots.push(root)
      onHydrated(root)
    })
    capture.issues.push(...checkNodes())
    return capture.issues
  } finally {
    capture.stop()
  }
}

export interface UpdateHydrationHarness<Props> {
  render(props: Props): void
  rerender(props: Props): void
  hydrate(props: Props): Promise<string[]>
  getServerIssues(): string[]
}

export function createUpdateHydrationHarness<Props>(
  renderUi: (props: Props) => React.ReactElement,
): UpdateHydrationHarness<Props> {
  let rendered: ReturnType<typeof render> | undefined
  let hydratedRoot: HydratedRoot | undefined
  let serverIssues: string[] = []

  return {
    render(props: Props) {
      hydratedRoot = undefined
      rendered = render(withProvider(renderUi(props)))
    },
    rerender(props: Props) {
      if (hydratedRoot) {
        act(() => hydratedRoot?.render(withProvider(renderUi(props))))
        return
      }
      rendered?.rerender(withProvider(renderUi(props)))
    },
    hydrate: (props: Props) =>
      hydrateFromServerMarkup(
        renderUi(props),
        (root) => {
          hydratedRoot = root
        },
        (issues) => {
          serverIssues = issues
        },
      ),
    getServerIssues: () => [...serverIssues],
  }
}
