import { IconName, ThemeMode, storybookLayout } from "@marwes-ui/core"
import type { TooltipGroupProps } from "@marwes-ui/vue"
import { MarwesProvider, TooltipGroup } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Tooltip/Molecule/TooltipGroup",
  component: TooltipGroup as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: "select",
      options: [IconName.HelpCircle, IconName.Info],
    },
  },
} satisfies Meta<TooltipGroupProps>

export default meta

type Story = StoryObj<TooltipGroupProps>

export const Default: Story = {
  render: () => ({
    components: { TooltipGroup },
    template: `<TooltipGroup content="Tooltip text" triggerLabel="Show help" :defaultOpen="true" />`,
  }),
}

export const WithInfoIcon: Story = {
  render: () => ({
    components: { TooltipGroup },
    setup() {
      return { iconName: IconName.Info }
    },
    template: `<TooltipGroup content="Tooltip text" :icon="iconName" triggerLabel="Show info" :defaultOpen="true" />`,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { TooltipGroup },
    template: `<TooltipGroup content="Tooltip text" triggerLabel="Show help" />`,
  }),
}

export const Dark: Story = {
  render: () => ({
    components: { MarwesProvider, TooltipGroup },
    setup() {
      return { ThemeMode }
    },
    template: `
      <MarwesProvider :theme="{ mode: ThemeMode.dark }">
        <div style="padding: 24px; background: #2e2e2e; border-radius: 8px;">
          <TooltipGroup content="Tooltip text" triggerLabel="Show help" :defaultOpen="true" />
        </div>
      </MarwesProvider>
    `,
  }),
}
