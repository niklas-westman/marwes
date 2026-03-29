import { storybookLayout } from "@marwes-ui/core"
import type { SwitchFieldProps } from "@marwes-ui/vue"
import { SwitchField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Switch/Molecule",
  component: SwitchField as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<SwitchFieldProps>

export default meta

type Story = StoryObj<SwitchFieldProps>

export const Playground: Story = {
  args: {
    label: "Enable notifications",
    description: "Receive important account and product updates.",
    switch: {
      checked: false,
    },
  },
}

export const Controlled: Story = {
  render: () => ({
    components: { SwitchField },
    setup() {
      const enabled = ref(true)
      return { enabled }
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <SwitchField
          v-model="enabled"
          label="Enable desktop notifications"
          description="Show a notification banner when background events need attention."
        />
        <p style="font-size: 14px; color: #6b7280;">Current value: {{ enabled ? "on" : "off" }}</p>
      </div>
    `,
  }),
}

export const WithError: Story = {
  args: {
    label: "Require approval before publishing",
    error: "Review mode must stay enabled for this workspace.",
    switch: {
      checked: false,
    },
  },
}

export const Disabled: Story = {
  args: {
    label: "Automatic backups",
    description: "This setting is managed by your organization.",
    switch: {
      checked: true,
      disabled: true,
    },
  },
}
