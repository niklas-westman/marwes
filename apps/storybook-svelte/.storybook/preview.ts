import "@marwes-ui/presets/firstEdition/styles.css"
import { ThemeMode } from "@marwes-ui/core"
import type { Preview } from "@storybook/svelte"
import MarwesDecorator from "./MarwesDecorator.svelte"
import SnippetRenderer from "./SnippetRenderer.svelte"

const preview: Preview = {
  decorators: [
    (_story, context) => ({
      Component: MarwesDecorator,
      props: { isDocs: context.viewMode === "docs" },
    }),
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
