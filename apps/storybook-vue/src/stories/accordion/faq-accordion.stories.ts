import { storybookLayout } from "@marwes-ui/core"
import type { FAQAccordionProps } from "@marwes-ui/vue"
import { FAQAccordion } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

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
  title: "Accordion/Purpose/FAQ",
  component: FAQAccordion as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  decorators: [() => ({ template: '<div style="width: 100%; max-width: 640px"><story /></div>' })],
} satisfies Meta<FAQAccordionProps>

export default meta
type Story = StoryObj<FAQAccordionProps>

export const Default: Story = {
  args: {
    label: "Frequently Asked Questions",
    items: faqItems,
    defaultOpenItems: ["what"],
  },
}

export const WithError: Story = {
  args: {
    label: "FAQ",
    items: faqItems,
    error: "Please review all questions.",
  },
}
