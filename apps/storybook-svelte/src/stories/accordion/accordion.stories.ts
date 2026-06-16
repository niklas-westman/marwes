import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
// Atom is no longer publicly exported; deep-import for story documentation.
import Accordion from "../../../../../packages/svelte/src/lib/components/accordion/Accordion.svelte"
import AccordionShowcase from "./AccordionShowcase.svelte"

const meta = {
  title: "Accordion/Atom",
  component: Accordion,
  parameters: { ...storybookLayout.padded, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: "story-1",
    title: "What is Marwes?",
    children: "Marwes is a design system built for scalable, accessible UI components.",
  },
}

export const Open: Story = {
  args: {
    id: "story-2",
    open: true,
    title: "What is Marwes?",
    children: "Marwes is a design system built for scalable, accessible UI components.",
  },
}

export const Disabled: Story = {
  args: {
    id: "story-3",
    disabled: true,
    title: "Disabled accordion",
    children: "This content is not accessible.",
  },
}

export const Interactive: Story = {
  render: () => ({
    Component: AccordionShowcase,
    props: { showcase: "interactive" },
  }),
}

export const AccordionList: Story = {
  render: () => ({
    Component: AccordionShowcase,
    props: { showcase: "list" },
  }),
}
