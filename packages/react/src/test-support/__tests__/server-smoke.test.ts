import { type ComponentType, createElement } from "react"
import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { captureConsoleIssues } from "../../../../../tests/contracts/support/console-issues"
import {
  hydrationSmokeComponentNames,
  hydrationSmokeProps,
} from "../../../../../tests/contracts/support/hydration-smoke-cases"
import * as components from "../../index"
import { MarwesProvider } from "../../provider/marwes-provider"

const serverNames = [
  ...hydrationSmokeComponentNames,
  "MarwesThemeScript",
  "MarwesThemeStyle",
] as const

function renderComponent(name: (typeof serverNames)[number]): string {
  const Component = components[name] as ComponentType<Record<string, unknown>>
  return renderToString(
    createElement(
      MarwesProvider,
      null,
      createElement(
        Component,
        name === "MarwesThemeScript" || name === "MarwesThemeStyle"
          ? {}
          : hydrationSmokeProps(name),
        ...(name === "Divider" || name === "MarwesThemeScript" || name === "MarwesThemeStyle"
          ? []
          : ["Server content"]),
      ),
    ),
  )
}

describe("Node server component smoke", () => {
  it("imports the public adapter without browser globals", () => {
    expect(typeof window).toBe("undefined")
    expect(typeof document).toBe("undefined")
    expect(components.MarwesProvider).toBeDefined()
  })
  for (const name of serverNames) {
    it(`server renders ${name} without warnings`, async () => {
      const capture = captureConsoleIssues()
      try {
        expect(typeof (await renderComponent(name))).toBe("string")
        expect(capture.issues).toEqual([])
      } finally {
        capture.stop()
      }
    })
  }
  it("keeps generated ids unique across sibling fields/providers", async () => {
    const markup = renderToString(
      createElement(
        MarwesProvider,
        null,
        createElement(components.InputField, { label: "First", input: {} }),
        createElement(
          MarwesProvider,
          null,
          createElement(components.InputField, { label: "Second", input: {} }),
        ),
      ),
    )
    const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
    expect(ids.length).toBeGreaterThanOrEqual(2)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it("isolates ids between concurrent renders", async () => {
    const results = await Promise.all(
      Array.from({ length: 4 }, () => renderComponent("InputField")),
    )
    expect(new Set(results).size).toBe(1)
  })
})

describe("initially-open modal server probes", () => {
  for (const name of ["DialogModal", "ConfirmDialog", "DestructiveDialog", "InfoDialog"] as const) {
    it(`records ${name} server content and portal output`, async () => {
      const capture = captureConsoleIssues()
      try {
        const markup = renderToString(
          createElement(
            MarwesProvider,
            null,
            createElement(components[name], { open: true, title: "Initial modal" }),
          ),
        )
        expect(markup).not.toContain('role="dialog"')
        console.info(
          JSON.stringify({
            adapter: "react",
            scenario: name,
            initialOpen: true,
            serverContent: false,
            status: "blocked",
            reason: "Server omits open modal content; first client render creates a portal",
          }),
        )
        expect(capture.issues).toEqual([])
      } finally {
        capture.stop()
      }
    })
  }
})

it("includes the RichText value in initial server HTML", async () => {
  expect(await renderComponent("RichTextField")).toContain("Server notes")
})
