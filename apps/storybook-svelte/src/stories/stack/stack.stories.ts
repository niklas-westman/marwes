import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { StackProps } from "@marwes-ui/svelte"
import {
  Stack,
  stackAlignItemsValues,
  stackAsValues,
  stackDirections,
  stackJustifyContentValues,
  stackSizings,
  stackWraps,
} from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import StackShowcase from "./StackShowcase.svelte"

const spacingTokens = [
  "sp-0",
  "sp-2",
  "sp-4",
  "sp-8",
  "sp-12",
  "sp-16",
  "sp-24",
  "sp-32",
  "sp-40",
  "sp-48",
] as const

const spacingArgType = { control: "select", options: spacingTokens } as const

type Showcase =
  | "directions"
  | "gap"
  | "padding"
  | "alignment"
  | "justify"
  | "wrap"
  | "child-sizing"
  | "nested"

function showcaseStory(showcase: Showcase): Story {
  return {
    render: () => ({
      Component: StackShowcase,
      props: { showcase },
    }),
  }
}

const meta = {
  title: "Stack/Atom",
  component: Stack,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "inline-radio", options: [...stackDirections] },
    gap: spacingArgType,
    rowGap: spacingArgType,
    columnGap: spacingArgType,
    padding: spacingArgType,
    paddingX: spacingArgType,
    paddingY: spacingArgType,
    paddingTop: spacingArgType,
    paddingRight: spacingArgType,
    paddingBottom: spacingArgType,
    paddingLeft: spacingArgType,
    alignItems: { control: "select", options: [...stackAlignItemsValues] },
    justifyContent: { control: "select", options: [...stackJustifyContentValues] },
    wrap: { control: "inline-radio", options: [...stackWraps] },
    horizontalSizing: { control: "inline-radio", options: [...stackSizings] },
    verticalSizing: { control: "inline-radio", options: [...stackSizings] },
    as: { control: "select", options: [...stackAsValues] },
  },
  args: {
    direction: "column",
    gap: "sp-16",
    padding: "sp-16",
  },
  render: (args: StackProps) => ({
    Component: StackShowcase,
    props: { showcase: "default", stackProps: args },
  }),
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Directions: Story = showcaseStory("directions")

export const Gap: Story = showcaseStory("gap")

export const Padding: Story = showcaseStory("padding")

export const Alignment: Story = showcaseStory("alignment")

export const Justify: Story = showcaseStory("justify")

export const Wrap: Story = showcaseStory("wrap")

/**
 * fix and hug render the same: the child's own size wins. fill grows on the main axis and
 * stretches on the cross axis.
 */
export const ChildSizing: Story = showcaseStory("child-sizing")

export const Nested: Story = showcaseStory("nested")
