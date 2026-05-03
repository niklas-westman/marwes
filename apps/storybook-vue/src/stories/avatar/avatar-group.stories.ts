import { ThemeMode, storybookLayout } from "@marwes-ui/core"
import { AvatarGroup, MarwesProvider } from "@marwes-ui/vue"
import type { AvatarGroupProps } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const sampleItems: AvatarGroupProps["items"] = [
  { id: "mw", initials: "MW" },
  { id: "nk", initials: "NK" },
  { id: "as", initials: "AS" },
  { id: "guest", type: "icon", ariaLabel: "Guest member" },
]

const meta = {
  title: "Avatar/Molecule/AvatarGroup",
  component: AvatarGroup as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<AvatarGroupProps>

export default meta

type Story = StoryObj<AvatarGroupProps>

export const Default: Story = {
  args: {
    ariaLabel: "Project members",
    items: sampleItems,
    overflowCount: 3,
  },
}

export const WithoutOverflow: Story = {
  args: {
    ariaLabel: "Design reviewers",
    items: sampleItems,
  },
}

export const DarkPreview: Story = {
  render: () => ({
    components: { AvatarGroup, MarwesProvider },
    setup() {
      return { sampleItems, ThemeMode }
    },
    template: `
      <MarwesProvider :theme="{ mode: ThemeMode.dark }">
        <div style="padding: 24px; background: #2e2e2e; border-radius: 12px;">
          <AvatarGroup ariaLabel="Project members" :items="sampleItems" :overflowCount="3" />
        </div>
      </MarwesProvider>
    `,
  }),
}
