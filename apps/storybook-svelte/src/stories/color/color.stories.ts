import { storybookA11yPolicy, storybookDocsDescription, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import ColorPalette from "./ColorPalette.svelte"
import ColorPrimaryOnly from "./ColorPrimaryOnly.svelte"
import ColorProviderMode from "./ColorProviderMode.svelte"
import ColorSemanticOnly from "./ColorSemanticOnly.svelte"

const meta = {
  title: "Design System/Colors",
  component: ColorPalette,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
    docs: {
      description: {
        component: storybookDocsDescription.colors,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ColorPalette>

export default meta
type Story = StoryObj<typeof meta>

export const AllColors: Story = {}

export const PrimaryOnly: Story = {
  render: () => ({
    Component: ColorPrimaryOnly,
    props: {},
  }),
}

export const SemanticOnly: Story = {
  render: () => ({
    Component: ColorSemanticOnly,
    props: {},
  }),
}

export const ProviderModeLight: Story = {
  render: () => ({
    Component: ColorProviderMode,
    props: { defaultPreference: "light" },
  }),
}

export const ProviderModeDark: Story = {
  render: () => ({
    Component: ColorProviderMode,
    props: { defaultPreference: "dark" },
  }),
}
