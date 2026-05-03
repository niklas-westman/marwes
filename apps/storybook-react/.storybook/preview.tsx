import { ThemeMode } from "@marwes-ui/core"
import { MarwesProvider } from "@marwes-ui/react"
import type { Decorator, Preview } from "@storybook/react"

const withMarwes: Decorator = (Story, context) => {
  const storybookTheme = context.globals.theme as ThemeMode | undefined
  const mode: ThemeMode = storybookTheme === ThemeMode.dark ? ThemeMode.dark : ThemeMode.light

  return (
    <MarwesProvider theme={{ mode }}>
      <div
        style={{
          minHeight: "100vh",
          padding: 24,
          background: mode === ThemeMode.dark ? "#000000" : "#ffffff",
        }}
      >
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
