import { DestructiveButton, PrimaryButton, SecondaryButton, TextButton } from "@marwes-ui/react"
import { MarwesProvider, ThemeMode } from "@marwes-ui/react"
import type { ComponentType, ReactNode } from "react"
import { flushSync } from "react-dom"
import { createRoot } from "react-dom/client"
import type { ReflectionPortalMountInput } from "reflection-check"

type ButtonCase = {
  component: ComponentType<{ children?: ReactNode }>
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
    throw new Error(`Unknown React Reflection portal path: ${input.path}`)
  }

  const root = createRoot(input.root)
  const Component = buttonCase.component

  flushSync(() => {
    root.render(
      <MarwesProvider enableSystem={false} theme={{ mode: ThemeMode.light }}>
        <Component>{buttonCase.label}</Component>
      </MarwesProvider>,
    )
  })

  await waitForMarwesTheme(input.root)

  return () => root.unmount()
}
