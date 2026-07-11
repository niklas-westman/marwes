import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SkipLink } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { defineComponent, h } from "vue"

type SkipLinkStoryArgs = {
  href: string
}

const meta = {
  title: "SkipLink/Atom",
  component: SkipLink as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    href: { control: "text" },
  },
} satisfies Meta<SkipLinkStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: "#main",
  },
  render: (args) => {
    const { href } = args as SkipLinkStoryArgs
    return defineComponent({
      setup() {
        return () =>
          h("div", { style: { position: "relative", minHeight: "120px", padding: "1rem" } }, [
            h(SkipLink, { href }, () => "Skip to main content"),
            h("p", {}, "Focus the page (press Tab) to reveal the skip link."),
          ])
      },
    })
  },
}
