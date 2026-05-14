import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { FAQAccordion } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const faqItems = [
  {
    value: "what",
    title: "What is Marwes?",
    content: "A design system for scalable, accessible UI.",
  },
  { value: "free", title: "Is it free?", content: "Yes, Marwes is open source." },
  {
    value: "frameworks",
    title: "Which frameworks?",
    content: "React, Vue, and Svelte are supported.",
  },
]

const meta = {
  title: "Accordion/Purpose/FAQ",
  component: FAQAccordion,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FAQAccordion>

export default meta
type Story = StoryObj<typeof meta>

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
