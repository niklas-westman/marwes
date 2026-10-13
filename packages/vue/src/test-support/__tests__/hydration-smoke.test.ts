import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import {
  hydrationSmokeComponentNames,
  hydrationSmokeProps,
  isPublicComponentExport,
} from "../../../../../tests/contracts/support/hydration-smoke-cases"
import * as components from "../../index"
import { createUpdateHydrationHarness } from "../update-hydration"

describe("public component hydration smoke", () => {
  it("enrolls every public component export", () => {
    expect(
      Object.entries(components)
        .filter(([name, component]) => isPublicComponentExport(name, component))
        .map(([name]) => name)
        .sort(),
    ).toEqual([...hydrationSmokeComponentNames].sort())
  })

  for (const name of hydrationSmokeComponentNames) {
    it(`hydrates ${name} without warnings`, async () => {
      const props = hydrationSmokeProps(name)
      if (name === "SegmentedControlField")
        props.segmentedControl = { ...(props.segmentedControl as object), modelValue: "no" }
      if (name === "PaginationField") props.pagination = { pageCount: 10, modelValue: 4 }
      const Host = defineComponent({
        setup: () => () =>
          h(components[name] as never, props, { default: () => "Hydration content" }),
      })
      const harness = createUpdateHydrationHarness(Host)
      expect(await harness.hydrate({})).toEqual([])
    })
  }
})
