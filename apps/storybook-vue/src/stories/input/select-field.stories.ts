import type { SelectFieldProps } from "@marwes-ui/vue"
import { Paragraph, SelectField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { computed, ref } from "vue"

const options = [
  { value: "se", label: "Sweden" },
  { value: "us", label: "United States" },
  { value: "no", label: "Norway" },
]

const FIGMA_DROPDOWN_NODE = "1364:7701"
const DEMO_WIDTH = "320px"

type SelectFieldStoryArgs = SelectFieldProps & {
  native: boolean
}

const meta = {
  title: "Input/Molecule/SelectField",
  component: SelectField as unknown as object,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Field-wrapped select. native={false} (default) renders the custom Marwes dropdown open-state for node ${FIGMA_DROPDOWN_NODE}; native={true} keeps browser chrome.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    native: {
      control: "boolean",
      description: `Use native={false} for the Marwes dropdown field (${FIGMA_DROPDOWN_NODE}) or native={true} for browser select chrome.`,
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
    components: { SelectField },
    setup() {
      const fieldArgs = computed(() => {
        const { native, select, ...rest } = args as SelectFieldStoryArgs

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
      <div style="width: ${DEMO_WIDTH};">
        <SelectField v-bind="fieldArgs" />
      </div>
    `,
  }),
} satisfies Meta<SelectFieldStoryArgs>

export default meta

type Story = StoryObj<SelectFieldStoryArgs>

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

export const Required: Story = {
  args: {
    helperText: "Required for tax calculation.",
    select: {
      options,
      placeholder: "Choose a country",
      required: true,
    },
  },
}

export const Controlled: Story = {
  render: (args) => ({
    components: { SelectField, Paragraph },
    setup() {
      const value = ref("us")
      const fieldArgs = computed(() => {
        const { native, select, ...rest } = args as SelectFieldStoryArgs

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
      <div style="width: ${DEMO_WIDTH};">
        <SelectField v-bind="fieldArgs" v-model="value" />
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
