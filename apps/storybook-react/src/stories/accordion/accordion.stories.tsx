import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
// Atom is no longer publicly exported; deep-import for story documentation.
import { Accordion } from "../../../../../packages/react/src/components/accordion/accordion"

const meta: Meta<typeof Accordion> = {
  title: "Accordion/Atom",
  component: Accordion,
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
  argTypes: {
    open: { control: "boolean" },
    disabled: { control: "boolean" },
  },
}

export default meta

type Story = StoryObj<typeof Accordion>

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
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <Accordion
        id="interactive-1"
        open={open}
        onToggle={() => setOpen((v) => !v)}
        title="Click to expand"
      >
        This panel appears when you click the trigger above.
      </Accordion>
    )
  },
}

export const AccordionList: Story = {
  render: () => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0)
    const items = [
      {
        title: "Getting started",
        body: "Install via pnpm add @marwes-ui/react and wrap your app with MarwesProvider.",
      },
      {
        title: "Theming",
        body: "Pass a ThemeInput to MarwesProvider to customise colours, radius, and density.",
      },
      {
        title: "Components",
        body: "Import individual components from @marwes-ui/react — Button, Input, Checkbox, and more.",
      },
    ]

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <Accordion
            key={item.title}
            id={`faq-${i}`}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            title={item.title}
          >
            {item.body}
          </Accordion>
        ))}
      </div>
    )
  },
}
