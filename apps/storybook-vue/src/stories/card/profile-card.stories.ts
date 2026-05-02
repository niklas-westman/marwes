import { storybookLayout } from "@marwes-ui/core"
import type { CardProps } from "@marwes-ui/vue"
import { ProfileCard } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Card/Purpose/ProfileCard",
  component: ProfileCard as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<CardProps>

export default meta
type Story = StoryObj<CardProps>

export const Default: Story = {
  render: () => ({
    components: { ProfileCard },
    template: `
      <ProfileCard>
        <template #title>Alex Morgan</template>
        Design systems engineer with ownership of component primitives.
      </ProfileCard>
    `,
  }),
}
