import type { ThemeMode } from "@marwes/core"
import { firstEdition } from "@marwes/presets"
import { MarwesProvider } from "@marwes/react"
import type { Decorator, Preview } from "@storybook/react"
import "@marwes/presets/firstEdition/styles.css"

/**
 * Marwes decorator with theme mode switching support.
 *
 * Users implementing this pattern should handle persistence like this:
 *
 * ```tsx
 * const [mode, setMode] = useState<ThemeMode>(
 *   () => (localStorage.getItem('marwes:theme:mode') as ThemeMode) ?? 'light'
 * );
 *
 * const handleModeChange = (newMode: ThemeMode) => {
 *   setMode(newMode);
 *   localStorage.setItem('marwes:theme:mode', newMode);
 * };
 *
 * <MarwesProvider mode={mode} onModeChange={handleModeChange} preset={firstEdition}>
 *   <App />
 * </MarwesProvider>
 * ```
 */
const withMarwes: Decorator = (Story, context) => {
  // Get theme mode from Storybook's global toolbar
  const storybookTheme = context.globals.theme as ThemeMode | undefined
  const mode: ThemeMode = storybookTheme === "dark" ? "dark" : "light"

  return (
    <MarwesProvider
      preset={firstEdition}
      mode={mode}
      // onModeChange would be provided by user's app, not in Storybook
      // Example: onModeChange={(newMode) => { localStorage.setItem('marwes:theme:mode', newMode); }}
    >
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
