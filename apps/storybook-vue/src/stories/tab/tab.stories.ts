import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { TabProps } from "@marwes-ui/vue"
import { Tab } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { defineComponent, h, ref } from "vue"

const AtomTabPreview = defineComponent({
  name: "AtomTabPreview",
  components: { Tab },
  props: {
    selected: Boolean,
    disabled: Boolean,
    ariaLabel: String,
    ariaControls: String,
  },
  setup(props, { slots }) {
    const generatedPanelId = `panel-atom-tab-${Math.random().toString(36).slice(2)}`

    return () => {
      const panelId = props.ariaControls ?? generatedPanelId

      return h("div", [
        h("div", { role: "tablist", "aria-label": "Example tab" }, [
          h(
            Tab,
            {
              selected: props.selected,
              disabled: props.disabled,
              ariaControls: panelId,
              ...(props.ariaLabel !== undefined ? { ariaLabel: props.ariaLabel } : {}),
            },
            slots,
          ),
        ]),
        h("div", {
          id: panelId,
          role: "tabpanel",
          "aria-label": "Example tab panel",
          hidden: !props.selected,
        }),
      ])
    }
  },
})

const meta = {
  title: "Tab/Atom",
  component: Tab as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    ...storybookA11yPolicy.smoke,
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
    components: { AtomTabPreview },
    template: "<AtomTabPreview>Overview</AtomTabPreview>",
  }),
}

export const Selected: Story = {
  render: () => ({
    components: { AtomTabPreview },
    template: `<AtomTabPreview :selected="true">Overview</AtomTabPreview>`,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { AtomTabPreview },
    template: `<AtomTabPreview :disabled="true">Settings</AtomTabPreview>`,
  }),
}

export const IconOnly: Story = {
  render: () => ({
    components: { AtomTabPreview },
    template: `<AtomTabPreview ariaLabel="Settings" ariaControls="panel-settings"><span aria-hidden="true">⚙️</span></AtomTabPreview>`,
  }),
}

export const TabBar: Story = {
  render: () => ({
    components: { Tab },
    setup() {
      const active = ref(0)
      const tabs = ["Overview", "Activity", "Settings"]
      return { active, tabs }
    },
    template: `
      <div>
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
        <div
          v-for="(label, i) in tabs"
          :key="'panel-' + label"
          :id="'panel-' + i"
          role="tabpanel"
          :hidden="active !== i"
        >
          {{ label }}
        </div>
      </div>
    `,
  }),
}

export const AllStates: Story = {
  render: () => ({
    components: { AtomTabPreview, Tab },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Default / Inactive</p>
          <AtomTabPreview>Overview</AtomTabPreview>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Selected</p>
          <AtomTabPreview :selected="true">Overview</AtomTabPreview>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Disabled</p>
          <AtomTabPreview :disabled="true">Settings</AtomTabPreview>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Tab bar</p>
          <div role="tablist" style="display: flex; border-bottom: 1px solid #e5e7eb;">
            <Tab :selected="true" ariaControls="panel-0">Overview</Tab>
            <Tab ariaControls="panel-1">Activity</Tab>
            <Tab :disabled="true" ariaControls="panel-2">Settings</Tab>
          </div>
          <div id="panel-0" role="tabpanel">Overview</div>
          <div id="panel-1" role="tabpanel" hidden>Activity</div>
          <div id="panel-2" role="tabpanel" hidden>Settings</div>
        </div>
      </div>
    `,
  }),
}
