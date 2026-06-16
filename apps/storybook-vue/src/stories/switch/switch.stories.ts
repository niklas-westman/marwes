import { SwitchSize, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"
// Atom is no longer publicly exported; deep-import for story documentation.
import { Switch, type SwitchProps } from "../../../../../packages/vue/src/components/switch/switch"
import { createToggleableSwitchRender } from "./story-helpers"

const meta = {
  title: "Switch/Atom",
  component: Switch as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    ...storybookA11yPolicy.smoke,
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    ariaLabel: { control: "text" },
    size: {
      control: { type: "inline-radio" },
      options: Object.values(SwitchSize),
    },
  },
} satisfies Meta<SwitchProps>

export default meta
type Story = StoryObj<SwitchProps>

export const Default: Story = {
  render: createToggleableSwitchRender("Enable notifications"),
}

export const Checked: Story = {
  args: { checked: true },
  render: createToggleableSwitchRender("Enable notifications"),
}

export const CheckedDisabled: Story = {
  render: () => ({
    components: { Switch },
    template: `<Switch :checked="true" :disabled="true">Locked setting</Switch>`,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Switch },
    template: `<Switch :disabled="true">Disabled setting</Switch>`,
  }),
}

export const AllStates: Story = {
  render: () => ({
    components: { Switch },
    setup() {
      const startsOff = ref(false)
      const startsOn = ref(true)
      const interactive = ref(false)
      return { startsOff, startsOn, interactive }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Starts off</p>
          <Switch v-model="startsOff">Enable notifications</Switch>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Starts on</p>
          <Switch v-model="startsOn">Enable notifications</Switch>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Disabled off</p>
          <Switch :disabled="true">Disabled setting</Switch>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Disabled on</p>
          <Switch :checked="true" :disabled="true">Locked setting</Switch>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Interactive</p>
          <Switch v-model="interactive">{{ interactive ? 'On' : 'Off' }}</Switch>
        </div>
      </div>
    `,
  }),
}

export const SizeComparison: Story = {
  render: () => ({
    components: { Switch },
    setup() {
      const compact = ref(false)
      const wide = ref(true)
      const rich = ref(false)
      return { compact, wide, rich, SwitchSize }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <Switch v-model="compact" :size="SwitchSize.compact">Compact 24x16</Switch>
        <Switch v-model="wide" :size="SwitchSize.wide">Wide 30x16</Switch>
        <Switch v-model="rich" :size="SwitchSize.rich">Rich 30x20</Switch>
      </div>
    `,
  }),
}
