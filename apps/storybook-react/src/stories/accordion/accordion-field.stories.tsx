import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { AccordionField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const faqItems = [
  {
    value: "what",
    title: "What is Marwes?",
    content: "A design system for scalable, accessible UI.",
  },
  { value: "free", title: "Is it free?", content: "Yes, Marwes is open source." },
  { value: "frameworks", title: "Which frameworks?", content: "React and Vue are supported." },
]

const meta: Meta<typeof AccordionField> = {
  title: "Accordion/Molecule",
  component: AccordionField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
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

type Story = StoryObj<typeof AccordionField>

export const Playground: Story = {
  args: {
    label: "Frequently Asked Questions",
    items: faqItems,
    defaultOpenItems: ["what"],
  },
}

export const Controlled: Story = {
  render: () => {
    const [openItems, setOpenItems] = React.useState<string[]>(["what"])
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <AccordionField
          label="FAQ"
          items={faqItems}
          openItems={openItems}
          onOpenItemsChange={setOpenItems}
        />
        <p style={{ fontSize: 14, color: "#6b7280" }}>Open: {openItems.join(", ") || "none"}</p>
      </div>
    )
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
