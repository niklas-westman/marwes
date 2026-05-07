import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { AccordionField } from "@marwes-ui/svelte"
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
  title: "Accordion/Molecule",
  component: AccordionField,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AccordionField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Frequently Asked Questions",
    items: faqItems,
    defaultOpenItems: ["what"],
  },
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
