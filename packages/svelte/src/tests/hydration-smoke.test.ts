import { afterEach, describe, expect, it } from "vitest"
import {
  hydrationSmokeComponentNames,
  hydrationSmokeProps,
  isPublicComponentExport,
} from "../../../../tests/contracts/support/hydration-smoke-cases"
import * as components from "../lib/index.js"
import { hydrateFromServerMarkup, unmountHydratedApps } from "./support/hydrate-from-server"
import HydrationComponentHost from "./type-fixtures/HydrationComponentHost.svelte"

afterEach(async () => {
  await unmountHydratedApps()
  document.body.innerHTML = ""
})

describe("public component hydration smoke", () => {
  it("enrolls every public component export", () => {
    expect(
      Object.entries(components)
        .filter(([name, component]) => isPublicComponentExport(name, component))
        .map(([name]) => name)
        .sort(),
    ).toEqual([...hydrationSmokeComponentNames].sort())
  })

  for (const componentName of hydrationSmokeComponentNames) {
    it(`hydrates ${componentName} without warnings`, async () => {
      const componentProps = hydrationSmokeProps(componentName)
      if ("input" in componentProps)
        componentProps.value = (componentProps.input as { value: string }).value
      if ("textarea" in componentProps)
        componentProps.value = (componentProps.textarea as { value: string }).value
      if ("select" in componentProps)
        componentProps.value = (componentProps.select as { value: string }).value
      const props = { componentName, componentProps }
      expect(
        await hydrateFromServerMarkup({
          componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
          component: HydrationComponentHost as never,
          serverProps: props,
          clientProps: props,
        }),
      ).toEqual([])
    })
  }
})
