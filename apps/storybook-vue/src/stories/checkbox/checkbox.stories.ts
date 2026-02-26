import { storybookCheckboxArgTypes, storybookLayout } from "@marwes-ui/core"
import type { CheckboxProps } from "@marwes-ui/vue"
import { Checkbox, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Checkbox/Atom",
  component: Checkbox as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  args: {
    size: "md",
  },
  argTypes: storybookCheckboxArgTypes,
} satisfies Meta<CheckboxProps>

export default meta
type Story = StoryObj<CheckboxProps>

export const Playground: Story = {
  args: {
    ariaLabel: "Accept terms",
  },
}

export const UncontrolledDefaultChecked: Story = {
  render: () => ({
    components: { Checkbox },
    template: `<Checkbox ariaLabel="Uncontrolled" defaultChecked />`,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: { Checkbox, Paragraph },
    setup() {
      const checked = ref(false)
      return { checked }
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <Checkbox ariaLabel="Controlled" v-model="checked" />
        <Paragraph size="sm">checked: {{ String(checked) }}</Paragraph>
      </div>
    `,
  }),
}

export const Indeterminate: Story = {
  render: () => ({
    components: { Checkbox, Paragraph },
    setup() {
      const checked = ref(false)
      const indeterminate = ref(true)
      const handleCheckedChange = (next: boolean) => {
        indeterminate.value = false
        checked.value = next
      }
      return { checked, indeterminate, handleCheckedChange }
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <Checkbox
          ariaLabel="Indeterminate"
          :modelValue="checked"
          :indeterminate="indeterminate"
          @update:modelValue="handleCheckedChange"
        />
        <Paragraph size="sm">
          checked: {{ String(checked) }}, indeterminate: {{ String(indeterminate) }}
        </Paragraph>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Checkbox },
    template: `
      <div style="display: grid; gap: 12px;">
        <Checkbox ariaLabel="Disabled unchecked" disabled />
        <Checkbox ariaLabel="Disabled checked" disabled checked />
      </div>
    `,
  }),
}

export const Invalid: Story = {
  render: () => ({
    components: { Checkbox },
    template: `
      <div style="display: grid; gap: 12px;">
        <Checkbox ariaLabel="Invalid unchecked" invalid />
        <Checkbox ariaLabel="Invalid checked" invalid checked />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Checkbox, Paragraph },
    template: `
      <div style="display: grid; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <Checkbox ariaLabel="Small" size="sm" />
          <Paragraph size="sm">sm (1rem)</Paragraph>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <Checkbox ariaLabel="Medium" size="md" />
          <Paragraph size="sm">md (1.125rem)</Paragraph>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <Checkbox ariaLabel="Large" size="lg" />
          <Paragraph size="sm">lg (1.375rem)</Paragraph>
        </div>
      </div>
    `,
  }),
}

export const AllStates: Story = {
  render: () => ({
    components: { Checkbox, Paragraph },
    template: `
      <div style="display: grid; gap: 16px;">
        <div>
          <Paragraph size="sm" style="margin-bottom: 8px; font-weight: 600;">
            Default States
          </Paragraph>
          <div style="display: flex; gap: 16px; align-items: center;">
            <Checkbox ariaLabel="Unchecked" />
            <Checkbox ariaLabel="Checked" checked />
            <Checkbox ariaLabel="Indeterminate" indeterminate />
          </div>
        </div>

        <div>
          <Paragraph size="sm" style="margin-bottom: 8px; font-weight: 600;">
            Disabled States
          </Paragraph>
          <div style="display: flex; gap: 16px; align-items: center;">
            <Checkbox ariaLabel="Disabled unchecked" disabled />
            <Checkbox ariaLabel="Disabled checked" disabled checked />
            <Checkbox ariaLabel="Disabled indeterminate" disabled indeterminate />
          </div>
        </div>

        <div>
          <Paragraph size="sm" style="margin-bottom: 8px; font-weight: 600;">
            Error States
          </Paragraph>
          <div style="display: flex; gap: 16px; align-items: center;">
            <Checkbox ariaLabel="Error unchecked" invalid />
            <Checkbox ariaLabel="Error checked" invalid checked />
          </div>
        </div>
      </div>
    `,
  }),
}
