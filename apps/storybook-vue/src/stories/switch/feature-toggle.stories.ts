import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { FeatureToggleProps } from "@marwes-ui/vue"
import { FeatureToggle } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"
import { createToggleableSwitchFieldRender } from "./story-helpers"

const meta = {
  title: "Switch/Purpose/FeatureToggle",
  component: FeatureToggle as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<FeatureToggleProps>

export default meta

type Story = StoryObj<FeatureToggleProps>

export const Default: Story = {
  args: {
    label: "Enable beta dashboard",
    description: "Turn on early access to the redesigned analytics experience.",
    switch: {
      checked: true,
    },
  },
  render: createToggleableSwitchFieldRender("FeatureToggle", FeatureToggle),
}

export const Controlled: Story = {
  render: () => ({
    components: { FeatureToggle },
    setup() {
      const enabled = ref(false)
      return { enabled }
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <FeatureToggle
          v-model="enabled"
          label="AI assistant"
          description="Expose the assistant entry point throughout the app."
        />
        <p style="font-size: 14px; color: #6b7280;">Feature state: {{ enabled ? "enabled" : "disabled" }}</p>
      </div>
    `,
  }),
}
