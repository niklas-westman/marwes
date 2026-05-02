import { DropdownField, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { computed, ref } from "vue"

const options = [
  { value: "se", label: "Sweden" },
  { value: "us", label: "United States" },
  { value: "no", label: "Norway" },
]

const FIGMA_DROPDOWN_NODE = "1364:7701"
const DEMO_WIDTH = "320px"
const DEMO_MIN_HEIGHT = "188px"

type DropdownFieldStoryArgs = {
  native: boolean
} & InstanceType<typeof DropdownField>["$props"]

const meta = {
  title: "Input/Purpose/DropdownField",
  component: DropdownField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Semantic wrapper for the Marwes/Figma dropdown field. native={false} (default) uses the custom open-state from node ${FIGMA_DROPDOWN_NODE}; native={true} falls back to browser dropdown chrome.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    native: {
      control: "boolean",
      description: `Use native={false} for the custom Marwes dropdown field (${FIGMA_DROPDOWN_NODE}) or native={true} for browser select chrome.`,
    },
  },
  args: {
    native: false,
    label: "Country",
    select: {
      placeholder: "Choose a country",
      options,
    },
  },
  render: (args) => ({
    components: { DropdownField },
    setup() {
      const fieldArgs = computed(() => {
        const { native, select, ...rest } = args as DropdownFieldStoryArgs

        return {
          ...rest,
          select: {
            ...select,
            native,
          },
        }
      })

      return { fieldArgs }
    },
    template: `
      <div style="width: ${DEMO_WIDTH}; min-height: ${DEMO_MIN_HEIGHT};">
        <DropdownField v-bind="fieldArgs" />
      </div>
    `,
  }),
} satisfies Meta<DropdownFieldStoryArgs>

export default meta

type Story = StoryObj<DropdownFieldStoryArgs>

export const Basic: Story = {}

export const WithHelperText: Story = {
  args: {
    helperText: "Used to tailor currency and shipping defaults.",
  },
}

export const WithError: Story = {
  args: {
    error: "Country is required.",
  },
}

export const Disabled: Story = {
  args: {
    select: {
      options,
      defaultValue: "se",
      disabled: true,
    },
  },
}

export const Controlled: Story = {
  render: (args) => ({
    components: { DropdownField, Paragraph },
    setup() {
      const value = ref("us")
      const fieldArgs = computed(() => {
        const { native, select, ...rest } = args as DropdownFieldStoryArgs

        return {
          ...rest,
          select: {
            ...select,
            native,
          },
        }
      })
      return { fieldArgs, value }
    },
    template: `
      <div style="width: ${DEMO_WIDTH}; min-height: ${DEMO_MIN_HEIGHT};">
        <DropdownField v-bind="fieldArgs" v-model="value" />
        <Paragraph style="margin-top: 16px; font-size: 14px; color: #666;">
          Current value: {{ value || "(empty)" }}
        </Paragraph>
      </div>
    `,
  }),
}

export const Native: Story = {
  args: {
    native: true,
  },
}
