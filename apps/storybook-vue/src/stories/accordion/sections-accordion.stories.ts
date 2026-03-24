import { storybookLayout } from "@marwes-ui/core"
import type { SectionsAccordionProps } from "@marwes-ui/vue"
import { SectionsAccordion } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

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

const meta = {
  title: "Accordion/Purpose/Sections",
  component: SectionsAccordion as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  decorators: [() => ({ template: '<div style="width: 100%; max-width: 640px"><story /></div>' })],
} satisfies Meta<SectionsAccordionProps>

export default meta
type Story = StoryObj<SectionsAccordionProps>

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
