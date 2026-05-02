import { storybookA11yPolicy, storybookLayout, storybookSpinnerArgTypes } from "@marwes-ui/core"
import type { SpinnerProps } from "@marwes-ui/vue"
import { Button, Paragraph, Spinner } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const panelBorder = "rgba(148, 163, 184, 0.35)"
const stageStyle = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  min-height: 120px;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(248, 250, 252, 0.88);
  box-shadow: inset 0 0 0 1px ${panelBorder};
`
const darkStageStyle = `
  ${stageStyle}
  background: #141414;
`
const tileGridStyle = `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 920px;
`
const tileStyle = `
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`
function renderSpinnerPreview(args: SpinnerProps) {
  return {
    components: { Spinner },
    setup() {
      return { args, stageStyle }
    },
    template: `
      <div :style="stageStyle">
        <Spinner v-bind="args" />
      </div>
    `,
  }
}

const meta = {
  title: "Spinner/Atom",
  component: Spinner as unknown as object,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookSpinnerArgTypes,
  args: {
    variant: "classic",
    size: "sm",
    decorative: true,
  },
  render: (args: SpinnerProps) => renderSpinnerPreview(args),
} satisfies Meta<SpinnerProps>

export default meta
type Story = StoryObj<SpinnerProps>

export const Default: Story = {}

export const AccessibleStatus: Story = {
  args: {
    decorative: false,
    ariaLabel: "Loading account data",
  },
}

export const AllVariants: Story = {
  render: () => ({
    components: { Paragraph, Spinner },
    setup() {
      return {
        stageStyle,
        tileGridStyle,
        tileStyle,
        variantNames: ["classic", "ring", "dual", "dots-round", "dots-square", "lines", "cross"],
      }
    },
    template: `
      <div :style="tileGridStyle">
        <div v-for="variantName in variantNames" :key="variantName" :style="tileStyle">
          <div :style="stageStyle">
            <Spinner :variant="variantName" size="sm" />
          </div>
          <Paragraph size="sm" style="margin: 0;">{{ variantName }}</Paragraph>
        </div>
      </div>
    `,
  }),
}

export const AllSizes: Story = {
  render: () => ({
    components: { Paragraph, Spinner },
    setup() {
      return {
        stageStyle,
        tileGridStyle,
        tileStyle,
        sizeDefinitions: [
          { token: "xs", label: "16px" },
          { token: "sm", label: "24px" },
          { token: "md", label: "32px" },
          { token: "lg", label: "40px" },
        ],
      }
    },
    template: `
      <div :style="tileGridStyle">
        <div v-for="sizeDefinition in sizeDefinitions" :key="sizeDefinition.token" :style="tileStyle">
          <div :style="stageStyle">
            <Spinner :size="sizeDefinition.token" />
          </div>
          <Paragraph size="sm" style="margin: 0;">
            {{ sizeDefinition.token }} — {{ sizeDefinition.label }}
          </Paragraph>
        </div>

        <div :style="tileStyle">
          <div :style="stageStyle">
            <Spinner :size="56" />
          </div>
          <Paragraph size="sm" style="margin: 0;">custom — 56px</Paragraph>
        </div>
      </div>
    `,
  }),
}

export const ButtonLoadingTreatment: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <Button variant="primary" action="submit" loading>
          Loading…
        </Button>

        <Button variant="secondary" action="button" loading>
          Please wait
        </Button>
      </div>
    `,
  }),
}

export const EmptyStateTreatment: Story = {
  render: () => ({
    components: { Paragraph, Spinner },
    setup() {
      return {
        darkStagePanelStyle: `${darkStageStyle} min-width: 320px; min-height: 220px;`,
        darkSpinnerVars: {
          "--mw-spinner-indicator-color": "#5859fc",
        },
      }
    },
    template: `
      <div :style="darkStagePanelStyle">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
          <Spinner variant="dots-round" size="lg" decorative :style="darkSpinnerVars" />
          <Paragraph size="sm" style="margin: 0; color: #f9fafb;">Loading your data</Paragraph>
          <Paragraph size="sm" style="margin: 0; color: #a3a3a3;">
            This matches the centered empty-state treatment from the Spinner page.
          </Paragraph>
        </div>
      </div>
    `,
  }),
}
