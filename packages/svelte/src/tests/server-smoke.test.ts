import { render } from "svelte/server"
import { describe, expect, it } from "vitest"
import { captureConsoleIssues } from "../../../../tests/contracts/support/console-issues"
import {
  hydrationSmokeComponentNames,
  hydrationSmokeProps,
} from "../../../../tests/contracts/support/hydration-smoke-cases"
import * as components from "../lib/index.js"
import Host from "./type-fixtures/HydrationComponentHost.svelte"

describe("Node server component smoke", () => {
  it("imports without browser globals", () => {
    expect(typeof window).toBe("undefined")
    expect(typeof document).toBe("undefined")
    expect(components.MarwesProvider).toBeDefined()
  })
  for (const componentName of hydrationSmokeComponentNames) {
    it(`server renders ${componentName} without warnings`, () => {
      const capture = captureConsoleIssues()
      try {
        const output = render(Host, {
          props: { componentName, componentProps: hydrationSmokeProps(componentName) },
        })
        expect(typeof output.body).toBe("string")
        expect(capture.issues).toEqual([])
      } finally {
        capture.stop()
      }
    })
  }
  it("isolates ids between repeated requests", () => {
    const props = {
      componentName: "InputField" as const,
      componentProps: hydrationSmokeProps("InputField"),
    }
    const outputs = Array.from({ length: 4 }, () => render(Host, { props }).body)
    expect(new Set(outputs).size).toBe(1)
  })
})
