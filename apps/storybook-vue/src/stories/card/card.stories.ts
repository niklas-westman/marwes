import { ThemeMode, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { CardProps } from "@marwes-ui/vue"
import { Card, MarwesProvider } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const cardStatePreviews: Array<{
  label: string
  className?: string
  ariaDisabled?: string
  body: string
}> = [
  {
    label: "Default",
    body: "Resting state with the default border and neutral surface.",
  },
  {
    label: "Hover",
    className: "mw-card--state-hover",
    body: "Hover state uses the darker border from the live Figma sync.",
  },
  {
    label: "Pressed",
    className: "mw-card--state-pressed",
    body: "Pressed state keeps the stronger border treatment.",
  },
  {
    label: "Disabled",
    className: "mw-card--disabled",
    ariaDisabled: "true",
    body: "Disabled state mutes the surface and typography.",
  },
  {
    label: "Focus",
    className: "mw-card--state-focus",
    body: "Focus state previews the keyboard border color from Figma.",
  },
]

const meta = {
  title: "Card/Atom",
  component: Card as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<CardProps>

export default meta
type Story = StoryObj<CardProps>

export const Default: Story = {
  render: () => ({
    components: { Card, MarwesProvider },
    template: `
      <Card>
        <template #title>Card title</template>
        This is the card body. Use it to display any content.
      </Card>
    `,
  }),
}

export const BodyOnly: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card>A card without a title keeps the same 24px outer padding from Figma.</Card>
    `,
  }),
}

export const RichContent: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <template #title>Richer content</template>
        <p style="margin: 0;">Cards accept any Vue content as children.</p>
        <p style="margin: 8px 0 0;">Use them to group related information.</p>
      </Card>
    `,
  }),
}

export const StateMatrix: Story = {
  render: () => ({
    components: { Card, MarwesProvider },
    setup() {
      return { cardStatePreviews, ThemeMode }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(320px, 1fr));">
          <div v-for="preview in cardStatePreviews" :key="preview.label" style="display: flex; flex-direction: column; gap: 8px;">
            <span style="font-size: 12px; color: #666666;">{{ preview.label }}</span>
            <Card :class="preview.className" :aria-disabled="preview.ariaDisabled">
              <template #title>Card title</template>
              {{ preview.body }}
            </Card>
          </div>
        </div>

        <MarwesProvider :theme="{ mode: ThemeMode.dark }">
          <div style="display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(320px, 1fr)); padding: 24px; background: #2e2e2e; border-radius: 12px;">
            <div v-for="preview in cardStatePreviews" :key="'dark-' + preview.label" style="display: flex; flex-direction: column; gap: 8px;">
              <span style="font-size: 12px; color: #d4d4d4;">{{ preview.label }}</span>
              <Card :class="preview.className" :aria-disabled="preview.ariaDisabled">
                <template #title>Card title</template>
                {{ preview.body }}
              </Card>
            </div>
          </div>
        </MarwesProvider>
      </div>
    `,
  }),
}
