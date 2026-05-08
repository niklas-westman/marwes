import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SectionsAccordion } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const sectionItems = [
  { value: "desc", title: "Description", content: "Full product description and overview." },
  { value: "specs", title: "Specifications", content: "Technical specifications and dimensions." },
  { value: "reviews", title: "Reviews", content: "4.5/5 stars based on 128 customer reviews." },
]

const meta = {
  title: "Accordion/Purpose/Sections",
  component: SectionsAccordion,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SectionsAccordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Product Details",
    items: sectionItems,
    defaultOpenItems: ["desc"],
  },
}
