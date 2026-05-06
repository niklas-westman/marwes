import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { PreferenceSwitchProps } from "@marwes-ui/vue"
import { PreferenceSwitch } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"
import { createToggleableSwitchFieldRender } from "./story-helpers"

const meta = {
  title: "Switch/Purpose/Preference",
  component: PreferenceSwitch as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<PreferenceSwitchProps>

export default meta

type Story = StoryObj<PreferenceSwitchProps>

export const Default: Story = {
  args: {
    label: "Use compact layout",
    description: "Show denser spacing in tables, lists, and navigation.",
    switch: {
      checked: false,
    },
  },
  render: createToggleableSwitchFieldRender("PreferenceSwitch", PreferenceSwitch),
}

export const Controlled: Story = {
  render: () => ({
    components: { PreferenceSwitch },
    setup() {
      const enabled = ref(true)
      return { enabled }
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <PreferenceSwitch
          v-model="enabled"
          label="Email me weekly summaries"
          description="Send a round-up every Friday with key activity from the week."
        />
        <p style="font-size: 14px; color: #6b7280;">Preference: {{ enabled ? "enabled" : "disabled" }}</p>
      </div>
    `,
  }),
}
