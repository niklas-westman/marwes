import { storybookLayout, storybookRadioArgTypes } from "@marwes-ui/core"
import type { RadioProps } from "@marwes-ui/vue"
import { Radio } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Radio/Atom",
  component: Radio as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookRadioArgTypes,
} satisfies Meta<RadioProps>

export default meta
type Story = StoryObj<RadioProps>

export const Default: Story = {
  render: () => ({
    components: { Radio },
    template: `<Radio ariaLabel="Option A" name="demo" />`,
  }),
}

export const Checked: Story = {
  render: () => ({
    components: { Radio },
    template: `<Radio ariaLabel="Option A" name="demo" :checked="true" />`,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Radio },
    template: `<Radio ariaLabel="Option A" name="demo" :disabled="true" />`,
  }),
}

export const RadioGroup: Story = {
  render: () => ({
    components: { Radio },
    setup() {
      const selected = ref("a")
      const options = [
        { value: "a", label: "Option A" },
        { value: "b", label: "Option B" },
        { value: "c", label: "Option C" },
      ]
      return { selected, options }
    },
    template: `
      <div role="radiogroup" aria-label="Preference" style="display: flex; flex-direction: column; gap: 12px;">
        <label
          v-for="opt in options"
          :key="opt.value"
          style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;"
        >
          <Radio
            name="preference"
            :value="opt.value"
            :checked="selected === opt.value"
            @checked-change="(v) => { if (v) selected = opt.value }"
          />
          {{ opt.label }}
        </label>
      </div>
    `,
  }),
}

export const AllStates: Story = {
  render: () => ({
    components: { Radio },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #4b5563;">
          <Radio name="states" ariaLabel="Unchecked" /> Unchecked
        </label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #4b5563;">
          <Radio name="states" ariaLabel="Checked" :checked="true" /> Checked
        </label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #4b5563;">
          <Radio name="states" ariaLabel="Disabled" :disabled="true" /> Disabled
        </label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #4b5563;">
          <Radio name="states" ariaLabel="Invalid" :invalid="true" /> Invalid
        </label>
      </div>
    `,
  }),
}
