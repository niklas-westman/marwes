import { ThemeMode } from "@marwes-ui/core"
import { MarwesProvider } from "@marwes-ui/react"
import type { Decorator, Preview } from "@storybook/react"

const withMarwes: Decorator = (Story, context) => {
  const storybookTheme = context.globals.theme as ThemeMode | undefined
  const mode: ThemeMode = storybookTheme === ThemeMode.dark ? ThemeMode.dark : ThemeMode.light
  const isDocs = context.viewMode === "docs"
  const bg = mode === ThemeMode.dark ? "#0F0F0F" : "#ffffff"

  document.body.style.background = bg

  return (
    <MarwesProvider theme={{ mode }}>
      <div
        style={{
          minHeight: isDocs ? undefined : "100vh",
          padding: 24,
          background: bg,
        }}
      >
        <Story />
      </div>
    </MarwesProvider>
  )
}

const preview: Preview = {
  decorators: [withMarwes],
  initialGlobals: {
    theme: ThemeMode.light,
  },
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
    options: {
      storySort: {
        // Storybook statically parses this value during builds, so keep it inline.
        // Keep this order in sync across React, Vue, and Svelte previews.
        order: [
          "Welcome",
          ["Introduction"],
          "Design System",
          ["Introduction", "Colors", "*"],
          "Icon",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Spacing",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Divider",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Text",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Heading",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Paragraph",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Buttons",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Input",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Checkbox",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Radio",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Switch",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Slider",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "SegmentedControl",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "ProgressBar",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Breadcrumb",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Pagination",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Accordion",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Tab",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Card",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "StatTile",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Badge",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Avatar",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Banner",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Skeleton",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Spinner",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Toast",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Tooltip",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Dialog",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "Drawer",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "ContextMenu",
          ["Introduction", "Atom", "Molecule", "Purpose", "Variant", "*"],
          "*",
        ],
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
