import "@marwes-ui/presets/firstEdition/styles.css"
import { ThemeMode } from "@marwes-ui/core"
import type { Preview } from "@storybook/svelte"
import MarwesDecorator from "./MarwesDecorator.svelte"
import SnippetRenderer from "./SnippetRenderer.svelte"

const preview: Preview = {
  decorators: [
    (_story, context) => {
      const storybookTheme = context.globals.theme as string | undefined
      const mode = storybookTheme === "dark" ? "dark" : "light"
      return {
        Component: MarwesDecorator,
        props: {
          isDocs: context.viewMode === "docs",
          mode,
        },
      }
    },
  ],
  // Svelte 5 renders children via snippets ({@render children?.()}).
  // Storybook passes `children` as a plain string from args.
  // This global render wraps it in SnippetRenderer which converts the
  // string into actual slot content that becomes a snippet.
  render: (args, { component }) => {
    if (args.children != null && typeof args.children === "string") {
      return {
        Component: SnippetRenderer,
        props: { component, ...args },
      }
    }
    return { Component: component, props: args }
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
    a11y: { test: "off" },
  },
  initialGlobals: {
    theme: ThemeMode.light,
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
