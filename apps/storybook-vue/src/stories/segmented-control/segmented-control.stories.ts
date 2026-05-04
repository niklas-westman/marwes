import { IconName, SegmentedControlVariant, storybookLayout } from "@marwes-ui/core"
import type { SegmentedControlProps } from "@marwes-ui/vue"
import { Icon, SegmentedControl } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { h, ref } from "vue"

const viewOptions = [
  { value: "list", label: "List" },
  { value: "grid", label: "Grid" },
  { value: "cards", label: "Cards" },
]

function createIconOptions() {
  return [
    { value: "light", label: "Light", icon: h(Icon, { name: IconName.Sun, decorative: true }) },
    { value: "dark", label: "Dark", icon: h(Icon, { name: IconName.Moon, decorative: true }) },
    { value: "system", label: "System", icon: h(Icon, { name: IconName.Star, decorative: true }) },
  ]
}

const meta = {
  title: "SegmentedControl/Atom",
  component: SegmentedControl as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    ariaLabel: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    variant: {
      control: { type: "inline-radio" },
      options: Object.values(SegmentedControlVariant),
    },
  },
} satisfies Meta<SegmentedControlProps>

export default meta

type Story = StoryObj<SegmentedControlProps>

export const Default: Story = {
  args: {
    ariaLabel: "View mode",
    options: viewOptions,
    defaultValue: "list",
  },
  render: (args) => ({
    components: { SegmentedControl },
    setup() {
      const value = ref(args.defaultValue ?? "list")
      return { args, value }
    },
    template: `<SegmentedControl v-bind="args" v-model="value" />`,
  }),
}

export const WithVisibleLabel: Story = {
  args: {
    label: "View mode",
    options: viewOptions,
    defaultValue: "grid",
  },
  render: (args) => ({
    components: { SegmentedControl },
    setup() {
      const value = ref(args.defaultValue ?? "grid")
      return { args, value }
    },
    template: `<SegmentedControl v-bind="args" v-model="value" />`,
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      const value = ref("light")
      const options = createIconOptions()
      return { value, options }
    },
    template: `<SegmentedControl ariaLabel="Theme mode" :options="options" v-model="value" />`,
  }),
}

export const ContrastVariant: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      const value = ref("dark")
      const options = createIconOptions()
      return { value, options, SegmentedControlVariant }
    },
    template: `<SegmentedControl ariaLabel="Theme mode" :variant="SegmentedControlVariant.contrast" :options="options" v-model="value" />`,
  }),
}

export const DisabledOption: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      const value = ref("list")
      const options = [
        { value: "list", label: "List" },
        { value: "grid", label: "Grid", disabled: true },
        { value: "cards", label: "Cards" },
      ]
      return { value, options }
    },
    template: `<SegmentedControl ariaLabel="View mode" :options="options" v-model="value" />`,
  }),
}

export const AllStates: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      const viewMode = ref("list")
      const themeMode = ref("system")
      const themeOptions = createIconOptions()
      return { viewMode, themeMode, viewOptions, themeOptions, SegmentedControlVariant }
    },
    template: `
      <div style="display: grid; gap: 24px;">
        <SegmentedControl label="Standard" :options="viewOptions" v-model="viewMode" />
        <SegmentedControl label="Surface variant" :options="themeOptions" v-model="themeMode" />
        <SegmentedControl label="Contrast variant" :variant="SegmentedControlVariant.contrast" :options="themeOptions" v-model="themeMode" />
        <SegmentedControl label="Disabled group" :disabled="true" :options="viewOptions" value="grid" />
      </div>
    `,
  }),
}
