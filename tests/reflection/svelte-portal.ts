import type { ReflectionPortalMountInput } from "reflection-check"
import { mount, tick, unmount } from "svelte"
import SveltePortalCase from "./svelte-portal-case.svelte"

const portalPaths = new Set([
  "/reflection/button/basic/light",
  "/reflection/button/secondary/light",
  "/reflection/button/text/light",
  "/reflection/button/destructive/light",
])

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

async function waitForMarwesTheme(root: HTMLElement) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await nextFrame()

    const button = root.querySelector(".mw-btn")
    const primaryColor = button
      ? getComputedStyle(button).getPropertyValue("--mw-color-primary-base").trim()
      : ""

    if (button && primaryColor) {
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
