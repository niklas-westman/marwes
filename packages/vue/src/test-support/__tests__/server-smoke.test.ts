import { describe, expect, it } from "vitest"
import { createSSRApp, defineComponent, h } from "vue"
import { renderToString } from "vue/server-renderer"
import { captureConsoleIssues } from "../../../../../tests/contracts/support/console-issues"
import {
  hydrationSmokeComponentNames,
  hydrationSmokeProps,
} from "../../../../../tests/contracts/support/hydration-smoke-cases"
import * as components from "../../index"
import { MarwesProvider } from "../../provider/marwes-provider"

async function renderComponent(
  name: (typeof hydrationSmokeComponentNames)[number],
): Promise<string> {
  const Host = defineComponent({
    setup: () => () =>
      h(MarwesProvider, null, {
        default: () =>
          h(components[name] as never, hydrationSmokeProps(name), {
            default: () => "Server content",
          }),
      }),
  })
  return renderToString(createSSRApp(Host))
}

describe("Node server component smoke", () => {
  it("imports the public adapter without browser globals", () => {
    expect(typeof window).toBe("undefined")
    expect(typeof document).toBe("undefined")
    expect(components.MarwesProvider).toBeDefined()
  })
  for (const name of hydrationSmokeComponentNames) {
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
    const Host = defineComponent({
      setup: () => () =>
        h(MarwesProvider, null, {
          default: () => [
            h(components.InputField, { label: "First", input: {} }),
            h(MarwesProvider, null, {
              default: () => h(components.InputField, { label: "Second", input: {} }),
            }),
          ],
        }),
    })
    const markup = await renderToString(createSSRApp(Host))
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
        const context: { teleports?: Record<string, string> } = {}
        const Host = defineComponent({
          setup: () => () =>
            h(MarwesProvider, null, {
              default: () =>
                h(components[name] as never, {
                  open: true,
                  title: "Initial modal",
                  portalTarget: "#modal-portal-target",
                }),
            }),
        })
        const markup = await renderToString(createSSRApp(Host), context)
        expect(markup).toContain("teleport")
        expect(context.teleports?.["#modal-portal-target"]).toContain('role="dialog"')
        console.info(
          JSON.stringify({
            adapter: "vue",
            scenario: name,
            initialOpen: true,
            status: "requires-integration",
            reason: "SSR teleport output must be inserted into its target",
            targets: Object.keys(context.teleports ?? {}),
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
