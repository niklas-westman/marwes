import "@marwes-ui/presets/firstEdition/styles.css"
import { ThemeMode } from "@marwes-ui/core"
import type { Preview } from "@storybook/svelte"
import MarwesDecorator from "./MarwesDecorator.svelte"

const preview: Preview = {
  decorators: [
    () => ({
      Component: MarwesDecorator,
    }),
  ],
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
