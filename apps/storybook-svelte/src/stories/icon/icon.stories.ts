import {
  storybookA11yPolicy,
  storybookIconGalleryArgTypes,
  storybookIconGalleryDefaults,
  storybookLayout,
} from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import IconGallery from "./IconGallery.svelte"

const meta = {
  title: "Icon/Atom",
  component: IconGallery,
  parameters: {
    ...storybookLayout.fullscreen,
    ...storybookA11yPolicy.smoke,
  },
  args: storybookIconGalleryDefaults,
  argTypes: storybookIconGalleryArgTypes,
} satisfies Meta<typeof IconGallery>

export default meta
type Story = StoryObj<typeof meta>

export const Gallery: Story = {}
