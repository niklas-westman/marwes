import { storybookLayout } from "@marwes-ui/core"
import type { SwitchProps } from "@marwes-ui/vue"
import { Switch } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Switch/Atom",
  component: Switch as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    ariaLabel: { control: "text" },
  },
} satisfies Meta<SwitchProps>

export default meta
type Story = StoryObj<SwitchProps>

export const Default: Story = {
  render: () => ({
    components: { Switch },
    template: "<Switch>Enable notifications</Switch>",
  }),
}

export const Checked: Story = {
  render: () => ({
    components: { Switch },
    template: `<Switch :checked="true">Enable notifications</Switch>`,
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
      const on = ref(false)
      return { on }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Off</p>
          <Switch>Enable notifications</Switch>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">On</p>
          <Switch :checked="true">Enable notifications</Switch>
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
          <Switch :checked="on" @click="on = !on">{{ on ? 'On' : 'Off' }}</Switch>
        </div>
      </div>
    `,
  }),
}
