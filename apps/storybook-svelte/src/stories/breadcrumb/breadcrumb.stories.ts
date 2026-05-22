import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import BreadcrumbButtonBacked from "./BreadcrumbButtonBacked.svelte"
import BreadcrumbPreview from "./BreadcrumbPreview.svelte"
import BreadcrumbShowcase from "./BreadcrumbShowcase.svelte"

const meta = {
  title: "Breadcrumb/Atom",
  component: BreadcrumbPreview,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    showHome: { control: "boolean" },
    homeHref: { control: "text" },
    ariaLabel: { control: "text" },
  },
} satisfies Meta<typeof BreadcrumbPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    homeHref: "#",
    showHome: true,
  },
}

export const WithoutHome: Story = {
  args: {
    showHome: false,
  },
}

export const ButtonBacked: Story = {
  render: () => ({
    Component: BreadcrumbButtonBacked,
  }),
}

export const AllStates: Story = {
  render: () => ({
    Component: BreadcrumbShowcase,
  }),
}
