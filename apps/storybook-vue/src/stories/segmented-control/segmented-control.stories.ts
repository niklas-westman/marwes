import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { SegmentedControlItem } from "@marwes-ui/vue"
import { SegmentedControl } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { defineComponent, h, ref } from "vue"

const meta = {
  title: "SegmentedControl/Atom",
  component: SegmentedControl as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "inverse", "pill"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    disabled: { control: "boolean" },
    ariaLabel: { control: "text" },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const twoSegmentItems: SegmentedControlItem[] = [
  { value: "compact", label: "Compact" },
  { value: "wide", label: "Wide" },
]

const threeSegmentItems: SegmentedControlItem[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
]

const iconItems: SegmentedControlItem[] = [
  { value: "light", label: "☀️", ariaLabel: "Light mode" },
  { value: "dark", label: "🌙", ariaLabel: "Dark mode" },
]

const iconLabelItems: SegmentedControlItem[] = [
  { value: "star", label: "★ Favorites" },
  { value: "settings", label: "⚙ Settings" },
  { value: "search", label: "⌕ Search" },
]

export const Default: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      const value = ref("compact")
      return () =>
        h(SegmentedControl, {
          items: twoSegmentItems,
          modelValue: value.value,
          ariaLabel: "View density",
          "onUpdate:modelValue": (v: string) => {
            value.value = v
          },
        })
    },
  }),
}

export const ThreeSegments: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      const value = ref("react")
      return () =>
        h(SegmentedControl, {
          items: threeSegmentItems,
          modelValue: value.value,
          ariaLabel: "Framework",
          "onUpdate:modelValue": (v: string) => {
            value.value = v
          },
        })
    },
  }),
}

export const Inverse: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      const value = ref("compact")
      return () =>
        h(SegmentedControl, {
          items: twoSegmentItems,
          modelValue: value.value,
          variant: "inverse",
          ariaLabel: "View density",
          "onUpdate:modelValue": (v: string) => {
            value.value = v
          },
        })
    },
  }),
}

export const Pill: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      const value = ref("light")
      return () =>
        h(SegmentedControl, {
          items: iconItems,
          modelValue: value.value,
          variant: "pill",
          ariaLabel: "Theme mode",
          "onUpdate:modelValue": (v: string) => {
            value.value = v
          },
        })
    },
  }),
}

export const IconOnly: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      const value = ref("light")
      return () =>
        h(SegmentedControl, {
          items: iconItems,
          modelValue: value.value,
          variant: "pill",
          ariaLabel: "Theme mode",
          "onUpdate:modelValue": (v: string) => {
            value.value = v
          },
        })
    },
  }),
}

export const IconWithLabel: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      const value = ref("star")
      return () =>
        h(SegmentedControl, {
          items: iconLabelItems,
          modelValue: value.value,
          ariaLabel: "Navigation",
          "onUpdate:modelValue": (v: string) => {
            value.value = v
          },
        })
    },
  }),
}

export const Small: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      const value = ref("compact")
      return () =>
        h(SegmentedControl, {
          items: twoSegmentItems,
          modelValue: value.value,
          size: "sm",
          ariaLabel: "View density",
          "onUpdate:modelValue": (v: string) => {
            value.value = v
          },
        })
    },
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      return () =>
        h(SegmentedControl, {
          items: twoSegmentItems,
          modelValue: "compact",
          disabled: true,
          ariaLabel: "View density",
        })
    },
  }),
}

export const DisabledItem: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      const value = ref("a")
      return () =>
        h(SegmentedControl, {
          items: [
            { value: "a", label: "Enabled" },
            { value: "b", label: "Disabled", disabled: true },
            { value: "c", label: "Enabled" },
          ],
          modelValue: value.value,
          ariaLabel: "Options",
          "onUpdate:modelValue": (v: string) => {
            value.value = v
          },
        })
    },
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: { SegmentedControl },
    setup() {
      const value = ref("compact")
      return () =>
        h(SegmentedControl, {
          items: twoSegmentItems,
          modelValue: value.value,
          ariaLabel: "View density",
          "onUpdate:modelValue": (v: string) => {
            value.value = v
          },
        })
    },
  }),
}

const AllVariantsComponent = defineComponent({
  name: "AllVariants",
  components: { SegmentedControl },
  setup() {
    const val1 = ref("react")
    const val2 = ref("react")
    const val3 = ref("light")
    const val4 = ref("compact")
    const val5 = ref("compact")

    return () =>
      h("div", { style: "display:flex;flex-direction:column;gap:24px" }, [
        h("div", [
          h("p", { style: "margin-bottom:8px;font-size:12px;color:#6b7280" }, "Default"),
          h(SegmentedControl, {
            items: threeSegmentItems,
            modelValue: val1.value,
            ariaLabel: "Framework",
            "onUpdate:modelValue": (v: string) => {
              val1.value = v
            },
          }),
        ]),
        h("div", [
          h("p", { style: "margin-bottom:8px;font-size:12px;color:#6b7280" }, "Inverse"),
          h(SegmentedControl, {
            items: threeSegmentItems,
            modelValue: val2.value,
            variant: "inverse",
            ariaLabel: "Framework",
            "onUpdate:modelValue": (v: string) => {
              val2.value = v
            },
          }),
        ]),
        h("div", [
          h("p", { style: "margin-bottom:8px;font-size:12px;color:#6b7280" }, "Pill"),
          h(SegmentedControl, {
            items: iconItems,
            modelValue: val3.value,
            variant: "pill",
            ariaLabel: "Theme",
            "onUpdate:modelValue": (v: string) => {
              val3.value = v
            },
          }),
        ]),
        h("div", [
          h("p", { style: "margin-bottom:8px;font-size:12px;color:#6b7280" }, "Small"),
          h(SegmentedControl, {
            items: twoSegmentItems,
            modelValue: val4.value,
            size: "sm",
            ariaLabel: "Density",
            "onUpdate:modelValue": (v: string) => {
              val4.value = v
            },
          }),
        ]),
        h("div", [
          h("p", { style: "margin-bottom:8px;font-size:12px;color:#6b7280" }, "Disabled"),
          h(SegmentedControl, {
            items: twoSegmentItems,
            modelValue: val5.value,
            disabled: true,
            ariaLabel: "Density",
          }),
        ]),
      ])
  },
})

export const AllVariants: Story = {
  render: () => ({
    components: { AllVariantsComponent },
    setup() {
      return () => h(AllVariantsComponent)
    },
  }),
}
