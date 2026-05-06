import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SectionsAccordion } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const sectionItems = [
  {
    value: "desc",
    title: "Description",
    content: "A comprehensive product description with all relevant details.",
  },
  {
    value: "specs",
    title: "Specifications",
    content: "Weight: 250g, Dimensions: 15x10x5cm, Material: Aluminium.",
  },
  { value: "reviews", title: "Reviews", content: "4.5/5 stars based on 128 customer reviews." },
]

const meta: Meta<typeof SectionsAccordion> = {
  title: "Accordion/Purpose/Sections",
  component: SectionsAccordion,
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

type Story = StoryObj<typeof SectionsAccordion>

export const Default: Story = {
  args: {
    label: "Product Details",
    items: sectionItems,
    defaultOpenItems: ["desc"],
  },
}

export const SingleOpen: Story = {
  args: {
    label: "Product Details (single-open)",
    items: sectionItems,
    multiple: false,
    defaultOpenItems: ["desc"],
  },
}
