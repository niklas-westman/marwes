import type { ThemeMode } from "@marwes-ui/core"
import { firstEditionTheme } from "@marwes-ui/presets"
import { MarwesProvider } from "@marwes-ui/react"
import type { Decorator, Preview } from "@storybook/react"
import "@marwes-ui/presets/firstEdition/styles.css"

const withMarwes: Decorator = (Story, context) => {
  const storybookTheme = context.globals.theme as ThemeMode | undefined
  const mode: ThemeMode = storybookTheme === "dark" ? "dark" : "light"

  return (
    <MarwesProvider theme={{ ...firstEditionTheme, mode }}>
      <div style={{ padding: 24 }}>
        <Story />
      </div>
    </MarwesProvider>
  )
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
