import { H1, H2, H3, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Typography/Headings",
  component: H1,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof H1>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => ({
    components: { H1, H2, H3, Paragraph },
    template: `
      <div style="display:grid; gap:12px; min-width:420px;">
        <H1>Heading Level 1</H1>
        <H2>Heading Level 2</H2>
        <H3>Heading Level 3</H3>
        <Paragraph>Supporting paragraph text using the same preset typography styles.</Paragraph>
      </div>
    `,
  }),
}
