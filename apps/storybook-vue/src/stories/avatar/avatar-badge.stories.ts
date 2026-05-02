import { AvatarSize, storybookLayout } from "@marwes-ui/core"
import { AvatarBadge } from "@marwes-ui/vue"
import type { AvatarBadgeProps } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Avatar/Molecule/AvatarBadge",
  component: AvatarBadge as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<AvatarBadgeProps>

export default meta

type Story = StoryObj<AvatarBadgeProps>

export const Default: Story = {
  args: {
    size: AvatarSize.medium,
    initials: "MW",
  },
}

const avatarBadgePreviews: Array<{
  label: string
  props: AvatarBadgeProps
}> = [
  {
    label: "Small",
    props: {
      size: AvatarSize.small,
      initials: "MW",
    },
  },
  {
    label: "Medium",
    props: {
      size: AvatarSize.medium,
      initials: "MW",
    },
  },
  {
    label: "Large",
    props: {
      size: AvatarSize.large,
      initials: "MW",
    },
  },
]

export const AllSizes: Story = {
  render: () => ({
    components: { AvatarBadge },
    setup() {
      return { avatarBadgePreviews }
    },
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <div v-for="preview in avatarBadgePreviews" :key="preview.label" style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 12px; color: #666666;">{{ preview.label }}</span>
          <AvatarBadge v-bind="preview.props" />
        </div>
      </div>
    `,
  }),
}

export const DarkSizes: Story = {
  render: () => ({
    components: { AvatarBadge },
    setup() {
      return { avatarBadgePreviews }
    },
    template: `
      <div class="mw-theme--dark" style="display: flex; align-items: center; gap: 24px; padding: 24px; background: #2e2e2e; border-radius: 12px;">
        <div v-for="preview in avatarBadgePreviews" :key="'dark-' + preview.label" style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 12px; color: #d4d4d4;">{{ preview.label }}</span>
          <AvatarBadge v-bind="preview.props" />
        </div>
      </div>
    `,
  }),
}
