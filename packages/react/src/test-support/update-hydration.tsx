/**
 * Test support: renders React UI on the server and hydrates it, for the shared hydration contracts.
 */
import { act, render } from "@testing-library/react"
import type * as React from "react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach } from "vitest"
import { captureConsoleIssues } from "../../../../tests/contracts/support/console-issues"
import { MarwesProvider } from "../provider/marwes-provider"

type HydratedRoot = ReturnType<typeof hydrateRoot>

const hydratedRoots: HydratedRoot[] = []

afterEach(() => {
  for (const root of hydratedRoots.splice(0)) {
    act(() => root.unmount())
  }
  document.body.innerHTML = ""
})

function withProvider(ui: React.ReactElement): React.ReactElement {
  return <MarwesProvider>{ui}</MarwesProvider>
}

async function hydrateFromServerMarkup(ui: React.ReactElement): Promise<string[]> {
  const element = withProvider(ui)
  const container = document.createElement("div")
  container.innerHTML = renderToString(element)
  document.body.append(container)

  const capture = captureConsoleIssues()
  await act(async () => {
    hydratedRoots.push(
      hydrateRoot(container, element, {
        onRecoverableError: (error) => capture.issues.push(String(error)),
      }),
    )
  })

  return capture.stop()
}

export function createUpdateHydrationHarness<Props>(
  renderUi: (props: Props) => React.ReactElement,
) {
  let rendered: ReturnType<typeof render> | undefined

  return {
    render(props: Props) {
      rendered = render(withProvider(renderUi(props)))
    },
    rerender(props: Props) {
      rendered?.rerender(withProvider(renderUi(props)))
    },
    hydrate: (props: Props) => hydrateFromServerMarkup(renderUi(props)),
  }
}
