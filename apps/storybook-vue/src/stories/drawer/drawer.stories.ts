import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { DrawerProps } from "@marwes-ui/vue"
import { CancelButton, ConfirmButton, Drawer, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Drawer/Atom",
  component: Drawer as unknown as object,
  parameters: {
    ...storybookLayout.fullscreen,
    ...storybookA11yPolicy.smoke,
  },
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    placement: { control: "select", options: ["left", "right"] },
    showFooter: { control: "boolean" },
    showScrim: { control: "boolean" },
    dismissible: { control: "boolean" },
    modal: { control: "boolean" },
  },
} satisfies Meta<DrawerProps>

export default meta

type Story = StoryObj<DrawerProps>

export const Default: Story = {
  render: () => ({
    components: { CancelButton, ConfirmButton, Drawer, Paragraph },
    template: `
      <Drawer
        title="Drawer title"
        description="Drawer content goes here. Use for forms, detail panels, navigation, filters, or any secondary workflow."
        size="medium"
        placement="right"
        :modal="true"
        @close="() => undefined"
      >
        <Paragraph>
          Keep workflow-specific state in the parent and use Drawer for the side panel shell.
        </Paragraph>
        <template #footer>
          <CancelButton>Cancel</CancelButton>
          <ConfirmButton>Apply</ConfirmButton>
        </template>
      </Drawer>
    `,
  }),
}

export const LeftPlacement: Story = {
  render: () => ({
    components: { Drawer, Paragraph },
    template: `
      <Drawer title="Left drawer" placement="left" :modal="true" @close="() => undefined">
        <Paragraph>Use left placement for navigation or object selectors.</Paragraph>
      </Drawer>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Drawer, Paragraph },
    template: `
      <div style="display: grid; gap: 24px;">
        <div v-for="size in ['small', 'medium', 'large']" :key="size" style="position: relative; height: 360px; overflow: hidden;">
          <Drawer
            :title="size + ' drawer'"
            :description="size + ' maps to the Figma drawer width token.'"
            :size="size"
            :modal="true"
            :showScrim="false"
            :showFooter="false"
          >
            <Paragraph>Small is 320px, medium is 400px, and large is 560px.</Paragraph>
          </Drawer>
        </div>
      </div>
    `,
  }),
}

export const WithoutFooter: Story = {
  render: () => ({
    components: { Drawer, Paragraph },
    template: `
      <Drawer title="Navigation drawer" size="small" :showFooter="false" :modal="true" @close="() => undefined">
        <Paragraph>Use content-only mode for navigation and persistent panels.</Paragraph>
      </Drawer>
    `,
  }),
}
