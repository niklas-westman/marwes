import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Drawer } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import DrawerAtomStory from "./DrawerAtomStory.svelte"

const meta = {
  title: "Drawer/Atom",
  component: Drawer,
  parameters: {
    ...storybookLayout.fullscreen,
    ...storybookA11yPolicy.smoke,
  },
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    placement: { control: "select", options: ["left", "right"] },
    showFooter: { control: "boolean" },
    showScrim: { control: "boolean" },
    dismissible: { control: "boolean" },
    modal: { control: "boolean" },
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Drawer title",
    description:
      "Drawer content goes here. Use for forms, detail panels, navigation, filters, or any secondary workflow.",
    size: "medium",
    placement: "right",
    showFooter: true,
    showScrim: true,
    dismissible: true,
    modal: true,
  },
  render: (args) => ({ Component: DrawerAtomStory, props: args }),
}

export const LeftPlacement: Story = {
  args: {
    ...Default.args,
    title: "Left drawer",
    placement: "left",
  },
  render: (args) => ({ Component: DrawerAtomStory, props: args }),
}

export const Sizes: Story = {
  render: () => ({
    Component: DrawerAtomStory,
    props: {
      title: "Large drawer",
      description: "Small is 320px, medium is 400px, and large is 560px.",
      size: "large",
      placement: "right",
      showFooter: false,
      showScrim: false,
      dismissible: false,
      modal: true,
    },
  }),
}

export const WithoutFooter: Story = {
  args: {
    title: "Navigation drawer",
    description: "This drawer has no footer actions.",
    size: "small",
    placement: "right",
    showFooter: false,
    showScrim: true,
    dismissible: true,
    modal: true,
  },
  render: (args) => ({ Component: DrawerAtomStory, props: args }),
}
