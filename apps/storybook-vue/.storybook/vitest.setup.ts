import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview"
import { setProjectAnnotations } from "@storybook/vue3-vite"
import * as projectAnnotations from "./preview"

const ignoredWarnings = [
  "[@vue/compiler-core] decodeEntities option is passed but will be ignored in non-browser builds.",
]
const originalWarn = console.warn.bind(console)

console.warn = (...args) => {
  const [firstArg] = args
  if (typeof firstArg === "string" && ignoredWarnings.includes(firstArg)) {
    return
  }

  originalWarn(...args)
}

setProjectAnnotations([a11yAddonAnnotations, projectAnnotations])
