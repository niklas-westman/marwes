import { BannerVariant, ThemeMode, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { BannerProps } from "@marwes-ui/vue"
import { Banner, Button, MarwesProvider } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const VARIANTS = Object.values(BannerVariant)

const meta = {
  title: "Banner/Atom",
  component: Banner as unknown as object,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
    showIcon: { control: "boolean" },
    dismissible: { control: "boolean" },
    showAction: { control: "boolean" },
  },
} satisfies Meta<BannerProps>

export default meta
type Story = StoryObj<BannerProps>

export const Default: Story = {
  args: { variant: BannerVariant.info, showIcon: true, dismissible: true },
  render: (args) => ({
    components: { Banner },
    setup() {
      return { args }
    },
    template: `<Banner v-bind="args">Banner message — describe the event, update, or action needed here.</Banner>`,
  }),
}

export const WithAction: Story = {
  args: { variant: BannerVariant.info, showIcon: true, dismissible: true },
  render: (args) => ({
    components: { Banner, Button },
    setup() {
      return { args }
    },
    template: `
      <Banner v-bind="args">
        Banner message — describe the event, update, or action needed here.
        <template #action>
          <Button size="sm">Learn more</Button>
        </template>
      </Banner>
    `,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { Banner },
    setup() {
      return { variants: VARIANTS }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
        <Banner v-for="variant in variants" :key="variant" :variant="variant" show-icon dismissible>
          {{ variant.charAt(0).toUpperCase() + variant.slice(1) }} — Banner message describing the event or action needed.
        </Banner>
      </div>
    `,
  }),
}

export const WithoutIcon: Story = {
  args: { variant: BannerVariant.neutral, showIcon: false, dismissible: true },
  render: (args) => ({
    components: { Banner },
    setup() {
      return { args }
    },
    template: `<Banner v-bind="args">Banner message without an icon.</Banner>`,
  }),
}

export const NonDismissible: Story = {
  args: { variant: BannerVariant.warning, showIcon: true, dismissible: false },
  render: (args) => ({
    components: { Banner },
    setup() {
      return { args }
    },
    template: `<Banner v-bind="args">This banner cannot be dismissed.</Banner>`,
  }),
}

export const DarkVariants: Story = {
  render: () => ({
    components: { Banner, MarwesProvider },
    setup() {
      return { ThemeMode, variants: VARIANTS }
    },
    template: `
      <MarwesProvider :theme="{ mode: ThemeMode.dark }">
        <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; padding: 16px; background: #0f0f0f; border-radius: 8px;">
          <Banner v-for="variant in variants" :key="variant" :variant="variant" show-icon dismissible>
            {{ variant.charAt(0).toUpperCase() + variant.slice(1) }} — Banner message in dark mode.
          </Banner>
        </div>
      </MarwesProvider>
    `,
  }),
}
