import type { ThemeMode } from "@marwes-ui/core"
import { firstEdition } from "@marwes-ui/presets"
import { MarwesProvider } from "@marwes-ui/vue"
import type { Decorator, Preview } from "@storybook/vue3-vite"
import { h, isVNode } from "vue"
import "@marwes-ui/presets/firstEdition/styles.css"

const withMarwes: Decorator = (story, context) => {
  const storybookTheme = context.globals.theme as ThemeMode | undefined
  const mode: ThemeMode = storybookTheme === "dark" ? "dark" : "light"

  return {
    setup() {
      return { mode, firstEdition }
    },
    render() {
      const storyResult = story()
      const storyNode = isVNode(storyResult) ? storyResult : h(storyResult)

      return h(
        MarwesProvider,
        {
          preset: firstEdition,
          mode,
        },
        {
          default: () => [
            h(
              "div",
              {
                style: { padding: "24px" },
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
    a11y: { test: "todo" },
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
