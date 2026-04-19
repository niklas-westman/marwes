import { storybookLayout } from "@marwes-ui/core"
import { FAQAccordion } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const faqItems = [
  {
    value: "what",
    title: "What is Marwes?",
    content: "A design system for scalable, accessible UI.",
  },
  { value: "free", title: "Is it free?", content: "Yes, Marwes is open source." },
  { value: "frameworks", title: "Which frameworks?", content: "React and Vue are supported." },
]

const meta: Meta<typeof FAQAccordion> = {
  title: "Accordion/Purpose/FAQ",
  component: FAQAccordion,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "66vw" }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof FAQAccordion>

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
