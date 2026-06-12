import { DestructiveButton, PrimaryButton, SecondaryButton, TextButton } from "@marwes-ui/vue"
import { MarwesProvider, ThemeMode } from "@marwes-ui/vue"
import type { ReflectionPortalMountInput } from "reflection-check"
import { type Component, createApp, h, nextTick } from "vue"

type ButtonCase = {
  component: Component
  label: string
}

const buttonCases: Record<string, ButtonCase> = {
  "/reflection/button/basic/light": {
    component: PrimaryButton,
    label: "Label",
  },
  "/reflection/button/secondary/light": {
    component: SecondaryButton,
    label: "Label",
  },
  "/reflection/button/text/light": {
    component: TextButton,
    label: "Label",
  },
  "/reflection/button/destructive/light": {
    component: DestructiveButton,
    label: "Delete",
  },
}

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
  const buttonCase = buttonCases[input.path]

  if (!buttonCase) {
    throw new Error(`Unknown Vue Reflection portal path: ${input.path}`)
  }

  const app = createApp({
    render() {
      return h(
        MarwesProvider,
        {
          enableSystem: false,
          theme: { mode: ThemeMode.light },
        },
        {
          default: () => h(buttonCase.component, {}, { default: () => buttonCase.label }),
        },
      )
    },
  })

  app.mount(input.root)
  await nextTick()
  await waitForMarwesTheme(input.root)

  return () => app.unmount()
}
