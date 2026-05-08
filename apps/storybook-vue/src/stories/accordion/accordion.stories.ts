import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { AccordionProps } from "@marwes-ui/vue"
import { Accordion } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Accordion/Atom",
  component: Accordion as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  decorators: [
    () => ({
      ...storybookA11yPolicy.smoke,
      template: '<div style="width: 66vw"><story /></div>',
    }),
  ],
  argTypes: {
    open: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<AccordionProps>

export default meta
type Story = StoryObj<AccordionProps>

export const Default: Story = {
  render: () => ({
    components: { Accordion },
    template: `
      <Accordion id="story-1" title="What is Marwes?">
        <template #title>What is Marwes?</template>
        Marwes is a design system built for scalable, accessible UI components.
      </Accordion>
    `,
  }),
}

export const Open: Story = {
  render: () => ({
    components: { Accordion },
    template: `
      <Accordion id="story-2" :open="true">
        <template #title>What is Marwes?</template>
        Marwes is a design system built for scalable, accessible UI components.
      </Accordion>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Accordion },
    template: `
      <Accordion id="story-3" :disabled="true">
        <template #title>Disabled accordion</template>
        This content is not accessible.
      </Accordion>
    `,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { Accordion },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <Accordion id="interactive-1" :open="open" @toggle="open = !open">
        <template #title>Click to expand</template>
        This panel appears when you click the trigger above.
      </Accordion>
    `,
  }),
}

export const AccordionList: Story = {
  render: () => ({
    components: { Accordion },
    setup() {
      const openIndex = ref<number | null>(0)
      const items = [
        {
          title: "Getting started",
          body: "Install via pnpm add @marwes-ui/vue and wrap your app with MarwesProvider.",
        },
        {
          title: "Theming",
          body: "Pass a ThemeInput to MarwesProvider to customise colours, radius, and density.",
        },
        { title: "Components", body: "Import individual components from @marwes-ui/vue." },
      ]
      return { openIndex, items }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Accordion
          v-for="(item, i) in items"
          :key="i"
          :id="'faq-' + i"
          :open="openIndex === i"
          @toggle="openIndex = openIndex === i ? null : i"
        >
          <template #title>{{ item.title }}</template>
          {{ item.body }}
        </Accordion>
      </div>
    `,
  }),
}
