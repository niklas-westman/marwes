import type { ReflectionPortalMountInput } from "reflection-check"
import { mount, tick, unmount } from "svelte"
import SveltePortalCase from "./svelte-portal-case.svelte"

const portalPaths = new Set([
  "/reflection/accordion/expanded/light",
  "/reflection/accordion/expanded/dark",
  "/reflection/badge/neutral/light",
  "/reflection/badge/neutral/dark",
  "/reflection/badge/primary/light",
  "/reflection/badge/primary/dark",
  "/reflection/badge/success/light",
  "/reflection/badge/success/dark",
  "/reflection/badge/warning/light",
  "/reflection/badge/warning/dark",
  "/reflection/badge/destructive/light",
  "/reflection/badge/destructive/dark",
  "/reflection/button/basic/light",
  "/reflection/button/secondary/light",
  "/reflection/button/text/light",
  "/reflection/button/destructive/light",
  "/reflection/card/default/light",
  "/reflection/card/default/dark",
  "/reflection/checkbox/states-default/light",
  "/reflection/checkbox/states-default/dark",
  "/reflection/context-menu/full/light",
  "/reflection/context-menu/full/dark",
  "/reflection/dialog/medium/light",
  "/reflection/dialog/medium/dark",
  "/reflection/divider/sp-16/light",
  "/reflection/divider/sp-16/dark",
  "/reflection/input-fields/default/light",
  "/reflection/input-fields/default/dark",
  "/reflection/input-types-overview/text/light",
  "/reflection/input-types-overview/text/dark",
  "/reflection/radio/states-default/light",
  "/reflection/radio/states-default/dark",
  "/reflection/radio-group/default/light",
  "/reflection/radio-group/default/dark",
  "/reflection/segmented-control/three-segments/light",
  "/reflection/segmented-control/three-segments/dark",
  "/reflection/slider/default/light",
  "/reflection/slider/default/dark",
  "/reflection/switch/states-default/light",
  "/reflection/switch/states-default/dark",
])

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

async function waitForMarwesTheme(root: HTMLElement) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await nextFrame()

    const themeRoot = root.querySelector("[data-marwes-theme]")
    const component = root.querySelector(
      ".mw-btn, .mw-badge, .mw-accordion, .mw-card, .mw-checkbox-field, .mw-context-menu, .mw-dialog, .mw-divider, .mw-input-field, .mw-radio, .mw-radio-group-field, .mw-segmented-control, .mw-slider, .mw-switch-field",
    )
    const primaryColor = themeRoot
      ? getComputedStyle(themeRoot).getPropertyValue("--mw-color-primary-base").trim()
      : ""

    if (component && primaryColor) {
      await document.fonts?.ready
      return
    }
  }

  throw new Error("Marwes theme variables were not applied before Reflection capture.")
}

export async function mountReflectionCase(input: ReflectionPortalMountInput) {
  if (!portalPaths.has(input.path)) {
    throw new Error(`Unknown Svelte Reflection portal path: ${input.path}`)
  }

  const component = mount(SveltePortalCase, {
    target: input.root,
    props: {
      path: input.path,
    },
  })

  await tick()
  await waitForMarwesTheme(input.root)

  return () => {
    void unmount(component)
  }
}
