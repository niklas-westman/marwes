import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import DialogStory from "./DialogStory.svelte"

const meta = {
  title: "Dialog/Molecule",
  component: DialogStory,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    surfaceWidth: { control: "text" },
    tone: { control: "select", options: ["default", "calm"] },
    divider: { control: "select", options: ["visible", "hidden"] },
  },
} satisfies Meta<typeof DialogStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Invite teammates",
    description: "Select a role and invite collaborators to the workspace.",
    size: "medium",
  },
}

export const LockedDismissal: Story = {
  args: {
    title: "Migration in progress",
    description: "Keep this dialog open until the migration finishes.",
    dismissible: false,
    closeOnEscape: false,
    closeOnScrimClick: false,
    size: "small",
  },
}

export const CalmSurface: Story = {
  args: {
    title: "Review export",
    description: "Confirm the file settings before the export starts.",
    surfaceWidth: "640px",
    tone: "calm",
    divider: "hidden",
    size: "medium",
  },
}
