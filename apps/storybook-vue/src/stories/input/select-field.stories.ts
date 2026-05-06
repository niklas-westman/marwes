import { storybookA11yPolicy } from "@marwes-ui/core"
import type { SelectFieldProps } from "@marwes-ui/vue"
import { Paragraph, SelectField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { computed, ref } from "vue"
import "./select-field.stories.css"

const options = [
  { value: "se", label: "Sweden" },
  { value: "us", label: "United States" },
  { value: "no", label: "Norway" },
]

const FIGMA_DROPDOWN_NODE = "1364:7701"
const SELECT_FIELD_LABEL = "Option"

type SelectFieldStoryArgs = SelectFieldProps & {
  native: boolean
}

const meta = {
  title: "Input/Molecule/SelectField",
  component: SelectField as unknown as object,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
    docs: {
      description: {
        component: `Field-wrapped select. The custom Marwes dropdown presentation from node ${FIGMA_DROPDOWN_NODE} is the default. Use native={true} to opt into browser select chrome.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    native: {
      control: "boolean",
      description: `The Marwes dropdown field (${FIGMA_DROPDOWN_NODE}) is the default. Use native={true} only when you intentionally want browser select chrome.`,
    },
    label: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
  args: {
    native: false,
    select: {
      placeholder: "Option",
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
          label: SELECT_FIELD_LABEL,
          select: {
            ...select,
            native,
          },
        }
      })

      return { fieldArgs }
    },
    template: `
      <div class="mw-select-field-story-preview">
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
    error: "Option is required.",
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
      placeholder: "Option",
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
          label: SELECT_FIELD_LABEL,
          select: {
            ...select,
            native,
          },
        }
      })

      return { fieldArgs, value }
    },
    template: `
      <div style="display: grid; gap: 16px; justify-items: start;">
        <div class="mw-select-field-story-preview">
          <SelectField v-bind="fieldArgs" v-model="value" />
        </div>
        <Paragraph style="font-size: 14px; color: #666;">
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
