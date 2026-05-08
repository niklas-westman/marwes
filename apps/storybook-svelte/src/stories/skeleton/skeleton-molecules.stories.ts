import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import SkeletonMolecules from "./SkeletonMolecules.svelte"

const meta = {
  title: "Skeleton/Molecule",
  component: SkeletonMolecules,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    animation: {
      control: "select",
      options: ["pulse", "wave", "none"],
    },
  },
  args: {
    animation: "pulse",
  },
} satisfies Meta<typeof SkeletonMolecules>

export default meta
type Story = StoryObj<typeof meta>

export const CardReplica: Story = {
  args: { view: "card" },
}

export const StatTileReplica: Story = {
  args: { view: "stat-tile" },
}

export const InputFieldReplica: Story = {
  args: { view: "input-field" },
}

export const ToastReplica: Story = {
  args: { view: "toast" },
}

export const ListCardReplica: Story = {
  args: { view: "list-card" },
}

export const ReplicaGallery: Story = {
  args: { view: "gallery" },
}
