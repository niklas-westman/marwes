import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { ButtonSpinner } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import ButtonSpinnerStory from "./ButtonSpinnerStory.svelte"

const meta = {
  title: "Spinner/Molecule/ButtonSpinner",
  component: ButtonSpinner,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  render: (args) => ({
    Component: ButtonSpinnerStory,
    props: args,
  }),
} satisfies Meta<typeof ButtonSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Inverted: Story = {
  args: {
    inverted: true,
    buttonVariant: "primary",
    label: "Loading…",
  },
}
