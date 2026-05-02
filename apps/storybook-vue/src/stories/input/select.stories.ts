import type { SelectProps } from "@marwes-ui/vue"
import { Paragraph, Select } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { h, ref } from "vue"

const options = [
  { value: "starter", label: "Starter" },
  { value: "growth", label: "Growth" },
  { value: "enterprise", label: "Enterprise" },
]

const FIGMA_SELECT_NODE = "1364:7707"
const SELECT_STORY_WIDTH = "89px"
const selectStoryStyles = `
  .mw-select-story-preview {
    width: ${SELECT_STORY_WIDTH};
    min-width: ${SELECT_STORY_WIDTH};
    max-width: ${SELECT_STORY_WIDTH};
    inline-size: ${SELECT_STORY_WIDTH};
    min-inline-size: ${SELECT_STORY_WIDTH};
    max-inline-size: ${SELECT_STORY_WIDTH};
  }

  .mw-select-story-preview .mw-select__control,
  .mw-select-story-preview .mw-select {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    inline-size: 100%;
    min-inline-size: 0;
    max-inline-size: 100%;
  }
`

const meta = {
  title: "Input/Atom/Select",
  component: Select as unknown as object,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Compact select atom. Marwes visual treatment from Figma node ${FIGMA_SELECT_NODE} is the default. Use native={true} or appearance="native" when you intentionally need browser select chrome.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    native: {
      control: "boolean",
      description: `Marwes visual treatment is the default for the compact select atom (${FIGMA_SELECT_NODE}). Use native={true} only when you intentionally want browser select chrome.`,
    },
  },
  args: {
    native: false,
    placeholder: "Choose a plan",
    options,
  },
} satisfies Meta<SelectProps>

export default meta

type Story = StoryObj<SelectProps>

export const Basic: Story = {
  render: (args) => ({
    setup() {
      return () =>
        h("div", null, [
          h("style", null, selectStoryStyles),
          h("div", { class: "mw-select-story-preview" }, [h(Select, args)]),
        ])
    },
  }),
}

export const Controlled: Story = {
  render: (args) => ({
    setup() {
      const value = ref("growth")

      return () =>
        h("div", { style: { display: "grid", gap: "16px", justifyItems: "start" } }, [
          h("style", null, selectStoryStyles),
          h("div", { class: "mw-select-story-preview" }, [
            h(Select, {
              ...args,
              modelValue: value.value,
              "onUpdate:modelValue": (nextValue: string) => {
                value.value = nextValue
              },
            }),
          ]),
          h(
            Paragraph,
            { style: { fontSize: "14px", color: "#666" } },
            { default: () => `Current value: ${value.value || "(empty)"}` },
          ),
        ])
    },
  }),
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "growth",
  },
  render: (args) => ({
    setup() {
      return () =>
        h("div", null, [
          h("style", null, selectStoryStyles),
          h("div", { class: "mw-select-story-preview" }, [h(Select, args)]),
        ])
    },
  }),
}

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "starter",
    describedBy: "select-error",
  },
  render: (args) => ({
    setup() {
      return () =>
        h("div", { style: { display: "grid", gap: "8px", justifyItems: "start" } }, [
          h("style", null, selectStoryStyles),
          h("div", { class: "mw-select-story-preview" }, [h(Select, args)]),
          h(
            Paragraph,
            { id: "select-error", size: "sm" },
            { default: () => "Invalid state for validation errors." },
          ),
        ])
    },
  }),
}
