import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { PermissionSwitchProps } from "@marwes-ui/vue"
import { PermissionSwitch } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"
import { createToggleableSwitchFieldRender } from "./story-helpers"

const meta = {
  title: "Switch/Purpose/Permission",
  component: PermissionSwitch as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<PermissionSwitchProps>

export default meta

type Story = StoryObj<PermissionSwitchProps>

export const Default: Story = {
  args: {
    label: "Can publish content",
    description: "Allow this role to publish approved drafts to production.",
    switch: {
      checked: true,
    },
  },
  render: createToggleableSwitchFieldRender("PermissionSwitch", PermissionSwitch),
}

export const Controlled: Story = {
  render: () => ({
    components: { PermissionSwitch },
    setup() {
      const enabled = ref(false)
      return { enabled }
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <PermissionSwitch
          v-model="enabled"
          label="Can manage billing"
          description="Grant access to invoices, payment methods, and plan changes."
        />
        <p style="font-size: 14px; color: #6b7280;">Permission: {{ enabled ? "granted" : "restricted" }}</p>
      </div>
    `,
  }),
}
