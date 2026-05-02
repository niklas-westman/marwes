import type { ThemeMode } from "@marwes-ui/core"
import { firstEditionTheme } from "@marwes-ui/presets"
import { MarwesProvider } from "@marwes-ui/vue"
import type { Decorator, Preview } from "@storybook/vue3-vite"
import { h, isVNode } from "vue"
import "@marwes-ui/presets/firstEdition/styles.css"

const withMarwes: Decorator = (story, context) => {
  const storybookTheme = context.globals.theme as ThemeMode | undefined
  const mode: ThemeMode = storybookTheme === "dark" ? "dark" : "light"

  return {
    setup() {
      return { mode }
    },
    render() {
      const storyResult = story()
      const storyNode = isVNode(storyResult) ? storyResult : h(storyResult)

      return h(
        MarwesProvider,
        { theme: { ...firstEditionTheme, mode } },
        {
          default: () => [
            h(
              "div",
              {
                style: {
                  minHeight: "100vh",
                  padding: "24px",
                  background: mode === "dark" ? "#000000" : "#ffffff",
                },
              },
              [storyNode],
            ),
          ],
        },
      )
    },
  }
}

const preview: Preview = {
  decorators: [withMarwes],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Default to off until a story or family is explicitly promoted into the
    // automated smoke set with `a11y.test = "error"`.
    a11y: { test: "off" },
  },
  globalTypes: {
    theme: {
      description: "Theme mode (light or dark)",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "circlehollow", title: "Light" },
          { value: "dark", icon: "circle", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
}

export default preview
