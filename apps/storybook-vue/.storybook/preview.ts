import { ThemeMode } from "@marwes-ui/core"
import { MarwesProvider } from "@marwes-ui/vue"
import type { Decorator, Preview } from "@storybook/vue3-vite"
import { h, isVNode } from "vue"

const withMarwes: Decorator = (story, context) => {
  const storybookTheme = context.globals.theme as ThemeMode | undefined
  const mode: ThemeMode = storybookTheme === ThemeMode.dark ? ThemeMode.dark : ThemeMode.light
  const isDocs = context.viewMode === "docs"

  return {
    setup() {
      return { isDocs, mode }
    },
    render() {
      const storyResult = story()
      const storyNode = isVNode(storyResult) ? storyResult : h(storyResult)

      return h(
        MarwesProvider,
        { theme: { mode } },
        {
          default: () => [
            h(
              "div",
              {
                style: {
                  minHeight: isDocs ? undefined : "100vh",
                  padding: "24px",
                  background: mode === ThemeMode.dark ? "#0F0F0F" : "#ffffff",
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
    docs: {
      codePanel: true,
      source: {
        excludeDecorators: true,
      },
    },
    // Default to off until a story or family is explicitly promoted into the
    // automated smoke set with `a11y.test = "error"`.
    a11y: { test: "off" },
  },
  globalTypes: {
    theme: {
      description: "Theme mode (light or dark)",
      defaultValue: ThemeMode.light,
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: ThemeMode.light, icon: "circlehollow", title: "Light" },
          { value: ThemeMode.dark, icon: "circle", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
}

export default preview
