import { storybookLayout } from "@marwes-ui/core"
import type { TabProps } from "@marwes-ui/vue"
import { Tab } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Tab/Atom",
  component: Tab as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    ariaLabel: { control: "text" },
    ariaControls: { control: "text" },
  },
} satisfies Meta<TabProps>

export default meta
type Story = StoryObj<TabProps>

export const Default: Story = {
  render: () => ({
    components: { Tab },
    template: "<Tab>Overview</Tab>",
  }),
}

export const Selected: Story = {
  render: () => ({
    components: { Tab },
    template: `<Tab :selected="true">Overview</Tab>`,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Tab },
    template: `<Tab :disabled="true">Settings</Tab>`,
  }),
}

export const IconOnly: Story = {
  render: () => ({
    components: { Tab },
    template: `<Tab ariaLabel="Settings" ariaControls="panel-settings"><span aria-hidden="true">⚙️</span></Tab>`,
  }),
}

export const TabList: Story = {
  render: () => ({
    components: { Tab },
    setup() {
      const active = ref(0)
      const tabs = ["Overview", "Activity", "Settings"]
      return { active, tabs }
    },
    template: `
      <div role="tablist" aria-label="Example tabs" style="display: flex; border-bottom: 1px solid #e5e7eb;">
        <Tab
          v-for="(label, i) in tabs"
          :key="label"
          :selected="active === i"
          :ariaControls="'panel-' + i"
          @click="active = i"
        >
          {{ label }}
        </Tab>
      </div>
    `,
  }),
}

export const AllStates: Story = {
  render: () => ({
    components: { Tab },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Default / Inactive</p>
          <Tab>Overview</Tab>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Selected</p>
          <Tab :selected="true">Overview</Tab>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Disabled</p>
          <Tab :disabled="true">Settings</Tab>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Tab row</p>
          <div role="tablist" style="display: flex; border-bottom: 1px solid #e5e7eb;">
            <Tab :selected="true" ariaControls="panel-0">Overview</Tab>
            <Tab ariaControls="panel-1">Activity</Tab>
            <Tab :disabled="true" ariaControls="panel-2">Settings</Tab>
          </div>
        </div>
      </div>
    `,
  }),
}
