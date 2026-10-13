import { type ComponentType, createElement } from "react"
import { describe, expect, it } from "vitest"
import {
  hydrationSmokeComponentNames,
  hydrationSmokeProps,
  isPublicComponentExport,
} from "../../../../../tests/contracts/support/hydration-smoke-cases"
import * as components from "../../index"
import { createUpdateHydrationHarness } from "../update-hydration"

const componentNames = [
  ...hydrationSmokeComponentNames,
  "MarwesThemeScript",
  "MarwesThemeStyle",
] as const

describe("public component hydration smoke", () => {
  it("enrolls every public component export", () => {
    expect(
      Object.entries(components)
        .filter(([name, component]) => isPublicComponentExport(name, component))
        .map(([name]) => name)
        .sort(),
    ).toEqual([...componentNames].sort())
  })

  for (const name of componentNames) {
    it(`hydrates ${name} without warnings`, async () => {
      const props =
        name === "MarwesThemeScript" || name === "MarwesThemeStyle" ? {} : hydrationSmokeProps(name)
      const Component = components[name] as ComponentType<Record<string, unknown>>
      const harness = createUpdateHydrationHarness(() =>
        createElement(
          Component,
          props,
          ...(name === "Divider" || name === "MarwesThemeScript" || name === "MarwesThemeStyle"
            ? []
            : ["Hydration content"]),
        ),
      )
      expect(await harness.hydrate({})).toEqual([])
    })
  }
})
