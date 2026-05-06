import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { AccordionFieldProps } from "@marwes-ui/vue"
import { AccordionField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const faqItems = [
  {
    value: "what",
    title: "What is Marwes?",
    content: "A design system for scalable, accessible UI.",
  },
  { value: "free", title: "Is it free?", content: "Yes, Marwes is open source." },
  { value: "frameworks", title: "Which frameworks?", content: "React and Vue are supported." },
]

const meta = {
  title: "Accordion/Molecule",
  component: AccordionField as unknown as object,
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
} satisfies Meta<AccordionFieldProps>

export default meta
type Story = StoryObj<AccordionFieldProps>

export const Playground: Story = {
  args: {
    label: "Frequently Asked Questions",
    items: faqItems,
    defaultOpenItems: ["what"],
  },
}

export const Controlled: Story = {
  render: () => ({
    components: { AccordionField },
    setup() {
      const openItems = ref(["what"])
      return { openItems, faqItems }
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <AccordionField
          label="FAQ"
          :items="faqItems"
          v-model="openItems"
        />
        <p style="font-size: 14px; color: #6b7280;">Open: {{ openItems.join(", ") || "none" }}</p>
      </div>
    `,
  }),
}

export const MultiOpen: Story = {
  args: {
    label: "Product Details",
    items: faqItems,
    multiple: true,
    defaultOpenItems: ["what", "free"],
  },
}

export const SingleOpen: Story = {
  args: {
    label: "FAQ (single-open)",
    items: faqItems,
    multiple: false,
    defaultOpenItems: ["what"],
  },
}

export const WithDescription: Story = {
  args: {
    label: "Order Information",
    description: "Expand each section for details.",
    items: faqItems,
  },
}

export const WithError: Story = {
  args: {
    label: "Review Sections",
    error: "Please review all sections before proceeding.",
    items: faqItems,
  },
}

export const Disabled: Story = {
  args: {
    label: "FAQ",
    items: faqItems,
    defaultOpenItems: ["what"],
    disabled: true,
  },
}
